#!/usr/bin/env bash
# block-secrets.sh — hook PreToolUse (Write|Edit).
# Rejeita a escrita se o conteúdo casar padrão de segredo. LLM-free (só grep).
# Contrato Claude Code: JSON no stdin; exit 2 = bloqueia e mostra stderr ao modelo.
set -euo pipefail
PAYLOAD="$(cat)"

# Padrões de segredo — fonte única, compartilhada com o gate de commit do nexoflow.sh.
PATTERNS_FILE="$HOME/.claude/secret-patterns.txt"
PATTERNS="$(head -1 "$PATTERNS_FILE" 2>/dev/null)"
[ -z "$PATTERNS" ] && { echo "block-secrets: $PATTERNS_FILE ausente/vazio — não vou deixar passar às cegas." >&2; exit 2; }

if echo "$PAYLOAD" | grep -qE "$PATTERNS"; then
  echo "BLOQUEADO: conteúdo parece conter um segredo (API key/senha/chave privada)." >&2
  echo "Use variável de ambiente / .env (git-ignored), nunca hardcode." >&2
  exit 2
fi
exit 0
