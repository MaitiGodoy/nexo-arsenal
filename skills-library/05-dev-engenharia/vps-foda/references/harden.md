# Phase 5 — Security Hardening

Firewall, port lockdown, nginx, SSL, and dead services.

> **Read §5.2 before enabling any firewall.** Docker bypasses UFW — a server can look
> firewalled and still have every container port open to the internet.

---

## 5.1 System & firewall

```bash
# 1. Patch
apt update && apt upgrade -y

# 2. Remove desktop/print services that have no business on a server
systemctl disable --now cups cups-browsed avahi-daemon xrdp xrdp-sesman 2>/dev/null || true
apt remove --purge cups avahi-daemon xrdp -y 2>/dev/null

# 3. Firewall — ALLOW SSH FIRST, always
apt install -y ufw
ufw default deny incoming
ufw default allow outgoing
ufw limit 22/tcp          # rate-limited SSH — do this BEFORE enabling
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status verbose
```

> Enabling UFW without allowing 22 locks you out. Recovery requires the provider's web
> console. If you are not certain you can reach that console, do not run `ufw enable`.

Restrict any browser-based IDE (`code-server` and similar) to `127.0.0.1` and reach it
through an authenticated nginx proxy or an SSH tunnel — never expose it publicly.

---

## 5.2 Port lockdown (the part everyone gets wrong)

**Docker writes its own iptables rules and bypasses UFW.** A container published as
`ports: "8080:8080"` is reachable from the internet even with UFW denying everything.

### The rule

Only **22, 80, 443** may bind `0.0.0.0`. Everything else binds `127.0.0.1` and is
reached through the nginx reverse proxy.

```bash
# What is actually public right now
ss -tlnp | awk '{print $4}' | grep '^0.0.0.0:' | sort -t: -k2 -n
docker ps --format '{{.Names}}\t{{.Ports}}'
```

### Fixing each exposure

```yaml
# docker-compose.yml — before
ports:
  - "3002:80"
  - "8080:8080"

# after
ports:
  - "127.0.0.1:3002:80"
  - "127.0.0.1:8080:8080"
```

```nginx
# an nginx server block listening on an extra port — before
server { listen 8888;
# after
server { listen 127.0.0.1:8888;
```

Apply and recreate:

```bash
cd /root/projects/<stack> && docker compose up -d
# if the binding does not change, force recreation:
docker stop <svc> && docker rm <svc> && docker compose up -d <svc>
```

For containers created with raw `docker run`, convert them to compose first
(`organize.md` §4.4) rather than recreating by hand.

### Verify

```bash
PUB=$(ss -tlnp | awk '{print $4}' | grep '^0.0.0.0:' | grep -vE ':(22|80|443)$')
[ -z "$PUB" ] && echo "Port lockdown: PASS" || echo "STILL PUBLIC: $PUB"
```

---

## 5.3 nginx

```bash
# 1. Remove stale backups left by past edits
find /etc/nginx/ -name '*.bak*' -o -name '*.save' -o -name '*~' | head
# review, then: find /etc/nginx/ -name '*.bak*' -delete

# 2. Every proxy_pass must point at something that exists
grep -rh 'proxy_pass' /etc/nginx/sites-enabled/ | grep -oE '127.0.0.1:[0-9]+' | sort -u \
  | while read -r hp; do
      p=${hp##*:}
      ss -tln | grep -q ":$p " && echo "OK   $hp" || echo "DEAD $hp  <-- no listener"
    done

# 3. Validate and reload — never reload without testing
nginx -t && systemctl reload nginx
```

Consolidate repeated SSL and proxy-header blocks into `/etc/nginx/snippets/` and
`include` them, so a future change happens in one place.

Standard proxy block:

```nginx
location / {
    proxy_pass http://127.0.0.1:<port>;
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
}
```

---

## 5.4 SSL

```bash
# Renewal automation present?
systemctl list-timers | grep -i certbot
cat /etc/cron.d/certbot 2>/dev/null

# Days remaining on every certificate
for c in /etc/letsencrypt/live/*/; do
  n=$(basename "$c")
  e=$(openssl x509 -enddate -noout -in "${c}fullchain.pem" 2>/dev/null | cut -d= -f2)
  [ -n "$e" ] && echo "$n: $(( ($(date -d "$e" +%s) - $(date +%s)) / 86400 )) days"
done

certbot renew --dry-run     # prove renewal actually works
```

Certificates expiring in under 30 days with no working timer are an incident waiting
to happen. Wire expiry checks into the watchdog (`resilience.md` §6.3).

---

## 5.5 Dead systemd services

Services that fail forever consume CPU through restart loops and hide real failures.

```bash
systemctl list-units --type=service --state=failed
systemctl list-units --type=service --all | grep -E 'inactive|failed'
```

For each, decide: fix it, or remove it.

```bash
systemctl stop <svc> && systemctl disable <svc>
rm -f /etc/systemd/system/<svc>.service
systemctl daemon-reload
```

Common finds: a service trying to bind a port a container already owns; a unit pointing
at a binary that no longer exists; a leftover from a migration to Docker.

---

## 5.6 SSH hardening (optional, highest lockout risk)

Only with console access confirmed. Change one setting at a time and keep your current
session open while testing a second one.

```bash
# /etc/ssh/sshd_config
# PermitRootLogin prohibit-password    # keys only
# PasswordAuthentication no            # requires working key auth FIRST
# MaxAuthTries 3

sshd -t && systemctl reload ssh        # -t validates before reload
```

Test a **new** connection in a separate terminal before closing the existing one.

---

## 5.7 Verify

```bash
ufw status verbose | head -5
ss -tlnp | awk '{print $4}' | grep '^0.0.0.0:'       # only 22, 80, 443
nginx -t
systemctl list-units --type=service --state=failed
for c in /etc/letsencrypt/live/*/; do openssl x509 -enddate -noout -in "${c}fullchain.pem"; done
```
