# Protocolo de Entrada — obrigatório antes de qualquer execução

Nenhuma tarefa não-trivial começa a ser executada sem passar pelas três etapas
abaixo, nesta ordem. "Não-trivial" = mais de uma edição óbvia em um único arquivo.
Para pedidos triviais (corrigir uma linha, responder uma pergunta factual), pule
direto para a execução — o protocolo existe para não perder trabalho em tarefas
que importam, não para burocratizar tudo.

## Etapa 1 — Briefing (macro + micro)

Antes de planejar, extraia (da mensagem do usuário e do que já está registrado em
`.nexo/MEMORIA.md` e `.nexo/DECISOES.md` — nunca pergunte o que já está escrito):

- **Macro**: qual é o objetivo real e por quê. Que problema isso resolve.
- **Micro**: quais arquivos, quais restrições, qual é o critério de aceite
  observável (o que prova que terminou).

Se o pedido já veio com essas informações (explícita ou implicitamente), não
pergunte de novo — extraia e prossiga.

## Etapa 2 — Investigação

Antes de propor qualquer plano, investigue o estado real:

- Leia os arquivos relevantes do projeto (não assuma pela memória).
- Confira se algo parecido já existe (não duplicar).
- Confira o histórico em `.nexo/EVOLUCAO.md` e `.nexo/LICOES.md` — pode já haver
  uma lição registrada sobre exatamente esse tipo de tarefa.
- Para investigação ampla (muitos arquivos), delegue ao agente auxiliar barato
  em vez de gastar o modelo principal varrendo.
- Consulta ao roteador (`catalogo/CATALOGO.md` e `catalogo/MCP.md`) não é uma
  decisão sua: não julgue antes se "essa tarefa precisa de skill/MCP" — é o
  roteador quem define o que cobre, não você quem pré-filtra. Pré-julgar é
  exatamente o furo que deixava tarefa passar sem consultar nada.

## Etapa 3 — Tira-dúvida obrigatório (só quando necessário)

Faça a pergunta ao usuário **somente se** uma resposta errada mudaria
materialmente o resultado, e a resposta não é derivável do briefing, do código
ou de um padrão sensato. Critérios para NÃO perguntar:

- A ambiguidade é resolvível por uma convenção já usada no projeto.
- Existe uma opção claramente mais segura/recomendada e o custo de errar é baixo
  e reversível.
- A pergunta é sobre algo que o próprio Setup Nexo deveria decidir sozinho
  (nome de arquivo interno, ordem de implementação, etc.).

Quando perguntar, pergunte tudo de uma vez, de forma objetiva, e proponha uma
recomendação padrão. Não interrompa depois disso salvo se surgir uma ambiguidade
nova e real.

## Depois das três etapas

Só então: passa pelo refinador de prompt (`02-refinador-prompt.md`) — **sempre,
sem condição**, não só quando o pedido "parece cru" (a IA não é juiz confiável
do próprio entendimento) — e gera o plano de fases atômicas (`03-nexoflow.md`).

## Registro

Toda decisão tomada nesta etapa é gravada em `.nexo/DECISOES.md` pelo motor
antes da execução começar — não depois. Cada linha começa com uma tag de
proveniência, pra sessão futura saber o quão confiável é sem reabrir a
conversa:

- `[usuário]` — o usuário respondeu isso diretamente na Etapa 3.
- `[assumido]` — a IA decidiu sozinha (Etapa 3 não perguntou, critério "não
  precisa perguntar" se aplicou).

Formato: `- [usuário|assumido] <decisão em uma linha> — <por quê, se não for
óbvio>`.
