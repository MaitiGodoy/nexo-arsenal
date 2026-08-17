---
name: auto-context-compress
description: "Comprime o contexto sozinha a cada ~100k tokens queimados na sessão, detectando o comando de compressão do harness atual (Claude Code, Qwen, OpenCode, Gemini, Hermes). Se não conseguir rodar automático, gera aviso bem chamativo com a instrução exata. Também dispara preventivo se a sessão está perto de 100k e a próxima tarefa vai estourar muito. Invocar/checar a cada resposta longa ou antes de tarefa grande."
argument-hint: "check | force | status"
license: MIT
---

# Auto Context Compress

Camada que FORÇA a ação que [[session-token-monitor]] só mede e [[strategic-compact]]
só sugere. Não duplica contagem — lê a mesma fonte que `session-token-monitor` já grava.

## Fonte de dados (não recriar)

`~/.claude/.session-tokens-real.log` — heurística chars/4 já mantida pela skill
`session-token-monitor`. Se esse arquivo não existir (harness sem esse hook), cair
pro fallback de contagem grosseira: linhas do histórico da sessão × 1.3 (mesma
heurística, calculada na hora).

## Passo 1 — detectar comando de compressão do harness atual

Não assumir Claude Code. Checar nesta ordem e usar o primeiro que existir:

| Harness | Como detectar | Comando de compressão |
|---|---|---|
| Claude Code | variável `CLAUDECODE`/presença de `~/.claude/` ativo na sessão | `/compact` (nativo) |
| Qwen Code | `~/.qwen/` na árvore de config ativa | checar `/compress` ou equivalente no CLI (varia por versão — testar `--help` do CLI antes de assumir) |
| OpenCode | `~/.opencode/` | checar comando próprio (schema é diferente do Claude, não copiar — ver [[config-cli-nao-e-copia-do-claude]]) |
| Gemini CLI / Hermes | `~/.gemini/` / `~/.hermes/` | checar comando próprio |
| Desconhecido | nenhum dos acima | não existe compressão automática — pular direto pro aviso chamativo (Passo 3) |

Se não tiver certeza do comando certo do harness, **não inventar flag** — testar
com `--help` ou documentação do próprio CLI antes de disparar.

## Passo 2 — gatilho automático (a cada 100k)

1. Ler o total estimado da sessão.
2. Se `total >= 100000` desde a última compressão registrada: disparar o comando
   de compressão detectado no Passo 1, sem perguntar.
3. Registrar o ponto de corte (`~/.claude/.last-compress-marker`, só um número/
   timestamp) pra próximo gatilho ser em +100k a partir daqui, não do zero.
4. Se o comando rodou com sucesso: uma linha só confirmando, seguir a tarefa.

## Passo 3 — se a compressão automática falhar

Não silenciar o erro. Gerar bloco chamativo no output, algo como:

```
⚠️⚠️⚠️ COMPRIMIR CONTEXTO — já gastamos ≈XXXk tokens nesta sessão ⚠️⚠️⚠️
Comando não pôde rodar sozinho neste harness (<motivo>).
Rode agora: <comando exato pro harness detectado>
```

Isso tem que ser visualmente impossível de ignorar — não uma linha discreta no meio
de outro texto.

## Passo 4 — gatilho preventivo (antes de tarefa grande)

Se a sessão já passou de ~80k E a tarefa que acabou de chegar é claramente grande
(multi-arquivo, multi-fase, pedido explícito de "implementa/refatora/audita tudo"):
1. Tentar compressão automática ANTES de começar a tarefa.
2. Se falhar, **bloquear** — não começar a tarefa — e pedir pro usuário compactar
   manualmente primeiro, com o comando exato.

## Regra de honestidade

O número de tokens usado aqui é sempre heurístico (herdado de `session-token-monitor`).
Rotular como estimativa no aviso, nunca como contagem oficial exata.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
