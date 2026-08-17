---
name: vsl-writer
description: >
  Roteiros de VSL (Video Sales Letter) em pt-BR para tráfego pago, lançamento,
  evergreen e high-ticket. Estrutura híbrida Jon Benson + Brunson Hook-Story-Offer
  + Stack, adaptada pro tom Studio Artemis (direto, sem clichê de IA). Suporta 3
  durações: curta (60-90s ad-VSL), média (3-7min webinar curto / pre-call), longa
  (15-25min sales VSL). Lê brand-profile.json e produto-*.md se existirem. Aplica
  copywriting-guardrails como camada final. Triggers: "VSL", "video sales letter",
  "roteiro de VSL", "carta de vendas em vídeo", "sales VSL", "ad-VSL", "VSL curta",
  "VSL longa", "roteiro de venda em vídeo", "criar VSL para".
---

# VSL Writer — Video Sales Letters em pt-BR

Escreve VSL completa pronta pra gravar — texto puro, sem direção de cena. O editor decide câmera, corte, B-roll. A skill entrega copy.

## Cérebro de Copy — opt-in (referência opcional)

Camada estratégica acima desta skill. **Não compulsória.** Em VSL curta rotineira (ad-VSL Reels), skill roda sozinha. Em VSL média/longa, lançamento ou high-ticket, ou quando o usuário pedir "use o Cérebro" / "aplique Cérebro N/M/P", ler **antes** de gerar.

Cérebro vive em `clientes/Hélio Costa Jr./Obsidian/1-Marketing-IA/cerebro-de-copy/`. Mapa completo dos 14 arquivos no CLAUDE.md raiz do projeto.

**Arquivos relevantes pra esta skill:**
- `02-arquitetura-da-copy.md` — Sultanic Master, Hero's Journey, frame stacking, chunking
- `03-hooks-e-aberturas.md` — 60-Sec Hook + 10 openers Sultanic
- `05-body-copy-frameworks.md` — PAS, PASTOR, body por nível Schwartz
- `06-closes-e-ctas.md` — 8 closes Sultanic, 10% Close Fladlien, multiple closes
- `10-persuasao-e-objecoes.md` — Schopenhauer, Blair Warren, identity-based persuasion
- `11-anti-padroes.md` — checklist de auditoria pré-gravação

## Quick Reference

| Comando | O que faz |
|---|---|
| `/vsl curta` | Ad-VSL de 60-90s pra Meta/YouTube/TikTok (tráfego frio) |
| `/vsl media` | VSL de 3-7min pra pré-call, webinar curto, post-opt-in |
| `/vsl longa` | Sales VSL de 15-25min pra lançamento, high-ticket, evergreen |
| `/vsl curta --variantes 3` | Gera N variantes da mesma duração |

Se o usuário não especificar duração, perguntar antes de começar.

## Process

### Step 1 — Verificar contexto

Procurar no diretório atual:
- `brand-profile.json` — **recomendado** (tom, tese, ângulos, ICP)
- `produto-*.md` ou `oferta-*.md` — **recomendado** (preço, garantia, bônus, mecanismo)
- `campaign-brief.md` — **opcional** (conceitos já validados pra reaproveitar hooks)
- `copy-deck-expandido.md` — **opcional** (headlines testadas)

Se nada existir, perguntar 8 inputs mínimos (Step 2). Se brand-profile.json existir, reutilizar tom e tese sem perguntar de novo.

### Step 2 — Inputs mínimos (se não tiver os arquivos)

Perguntar em bloco único, não 8 perguntas separadas:

1. **Avatar** — descrição de 1 pessoa específica (não "donos de e-commerce", mas "Marina, 38, dona de loja de roupa em Curitiba que fatura R$80k/mês e está cansada de gerenciar Instagram sozinha")
2. **Dor central** — o que tira o sono dessa pessoa hoje
3. **Promessa grande** — transformação específica que a oferta entrega (com número se possível)
4. **Mecanismo único** — o que sua solução faz de diferente das outras (a "nova maneira")
5. **Prova** — 2-3 resultados reais (cliente, número, timeframe)
6. **Oferta** — produto + preço + bônus + garantia
7. **Urgência real** — deadline, vagas, preço de lançamento
8. **CTA** — o que você quer que a pessoa faça (clicar, agendar, comprar)

Se algum input vier vago, pedir especificidade. VSL morre de generalização.

### Step 3 — Escolher estrutura por duração

| Duração | Foco | Quando usar |
|---|---|---|
| **Curta (60-90s)** | Hook + dor + mecanismo + 1 prova + CTA | Tráfego frio Meta/YouTube/TikTok |
| **Média (3-7min)** | + Story + Stack curto + objeção principal | Pré-call, webinar curto, retargeting quente |
| **Longa (15-25min)** | Estrutura 22-step completa | Lançamento, high-ticket, evergreen, low-ticket de R$497+ |

### Step 4 — Gerar o roteiro

Aplicar a estrutura correspondente (seção abaixo). Tom: Studio Artemis — direto, conversacional, sem hedge, sem antítese vazia, sem clichê de IA.

### Step 5 — Aplicar copywriting-guardrails

Antes de entregar, passar o roteiro pela skill `copywriting-guardrails` pra remover:
- Antítese vazia ("não é só X, é Y" sem substância)
- Paradiastole (renomear conceitos pra parecer profundo)
- Climax degenerado (escalada sem ganho)
- Bomphiologia (linguagem inflada)
- Sententia falsa (frase de efeito sem verdade)

### Step 6 — Salvar

Salvar como `vsl-[slug]-[duracao].md` no diretório atual (ou `clientes/<cliente>/conteudo/` se estiver na raiz da Artemis).

---

## Estrutura por duração

### Curta (60-90s) — 5 atos

```
1. HOOK (0-3s)         — pattern interrupt ou pergunta provocativa
2. DOR (3-15s)         — descrever a dor com vivid detail
3. MECANISMO (15-45s)  — o que muda com a sua solução (a "nova maneira")
4. PROVA (45-65s)      — 1 caso real com número
5. CTA (65-90s)        — pedido direto + razão pra agir agora
```

### Média (3-7min) — 9 atos

```
1. HOOK (0-7s)
2. PROMESSA GRANDE (7-20s)
3. CREDIBILIDADE (20-45s)        — quem é você, por que escutar
4. DOR + AGITAÇÃO (45s-2min)     — descrever + amplificar custo de não resolver
5. STORY / EPIPHANY (2-3min)     — como você descobriu o método
6. MECANISMO ÚNICO (3-4min)      — a "nova maneira" + por que funciona
7. PROVA (4-5min)                — 2-3 casos com número
8. OFERTA + 1 OBJEÇÃO (5-6min)   — preço + risk reversal + objeção principal
9. CTA + URGÊNCIA (6-7min)
```

### Longa (15-25min) — 22 atos (estrutura híbrida Benson + Brunson + Stack)

```
1.  PATTERN INTERRUPT (0-15s)        — hook que quebra o scroll
2.  BIG PROMISE (15-45s)             — promessa específica com número
3.  CREDIBILITY DROP (45s-2min)      — quem fala + por que ouvir
4.  CALLOUT DO AVATAR (2-3min)       — "isso é pra você se..."
5.  PROBLEMA REAL (3-5min)           — descrever a dor com vivid detail
6.  AGITAÇÃO (5-7min)                — custo de não resolver, futuro ruim
7.  INIMIGO COMUM (7-8min)           — quem/o que está bloqueando o avatar
8.  STORY / ORIGIN (8-10min)         — como você chegou lá (epiphany bridge)
9.  MECANISMO ÚNICO (10-12min)       — a "nova maneira" + nome próprio do método
10. POR QUE FUNCIONA (12-13min)      — lógica + ciência + plausibilidade
11. PROVA (13-15min)                 — 3-5 casos com número, antes/depois
12. INTRO DA OFERTA (15-16min)       — apresentar o produto pelo nome
13. STACK 1 (16-17min)               — produto base
14. STACK 2 (17-18min)               — bônus 1 (resolve objeção 1)
15. STACK 3 (18-19min)               — bônus 2 (resolve objeção 2)
16. STACK 4 (19-19:30min)            — bônus 3 (acelera resultado)
17. ANCORA DE PREÇO (19:30-20min)    — valor empilhado vs preço final
18. PRIMEIRA CTA (20-20:30min)       — primeiro pedido direto
19. RISK REVERSAL (20:30-21min)      — garantia + quebra do "e se não funcionar"
20. URGÊNCIA REAL (21-22min)         — deadline, vagas, preço de lançamento
21. FUTURE PACING (22-23min)         — "imagine daqui a 90 dias..."
22. RECAP + CTA FINAL (23-25min)     — recapitular oferta + close com urgência
```

---

## Regras de copy (todas as durações)

### Hook (primeiros 3-15s)

O hook decide se a pessoa fica. Sem hook bom, o resto não importa.

**Tipos que funcionam:**
- **Contrarian:** "Todo mundo fala em escalar com IA. Quase ninguém fala em parar de delegar pra ela."
- **Bold claim com número:** "Uma agência de R$2.500/mês entrega mais lead qualificado que uma de R$25k. Eu vou te mostrar por quê."
- **Curiosity gap:** "O que separa um SDR que bate meta de um que não bate não é o pitch. É uma coisa que ninguém ensina."
- **Pergunta-armadilha:** "Você está perdendo dinheiro com tráfego pago e não sabe?"
- **Pattern interrupt visual:** começar mostrando o resultado final ou o erro mais comum
- **Antes/depois comprimido:** "O que levava 3 semanas, hoje sai em 2 dias. E não é IA."
- **Tribal identity:** "Isso aqui separa quem fatura R$100k de quem fatura R$300k."

**Proibido:**
- "Você sabia que..." (cliché morto)
- "Imagine se..." (no hook — só no future pacing)
- "E se eu te dissesse..." (gatilho de cringe)
- Genérico ("descubra como...", "aprenda a...")

### Big Promise

- Específica, não genérica. "Mais leads" é fraco. "Reduzir CPL em 40% em 30 dias sem aumentar o budget" é forte.
- Inclui número quando possível. Inclui prazo quando possível.
- Não promete o que não entrega — credibilidade morre rápido em VSL.

### Mecanismo Único

A parte que diferencia VSL boa de VSL ruim. O avatar precisa entender:
- **O QUE é** o mecanismo (1 frase)
- **COMO funciona** (3-5 frases — explicação simples, sem jargão)
- **POR QUE funciona** (lógica ou ciência ou caso real)
- **POR QUE só você tem** (contexto, descoberta, formação)

Dar nome próprio ao mecanismo aumenta retenção: "O Sistema 3-Camadas", "O Método X-Y-Z", "O Framework Plug-and-Play". Não é obrigatório, mas ajuda.

### Story / Epiphany Bridge

A história que conecta você ao avatar. Estrutura:
1. **Eu era como você** (mesmo problema, contexto similar)
2. **Tentei o caminho óbvio e não deu** (frustração específica, número)
3. **Descobri X por acaso/insight/teste** (o momento de virada)
4. **Aplicou e funcionou** (resultado com número)
5. **Refinou e empacotou** (vira o método)

Sem self-help. Sem "minha vida estava em ruínas". Conta o caso seco.

### Stack (oferta empilhada)

Cada item da oferta entra com:
- **Nome do item**
- **O que é** (1 frase)
- **Pra que serve** (qual objeção resolve)
- **Valor de mercado** (R$ comparável)

Empilhar visualmente: ao apresentar item 2, mostrar item 1 + item 2. No item 5, mostra todos os 5 com soma de valor. **Restack** é Brunson clássico — funciona porque ancora valor antes do preço.

### Risk Reversal

Quebrar o "e se não funcionar". Modelos que funcionam:
- Garantia condicional ("se você fizer X, Y, Z e não tiver resultado, devolvo 100%")
- Garantia incondicional ("30 dias, sem perguntas")
- Garantia dupla (devolvo + você fica com os bônus)
- Garantia de resultado (entrego o resultado ou refaço sem custo)

### Urgência

**Real** > falsa. Deadline real, vagas reais, preço de lançamento real. Falsa urgência destrói credibilidade no longo prazo. Se não tem urgência real, criar uma legítima:
- Bônus que sai depois de X
- Preço sobe em Y dias
- Próxima turma só em Z meses
- Vaga limitada por capacidade real (atendimento, suporte)

### CTA

Direto. Verbo de ação. Repetir 2-3x na VSL longa.
- "Clica no botão abaixo do vídeo agora."
- "Reserva sua vaga em [URL] antes do contador zerar."
- "Agenda sua chamada de diagnóstico nos próximos 5 minutos."

Não usar:
- "Considere..." (passivo)
- "Talvez você queira..." (hedge)
- "Se você se interessou..." (condicional)

---

## Voz Studio Artemis (todas as VSLs)

### Faça
- Frases curtas. Subordinadas só quando construir raciocínio.
- Especificidade: número, nome, prazo, lugar, valor.
- Conversacional. Lê em voz alta — se travar, reescreve.
- Provas concretas. Cliente real, número real, timeframe real.
- Quebra de objeção antes da objeção aparecer.
- Tom de quem já fez, não de quem promete.

### Não faça
- "Não é apenas X, é Y" (antítese vazia da IA)
- "Imagine como seria..." (no hook ou body — só no future pacing tardio)
- "Descubra o segredo..." (clichê morto)
- "Transforme sua vida..." (vago, sem número)
- "Você merece..." (manipulação rasa)
- Frases de duas palavras com ponto final ("Simples assim." "Verdade.")
- Adjetivos empilhados ("incrível, transformador, revolucionário")
- Hedge ("talvez", "pode ser que", "geralmente")
- Direção de cena ("close de fulano", "câmera fecha", "[0-3s]") — VSL é COPY, editor decide câmera

---

## Output format

Salvar como `vsl-[slug]-[duracao].md`. Estrutura do arquivo:

```markdown
# VSL [Nome da Oferta] — [Curta / Média / Longa]
**Cliente:** [nome]
**Avatar:** [1 linha]
**Oferta:** [produto + preço]
**Duração estimada:** [60s / 5min / 22min]
**Gerado:** [YYYY-MM-DD]

---

## Roteiro

### 1. [Nome do ato] — [timing]

[texto puro do que será falado, parágrafos curtos]

### 2. [Nome do ato] — [timing]

[texto]

[...]

---

## Notas de produção (opcional, só se o cliente pedir)

- **Tom de leitura:** [conversacional / autoridade / urgente]
- **Velocidade:** [normal / pausada nos pontos X, Y, Z]
- **Cues sugeridos pro editor:** [bullets bem curtos — só se ajudar a manter intenção]
- **Variantes de hook testadas:** [se geramos 3+ hooks, listar aqui]
```

**Regra final:** o corpo do roteiro é texto puro de fala. Sem timestamp embutido na frase. Sem "[câmera fecha]" no meio do parágrafo. Notas de produção, se existirem, ficam no fim, separadas.

---

## Integração com outras skills

| Antes | Esta skill | Depois |
|---|---|---|
| `/ads dna` (gera brand-profile.json) | `/vsl curta\|media\|longa` | `copywriting-guardrails` (revisão final) |
| `/ads create` (campaign-brief.md) | reaproveita hooks | — |
| `briefing-generator` (briefing.docx) | usa avatar + dor | — |

Combinação ideal pra cliente novo:
```
/ads dna → brand-profile.json
/vsl curta → ad-VSL pra teste de tráfego
/vsl longa → sales VSL pra retargeting quente
copywriting-guardrails → revisão final em ambas
```

---

## Observações finais

- VSL não é discurso. É conversa unilateral. Escreve como se fosse falar com a Marina, não pro auditório.
- Se o avatar não tem nome, a VSL fica genérica. Pedir nome se não veio no input.
- Hook ruim mata a VSL inteira. Se o hook não passar no teste "isso me faria parar?", reescrever antes de seguir.
- Longa não é melhor. VSL longa só faz sentido quando a oferta justifica o tempo (ticket alto, complexidade, evergreen).
- Se o cliente é Artemis (rastreamento, proteção veicular, comex, náutica, saúde, IoT), evitar linguagem de "info-produtor". Tom técnico-comercial, não guru.
