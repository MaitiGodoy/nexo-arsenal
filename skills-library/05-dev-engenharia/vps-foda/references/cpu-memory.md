# Phase 3 — CPU & Memory Governance

Most "I need a bigger plan" problems are governance problems. A server with dozens of
unlimited containers has no way to stop one process from consuming the whole machine —
so the provider throttles the whole machine.

---

## 3.1 Diagnose

```bash
# Capacity vs. demand
nproc --all
cat /proc/loadavg                    # 1min 5min 15min — compare against core count

# Instantaneous breakdown
top -bn1 | grep '^%Cpu'              # us / sy / id / wa / st

# HISTORY — the single most valuable command here
sar -u 2>/dev/null | tail -20        # per-interval user/system/iowait/steal/idle
sar -r 2>/dev/null | tail -10        # memory history
sar -q 2>/dev/null | tail -10        # load history

# Pressure Stall Information: which resource is actually stalling tasks
cat /proc/pressure/cpu /proc/pressure/memory /proc/pressure/io

# Memory & swap
free -h
swapon --show
journalctl --since "7 days ago" 2>/dev/null | grep -ci "oom\|killed process"

# Per-container consumption
docker stats --no-stream --format '{{.CPUPerc}}\t{{.MemPerc}}\t{{.Name}}' | sort -rh | head -15

# Host processes
ps -eo pcpu,pmem,etime,comm --sort=-pcpu | head -12
```

### Reading the numbers

| Metric | Healthy | Problem |
|---|---|---|
| `loadavg` (15min) | < core count | > core count = queueing; > 2× = saturated |
| `pressure/cpu some avg300` | < 5 | > 10 means tasks are routinely stalled waiting for CPU |
| `pressure/io full` | ~0 | > 0.3 sustained usually means swap thrashing |
| `%st` (steal) | ~0 | **> 2% = the hypervisor is taking your cycles** |
| `wa` (iowait) | < 5% | High with full swap = memory problem masquerading as CPU |
| Swap used | < 50% of swap | ≈ 100% = memory over-commit, OOM risk |

### The steal-time diagnosis (the one that changes the conversation)

On managed VPS plans, `steal` is usually **your own plan's throttle**, not a noisy
neighbour. Correlate it in `sar` output:

```
16:20  user 27.77   steal 6.67
16:50  user 27.89   steal 5.15
17:40  user 29.49   steal 3.85
       user  8.00   steal 0.82     ← baseline
```

**Steal rising in lockstep with your own user CPU = the provider is capping you when
you spike.** A control panel message like "CPU limit reached / maximum resets used"
is exactly this.

The correct fix is **capping and smoothing your own workload** (§3.2, §3.4), not
upgrading the plan — unless the *baseline* itself already exceeds what you pay for.
Upgrading without limits just moves the same failure to a larger machine.

---

## 3.2 The root cause: unlimited containers

```bash
docker ps -q | xargs -r docker inspect \
  --format '{{.Name}} cpu={{.HostConfig.NanoCpus}} mem={{.HostConfig.Memory}}'
```

`cpu=0 mem=0` means **unlimited** — that container may consume every core and all RAM.
On a busy host most containers are typically unlimited, which is why a single spike
throttles everything.

### Compute the over-commit ratio

```bash
CORES=$(nproc)
ALLOC=$(docker ps -q | xargs -r docker inspect --format '{{.HostConfig.NanoCpus}}' \
        | awk '{s+=$1} END {print s/1000000000}')
UNLIM=$(docker ps -q | xargs -r docker inspect --format '{{.HostConfig.NanoCpus}}' | grep -c '^0$')
echo "cores=$CORES allocated=$ALLOC unlimited=$UNLIM"
```

Some over-commit is normal and healthy — containers are idle most of the time.
**Uncontrolled over-commit is not.** Target: no single container may exceed ~50% of
total cores or ~35% of total RAM, and every container has *some* limit.

### Applying limits

**Live, no restart** (takes effect immediately, lost on `compose up` recreate):

```bash
docker update --cpus=0.5 --memory=512m --memory-swap=512m <container>
```

**Permanent** — in `docker-compose.yml`:

```yaml
services:
  api:
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: "0.75"
          memory: 768M
        reservations:
          memory: 256M
```

> Compose v2 honours `deploy.resources.limits` outside Swarm.
> If your version ignores it, use the top-level `cpus:` / `mem_limit:` keys instead.

### Sizing guidance

| Workload | CPU | Memory |
|---|---|---|
| Postgres / MySQL (small app) | 0.5–1.0 | 512M–1G |
| Redis | 0.25 | 256M |
| API / backend (Python, Node) | 0.5–1.0 | 512M–1G |
| Frontend (nginx, static) | 0.25 | 128–256M |
| Worker / scheduler | 0.5 | 512M |
| Automation platform (n8n etc.) | 1.0 | 1G |
| Headless browser / scraper | 1.0 | 1–2G |

**Apply limits in waves, not all at once.** Start with the biggest consumers, verify
health, then continue. A memory limit set too low causes the kernel to OOM-kill the
container — watch for `Exited (137)`.

---

## 3.3 Memory & swap remediation

Swap at 100% means memory was over-committed and the kernel evicted pages that were
never reclaimed. Symptoms: IO pressure, high `wa`, sluggishness under load.

```bash
# Who is actually in swap
for f in /proc/*/status; do
  awk '/^Name:/{n=$2} /^VmSwap:/{ if ($2+0 > 1000) print $2, n }' "$f" 2>/dev/null
done | sort -rn | head -10          # KB, process name

# OOM history
journalctl --since "30 days ago" | grep -i "out of memory\|killed process" | tail
dmesg 2>/dev/null | grep -i "oom-kill" | tail
```

Remediation, in order:

1. **Cap the memory hogs** (§3.2). This prevents recurrence; everything else is cleanup.
2. **Restart the worst swap offender** to release its swapped pages — during a window,
   and only if it is a stateless service.
3. **Reclaim swap** once memory is free (`free -h` shows ample available):
   ```bash
   swapoff -a && swapon -a    # DANGER: needs free RAM ≥ swap in use, or the OOM killer fires
   ```
   Skip this if available memory is lower than swap in use. Optional hygiene, not a fix.
4. **Tune swappiness** so the kernel prefers reclaiming cache over swapping:
   ```bash
   sysctl vm.swappiness=10
   echo "vm.swappiness=10" >> /etc/sysctl.d/99-swap.conf
   ```
5. **Only then** consider more RAM. Without limits, more RAM just delays the same failure.

---

## 3.4 Find and smooth the spike source

Baseline CPU is rarely the problem — periodic spikes are. Identify them:

```bash
sar -u | tail -30                                    # when do spikes occur?
crontab -l; ls /etc/cron.d/                          # scheduled jobs on the hour?
systemctl list-timers --all | head -20               # systemd timers

# Failing healthchecks spawn a process every interval — a silent, permanent CPU tax
docker ps -a --filter health=unhealthy --format '{{.Names}}'
docker inspect --format '{{.State.Health.FailingStreak}}' <container>
```

| Spike source | Fix |
|---|---|
| **Failing healthcheck** looping every 15–30 s | Fix the check or the service. A failing streak in the thousands means days of wasted CPU |
| Several cron jobs on the same minute | Stagger them (`:00`, `:20`, `:40`) |
| Automation platform running heavy workflows | Limit concurrency; cap the container's CPU |
| Scraper / headless browser | Cap CPU; serialise jobs; add delays |
| Image builds on the production host | Build elsewhere, or `nice -n 19` the build |

Staggering plus per-container caps flattens the peaks that trigger provider throttling —
the same total work, spread out, stops the penalty.

---

## 3.5 Verify

```bash
cat /proc/loadavg                      # should trend below core count
cat /proc/pressure/cpu                 # "some avg300" should fall
sar -u | tail -5                       # steal should drop toward 0
free -h                                # swap should stop growing
docker ps -a --format '{{.Names}}: {{.Status}}'   # no new Exited (137) = no OOM kills
```

Give it a full spike cycle (often 30–60 min) before judging. If `steal` disappears
during a window that previously spiked, the throttling is resolved.
