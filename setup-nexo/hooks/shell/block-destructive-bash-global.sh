#!/usr/bin/env bash
# Global guardrail: block obviously destructive Bash commands in any project.
# Reads the tool-call JSON from stdin (Claude Code PreToolUse contract).
input="$(cat)"
cmd="$(echo "$input" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1)"

if echo "$cmd" | grep -Eq 'rm -rf /|git push --force|git reset --hard|DROP TABLE|TRUNCATE'; then
  echo "Blocked: destructive command pattern detected. Confirm with the user first." >&2
  exit 2
fi

exit 0
