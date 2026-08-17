#!/usr/bin/env bash
# lint-python.sh — hook PostToolUse (Write|Edit) em arquivos .py.
# Roda pyflakes no arquivo editado se disponível. LLM-free.
# Contrato: JSON no stdin com .tool_input.file_path. Erro de lint volta como texto (exit 0, stderr informativo).
set -euo pipefail
PAYLOAD="$(cat)"

# extrai file_path sem depender de jq (fallback grep)
FILE="$(echo "$PAYLOAD" | grep -oE '"file_path"[[:space:]]*:[[:space:]]*"[^"]+"' | head -1 | sed -E 's/.*:[[:space:]]*"([^"]+)".*/\1/')"
[ -n "${FILE:-}" ] || exit 0
case "$FILE" in *.py) ;; *) exit 0 ;; esac
[ -f "$FILE" ] || exit 0

if command -v python >/dev/null 2>&1 && python -c "import pyflakes" >/dev/null 2>&1; then
  OUT="$(python -m pyflakes "$FILE" 2>&1 || true)"
  [ -n "$OUT" ] && echo "[lint-python] pyflakes em $FILE:" && echo "$OUT" >&2
fi
exit 0
