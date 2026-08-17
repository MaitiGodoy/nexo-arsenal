---
name: nexoflow
description: Economia de token em tarefas de implementação/refatoração multi-step. Use quando o usuário pede pra construir feature, corrigir bug complexo, refatorar módulo, criar worker/endpoint/tela — em vez de gastar Opus fazendo tudo, orquestra Opus (planeja/revisa) + DeepSeek flash (executa) num ciclo. Triggers: "implementa", "cria", "adiciona feature", "refatora", "constrói", "corrige bug".
---

# NEXOFLOW — orquestração pra economizar token

Quando a tarefa é de **implementação não-trivial** (múltiplos passos/arquivos), NÃO
faça tudo você mesmo no modelo caro. Ofereça (ou dispare) o ciclo NEXOFLOW: Opus só
planeja e revisa, DeepSeek flash faz o grosso.

## Como decidir
- Tarefa trivial (1 arquivo, 1 edição óbvia) → faça direto, não vale o ciclo.
- Tarefa multi-step (feature, refactor, bug com investigação, vários arquivos) → **ofereça o NEXOFLOW**.

## O que fazer
Diga ao usuário, curto:
"Isso é multi-step. Rodo no ciclo NEXOFLOW pra economizar token (Opus planeja,
DeepSeek executa, Opus revisa)? — `nexoflow \"<tarefa>\"` roda tudo sozinho,
ou `/ultraplan` se quiser guiar na mão."

Se o usuário topar OU já tiver pedido pra economizar token:
```bash
bash ~/.claude/scripts/nexoflow.sh "<descrição da tarefa>"
```
Depois reporte: veredito final, nº de iterações, se commitou/deployou. Se gerou
`.nexoflow/DIAGNOSTICO.md`, resuma o que falta.

## Modo manual (se preferir passo a passo)
`/ultraplan <tarefa>` → `/model` sonnet → `/executar` → `/anthropic` → `/model` opus → `/revisar`

## Requisito
Proxy local :3200 rodando (troca Opus↔DeepSeek). Off? `deepseek-proxy/start.bat`.
Detalhes: `~/.claude/NEXOFLOW.md`.

## NÃO faça
- Não dispare o ciclo pra pergunta/leitura/tarefa trivial — só implementação real.
- Não deploye sem o review retornar APROVADO.
