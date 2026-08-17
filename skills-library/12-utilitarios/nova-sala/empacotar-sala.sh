#!/usr/bin/env bash
# empacotar-sala.sh — gera o .zip de entrega de uma Sala pronta.
# Uso: ./empacotar-sala.sh <slug-cliente> [destino-zip]
set -euo pipefail

SLUG="${1:?uso: empacotar-sala.sh <slug> [destino-zip]}"
ROOT="$HOME/Studio Artemis"
SALA="$ROOT/clientes/$SLUG"
DATA="$(date +%Y-%m-%d)"
OUT="${2:-$ROOT/clientes/$SLUG/${SLUG}-sala-${DATA}.zip}"

[ -d "$SALA" ] || { echo "ERRO: $SALA não existe. Rode montar-sala.sh antes." >&2; exit 1; }

# Aviso se sobrou placeholder não preenchido (só CAMADA CLIENTE — poda canon)
PEND=$(find "$SALA" \
  \( -path "$SALA/.claude" -o -path "$SALA/cerebro-de-copy" -o -path "$SALA/automacao" -o -path "$SALA/design-system/_base" \) -prune \
  -o -name '*.md' -type f -print0 | xargs -0 grep -l '{{' 2>/dev/null || true)
if [ -n "$PEND" ]; then
  echo "⚠️  Placeholders pendentes (a Sala não está pronta pra entrega):" >&2
  echo "$PEND" | sed "s|$SALA|  ·|" >&2
  echo "    Empacotando mesmo assim. Ctrl-C pra abortar." >&2
fi

find "$SALA" -name '.DS_Store' -delete 2>/dev/null || true
cd "$ROOT/clientes"
rm -f "$OUT"
zip -r -q -X "$OUT" "$SLUG" \
  -x "*.DS_Store" -x "*/.git/*" -x "*/node_modules/*" -x "*.zip"
echo "✓ Zip: $OUT ($(du -h "$OUT" | cut -f1))"