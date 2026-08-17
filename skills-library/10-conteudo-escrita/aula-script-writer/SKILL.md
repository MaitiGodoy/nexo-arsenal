---
name: aula-script-writer
description: >
  Escreve roteiros completos para aulas em vídeo (15-30 minutos) com base em pesquisa de fontes — vídeos do YouTube, transcrições já extraídas, PDFs e notas no repositório de conhecimento do cliente. Acionar sempre que o usuário mencionar "roteiro de aula", "script de aula", "vídeo aula", "aula sobre", "criar aula de", "modelar aula", "gerar índice de aula", "extrair transcrição do youtube para aula", "preparar aula a partir desse vídeo", "transformar esse vídeo em aula" ou qualquer pedido pra produzir conteúdo educacional em formato de roteiro falado. Usar também quando o usuário passar uma URL do YouTube e pedir aula a partir dela, ou quando pedir pra revisar/expandir um índice de aula já existente. A skill opera em 3 fases (pesquisa → índice → roteiro) com checkpoint de aprovação humana entre fase 2 e 3 — nunca pular pra fase 3 sem aprovação explícita do índice. Sempre busca primeiro no repositório local de conhecimento do cliente antes de baixar do YouTube, pra economizar token e construir um ativo reutilizável.
---

# Aula Script Writer

Produz roteiros de aula em vídeo (15-30 min) a partir de fontes — YouTube, transcrições salvas, PDFs e notas no repositório de conhecimento do cliente.

A skill opera em **3 fases serializadas** com checkpoint humano:

```
[Fase 1: Pesquisa] → [Fase 2: Índice] → ⏸ APROVAÇÃO ⏸ → [Fase 3: Roteiro]
```

Nunca avance para a Fase 3 sem o cliente dizer explicitamente "aprovado", "ok pode escrever", "segue", ou equivalente.

---

## Filosofia de operação

**1. Local-first, YouTube-second.**
Antes de baixar qualquer transcrição nova, varre o repositório de conhecimento da cliente (`clientes/<cliente>/conhecimento/`). Token caro é token gasto duas vezes na mesma fonte.

**2. Índice é contrato.**
A Fase 2 entrega um índice estruturado com tópicos, blocos de tempo e fontes citadas. É o que a cliente aprova antes do roteiro. Mudanças no índice depois do roteiro pronto custam caro — invista em precisão aqui.

**3. Voz da cliente acima de tudo.**
O roteiro é falado por ela. Tem que soar como ela. Antes de escrever, leia roteiros antigos em `clientes/<cliente>/aulas/` se existirem, e o `CLAUDE.md` do cliente. Se não houver referência, sinalize na entrega que o tom foi inferido e peça calibragem.

**4. Repositório cresce a cada aula.**
Toda transcrição baixada é salva, indexada e fica disponível pras próximas aulas. Depois de 10-15 aulas, a maioria das fontes já está local.

---

## Fase 0 — Bootstrap (executar uma vez por cliente)

Antes de começar a Fase 1, verifique se a estrutura do repositório de conhecimento existe. Se não existir, crie-a.

### Estrutura esperada

```
clientes/<cliente>/
├── CLAUDE.md                          # contexto do cliente (nicho, tom, ICP, público das aulas)
├── conhecimento/
│   ├── _index.md                      # MOC — Map of Content (índice mestre)
│   ├── transcricoes/                  # transcrições do YouTube (1 arquivo por vídeo)
│   ├── docs/                          # PDFs, artigos, notas avulsas que a cliente jogar
│   └── notas/                         # insights extraídos das transcrições/docs
└── aulas/
    └── <slug-do-tema>/
        ├── 01-indice.md
        ├── 02-roteiro.md
        └── fontes.md                  # links wiki [[]] pras fontes usadas
```

### Comando de bootstrap

Se `clientes/<cliente>/conhecimento/` não existir:

```bash
CLIENTE="<nome-do-cliente>"
SKILL_DIR="$(dirname "$0")"  # ou path absoluto da skill
mkdir -p "clientes/$CLIENTE/conhecimento/transcricoes"
mkdir -p "clientes/$CLIENTE/conhecimento/docs"
mkdir -p "clientes/$CLIENTE/conhecimento/notas"
mkdir -p "clientes/$CLIENTE/aulas"
cp ".claude/skills/aula-script-writer/templates/_index.md" "clientes/$CLIENTE/conhecimento/_index.md"
```

Depois disso, avise a cliente: *"Estrutura do repositório criada em `clientes/<cliente>/conhecimento/`. A partir daqui toda transcrição que eu baixar fica salva aí e fica disponível pras próximas aulas."*

---

## Fase 1 — Pesquisa

**Objetivo:** reunir as fontes que vão alimentar o índice.

### Entrada esperada do usuário

Uma das três formas:
- **Tema livre:** *"quero uma aula sobre [X]"* → você precisa propor fontes
- **URL específica:** *"baseia nesse vídeo: youtube.com/..."* → ponto de partida fixo
- **Mix:** *"esse vídeo + complementa com o que tiver no repositório sobre [Y]"*

### Protocolo de busca (ordem obrigatória, sempre)

#### 1. Grep no `_index.md`

```bash
grep -i "<termo-do-tema>" "clientes/<cliente>/conhecimento/_index.md"
```

O `_index.md` é o MOC — tem todas as fontes catalogadas por tema e tag. Se já houver match aqui, vá direto para o passo 2.

#### 2. Grep nos frontmatters de `transcricoes/` e `docs/`

Não leia os arquivos inteiros. Leia só o frontmatter (primeiras ~30 linhas) — tags, resumo, relatedTopics:

```bash
for f in clientes/<cliente>/conhecimento/transcricoes/*.md clientes/<cliente>/conhecimento/docs/*.md; do
  head -n 30 "$f" | grep -li "<termo>" && echo "→ $f"
done
```

Liste candidatos e leia o resumo+tags de cada um pra decidir se vale ler o corpo.

#### 3. Decisão

- **3+ fontes locais relevantes:** Use só local. Pule pra Fase 2.
- **1-2 fontes locais + tema permite expansão:** Use locais + complementa com YouTube (passo 4).
- **0 fontes locais OU URL específica:** Vai pro YouTube (passo 4).

#### 4. YouTube (quando necessário)

**Caso A — URL fornecida pelo usuário:**

```bash
.claude/skills/aula-script-writer/scripts/extract-yt-transcript.sh \
  "<URL>" \
  "clientes/<cliente>/conhecimento/transcricoes/"
```

O script:
- Baixa auto-subs em pt-BR > pt > en (cai pro próximo se não tiver)
- Limpa o vtt (remove timestamps, dedupe, parágrafos)
- Salva como `yt-<videoId>-<slug-do-titulo>.md` com frontmatter completo
- Retorna o path do arquivo gerado

**Caso B — Busca por tema:**

Se o usuário pediu tema sem URL, use `WebSearch` com query tipo `"<tema>" site:youtube.com` ou `"<tema>" canal:<canal-relevante>`. Liste 3-5 candidatos com título, canal, duração e proponha pro usuário escolher 1-2 antes de baixar. Não baixe múltiplos sem confirmar — auto-subs nem sempre existem e baixar 5 vídeos pra usar 1 desperdiça operação.

#### 5. Indexação

Toda transcrição nova baixada precisa entrar no `_index.md`. Adicione uma linha na seção apropriada:

```markdown
- [[transcricoes/yt-<videoId>-<slug>]] — <título-curto> (<canal>) — tags: <tag1, tag2>
```

#### 6. Documentos avulsos (PDFs, artigos)

Se a cliente jogar uma URL de artigo ou um PDF na conversa:
- **Artigo web:** use `WebFetch`, salve em `docs/web-<slug>.md` com frontmatter (source: web, url, addedAt, tags, summary)
- **PDF:** use a skill `pdf` pra extrair, salve em `docs/pdf-<slug>.md`
- Indexe no `_index.md`

### Saída da Fase 1

Mensagem curta listando:
- N fontes locais encontradas
- M fontes novas baixadas (com path)
- Resumo de 2-3 linhas de cada fonte

Pergunte: *"Posso seguir pra montar o índice baseado nessas fontes, ou quer adicionar/remover alguma?"*

---

## Fase 2 — Índice

**Objetivo:** entregar um índice de aula estruturado, com blocos de tempo, pra aprovação da cliente.

### Premissas de tempo

| Duração-alvo | Palavras (≈150 wpm) | Blocos sugeridos |
|---|---|---|
| 15 min | ~2.250 | 4-5 |
| 20 min | ~3.000 | 5-6 |
| 25 min | ~3.750 | 6-7 |
| 30 min | ~4.500 | 7-8 |

Se a cliente não disser a duração, pergunte. Padrão: 22 min (~3.300 palavras).

### Estrutura do índice

Use o template em `.claude/skills/aula-script-writer/templates/01-indice.md`. Estrutura mínima:

```markdown
---
tema: <tema-da-aula>
duracaoAlvoMin: 22
status: indice-pendente-aprovacao
fontesUsadas:
  - "[[conhecimento/transcricoes/yt-XXX-slug]]"
  - "[[conhecimento/docs/web-YYY]]"
criadoEm: <YYYY-MM-DD>
---

# Aula: <Título da Aula>

## Tese central
<1-2 frases — qual é a ideia única que essa aula defende>

## Promessa pro aluno
Ao final dessa aula, ele(a) vai conseguir <verbo de capacidade> <objeto concreto>.

## Blocos

### Bloco 1 — <título do bloco> (≈3 min)
- Ideia-chave: <...>
- Pontos a cobrir: <...>
- Fonte principal: [[...]]
- Hook de transição: <...>

### Bloco 2 — ...
(repete)

## Encerramento (≈2 min)
- Síntese
- Call-to-action (próximo passo do aluno)

## Observações
<qualquer dúvida, ponto que precisa de calibragem da cliente, sugestão alternativa>
```

### Salvamento

Salve em `clientes/<cliente>/aulas/<slug-do-tema>/01-indice.md`. Crie a pasta `<slug-do-tema>/` se não existir.

### Saída da Fase 2

Apresente o índice em formato markdown na conversa (não só o path), e termine com:

> **Status:** índice salvo em `<path>`. Aprovação pendente.
>
> Me responde uma das opções:
> - **"aprovado"** → escrevo o roteiro
> - **"ajusta X"** → eu reviso o índice
> - **"refaz"** → recomeço com nova abordagem

**PARE AQUI.** Não escreva o roteiro até receber aprovação explícita.

---

## Fase 3 — Roteiro

**Pré-requisito:** o usuário disse "aprovado" (ou variação clara). Se duvidar, pergunte antes de escrever.

### Antes de escrever

1. **Releia o índice aprovado** (`01-indice.md`)
2. **Releia as fontes citadas** — agora pode ler o corpo, não só frontmatter, especialmente os trechos relevantes pra cada bloco
3. **Releia o `CLAUDE.md` do cliente** — tom, público, jargão
4. **Releia 1-2 roteiros antigos da cliente** se existirem em `aulas/`, pra calibrar voz. Se não houver nenhum, sinalize na entrega: *"Primeira aula — tom inferido do CLAUDE.md. Me diz o que ajustar."*

### Princípios de redação

**1. Linguagem falada, não escrita.**
Aula é áudio. Frases curtas. Conectivos que funcionam quando ouvidos ("aí", "olha", "presta atenção"). Sem subordinadas longas. Sem "outrossim", "destarte", "no presente trabalho".

**2. Ritmo com micro-pausas.**
A cada 30-45 segundos de fala (~80-110 palavras), uma quebra natural — pergunta retórica, exemplo, mudança de ritmo. Aluno desconcentrado é aluno perdido.

**3. Concretude obsessiva.**
Cada conceito abstrato vem com exemplo. Cada número tem fonte. Cada afirmação forte tem caso real. Sem isso a aula vira blá-blá-blá.

**4. Hook em cada bloco.**
Não só no começo da aula — cada bloco abre com algo que faz o aluno querer saber a próxima frase. Pode ser pergunta, paradoxo, dado contraintuitivo, micro-cena.

**5. Sem saudações genéricas.**
Nada de "olá pessoal, hoje vamos falar sobre…". Comece com a tese, com uma cena, com um dado, com uma pergunta. Estilo HBR aplicado a fala.

**6. CTA específico no encerramento.**
Não "espero que tenham gostado". Sim "agora você vai fazer X — pega o caderno, anota Y, e na próxima aula a gente Z".

### Estrutura do roteiro

Use o template em `.claude/skills/aula-script-writer/templates/02-roteiro.md`. Cada bloco tem:

```markdown
## Bloco <N> — <título> (≈<min> min | ≈<palavras> palavras)

> [Marcação de fala / direção opcional: ritmo, ênfase, pausa]

<corpo do roteiro em prosa, parágrafos curtos, escrito como fala>

> [Transição para próximo bloco]
```

### Contagem de palavras

Antes de entregar, conte as palavras. Use:

```bash
wc -w "clientes/<cliente>/aulas/<slug>/02-roteiro.md"
```

Deve estar dentro de ±10% do alvo (ex: 22 min → 2.970-3.630 palavras). Se estourar, comprima. Se faltar, expanda exemplos — não infle com filler.

### Camada de revisão obrigatória

**APLIQUE `copywriting-guardrails` antes de entregar.** É a Regra 2 do `CLAUDE.md` da agência. Sem exceção.

Tipos de vício mais comuns em roteiro de aula que a guardrails pega:
- Antítese vazia ("não é A, é B" sem substância no B)
- Climax degenerado (escala de adjetivos sem ganho real)
- Sententia falsa (frase "filosófica" que não diz nada)
- Bomphiologia (auto-elogio implícito do ensinamento)

### Saída da Fase 3

1. Salva em `clientes/<cliente>/aulas/<slug>/02-roteiro.md`
2. Atualiza o frontmatter do `01-indice.md`: `status: roteiro-pronto`
3. Cria/atualiza `clientes/<cliente>/aulas/<slug>/fontes.md` listando todos os links wiki das fontes usadas
4. Mostra o roteiro completo na conversa
5. Termina com:

> **Roteiro pronto.**
> - Palavras: <N> (alvo: <range>)
> - Salvo em: `<path>`
> - Fontes: <N> (ver `fontes.md`)
>
> Quer que eu ajuste algo ou já tá bom pra gravar?

---

## Padrões de frontmatter

### Transcrição de YouTube (`transcricoes/yt-<id>-<slug>.md`)

```yaml
---
source: youtube
url: https://www.youtube.com/watch?v=<id>
videoId: <id>
title: <título>
channel: <canal>
durationSec: <segundos>
publishedAt: <YYYY-MM-DD>
addedAt: <YYYY-MM-DD>
language: pt-BR | pt | en
tags: [tag1, tag2, tag3]
relatedTopics:
  - <tópico-amplo-1>
  - <tópico-amplo-2>
summary: |
  Resumo de 4-6 linhas. Por que essa transcrição importa.
  Qual é a tese central. O que tem de único nela.
keyQuotes:
  - "<citação literal forte 1>"
  - "<citação literal forte 2>"
---

# <Título do vídeo>

<corpo limpo da transcrição>
```

### Documento web (`docs/web-<slug>.md`)

```yaml
---
source: web
url: <url>
title: <título>
author: <autor-se-houver>
publication: <veículo>
publishedAt: <YYYY-MM-DD ou null>
addedAt: <YYYY-MM-DD>
tags: [...]
summary: |
  ...
---
```

### PDF (`docs/pdf-<slug>.md`)

```yaml
---
source: pdf
filename: <arquivo-original.pdf>
title: <título>
author: <autor>
addedAt: <YYYY-MM-DD>
tags: [...]
summary: |
  ...
---
```

### Aula — índice (`aulas/<slug>/01-indice.md`)

```yaml
---
tema: <tema>
slug: <slug>
duracaoAlvoMin: <int>
status: indice-pendente-aprovacao | indice-aprovado | roteiro-pronto
fontesUsadas:
  - "[[conhecimento/transcricoes/...]]"
criadoEm: <YYYY-MM-DD>
aprovadoEm: <YYYY-MM-DD ou null>
---
```

### Aula — roteiro (`aulas/<slug>/02-roteiro.md`)

```yaml
---
tema: <tema>
slug: <slug>
duracaoAlvoMin: <int>
palavras: <int>
status: roteiro-pronto
criadoEm: <YYYY-MM-DD>
revisadoComGuardrails: true
---
```

---

## `_index.md` (MOC) — formato

```markdown
# Mapa de Conhecimento — <Cliente>

> Índice mestre do repositório. Atualizado automaticamente pela skill `aula-script-writer` a cada nova fonte adicionada.

## Por tema

### <Tema 1>
- [[transcricoes/yt-XXX-slug]] — <título> (<canal>)
- [[docs/web-YYY]] — <título>

### <Tema 2>
- ...

## Por tag

- **#tag1** → [[...]], [[...]]
- **#tag2** → [[...]]

## Aulas produzidas

- [[../aulas/<slug>/02-roteiro]] — <título> (<duração>min) — <YYYY-MM-DD>

## Adicionado recentemente

- <YYYY-MM-DD> — [[transcricoes/yt-XXX-slug]]
```

---

## Comandos de transcrição (referência rápida)

### Extração via script

```bash
.claude/skills/aula-script-writer/scripts/extract-yt-transcript.sh \
  "<URL-do-youtube>" \
  "<diretório-de-saída>"
```

### Manualmente (fallback se script falhar)

```bash
# 1. Baixar auto-subs
yt-dlp --write-auto-subs --skip-download \
  --sub-lang "pt-BR,pt,en" --sub-format vtt \
  --output "/tmp/yt-%(id)s.%(ext)s" \
  "<URL>"

# 2. Pegar metadata
yt-dlp --print "%(id)s|%(title)s|%(channel)s|%(duration)s|%(upload_date)s" \
  --skip-download "<URL>"

# 3. Limpar VTT (timestamps + dedupe)
grep -v "^\s*$\|-->\|WEBVTT\|Kind:\|Language:" /tmp/yt-<id>.<lang>.vtt \
  | awk '!seen[$0]++' \
  | sed 's/<[^>]*>//g' \
  > /tmp/yt-<id>-clean.txt
```

### Nota sobre auto-subs

- Auto-subs em pt-BR existem em ~70% dos vídeos brasileiros recentes
- Se não houver subs (raro): o script retorna erro, sinalize pro usuário e peça vídeo alternativo
- Subs manuais (quando o canal sobe legenda própria) são melhores — o script pega `--write-subs` antes de cair pra `--write-auto-subs` se disponível

---

## Erros comuns e como lidar

| Erro | Causa provável | Ação |
|---|---|---|
| Vídeo sem auto-subs | Canal pequeno, vídeo muito antigo, áudio ruim | Pede outro vídeo OU usa Whisper local (escopo fora dessa skill) |
| Vídeo com paywall/idade | Restrição YouTube | Pede vídeo público equivalente |
| `_index.md` não existe | Skill nunca rodou pra esse cliente | Roda Fase 0 (bootstrap) |
| Pasta `clientes/<cliente>/` não existe | Cliente não cadastrada na agência | Pergunta pro Hélio se cria, não cria por conta |
| Roteiro 30%+ acima do alvo | Sobrescreveu | Comprime — corta exemplos secundários, não cabeçalhos |
| Roteiro 30%+ abaixo do alvo | Subexplorou fontes | Volta nas fontes, expande exemplos concretos |
| Cliente reprova índice 2x seguidas | Briefing incompleto | Para de iterar, pergunta o ângulo/tese que ela quer defender |

---

## Integrações com outras skills

- **`copywriting-guardrails`** — obrigatória na Fase 3 antes de entregar (Regra 2 da agência)
- **`pdf`** — quando a cliente entregar PDF pra adicionar ao repositório
- **`obsidian`** — pode ler/escrever no vault da cliente quando ele estiver montado (arquitetura separada, não escopo dessa skill)
- **`content-research-briefing`** — pode ser usada antes da Fase 1 quando a cliente quer pesquisa profunda além do YouTube (academia, jornalismo sério, etc.)

---

## Limites do escopo

**Esta skill NÃO faz:**
- Edição de vídeo / produção visual
- Slides / apresentação (use canvas-design ou pptx)
- Distribuição (legenda de YouTube, descrição, thumbnail — usar outras skills)
- Transcrição de áudio próprio (Whisper) — só YouTube
- Criar pasta de cliente novo (`clientes/<nome>/`) sem confirmação do Hélio

**Esta skill FAZ:**
- Bootstrap do `conhecimento/` para cliente existente
- Fase 1: pesquisa local + YouTube
- Fase 2: índice com checkpoint humano
- Fase 3: roteiro com `copywriting-guardrails` aplicada
- Indexação automática de toda fonte adicionada

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
