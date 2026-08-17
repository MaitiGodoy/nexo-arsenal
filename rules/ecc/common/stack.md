# Regras do stack (ECC) — condensado

> Consolidado em 2026-08-17. Os 10 arquivos anteriores viraram este.
> Cortado: conselho generico de engenharia (KISS/DRY/YAGNI, AAA, coverage 80%,
> "nao hardcode senha", padrao Repository) — o modelo ja sabe e custava 12 KB
> por sessao. Mantido: so o que e' especifico deste ambiente.

## Pesquisa antes de escrever (obrigatorio)

Antes de implementar algo novo, nesta ordem:
1. `gh search repos` / `gh search code` — existe implementacao pronta?
2. Doc oficial da lib (Context7 ou vendor) — confirma API e versao
3. Registro de pacote (npm, PyPI, crates.io) — prefira lib testada a codigo proprio
4. Exa/web so quando 1-3 nao bastarem

Adotar/portar solucao provada > escrever do zero.

## Escolha de modelo

| Modelo | Quando |
|---|---|
| Haiku | agente leve, fan-out, varredura, verificacao — 90% da capacidade, 1/3 do custo |
| Sonnet | desenvolvimento principal, orquestracao |
| Opus | decisao arquitetural, analise profunda, plano para executor cego |

Nao trocar modelo/effort no meio da sessao — invalida o prompt cache.

## Delegacao a subagente

Thread principal DECIDE e ESCREVE. Delegue o resto:

| Tarefa | Agente |
|---|---|
| varrer muitos arquivos | `nexo-explore` (Haiku) |
| revisar diff | `nexo-diff-reviewer` (Haiku) |
| rodar criterio de aceite | `nexo-verifier` (Haiku) |
| revisao de seguranca | `security-reviewer` (Haiku) |
| planejar / arquitetar | `planner` / `architect` (herdam o modelo) |

Subagente devolve resumo -> janela principal fica enxuta.

## Hooks

Regra em texto e' pedido; hook e' mecanismo. Se uma regra importa de verdade,
ela vira hook em `settings.json` — senao sai do contexto e para de custar token.

Eventos validos: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`,
`PreCompact`, `Stop`, `SubagentStop`.
**`PrePromptGeneration` nao existe** — hook declarado nele nunca dispara.

Hook de `PreToolUse` cancela a acao devolvendo `{"decision":"block"}` no stdout
(exit 0). Ha duas convencoes validas (stdout-JSON e stderr+exit 2) — **valide por
`"decision":"block"`, nunca por exit code**.

Bloqueador e marcador andam em par: cabear bloqueador sem o marcador que o
desarma trava a sessao inteira.

## Git

Formato de commit: `<tipo>: <descricao>` — feat, fix, refactor, docs, test, chore, perf, ci.
PR: analisar o historico completo (`git diff <base>...HEAD`), nao so o ultimo commit.

## Revisao antes de commit

Use `security-reviewer` quando o diff tocar: auth, input de usuario, query de
banco, filesystem, API externa, cripto ou pagamento. CRITICAL bloqueia o merge.

## Verificar mutacao

Operacao que deveria mutar dado exige checar o **efeito** (contagem antes/depois +
caminho negativo), nao o retorno. "Deu certo" nao e' evidencia.
