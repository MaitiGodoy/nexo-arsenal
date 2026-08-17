---
name: youtube-content
description: >
  Conteúdo de YouTube pra clientes da Artemis — roteiros long-form (8-20min),
  títulos de alto CTR, briefs de thumbnail, hooks retention-engineered, pacote
  de SEO (descrição, tags, capítulos), Shorts no estilo Jenny Hoyos e
  auditoria de canal. Lê brand-profile.json do cliente se existir e adapta
  tom, tese e ICP. Aplica copywriting-guardrails como gate final.
  Triggers: "roteiro de YouTube", "vídeo pro YouTube", "título de vídeo",
  "thumbnail YouTube", "Shorts", "pacote SEO de vídeo", "auditoria de canal",
  "vídeo no YouTube sobre", "transformar artigo em vídeo", "criar canal".
---

# YouTube Content — roteiros, títulos, thumbs e SEO

Skill canônica de YouTube pra Artemis. Default = roteiro long-form 8-20min, formato de autoridade B2B/educacional. Cobre o ciclo: ideação → título/thumb → roteiro → pacote SEO → auditoria.

## Quick Reference

| Comando | O que faz |
|---|---|
| `/youtube roteiro` | Roteiro long-form 8-20min, retention-engineered (default) |
| `/youtube short` | Roteiro Short 30-60s (Jenny Hoyos: hook → narrativa → twist) |
| `/youtube titulo` | 5 títulos alto-CTR + brief de thumbnail (3 variantes A/B) |
| `/youtube seo` | Description, tags, capítulos, end screen — pacote pronto pra colar no Studio |
| `/youtube ideacao` | 10-20 ideias por nicho com search intent + ângulo |
| `/youtube auditoria` | Review de canal existente (CTR, AVD, retenção, gaps) |
| `/youtube tudo` | Pipeline completo: ideação → título → roteiro → SEO |

Se não houver comando, identificar pelo trigger. Default ambíguo = `roteiro` long-form.

---

## Process

### Step 1 — Verificar contexto

Procurar no diretório atual ou em `clientes/<cliente>/`:
- `brand-profile.json` — **recomendado** (tom, tese, ICP, ângulos)
- `produto-*.md` ou `oferta-*.md` — quando o vídeo tiver CTA comercial
- `clientes/<cliente>/CLAUDE.md` — contexto do cliente
- `campaign-brief.md` — pra reaproveitar hooks já validados

Se nada existir, perguntar **5 inputs mínimos** (Step 2). Não inventar tom.

### Step 2 — Inputs mínimos

Perguntar em bloco único:

1. **Cliente / canal** — qual cliente da Artemis (ou canal próprio)
2. **Tema do vídeo** — assunto específico, não "marketing digital" (ruim) mas "como decidir entre Meta Ads e Google Ads pra B2B com ticket alto" (bom)
3. **Avatar** — pra quem é (1 pessoa específica, não persona genérica)
4. **Promessa do vídeo** — o que a pessoa vai saber/conseguir fazer no fim
5. **CTA** — o que ela faz depois (visitar site, agendar call, baixar material, inscrever)

Se vier vago em qualquer um, pedir especificidade.

### Step 3 — Executar o modo escolhido

Aplicar o framework do modo (seções abaixo).

### Step 4 — Aplicar copywriting-guardrails

Gate final obrigatório. Remover antítese vazia, paradiastole, climax degenerado, bomphiologia, sententia falsa. Roteiro de YouTube morre de "não é só X, é Y" sem substância.

### Step 5 — Salvar

`clientes/<cliente>/conteudo/youtube/<slug>.md` — um arquivo por vídeo. Nomenclatura: `<slug>-<data>.md` quando for parte de série.

---

## Modo 1 — Roteiro long-form (DEFAULT)

Vídeo de 8-20min, autoridade B2B/educacional. Estrutura em 5 atos com pattern interrupts mapeados.

### Estrutura canônica

| Ato | Tempo | Função | AVD alvo |
|---|---|---|---|
| **1. Hook** | 0:00 – 0:15 | Promessa específica + razão pra ficar | Manter >85% |
| **2. Setup** | 0:15 – 0:45 | Quem fala, por que confiar, o que vai vir | Manter >70% |
| **3. Corpo** | 0:45 – 80% | 3-5 capítulos com pattern interrupt entre cada | Manter >55% |
| **4. Twist/Lição** | 80% – 95% | A virada, o ponto que ninguém disse | Manter >45% |
| **5. CTA** | 95% – fim | Ação clara, 1 só | Manter >40% |

### Hook — primeiros 15 segundos

A regra de 2026: **entrega de valor imediata**, não "tease + promessa". Abre com a verdade central do vídeo, depois expande.

5 famílias de hook em pt-BR (escolher 1, gerar 3 variantes):

**1. Contradição direta**
> "Todo mundo te diz pra escalar Meta Ads aumentando budget em 20%. Isso quebra a campanha em 3 dias. Vou te mostrar o método que usamos com 11 clientes B2B em 2026."

**2. Confissão / custo de aprendizado**
> "Perdi R$87 mil em 4 meses tentando rodar Google Ads pro meu próprio negócio. O que aprendi nessa queda virou o método que uso hoje na Artemis com clientes que faturam 7-8 dígitos."

**3. Pergunta com aposta**
> "Se eu te mostrar uma campanha de Meta Ads que rodou R$2,3M em 2025 com CPL abaixo de R$8 num nicho saturado, você ia querer ver a estrutura inteira? É o que vou fazer agora."

**4. Stat brutal**
> "73% dos vídeos no YouTube perdem metade do público antes do segundo 30. Os 27% que ficam usam uma estrutura de 5 atos que você não viu em curso nenhum. Vou desenhar agora."

**5. Cena específica**
> "Sexta passada às 18h um cliente nosso me ligou em pânico — campanha de R$40k/mês caiu 60% de volume em 2 dias. O motivo não era o que parecia. O diagnóstico que fizemos serve pra qualquer conta de Meta."

### Setup — 0:15 a 0:45

3 elementos, 30 segundos:
- **Quem você é** (1 frase com prova social)
- **Por que ESSE vídeo** (qual problema específico ele resolve)
- **O que vai vir** (mapa rápido sem spoiler — "5 critérios", "3 erros", "o método em 4 passos")

Não fazer apresentação longa. Não pedir like/inscrever no setup — isso destrói AVD.

### Corpo — 0:45 a 80%

Dividir em 3-5 capítulos. Cada capítulo:
- **Mini-promessa** (o que você vai mostrar)
- **Conteúdo** (o que mostra)
- **Mini-fechamento + ponte** (resume e amarra no próximo)

**Pattern interrupts obrigatórios** (a cada 60-90s):
- Mudança de cenário (B-roll, screenshot, gráfico)
- Mudança de tom (voz mais baixa, pausa longa, pergunta direta pra câmera)
- Stat ou número específico
- "Olha isso aqui" + cut pra tela

### Twist / Lição — 80% a 95%

A virada que diferencia o vídeo. Pode ser:
- O contra-intuitivo ("o que ninguém te disse é que…")
- A regra que quebra ("isso só vale quando…")
- A síntese ("se você só pegar UMA coisa desse vídeo, é…")

### CTA — 95% ao fim

UM CTA. Específico. Com motivo.

> "Se você quer aplicar isso no seu negócio, baixei o template que usamos internamente — link na descrição. Não pede email, é grátis. Se isso aqui te ajudou, me conta nos comentários qual desses 5 erros você já cometeu — leio todos."

Não pedir like/inscrever genericamente. Pedir 1 ação concreta (comentário com pergunta específica funciona melhor que "se inscreva").

### Tamanho do roteiro

- 8-10min → 1500-2000 palavras (~150 wpm falado)
- 12-15min → 2200-2800 palavras
- 18-20min → 3000-3500 palavras

### Format de entrega

Roteiro em prosa corrida, parágrafo por bloco, separadores `---` entre atos. Sem direção de cena no texto principal — o editor decide câmera. Notas técnicas (B-roll sugerido, gráfico, screenshot) em seção `## Notas de produção` no fim.

---

## Modo 2 — Roteiro Short (30-60s)

Estrutura Jenny Hoyos: **Hook → Foreshadow → Narrativa → Twist**.

### Regras invioláveis

1. **Hook visual nos primeiros 1-2s** — entendível sem som
2. **Linguagem nível 1ª série** — palavra de 2 sílabas > palavra de 4
3. **Máximo 3 objetos no frame** — descobrir o cenário não pode roubar atenção
4. **Pattern interrupt aos 15s** — twist no meio
5. **Twist final** — não termina no óbvio
6. **Loop opcional** — última frase amarra na primeira (faz replay)

### Estrutura

| Tempo | Função |
|---|---|
| 0-2s | Hook visual + falado: promessa concreta |
| 2-15s | Foreshadow: criar tensão, mostrar conflito |
| 15-45s | Narrativa: como resolve, em 3 beats |
| 45-60s | Twist + CTA implícito (curiosidade pro próximo) |

### Power words pt-BR

"proibido", "barato", "rápido", "errado", "ninguém te conta", "perdi", "ganhei", "R$X", "X dias", "X anos", "secreto" (use com parcimônia — desgastado).

### Tamanho

60s ≈ 150 palavras faladas. Não passar de 160. Compressão é o trabalho.

---

## Modo 3 — Título + Thumbnail brief

### Anatomia de título alto-CTR

Critérios:
- **Específico > genérico** — "3 erros de SEO que custam R$10k/mês" > "Erros de SEO"
- **Número quando faz sentido** — "5 maneiras", "em 7 dias", "R$2,3M em 2025"
- **Curiosidade com promessa** — não clickbait sem entrega
- **60-65 caracteres** — não trunca em mobile
- **Sem ALL CAPS** — algoritmo penaliza

### Templates testados (pt-BR)

1. **Número + benefício + timeframe** — "5 ajustes que dobraram o ROAS em 30 dias"
2. **Erro / contra-intuitivo** — "Por que aumentar budget destrói sua campanha de Meta Ads"
3. **Resultado + mecanismo** — "R$2,3M em ads pagos em 2025 — a estrutura completa"
4. **Pergunta + aposta** — "Google Ads ou Meta Ads pra B2B? Testei os dois com R$50k"
5. **Caso real** — "Como recuperamos um cliente que perdia R$30k/mês em ads"

### Entregar

5 títulos por vídeo. Marcar o recomendado com **(top)**.

### Brief de thumbnail (3 variantes A/B)

Pra cada vídeo, gerar 3 variantes:

```
## Variante 1 — [nome curto]
- Frame: [closeup de rosto / mão segurando objeto / split-screen]
- Texto: [3-5 palavras MAX, 2 linhas]
- Cor de fundo: [hex do brand-profile.json]
- Cor do texto: [hex contrastante]
- Elemento visual: [ícone, gráfico, seta, círculo vermelho]
- Emoção do rosto: [surpresa / desafio / dúvida — não sorriso genérico]
- Title-thumb synergy: [como thumb e título completam, não repetem]
```

**Regras de thumbnail**:
- 1280x720, 16:9
- Texto legível em 120px wide (preview mobile)
- Contraste alto — funciona em PB
- Se rosto: olhos no terço superior
- Não copiar estilo MrBeast pra B2B — vira ridículo

---

## Modo 4 — Pacote SEO

Tudo o que o cliente precisa colar no Studio do YouTube.

### Estrutura do pacote

```markdown
## Título
[título escolhido]

## Description (até 5000 chars)
[primeiras 2 linhas = hook + keyword principal — visíveis antes do "mostrar mais"]

[parágrafo de contexto, 3-5 linhas, com keyword secundária]

[lista de capítulos com timestamps — vira chapters auto]
00:00 Introdução
00:45 [capítulo 1]
03:20 [capítulo 2]
...

[CTAs e links]
🔗 Site do cliente: ...
🔗 Material grátis: ...
🔗 Outro vídeo relacionado: ...

[redes sociais do cliente]
[hashtags relevantes — máx 3, no fim]

## Tags (até 500 chars total)
[15-25 tags: keyword principal, variações, long-tails, marca, nicho]

## Chapters (auto via timestamps na description)
[mesmo da description]

## End screen
- 1 vídeo relacionado (mesmo tema, série)
- 1 playlist (canal autoridade)
- Subscribe button
```

### Search intent

Antes de escrever description, identificar a intenção da query:
- **Informacional** ("o que é", "como funciona") → primeira frase responde direto
- **Comparativa** ("X vs Y") → primeira frase entrega o veredito
- **Tutorial** ("como fazer") → primeira frase mostra outcome final

YouTube ranqueia por **satisfação**, não por keyword density. Description não precisa repetir keyword 8x. Precisa fazer sentido pro humano.

### Tags

15-25 tags, ordem importa (primeiras pesam mais):
1-3: keyword principal e variações
4-8: long-tails específicas
9-15: nicho e contexto
16-25: marca, série, canal

---

## Modo 5 — Ideação

10-20 ideias de vídeo pra um cliente, com search intent.

### Processo

1. Ler `brand-profile.json` do cliente
2. Identificar 3-5 pilares de conteúdo (temas que o cliente domina E o ICP procura)
3. Pra cada pilar, gerar 3-5 ideias com:
   - Título-base (vai ser refinado depois)
   - Search intent (informacional / comparativa / tutorial / opinião)
   - Ângulo único (o que diferencia esse vídeo dos 50 já existentes)
   - Formato (long-form / Short / série)

### Quando usar Shorts vs long-form

- **Long-form** — autoridade, conversão, SEO, descoberta orgânica de longa cauda
- **Shorts** — topo de funil, descoberta nova, audiência que não te conhece, viralização

Pra clientes B2B da Artemis, **default é long-form**. Shorts entram só pra clipping de momentos do long-form.

---

## Modo 6 — Auditoria de canal

Review de canal existente em 4 dimensões. Pedir os dados que não conseguir extrair.

### Dimensão 1 — Discovery (CTR + Impressões)

- CTR médio do canal (alvo: >5% nicho, >8% personal brand)
- Vídeos com maior CTR — identificar padrão de título/thumb
- Vídeos com menor CTR mas bom AVD — refazer título/thumb

### Dimensão 2 — Retenção (AVD %)

- AVD médio do canal (alvo: >50% pra long-form)
- Curva de retenção dos top 10 vídeos — onde a queda
- Vídeos com AVD <40% — diagnóstico (hook fraco? promessa não entregue?)

### Dimensão 3 — Conversão

- CTR pra link da description (se o cliente medir)
- Comentários por 1000 views (alvo: >5)
- Vídeos com mais conversão — ângulo, CTA, formato

### Dimensão 4 — Algoritmo

- % de views via browse / search / suggested / external
- Browse forte = thumb/título funcionam
- Search forte = SEO funciona, mas pode estar refém de queries
- Suggested forte = canal tem coesão temática
- External = depende de tráfego pago/social — frágil

### Output

Documento com:
- Score 0-100 por dimensão
- 3-5 ações priorizadas (impacto x esforço)
- 5-10 ideias de vídeo pra preencher gaps identificados

---

## Algoritmo 2026 — o que importa

Em 1 página, pra você não decorar mil regras:

1. **Satisfação > watch time** — vídeo de 7min com 85% AVD bate vídeo de 15min com 50%
2. **CTR + AVD são par** — alto CTR sem AVD = clickbait, algoritmo enterra. AVD alto sem CTR = ninguém clica
3. **Primeiros 30s decidem** — alvo: >50% AVD aos 30s. Se cair antes, mover hook pros primeiros 8s = +10-25% AVD
4. **Suggested vale 70%** — recomendação cruzada é a maior fonte de view, não search
5. **Coesão temática** — canal que pula assunto perde "topical authority"; algoritmo não sabe pra quem recomendar
6. **Nada de keyword stuffing** — title específico (3 SEO Mistakes) > keyword stuffed (SEO Tips SEO Guide SEO Tutorial)
7. **Comentários > likes** — comentário sinaliza engagement real. CTA de comentário com pergunta específica funciona

---

## Encadeamentos com outras skills

| Antes | Depois |
|---|---|
| `content-research-briefing` (substância) | `youtube-content` (roteiro com fontes) |
| `youtube-content` (roteiro) | `copywriting-guardrails` (gate) — **sempre** |
| `youtube-content` (thumb brief) | renderização manual no Canva/Figma |
| `ads-dna` (brand-profile.json) | `youtube-content` (adapta tom) |
| `aula-script-writer` (aula longa) | ≠ `youtube-content` — aula é educacional fechada, YouTube é discovery |
| `vsl-writer` (venda) | ≠ `youtube-content` — VSL é carta de venda, vídeo de YouTube é descoberta/autoridade |

---

## Anti-padrões — não faça

1. **Hook genérico** — "Hoje vamos falar sobre…" mata canal
2. **Apresentação longa** — "Olá, meu nome é… nesse canal…" antes do hook
3. **CTA pedindo like/inscrever no meio do vídeo** — destrói AVD
4. **Thumbnail copy MrBeast pra B2B** — boca aberta + flecha vermelha em vídeo de governança corporativa = ridículo
5. **Description com keyword repetida 10x** — algoritmo penaliza
6. **Múltiplos CTAs** — escolha 1
7. **Roteiro com direção de cena no meio do texto** — entrega copy limpa, B-roll vai em seção separada
8. **Clichê de IA** — "no mundo dinâmico de hoje", "em uma era de transformação digital", "não é apenas X, é Y" — guardrails mata isso

---

## Output esperado

Arquivo único `.md` em `clientes/<cliente>/conteudo/youtube/<slug>.md` contendo:

```markdown
# [Título top recomendado]

## Títulos (5 variantes)
1. ...
2. ...
...

## Thumbnail brief (3 variantes)
[blocos de variante]

## Roteiro
[prosa corrida em 5 atos, sem direção de cena no corpo]

## Notas de produção
[B-roll, gráficos, screenshots sugeridos por timestamp]

## Pacote SEO
[description, tags, chapters]

## CTA principal
[1 ação clara]
```

Nada de seção "Por que funciona", "Princípio aplicado", "Notas estratégicas". O cliente lê o roteiro e grava. Se quiser estratégia, pergunta no chat.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
