---
name: ads-mktops
description: Escreve e renderiza anuncios estaticos Meta Ads (Facebook + Instagram) para a marca MktOps em formato Feed (1080x1350) e Story (1080x1920). Copy + arte renderizada em um pipeline so, usando a mesma identidade visual do carousel-mktops (paleta Brand Book v2.0 Paper/Ink/Accent + DM Sans + glifo MktOps). 5 kinds de layout — claim-bold, principle-dark, stat, hook-image, proof. Aplica copywriting-guardrails + copy-format-check como gates obrigatorios. Acionar quando o usuario pedir "ad MktOps", "anuncio MktOps", "Meta Ads MktOps", "story MktOps", "feed MktOps", "ad estatico MktOps", "anuncio pra Instagram da MktOps", "anuncio pra Facebook MktOps", ou quando passar tema/insumo e pedir ad estatico para a marca MktOps. Diferente de carousel-mktops (12 slides narrativo) e ads-create (multi-cliente, so copy). Esta skill e MktOps-only e entrega frame unico pra Meta Ads Manager.
---

# Ads MktOps — anuncios estaticos Meta Ads (Feed + Story)

## IDENTIDADE

Esta skill produz anuncios estaticos single-frame para campanhas Meta Ads da marca MktOps. Mesmo design system do `carousel-mktops` (paleta v2.0 Paper/Ink/Accent, DM Sans, glifo MktOps) — mas em **1 frame**, nao 12. Hook + claim + CTA precisam morar todos no mesmo quadrado.

A skill resolve internamente: selecao do kind, escrita da copy (headline + subhead + body + CTA), conferencia de char-limits Meta, scaffold da pasta de render, geracao dos PNGs Feed e Story. A resposta visivel ao Helio e copy + paths dos PNGs.

## REGRA-MAE

> **O anuncio precisa parar o scroll antes do segundo 1.**
> Sem hook visual + claim direto + CTA no mesmo frame, o ad esta morto.

Diferente do carrossel — no carrossel a capa parou o scroll e os 11 slides seguintes carregam o argumento. No ad estatico, tudo acontece no slide 1.

## QUANDO USAR ESTA SKILL VS OUTRAS

| Caso | Skill |
|---|---|
| Anuncio estatico Meta Ads pra MktOps (Feed + Story) | **ads-mktops** |
| Carrossel narrativo MktOps (12 slides, 4 atos) | `carousel-mktops` |
| Carrossel curto MktOps (6-10 slides, sem oferta) | `carousel-writer` |
| Ad estatico de outro cliente (Plugue, Propspeed, etc.) | `ads-create` + brand-profile.json do cliente |
| So copy de ad sem render (multi-cliente, multi-plataforma) | `ads-create` |
| Roteiro de video ad pra Reels/Stories | `ads-video-scripts` |

---

## INPUTS NECESSARIOS

Ao ser invocada, espera receber (explicitamente ou inferindo):

1. **Tema/angulo do ad** — frase, tese, numero, principio, ou caso a comunicar.
2. **Insumo opcional** — artigo, pesquisa, post anterior, dado especifico pra apoiar a copy.
3. **Quantidade de variacoes** — default 3 ads (3 kinds diferentes). Pode ser 1 ou ate 5.
4. **Formato(s)** — default ambos (Feed 1080x1350 + Story 1080x1920). Usuario pode pedir so um.
5. **CTA do Meta** — enum padrao (Saiba mais, Cadastre-se, Compre, Inscreva-se). Default: "Saiba mais".

Nao perguntar se o contexto da o suficiente.

---

## OS 5 KINDS DE AD

Antes de escrever, escolher o kind:

### 1. `claim-bold` — claim tipografico fundo Paper

**Quando:** declaracao forte, posicionamento, manifesto, frase-bandeira. Sem imagem.
**Anatomia:** Eyebrow (opcional) → Pill accent (opcional, ex: "novo") → Headline UPPERCASE gigante → Subhead accent-text → CTA strip.
**Exemplo de tese:** "Agencia que opera o seu marketing — nao so executa."

### 2. `principle-dark` — fundo Ink + accent

**Quando:** principio universal, contracorrente, observacao incisiva. Inverte fundo (verde-escuro) pra parar scroll. Sem imagem.
**Anatomia:** Eyebrow accent → Headline em Paper + accent destacado → Body explicativo curto → CTA.
**Exemplo de tese:** "Marketing nao escala por **volume**. Escala por __operacao__."

### 3. `stat` — numero-ancora gigante

**Quando:** prova concreta, resultado de cliente, dado de mercado. O numero e o protagonista.
**Anatomia:** Eyebrow → Numero 260-320pt (Feed/Story) → Label uppercase → Headline contextual menor → CTA.
**Exemplo:** "+2.866%" / "Impressoes organicas em 30 dias" / "Resultado depois que ligamos o sistema."

### 4. `hook-image` — imagem dominante + texto strip

**Quando:** retrato (Helio, cliente, time), screenshot de prova, foto de bastidor. Imagem ocupa ~40-50% do frame.
**Anatomia:** Header + Imagem (540px Feed, 820px Story) + Text-strip (eyebrow + headline + subhead + CTA).
**Exemplo de tese:** retrato do Helio + "Por que a gente abre o mecanismo — nao so o relatorio."

### 5. `proof` — quote/testemunho

**Quando:** social proof, depoimento de cliente, frase de autoridade externa. Sem imagem (a quote e o visual).
**Anatomia:** Eyebrow → Quote enorme (76-88pt) com aspas estilizadas → Atribuicao com role uppercase → CTA.
**Exemplo:** "Foi a primeira agencia que devolveu o controle do meu marketing pra dentro de casa."

---

## CHAR-LIMITS META (TRAVAR ANTES DE RENDERIZAR)

### Copy de ad-arte (texto **dentro** da imagem)

| Campo | Kind | Maximo recomendado |
|---|---|---|
| Headline | claim-bold, principle-dark, hook-image | **60 chars** (cabe em 2 linhas largas) |
| Headline | stat | **80 chars** (headline e secundaria, numero domina) |
| Subhead | qualquer | **90 chars** |
| Body | principle-dark, claim-bold | **140 chars** (2 paragrafos curtos) |
| Quote | proof | **140 chars** |
| Attribution | proof | **40 chars** + role 30 chars |
| CTA strip label | qualquer | **22 chars** ("saiba como →", "ver o caso →") |
| Pill | qualquer | **8 chars** ("novo", "case", "ao vivo") |
| Stat number | stat | **8 chars** ("+2.866%", "R$ 4M") |
| Stat label | stat | **48 chars** UPPERCASE |
| Eyebrow | qualquer | **28 chars** UPPERCASE |

### Copy do gerenciador (vai junto do ad no Meta Ads Manager)

Esses sao os limites oficiais do Meta — alem de respeitar, respeitar tambem o ponto de truncamento "ver mais".

| Campo | Limite tecnico | Truncamento "ver mais" |
|---|---|---|
| **Primary text** (texto principal do post) | 125 chars sem cortar | 125 chars (Feed) / 80 chars (Story tem outras regras) |
| **Headline** (titulo abaixo da imagem no Feed) | 27 chars sem cortar / 40 chars limite tecnico | 27-40 chars |
| **Description** (linha extra) | 27 chars sem cortar / 30 chars limite | 27 chars |
| **CTA button** | enum: "Saiba mais", "Cadastre-se", "Compre", "Inscreva-se", "Baixe", "Entre em contato", "Reserve agora", "Solicite agora", "Veja mais" | — |

**Regra:** sempre rodar `copy-format-check` ao final pra confirmar que nada estourou.

---

## CERBRO DE COPY — opt-in (referencia opcional)

Em ad rotineiro, skill roda sozinha. Em ad-ancora (peca de lancamento, posicionamento novo, prova-chave), ler **antes** de gerar:

- `03-hooks-e-aberturas.md` — headline: 10 openers Sultanic + 60-Sec Hook
- `06-closes-e-ctas.md` — CTA strip + Primary text close
- `09-bullets-e-tecnicas-de-frase.md` — microcopy, embedded commands, ratio 7:1
- `11-anti-padroes.md` — auditoria pre-render

Trigger explicito do Helio: "use o Cerebro" / "aplique Cerebro N/M".

---

## PROCESSO INTERNO (nao expor no output final)

### Passo 1 — Decidir kind por variacao

Default 3 variacoes = 3 kinds diferentes (cobre angulos distintos do mesmo tema). Combinacao recomendada:

| Variacao | Kind | Funcao |
|---|---|---|
| 1 | `claim-bold` ou `principle-dark` | Posicionamento — "quem somos / o que defendemos" |
| 2 | `stat` ou `proof` | Prova — "o que ja entregamos / o que dizem de nos" |
| 3 | `hook-image` | Retrato — "rosto/bastidor que humaniza" |

Se o tema for so principio (sem dado/prova/imagem disponivel), entregar 3 variacoes em 3 kinds tipograficos diferentes (claim-bold + principle-dark + proof inventado nao — proof so com quote real).

### Passo 2 — Escrever copy do ad-arte

Para cada variacao escolhida:

1. Headline (≤60 chars salvo `stat`) — direto, sem clausula subordinada longa.
2. Subhead (≤90 chars) — completa o pensamento. Pode ser provocacao ou desambiguacao.
3. Body (so em claim-bold / principle-dark, ≤140 chars) — 2 frases curtas.
4. CTA strip label (≤22 chars) — verbo + complemento ("ver como a gente opera", "ler o caso").

**Vetar:**
- Antitese vazia ("nao e X, e Y") sem prova.
- Paradiastole ("nao chame de erro, chame de aprendizado").
- Climax degenerado ("agencias falham — MUITAS falham — A MAIORIA falha").
- Bomphiologia (palavra forte sem sustentacao: "revolucionario", "transformacional").
- Adjetivo no lugar de fato ("incrivel resultado" sem numero).

### Passo 3 — Escrever copy do gerenciador

Pra cada variacao, escrever tambem:

- **Primary text** (≤125 chars sem cortar) — repete o hook em outra forma e abre pra acao.
- **Headline gerenciador** (≤40 chars) — chamada abaixo da imagem.
- **Description** (≤27 chars) — opcional, complemento curto.
- **CTA button** (enum Meta) — escolher o que casa com a oferta.

### Passo 4 — Scaffold + render

```bash
cd "/Users/heliofcostajunior/Studio Artemis/automacao/paper-designs"
./novo-ad-mktops.sh ad-N-slug
cd ad-N-slug
# editar ads.json com a copy de cada variacao
# (se algum kind for hook-image, baixar imagem em assets/ + rodar node processa-imagens.js)
node gerar.js
# saida: out/01-feed.png + 01-story.png + 02-feed.png + 02-story.png + ...
```

### Passo 5 — Gates obrigatorios

Antes de fechar a entrega:

1. **copywriting-guardrails** — passa cada texto da copy pra eliminar viciios de IA.
2. **copy-format-check** — confere char-limits do gerenciador (primary text 125, headline 40, description 27).

---

## ENTREGA — FORMATO PADRAO

Seguindo a Regra 3 do CLAUDE.md raiz: **so copy + paths dos PNGs**. Nada de explicacao, conceito, principio aplicado, sugestao visual, plano de teste.

```
# Ad MktOps — <tema>

## #1 Ad — claim-bold

**Headline:** ...
**Subhead:** ...
**Body:** ...   ← so se o kind for claim-bold ou principle-dark
**CTA strip:** ...

**Primary text:** ...
**Headline gerenciador:** ...
**Description:** ...   ← so se necessaria
**CTA button:** Saiba mais

Feed:  `automacao/paper-designs/ad-N-slug/out/01-feed.png`
Story: `automacao/paper-designs/ad-N-slug/out/01-story.png`

---

## #2 Ad — stat
... (mesma estrutura)
```

Se nenhuma imagem foi necessaria, nao mencionar imagem. Se o kind for `hook-image`, indicar qual imagem foi usada apenas como path na seu pasta `assets/` — sem brief visual, sem racional.

---

## DEFAULTS DA MARCA

Tudo isso ja esta hard-coded no `_template-ad-mktops/template.html` — nao precisa repetir no `ads.json`:

- **Marca exibida:** "MktOps" (lockup top-left)
- **Handle:** `@studio.artemis` (top-right) — pode sobrescrever no campo `handle` do ads.json se o ad rodar em outra conta
- **Paleta:** Paper #F3EEE6 / Soft #ECE6DB / Ink #15321B / Accent #A8E87A — Brand Book v2.0
- **Fonte:** DM Sans em tudo (display 500/700, body 400, label 500 uppercase)
- **Glifo:** quadrado 32x32 com recorte 2x2 (clip-path polygon)
- **Formato Feed:** 1080x1350 (4:5)
- **Formato Story:** 1080x1920 (9:16) com safe-top 240px + safe-bottom 380px
- **deviceScaleFactor:** 2 (PNG sai @2x)

Se o cliente pedir paleta diferente — **nao usar esta skill**. Usar `ads-create` + brand-profile.json do cliente certo.

---

## ANTI-PADROES (rejeitar antes de renderizar)

1. **Headline em pergunta retorica** ("Voce sabia que...?", "Ja parou pra pensar...?")
2. **Headline com adjetivo no lugar de fato** ("Resultado incrivel", "Sistema poderoso")
3. **Stat sem fonte clara** — se o numero nao tem origem nomeavel, nao usa kind `stat`.
4. **Proof com quote inventada** — proof exige depoimento real. Sem depoimento, troca de kind.
5. **Hook-image com stock photo** — segue a mesma regra do carousel-mktops: imagem real ou nao usa imagem.
6. **CTA strip generico** ("clique aqui", "saiba mais") — sempre verbo + complemento especifico.
7. **Eyebrow decorativo** ("ATENCAO", "URGENTE") — eyebrow e categoria do conteudo, nao adornar.
8. **Body inflado** — se passou 140 chars, o body nao esta destilado. Re-escrever, nao truncar.

---

## REFERENCIAS

- **Template visual:** `automacao/paper-designs/_template-ad-mktops/`
- **Scaffold:** `automacao/paper-designs/novo-ad-mktops.sh ad-N-slug`
- **Source of truth da marca:** `automacao/remotion-reels/_assets/refs/mktops-brand-v2/SOURCE-OF-TRUTH.md`
- **Skill irma de carrossel:** `.claude/skills/carousel-mktops/SKILL.md`
- **Gate de char-limit:** `.claude/skills/copy-format-check/SKILL.md`
- **Gate de qualidade:** `.claude/skills/copywriting-guardrails/SKILL.md`
