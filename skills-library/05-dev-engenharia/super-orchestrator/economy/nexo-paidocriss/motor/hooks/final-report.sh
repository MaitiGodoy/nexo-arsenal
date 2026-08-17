#!/usr/bin/env bash
# final-report.sh — Generate ≤10 line final report on Stop
ledger_dir="$HOME/.claude/.paidocriss"
ledger_file="$ledger_dir/LEDGER-$(date +%Y-%m-%d).jsonl"

[[ ! -f "$ledger_file" ]] && exit 0

total_lines=$(wc -l < "$ledger_file" 2>/dev/null || echo 0)
narration_fails=$(grep -c "narration_detected" "$ledger_file" 2>/dev/null || echo 0)
economy_fails=$(grep -c '"check":"msg_economy"' "$ledger_file" 2>/dev/null || echo 0)

{
  echo "✓ Session ledger: $total_lines events"
  echo "✓ Narration checks: $narration_fails detected"
  echo "✓ MSG-economy checks: $economy_fails failed"
  echo ""
  echo "Next: /nexo-paidocriss status"
} > "$ledger_dir/REPORT-$(date +%Y-%m-%d).txt" 2>/dev/null

exit 0
