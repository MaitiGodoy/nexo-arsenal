#!/usr/bin/env bash
# precompact-preserve.sh — hook PreCompact.
# Quando o auto-compact nativo roda, imprime um bloco "PRESERVAR:" com o caminho do PLAN.md ativo
# e a lista de arquivos modificados na sessão, p/ o resumo não perder o fio da meada.
# Contrato: JSON no stdin (ignorado); saída em stdout entra no contexto preservado.
set -euo pipefail
cat >/dev/null || true

echo "PRESERVAR:"

# PLAN.md ativo (procura no cwd e em .nexoflow/)
for p in "./.nexoflow/PLAN.md" "./PLAN.md"; do
  [ -f "$p" ] && echo "  - plano ativo: $p"
done

# arquivos modificados na sessão (git, se em repo)
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "  - arquivos modificados (git):"
  git status --porcelain 2>/dev/null | sed 's/^/      /' | head -40
fi
exit 0
