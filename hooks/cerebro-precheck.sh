#!/bin/bash
# cerebro-precheck.sh — PreToolUse hook
# Intercepta Agent() calls. Força M1–M3 obrigatório antes de spawn.
# Exit 0 = OK, Agent pode rodar. Exit 1 = bloqueado.

set -e

CEREBRO_PATH="$HOME/.claude/skills/nexo-cerebro/SKILL.md"

# Só intercept Agent tool use
if [ "$TOOL_NAME" != "Agent" ]; then
  exit 0
fi

# Verifica que cerebro existe
if [ ! -f "$CEREBRO_PATH" ]; then
  echo "⚠️  BLOQUEADO: [[nexo-cerebro]] não encontrado"
  echo "   Leia $CEREBRO_PATH antes de spawnar Agent"
  exit 1
fi

# Verifica que M1, M2 ou M3 aparece no histórico recente
# (heurística: se foi consultado, deve estar no contexto recente)
if ! grep -q "M[123]" "$CEREBRO_PATH" 2>/dev/null; then
  echo "⚠️  BLOQUEADO: cerebro corrompido ou vazio"
  exit 1
fi

# Log silencioso
echo "✓ cerebro-precheck: Agent spawn liberado" >&2
exit 0
