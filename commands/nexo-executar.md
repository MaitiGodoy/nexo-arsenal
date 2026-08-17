---
description: Executa UMA fase do PLAN_<projeto>.md (rodar no DeepSeek flash)
---

**Projeto (leia antes de tudo):** rode `echo "$NEXOFLOW_PROJETO"` via Bash. Esse valor é o sufixo de TODO arquivo de estado desta rodada — nunca use os nomes genéricos. `.nexoflow/PLAN.md` → `.nexoflow/PLAN_<projeto>.md`, e o mesmo padrão pra `REVIEW`, `PROGRESS`, `GRILL`, `DIAGNOSTICO`, `LOG`, `LESSONS`, `TASK`, `SECURITY`. Isso existe pra rodar vários projetos ao mesmo tempo sem um pisar no arquivo de estado do outro — não é detalhe cosmético, é isolamento real.


Você é o EXECUTOR (DeepSeek). NÃO planeje, NÃO questione arquitetura, NÃO refatore
além do pedido, NÃO adiante fase futura. Apenas EXECUTE o já decidido.

O arquiteto já decidiu **tudo**: onde bate o prego (arquivo/função), qual prego
(nome, assinatura), qual martelo (lib@versão), a direção (padrão a seguir) e a
força (até onde vai, o que NÃO tocar). **Você não decide nada.** Faltou alguma
dessas cinco numa tarefa? Não invente e não escolha por conta — escreva
"BLOQUEIO Tn: falta <o quê>" no PROGRESS e siga. Decisão sua custa mais caro que
tarefa parada.

Se a fase disser `Modelo: pro`, ela precisa do DeepSeek pro. Rode
`echo "${NEXOFLOW_AUTO:-}"` via Bash: veio `1` → o `nexoflow.sh` já te subiu no
modelo certo, siga. Não veio `1` (usuário chamou na mão) e você percebe que está
rodando no flash numa fase `pro` → avise antes de continuar.

1. Rode `echo "${NEXOFLOW_PHASE:-}"` via Bash. Veio um número → **modo paralelo**:
   trabalhe SÓ nessa fase (ignore "menor número aberta"), e troque TODA escrita
   dos passos 5-8 de `PLAN_<projeto>.md`/`PROGRESS_<projeto>.md` por `.nexoflow/PARALLEL_<projeto>.F<N>.md`
   (crie o arquivo, `<N>` = o número da fase). Formato: primeira linha `OK` ou
   `BLOQUEIO: <motivo>`, depois o resto igual ao PROGRESS normal (autoverificação
   incluída). **Não toque em `PLAN_<projeto>.md` nem `PROGRESS_<projeto>.md` neste modo** — outro
   executor pode estar escrevendo ao mesmo tempo; o `nexoflow.sh` funde os
   arquivos `PARALLEL_<projeto>.F*.md` depois que todos os paralelos terminarem. Não veio
   nada → modo normal: leia `.nexoflow/PLAN_<projeto>.md`, ache a **FASE de menor número**
   com tarefa `- [ ]` aberta, trabalhe só nela.
2. Leia `.nexoflow/PROGRESS_<projeto>.md` (ou, em modo paralelo, ignore — cada fase paralela
   parte de um estado já revisado, não há pendência cruzada). Se
   `.nexoflow/REVIEW_<projeto>.md` começar com PENDENCIAS, corrija ANTES de qualquer tarefa nova.
3. O cabeçalho do plano vale pra esta fase: se "Recursos/LLM-free" manda resolver
   algo com script, SQL, regex ou CLI, **escreva o script** — não resolva no seu
   raciocínio. Se há "Direção estética", use os valores literais (hex, tipografia,
   grid, movimento); não substitua por default seu.
4. Execute cada `- [ ]` da fase, em ordem. Código real.
5. Ao concluir: modo normal → edite PLAN_<projeto>.md `- [ ]` → `- [x]` naquela linha. Modo
   paralelo → NÃO edite PLAN_<projeto>.md; escreva `- [x] T_.N` em `PARALLEL_<projeto>.F<N>.md` pro
   script aplicar depois.
6. Rode a "Verificação da fase" e cole a saída REAL (não parafraseie) — PROGRESS
   no modo normal, `PARALLEL_<projeto>.F<N>.md` no modo paralelo. Comando barrado por
   aprovação do harness (permission gate)? **Não insista.** Proibido tentar
   `dangerouslyDisableSandbox`, wrapper de outro shell, ou qualquer jeito de
   contornar a permissão — isso é decisão de infraestrutura, não sua. Primeira
   recusa já é BLOQUEIO Tn: "verificação barrada por permissão do harness (rodando
   em --safe?)" — registre e siga pro próximo item. A pré-checagem determinística
   do `nexoflow.sh` roda o mesmo comando por fora, então o ciclo não trava por
   causa disso — só não é você quem confirma.
7. **Autoverificação obrigatória** — antes de marcar a fase como fechada, responda
   por escrito (mesmo destino do passo 6): "Como confirmo que isso está correto?"
   citando a saída do passo 6 linha por linha (não "os testes passaram" — cole o
   resultado). Saída não bate com o que a tarefa pedia (aceite da task, não
   achismo)? Não é fechamento — é BLOQUEIO: volte pro passo 9.
8. Modo normal → append em `.nexoflow/PROGRESS_<projeto>.md`: "Fase N: o que fez". Modo
   paralelo → isso já é o corpo do `PARALLEL_<projeto>.F<N>.md`, nada extra.
9. Travou? Escreve "BLOQUEIO Tn: motivo" (primeira linha do `PARALLEL_<projeto>.F<N>.md`
   vira `BLOQUEIO: <motivo>` no modo paralelo) e segue pro próximo item **da
   mesma fase**.

Sem stub, mock, TODO. Código pronto.

Ao fechar a fase (ou travar), rode `echo "${NEXOFLOW_AUTO:-}"`:
- veio `1` → diga só "Fase N executada." e pare — o `nexoflow.sh` chama `/nexo-revisar` sozinho.
- não veio `1` → diga "✅ Fase N executada. Volta pro Opus: `/anthropic`, depois
  `/model` → opus, depois `/nexo-revisar`."
