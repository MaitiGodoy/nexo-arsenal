---
name: nexo-super-orchestrator
description: "Skill de orquestração de subagentes — decide QUAL das 6 estratégias (sequential, parallel, hierarchical, debate, review_loop, graph_dag/handoff) usar pra uma tarefa multi-agente, mapeia cada estratégia pros subagentes REAIS do harness (ferramenta Agent), sempre roda [[nexo-paidocriss]] (economia antes/durante spawn) + [[diagnostico-nexo]] (validação 6 fases depois). Invocar quando o pedido envolve 'spawna vários agentes', 'roda em paralelo', 'debate entre agentes', 'revisão cruzada', 'pipeline de agentes', ou quando o tardis/nexoflow precisar decidir como distribuir uma fase entre subagentes."
license: MIT
---

# Super Orchestrator — orquestração de subagentes

Antes de aceitar o resultado de qualquer subagente como "pronto", consultar
[[nexo-anti-preguica]] — resultado fabricado, stub, ou simulação de retorno de
agente são bloqueio, não nota (ver "Regra de ouro" item 1 abaixo, mesma
exigência).

## Por que esta skill existe (e o que ela NÃO é)

Existe um jeito tentador de "orquestrar subagentes": inventar uma arquitetura
grande (filas, registries, checkpoints, classes Python com nomes bonitos) e
fingir que ela roda. **Isso não é o que esta skill faz.** Aqui não existe
runtime próprio — o único mecanismo real de spawn neste harness é a
ferramenta `Agent` (ou `Task`, dependendo do CLI — ver [[harness-detect]]
dentro de `economy/paidocriss/`). Esta skill é uma **camada de decisão**:
dado um pedido, decide (a) vale a pena spawnar subagente, (b) qual das 6
formas de organizar múltiplos subagentes se aplica, e (c) quais agentes reais
do catálogo local chamar. Nada aqui substitui a ferramenta Agent — só decide
como usá-la bem.

## Quando usar

- A tarefa tem partes genuinamente independentes que cabem em paralelo (busca
  em múltiplos lugares, revisão de múltiplos arquivos não relacionados).
- A tarefa precisa de um papel especialista claro (planner → developer →
  reviewer) em sequência, cada um com contexto próprio.
- Uma decisão se beneficia de perspectivas divergentes forçadas (debate) antes
  de convergir.
- Um resultado precisa de validação cruzada antes de ser aceito (review loop).
- Um fluxo tem dependências em grafo (etapa C só começa depois de A e B).

## Quando NÃO usar

- Tarefa de 1 arquivo / 1 pergunta direta — spawnar agente aqui é overhead
  puro. Resolva direto.
- Quando um único agente com Read/Grep/Glob já resolve em poucas chamadas —
  não fragmente artificialmente só para "parecer orquestração".
- Nunca spawne um subagente para inventar (alucinar) um resultado que você
  poderia simplesmente checar com uma ferramenta direta.

## Passo 0 — economia antes do spawn (obrigatório)

Antes de decidir estratégia, rodar a camada de economia:
1. Ver `economy/paidocriss/SKILL.md` (cópia física local desta skill,
   fonte original em [[nexo-paidocriss]]) — orçamento de tokens da sessão,
   se já existe modelo escolhido, se compressão de contexto é necessária
   antes de abrir mais um agente.
2. Perguntar: "dá pra resolver com Grep/Glob/Read direto, sem agente?" — se
   sim, não chamar Agent. Isso é a mesma disciplina de `llm-free-first`
   aplicada a subagentes: o agente mais barato é o que não é spawnado.
3. Nunca chamar 2 agentes que mexem em modelo/proxy no mesmo turno — mesma
   regra de exclusão mútua do paidocriss.

## As 6 estratégias (mapeadas pros agentes reais deste catálogo)

Escolha automática por palavra-chave do pedido, quando não especificado:

| Palavra-chave no pedido | Estratégia |
|---|---|
| "pesquisar", "buscar em vários lugares", "varre o repo" | **Parallel** |
| "planejar", "arquitetar", "várias fases" | **Hierarchical** |
| "debater", "segunda opinião", "discordar de propósito" | **Debate** |
| "revisar", "validar antes de aceitar", "checar se está certo" | **Review Loop** |
| "fluxo", "pipeline", "etapa depende da anterior" | **Graph/Handoff** |
| "faz isso, depois aquilo, depois aquilo outro" sem paralelismo | **Sequential** |
| nenhuma bateu | Não spawnar — resolver direto ou usar **Hierarchical** só se a tarefa for claramente multi-fase |

### 1. Sequential
Uma cadeia de agentes, saída de um vira entrada do próximo. Ex.: `planner`
(monta plano) → `code-reviewer` (audita o plano) → você mesmo executa.
Sempre com `run_in_background: false` quando o próximo passo depende do
resultado — nunca prosseguir "torcendo" pelo resultado de um agente em
background que ainda não voltou.

### 2. Parallel
Vários agentes independentes, um único `Agent` call com múltiplos blocos de
tool-use na mesma mensagem (conforme regra geral de paralelismo já em vigor
neste harness). Ex.: `explore` em 3 diretórios diferentes ao mesmo tempo,
depois você sintetiza. Nunca declarar resultado de um agente que ainda não
retornou — background = espera notificação real, nunca fabricação.

### 3. Hierarchical (domínio/especialista)
Um agente "mestre" (você, na thread principal) delega fatias por domínio a
especialistas: `architect` (decisão estrutural), `database-reviewer` (schema),
`security-reviewer` (auth/input), `ecc:performance-optimizer` (gargalo). Cada
um roda no seu domínio, você consolida. Usa `planner`/`architect` quando a
fatia é "decidir", `code-reviewer`/`security-reviewer`/`database-reviewer`
quando a fatia é "auditar".

### 4. Debate
Só quando a decisão é genuinamente ambígua e vale forçar divergência. Não
existe "agente pessimista" pronto no catálogo — simular persona dentro do
prompt de um `general-purpose`/`Explore` é aceitável (é instrução de papel,
não fabricação de resultado), mas o resultado de cada lado tem que vir de uma
chamada real, nunca escrito por você "no lugar do agente".

### 5. Review Loop
Depois de qualquer execução não-trivial: `code-reviewer` (qualidade),
`security-reviewer` (segurança) quando a mudança toca auth/input/segredo,
`diff-reviewer` (revisão rápida e barata em Haiku) para mudanças pequenas.
Ver `nucleo/anti-hacker.md` (embarcado no tardis) para o que travar durante
essa revisão.

### 6. Graph / Handoff
Etapas com dependência explícita (A e B alimentam C). Modele como uma
sequência de `Agent` calls onde o prompt de cada etapa inclui literalmente o
resultado das etapas anteriores — não invente um "barramento de estado"
inexistente; o estado é o que você, na thread principal, carrega entre as
chamadas.

## Regra de ouro (não-negociável)

1. **Nunca fabricar retorno de subagente.** Se um agente está rodando em
   background, o resultado só existe quando a notificação chega — não
   prever, resumir ou inventar antes disso (mesma regra já em vigor pra
   Agent/background neste harness).
2. **Um agente por domínio, não um agente genérico pra tudo** — prefira o
   subagente especializado do catálogo (`security-reviewer`,
   `database-reviewer`, etc.) a um `general-purpose` quando existir um
   específico.
3. **Economia primeiro** (Passo 0) — o spawn mais barato é o que não
   aconteceu.
4. **Grande volume de skills/arquivos a tocar = não assumir a lista, checar**
   (grep/glob real) antes de decidir quantos agentes spawnar — mesma
   disciplina anti-premissa do tardis.

## Ver também

- [[nexo-paidocriss]] — cópia física em `economy/paidocriss/` desta
  skill; camada de economia sempre ativa.
- `tardis/nucleo/anti-desperdicio.md` e `tardis/nucleo/anti-hacker.md` —
  critério de quando vale a pena e o que travar durante execução.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
