---
name: market-research-briefing
description: >
  Use this skill whenever the user asks to research a client's market, analyze competitors, gather market data, or produce a strategic briefing about a company or business. Trigger whenever the user mentions phrases like "pesquisa de mercado", "briefing do cliente", "análise de concorrentes", "dados de mercado", "levantamento competitivo", "market research", "competitor analysis", "mapeamento competitivo", or "quero saber mais sobre o mercado de X". Also trigger when the user provides a client name or niche and wants a structured competitive or market overview. This skill guides Claude to conduct deep, rigorous web research using Harvard Business School and HBR frameworks (Porter's Five Forces, Value Chain, Jobs-to-be-Done, Blue Ocean, Competitive Positioning) and synthesize findings into a high-quality strategic client briefing document. Always use this skill for any research task that involves a client's competitive landscape — even if the user only mentions a company name and a sector.
---

# Market Research & Strategic Client Briefing

This skill produces a **senior-consultant-grade briefing** on a client's market and competitive landscape. Research quality must match the standard of a Harvard Business School case or an HBR industry analysis — specific, sourced, analytically rigorous, and strategically useful.

The goal is not a summary. It is a **decision-support document** that gives the client (or the agency working with them) a clear view of where they stand, where the market is going, and where the real opportunities lie.

---

## Analytical Framework

All analysis should be informed by the following frameworks. Apply the ones most relevant to the market being researched:

### 1. Porter's Five Forces (Competitive Intensity)
Assess the structural attractiveness and pressure dynamics of the market:
- **Rivalry Among Existing Competitors**: How intense is competition? Price wars? Differentiation? Concentration?
- **Threat of New Entrants**: What are the barriers to entry? Capital, regulation, brand loyalty, network effects?
- **Bargaining Power of Suppliers**: Do suppliers have leverage? Few alternatives? High switching costs?
- **Bargaining Power of Buyers**: How price-sensitive are customers? Do they have alternatives? Are they concentrated?
- **Threat of Substitutes**: Are there alternative ways to solve the same problem outside this industry?

### 2. Value Chain Analysis (Porter)
Map where value is created in the industry:
- Primary activities: inbound logistics, operations, outbound logistics, marketing & sales, service
- Support activities: technology, HR, procurement, infrastructure
- Identify where competitors capture margin vs. where they are weak

### 3. Jobs-to-be-Done (Christensen)
Go beyond product features. Ask: **what job is the customer hiring this product/service to do?**
- Functional job (the practical task)
- Emotional job (how they want to feel)
- Social job (how they want to be perceived)
This reveals unmet needs that existing competitors may be ignoring.

### 4. Blue Ocean / Competitive Canvas (Kim & Mauborgne)
Identify the factors competitors compete on and where the market is overcrowded vs. underserved. Look for:
- Factors that could be **eliminated** (no customer actually values them)
- Factors that could be **reduced** (industry over-delivers here)
- Factors that could be **raised** (industry under-delivers here)
- Factors that could be **created** (no one offers this yet)

### 5. Competitive Positioning (Porter's Generic Strategies)
Classify each competitor's strategy:
- **Cost leadership**: competing on price/efficiency
- **Differentiation**: competing on unique value, brand, quality
- **Focus/Niche**: serving a specific segment with superior relevance

### 6. SWOT with Strategic Lens
Don't just list SWOT items. Cross them:
- SO (Strengths × Opportunities) → Growth strategies
- ST (Strengths × Threats) → Defense strategies
- WO (Weaknesses × Opportunities) → Development priorities
- WT (Weaknesses × Threats) → Risk mitigation

---

## Step-by-Step Research Workflow

### Step 1 — Scope Confirmation

Before searching, confirm with the user (skip if already provided):
1. **Client name** and website (if known)
2. **Market/niche** (be specific — e.g., "rastreamento veicular B2B para frotas acima de 50 veículos")
3. **Geography** (Brasil nacional? Estado específico? Global?)
4. **Research depth**: executive overview (fast) or deep-dive (comprehensive)?
5. **Purpose**: onboarding briefing? sales pitch prep? strategy session? competitive audit?

---

### Step 2 — Market Structure & Size Research

Run multiple searches. Aim for **quantitative data with sources**. Do not estimate without labeling estimates as estimates.

**Queries to run:**
- `"mercado de [niche] brasil faturamento 2023 2024"`
- `"[niche] market size brazil billion"`
- `"setor de [niche] crescimento CAGR"`
- `"[niche] IBGE SEBRAE ABNT relatório"`
- `"[niche] industry report 2024 statista"`
- `"[niche] tendências brasil 2025"`

**Data points to find:**
- TAM (Total Addressable Market) — total market size in R$ or USD
- SAM (Serviceable Addressable Market) — realistic target segment
- CAGR (Compound Annual Growth Rate) — market growth rate
- Number of companies operating in this space
- Number of customers/end users in the market
- Key regulatory bodies or compliance requirements
- Recent disruptions: new entrants, technology shifts, regulatory changes

**Sources to prioritize:**
- IBGE, SEBRAE, ABNT, ANATEL, BACEN (for Brazilian regulated sectors)
- Statista, IBISWorld, Grand View Research, Allied Market Research
- ABRAS, ANFAVEA, CNT, and other sector-specific associations
- Industry press: Valor Econômico, Exame, Startups.com.br, Agência Brasil

---

### Step 3 — Competitor Intelligence (Deep Mapping)

Identify **5–8 competitors**, categorized as:
- **Tier 1 (Direct)**: same product, same market, same customer
- **Tier 2 (Adjacent)**: similar product, overlapping market
- **Tier 3 (Potential)**: different product, same customer need (substitutes)

For **each competitor**, research and document ALL of the following:

#### 3a. Digital Presence & Traffic
- Website URL — visit with `web_fetch` and read hero section, tagline, nav structure
- Search: `"[competitor] similarweb traffic"` → monthly visits, traffic sources, top countries
- Search: `"[competitor] site:linkedin.com"` → company size, employee count, growth trend
- Social media: Instagram followers, LinkedIn followers, YouTube subscribers (search or visit)
- Blog/content strategy: do they invest in SEO content? What topics?
- Ad presence: search `"[competitor] anúncios google"` or check if they appear in paid results

#### 3b. Product & Pricing
- What exactly do they offer? List all products/service tiers
- Is pricing public? Search `"[competitor] preço planos tabela"`
- What's the pricing model — subscription, per unit, project-based, freemium?
- What's included at each tier? What's behind a paywall?
- Free trial? Demo? Entry point for leads?

#### 3c. Positioning & Messaging
- What is their **headline value proposition**? (exact words from their site)
- Who do they say they serve? (ICP — Ideal Customer Profile)
- What pain do they claim to solve?
- What tone do they use — technical, emotional, aspirational, institutional?
- What differentiators do they emphasize?

#### 3d. Reputation & Customer Perception
- Search `"[competitor] reclame aqui"` — rating, complaint volume, response rate
- Search `"[competitor] reviews google"` — average rating, common praise/complaints
- Search `"[competitor] depoimentos"` or `"[competitor] cases de sucesso"` — what do they highlight?
- Search `"[competitor] reclamação"` or `"[competitor] problema"` — what customers hate

#### 3e. Business Signals
- Founded when? Search `"[competitor] fundação história"`
- Funding or investment? Search `"[competitor] aporte investimento rodada"`
- Acquisitions or partnerships?
- Job postings (LinkedIn, Indeed) — what roles are they hiring? This signals strategic priorities
- Awards, certifications, press mentions

#### 3f. Strategic Classification
Based on the data gathered, classify the competitor using Porter's Generic Strategies:
- Porter's generic strategy (cost leader / differentiator / niche focus)
- Stage of growth (startup / scaling / mature / declining)
- Primary competitive weapon (price / brand / technology / relationships / distribution)
- Perceived customer promise (what do customers expect from them vs. what they get?)
- Level of threat to the client (High / Medium / Low) with justification

---

### Step 4 — Client Research (Current State Audit)

If the client is an existing company (not a new venture), research their current position:

- Visit their website with `web_fetch` — assess clarity of value proposition, UX signals, CTA structure
- Search `"[client name] reclame aqui"` and `"[client name] reviews google"`
- Search for press mentions, awards, partnerships
- LinkedIn company page — team size, growth, employee profiles
- Social media — content quality, engagement rates, posting frequency
- Search `"[client name] concorrentes"` — how does the market perceive them?
- Any public financial signals: funding, acquisitions, public contracts

---

### Step 5 — Synthesis & Strategic Analysis

This is the most important step. Do not just list data — **interpret it**.

Apply the relevant HBR frameworks:

**Porter's Five Forces**: Rate each force (Low / Medium / High pressure) and explain why. What does this mean for the client's strategic position?

**Competitive Canvas**: Create a table of the key competitive factors and how each player scores (High / Medium / Low / None). Identify the white spaces.

**Jobs-to-be-Done**: Based on customer reviews and competitor messaging, what functional, emotional, and social jobs are customers trying to do — and which ones are underserved?

**Strategic Opportunities**: Based on all the above, formulate 3–5 concrete strategic recommendations:
- Where the client should compete (market segments with less pressure)
- How the client should differentiate (what to emphasize that competitors don't)
- What the client should stop doing (where they're wasting resources in overcrowded territory)
- What the client should build or invest in (capabilities that open new value)

---

## Output Format

Deliver the briefing as a structured document. Write in the language used by the user (Portuguese if they wrote in Portuguese). Use precise, formal language appropriate for a C-level or senior strategy audience.

```
# Briefing Estratégico de Mercado — [Client Name]
**Data:** [current date]
**Elaborado por:** Studio Artemis
**Finalidade:** [onboarding / estratégia / prospecção / etc.]

---

## Sumário Executivo
[3–5 parágrafos. Síntese do mercado, posição do cliente, principal oportunidade identificada, principal risco. Escreva como se fosse para um CEO lendo em 2 minutos.]

---

## 1. Estrutura e Dimensão do Mercado

### 1.1 Tamanho e Crescimento
- TAM: [valor + fonte + ano]
- CAGR estimado: [%]
- Número de players ativos: [dado ou estimativa com fonte]

### 1.2 Tendências Estruturais
[3–5 tendências relevantes com dados e fontes — tecnologia, regulação, comportamento do consumidor, modelos de negócio emergentes]

### 1.3 Análise de Forças Competitivas (Porter's Five Forces)
| Força | Nível | Justificativa |
|---|---|---|
| Rivalidade entre concorrentes | Alto/Médio/Baixo | ... |
| Ameaça de novos entrantes | | |
| Poder de barganha dos fornecedores | | |
| Poder de barganha dos compradores | | |
| Ameaça de substitutos | | |

**Conclusão das Five Forces:** [1 parágrafo — o que isso significa para quem opera neste mercado]

---

## 2. Panorama Competitivo

### 2.1 Mapa de Players
| Empresa | Tier | Estratégia (Porter) | Porte estimado | Força principal | Nível de ameaça |
|---|---|---|---|---|---|
| [Concorrente A] | Direto | Diferenciação | Grande | Marca | Alto |
| [Concorrente B] | Direto | Liderança em custo | Médio | Preço | Médio |
| ... | | | | | |

### 2.2 Canvas Competitivo (Blue Ocean)
| Fator Competitivo | [Concorrente A] | [Concorrente B] | [Concorrente C] | [Cliente] |
|---|---|---|---|---|
| Preço | Alto | Baixo | Médio | ? |
| Suporte ao cliente | Alto | Baixo | Médio | ? |
| Tecnologia | | | | |
| Presença digital | | | | |
| Reputação (reviews) | | | | |
| [Outros fatores relevantes] | | | | |

**White spaces identificados:** [onde todos os concorrentes marcam baixo ou nenhum — oportunidade Blue Ocean]

### 2.3 Perfis Detalhados de Concorrentes

#### [Concorrente 1 — Nome] | [Tier] | [Estratégia Porter]
- **Proposta de valor declarada:** "[frase exata do site]"
- **ICP declarado:** [quem eles dizem atender]
- **Produtos e preços:** [lista com preços se disponíveis]
- **Presença digital:** [tráfego estimado, seguidores por rede, atividade de conteúdo]
- **Reputação:** [nota Reclame Aqui X/10 com Y reclamações | Google X/5 — principais elogios e queixas]
- **Sinais de negócio:** [porte, funding, contratações, parcerias, anos no mercado]
- **Pontos fortes:** [3 itens específicos com evidência]
- **Vulnerabilidades:** [3 itens — o que clientes reclamam, onde há gaps, o que eles não oferecem]
- **Nível de ameaça ao cliente:** [Alto/Médio/Baixo — com justificativa de 1–2 linhas]

[Repetir para cada concorrente]

---

## 3. Jobs-to-be-Done do Mercado (Christensen)

Com base nos reviews de clientes e na comunicação dos concorrentes, os compradores neste mercado contratam soluções para realizar:

**Job Funcional (tarefa prática):** [o que precisam resolver]
**Job Emocional (como querem se sentir):** [segurança, orgulho, alívio, controle...]
**Job Social (como querem ser vistos):** [profissional, inovador, responsável, moderno...]

**Jobs subatendidos** (nenhum player atual resolve bem):
- [Job 1 — com evidência]
- [Job 2 — com evidência]

---

## 4. Análise do Cliente: [Client Name]

### 4.1 Estado Atual
- **Posicionamento percebido:** [como o mercado os vê, com base em pesquisa]
- **Proposta de valor atual:** [o que comunicam hoje — é clara? diferenciadora?]
- **Presença digital:** [tráfego estimado, redes sociais, SEO, conteúdo]
- **Reputação:** [Reclame Aqui, Google, depoimentos — síntese qualitativa]
- **Sinais de crescimento ou estagnação:** [job postings, press, parcerias]

### 4.2 Posição no Canvas Competitivo
[Onde o cliente está — em quais fatores estão fortes, em quais estão fracos, onde há lacunas estratégicas]

### 4.3 Análise SWOT Estratégica Cruzada
| | Oportunidades (O) | Ameaças (T) |
|---|---|---|
| **Forças (S)** | SO → Estratégias de crescimento | ST → Estratégias de defesa |
| **Fraquezas (W)** | WO → Prioridades de desenvolvimento | WT → Mitigação de risco |

---

## 5. Insights Estratégicos e Recomendações

### 5.1 Oportunidades Identificadas
[3–5 oportunidades com raciocínio estratégico — não listas genéricas. Cada uma com: evidência do mercado + lógica estratégica + ação sugerida]

### 5.2 Ameaças Prioritárias
[2–3 ameaças com grau de urgência e sugestão de resposta]

### 5.3 Recomendações Estratégicas
**Quick wins (0–90 dias):** [ações com alto impacto e baixo custo de implementação]
**Médio prazo (3–12 meses):** [capacidades a construir, posicionamento a consolidar]
**O que evitar:** [onde não competir — mercados saturados, guerras de preço sem vantagem de custo]

### 5.4 Posicionamento Sugerido
[1–2 parágrafos — como o cliente deveria se posicionar para capturar a maior oportunidade identificada, com base nos jobs subatendidos e nos white spaces do Canvas Competitivo]

---

## 6. Fontes e Referências

[Lista de todas as URLs e publicações consultadas, com data de acesso]
```

---

## Research Quality Standards

**Rigor quantitativo**: nunca escreva "o mercado é grande" sem um número. Nunca escreva "crescimento acelerado" sem uma taxa. Se o dado não existe publicamente, escreva "dado não disponível publicamente" — jamais invente ou arredonde sem avisar.

**Rigor qualitativo**: toda afirmação estratégica deve ter evidência. "O concorrente X tem fraqueza em suporte" exige uma fonte (nota Reclame Aqui, review específico, reclamação recorrente).

**Prioridade de fontes:**
1. Dados primários: sites das empresas, relatórios oficiais, IBGE, BACEN, ANATEL, associações setoriais
2. Dados secundários confiáveis: Statista, IBISWorld, Valor Econômico, Exame, Reuters, HBR
3. Dados terciários com ressalva: blogs setoriais, fóruns, Reclame Aqui (opinião de consumidores)

**Ceticismo ativo**: se um dado parece bom demais para ser verdade, mencione a ressalva. Se uma fonte é claramente promocional (press release da própria empresa), sinalize isso.

**Densidade de informação**: prefira dizer muito em pouco espaço. Evite parágrafos de transição sem conteúdo. Cada frase deve acrescentar um dado, uma interpretação ou uma implicação estratégica.

**Tom**: linguagem formal e precisa, adequada para audiência de C-level ou consultoria sênior. Sem jargão vazio. Sem adjetivos sem substância.

---

## Output Delivery

Ao finalizar a pesquisa, ofereça o briefing em duas versões:
1. **In-chat** em markdown formatado (imediato)
2. **Arquivo `.docx`** para compartilhamento com clientes (use a skill `docx` se disponível)

Se o contexto for prospecção comercial da agência, adapte o tom do briefing para impressionar — o documento deve transmitir a competência analítica da Artemis, não apenas informar o cliente.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
