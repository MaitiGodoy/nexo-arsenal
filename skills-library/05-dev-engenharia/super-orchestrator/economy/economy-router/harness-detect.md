---
name: harness-detect
description: "Camada de detecção de harness compartilhada — como cada skill de economia de token descobre em qual CLI está rodando (Claude Code, Qwen Code, OpenCode, Gemini CLI, Muse Code, Grok Code) antes de assumir comando/arquivo nativo. Fonte única — as 5 skills que precisam disso linkam pra cá em vez de duplicar a tabela."
metadata:
  type: reference
---

# Harness Detect — fonte única

Todas as skills de `11-token-economy-meta` que hoje assumem Claude Code
(`settings.local.json`, `/model`, `/compact`, `rtk` como proxy do Claude) devem
rodar este passo 0 antes de qualquer ação que dependa de arquivo/comando nativo.
Não duplicar esta tabela em cada SKILL.md — linkar `[[harness-detect]]`.

## Passo 0 — detectar harness atual

Checar nesta ordem e usar o primeiro que bater (não assumir Claude Code por padrão):

| Harness | Como detectar | Config/estado | Troca de modelo | Compressão de contexto |
|---|---|---|---|---|
| Claude Code | var `CLAUDECODE` presente, ou `~/.claude/settings.local.json` é a config ativa da sessão | `~/.claude/settings.local.json` (campo `model`, bloco `env`) | `/model <nome>` ou editar `settings.local.json` | `/compact` |
| Qwen Code | `~/.qwen/` é a config ativa | ver config própria do Qwen CLI (schema diferente — não copiar path do Claude) | checar `--help` do CLI antes de assumir flag | checar `/compress` ou equivalente — testar antes |
| OpenCode | `~/.opencode/` é a config ativa | schema próprio do OpenCode | comando próprio (não é `/model`) | comando próprio |
| Gemini CLI | `~/.gemini/` é a config ativa | schema próprio | comando próprio | comando próprio |
| Muse Code | config própria (`~/.muse/` ou equivalente) | schema próprio | comando próprio | comando próprio |
| Grok Code | config própria | schema próprio | comando próprio | comando próprio |
| Desconhecido | nenhum dos acima bateu | não assumir nada — perguntar ou degradar pro fallback genérico abaixo | — | — |

**Regra:** se não tiver certeza do comando/flag certo do harness detectado, não
inventar — testar com `--help` do próprio CLI ou checar a doc antes de disparar.
Isso vale pra troca de modelo, compressão de contexto, ou qualquer ação
"nativa" que uma skill queira automatizar.

## Fallback genérico (harness desconhecido ou sem API própria)

Quando não dá pra automatizar (nenhum comando nativo identificado com segurança):
1. Não fingir que a ação rodou.
2. Gerar aviso com a ação manual exata que o usuário precisa fazer nesse CLI
   específico (nome do harness detectado + o que copiar/colar).
3. Rotular claramente como "não automatizado neste harness" — nunca deixar
   implícito que funcionou.

## O que É universal (independe de harness)

Estas partes das skills de economia NÃO precisam de detecção, porque operam
fora do harness:
- **RTK** (`rtk.exe`) — proxy de shell, funciona em qualquer terminal, não é
  Claude-specific. Só a integração de hook automático (`rtk git status` etc)
  é que pode variar por harness.
- **SQL/regex/CLI/cache** (`llm-free-first`) — são técnicas de código, não
  dependem do harness que está orquestrando.
- **Escolha de modelo por tipo de tarefa** (a lógica "coding→modelo forte,
  chat→modelo leve") — o raciocínio é universal, só o comando pra executar a
  troca é que muda por harness (ver tabela acima).

## Uso nas skills

Cada skill que assume Claude Code deve, antes do passo que usa comando/arquivo
nativo, adicionar uma linha: "Passo 0: detectar harness — ver [[harness-detect]].
Se não for Claude Code, adaptar comando/path conforme a tabela; se harness
desconhecido, usar o fallback genérico."
