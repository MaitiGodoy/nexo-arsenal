#!/bin/bash
# Quick model switcher — Sonnet (coding) ↔ Haiku (chat)

SETTINGS_FILE="$HOME/.claude/settings.local.json"

if [ -z "$1" ]; then
  echo "Usage: $0 [sonnet|haiku]"
  echo ""
  echo "Examples:"
  echo "  $0 sonnet   # Switch to Sonnet (coding, complex tasks)"
  echo "  $0 haiku    # Switch to Haiku (chat, simple Q&A)"
  echo ""

  # Show current
  current=$(grep '"model":' "$SETTINGS_FILE" | grep -o 'claude-[^"]*')
  echo "Current model: $current"
  exit 0
fi

case "$1" in
  sonnet|coding)
    sed -i 's/"model": "claude-[^"]*"/"model": "claude-sonnet-5"/' "$SETTINGS_FILE"
    echo "✅ Switched to Sonnet (best for coding/complex tasks)"
    echo "💡 Next session: claude"
    ;;
  haiku|chat|convo)
    sed -i 's/"model": "claude-[^"]*"/"model": "claude-haiku-4-5-20251001"/' "$SETTINGS_FILE"
    echo "✅ Switched to Haiku (fast, cheap, for chat/Q&A)"
    echo "💡 Next session: claude"
    ;;
  *)
    echo "Unknown model: $1"
    echo "Use: sonnet or haiku"
    exit 1
    ;;
esac

# Show new setting
new_model=$(grep '"model":' "$SETTINGS_FILE" | grep -o 'claude-[^"]*')
echo "Model now: $new_model"
