#!/usr/bin/env bash
# vps-foda triage.sh — single-command Phase 0+1 baseline + auto-recommendation.
# Adapted from pc-foda's SmartAnalyzer innovation module (Windows) to Linux/VPS.
# Read-only: never deletes, restarts, or mutates anything. Safe to run any time.
set -uo pipefail

LOG_DIR="/root/vps-foda-logs"
mkdir -p "$LOG_DIR" 2>/dev/null || { LOG_DIR="/tmp/vps-foda-logs"; mkdir -p "$LOG_DIR"; }
TS="$(date +%Y%m%dT%H%M%S)"
JSON_LOG="$LOG_DIR/baseline-$TS.json"

json_escape() { printf '%s' "$1" | sed 's/\\/\\\\/g; s/"/\\"/g'; }

echo "=== HOST ==="
HOSTNAME=$(hostname)
UPTIME=$(uptime -p 2>/dev/null || uptime)
echo "$HOSTNAME | $UPTIME"

echo "=== CPU ==="
CORES=$(nproc --all)
LOAD=$(awk '{print $1, $2, $3}' /proc/loadavg)
echo "cores=$CORES load=$LOAD"

echo "=== MEM ==="
read -r MEM_TOTAL MEM_USED MEM_FREE <<< "$(free -m | awk '/^Mem:/{print $2, $3, $4}')"
read -r SWAP_TOTAL SWAP_USED <<< "$(free -m | awk '/^Swap:/{print $2, $3}')"
echo "mem_total_mb=$MEM_TOTAL mem_used_mb=$MEM_USED swap_total_mb=$SWAP_TOTAL swap_used_mb=$SWAP_USED"

echo "=== DISK ==="
read -r DISK_SIZE DISK_USED DISK_PCT <<< "$(df -h / | awk 'NR==2{print $2, $3, $5}')"
DISK_PCT_NUM=${DISK_PCT%\%}
INODE_PCT=$(df -i / | awk 'NR==2{print $5}')
INODE_PCT_NUM=${INODE_PCT%\%}
echo "size=$DISK_SIZE used=$DISK_USED pct=$DISK_PCT inode_pct=$INODE_PCT"

echo "=== PRESSURE ==="
PSI_CPU=$(head -1 /proc/pressure/cpu 2>/dev/null)
PSI_IO=$(head -1 /proc/pressure/io 2>/dev/null)
echo "cpu: ${PSI_CPU:-n/a}"
echo "io:  ${PSI_IO:-n/a}"

echo "=== DOCKER ==="
DOCKER_UNHEALTHY=$(docker ps -a --format '{{.Names}}: {{.Status}}' 2>/dev/null | grep -Ec 'unhealthy|Restarting|Exited' || true)
DOCKER_TOTAL=$(docker ps -a -q 2>/dev/null | wc -l || echo 0)
echo "containers_total=$DOCKER_TOTAL flagged=$DOCKER_UNHEALTHY"

echo "=== FIREWALL ==="
UFW_STATUS=$(ufw status 2>/dev/null | head -1)
UFW_STATUS=${UFW_STATUS:-"ufw not installed"}
echo "$UFW_STATUS"

echo "=== OOM (7d) ==="
OOM_COUNT=$(journalctl --since "7 days ago" 2>/dev/null | grep -ci "oom\|killed process")
OOM_COUNT=${OOM_COUNT:-0}
echo "oom_events_7d=$OOM_COUNT"

echo ""
echo "=== RECOMMENDATIONS ==="
RECS=()
[ "${DISK_PCT_NUM:-0}" -ge 85 ] 2>/dev/null && RECS+=("Disk >=85% full -> Phase 2 (references/disk.md)")
[ "${INODE_PCT_NUM:-0}" -ge 85 ] 2>/dev/null && RECS+=("Inode usage high -> Phase 2 inode section")
if [ "${SWAP_TOTAL:-0}" -gt 0 ] 2>/dev/null && [ "${SWAP_USED:-0}" -ge $(( SWAP_TOTAL * 80 / 100 )) ] 2>/dev/null; then
  RECS+=("Swap >=80% used -> Phase 3 (references/cpu-memory.md)")
fi
[ "${OOM_COUNT:-0}" -gt 0 ] 2>/dev/null && RECS+=("$OOM_COUNT OOM events in 7d -> Phase 3")
[ "${DOCKER_UNHEALTHY:-0}" -gt 0 ] 2>/dev/null && RECS+=("$DOCKER_UNHEALTHY containers unhealthy/restarting/exited -> investigate before touching anything else")
echo "$UFW_STATUS" | grep -qi "inactive\|not installed" && RECS+=("Firewall inactive or missing -> Phase 5 (references/harden.md)")

if [ ${#RECS[@]} -eq 0 ]; then
  echo "No red flags in this pass. Still eyeball Phase 4 (references/organize.md) for duplicate/stale project copies — this script does not check that."
else
  for r in "${RECS[@]}"; do echo "- $r"; done
fi

REC_JSON=""
for r in "${RECS[@]:-}"; do
  [ -z "$r" ] && continue
  REC_JSON="$REC_JSON\"$(json_escape "$r")\","
done
REC_JSON=${REC_JSON%,}

cat > "$JSON_LOG" <<EOF
{
  "timestamp": "$TS",
  "hostname": "$(json_escape "$HOSTNAME")",
  "cpu": { "cores": $CORES, "load": "$(json_escape "$LOAD")" },
  "memory": { "total_mb": $MEM_TOTAL, "used_mb": $MEM_USED, "free_mb": $MEM_FREE },
  "swap": { "total_mb": $SWAP_TOTAL, "used_mb": $SWAP_USED },
  "disk": { "size": "$DISK_SIZE", "used": "$DISK_USED", "pct": "$DISK_PCT", "inode_pct": "$INODE_PCT" },
  "docker": { "total": $DOCKER_TOTAL, "flagged": $DOCKER_UNHEALTHY },
  "firewall": "$(json_escape "$UFW_STATUS")",
  "oom_events_7d": $OOM_COUNT,
  "recommendations": [$REC_JSON]
}
EOF

echo ""
echo "Baseline JSON written to $JSON_LOG — diff this against the Phase 7 run of the same script to prove before/after."
