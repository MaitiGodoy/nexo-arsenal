---
name: copy-format-check
description: Valida copy de ads contra os limites de cada plataforma (Meta, Google, LinkedIn, TikTok, Microsoft, X, YouTube, Substack) antes da entrega. Conta caracteres e palavras por campo (primary text, headline, description, CTA), detecta estouros, sinaliza o ponto de truncamento "ver mais" e comprime ou rejeita copy fora do spec. Use SEMPRE como gate final antes de qualquer entrega de copy para anúncio. Trigger: ao final de ads-create, ad-creative, copywriting, carousel-writer, cold-email, market-ads ou qualquer fluxo que gere copy destinada a plataforma de mídia.
---

# Copy Format Check — Platform Compliance Gate

Gate obrigatório de formatação antes de entregar qualquer copy de ad. Sem exceções.

## Princípio

Copy fora do spec da plataforma **é copy quebrada**, independentemente da qualidade retórica. Meta trunca, Google rejeita, LinkedIn corta no meio da frase, TikTok engole o hook. O check roda depois do `copywriting-guardrails` e antes da entrega final.

---

## Como usar

1. Leia o copy deck gerado (ex: `copy-deck-expandido.md`).
2. Identifique a(s) plataforma(s)-alvo no `campaign-brief.md` ou no pedido do usuário.
3. Para cada copy, conte **caracteres** e **palavras** por campo (primary text, headline, description, CTA).
4. Compare com a tabela de specs abaixo.
5. Marque cada copy como `✓ OK`, `⚠️ WARN` (entre o ideal e o máximo) ou `❌ FAIL` (acima do máximo).
6. Para `FAIL`: comprimir para dentro do ideal, preservando hook + prova social + CTA. Re-rodar `copywriting-guardrails` na versão comprimida.
7. Gerar `format-compliance-report.md` no mesmo diretório do deck com o status de cada copy.
8. Bloquear entrega se qualquer copy permanecer em `FAIL` depois da compressão.

---

## Tabela-mestra de specs por plataforma

**Convenção.** `ideal` = sweet spot de retenção/CTR validado por estudos de plataforma. `max` = limite técnico antes do truncamento/rejeição. `hook_cutoff` = ponto exato onde o "ver mais" / "see more" aparece no mobile feed — texto depois desse ponto só é visto por quem expandir.

### Meta — Facebook & Instagram Feed

| Campo | Ideal | Max | Hook cutoff (mobile) |
|---|---|---|---|
| Primary text | 125 chars (~20 palavras) | 63.206 chars | **125 chars** — corta com "... ver mais" |
| Headline | 27 chars | 40 chars | — |
| Description | 27 chars | 30 chars | — |
| Link description | 30 chars | 30 chars | — |

**Regra operacional.** Hook = primeiras 125 caracteres. Número/prova social **tem que** caber antes do corte. Idealmente: 30–50 palavras total.

### Meta — Instagram Stories & Reels

| Campo | Ideal | Max | Observação |
|---|---|---|---|
| Text overlay | 6–10 palavras | 2 linhas | Safe zone 14% topo / 20% rodapé |
| Caption | 125 chars | 2.200 chars | Primeiras 125 chars aparecem no feed |
| Hashtags | 3–5 | 30 | Evitar stuffing |

### Meta — Carousel Ad (Feed)

| Campo | Ideal | Max |
|---|---|---|
| Primary text (topo) | 125 chars | 63.206 chars |
| Headline por card | 27 chars | 40 chars |
| Description por card | 20 chars | 30 chars |

### Google Ads — Search (Responsive Search Ads)

| Campo | Quantidade | Ideal | Max |
|---|---|---|---|
| Headline | 3–15 | — | **30 chars cada** |
| Description | 2–4 | — | **90 chars cada** |
| Path (URL display) | 2 | — | 15 chars cada |

**Regra operacional.** Cada headline precisa ser uma unidade autônoma — Google embaralha. Sem pronomes que dependem de outra headline.

### Google Ads — Performance Max

| Campo | Quantidade | Max |
|---|---|---|
| Headline | até 5 | 30 chars |
| Long headline | até 5 | 90 chars |
| Description | até 5 | 90 chars |
| Business name | 1 | 25 chars |

### Google Ads — Demand Gen / Display

| Campo | Max |
|---|---|
| Short headline | 30 chars |
| Long headline | 90 chars |
| Description | 90 chars |

### Google Ads — YouTube (Video Action)

| Campo | Max |
|---|---|
| Headline | 15 chars |
| Long headline | 90 chars |
| Description | 70 chars |
| CTA button | 10 chars |

### LinkedIn — Single Image / Sponsored Content

| Campo | Ideal | Max |
|---|---|---|
| Introductory text | 150 chars | 600 chars (trunca em 150 no mobile) |
| Headline | 70 chars | 200 chars |
| Description | 100 chars | 300 chars |

### LinkedIn — Message / Conversation Ads

| Campo | Ideal | Max |
|---|---|---|
| Subject | 30 chars | 60 chars |
| Message body | 500 chars | 1.500 chars |
| CTA button text | 15 chars | 20 chars |

### TikTok Ads

| Campo | Ideal | Max |
|---|---|---|
| Ad text (caption) | 80 chars (~12 palavras) | 100 chars |
| Display name | 20 chars | 40 chars |
| Hook (primeiros segundos do vídeo) | 1–3 segundos | sempre |

**Regra operacional.** Emoji conta como 2 caracteres em algumas regiões. Evitar. Hook visual nos primeiros 1–3s é mais importante que o texto.

### Microsoft Ads (Bing)

Mesmo spec do Google Responsive Search Ads:
- Headline: 30 chars × até 15
- Description: 90 chars × até 4

### X (Twitter) Ads

| Campo | Ideal | Max |
|---|---|---|
| Tweet (orgânico e promoted) | 71–100 chars | 280 chars |
| Headline (Website Card) | 70 chars | 70 chars |

### YouTube — Community Posts e Comments

| Campo | Max |
|---|---|
| Community post | 1.500 chars |
| Comment | 10.000 chars (mas hook em 1 linha, ~100 chars) |

### Substack / Newsletter (email)

| Campo | Ideal | Max |
|---|---|---|
| Subject line | 30–50 chars | 78 chars (antes de truncar em mobile) |
| Preview text | 35–90 chars | 100 chars |
| Hook (primeira linha do corpo) | 1 frase curta | — |

### WhatsApp Business — Broadcast / Utility Template

| Campo | Max |
|---|---|
| Header (texto) | 60 chars |
| Body | 1.024 chars |
| Footer | 60 chars |
| CTA button | 25 chars |

---

## Heurísticas universais de compressão

Quando uma copy falhar no check, comprimir aplicando essas regras em ordem:

1. **Número na primeira linha.** Se a prova social numérica não estiver nas primeiras 12 palavras, mova para lá.
2. **Corte conectores.** "E se você está há mais de seis meses…" → "Seis meses pagando agência e zero lead?".
3. **Uma tese, um CTA.** Elimine fecho duplo (ironia + botão). Escolha um.
4. **Quebra de linha em vez de conjunção.** Substitua "e", "mas", "porque" por quebra dupla quando possível.
5. **Corte a introdução de contexto.** Vá direto pra tese. Remova "sua agência entrega X. mas seu comercial precisa de Y. não são a mesma coisa." → "Sua agência entrega X. Seu comercial precisa de Y.".
6. **Adjetivo vira número.** "Muitas empresas" → "64% das empresas".
7. **Verbo imperativo no CTA.** "Toque no botão e veja como funciona" → "Toque".
8. **Re-rode guardrails.** Toda copy comprimida passa de novo pelo `copywriting-guardrails` porque o corte pode ter reintroduzido um vício.

---

## Output — format-compliance-report.md

Gerar no mesmo diretório do copy deck. Formato:

```markdown
# Format Compliance Report — [Cliente] — [Data]

**Deck analisado:** [arquivo]
**Plataforma(s)-alvo:** [lista]
**Total de copies:** [N]
**Status agregado:** ✓ [N] OK · ⚠️ [N] WARN · ❌ [N] FAIL

## Por copy

### Copy 01 — [título]
- **Primary text:** 127 chars / 22 palavras → ✓ OK (ideal: 125)
- **Headline:** 31 chars → ⚠️ WARN (ideal: 27, max: 40)
- **Hook antes do "ver mais":** ✓ número da prova social cabe
- **Ação:** nenhuma

### Copy 14 — [título]
- **Primary text:** 312 chars / 58 palavras → ❌ FAIL
- **Problema:** hook com número só aparece na palavra 34
- **Ação:** comprimido para 127 chars, número movido para linha 1
- **Versão nova:** [copy comprimida inline]

## Summary

Copies aprovadas sem alteração: [N]
Copies comprimidas e re-aprovadas: [N]
Copies bloqueadas: [N]
```

---

## Quality Gates (bloqueantes)

- Nenhuma copy pode ser entregue em status `FAIL`.
- Toda copy em `WARN` precisa de sinal verde explícito do usuário ou rewrite.
- Hook (prova social numérica, nome do cliente ou dicotomia central) **tem que** caber antes do `hook_cutoff` da plataforma.
- Copies comprimidas passam por `copywriting-guardrails` de novo antes de entrar no report final.
- Plataformas não mapeadas nesta tabela precisam de um aviso explícito: "spec não mapeado — verificar manualmente antes de subir".

---

## Fontes dos limites

Dados coletados em documentação oficial das plataformas (abril 2026). Re-validar trimestralmente — plataformas alteram limites sem aviso amplo. Se encontrar divergência, priorize o documento oficial da plataforma e atualize esta tabela.

- Meta Business Help Center — Ad Specs
- Google Ads Help — Responsive Search Ads limits
- LinkedIn Campaign Manager — Creative specs
- TikTok Ads Manager — Ad specifications
- Microsoft Advertising — Ad format limits
- X Ads — Promoted Ads character limits
- YouTube Help — Community posts, comments

Última atualização: 2026-04-13.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
