---
name: nexo-vps-foda
description: Complete professional operations for any Linux VPS or server — diagnose and fix disk exhaustion, CPU throttling, memory/swap pressure; find duplicate/redundant project copies and stale backups across multiple deploy roots (/root/projects, /opt, ad-hoc paths); organize sprawling projects into clean containerized stacks; harden security, ports, nginx and SSL; install backups, healthchecks and monitoring. Use when a server is full, slow, throttled, disorganized, unhardened, or has drifted into duplicate/untouched-for-ages project copies. Triggers: "disk is full", "no space left on device", "CPU limit reached", "server is slow", "high load", "swap is full", "OOM killed", "clean up the server", "organize the VPS", "harden the server", "find duplicate projects", "find old unused backups", "limpar a vps", "o disco encheu", "cpu estourada", "vps lenta", "profissionalizar a vps", "tem coisa duplicada", "backup inútil", "coisa velha parada na vps".
version: 1.2.0
---

# VPS Operations — Professional Server Remediation

Take a server from *accumulated prototype sprawl* to *professionally operated
production* — without breaking what is running on it.

**Audience:** solo devs, agencies, and small teams whose VPS grew organically for
months and now has full disks, throttled CPU, exhausted swap, dozens of unlimited
containers, loose files everywhere, and no firewall.

**Platform:** any Linux server (Ubuntu/Debian primary), with or without Docker.
**Access:** root or sudo, over SSH.

This skill routes to focused references. **Load only the phase you need.**

| Phase | Symptom | Reference |
|---|---|---|
| 2 | Disk full, "no space left on device", redundant manual backups | `references/disk.md` (§2.2b hunts redundant timestamped backup snapshots specifically) |
| 3 | CPU throttled, high load, swap full, OOM | `references/cpu-memory.md` |
| 4 | Loose files, duplicate/stale project copies, chaos in `/root` | `references/organize.md` — §4.0 multi-location duplication audit, §4.0b no-remote/no-doc sweep, §4.0c fleet-map refresh, §4.0d staleness sweep (old-untouched-item report), §4.0e content-hash duplicate hunt |
| 5 | No firewall, public ports, stale nginx, SSL unknown | `references/harden.md` |
| 6 | No backups, no healthchecks, nothing watching | `references/resilience.md` |

---

## Risk by phase

Ported from `pc-foda`'s per-mode risk table — same idea, mapped to this skill's phases.
Higher tier = confirm with the operator and prefer a dry pass (`echo`/`--dry-run` where
the tool supports it) before executing for real.

| Phase | What it does | Risk |
|---|---|---|
| 0 — Baseline | Read-only capture, config backup | 🟢 Low |
| 1 — Triage | Read-only diagnostics | 🟢 Low |
| 2 — Disk | Cache/build-artifact deletion, proven-dead 🟡 orphan removal | 🟡 Medium |
| 3 — CPU/RAM | Container resource limits, service restarts | 🟡 Medium (restarts containers) |
| 4 — Organize | Moving/merging/deleting duplicate project trees | 🔴 High (do it with margin available) |
| 5 — Harden | Firewall rules, nginx reload | 🔴 High (firewall can lock you out) |
| 6 — Resilience | Install backup/monitoring cron, no destructive ops | 🟢 Low |

---

## Core Doctrine

These five rules govern every phase. They are what separate an audit from an outage.

1. **Measure before you touch.** Never act on a guess about what is big or slow.
2. **Prove it is dead before you kill it.** "Looks old" is not evidence. Evidence is
   `lsof`, `docker inspect`, `grep` in systemd/cron/compose, and mtime.
3. **Baseline health first.** Record what is *already* broken before you start, or
   you inherit blame for a pre-existing failure.
4. **Remediation without prevention is theatre.** If the source is not capped, the
   problem returns. Field-verified: a cleaned server regrew 3 GB in 30 minutes from
   Docker build cache alone.
5. **Never change what you cannot roll back.** Capture config before editing it.

---

## Phase 0 — Baseline & Safety (never skip)

Capture the "before" state. This protects you and becomes the first half of the report.

```bash
echo "=== HOST ==="; hostname; cat /etc/os-release | head -2; uptime
echo "=== CPU ===";  nproc --all; cat /proc/loadavg
echo "=== MEM ===";  free -h
echo "=== DISK ==="; df -h /; df -i /
echo "=== DOCKER ==="; docker ps -a --format '{{.Names}}: {{.Status}}' 2>/dev/null | sort
echo "=== PORTS ==="; ss -tlnp
echo "=== FIREWALL ==="; ufw status 2>/dev/null | head -3
```

Save this output. Explicitly record every container already `unhealthy`,
`restarting`, or `Exited`. **Pre-existing failures are not yours — undocumented
ones become yours.**

Instead of copy-pasting the block above by hand, `scripts/triage.sh` runs it in one
shot and also writes a structured JSON snapshot (adapted from `pc-foda`'s
`Athena-Log.json` pattern) to `/root/vps-foda-logs/baseline-<timestamp>.json` — this
is the real before/after proof for Phase 7, not console text pasted from memory:

```bash
bash "$HOME_CLAUDE/skills/vps-foda/scripts/triage.sh"
```

It is read-only — no deletes, no restarts — safe to run any time, including as the
Phase 7 "after" snapshot to diff against the Phase 0 baseline.

Before editing any config, back it up:

```bash
mkdir -p /root/configs/$(date +%Y%m%d)
cp -a /etc/nginx/sites-available /root/configs/$(date +%Y%m%d)/ 2>/dev/null
cp -a /etc/docker/daemon.json /root/configs/$(date +%Y%m%d)/ 2>/dev/null
```

---

## Phase 1 — Triage: which resource is actually the problem?

Run the full battery, then follow the decision tree. Do not assume the reported
symptom is the real constraint — a full swap presents as "high CPU", and inode
exhaustion presents as "disk full" while `df -h` shows free space.

```bash
# --- DISK ---
df -h /; df -i /
du -h -d1 -x / 2>/dev/null | sort -rh | head -10

# --- CPU ---
nproc --all; cat /proc/loadavg
top -bn1 | grep '^%Cpu'
sar -u 2>/dev/null | tail -15          # hourly history — the money shot

# --- MEMORY ---
free -h
journalctl --since "7 days ago" 2>/dev/null | grep -ci "oom\|killed process"

# --- PRESSURE (which resource is stalling tasks) ---
cat /proc/pressure/cpu /proc/pressure/memory /proc/pressure/io 2>/dev/null

# --- GOVERNANCE ---
docker ps -q | xargs -r docker inspect \
  --format '{{.Name}} cpu={{.HostConfig.NanoCpus}} mem={{.HostConfig.Memory}}' 2>/dev/null
```

### Decision tree

| Reading | Meaning | Go to |
|---|---|---|
| `df -h` ≥ 85% | Space exhaustion | **Phase 2** — `references/disk.md` |
| `df -i` IUse% high, `df -h` fine | Inode exhaustion (millions of small files) | **Phase 2** |
| `steal` > 2% in `sar`, rising with `user` | **Provider is throttling you** | **Phase 3** — `references/cpu-memory.md` |
| loadavg > cores, `pressure/cpu some` > 10 | Real CPU contention | **Phase 3** |
| Swap used ≈ swap total | Memory over-commit | **Phase 3** |
| Many containers with `cpu=0 mem=0` | No resource governance — root cause of most spikes | **Phase 3** |
| Loose files in `/root`, apps outside Docker | Organizational debt | **Phase 4** — `references/organize.md` |
| UFW inactive, ports on `0.0.0.0` | Security exposure | **Phase 5** — `references/harden.md` |
| No backup cron, no healthchecks | No resilience | **Phase 6** — `references/resilience.md` |

### The two readings people misinterpret

- **`steal` time is the provider throttling you, not a busy neighbour** (on most
  managed VPS plans). If `steal` climbs *in step with* your own `user` CPU, you are
  exceeding your plan's fair-use quota and the hypervisor is taking cycles back.
  A control panel saying "CPU limit reached" is this. The fix is capping your own
  workload — see Phase 3 — not buying more CPU, unless the baseline itself is high.
- **`docker system df` reporting large images with `0B` reclaimable is correct.**
  Those images back running containers. That space is legitimately in use.

---

## Recommended execution order

When doing a full professionalization rather than fixing one symptom:

```
Phase 0  Baseline & backup configs
Phase 2  Disk        → buys margin for everything else; lowest risk
Phase 3  CPU/RAM     → stops throttling and OOM; medium risk (restarts containers)
Phase 5  Hardening   → security; medium risk (firewall can lock you out)
Phase 4  Organize    → structural; highest risk, do it with margin available
Phase 6  Resilience  → backups & monitoring; do LAST so it monitors the final state
Phase 7  Verify & report
```

Disk first, always: cleanup is the cheapest, safest win and it gives you room to
rebuild images and take backups during the riskier phases.

---

## Phase 7 — Verify

Three checks. All must pass before reporting success.

Run `scripts/triage.sh` again first — it writes a fresh JSON snapshot next to the
Phase 0 one, so the diff between the two files is the real evidence for the
BEFORE/AFTER numbers in the report below, not recalled console output.

```bash
# 1. Resources actually improved, and the filesystem agrees with the tree
df -h /; du -sh -x / 2>/dev/null      # "Used" should roughly match
free -h; cat /proc/loadavg

# 2. Phantom space: deleted files still held open by a process
lsof +L1 2>/dev/null | head

# 3. Production survived — compare against the Phase 0 baseline
docker ps -a --format '{{.Names}}: {{.Status}}' | sort
nginx -t 2>/dev/null
ufw status | head -3
```

### Interpreting mismatches

- **`df` Used ≫ `du` total** → deleted-but-open files. Space returns only when the
  holding process restarts. Find with `lsof +L1`. Never `kill -9` a database to
  reclaim cache space.
- **Box and provider panel disagree** → panel metric lag. Dashboards refresh on
  their own schedule (often 15–60 min) and may count allocated volume rather than
  filesystem usage. Trust `df` on the box; re-check the panel later.
- **A container changed state vs. baseline** → stop and investigate before
  reporting anything as done.

---

## Reporting

Deliver numbers, not adjectives. This template is the deliverable clients pay for.

```
VPS OPERATIONS REPORT — <host> — <date>

BEFORE
  Disk    <used>/<size> (<pct>%)      CPU  <cores> cores, load <1/5/15>
  Memory  <used>/<total>, swap <u>/<t>  Containers <running>/<total>
  Pre-existing issues: <list>

AFTER
  Disk    <used>/<size> (<pct>%)      CPU  load <1/5/15>, steal <pct>
  Memory  <used>/<total>, swap <u>/<t>  Containers <running>/<total>

RECLAIMED / CHANGED
  <item> .......... <amount or change>   [risk tier]

LEFT IN PLACE (and why)
  <item> — <evidence it is live>

PRE-EXISTING ISSUES (not caused by this work)
  <finding> — <recommended fix>

PREVENTION INSTALLED
  <config> — <what it now prevents>

REMAINING RISK
  <what will degrade again, and what it needs>
```

Always state what you did **not** touch and why. That list is what distinguishes a
professional audit from a `rm -rf` spree.

---

## Hard Constraints

Violating any of these can destroy a production server.

- **Never** run `rm -rf` on a path built from an unvalidated variable.
  Guard first: `[ -n "$TARGET" ] && [ -d "$TARGET" ] || exit 1`
- **Never** delete: active swap (`swapon --show`), `/boot`, `/etc`, or package
  manager state (`/var/lib/dpkg`, `/var/lib/rpm`).
- **Never** `docker system prune --volumes` on production without per-volume review —
  that flag destroys databases.
- **Never** delete anything mounted into a running container. Check `docker inspect`
  mounts first.
- **Never** enable a firewall without first allowing SSH (`ufw limit 22/tcp`).
  Locking yourself out requires provider console access to recover.
- **Never** restart Docker or reboot during business hours without confirming.
- **Always** confirm with the operator before deleting any backup, however stale.
- **Always** run `nginx -t` before `systemctl reload nginx`.
- If an SSH session drops mid-operation, **re-verify state before resuming** — never
  assume the last command completed.

---

## Working over a flaky SSH connection

Many budget VPS hosts drop connections under rapid command bursts. This is
throttling, not the server dying.

- Send **one command at a time with backoff**; do not pipeline dozens of calls.
- Avoid heredoc-over-stdin (`ssh host 'bash -s' <<EOF`) — it resets frequently.
  Prefer a single quoted inline command, or `cat > /tmp/x.sh && bash /tmp/x.sh`.
- Connection multiplexing (`ControlMaster`) does not help — the master drops too.
- Group related read-only checks into one invocation to reduce round trips.

```bash
for i in 1 2 3 4; do
  timeout 90 ssh -o ConnectTimeout=25 -o ServerAliveInterval=10 "$HOST" '<command>' && break
  sleep 20
done
```

---

## Rollback

| Broke | Recovery |
|---|---|
| UFW locked out SSH | Provider web console → `ufw disable` → fix rules → re-enable |
| nginx config bad | `nginx -t` catches it pre-reload; else restore from `/root/configs/<date>/` |
| Container won't start after limits | `docker update --cpus=0 --memory=0 <name>`, or restore the compose file |
| Docker restart killed containers | They auto-start if `restart: unless-stopped` is set — verify it is |
| Moved a file and broke a path | Symlink new → old location, or move back |
| Deleted needed data | Restore from `/root/backups/` — this is why Phase 6 exists |

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
