#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
#  sync-nexo — mantém repo NEXO-COMPLETO e ~/.claude/ em sincronia.
#
#  O que RODA é ~/.claude/. O repo é o arquivo/histórico. Sem isto, os
#  dois divergem em silêncio (já divergiram: 09-design-visual tinha 4
#  skills a mais no ~/.claude/ que no repo).
#
#  Uso:  sync-nexo check   (default — só mostra a diferença, não escreve)
#        sync-nexo pull    (~/.claude/  →  repo)   [arquivar o que roda]
#        sync-nexo push    (repo  →  ~/.claude/)   [publicar edição do repo]
#
#  REPO=/outro/caminho sync-nexo check   → sobrescreve o repo padrão
# ═══════════════════════════════════════════════════════════════════
set -uo pipefail

REPO="${REPO:-/g/Outros computadores/Meu computador/Maiti - PC sincronizado/APPS de IA/NEXO-COMPLETO}"
LIVE="$HOME/.claude"
MODE="${1:-check}"

[[ -d "$REPO" ]] || { echo "✗ REPO não encontrado: $REPO"; exit 1; }

# repo_rel : live_rel
PAIRS=(
  "skills-ativas:skills-library"
  "por-tipo/scripts:scripts"
  "por-tipo/commands:commands"
  "por-tipo/hooks:hooks"
  "por-tipo/agents:agents"
)

c() { printf "\033[%sm%s\033[0m\n" "$1" "$2"; }
rc=0

for pair in "${PAIRS[@]}"; do
  r="$REPO/${pair%%:*}"
  l="$LIVE/${pair##*:}"
  c "36" "── ${pair%%:*}  ↔  ~/.claude/${pair##*:}"
  [[ -d "$r" ]] || { c "33" "   (repo não tem essa pasta — pulando)"; continue; }
  [[ -d "$l" ]] || { c "33" "   (~/.claude não tem essa pasta — pulando)"; continue; }

  case "$MODE" in
    check)
      if diff -rq "$r" "$l" 2>/dev/null; then
        c "32" "   ✓ idênticos"
      else
        rc=1
      fi ;;
    pull) cp -r "$l/." "$r/" && c "32" "   ✓ repo atualizado a partir do que roda" ;;
    push) cp -r "$r/." "$l/" && c "32" "   ✓ ~/.claude atualizado a partir do repo" ;;
    *)    echo "modo inválido: $MODE (use check|pull|push)"; exit 1 ;;
  esac
done

# NEXOFLOW: contrato + doc não moram nas pastas acima
c "36" "── nexoflow (SPEC + doc)"
for f in "nexoflow/ULTRAPLAN-SPEC.md" "NEXOFLOW.md" "secret-patterns.txt"; do
  rf="$REPO/por-tipo/nexoflow/$(basename "$f")"; lf="$LIVE/$f"
  case "$MODE" in
    check) [[ -f "$rf" ]] && diff -q "$rf" "$lf" >/dev/null 2>&1 && c "32" "   ✓ $(basename "$f")" || { c "33" "   ≠ $(basename "$f")"; rc=1; } ;;
    pull)  mkdir -p "$REPO/por-tipo/nexoflow"; cp "$lf" "$rf" && c "32" "   ✓ $(basename "$f")" ;;
    push)  [[ -f "$rf" ]] && { mkdir -p "$(dirname "$lf")"; cp "$rf" "$lf" && c "32" "   ✓ $(basename "$f")"; } ;;
  esac
done

echo ""
[[ $rc -eq 0 && "$MODE" == check ]] && c "32" "═══ tudo em sincronia ═══"
[[ $rc -ne 0 && "$MODE" == check ]] && c "33" "═══ há divergência — 'sync-nexo pull' arquiva o que roda, 'push' publica o repo ═══"
exit $rc
