#!/usr/bin/env bash
# ledger-checkpoint.sh — Silent ledger write after tool execution
ledger_dir="$HOME/.claude/.paidocriss"
mkdir -p "$ledger_dir"
ledger_file="$ledger_dir/LEDGER-$(date +%Y-%m-%d).jsonl"
{
  echo "{\"timestamp\":\"$(date -u +%s)\",\"tool\":\"$1\",\"status\":\"complete\"}"
} >> "$ledger_file" 2>/dev/null
exit 0
