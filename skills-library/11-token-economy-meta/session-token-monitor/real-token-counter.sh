#!/bin/bash
# REAL Token Counter — estima tokens REAIS gastos nessa sessão
# Baseado em: tamanho de resposta Claude + contexto carregado

SESSION_TOKEN_LOG="$HOME/.claude/.session-tokens-real.log"
CONTEXT_LOG="$HOME/.claude/.context-inflation.log"

# Inicializa em novo estado
if [ ! -f "$SESSION_TOKEN_LOG" ]; then
  {
    echo "session_started=$(date +%s)"
    echo "tokens_claude_responses=0"
    echo "tokens_context=0"
    echo "tokens_tools=0"
    echo "tokens_total=0"
  } > "$SESSION_TOKEN_LOG"
fi

# ============================================
# PARTE 1: Estimar tokens das MINHAS (Claude) respostas
# ============================================
# Heurística: resposta Claude = ~1 token por 4 caracteres (média observada)
# Isso é APROXIMADO mas baseado em padrão real

estimate_claude_tokens() {
  # Se houver arquivo de última resposta, ler
  if [ -f "$HOME/.claude/.last-response-size.txt" ]; then
    last_size=$(cat "$HOME/.claude/.last-response-size.txt")
    # 1 token Claude ≈ 4 caracteres (observação real)
    tokens=$((last_size / 4))

    # Limpar arquivo
    rm "$HOME/.claude/.last-response-size.txt"

    echo "$tokens"
  else
    echo "0"
  fi
}

# ============================================
# PARTE 2: Estimar tokens de CONTEXTO carregado
# ============================================
# Heurística: linha de histórico/conversa = 1.3 tokens (média observada)

estimate_context_tokens() {
  # Contar linhas do histórico da sessão
  if [ -f "$HOME/.claude/sessions/.current-session.log" ]; then
    lines=$(wc -l < "$HOME/.claude/sessions/.current-session.log")
    # Histórico da conversa ≈ 1.3 tok/linha
    tokens=$((lines * 13 / 10))  # Evita ponto flutuante
    echo "$tokens"
  else
    # Se não houver log, usar contexto desta resposta (aproximação)
    # Sistema prompt + rules/ecc ≈ 2000-3000 tokens
    echo "2500"
  fi
}

# ============================================
# PARTE 3: Estimar tokens de TOOLS chamadas
# ============================================
# Heurística: cada tool call = ~200 tokens (entrada + output)

estimate_tools_tokens() {
  if [ -f "$HOME/.claude/.tool-calls.count" ]; then
    calls=$(cat "$HOME/.claude/.tool-calls.count")
    # Cada tool ≈ 200 tokens
    tokens=$((calls * 200))
    echo "$tokens"
  else
    echo "0"
  fi
}

# ============================================
# CALCULAR E ATUALIZAR
# ============================================

claude_toks=$(estimate_claude_tokens)
context_toks=$(estimate_context_tokens)
tools_toks=$(estimate_tools_tokens)
total_toks=$((claude_toks + context_toks + tools_toks))

# Atualizar arquivo de log
{
  echo "session_started=$(grep 'session_started' $SESSION_TOKEN_LOG | cut -d= -f2)"
  echo "tokens_claude_responses=$claude_toks"
  echo "tokens_context=$context_toks"
  echo "tokens_tools=$tools_toks"
  echo "tokens_total=$total_toks"
  echo "last_update=$(date +%s)"
} > "$SESSION_TOKEN_LOG"

# Mostrar status (silent, só log)
# echo "[$(date +%H:%M:%S)] Total: $total_toks tok (Claude: $claude_toks, Context: $context_toks, Tools: $tools_toks)" >> "$HOME/.claude/.session-tokens-real.log"

# Se ultrapassou 400K (buffer antes de 500K), avisar
if [ "$total_toks" -gt 400000 ]; then
  {
    echo ""
    echo "⚠️  APPROACHING TOKEN LIMIT"
    echo "├─ Estimated tokens: $total_toks"
    echo "├─ Context inflation: $context_toks tokens"
    echo "├─ Claude responses: $claude_toks tokens"
    echo "├─ Tools overhead: $tools_toks tokens"
    echo "└─ 💡 Suggest: Open new session at ~500K"
    echo ""
  } >&2
fi
