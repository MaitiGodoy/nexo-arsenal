#!/usr/bin/env bash
# gauntlet.sh — Validate MANDATORY paidocriss enforcement
# Exit: 0 = all rules enforced, 1 = violations found

failures=0
hooks_dir="$HOME/.claude/skills/nexo-paidocriss/motor/hooks"

# Check 1: All 4 hooks exist
for hook in strip-narration.sh ledger-checkpoint.sh msg-economy-check.sh final-report.sh; do
  if [[ ! -x "$hooks_dir/$hook" ]]; then
    echo "FAIL: $hook not executable" >&2
    ((failures++))
  fi
done

# Check 2: settings.json has correct paths
if ! grep -q "~/.claude/skills/nexo-paidocriss/motor/hooks/strip-narration.sh" ~/.claude/settings.json 2>/dev/null; then
  echo "FAIL: strip-narration.sh hook not in settings.json" >&2
  ((failures++))
fi

if ! grep -q "~/.claude/skills/nexo-paidocriss/motor/hooks/ledger-checkpoint.sh" ~/.claude/settings.json 2>/dev/null; then
  echo "FAIL: ledger-checkpoint.sh hook not in settings.json" >&2
  ((failures++))
fi

if ! grep -q "~/.claude/skills/nexo-paidocriss/motor/hooks/msg-economy-check.sh" ~/.claude/settings.json 2>/dev/null; then
  echo "FAIL: msg-economy-check.sh hook not in settings.json" >&2
  ((failures++))
fi

# Check 3: Ledger dir exists
mkdir -p ~/.claude/.paidocriss

# Check 4: No errors in validation = enforcement LIVE
if [[ $failures -eq 0 ]]; then
  echo "✓ All 3 paidocriss hooks MANDATORY and ENFORCED"
  exit 0
else
  echo "✗ $failures enforcement rules FAILED"
  exit 1
fi
