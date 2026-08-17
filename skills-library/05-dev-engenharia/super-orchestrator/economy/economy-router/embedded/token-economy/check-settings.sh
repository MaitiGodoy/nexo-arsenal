#!/bin/bash
# SessionStart hook — roda 1x automaticamente no início de TODA sessão nova.
# Confere silenciosamente a config de economia de token e avisa (stderr) só se algo faltar.
# NAO reconfigura sozinho (evita surpresa); só avisa.

SETTINGS="$HOME/.claude/settings.local.json"
ISSUES=()

# 1. Settings existe?
if [ ! -f "$SETTINGS" ]; then
  ISSUES+=("settings.local.json não existe — economia de token não está ativa")
else
  # 2. Env vars essenciais presentes?
  grep -q "ENABLE_PROMPT_CACHING_1H" "$SETTINGS" 2>/dev/null || ISSUES+=("ENABLE_PROMPT_CACHING_1H ausente")
  grep -q "CLAUDE_CODE_SUBAGENT_MODEL" "$SETTINGS" 2>/dev/null || ISSUES+=("CLAUDE_CODE_SUBAGENT_MODEL ausente")
  grep -q "MAX_THINKING_TOKENS" "$SETTINGS" 2>/dev/null || ISSUES+=("MAX_THINKING_TOKENS ausente")

  # 3. Modelo não é Haiku como default (lição aprendida)
  if grep -q '"model": "claude-haiku' "$SETTINGS" 2>/dev/null; then
    ISSUES+=("⚠️  Modelo default é Haiku — Haiku não é recomendado pra coding, considerar Sonnet")
  fi
fi

# 4. .claudeignore no projeto atual?
if [ -f "package.json" ] || [ -f "requirements.txt" ] || [ -d "node_modules" ] || [ -d ".git" ]; then
  if [ ! -f ".claudeignore" ]; then
    ISSUES+=(".claudeignore ausente neste projeto — pode estar indexando node_modules/build/lock files")
  fi
fi

# Só imprime se houver problema (silencioso quando tudo ok)
if [ ${#ISSUES[@]} -gt 0 ]; then
  echo "" >&2
  echo "🔋 Token Economy — itens pendentes desta sessão:" >&2
  for issue in "${ISSUES[@]}"; do
    echo "  • $issue" >&2
  done
  echo "  → Rode a skill token-economy (audit) pra corrigir." >&2
  echo "" >&2
fi

exit 0
