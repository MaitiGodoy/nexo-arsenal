#!/bin/bash
# Auto-generate session summary before closing

SESSION_ID=$(date +%s)
SUMMARY_FILE="$HOME/.claude/session-summaries/summary-$SESSION_ID.md"
STATE_FILE="$HOME/.claude/.session-token-state"

mkdir -p "$HOME/.claude/session-summaries"

# Load session state
if [ ! -f "$STATE_FILE" ]; then
  exit 0
fi

source "$STATE_FILE"

session_start_sec=${session_start:-0}
session_now_sec=$(date +%s)
session_duration=$((session_now_sec - session_start_sec))
session_duration_min=$((session_duration / 60))

# Build summary
{
  echo "# Session Summary — $(date)"
  echo ""
  echo "## Metrics"
  echo "- **Duration:** ${session_duration_min}m"
  echo "- **Tools:** $tool_count calls"
  echo "- **Tokens:** ~$tokens_used (est.)"
  echo "- **Cost:** \$$(echo \"scale=3; $tokens_used * 0.003 / 1000000\" | bc)"
  echo ""
  echo "## Actions Taken"
  echo "(Auto-extracted from tools called:)"
  echo ""

  # Extract from recent commands (if available)
  if [ -f "$HOME/.claude/sessions/.current-session.log" ]; then
    grep -E "^(Bash|Read|Write|Edit)" "$HOME/.claude/sessions/.current-session.log" | \
      head -20 | \
      sed 's/^/- /'
  else
    echo "- [Tool log not available]"
  fi

  echo ""
  echo "## Recommendations"
  echo "1. **Next time:** Start fresh session after 500K tokens"
  echo "2. **Economy:** Use \`bash ~/.claude/run-token-optimized.sh\` to save 30-40%"
  echo "3. **References:** Check \`~/.claude/TOKEN_OPTIMIZATION_REPORT.md\`"
  echo ""
  echo "---"
  echo "🚀 Open new session: \`claude\`"
} > "$SUMMARY_FILE"

# Also print to console
echo ""
echo "✅ Session summary saved: $SUMMARY_FILE"
cat "$SUMMARY_FILE" >&2
