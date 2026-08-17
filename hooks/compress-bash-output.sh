#!/bin/bash
# Compress Bash output by removing noise

# Se não há input, passa adiante
if [ -z "$1" ]; then
  cat
  exit 0
fi

# Lê do stdin
output=$(cat)

# Limpa linhas vazias repetidas (deixa max 1)
output=$(echo "$output" | cat -s)

# Remove ansi color codes (se houver)
output=$(echo "$output" | sed 's/\x1b\[[0-9;]*m//g')

# Trunca linhas muito longas (>200 chars) com "..."
output=$(echo "$output" | sed 's/^\(.\{200\}\).*/\1.../')

# Remove linhas que são só espaço/tab
output=$(echo "$output" | sed '/^[[:space:]]*$/d')

# Output resultado
echo "$output"
