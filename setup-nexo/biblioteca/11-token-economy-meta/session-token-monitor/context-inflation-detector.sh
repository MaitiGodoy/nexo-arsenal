#!/bin/bash
# Context Inflation Detector
# Monitors when context window is getting too full
# Real measurement: actual session history size

CONTEXT_LOG="$HOME/.claude/.context-metrics.log"
SESSION_LOG="$HOME/.claude/sessions/.current-session.log"

# Initialize log
if [ ! -f "$CONTEXT_LOG" ]; then
  {
    echo "timestamp,context_lines,estimated_tokens,inflation_rate"
  } > "$CONTEXT_LOG"
fi

# Get last measurement (skip header row; only accept numeric data lines)
last_line=$(grep -E '^[0-9]+,' "$CONTEXT_LOG" 2>/dev/null | tail -1)
last_context=$(echo "$last_line" | cut -d, -f2)
last_tokens=$(echo "$last_line" | cut -d, -f3)
[[ "$last_tokens" =~ ^[0-9]+$ ]] || last_tokens=0
[[ "$last_context" =~ ^[0-9]+$ ]] || last_context=0

# Current measurement (file may not exist yet — that's fine, treat as 0)
if [ -f "$SESSION_LOG" ]; then
  current_context=$(wc -l < "$SESSION_LOG")
else
  current_context=0
fi
# Heuristic: session line ≈ 1.3 tokens (conversation overhead included)
current_tokens=$((current_context * 13 / 10))

# Calculate inflation rate
if [ "$last_tokens" -gt 0 ]; then
  inflation_pct=$(( (current_tokens - last_tokens) * 100 / last_tokens ))
else
  inflation_pct=0
fi

# Log measurement
{
  echo "$(date +%s),$current_context,$current_tokens,$inflation_pct"
} >> "$CONTEXT_LOG"

# Alert if context is inflating fast (>50% per checkpoint)
if [ "$inflation_pct" -gt 50 ] && [ "$current_tokens" -gt 50000 ]; then
  {
    echo ""
    echo "⚠️  CONTEXT INFLATION DETECTED"
    echo "├─ Context lines: $current_context (was $last_context)"
    echo "├─ Est. tokens: $current_tokens (was $last_tokens)"
    echo "├─ Inflation rate: +$inflation_pct%"
    echo "└─ 💡 Suggest: Session becoming expensive, consider new session"
    echo ""
  } >&2
fi

# Show summary
{
  echo "context_lines=$current_context"
  echo "estimated_tokens=$current_tokens"
  echo "inflation_rate=$inflation_pct"
} > "$HOME/.claude/.context-state"
