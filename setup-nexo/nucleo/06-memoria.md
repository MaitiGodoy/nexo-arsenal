# Memória Viva — leitura obrigatória no início, realimentação obrigatória no fim

O Setup Nexo mantém seis arquivos de estado por projeto, em `.nexo/` na raiz
do projeto (não no stack global). Eles são lidos automaticamente no início de
toda sessão pelo motor (`motor/memoria.js`) e devem ser atualizados conforme o
trabalho avança — nunca só no fim.

## Os seis arquivos

| Arquivo | Conteúdo | Quando escreve |
|---|---|---|
| `MEMORIA.md` | Fatos duráveis do projeto: arquitetura, convenções, decisões que não mudam a cada sessão | Quando um fato novo e durável surge |
| `PLANO.md` | Plano de fases da tarefa em andamento (formato do `03-nexoflow.md`) | A cada fase concluída/iniciada |
| `LICOES.md` | Erros cometidos e como evitá-los da próxima vez, no máximo 3 linhas por entrada | Sempre que houver retrabalho ou pendência |
| `EVOLUCAO.md` | Histórico de como o próprio setup/projeto mudou de abordagem ao longo do tempo | Quando uma decisão anterior é revertida ou substituída |
| `DECISOES.md` | Decisões tomadas no protocolo de entrada (assumidas ou respondidas) | Antes de cada execução começar |
| `PROGRESSO.md` | Estado corrente: o que já foi feito, o que falta, última sessão | A cada sessão, no início e no fim |

## Regra de leitura (boot da sessão — UMA VEZ, não em loop)

No início da sessão, e só ali, o motor:

1. Verifica se `.nexo/` existe no projeto atual — se não, cria vazio.
2. Lê os seis arquivos (se existirem) **mais** `ARQUITETURA.md` (raiz do
   Setup Nexo) e a lista de hooks ativos (`baseline/settings.hooks.json`).
3. Injeta um resumo compacto no contexto — nunca o conteúdo bruto completo se
   ele já passou do limite de compressão (ver `motor/compressor.js`).

Isso acontece **uma vez**, no boot. Não é uma releitura a cada mensagem —
seria o mesmo desperdício de token que carregar as 198 skills por padrão
(ver `09-economia-de-token.md`). Depois do boot, o conteúdo já está no
contexto da sessão; só volta a ser lido de novo se a sessão for comprimida
(`motor/compressor.js`) ou reiniciada.

Isto é distinto e não conflita com `catalogo/CATALOGO.md` e `catalogo/MCP.md`
— esses são sob demanda, por domínio de tarefa, nunca no boot.

## Regra de escrita (obrigatória, fixa — não é sugestão)

Ler estes arquivos cria a obrigação de mantê-los atualizados. Isso não é
opcional, não depende do usuário pedir, e não é uma recomendação que o
agente pode avaliar caso a caso — é uma regra fixa do protocolo, do mesmo
peso que os portões de segurança (`07-seguranca.md`). Concretamente:

- Terminou uma fase → atualiza `PROGRESSO.md` e `PLANO.md` antes de seguir
  para a próxima.
- Aprendeu algo que teria evitado retrabalho → grava em `LICOES.md` na hora,
  não no fim da sessão.
- Tomou uma decisão de projeto que vale para o futuro → `DECISOES.md` ou
  `MEMORIA.md`, dependendo se é pontual (decisão) ou estrutural (memória).
- Mudou de abordagem depois de uma tentativa que não funcionou →
  `EVOLUCAO.md`.

## Auto-evolução do próprio núcleo (não só do `.nexo/` do projeto)

O `.nexo/` do projeto evolui a cada sessão. O núcleo do Setup Nexo
(`nucleo/*.md`, `ARQUITETURA.md`) também precisa evoluir — senão vira regra
morta que ninguém atualiza. Regra fixa:

1. Uma lição em `LICOES.md` que se repete (mesma causa, 2ª vez) não fica só
   arquivada — vira uma proposta de edição no arquivo do núcleo relevante.
2. A proposta é apresentada ao usuário como um diff pequeno e específico,
   nunca uma reescrita ampla. O usuário aprova ou recusa; nunca é aplicada
   sem confirmação.
3. `ARQUITETURA.md` é reescrito ao final de cada fase de trabalho no próprio
   Setup Nexo — os três blocos ("o que foi feito" / "o que era pra ser" /
   "o que será feito") são atualizados para refletir o estado real, nunca
   deixados desatualizados enquanto o trabalho avança.

## Compressão a cada 100k tokens

Quando o motor estima que o contexto acumulado da sessão passou de
`compressao_limite_tokens` (padrão 100k, config em `nexo.config.json`), ele:

1. Resume o que foi feito até aqui e grava em `PROGRESSO.md` e, se durável,
   em `MEMORIA.md`.
2. Descarta do contexto ativo o que já foi persistido em disco — os arquivos
   `.nexo/` continuam sendo a fonte da verdade, não a janela de contexto.
3. Alvo pós-compressão: `compressao_alvo_tokens` (padrão 35k) de contexto
   vivo, o resto vem de releitura sob demanda.

Isso é automático — o usuário nunca precisa pedir `/compact` ou equivalente.
Vale só *dentro* de uma fase — para virada de fase, ver a regra abaixo, que
tem prioridade sobre o auto-compact simples.

## Virada de fase perto do limite → travado por mecanismo, não por texto

Auto-compact resolve ruído dentro da mesma fase, mas é um resumo gerado sob
pressão de contexto — perde detalhe fino (número medido, path descoberto por
execução, motivo de uma decisão) que só sobrevive se estiver em disco. Fronteira
de fase é o ponto de menor perda para persistir de verdade, porque já é onde o
loop de trabalho (`03-nexoflow.md`) para, verifica e escreve em `.nexo/` de
qualquer forma.

**Isto é enforcement mecânico, não uma recomendação de texto** — mesmo peso
que o bloqueio de `Task` sem `PLANO.md` (Fase D1). Implementado em
`motor/plano.js::checarPersistenciaFase`, chamado por `motor/index.js::checarPlano`
e travado pelo hook `hooks/bloquear-fase-sem-plano.js` (`PreToolUse` de `Task`
para executor/revisor): se `estado.tokensEstimados` (acumulado por turno, ver
`motor/compressor.js`) já passou `compressao_limite_tokens` e `.nexo/PROGRESSO.md`
não foi tocado desde a última compressão, a chamada de `Task` recebe
`decision:block` — o agente não consegue delegar a próxima fase sem antes
escrever em `PROGRESSO.md` um resumo paste-ready: objetivo da próxima fase,
arquivos/`.md` a ler antes de agir, decisões já tomadas, critério de
verificação. O gatilho é o contexto real acumulado da sessão, nunca uma
previsão de "a próxima fase vai estourar".

Quando a virada de fase também é troca de sessão/CLI (não só de subagente
dentro da mesma sessão), o conteúdo de `PROGRESSO.md` pode ser exportado como
um `CONTINUAR.md` paste-ready na raiz do projeto — mas o que é obrigatório e
travado é `PROGRESSO.md`; `CONTINUAR.md` é só uma cópia de conveniência para
colar em um chat novo, sem mecanismo próprio.

Isto não se aplica à fase final de um projeto/plano — aí a regra é a
contrária: resumo final de entrega, nunca um novo prompt de continuação (ver
`ARQUITETURA.md` e o loop de fases em `03-nexoflow.md`).
