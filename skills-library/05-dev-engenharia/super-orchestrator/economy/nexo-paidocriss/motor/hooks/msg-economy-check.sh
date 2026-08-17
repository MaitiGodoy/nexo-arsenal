#!/usr/bin/env bash
# msg-economy-check.sh — Enforce TDAH ultra-terse rules (7 techniques)
# Called before output; validates and logs

output="${1:-.}"
ledger_dir="$HOME/.claude/.paidocriss"
mkdir -p "$ledger_dir"

# Count lines
line_count=$(echo "$output" | wc -l)

# Check: Is output > 10 lines? (Rule: final report ≤10 lines)
# Check: Intro/outro patterns?
# Check: Multiple paragraphs without util?

fails=0
[[ $line_count -gt 15 ]] && ((fails++))
echo "$output" | head -2 | grep -qi "^let me\|^i'll\|^analyzing\|^i will" && ((fails++))
echo "$output" | grep -c "^$" | grep -q "^[2-9]" && ((fails++))  # More than 1 blank line = narrative style

if [[ $fails -gt 0 ]]; then
  {
    echo "{\"timestamp\":\"$(date -u +%s)\",\"check\":\"msg_economy\",\"fails\":$fails,\"line_count\":$line_count,\"status\":\"fail\"}"
  } >> "$ledger_dir/LEDGER-$(date +%Y-%m-%d).jsonl" 2>/dev/null
fi

exit 0
