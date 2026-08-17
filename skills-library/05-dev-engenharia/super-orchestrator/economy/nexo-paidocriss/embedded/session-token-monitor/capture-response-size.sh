#!/bin/bash
# Capture Claude's actual response size for token estimation
# This runs AFTER each Claude response to measure real output

# Expected to receive response via stdin or $1
response="${1:-$(cat)}"

if [ -z "$response" ]; then
  exit 0
fi

# Calculate size in characters
size=${#response}

# Store for next token counter run
echo "$size" > "$HOME/.claude/.last-response-size.txt"

# Log for audit
{
  echo "$(date +%s),$size,$(echo "$response" | wc -w) words"
} >> "$HOME/.claude/.response-sizes.log"

# Don't interfere with output
echo "$response"
