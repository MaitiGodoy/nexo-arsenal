---
name: carousel-propspeed
description: Escreve e renderiza carrosséis de Instagram para a Propspeed (revestimento foul-release para metais submersos) em modo B2B (estaleiro/aplicador/marina) e B2C (proprietário de embarcação). Pipeline completo — copy travada por char-limits + arte 1080x1350 com paleta marítima (navy/teal/cyan/light) + logo central + 12 kinds de slide. Usa o template `automacao/paper-designs/_template-propspeed/`. Acionar quando o usuário pedir carrossel da Propspeed, "carrossel pra hélice", "post sobre foul-release", "carrossel B2B aplicador", "carrossel B2C proprietário", ou citar o cliente Propspeed pedindo conteúdo de Instagram. Usar SEMPRE em conjunto com `copywriting-guardrails` na revisão final.
---

# Carousel Propspeed — pipeline B2B/B2C com design system marítimo

## IDENTIDADE

Esta skill produz carrosséis pro cliente **Propspeed** (Studio Artemis é representante exclusivo da marca na América Latina via JRG). Toda peça segue o design system marítimo cristalizado em `automacao/paper-designs/_template-propspeed/`, calibrado contra os criativos atuais (`clientes/propspeed/entregas/ABR26 - CARROSSÉIS PROPSPEED V2.md` e os JPGs em `~/Downloads/Criativos - Propspeed/`).

A skill resolve internamente: leitura do briefing, escolha do modo B2B/B2C, seleção do arquétipo de capa, escrita dos slides com char-limits validados, scaffold da pasta de carrossel, organização das imagens em `assets/<categoria>/`, e render dos PNGs 1080x1350. A resposta visível é a copy estruturada (com contagem de chars por slide) — só depois de aprovação no chat o pipeline parte pra render.

## REGRA-MÃE (não negociável)

> **A copy nunca estoura o canvas.**
> Toda copy é validada via `valida-copy.js` antes de gerar arte. Se algum campo passar do hard-cap do kind, a skill reescreve até caber. Não há deliverable com texto cortado, fonte 14px improvisada ou layout amassado.

E como decorrência:

> **B2B fala com aplicador, B2C fala com proprietário.**
> Os dois públicos compartilham os mesmos kinds de slide e a mesma paleta — o que muda é vocabulário, gancho, prova e CTA. Misturar os dois no mesmo carrossel é falha de modo.

---

## DOIS MODOS — escolher antes de escrever

| Modo | Público | Gancho típico | Prova típica | CTA típico |
|---|---|---|---|---|
| **B2B** | Aplicador certificado, gerente de estaleiro, técnico de marina | "Por que sua aplicação está descolando antes do prazo?" / "A janela de 30 a 60 minutos que define a garantia" | Screenshot da ficha técnica · foto do processo · gráfico de durabilidade · selo OEM (Cranchi, Astor) | "Vire aplicador certificado" · "Solicite a ficha técnica" · "Agende treinamento Like a Pro" |
| **B2C** | Proprietário de embarcação, entusiasta, capitão | "Sua hélice perdendo 30% de eficiência" / "Os melhores estaleiros do mundo escolhem isso" | Foto antes/depois · barco navegando · cor dourada do produto · depoimento de owner | "Calcule a cobertura" · "Encontre um aplicador na sua marina" · "Conheça o kit" |

**Regra de decisão:**
- Insumo é "como aplicar", "erros comuns", "garantia técnica", "certificação", "OEM", "ficha técnica" → **B2B**.
- Insumo é "vale a pena?", "quanto economiza?", "quanto dura?", "comparativo com tinta de fundo", "cor dourada", "lifestyle náutico" → **B2C**.
- Em dúvida: se o leitor ideal está com o kit na mão e cinto de aplicador, é **B2B**. Se está pilotando o barco no fim de semana, é **B2C**.

---

## INPUTS NECESSÁRIOS

Ao ser invocada, a skill espera (explicitamente ou inferindo do contexto):

1. **Tema do carrossel** — assunto específico (ex: "janela de 30-60 min entre primer e topcoat", "ROI em 12 meses", "Cranchi adotou de fábrica", "antes/depois de 24 meses").
2. **Modo** — B2B ou B2C. Se omitido, inferir do tema.
3. **Quantidade de slides** — default 8. Faixa válida: **6-10**. Carrosséis acima de 10 disfocam atenção; abaixo de 6 não dão pra contar a história.
4. **Imagens disponíveis** — pastas categorizadas em `assets/`:
   - `assets/helices/` — fotos de hélices (B2C foca aqui)
   - `assets/produto/` — packshots do kit Medium/Large
   - `assets/aplicacao/` — processo step-by-step (B2B foca aqui)
   - `assets/antes-depois/` — pares para slide `before-after`
   - `assets/lifestyle/` — barcos navegando, marinas, estaleiros
   - `assets/oem/` — parcerias OEM (Cranchi, Astor, Budget Marine)

Se o usuário não passar imagens, a skill identifica os 3-5 slots de imagem necessários e pede pra ele baixar/escolher antes de seguir pro render. **Não fabrica imagem com IA** — o universo Propspeed é fotorrealista e as imagens vêm do banco oficial da marca, do site `propspeed.com.br`, do Instagram `@propspeed` ou do estoque de campanha do cliente.

---

## PROCESSO INTERNO (nunca expor no output final)

### Passo 1 — Ler o briefing

Antes de escrever qualquer slide:
1. Ler `clientes/propspeed/CLAUDE.md` e `clientes/propspeed/FEV26 - BRIEFING PROPSPEED.docx.md`.
2. Conferir entregas anteriores em `clientes/propspeed/entregas/` (especialmente `ABR26 - CARROSSÉIS PROPSPEED V2.md`) pra não repetir gancho nem ângulo.
3. Identificar pilar de conteúdo do carrossel (Problema/Solução, Educacional, Prova Social, Processo, Lifestyle, Economia).

### Passo 2 — Estrutura recomendada por modo

**B2B (8 slides default):**
1. `cover-dark` — capa-tese sobre a dor técnica do aplicador
2. `image-teal` ou `navy-text` — sintoma observável no estaleiro
3. `product-light` — kit + sequência química
4. `steps` — passos numerados do processo (3-5 etapas)
5. `navy-text` — princípio técnico que amarra os passos
6. `checklist` — condições que destravam a garantia (4-6 itens)
7. `quote` — testemunho de aplicador certificado ou OEM
8. `cta-button` — CTA pra ficha técnica / certificação

**B2C (8 slides default):**
1. `cover-dark` — capa de tensão (hélice incrustada, barco devagar)
2. `before-after` — split com banda cyan FOULED|PROPSPEED
3. `image-teal` ou `navy-text` — perda concreta (30% combustível, vibração, manutenção)
4. `product-light` — kit dourado + funcionamento
5. `stat-big` — número-âncora (12-24 meses, 30%, US$ 599)
6. `image-caption` — barco rodando livre / lifestyle aspiracional
7. `light-cta` ou `quote` — princípio + autoridade ("Cranchi adotou de fábrica")
8. `cta-button` — CTA pra calculadora / aplicador na região

Variações livres: trocar `quote` por `image-caption`, `steps` por `mechlist`-equivalente (`checklist`), reordenar dentro da macroestrutura **tensão → desenvolvimento → prova → CTA**.

### Passo 3 — Escrever respeitando char-limits

Char-limits travados em `_template-propspeed/valida-copy.js`. Esta tabela é a fonte canônica:

| kind | campo | soft (ideal) | hard (limite visual) |
|---|---|---|---|
| `cover-dark` | eyebrow | 28 | 42 |
| `cover-dark` | headline | 70 | 110 |
| `cover-dark` | caption.title | 60 | 90 |
| `cover-dark` | caption.body | 100 | 160 |
| `image-teal` | headline | 70 | 100 |
| `image-teal` | body | 180 | 280 |
| `product-light` | headline | 60 | 85 |
| `product-light` | body | 180 | 260 |
| `navy-text` | headline | 70 | 100 |
| `navy-text` | body | 190 | 280 |
| `image-caption` | headline | 60 | 90 |
| `image-caption` | body | 120 | 200 |
| `light-cta` | headline | 50 | 80 |
| `light-cta` | body | 100 | 180 |
| `before-after` | headline | 70 | 100 |
| `before-after` | body | 80 | 140 |
| `before-after` | leftLabel / rightLabel | 10 | 14 |
| `stat-big` | stat | 6 | 10 |
| `stat-big` | unit | 8 | 14 |
| `stat-big` | label | 40 | 70 |
| `stat-big` | body | 100 | 200 |
| `steps` | headline | 50 | 90 |
| `steps` | step.title | 30 | 50 |
| `steps` | step.body | 60 | 120 |
| `steps` | items.count | 3 | 5 |
| `quote` | quote | 100 | 180 |
| `quote` | attribution | 25 | 55 |
| `checklist` | headline | 50 | 90 |
| `checklist` | item.each | 40 | 75 |
| `checklist` | items.count | 4 | 6 |
| `cta-button` | headline | 40 | 70 |
| `cta-button` | body | 80 | 160 |
| `cta-button` | button | 18 | 32 |

**Regras adicionais de escrita:**
- Markdown leve: `**negrito**` no corpo, `__destaque__` (vira cyan/teal). Usar com moderação — máximo **um** `__italic__` por slide (palavra-âncora) e **dois** `**bold**`.
- Quebra de parágrafo: `\n\n` no body. Usar quando o body tem 2 ideias distintas.
- Headlines em português brasileiro. Sem clichê de IA: nada de "imagine que…", "no fim do dia", "transforme seu…", "potencialize…".
- Aplicar `copywriting-guardrails` antes de fechar a copy.

### Passo 4 — Escolher slot de imagem por slide

A regra: **toda peça Propspeed tem imagem real, nunca stock genérico.** Origem: site oficial `propspeed.com.br`, Instagram `@propspeed`, banco do cliente, ou foto autoral do estaleiro.

| kind | slot de imagem | sugestão de pasta |
|---|---|---|
| `cover-dark` | imagem full-bleed escura/dramática (hélice na água, barco em movimento, estaleiro à noite) | `assets/helices/` ou `assets/lifestyle/` |
| `image-teal` | imagem editorial 4:3 — cena do problema | `assets/helices/` (incrustada) ou `assets/aplicacao/` |
| `product-light` | packshot PNG do kit (sem fundo) | `assets/produto/` |
| `image-caption` | paisagem ampla (barco navegando, marina) | `assets/lifestyle/` |
| `before-after` | par de imagens equivalentes (mesma hélice, mesmo ângulo) | `assets/antes-depois/` |
| `navy-text` / `quote` / `checklist` / `stat-big` / `steps` / `cta-button` / `light-cta` | sem slot de imagem | — |

Se o usuário não tem imagem pra um slot, **trocar o kind do slide** ao invés de gerar com placeholder hachurado. Ex: sem foto de antes/depois disponível → trocar `before-after` por `navy-text` com a mesma tese.

### Passo 5 — Logo

O logo Propspeed entra automaticamente no topo de todo slide. Dois arquivos esperados em `assets/`:
- `logo-light.png` — logo escuro (azul-marinho) pra slides claros
- `logo-dark.png` — logo branco pra slides escuros

Se ambos faltarem, o template usa fallback tipográfico "PROPSPEED®" em Mulish 800. **Pedir ao usuário pra colar os PNGs em `assets/` antes do render** se o briefing for oficial.

---

## ENTREGÁVEL EM 2 FASES

**Fase A — copy estruturada no chat (sempre).**
Mostrar a copy slide a slide em markdown, com char-counts visíveis. Esperar OK do Hélio antes de partir pro render.

Formato canônico:

```
## Carrossel Propspeed — <tema> · modo <B2B|B2C> · <N> slides

### Slide 01 · cover-dark · imagem: assets/helices/<arquivo>.jpg
- eyebrow (24/42): PROTEÇÃO PREMIUM
- headline (62/110): Sua hélice merece a __mesma proteção__ dos superyachts.
- caption.title (29/90): Sem biocida. Sem dano ao mar.
- caption.body (61/160): Foul-release que economiza combustível e dura 12-24 meses.

### Slide 02 · image-teal · imagem: assets/helices/casco-com-cracas.jpg
- headline (45/100): Hélice incrustada perde até 30% de eficiência.
- body (197/280): Cada milímetro de craca vira **arrasto**, vibração e gasto extra...

[...]

**Imagens necessárias:**
- assets/helices/<arquivo>.jpg (cover)
- assets/helices/casco-com-cracas.jpg (slide 2)
- assets/antes-depois/helice-suja.jpg + helice-propspeed.jpg (slide 3)
- assets/produto/medium-kit.png (slide 5)

**Próximo passo:** OK pra rodar pipeline? (cd, scaffold, slides.json, render)
```

**Fase B — pipeline (só após OK).**

```bash
cd "/Users/heliofcostajunior/Studio Artemis/automacao/paper-designs"
./novo-carrossel-propspeed.sh carrossel-propspeed-N-tema
cd carrossel-propspeed-N-tema
# colar imagens em assets/<categoria>/
# editar slides.json com a copy aprovada
node valida-copy.js slides.json   # gate de char-limits
node processa-imagens.js          # se tiver imagens cruas
node gerar.js                     # render
```

Saída: `out/01.png ... NN.png` 1080×1350 @2x + `out/preview.html`.

**Salvar markdown canônico** em `clientes/propspeed/conteudo/carrossel-propspeed-N-tema.md` com a copy + paths das imagens + legenda do post.

---

## LEGENDA PADRÃO (Instagram)

A legenda do post Propspeed segue o template:

```
<gancho que conecta com a capa em 1-2 frases>

<corpo: 3-5 linhas explicando o ponto técnico/comercial central, sem repetir os slides palavra por palavra>

<CTA explícito: link na bio pra calculadora, DM pra "PROPSPEED" pra receber kit, ou "comente APLICADOR pra receber a ficha técnica">

—
#Propspeed #PropspeedBrasil #Hélice #FoulRelease #Náutica #ProteçãoPremium <+ 5-8 hashtags do nicho>
```

Manter `#PropspeedBrasil` como hashtag de marca da operação LATAM.

---

## CHECKLIST DE QA (antes de entregar)

- [ ] Modo (B2B ou B2C) declarado e consistente em todos os slides
- [ ] Tema cabe num pilar do briefing (Problema/Solução, Educacional, Prova Social, Processo, Lifestyle, Economia)
- [ ] Estrutura macro: tensão → desenvolvimento → prova → CTA
- [ ] Todos os char-counts dentro do hard-cap (rodar `valida-copy.js`)
- [ ] Imagens existem em `assets/<categoria>/` ou foram explicitamente solicitadas ao usuário
- [ ] Logo `logo-light.png` e `logo-dark.png` em `assets/` (ou fallback tipográfico aceito)
- [ ] Capa usa `cover-dark` com headline curto + eyebrow + caption (não estourar)
- [ ] CTA final é específico (calculadora, certificação, ficha técnica) — não genérico ("saiba mais")
- [ ] Copy passa por `copywriting-guardrails` (sem antítese vazia, paradiastole, climax degenerado)
- [ ] Markdown canônico salvo em `clientes/propspeed/conteudo/`
- [ ] Render rodou sem warnings de fonte/imagem ausente

---

## REFERÊNCIAS CANÔNICAS

- **Template e pipeline:** `automacao/paper-designs/_template-propspeed/`
- **Scaffold script:** `automacao/paper-designs/novo-carrossel-propspeed.sh`
- **Validador de copy:** `automacao/paper-designs/_template-propspeed/valida-copy.js`
- **Briefing do cliente:** `clientes/propspeed/FEV26 - BRIEFING PROPSPEED.docx.md`
- **CLAUDE.md do cliente:** `clientes/propspeed/CLAUDE.md`
- **Entregas anteriores (não repetir gancho):** `clientes/propspeed/entregas/ABR26 - CARROSSÉIS PROPSPEED V2.md` e `ABR26 - CARROSSÉIS PROPSPEED.md`
- **Criativos atuais (calibragem visual):** `~/Downloads/Criativos - Propspeed/CARROSSEL 4 - 0[1-7].jpg`
- **Design system upstream (handoff Claude Design):** `/tmp/propspeed-design/propspeed/project/slides.jsx` (12 layouts originais)

## RELAÇÃO COM OUTRAS SKILLS

- `carousel-mktops` → carrosséis MktOps/Plugue (paleta branco/preto/verde, 12 slides 4 atos). Não usar pra Propspeed.
- `carousel-writer` → carrosséis genéricos sem oferta. Não usar pra Propspeed.
- `copywriting-guardrails` → revisão obrigatória de toda copy antes de fechar.
- `copy-format-check` → não se aplica (não é ad estático). Para ad estático Propspeed, ver `ABR26 - AD ESTÁTICOS - PROPSPEED.md`.
