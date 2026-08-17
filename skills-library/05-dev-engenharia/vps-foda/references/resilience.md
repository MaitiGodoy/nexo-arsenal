# Phase 6 — Backups, Monitoring & Prevention

Do this **last**, so it monitors the final state rather than the mess you started with.

A backup that has never been restored is not a backup. A monitor nobody reads is not
monitoring. Both are verified here.

---

## 6.1 Unified backup

One script, one schedule, one directory, with retention and size validation.

`/root/infra/backup/backup_all.sh`:

```bash
#!/usr/bin/env bash
set -uo pipefail

BACKUP_DIR=/root/backups/daily
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETAIN_DAYS=14
mkdir -p "$BACKUP_DIR"

log() { echo "[$(date '+%F %T')] $*" >> "$BACKUP_DIR/backup_all.log"; }

backup_db() {
    local label="$1" container="$2" user="$3" db="$4"
    local file="$BACKUP_DIR/${label}_${TIMESTAMP}.sql.gz"
    if docker exec "$container" pg_dump -U "$user" -d "$db" 2>/dev/null | gzip > "$file"; then
        local size; size=$(stat -c%s "$file" 2>/dev/null || echo 0)
        if [ "$size" -lt 1024 ]; then
            log "ALERT: $label backup is only ${size}B — treat as FAILED"
        else
            log "OK: $label ($(du -h "$file" | cut -f1))"
        fi
    else
        log "FAILED: $label"
    fi
}

backup_files() {   # for app data that is not in a database
    local label="$1" path="$2"
    tar czf "$BACKUP_DIR/${label}_${TIMESTAMP}.tar.gz" -C "$(dirname "$path")" \
        "$(basename "$path")" 2>/dev/null \
        && log "OK: $label files" || log "FAILED: $label files"
}

# --- one line per database ---
backup_db app     app-postgres     postgres app
# backup_db other other-postgres   postgres other
# backup_files uploads /root/projects/app/uploads

find "$BACKUP_DIR" -name '*.gz' -mtime +$RETAIN_DAYS -delete
log "run complete"
```

```bash
chmod +x /root/infra/backup/backup_all.sh
( crontab -l 2>/dev/null; echo "30 3 * * * /root/infra/backup/backup_all.sh" ) | crontab -
```

### A backup is not real until restored

Write `/root/infra/backup/RESTORE.md` with the exact command per database, then
**test one restore into a scratch database**:

```bash
docker exec -i <container> psql -U <user> -c "CREATE DATABASE restore_test;"
gunzip -c /root/backups/daily/<file>.sql.gz | docker exec -i <container> psql -U <user> -d restore_test
docker exec -i <container> psql -U <user> -d restore_test -c "\dt"     # tables present?
docker exec -i <container> psql -U <user> -c "DROP DATABASE restore_test;"
```

Backups whose size suddenly drops (e.g. 129 MB yesterday, 22 MB today) signal a failing
dump or data loss — the size check above catches the zero case, but review the trend too.

---

## 6.2 Healthchecks

Every service needs one, and **a healthcheck that always fails is worse than none** —
it spawns a process on every interval, burning CPU forever while telling you nothing.

```yaml
# PostgreSQL
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5

# Python / FastAPI
healthcheck:
  test: ["CMD", "python3", "-c", "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://localhost:<PORT>/health').status==200 else 1)"]
  interval: 30s
  timeout: 5s
  retries: 3
  start_period: 20s

# Node
healthcheck:
  test: ["CMD", "node", "-e", "fetch('http://localhost:<PORT>/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
  interval: 30s
  timeout: 5s
  retries: 3

# nginx / static
healthcheck:
  test: ["CMD", "wget", "--spider", "-q", "http://localhost:80/"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Audit existing ones — a large `FailingStreak` means it has been broken for days:

```bash
docker ps -a --filter health=unhealthy --format '{{.Names}}'
docker inspect --format '{{.Name}} streak={{.State.Health.FailingStreak}}' <container>
docker inspect --format '{{json .State.Health.Log}}' <container> | head -c 500
```

Verify the port and path the check targets actually serve. `Connection refused` inside
the container usually means the check points at the wrong port, not that the app is down.

Every service should also carry `restart: unless-stopped`.

---

## 6.3 Watchdog

Bash-only, cron-driven, no API cost. `/root/infra/monitoring/watchdog.sh`, every 5 min:

```bash
#!/usr/bin/env bash
LOG=/var/log/vps-watchdog.log
alert() { echo "[$(date '+%F %T')] $*" >> "$LOG"; }

# 1. Crash loops
docker ps --filter "status=restarting" --format '{{.Names}}' | while read -r c; do
  alert "RESTART LOOP: $c"; docker stop "$c" && docker start "$c"
done

# 2. Exited containers that should be running
docker ps -a --filter "status=exited" --format '{{.Names}} {{.Status}}' | while read -r c s; do
  case "$s" in *"(137)"*) alert "OOM-KILLED: $c — memory limit too low or leak" ;;
                       *) alert "EXITED: $c ($s)" ;; esac
done

# 3. Disk emergency
USE=$(df / | awk 'NR==2{gsub("%","",$5); print $5}')
[ "$USE" -gt 85 ] && { alert "DISK ${USE}% — pruning"; docker builder prune -af >/dev/null 2>&1; }

# 4. Memory / swap
MEM=$(free | awk '/^Mem:/{printf "%.0f", $3/$2*100}')
SWP=$(free | awk '/^Swap:/{ if ($2>0) printf "%.0f", $3/$2*100; else print 0 }')
[ "$MEM" -gt 90 ] && alert "MEMORY ${MEM}%"
[ "$SWP" -gt 80 ] && alert "SWAP ${SWP}% — memory over-commit"

# 5. CPU throttling by the provider
command -v sar >/dev/null && {
  ST=$(sar -u 1 3 | awk '/Average/{printf "%.0f", $6}')
  [ "${ST:-0}" -gt 2 ] && alert "CPU STEAL ${ST}% — provider throttling"
}

# 6. Load
CORES=$(nproc); L=$(awk '{printf "%.0f", $2}' /proc/loadavg)
[ "$L" -gt $((CORES * 2)) ] && alert "LOAD $L on $CORES cores"

# 7. Certificate expiry
for c in /etc/letsencrypt/live/*/; do
  e=$(openssl x509 -enddate -noout -in "${c}fullchain.pem" 2>/dev/null | cut -d= -f2)
  [ -n "$e" ] && { d=$(( ($(date -d "$e" +%s) - $(date +%s)) / 86400 ))
    [ "$d" -lt 30 ] && alert "SSL $(basename "$c") expires in ${d}d"; }
done

# 8. Unhealthy containers
docker ps --filter health=unhealthy --format '{{.Names}}' | while read -r c; do
  alert "UNHEALTHY: $c"
done
```

```bash
chmod +x /root/infra/monitoring/watchdog.sh
( crontab -l 2>/dev/null; echo "*/5 * * * * /root/infra/monitoring/watchdog.sh" ) | crontab -
```

Route alerts wherever you will actually see them (webhook, email, chat). An unread log
file is not monitoring. Add a weekly `tail` of the log to your routine at minimum.

Optional local health endpoint for uptime checks:

```nginx
server {
    listen 127.0.0.1:81;
    location /health { access_log off; return 200 "OK\n"; }
}
```

---

## 6.4 Prevention checklist

The configs that stop each problem from returning. Verify all six.

```bash
# 1. Docker log rotation — unbounded logs fill disks silently
cat > /etc/docker/daemon.json <<'EOF'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
EOF
systemctl restart docker      # restarts containers — confirm the timing first

# 2. Journal cap
sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=1G/' /etc/systemd/journald.conf
systemctl restart systemd-journald

# 3. Snap retention (old revisions accumulate GBs)
snap set system refresh.retain=2

# 4. Weekly build-cache prune — without this, any building host refills
( crontab -l 2>/dev/null; echo "0 4 * * 0 docker builder prune -af >/dev/null 2>&1" ) | crontab -

# 5. Swappiness — prefer dropping cache over swapping
echo "vm.swappiness=10" > /etc/sysctl.d/99-swap.conf && sysctl -p /etc/sysctl.d/99-swap.conf

# 6. Unattended security updates
apt install -y unattended-upgrades && dpkg-reconfigure -plow unattended-upgrades
```

Plus, from `cpu-memory.md` §3.2: **every container has a CPU and memory limit.**
That is the prevention layer for throttling and OOM.

---

## 6.5 Verify

```bash
/root/infra/backup/backup_all.sh && ls -lh /root/backups/daily | tail -5
tail -20 /var/log/vps-watchdog.log
crontab -l
cat /etc/docker/daemon.json
docker ps --filter health=unhealthy --format '{{.Names}}'   # should be empty
```

Success: a dump exists with real content, one restore has been tested, the watchdog log
shows a clean run, and every prevention config from §6.4 is in place.
