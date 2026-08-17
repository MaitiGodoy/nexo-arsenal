# Nexoflow — execução por fases atômicas com custo roteado

Motor de execução do Setup Nexo para qualquer tarefa não-trivial: papéis
(planejador/executor/revisor/auxiliar) rodam como agentes internos da sessão
Claude Code atual, via `Task` (ver `agentes/mapa.json`).

## Isto NÃO é o Nexoflow real — relação com `~/.claude/skills/nexoflow`

Esta seção usava o nome "Nexoflow" pra um mecanismo diferente do real, sem
avisar — corrigido em 2026-08-02. O Nexoflow de verdade (`~/.claude/skills/
nexoflow/SKILL.md`) troca de **backend de modelo** (Opus planeja/revisa,
DeepSeek flash executa via proxy local `:3200`, `bash ~/.claude/scripts/
nexoflow.sh "<tarefa>"`) — um processo **externo e separado** da sessão atual.
O ciclo de papéis abaixo troca de **agente** (Task/subagente), sempre rodando
como Claude, dentro da mesma sessão — os dois são mecanismos diferentes que
resolvem o mesmo problema (economizar token em implementação multi-step) de
formas diferentes.

`motor/roteador.js` já resolve papel→backend contra `config/nexo.config.json`
(inclusive o proxy DeepSeek em `127.0.0.1:3200`), mas **nunca aciona a troca
de verdade** — de propósito: trocar de backend/modelo no meio da sessão atual
invalida o prompt cache inteiro (ver `token-economy`/`model-switch-strategy`
no stack global, e `CLAUDE.md`: "Não trocar modelo/effort/fast-mode no meio
da sessão"). Por isso a decisão entre os dois é feita **uma vez, na Etapa 1**
do protocolo de entrada, antes de qualquer fase abrir — `motor/nexoflow.js`
faz um health-check real do proxy `:3200` e, se a tarefa é multi-step e o
proxy está no ar, o hook de entrada oferece rodar `nexoflow.sh` externo em vez
de abrir `PLANO.md` com papéis internos. Nunca troca backend por fase.

## Papéis (definidos em `config/nexo.config.json` → `modelos`)

| Papel | Faz | Modelo padrão |
|---|---|---|
| Planejador | Investiga, decide as fases, escreve `PLANO.md` | caro/raciocínio |
| Executor | Implementa **uma fase por vez**, sem decidir nada novo | barato/rápido |
| Revisor | Audita a fase entregue, aprova ou devolve | caro/raciocínio |
| Auxiliar | Varredura, verificação de critério, extração de lição | muito barato |

O backend concreto por trás de cada papel é resolvido em `motor/roteador.js`
contra `config/nexo.config.json` → `backends`. Trocar de DeepSeek para outro
provedor é editar a config, nunca o protocolo.

## Formato do plano (`PLANO.md` do projeto em execução)

- **Fase 0**: sempre a definição do critério de aceite/teste que hoje falha.
  Nenhuma fase de implementação começa sem isso.
- **Fase 1..N**: cada uma com:
  - `Objetivo:` uma frase, escopo fechado.
  - `Arquivos:` lista fechada.
  - `Modelo:` executor barato | executor com raciocínio (quando a fase exige
    decisão não-trivial, o planejador já resolveu as decisões — o executor
    nunca escolhe arquitetura sozinho).
  - `Segurança:` sim/não — se sim, a fase passa pelo portão de revisão de
    segurança antes do commit.
  - `Aceite:` o comando ou verificação que prova que a fase terminou.

Nenhuma fase adjetiva ("robusto", "moderno", "escalável") sem um valor
concreto por trás — se o executor precisaria escolher algo, o plano está
incompleto e volta para o planejador.

## Ciclo (roda sozinho, sem o usuário chamar nada)

```
1. Planejador lê o pedido já refinado (02) + investigação (01) → grava PLANO.md
2. Para a fase aberta de menor número:
     a. Executor implementa só essa fase, marca [x], roda o Aceite
     b. Revisor audita: aprovado | fase_ok | pendências
     c. pendências → repete a mesma fase (até `fase_max_repeticoes`)
        fase_ok → avança
        aprovado final → sai do ciclo
3. Ciclo trava em `ciclo_max_iteracoes` — se não convergir, grava
   .nexo/DECISOES.md com o motivo e pausa para o usuário decidir, em vez de
   girar infinitamente gastando token.
4. Houve retrabalho (alguma pendência no caminho)? Auxiliar destila em até
   3 linhas para .nexo/LICOES.md.
5. Portões de segurança (07-seguranca.md) → commit.
```

## Escolha de agente/subagente — sempre automática, nunca do usuário nem fixa

Papel (planejador/executor/revisor/auxiliar) não é o mesmo que agente
concreto. `agentes/mapa.json` mapeia cada um dos agentes portados para um
papel **e** um domínio (campo `motivo`) — ex.: papel revisor tem
`python-reviewer`, `react-reviewer`, `typescript-reviewer`, `database-reviewer`
como opções, cada um dono de um domínio diferente. A escolha de qual agente
concreto entra em cada fase:

- É decidida pela IA, sozinha, cruzando o domínio da fase com o campo
  `motivo` de `agentes/mapa.json` — nunca perguntada ao usuário, nunca
  assumida por padrão.
- Muda por fase. Uma sessão que mexe em Python numa fase e em React na
  próxima troca de agente revisor entre as duas — ficar preso no mesmo
  agente do início ao fim da sessão é o erro que esta regra existe para
  evitar.
- Prioriza delegar via `Task` ao agente/papel certo em vez de fazer tudo na
  thread principal — thread principal decide e escreve (ver
  `rules/ecc/common/agents.md` do stack global), o trabalho mecânico de cada
  fase é do agente delegado.
- Se nenhum agente do mapa casa com o domínio da fase, usa o papel genérico
  mais próximo (ex.: `code-reviewer` para revisor sem linguagem específica
  mapeada) — nunca trava a fase esperando um agente que não existe.

## Regra de ouro

O executor nunca improvisa fora do que a fase descreve. Se falta uma decisão
para continuar, ele registra o bloqueio e para aquela fase — não inventa.
