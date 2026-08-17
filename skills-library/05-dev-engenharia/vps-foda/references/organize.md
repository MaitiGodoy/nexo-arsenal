# Phase 4 — Organization & Containerization

Turn a sprawling home directory and ad-hoc `docker run` containers into a predictable
structure where every project is self-contained, reproducible, and documented.

**Do this phase last among the risky ones** — it moves files that other things
reference. Have disk margin and a fresh backup before starting.

---

## 4.0 Multi-location duplication & drift audit (NEXO pattern)

Some hosts keep the same project name in more than one root (`/root/projects/<name>`
**and** `/opt/<name>`, or a third ad-hoc path like `/root/<name>`) because different
deploy generations never got cleaned up. Do this audit **before** §4.1–4.7 — it tells
you which copy is real, which structural moves are safe, and prevents deleting a
directory that turns out to be the one actually serving traffic.

**Never assume `/opt` is "the deploy" and `/root/projects` is "the source", or vice
versa — verified on this fleet: it goes both ways per-project.** Prove it per project,
every time.

```bash
# 1. Same-name candidates across common roots
for base in /root/projects /opt /root; do
  [ -d "$base" ] && find "$base" -maxdepth 1 -mindepth 1 -type d -printf '%f\n'
done | sort | uniq -d
```

For each name that appears more than once:

```bash
# 2. Which copy does the RUNNING container actually mount / build from?
docker ps --format '{{.Names}}' | while read -r c; do
  echo "== $c"
  docker inspect "$c" --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{println}}{{end}}'
done

# 3. If no bind mount (image already built), find the compose file and its `build:` context
find /root /opt -maxdepth 3 -iname 'docker-compose*.yml' 2>/dev/null \
  | xargs grep -l '<container-name-fragment>' 2>/dev/null

# 4. If still ambiguous (e.g. a bare-metal process, not Docker) — find the PID and its cwd
ss -tlnp | grep ':<port>'                 # get the pid
readlink /proc/<pid>/cwd                  # that IS the live source, full stop

# 5. Compare content divergence — do NOT assume one is a stale copy of the other
diff <(cd /path/A && find . -maxdepth 1 | sort) <(cd /path/B && find . -maxdepth 1 | sort)
git -C /path/A log -1 --format=%cd --date=short 2>/dev/null
git -C /path/B log -1 --format=%cd --date=short 2>/dev/null
```

Classify each duplicate pair before touching anything:

| Signal | Meaning | Action |
|---|---|---|
| One dir is bind-mounted or is the compose `build:` context; other has no container referencing it | Clear winner | Flag loser for backup+delete, **still ask the operator to confirm** — do not delete unattended |
| Both dirs have independent recent commits / distinct planning docs not present in the other | **Real divergence, not a stale copy** | Do NOT delete either. Surface the specific divergent files to the operator; this needs a manual merge decision, not automation |
| One dir is nearly empty (just `.env`/config, no app code) | Not a duplicate at all — leftover config scaffold | Document as unrelated, leave in place unless operator wants it removed |
| Neither dir is referenced by any running container or process | Both dead | Confirm with operator, then archive (§4.5) rather than delete outright |

**Never auto-delete a duplicate.** This audit's output is a report with a recommendation
per pair — deletion always needs an explicit yes from the operator, even when the
evidence looks one-sided (a stale-looking copy can still hold uncommitted work).

## 4.0b No-remote and undocumented-project sweep

```bash
# Projects with no git remote at all — nothing off-box backs them up
for d in /root/projects/*/; do
  n=$(basename "$d")
  r=$(git -C "$d" remote get-url origin 2>/dev/null)
  [ -z "$r" ] && echo "NO REMOTE: $n"
done

# Projects missing the standard context doc (CONTEXTO.md, or a .nexo/ equivalent)
for d in /root/projects/*/; do
  n=$(basename "$d")
  [ -f "${d}CONTEXTO.md" ] || [ -f "${d}.nexo/MEMORIA.md" ] || echo "NO CONTEXTO.md: $n"
done

# Loose files/tarballs directly in /opt root (not inside a project dir)
find /opt -maxdepth 1 -type f -printf '%s\t%p\n' | sort -rn
```

A project with `NO REMOTE` is a single-disk-failure loss — treat it with the same
urgency as low disk space. Propose creating the GitHub repo immediately; ask the
operator only whether it should be public or private (never assume).

A project `NO CONTEXTO.md` should get one before the audit is considered complete.
Minimum content: what it is (one line), where the source of truth lives (this dir, or
elsewhere?), git remote, which containers/ports belong to it, and active-or-parked
status.

## 4.0c Refresh the fleet map

If `/root/MAPA-VPS.md` (or equivalent) already exists from a prior audit, regenerate
it rather than leaving it stale — a wrong port map is worse than none, it causes the
next deploy to collide silently.

```bash
[ -f /root/MAPA-VPS.md ] && echo "Existing map found — diff against current docker ps / nginx before overwriting, don't just clobber operator edits"
docker ps --format '{{.Names}}: {{.Ports}}'
grep -h 'location' /etc/nginx/sites-enabled/* 2>/dev/null
```

Regenerate: project → container(s) → port(s) → source-of-truth directory table, plus
a "duplications found / resolved / pending decision" section from §4.0 above, plus a
timestamped log entry of what this run changed. Keep prior pending-decision entries
that are still unresolved — don't silently drop them on a re-run.

---

## 4.0d Staleness sweep — surface old untouched items for review

Beyond the named-duplicate case in §4.0, list everything that has simply not been
touched in a long time, regardless of name. This is a **report to the operator**, not
an auto-clean — "old" is not evidence of "safe to delete" (see §2.3's death-proof
checks before acting on anything found here).

```bash
# Top-level project/opt dirs, oldest mtime first, with size
for base in /root/projects /opt; do
  [ -d "$base" ] || continue
  for d in "$base"/*/; do
    [ -d "$d" ] || continue
    m=$(find "$d" -type f -printf '%T@\n' 2>/dev/null | sort -rn | head -1)
    [ -z "$m" ] && continue
    days=$(( ( $(date +%s) - ${m%.*} ) / 86400 ))
    echo "$days days | $(du -sh "$d" 2>/dev/null | cut -f1) | $d"
  done
done | sort -rn

# Same for git projects specifically — last commit age, cheaper and more meaningful
# than file mtime (mtime resets on any checkout/rsync, commit date does not)
for d in /root/projects/*/; do
  git -C "$d" log -1 --format='%cd %H' --date=short 2>/dev/null \
    | awk -v d="$d" '{print $1, d}'
done | sort
```

| Finding | Present to operator as |
|---|---|
| No file touched in 60+ days, no running container references it | "Looks parked — confirm before archiving (§4.5)" |
| Git last-commit 90+ days ago but a container still mounts it | Not stale — it's stable, in-production code. Age alone is not the signal, liveness is |
| Directory age is recent but every file's mtime is identical (e.g. all today) | A restore/rsync/checkout reset the timestamps — use git commit date instead, not file mtime |

Always list findings with both a date **and** the liveness check from §4.0's step 2–4
(container mounts, compose `build:` context, bare-metal process cwd) side by side —
presenting age without liveness invites deleting something old but still serving traffic.

## 4.0e General duplicate-content hunt (not just same-named projects)

§4.0 catches duplicates that share a directory *name*. This catches duplicates that
don't — a project renamed once, or a folder copied under a different label.

```bash
# Duplicate files by content hash across the whole fleet (skips node_modules/.git — noisy, expected)
find /root/projects /opt -xdev -type f -size +1M \
  \( -path '*/node_modules/*' -o -path '*/.git/*' -o -path '*/.venv/*' \) -prune -o -type f -print \
  | xargs -r sha256sum 2>/dev/null | sort | uniq -w64 -D
```

Group the output by hash; each group sharing a hash is a byte-identical file living in
more than one place. For whole-directory duplicates (not just individual files):

```bash
# Cheap directory fingerprint: total size + file count — flags candidates for a real diff
for base in /root/projects /opt; do
  for d in "$base"/*/; do
    printf '%s %s %s\n' "$(du -sb "$d" 2>/dev/null | cut -f1)" \
      "$(find "$d" -type f 2>/dev/null | wc -l)" "$d"
  done
done | sort -k1,1n -k2,2n | awk '{k=$1" "$2; if(k==prev) print pline"\n"$0; prev=k; pline=$0}'
```

Any two dirs with near-identical size+count are worth a real `diff -rq A B` before
concluding they're duplicates — same size can be coincidence on small trees.

Same rule as §4.0: **never auto-delete.** Report the pair, the evidence (hash match /
diff output), and which one (if either) is live per §4.0's liveness checks, then let
the operator choose.

---

## 4.1 Target structure

```
/root/
├── projects/          # one directory per project, each self-contained
│   ├── <project>/
│   │   ├── docker-compose.yml
│   │   ├── .env                 (chmod 600)
│   │   ├── .env.example         (committed, no secrets)
│   │   ├── README.md            what it is, ports, how to start/stop, deps
│   │   └── src/ ...
│   └── ...
├── infra/
│   ├── scripts/       # shell utilities
│   ├── backup/        # backup scripts + RESTORE.md
│   └── monitoring/    # watchdog, healthchecks
├── configs/           # dated snapshots of critical configs (nginx, daemon.json)
├── backups/           # consolidated dumps — nothing else writes here
├── reference/         # study repos, forks, vendor docs
└── archive/           # dead projects kept only for reference
```

```bash
mkdir -p /root/{projects,infra/{scripts,backup,monitoring},configs,backups,reference,archive}
```

**Rule: nothing loose at the top level.** Every file in `/root` belongs to exactly one
of these directories, or it is deleted.

---

## 4.2 Triage loose files

```bash
# What is actually loose (includes dotfiles — a plain glob would miss them)
du -h -d1 /root | sort -rh | head -30
find /root -maxdepth 1 -type f -printf '%s\t%p\n' | sort -rn | head -30
```

| Found | Action |
|---|---|
| One-off debug/recon scripts from a past investigation | Group into `archive/<topic>/` — or a stopped archive container (§4.5) |
| `*.bak`, `*.tmp`, `*.<pid>.<hash>` leftovers | Delete |
| Loose `.env` outside a project | Move into its project, `chmod 600` |
| Tarballs of things already installed | Delete after verifying the install exists |
| Duplicated per-tool instruction files (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, …) with identical content | Keep one canonical file, symlink the rest |
| Old screenshots, notes, scratch output | Delete or move to `archive/` |
| A project directory named `<name>.bak.<timestamp>` next to `<name>` | Superseded copy — delete after confirming the current one runs |

Deduplicate the instruction-file pattern:

```bash
cd /root
for f in AGENTS.md CODEX.md GEMINI.md GROK.md QWEN.md OPENCODE.md CURSOR.md COPILOT.md; do
  [ -f "$f" ] && cmp -s "$f" CLAUDE.md && ln -sf CLAUDE.md "$f"
done
```

---

## 4.3 Give every project its own directory

For each running app, ensure a single directory holds everything it needs:

```bash
docker ps --format '{{.Names}}' | while read -r c; do
  echo "=== $c"
  docker inspect --format '  compose: {{index .Config.Labels "com.docker.compose.project.working_dir"}}' "$c"
  docker inspect --format '  mounts: {{range .Mounts}}{{.Source}} -> {{.Destination}} | {{end}}' "$c"
done
```

Containers with an empty compose label were created by raw `docker run` — they have no
reproducible definition. **Those are the priority for §4.4.**

Watch for projects whose mounts point outside their own directory (e.g. an app in
`projects/a` mounting `/root/b/data`). Consolidate so each project owns its data, or
document the cross-reference explicitly in its README.

---

## 4.4 Convert `docker run` containers into compose stacks

A container without a compose file cannot be reproduced, reviewed, or version-controlled.

**1. Capture the existing definition:**

```bash
C=<container>
docker inspect "$C" --format 'image:   {{.Config.Image}}
restart: {{.HostConfig.RestartPolicy.Name}}
ports:   {{range $p, $b := .HostConfig.PortBindings}}{{$p}} -> {{range $b}}{{.HostIp}}:{{.HostPort}}{{end}} {{end}}
mounts:  {{range .Mounts}}{{.Source}}:{{.Destination}} {{end}}
env:     {{range .Config.Env}}{{println .}}{{end}}
cmd:     {{.Config.Cmd}}
networks:{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}'
```

**2. Write `projects/<name>/docker-compose.yml`** from that output:

```yaml
services:
  <name>:
    image: <image>
    container_name: <name>
    restart: unless-stopped
    env_file: .env
    ports:
      - "127.0.0.1:<host>:<container>"    # loopback unless it must be public
    volumes:
      - ./data:/app/data
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:<port>/"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
```

**3. Move secrets out of the image env into `.env`** (`chmod 600`), and commit a
matching `.env.example` with empty values.

**4. Cut over during a window:**

```bash
cd /root/projects/<name>
docker compose config                    # validate before touching anything
docker stop <name> && docker rename <name> <name>_old   # keep the old one recoverable
docker compose up -d
docker compose ps && docker compose logs --tail 50
# only when verified healthy:
docker rm <name>_old
```

Renaming rather than removing means rollback is `docker start <name>_old`.

---

## 4.5 Archiving without deleting

To retire scripts or data you may want later but do not want cluttering the host,
store them in a stopped container — self-documenting and out of the filesystem tree:

```bash
docker run -d --name <topic>-archive --restart=no alpine:latest sleep infinity
docker exec <topic>-archive mkdir -p /archive
docker cp /root/<stuff>/. <topic>-archive:/archive/
docker exec <topic>-archive ls -la /archive     # VERIFY before deleting the source
rm -rf /root/<stuff>
docker stop <topic>-archive
```

Retrieve later with `docker cp <topic>-archive:/archive/. ./`.
A stopped container consumes no CPU or memory — only its (small) layer on disk.

> Verify the copy landed **before** deleting the source. `docker cp` failing silently
> and then deleting the original is an unrecoverable mistake.

---

## 4.6 Documentation & secrets hygiene

Every project directory gets a `README.md` stating: what it is, which ports it uses,
how to start and stop it, what it depends on, and where its data lives.

```bash
# Lock down every .env
find /root/projects/ -name '.env' -o -name '.env.*' \
  | grep -v node_modules | grep -v '.example' | xargs -r chmod 600

# Every project must gitignore its .env
for d in /root/projects/*/; do
  [ -f "${d}.gitignore" ] && grep -q '.env' "${d}.gitignore" \
    || echo "MISSING .env in gitignore: $d"
done

# Catch secrets already committed
grep -rIl --exclude-dir=.git -E '(api[_-]?key|secret|password|token)\s*=\s*["'"'"'][^"'"'"']{12,}' \
  /root/projects/ 2>/dev/null | head
```

Any secret found in git history must be **rotated**, not merely deleted — it is already
in the history.

---

## 4.7 Verify

```bash
ls /root                                            # only the standard directories
find /root -maxdepth 1 -type f | wc -l              # loose files: aim for near zero
docker ps -q | xargs -r docker inspect \
  --format '{{.Name}} {{index .Config.Labels "com.docker.compose.project"}}'  # all labelled
docker ps -a --format '{{.Names}}: {{.Status}}'     # everything healthy
```

Success: every running container traces back to a compose file in its own project
directory, every project has a README and a locked-down `.env`, and `/root` has no
loose files.
