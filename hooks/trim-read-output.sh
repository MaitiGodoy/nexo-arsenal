#!/bin/bash
# Trim Read output: remove docstrings, comments, e seções desnecessárias

output=$(cat)

# Remove blocos de comentários multi-linha (/** ... */ ou /* ... */)
output=$(echo "$output" | sed '/^[[:space:]]*\/\*/,/\*\//d')

# Remove linhas que são só comentário (mantém linhas c/ código)
# Nota: "#" fica de fora — colide com headers Markdown (# Título) e shebang (#!/bin/bash)
output=$(echo "$output" | grep -v '^[[:space:]]*\/\/' | grep -v "^[[:space:]]*--")

# Remove trailing espaço/tabs
output=$(echo "$output" | sed 's/[[:space:]]*$//')

# Limpa linhas vazias repetidas
output=$(echo "$output" | cat -s)

# Se output < 50 linhas, passa inteiro. Se > 500, trunca com "..." e # resumo
lines=$(echo "$output" | wc -l)
if [ "$lines" -gt 500 ]; then
  echo "$output" | head -250
  echo "..."
  echo "[$lines linhas total, truncado em 250]"
else
  echo "$output"
fi
