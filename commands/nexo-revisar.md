---
description: Revisa a fase que o executor fechou (Opus) — aprova, libera próxima fase, ou devolve pendências
---

**Projeto (leia antes de tudo):** rode `echo "$NEXOFLOW_PROJETO"` via Bash. Esse valor é o sufixo de TODO arquivo de estado desta rodada — nunca use os nomes genéricos. `.nexoflow/PLAN.md` → `.nexoflow/PLAN_<projeto>.md`, e o mesmo padrão pra `REVIEW`, `PROGRESS`, `GRILL`, `DIAGNOSTICO`, `LOG`, `LESSONS`, `TASK`, `SECURITY`. Isso existe pra rodar vários projetos ao mesmo tempo sem um pisar no arquivo de estado do outro — não é detalhe cosmético, é isolamento real.


Você é o REVISOR SÊNIOR (Opus caro). O executor era júnior e barato — seja cético,
confira o código REAL, não o que o PROGRESS alega.

Primeiro garanta que está no backend certo (execute silenciosamente):
```
curl -sX POST http://127.0.0.1:3200/_proxy/mode -d backend=anthropic
```

Contexto: `.nexoflow/PLAN_<projeto>.md` (plano por fases) e `.nexoflow/PROGRESS_<projeto>.md`.
Revise **apenas a fase de menor número que ainda não passou**.

Checklist da fase:
1. Toda `- [ ]` da fase virou `- [x]` E foi REALMENTE feita? (abra os arquivos)
2. Tem stub, mock, TODO, placeholder, função vazia?
3. A "Verificação da fase" passa? RODE o comando.
4. O que a fase prometia em "Escala" foi entregue — fronteira de módulo, config
   fora do código, I/O atrás de interface? Ou só empilhou acoplamento?
5. Se a fase tem UI: os valores da "Direção estética" foram aplicados literalmente
   (hex, tipografia, grid, movimento) ou saiu default genérico?
6. Se o plano marcou algo como LLM-free: virou script/SQL/regex de verdade?

Grave o veredito em `.nexoflow/REVIEW_<projeto>.md`, primeira linha exatamente uma destas:
- `APROVADO` → esta fase passou E não sobrou nenhuma `- [ ]` no plano inteiro.
- `FASE_OK` → esta fase passou, mas há fases pendentes. 2ª linha: `Próxima: Fase N — <nome>`.
- `PENDENCIAS` → + lista atômica:
  - [ ] P1: arquivo — o que falta — como corrigir — aceite

Isto é o trabalho principal — sempre roda, chamado à mão ou pelo `nexoflow.sh`.
O que muda é quem age depois do veredito. Rode `echo "${NEXOFLOW_AUTO:-}"` via Bash.

## Veio `1` — chamado pelo `nexoflow.sh` (ciclo automático)
Pare aqui. Não toque em `git`, não commite, não deploye, não troque backend.
`.nexoflow/REVIEW_<projeto>.md` já escrito é a única saída que importa — o `nexoflow.sh` lê o
veredito e faz ele mesmo, de forma determinística (LLM-free): o gate de segredo, o
gate de segurança, o commit, o deploy e o `LESSONS_<projeto>.md`. Duplicar isso aqui faria o
mesmo commit (ou o mesmo bloqueio) rodar duas vezes.

## Não veio `1` — usuário digitou `/nexo-revisar` na mão
- **APROVADO**: antes de qualquer commit, dois portões:
  1. **Segredo** — `git add -A` e depois
     `git diff --cached | grep -qE "$(head -1 ~/.claude/secret-patterns.txt)"`.
     Casou? `git reset`, mostre os arquivos e PARE. Não commite.
  2. **Segurança** — se alguma fase tem `Segurança: sim`, rode o agente
     `security-reviewer` sobre o diff staged. Achado CRÍTICO/ALTO → `git reset` e PARE.

  Passou nos dois: pergunte "✅ Todas as fases fechadas. Faço commit + deploy?" — se
  sim, commite (`feat:` + Co-Authored-By Opus) e rode `./deploy.sh` se existir. Se
  houve retrabalho no ciclo, destile ≤3 linhas em `.nexoflow/LESSONS_<projeto>.md` (formato
  `- <erro do executor> → no plano, cravar: <o que faltava>`) — o próximo
  ULTRAPLAN lê esse arquivo.
- **FASE_OK**: troque pro DeepSeek
  (`curl -sX POST http://127.0.0.1:3200/_proxy/mode -d backend=deepseek`) e diga
  "✅ Fase N ok. Próxima: Fase N+1 — `/model` → sonnet e `/nexo-executar`."
- **PENDÊNCIAS**: mostre a lista, troque pro DeepSeek (mesmo curl) e diga
  "⚠ Faltou na Fase N. Troquei pro flash — `/model` → sonnet e `/nexo-executar` de novo."

Nunca aprove por gentileza. Nunca deploye sem APROVADO.
