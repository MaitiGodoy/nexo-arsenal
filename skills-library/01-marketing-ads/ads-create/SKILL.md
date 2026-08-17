---
name: ads-create
description: >
  Campaign concept, copy brief, and expanded copy deck generator for paid advertising.
  Reads brand-profile.json and optional audit/market research results to produce
  structured campaign concepts, image briefs, and 50+ ad copies in 3 waves.
  Outputs campaign-brief.md and copy-deck-expandido.md to the current directory.
  Run after /ads dna. Triggers on: "create campaign", "campaign brief", "ad concepts",
  "write ad copy", "campaign strategy", "ad messaging", "creative brief", "generate concepts".
---

# Ads Create — Campaign Concept & Expanded Copy Deck Generator

Generates structured campaign concepts, platform-specific image briefs, and an expanded
copy deck (50+ copies in 3 waves) from your brand profile and optional audit/market data.

## Cérebro de Copy — opt-in (referência opcional)

Camada estratégica acima desta skill. **Não compulsória.** Em peça rotineira, skill roda sozinha. Em peça estratégica ou quando o usuário pedir "use o Cérebro" / "aplique Cérebro N/M/P", ler **antes** de gerar.

Cérebro vive em `clientes/Hélio Costa Jr./Obsidian/1-Marketing-IA/cerebro-de-copy/`. Mapa completo dos 14 arquivos no CLAUDE.md raiz do projeto.

**Arquivos relevantes pra esta skill:**
- `03-hooks-e-aberturas.md` — catálogo de openers (60-Sec Hook, Sultanic, subjects Settle)
- `06-closes-e-ctas.md` — closes nomeados Sultanic + 10 CTAs Settle
- `09-bullets-e-tecnicas-de-frase.md` — microcopy, bullets, embedded commands
- `11-anti-padroes.md` — checklist de auditoria pré-publicação

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/ads create` | Full campaign brief + expanded copy deck |
| `/ads create --platforms meta google` | Brief for specific platforms only |
| `/ads create --objective leads` | Brief optimized for lead generation |
| `/ads create --skip-expansion` | Concepts + basic copy only (no 3-wave expansion) |

## Process

### Step 1: Check for Brand Profile

Look for `brand-profile.json` in the current directory.

- **Found**: Load and proceed.
- **Not found**: Ask the user:
  > "I don't see a brand-profile.json in this directory. Would you like to:
  > 1. Run `/ads dna <url>` first to extract brand DNA automatically
  > 2. Describe your brand manually (I'll create a basic profile from your description)"

If the user chooses manual, collect:
- Brand name and website
- Primary color (or "unsure")
- 3 words that describe the brand voice
- Target audience (age, role, key pain point)
- Main product/service offering

### Step 2: Check for Audit & Market Research Results

Look for these files in the current directory (all optional):

- `ADS-AUDIT-REPORT.md` or any `*-audit-results.md` — campaign audit data
- `briefing-mercado-*.md` or `market-research-*.md` — market research/competitive intelligence

**If audit data found**: Note the top 3 weaknesses to address in concepts.
**If market research found**: Extract competitive gaps, underserved audiences, and positioning opportunities to inform concepts.
**If neither found**: Continue without. Note in the brief: "No audit or market data found — concepts are generalized. Run `/ads audit` or market research for targeted concepts."

### Step 3: Collect Campaign Parameters

If flags were provided in the command, use those values and skip the corresponding questions.

Ask (combine into one message — omit any already provided via flags):
1. **Platforms**: Which ad platforms? (Meta · Google · LinkedIn · TikTok · YouTube · Microsoft · All)
2. **Objective**: Sales/Revenue · Leads/Demos · App Installs · Brand Awareness · Retargeting
3. **Offer or brief**: Any specific offer, promotion, or message to highlight? (optional)
4. **Number of concepts**: How many campaign concepts? (default: 5)

### Step 4: Generate Campaign Concepts

Spawn `creative-strategist` agent. This agent creates `campaign-brief.md` and writes:
- `## Brand DNA Summary`
- `## Audit Context`
- `## Campaign Concepts` (each with hypothesis, primary message, tone, visual direction, CTA)
- `## Image Generation Briefs` (one brief per concept × platform)
- `## Next Steps`

Wait for `creative-strategist` to **fully complete** before continuing.

### Step 5: Validation Pause

Present the concepts to the user in a summary:

```
✓ [N] conceitos de campanha criados

Conceitos:
  1. [Nome] — [ângulo] — [mensagem central em 1 linha]
  2. [Nome] — [ângulo] — [mensagem central em 1 linha]
  [etc.]

Quer ajustar algum conceito antes de gerar o copy deck expandido (50+ copies)?
Se não, eu sigo para a geração das 3 waves.
```

**If the user wants changes**: adjust the concepts in campaign-brief.md, then proceed.
**If the user approves**: proceed to Step 6.
**If `--skip-expansion` flag was used**: spawn `copy-writer` for basic copy deck only (legacy behavior), skip Steps 6-7, go to Step 8.

### Step 6: Generate Expanded Copy Deck (3 Waves)

Generate a separate file `copy-deck-expandido.md` with 50+ copies organized in 3 waves.

Read brand-profile.json for: thesis, common_enemy, ad_angles, voice rules, avoid list.
Read campaign-brief.md for: the approved concepts.
Read produto-*.md or product reference files for: product details, pricing, features.

#### WAVE 1 — Core (5 copies per concept × N concepts)

For each concept, generate 5 complete copies (hook + body + CTA), each in a DIFFERENT FORMAT:

| # | Format | Description |
|---|--------|-------------|
| 1 | **Provocação/Contrarian** | Opens challenging a belief the audience holds |
| 2 | **Antes/Depois** | Shows transformation with specific before/after |
| 3 | **Prova Social/Notícia** | Opens with data, fact, or third-party validation |
| 4 | **Pergunta** | Opens with question the audience identifies with |
| 5 | **Declaração Direta/Bold Claim** | Opens with strong statement, no preamble |

#### WAVE 2 — Extension (5 copies per top 3 concepts)

Select the 3 strongest concepts (based on brand-profile.json ad_angles priority and market differentiation). Generate 5 copies each using NEW formats:

| # | Format | Description |
|---|--------|-------------|
| 6 | **Meme/Humor** | Ironic, witty, or culturally resonant tone |
| 7 | **Lista Rápida** | Rapid-fire list of benefits/features |
| 8 | **História/Narrativa** | Mini personal story or case study |
| 9 | **Comparação Direta** | Explicit side-by-side comparison |
| 10 | **Urgência/FOMO** | Window of opportunity, scarcity, timing |

#### WAVE 3 — Wild Cards (10 copies)

10 experimental copies mixing angles and using unexpected approaches:
- Contrarian extremo
- Pattern interrupts
- Tribal identity splits ("Isso separa quem usa IA de quem COMANDA IA")
- Before/After compression ("O que levava 3 dias agora leva 4 minutos")
- Formato "notícia" ("Em 2026, clientes começaram a cancelar agências...")
- Formato "depoimento em primeira pessoa"
- Formato "confissão"
- Formato "desafio"

#### Copy Rules (apply to ALL waves)

Each copy must:
- Be COMPLETE and independent (hook + body + CTA integrated naturally)
- Have NO labels inside the copy ("Hook:", "Body:", "CTA:" are FORBIDDEN)
- Be ready to paste into Meta Ads Manager as-is
- Use specific numbers and data (not vague claims)
- Sound like someone who already did it, not someone promising

PROHIBITED in all copies:
- Hedges ("talvez", "vale ressaltar", "é importante notar que")
- AI clichés ("revolucionário", "game-changer", "disruptivo", "o futuro é agora")
- Two-word sentences with period (AI tell)
- Empty antithesis, paradiastole, bomphiologia
- Excessive emojis (max 1 per copy if truly necessary)

#### Output Format for copy-deck-expandido.md

**Entrega somente o texto de cada anúncio. Nada de conceito, justificativa de framework, mockup, sugestão visual, plano de teste ou rodapé estratégico.**

Formato por anúncio (copy estática para Meta/LinkedIn/TikTok/Microsoft):

```
## #N Ad
**Headline:** …
**Subheadline:** …
**Descrição:** …   ← só quando for necessária pra coesão
**CTA:** …
```

Estrutura geral do arquivo:

```markdown
# Copy Deck Expandido — [Brand Name]

## WAVE 1 — Core

## #1 Ad
**Headline:** …
**Subheadline:** …
**Descrição:** …
**CTA:** …

## #2 Ad
**Headline:** …
**Subheadline:** …
**CTA:** …

[…continua numerado até o final das 3 waves]
```

**Proibido no arquivo:**
- Seção "Conceito" / "Princípio aplicado" / "Por que funciona"
- "Sugestão visual" / "Arte" / mockup / briefing de imagem (vai em arquivo separado se o usuário pedir)
- "Primary text" duplicando a descrição, tabelas resumo, plano de teste, rodapés com KPI, recomendações de produção
- Rótulos de formato tipo "Provocação/Contrarian", "Antes/Depois" visíveis no output final (use internamente para variar os ângulos, não escreva na entrega)

Se o usuário pedir o briefing visual ou o mapa estratégico de conceitos, gere em arquivo separado (`image-briefs.md`, `concepts-map.md`). O `copy-deck-expandido.md` entrega só a copy, pronta pra colar no gerenciador.

### Step 7: Apply Copywriting Guardrails

After generating the copy deck, apply the `copywriting-guardrails` review internally:
- Scan every copy for AI tells (antithesis, paradiastole, bomphiologia, climax degenerado, sententia falsa)
- Remove or rewrite any copy that violates the rules
- Ensure voice consistency with brand-profile.json

### Step 7.5: Platform Format Compliance Check (MANDATORY GATE)

**This step is blocking. No delivery without a green report.**

After guardrails pass, invoke the `copy-format-check` skill to validate every copy against the character and word limits of the target platform(s) defined in Step 3.

Process:
1. Read `copy-deck-expandido.md` (or the basic deck if `--skip-expansion` was used).
2. Read the `Platforms` field from `campaign-brief.md`.
3. Apply `copy-format-check` — count chars/words for every field (primary text, headline, description, CTA), compare to the platform spec table, and classify each copy as `✓ OK`, `⚠️ WARN`, or `❌ FAIL`.
4. For every `FAIL`: compress the copy using the heuristics in `copy-format-check` (number on line 1, cut connectors, one thesis + one CTA, break lines instead of conjunctions), then re-run `copywriting-guardrails` on the compressed version.
5. Replace the failed copies in `copy-deck-expandido.md` with the compressed and re-approved versions.
6. Write `format-compliance-report.md` in the same directory as the copy deck, documenting every copy's status, char/word counts, and any compressions applied.

**Blocking rule.** If any copy remains in `FAIL` status after compression, stop and ask the user whether to rewrite from scratch, change the target platform, or drop the copy. Never deliver a deck with failing copies.

Special cases:
- **Multi-platform decks.** When the same copy will run on more than one platform, validate against the strictest spec. If that breaks the copy, create platform-specific variants.
- **Hook cutoff.** The proof-social number or central dichotomy must fit before the mobile "see more" cutoff (125 chars on Meta). If it doesn't, move the number to line 1 and cut the preamble.
- **Copy pura.** Compression must preserve the "no labels" rule — never reintroduce Hook:/Body:/CTA: markers while trimming.

### Step 8: Video Scripts (Optional)

After the copy deck is generated, ask:

> "Copy deck pronto. Quer gerar roteiros de vídeo também? (12 formatos disponíveis: talking head, screen recording, b-roll + text overlay, fake UGC, speed demo, etc.)"

**If yes**: Follow the `ads-video-scripts` skill instructions. Read `campaign-brief.md`, `brand-profile.json`, and `copy-deck-expandido.md`. Generate video scripts in 3 waves and save as `video-scripts.md`.

**If no**: Skip to Step 9.

### Step 9: Review and Present

After all steps complete, confirm files exist and present:

```
✓ campaign-brief.md — [N] conceitos + [N] image briefs
✓ copy-deck-expandido.md — [N] copies em 3 waves
✓ format-compliance-report.md — [N] OK · [N] WARN · [N] FAIL (todos FAIL resolvidos)
✓ video-scripts.md — [N] roteiros em 12 formatos (se gerado)

Resumo:
  Conceitos: [N]
  Copies estáticas: [N] (Wave 1 + Wave 2 + Wave 3)
  Copies comprimidas no Step 7.5: [N]
  Roteiros de vídeo: [N] (se gerado)
  Image briefs: [N]

Próximos passos:
  1. Revise copy-deck-expandido.md e selecione as copies para testar
  2. Confirme o format-compliance-report.md antes de subir
  3. Revise video-scripts.md e selecione os roteiros para produzir
  4. Rode /ads generate para produzir imagens dos briefs
  5. Suba copy + assets no Meta Ads Manager
```

## Quality Gates

- **Minimum 5 concepts** (unless user requests fewer)
- **Minimum 50 copies** in the expanded deck (with --skip-expansion, minimum 25 headlines in basic deck)
- **Distinct angles**: no two concepts share the same primary message angle
- **Distinct formats**: no two copies within the same concept use the same format
- **Platform fit (blocking)**: every copy must pass Step 7.5 `copy-format-check` for the target platform(s). Zero copies in `FAIL` status at delivery. Concepts targeting TikTok must also acknowledge vertical-only and sound-on context.
- **Hook within cutoff**: the main proof point (number, client name, or central dichotomy) must fit before the mobile "see more" truncation point of the target platform (e.g. 125 chars on Meta Feed).
- **Offer anchoring**: if the user provided a specific offer, at least 1 concept must lead with it
- **Image briefs**: every concept must have at least one image brief per requested platform
- **Zero AI tells**: all copies must pass the guardrails check before delivery
- **Copy pura**: no labels, no structure markers inside the ad text itself

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
