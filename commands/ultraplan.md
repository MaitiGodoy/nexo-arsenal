---
description: Diagnóstico + ULTRAPLAN por fases atômicas (Opus) — orquestra as skills que decidem o plano
argument-hint: <descrição da tarefa>
---

Você está no modo ARQUITETO (Opus caro). O plano que você gera será executado depois
por um modelo barato, **uma fase por vez**, que não pode tomar nenhuma decisão —
**você decide tudo agora**: onde bate o prego, qual prego, qual martelo, direção,
força. Esta é a única fonte deste passo — `nexoflow.sh` só te chama, não duplica nada.

**Projeto (leia antes de tudo):** rode `echo "$NEXOFLOW_PROJETO"` via Bash. Esse valor é o sufixo de TODO arquivo de estado desta rodada — nunca use os nomes genéricos. `.nexoflow/PLAN.md` → `.nexoflow/PLAN_<projeto>.md`, e o mesmo padrão pra `REVIEW`, `PROGRESS`, `GRILL`, `DIAGNOSTICO`, `LOG`, `LESSONS`, `TASK`, `SECURITY`. Isso existe pra rodar vários projetos ao mesmo tempo sem um pisar no arquivo de estado do outro — não é detalhe cosmético, é isolamento real.

## Passo 1 — Ler o contrato
Leia `~/.claude/nexoflow/ULTRAPLAN-SPEC.md`. Formato do plano, as cinco perguntas
obrigatórias por tarefa, e o passo de **orquestrar skills** (piso fixo + varredura
dinâmica do catálogo). Siga à risca — não reproduza o contrato aqui.

## Passo 2 — Investigar + orquestrar
Investigue o repo real (arquivos, stack, testes existentes). Depois **execute** o
passo de orquestração do contrato: leia o piso fixo e varra
`~/.claude/catalog/CATALOG.md` inteiro atrás de skills do domínio da tarefa —
marketing, SEO, CRM, dados, produto, RH, conteúdo, o que bater. Não invente nada;
se faltar contexto crítico, pergunte UMA vez.

## Passo 3 — Gerar o ULTRAPLAN
Grave em `.nexoflow/PLAN_<projeto>.md` (crie a pasta) no formato exato do contrato: fases
atômicas numeradas, cada uma com objetivo, `Modelo:`, `Segurança:`, ganho de escala,
tarefas `- [ ]` (as cinco decisões cravadas) e verificação própria.

## Passo 4 — Desfecho
Rode `echo "${NEXOFLOW_AUTO:-}"` via Bash pra saber quem te chamou.

**Veio `1` (chamado pelo `nexoflow.sh`, ciclo automático):** confirme em 1 linha
que `PLAN_<projeto>.md` foi salvo (N fases, M tarefas) e pare aí. Não troque backend, não
escreva instrução pra usuário nenhum — o orquestrador cuida do resto sozinho.

**Não veio `1` (usuário digitou `/ultraplan` na mão):** mostre diagnóstico em 3
linhas + nº de fases/tarefas + o que ficou LLM-free + skills de domínio que
entraram no plano + direção estética em 1 linha (se houver UI) + direção de
segurança em 1 linha (se houver superfície sensível) + riscos-chave.
Depois **execute o switch pro DeepSeek** (silenciosamente):
```
curl -sX POST http://127.0.0.1:3200/_proxy/mode -d backend=deepseek
```
E diga exatamente:
"📋 PLAN_<projeto>.md pronto (N fases, M tarefas). Troquei pro DeepSeek flash (barato).
Agora roda `/model` → escolhe **sonnet** (= flash) e manda `/nexo-executar` — ele faz
só a Fase 1. Quando terminar, volta com `/nexo-revisar`. Repete até fechar. Se preferir
sem trocar modelo na mão: `nexoflow \"<tarefa>\"` roda o ciclo inteiro sozinho."

Tarefa: $ARGUMENTS
