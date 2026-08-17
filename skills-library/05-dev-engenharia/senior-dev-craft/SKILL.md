---
name: senior-dev-craft
description: Doutrina de artesanato de código pra quando quem vai EXECUTAR é um modelo barato — garante que a tarefa saia idiomática, sem gambiarra, sem abstração precoce, testável, do jeito que um sênior escreveria. Use ao planejar qualquer fase que gere código (não config/doc puro). Trigger com "essa fase gera código", "qual o padrão daqui", "código de produção", "não quero gambiarra", "como um sênior faria".
---

# Senior Dev Craft

O apelido que pegou pra esta foi "super mega blaster programador sênior" — o nome
sério é este. O problema que ela resolve: o executor do NEXOFLOW é barato (flash)
e trabalha só com o que está escrito na fase. Sem uma direção de qualidade cravada,
ele entrega código que funciona mas não é bom — nomeação genérica, função de 200
linhas, try/catch vazio, copy-paste em vez de reuso. Isto é o par de
`security-by-design` e `scalability-by-design`: aquelas decidem o que fica seguro
e o que fica fácil de escalar; esta decide **o que fica bem escrito**.

## Usage
Chamado pelo `/ultraplan` (piso fixo, toda fase que gera código). Também vale
isolado: "revisa esse código como sênior", "essa função tá com cheiro ruim?".

## What I Need From You
- O trecho de plano ou código a avaliar.
- A linguagem/stack do repo (detecte pelo `package.json`/`pyproject.toml`/etc. se
  não disser) — o idioma certo muda com a linguagem.

## Workflow

### 1. Idiomático pra ESTA stack, não genérico
Não existe "boa prática universal" — existe a prática certa da linguagem do repo.
TypeScript não é Python com chaves. Detecte o idioma real do projeto (olhe um
arquivo já existente e bem escrito) e diga pra copiar aquele padrão, não um
genérico de tutorial.

### 2. Orçamento de complexidade (cravado, não sugerido)
| Limite | Valor | Por quê |
|---|---|---|
| Função | < 50 linhas | função grande esconde mais de uma responsabilidade |
| Arquivo | < 800 linhas | além disso, quebra por domínio, não por tipo |
| Nesting | < 4 níveis | além disso, use early return |
| Parâmetros | ≤ 4 posicionais | mais que isso, agrupe num objeto/struct |

Fase que passa desses números precisa dizer, explicitamente, onde quebra o arquivo
ou a função — não é "depois a gente refatora".

### 3. KISS / DRY / YAGNI aplicados, não citados
- **KISS**: a solução mais simples que resolve o pedido. Não a mais genérica.
- **DRY**: só extrai abstração quando a repetição é **real e já aconteceu 2-3x**
  — não especule sobre repetição futura. 3 linhas parecidas > abstração prematura.
- **YAGNI**: sem feature flag, sem parâmetro "pra quando precisar", sem camada
  que a tarefa não pediu. Isto está no `CLAUDE.md` global do usuário — reforce,
  não repita.

### 4. Erro tratado explicitamente, nunca engolido
| Errado | Certo |
|---|---|
| `catch {}` vazio | trata, loga com contexto, ou deixa propagar de propósito (comentário dizendo por quê) |
| `except: pass` | idem |
| retorno `null`/`None` silencioso pra "erro" | erro tipado ou exceção — `null` é ambíguo com "não encontrado" |
| validação só no client | valida na borda do servidor também |

### 5. Nomeação que carrega intenção
`camelCase`/`snake_case` conforme a linguagem, mas o que importa é a **intenção**:
`isValid`/`hasPermission` pra booleano, verbo pro que a função FAZ (`validateLead`,
não `leadStuff`). Nome genérico (`data`, `temp`, `handleClick2`) é sinal de função
que não sabe o que é — resolve a causa, não o nome.

### 6. Teste que prova comportamento, não implementação
Reforça a Fase 0 do NEXOFLOW: o teste não pode saber COMO a função funciona por
dentro, só o QUE ela promete. Teste que quebra ao refatorar sem mudar comportamento
é teste ruim — está testando implementação, não contrato.

### 7. Comentário só quando o código não explica sozinho
Zero comentário do tipo "// soma dois números". Comentário vale quando existe uma
restrição escondida, um workaround de bug específico, ou uma decisão que
surpreenderia quem lê depois. Se apagar o comentário e o código continua claro, o
comentário não devia existir.

### 8. Validate Before Presenting
Antes de aprovar a fase (papel do `/nexo-revisar`, mas o plano já deve prever isso):
função > 50 linhas sem justificativa? Nome genérico sobrou? `catch` vazio? Abstração
que só tem 1 uso? Qualquer um desses é PENDÊNCIA, não nitpick.

### 9. Anti-bullshit (as seis proibições — cada uma é PENDÊNCIA, não nitpick)
O executor é barato e, sob pressão de fechar a fase, tende a seis vícios. O plano
crava a proibição; o revisor reprova qualquer um deles. Não é filosofia — é o que
faz o modelo barato entregar como sênior em vez de enrolar.

| Vício | O que é | Regra cravada |
|---|---|---|
| **Anti-alucinação** | citar API/lib/flag/arquivo/função que não existe | antes de usar qualquer símbolo externo, CONFIRME que existe (grep no repo, ver a doc/versão). Não confirmou → não usa, registra BLOQUEIO "preciso confirmar X". Inventar assinatura é o erro mais caro do ciclo. |
| **Anti-simulação** | fingir que rodou/testou sem ter rodado ("os testes passam") | cola a saída REAL do comando (liga na autoverificação do `/nexo-executar`). Não rodou? diz "não rodei porque Y" — nunca afirma resultado que não viu. |
| **Anti-gambiarra** | workaround pra contornar bloqueio/erro em vez de resolver a causa | proibido bypass (flag de sandbox, wrapper de outro shell, `|| true` pra mascarar falha, `sleep` pra "esperar" corrida). Barrou? resolve a causa ou registra BLOQUEIO. (regra nasceu de incidente real: executor tentou `dangerouslyDisableSandbox` pra furar permissão.) |
| **Anti-preguiça** | entregar parcial dizendo "o resto é análogo" / "repita para os demais" | faz o que a fase pede por inteiro. "Análogo" não é entregável — é o executor empurrando trabalho pro revisor ou pro humano. |
| **Anti-vazio** | função/handler que retorna placeholder, `null`, `{}`, string fixa fingindo lógica | toda função entrega o comportamento real que a tarefa pediu. Retorno constante onde devia haver lógica = PENDÊNCIA. |
| **Anti-esqueleto** | stub, scaffold, `TODO`, `pass`, `NotImplemented` como entregável de fase | já é regra do `/nexo-executar` ("sem stub/mock/TODO") — aqui vira critério de reprovação explícito do revisor. Scaffold só vale se a PRÓPRIA fase disser que o entregável é o scaffold. |

Regra de leitura do revisor: os seis são verificáveis olhando o código real (não o
PROGRESS). Se o executor alega "feito" mas o arquivo tem `return None # TODO`, é
simulação + esqueleto na mesma linha — PENDÊNCIA dupla, devolve a fase.

## Output Format
Não gera seção própria no plano (diferente de estética/segurança, que têm
superfície visível/sensível clara) — em vez disso, **eleva o padrão das tarefas já
existentes**: cada `- [ ] Tn` de fase que gera código deve, na "força" (Regra zero
do `ULTRAPLAN-SPEC.md`), citar o padrão idiomático a seguir (arquivo de referência
no repo) quando fizer diferença — não é obrigatório inventar um pra tarefa trivial.

Quando chamado isolado (revisão direta), responde: cheiro encontrado → linha →
por que é cheiro → como um sênior reescreveria (código, não só descrição).

## Examples
**Fase que cria um endpoint novo**
→ Direção: "siga o padrão de `src/routes/leads.ts` (mesmo shape de handler, mesmo
uso de `zod` pra validação de body, mesmo wrapper de erro `asyncHandler`)." Não
"crie um endpoint REST" solto.

**Revisão isolada de uma função de 120 linhas com 6 `if` aninhados**
→ Cheiro: função faz parsing + validação + persistência numa peça só. Reescreve:
quebra em `parseInput`, `validate`, `persist`, cada uma testável sozinha; troca
`if` aninhado por early return.

## Constraints
- Não é style guide de formatação (indentação, ponto-e-vírgula) — isso é
  lint/prettier/black automatizado, não decisão de plano.
- Não invente abstração pra parecer "arquitetado" — hesitação errada aqui é
  over-engineering, tão ruim quanto gambiarra.
- Fase de config/doc/asset puro: n/a, não force craft onde não há código.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
