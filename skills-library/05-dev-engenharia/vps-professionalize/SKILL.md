---
name: vps-professionalize
description: 12+ phase VPS professionalization — security hardening, Docker cleanup, directory organization, nginx standardization, unified backups, monitoring, and port lockdown for any Ubuntu 24.04 server with Docker containers running behind nginx
source: auto-skill
extracted_at: '2026-07-14T21:50:00.000Z'
---

# VPS Professionalization — 12-Phase System Hardening

Transform an amateur VPS setup (accumulated Docker stacks, no firewall, scattered configs, no security) into a professionally managed production server.

**Audience:** Solo devs / small teams who accumulated containers, services, and configs over months of prototyping — now need it stable, secure, and maintainable.

**Platform:** Ubuntu 24.04 LTS, Docker + Docker Compose, nginx as reverse proxy.

---

## Preflight

```bash
# Map what you have before touching anything
echo "=== OS ===" && cat /etc/os-release | head -3
echo "=== Disk ===" && df -h /
echo "=== Memory ===" && free -h
echo "=== Docker ===" && docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo "=== Ports ===" && ss -tlnp
echo "=== Hostname ===" && hostname && curl -s ifconfig.me
```

Save this info — you'll need it for rollback.

---

## Phase 1: Security Hardening

```bash
# 1. Apply all system updates
apt update && apt upgrade -y

# 2. Remove unnecessary services
systemctl disable --now cups cups-browsed avahi-daemon xrdp xrdp-sesman 2>/dev/null || true
apt remove --purge cups avahi-daemon xrdp -y

# 3. Install and configure UFW
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw limit 22/tcp        # SSH rate-limited
ufw allow 80/tcp         # HTTP
ufw allow 443/tcp        # HTTPS
# Add other ports only if they MUST be public (e.g. 8888 for an nginx that serves without the main one)
ufw enable
ufw status verbose

# 4. Restrict code-server or any IDE-in-browser to localhost
# Check: systemctl status code-server
# If present and not essential: bind to 127.0.0.1
```

**Check:** `ss -tlnp` should show only 22, 80, 443 on 0.0.0.0. UFW should show "active".

---

## Phase 2: Docker Optimization

```bash
# 1. Recover build cache space
docker system prune -af --filter "until=24h"

# 2. Remove dangling/anonymous volumes (verify first!)
docker volume ls -qf dangling=true | xargs -r docker volume rm

# 3. Configure global log rotation
cat > /etc/docker/daemon.json << 'EOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF
systemctl restart docker

# 4. Prune old images
docker image prune -af --filter "until=720h"  # 30 days
```

**Check:** `docker system df`. Log rotation: check `/var/lib/docker/containers/*/config.v2.json` has log-opts.

---

## Phase 3: Directory Structure

Organize `/root/` — move active projects, archive dead ones, create infra space.

**Target structure:**
```
/root/
├── projects/        # Active projects
│   ├── app1/
│   ├── app2/
│   └── ...
├── infra/           # Infrastructure scripts
│   ├── scripts/     # Shell utilities
│   ├── backup/      # Backup scripts + restore docs
│   └── monitoria/   # Watchdog, healthchecks
├── configs/         # Backup of critical configs
│   └── nginx/
├── reference/       # Study repos, forks
├── backups/         # Database dumps (consolidated)
└── archive/         # Dead/legacy projects
```

```bash
mkdir -p /root/{projects,infra/{scripts,backup,monitoria},configs/nginx,reference,backups,archive}
# Move active projects into projects/
# Move dead projects into archive/
# Move scripts into infra/scripts/
```

**Check:** `ls /root/` — clean structure, no loose files.

---

## Phase 4: Nginx Cleanup

```bash
# 1. Remove all .bak / old backup files
find /etc/nginx/ -name '*.bak*' -delete

# 2. Validate all site configs point to correct backend ports
#    (common mistake: container ports change, nginx config doesn't)
nginx -t

# 3. Standardize:
#    - Remove redundant listen directives (e.g., port 8888 already proxied via main site)
#    - Consolidate common snippets (SSL, proxy headers) into /etc/nginx/snippets/
#    - Check every proxy_pass points to a container that actually exists
```

**Check:** `nginx -t`. Curl every endpoint through the proxy. No stale `.bak` files.

---

## Phase 5: Unified Backup

```bash
# Create centralized backup script at /root/infra/backup/backup_all.sh
# Template for PostgreSQL containers:

backup_db() {
    local label="$1" container="$2" user="$3" db="$4" filename="${5:-${label}}"
    local file="$BACKUP_DIR/${filename}_${TIMESTAMP}.sql.gz"
    if docker exec "$container" pg_dump -U "$user" -d "$db" 2>/dev/null | gzip > "$file"; then
        local size=$(stat -c%s "$file" 2>/dev/null || echo 0)
        [ "$size" -lt 1024 ] && log "ALERTA: backup $label tem só ${size}B" || log "OK: $label ($(du -h "$file" | cut -f1))"
    else
        log "FALHA: backup $label"
    fi
}

# Schedule daily at 03:30 via crontab:
# 30 3 * * * /root/infra/backup/backup_all.sh
# Keep 14 days: find "$BACKUP_DIR" -name '*.sql.gz' -mtime +14 -delete

# Document restore procedure in RESTORE.md
```

**Check:** Run the script. Verify a dump file has content. Test restore on one database.

---

## Phase 6: Professional Monitoring

### 6a. Watchdog Script (`/root/infra/scripts/vps_watchdog.sh`)

A bash-only watchdog that runs every 5min via cron — no API costs. Cover:

1. **Crash-loop detection:** `docker ps --filter "status=restarting"` → stop + start the container
2. **Core service restart:** Check named containers for "Exited" status → `docker start`
3. **WhatsApp reconnection loop detection:** grep evolution-api logs for error patterns → logout instance
4. **Emergency disk cleanup:** `df /` > 85% → `docker system prune -af`
5. **Memory alert:** `free -m` > 90% → log event
6. **Recently restarted containers:** Check `RunningFor` < 60s
7. **SSL expiry:** Check `openssl x509 -enddate` on each cert, alert <30 and <14 days

Record events via a lightweight database writer (e.g., `python3 -m backend.tools.vps_events add --severity x --source y --message z`) so an AI agent can query them later without API cost.

### 6b. Healthcheck Endpoint

```nginx
# /etc/nginx/sites-available/health
server {
    listen 127.0.0.1:81;
    server_name _;
    location /health {
        access_log off;
        add_header Content-Type text/plain;
        return 200 "OK\n";
    }
}
```

**Check:** `curl http://127.0.0.1:81/health` → "OK". Watchdog logs show no errors.

---

## Phase 7: Remove Dead Systemd Services

Search for services that:
- Try to bind to ports already used by Docker containers
- Reference binaries that don't exist
- Are stuck in `auto-restart` loop

```bash
find /etc/systemd/system/ -name '*.service' | while read f; do
    name=$(basename "$f")
    if ! systemctl is-active "$name" &>/dev/null; then
        echo "INACTIVE: $name"
    fi
done
# Check each one — if dead, remove:
# systemctl stop <service> && systemctl disable <service> && rm -f <unit-file>
# systemctl daemon-reload
```

**Check:** `systemctl list-units --type=service --all | grep -E 'inactive|failed'` — only expected ones.

---

## Phase 8: Docker Compose Healthchecks

Add `healthcheck:` blocks to every service that doesn't have one:

```yaml
# PostgreSQL
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 5s
  timeout: 5s
  retries: 5

# Web service (Python/FastAPI)
healthcheck:
  test: ["CMD", "python3", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:PORT/health'); exit(0 if True else 1)"]
  interval: 15s
  timeout: 5s
  retries: 3
  start_period: 10s

# Node.js
healthcheck:
  test: ["CMD", "node", "-e", "fetch('http://localhost:PORT/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
  interval: 15s
  timeout: 5s
  retries: 3

# nginx / static
healthcheck:
  test: ["CMD", "wget", "--spider", "http://localhost:80"]
  interval: 30s
  timeout: 10s
  retries: 3
```

Ensure every service has `restart: unless-stopped`.

---

## Phase 9: Remove Loose Files

```bash
# Check /root/ for loose files that should be archived or deleted
# Common candidates:
# - *.py, *.js test scripts
# - skills.zip, skills.zi
# - standalone .env files outside projects
# - large text outputs (*.txt, *.md)
# - standalone HTML files
# - old screenshots / screen recordings
# Move anything useful to archive/ or configs/, delete the rest
```

---

## Phase 10: Secrets Management

```bash
# 1. Fix permissions on all .env files
find /root/projects/ -name '.env' -o -name '.env.*' | grep -v node_modules | grep -v '.example' | xargs -r chmod 600

# 2. Verify .env is in .gitignore in every project
for d in /root/projects/*/; do
    [ -f "${d}.gitignore" ] && grep -q '.env' "${d}.gitignore" || echo "MISSING: ${d}.gitignore no .env entry"
done
```

---

## Phase 11: SSL Verification

```bash
# 1. Check certbot setup
systemctl list-timers | grep certbot
cat /etc/cron.d/certbot 2>/dev/null

# 2. Verify certificates
for cert in /etc/letsencrypt/live/*/; do
    name=$(basename "$cert")
    expiry=$(openssl x509 -enddate -noout -in "${cert}fullchain.pem" | cut -d= -f2)
    days=$(( ($(date -d "$expiry" +%s) - $(date +%s)) / 86400 ))
    echo "$name: expires $expiry ($days days)"
done

# 3. Add SSL monitoring to watchdog (Phase 6)
```

---

## Phase 12: Port Lockdown

**CRITICAL:** Docker publishes ports directly to iptables, **bypassing UFW**. A container with `ports: "8080:8080"` is publicly accessible even with UFW denying everything.

### The Rule

Only 22, 80, and 443 should bind to `0.0.0.0`. Everything else must bind to `127.0.0.1`. Applications behind nginx stay accessible via the proxy.

### How to fix

For every port exposed by `docker ps` or `ss -tlnp`:

1. **Already has nginx proxy?** → Change `"8080:8080"` → `"127.0.0.1:8080:8080"` in docker-compose.yml
2. **No nginx proxy?** → Either add an nginx location or bind to 127.0.0.1 + add nginx if needed
3. **nginx itself on a separate port** (e.g., `listen 8888`) → Change to `listen 127.0.0.1:8888` if it's also proxied through the main nginx

```yaml
# docker-compose.yml — before
ports:
  - "3002:80"
  - "8080:8080"

# After
ports:
  - "127.0.0.1:3002:80"
  - "127.0.0.1:8080:8080"
```

```nginx
# nginx site config — before
server {
    listen 8888;

# After
server {
    listen 127.0.0.1:8888;
```

For containers created via `docker run` (no compose), remove and recreate:
```bash
docker stop container-name && docker rm container-name
docker run -d \
  --name container-name \
  --restart unless-stopped \
  -p 127.0.0.1:PORT:CONTAINER_PORT \
  # ... other options
  image:tag
```

To restart changed compose stacks:
```bash
cd /path/to/stack && docker compose up -d
# If port binding doesn't update, force recreate:
docker stop service-name && docker rm service-name
docker compose up -d service-name
```

**Final check:**
```bash
ss -tlnp | awk '{print $4}' | grep '^0.0.0.0:' | sort -t: -k2 -n
# Should show ONLY: 0.0.0.0:22, 0.0.0.0:80, 0.0.0.0:443
```

---

## Phase 13: Final Verification

```bash
# 1. nginx config
nginx -t && systemctl reload nginx

# 2. All containers healthy
docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -v 'healthy\|Up' && echo "WARNING: unhealthy containers" || echo "OK: all containers healthy"

# 3. UFW active
ufw status verbose | grep -q active && echo "UFW active" || echo "UFW NOT ACTIVE"

# 4. Key endpoints responding
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/
curl -s -o /dev/null -w "%{http_code}" https://yourdomain.com/health/
curl -s http://127.0.0.1:81/health

# 5. No unexpected public ports
PUBLIC_PORTS=$(ss -tlnp | awk '{print $4}' | grep '^0.0.0.0:' | grep -vE ':(22|80|443)$')
[ -z "$PUBLIC_PORTS" ] && echo "Port lockdown: PASS" || echo "EXTRA PUBLIC PORTS: $PUBLIC_PORTS"

# 6. Backup works
/root/infra/backup/backup_all.sh
```

---

## Rollback Procedures

### Per Phase
If something breaks mid-phase, the fix is usually the reverse operation:
- **UFW broke SSH:** Connect via VPS console → `ufw disable` → fix rules → `ufw enable`
- **Docker restart killed containers:** They auto-start if `restart: unless-stopped` is set
- **Wrong nginx config:** `nginx -t` will catch syntax errors before reload
- **Moved file broke a path:** Symlink from new location to old, or move back

### Full Rollback
```bash
# Restore nginx from backup
cp /root/configs/nginx/* /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx

# Restore database from backup
gunzip -c /root/backups/daily/<latest> | docker exec -i <container> psql -U <user> -d <db>
```

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
