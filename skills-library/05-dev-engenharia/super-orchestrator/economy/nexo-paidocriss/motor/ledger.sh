#!/bin/bash
# ledger.sh — registro de execução (bash puro)
# Uso: ledger.sh <layer> <camada> <trigger> <evidence>
LEDGER_DIR="$HOME/.claude/.paidocriss"
mkdir -p "$LEDGER_DIR"
LEDGER="$LEDGER_DIR/LEDGER-$(date +%F).json"
L="$1" C="$2" T="$3" E="$4" TS=$(date -u +%Y-%m-%dT%H:%M:%SZ)

[[ ! -f "$LEDGER" ]] && printf '{"date":"%s","events":[]}\n' "$(date +%F)" > "$LEDGER"

# Reescreve JSON inteiro c/ novo evento
awk -v l="$L" -v c="$C" -v t="$T" -v e="$E" -v ts="$TS" '
NR==1 {print; next}
/]/ {print "  {\"ts\":\"" ts "\",\"layer\":\"" l "\",\"camada\":\"" c "\",\"trigger\":\"" t "\",\"evidence\":\"" e "\"},"; print; next}
{print}
' "$LEDGER" > /tmp/ledger.tmp && mv /tmp/ledger.tmp "$LEDGER"
exit 0

