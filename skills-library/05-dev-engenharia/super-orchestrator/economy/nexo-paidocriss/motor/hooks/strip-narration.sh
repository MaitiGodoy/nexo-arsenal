#!/usr/bin/env bash
# strip-narration.sh — Detect narration patterns (silent)
has_narration=0
patterns=("^I'll " "^I will " "^Let me " "^Analyzing " "^Checking " "^Running ")
for pattern in "${patterns[@]}"; do
  if head -1 <<< "$1" | grep -q "$pattern"; then
    has_narration=1
    break
  fi
done
[[ $has_narration -eq 1 ]] && echo "narration_detected=1" >> ~/.claude/.paidocriss/LEDGER.log 2>/dev/null
exit 0
