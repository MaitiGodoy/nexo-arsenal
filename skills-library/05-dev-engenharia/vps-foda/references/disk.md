# Phase 2 — Disk Forensics

Find what is *actually* consuming the disk, prove it is dead, reclaim it, prevent regrowth.

---

## 2.1 Locate (top-down, iteratively)

```bash
du -h -d1 -x / 2>/dev/null | sort -rh | head -20
```

Drill into the largest entry, one level at a time, until you hit the culprit:

```bash
du -h -d1 -x /var 2>/dev/null | sort -rh | head -15
du -h -d1 -x /var/lib 2>/dev/null | sort -rh | head -15
```

### Three traps that hide gigabytes

| Trap | Symptom | Fix |
|---|---|---|
| **Globs skip dotfiles** | `du -sh /root/*` reports 5 GB but `/root` is 13 GB | Use `du -h -d1 /root` — never `/path/*` for accounting |
| **Docker is not in `/var/lib/docker`** | That dir shows ~1 GB while the host is full | Modern Docker stores images in **`/var/lib/containerd`**. Always check both |
| **`du -d2` times out on large trees** | Hangs, or exits 124 | Stay at `-d1` and iterate. Always pass `-x` so you do not cross filesystems |

### Hunt large individual files

Directory totals miss a single monster file.

```bash
find / -xdev -type f -size +200M -exec ls -lh {} \; 2>/dev/null \
  | awk '{print $5, $9}' | sort -rh | head -20
```

> **Never delete `/swapfile`** or any active swap despite its size.
> Verify with `swapon --show` before touching any large file at `/`.

### Inode exhaustion

"No space left on device" while `df -h` shows free space means you ran out of inodes.

```bash
df -i /
find / -xdev -type f 2>/dev/null | cut -d/ -f2-3 | sort | uniq -c | sort -rn | head
```

Usual causes: mail queues, PHP/Node session files, cache shards, millions of tiny logs.

---

## 2.2 Waste catalog

Match findings against this table. Sizes are typical field observations, not limits.

| Pattern | Where | Typical | Tier |
|---|---|---|---|
| **Snap download cache** | `/var/lib/snapd/cache` | 1–5 GB | 🟢 |
| Disabled snap revisions | `snap list --all \| grep disabled` | 0.5–3 GB | 🟢 |
| **Docker build cache** | `docker system df` → Build Cache | 1–10 GB | 🟢 |
| Dangling images / volumes | `docker images -f dangling=true` | varies | 🟢 |
| npm cache | `~/.npm` | 1–4 GB | 🟢 |
| pip / uv / yarn cache | `~/.cache/{pip,uv,yarn}` | 0.3–2 GB | 🟢 |
| Playwright / Puppeteer browsers | `~/.cache/ms-playwright` | 0.5–1.5 GB | 🟢 |
| Agent/CLI tool caches | `~/.<tool>/{updates,downloads,cache}` | 0.2–1 GB | 🟢 |
| APT archives | `/var/cache/apt/archives` | 0.1–2 GB | 🟢 |
| Journal logs | `/var/log/journal` | 0.1–4 GB | 🟢 |
| **GPU libs on a GPU-less host** | `.../dist-packages/{nvidia,triton,torch}` | 3–5 GB | 🟡 |
| **Orphaned data dirs** | vector stores, old upload/app dirs | 1–10 GB | 🟡 |
| Manual backups | `*.tar.gz`, `*_backup_<date>`, `*.bak.<ts>` | varies | 🟡 |
| Virtualenv / node_modules outside containers | `<project>/.venv` | 0.5–2 GB | 🟡 |
| Superseded project copies | `<project>.bak.<timestamp>/` | varies | 🟡 |

**Tiers:** 🟢 regenerable cache, delete freely · 🟡 permanent, delete only after §2.3
proof · 🔴 live or unknown, do not delete. **When ambiguous, treat as 🔴.**

### GPU libraries on a GPU-less host

`pip install torch` pulls the entire CUDA stack by default. On a server with no GPU,
`nvidia-*`, `triton`, and the CUDA build of `torch` are dead weight.

```bash
lspci 2>/dev/null | grep -i nvidia || echo "NO GPU — CUDA packages are unusable"
du -h -d1 /usr/local/lib/python3*/dist-packages 2>/dev/null | sort -rh | head
```

Prefer replacing with the CPU-only wheel over deleting package directories piecemeal:
`pip install torch --index-url https://download.pytorch.org/whl/cpu`

---

## 2.2b Redundant manual-backup snapshot hunt

Tools (including this skill's own Phase 0/4 safety copies) leave timestamped snapshot
dirs behind — `pre-organizacao-<date>/`, `.nexo-backup-<ts>/`, `<name>_backup_<date>.tar.gz`.
Nothing prunes these automatically, so they accumulate indefinitely and are a common
multi-GB win that the 🟢/🟡 catalog above treats as "one item" when it is often a dozen.

```bash
# Group snapshot-looking names by their stem (strip the trailing date/timestamp)
find /root /root/backups /opt -maxdepth 2 \( -type d -o -name '*.tar.gz' \) 2>/dev/null \
  | grep -E '_?(backup|bak|snapshot|pre-organiza)[_-]?[0-9]{6,}' \
  | sed -E 's/[_-][0-9]{6,}.*$//' | sort | uniq -c | sort -rn
```

For each stem with more than one match:

```bash
# List every snapshot for that stem, oldest first, with size
ls -dt --time-style=+%F /root/backups/<stem>* 2>/dev/null | tac | xargs -r du -sh
```

| Finding | Action |
|---|---|
| N snapshots of the same stem, all from before the most recent successful sync/push | Keep the newest 2–3, confirm the rest with the operator, then delete |
| A snapshot dir whose content is fully pushed to a git remote (verify: `git log` on the remote copy has the same or later commit) | Safe to delete after keeping just one — it's redundant with git history |
| Snapshot created by *this session* moments ago as a safety copy before a risky op | Keep until the op is verified successful; do not sweep it in the same run that created it |

**Never delete the single most recent snapshot of anything** — that is the last resort
if the live copy breaks. Always leave at least one.

---

## 2.2c Developer toolchain cache sweep

Beyond npm/pip/yarn in the catalog above, language toolchains accumulate caches that
`docker system df` and `du -d1` both under-report because they hide inside dotfiles.
Adapted from the equivalent `DeveloperCleanup` sweep in the Windows sibling skill
(`pc-foda`) — same idea, Linux paths.

```bash
du -sh ~/.gradle/caches ~/.m2/repository ~/.cargo/registry \
      ~/.cache/JetBrains ~/.cache/huggingface ~/.rustup/toolchains \
      ~/.cache/go-build ~/.local/share/pnpm/store 2>/dev/null
```

| Cache | Path | Typical | Tier |
|---|---|---|---|
| Gradle | `~/.gradle/caches` | 0.5–3 GB | 🟢 |
| Maven | `~/.m2/repository` | 0.3–2 GB | 🟢 |
| Cargo registry | `~/.cargo/registry` | 0.2–1.5 GB | 🟢 |
| Go build cache | `~/.cache/go-build` | 0.2–1 GB | 🟢 |
| JetBrains IDE caches | `~/.cache/JetBrains` | 0.5–2 GB | 🟢 |
| HuggingFace model cache | `~/.cache/huggingface` | 1–20 GB (can dwarf everything else) | 🟡 — check which models are still referenced before wiping |
| pnpm store | `~/.local/share/pnpm/store` | 0.3–2 GB | 🟢 |
| Docker buildx cache (separate from `builder prune`) | `docker buildx du` | 1–8 GB | 🟢 |

Reclaim the 🟢 row in one pass, same ascending-risk order as §2.4:

```bash
gradle --stop 2>/dev/null; rm -rf ~/.gradle/caches/*
rm -rf ~/.cargo/registry/cache ~/.cache/go-build ~/.cache/JetBrains
docker buildx prune -af
```

`~/.cache/huggingface` is the one exception worth pausing on — a single model
checkpoint can be several GB, and unlike package caches it is not automatically
re-downloadable without re-running whatever pulled it. Cross-check
`find ~/.cache/huggingface -maxdepth 3 -mtime -30` before deleting anything inside it.

---

## 2.3 Prove death before deleting

Run against every 🟡 candidate. Delete only when **all** applicable checks are clean.

```bash
TARGET=/path/to/candidate
[ -n "$TARGET" ] && [ -d "$TARGET" ] || { echo "unsafe target"; exit 1; }

# 1. Any process holding files inside it?
lsof +D "$TARGET" 2>/dev/null | head

# 2. Mounted into a running container?
docker ps -q | xargs -r docker inspect \
  --format '{{.Name}}: {{range .Mounts}}{{.Source}} {{end}}' 2>/dev/null | grep "$TARGET"

# 3. Referenced by a service, timer, or job?
grep -rl "$TARGET" /etc/systemd/system/ /etc/cron* 2>/dev/null
crontab -l 2>/dev/null | grep "$TARGET"

# 4. Referenced by any compose file?
find / -xdev -name 'docker-compose*.y*ml' 2>/dev/null | xargs -r grep -l "$TARGET"

# 5. How stale is it really?
find "$TARGET" -type f -mtime -7 2>/dev/null | head
ls -la "$TARGET"
```

### Reading the evidence

| Finding | Verdict |
|---|---|
| All checks empty, mtime weeks old | Confirmed orphan → delete |
| Owned by a container currently `Up` | 🔴 **Live state.** A large sandbox/workspace belonging to a running agent or job is not garbage |
| Created within hours | 🔴 Something is using it right now |
| `*.bak`/`*_backup_<date>` with a current version beside it | 🟡 Superseded backup |
| You cannot explain what created it | 🔴 Leave it, report it |

> **Container-owned data is the most common near-miss.** Always cross-check
> `docker ps` before deleting anything under a tool's home directory
> (`~/.<tool>/sandboxes`, `~/.<tool>/workspaces`).

---

## 2.4 Reclaim (ascending risk)

Work 🟢 first. It is often enough, and it buys margin before you take any risk.

```bash
# --- Docker ---
docker builder prune -af                        # build cache, commonly multi-GB
docker image prune -af --filter "until=720h"
docker volume ls -qf dangling=true              # REVIEW this list before removing
docker system prune -af --filter "until=24h"

# --- Snap (often the single biggest win) ---
rm -rf /var/lib/snapd/cache/*
snap list --all | awk '/disabled/{print $1, $3}' | \
  while read -r n r; do snap remove "$n" --revision="$r"; done

# --- Package manager caches ---
npm cache clean --force 2>/dev/null
rm -rf ~/.cache/pip ~/.cache/uv ~/.cache/yarn
apt-get clean

# --- Logs ---
journalctl --vacuum-size=200M
```

Then tool caches, then proven 🟡 orphans **one at a time**.

**Re-check `df -h /` between batches.** If space does not move as expected, stop and
investigate rather than deleting more.

---

## 2.5 Prevent regrowth

Reclaimed space refills unless the source is capped. Minimum for a Docker host:

```bash
# Docker log rotation
cat > /etc/docker/daemon.json <<'EOF'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
EOF
systemctl restart docker        # confirm timing first — this restarts containers

# Journal cap
sed -i 's/^#\?SystemMaxUse=.*/SystemMaxUse=1G/' /etc/systemd/journald.conf
systemctl restart systemd-journald

# Snap retention
snap set system refresh.retain=2

# Weekly cleanup cron — WITHOUT THIS, any host that builds images refills
( crontab -l 2>/dev/null; echo "0 4 * * 0 docker builder prune -af >/dev/null 2>&1" ) | crontab -
```

The missing weekly prune is the single most common reason a cleanup "did not last".
Field-verified: a freshly cleaned host regrew 3 GB in 30 minutes after one image build.
