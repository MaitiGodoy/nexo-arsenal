---
name: briefing-generator
description: >
  Use this skill whenever the user asks to create a client briefing, generate a briefing document,
  or extract structured information from meeting transcriptions, proposals, or onboarding docs.
  Trigger whenever the user mentions "briefing", "brief do cliente", "briefing de onboarding",
  "montar o briefing", "criar briefing", or provides a transcription and asks you to organize
  the information. Also trigger when the user says things like "temos uma reunião com o cliente,
  monta o briefing" or "aqui está a transcrição, o que foi fechado?". This skill uses the
  HBR Situation-Complication-Resolution (SCR) narrative structure combined with the Kellogg
  5C brand framework, and outputs a professional .docx document for the internal Artemis team.
---

# Briefing Generator — Studio Artemis

## Objective

Transform raw inputs (meeting transcriptions, proposals, e-mails) into a structured, actionable
internal briefing document in .docx format, using:

- **HBR SCR Framework** (Situation → Complication → Resolution) for narrative clarity
- **Kellogg 5C Brand Framework** (Company, Customers, Competitors, Context, Collaborators) for strategic depth
- **Jobs-to-be-Done** (HBS/Christensen) to capture the real motivation behind the client's request

The output is for the **internal Artemis team** (creatives, developers, strategists) — not for the client.
Write in a direct, informative tone. No fluff.

---

## Step-by-Step Workflow

### Step 1 — Ingest the Documents

Read all documents provided by the user. These may be:
- Transcriptions of sales/onboarding meetings
- Proposals or scopes of work
- E-mails with client requirements
- Onboarding forms

Extract raw facts. Do not interpret yet — just collect. Note anything ambiguous for the
"Gaps / Open Points" section.

---

### Step 2 — Analyze Using the Three Frameworks

Run the three frameworks in your head before writing:

**2a. HBR SCR — Narrative Structure**
- **Situation**: What is the client's current reality? (business, market position, existing channels)
- **Complication**: What problem, tension, or opportunity is driving this project?
- **Resolution**: What did we agree to do? What does success look like for them?

This gives the briefing a clear "why are we here" structure that any team member can quickly understand.

**2b. Kellogg 5C Brand Framework — Strategic Context**
- **Company**: What does the client's company do? Key differentials, values, revenue model.
- **Customers**: Who do they sell to? B2B, B2C? What is the client's client profile?
- **Competitors**: Who are they competing with? How do they position against them?
- **Context**: Market trends, seasonality, urgency, industry moment.
- **Collaborators**: Partners, suppliers, or other agencies involved.

Note: Fill only what is available from the documents. Leave blank fields as "Não informado — levantar com cliente."

**2c. Jobs-to-be-Done (HBS) — Real Motivation**
Ask: what "job" is this client hiring us to do? Beyond the deliverables, what outcome do they
truly want? (e.g., "não quero apenas SEO — quero ser encontrado antes do concorrente X")

Capture this as a single sharp sentence under "O que o cliente realmente quer."

---

### Step 3 — Build the Briefing Sections

Produce the following 5 mandatory sections. Use the frameworks to fill them — do not invent
information not present in the documents.

#### Section 1 — Perfil da Empresa Cliente
- Razão social / nome comercial
- Setor e segmento de atuação
- Modelo de negócio (B2B / B2C / misto)
- Diferenciais percebidos (o que eles mesmos dizem que os diferencia)
- Tom atual da marca (formal, técnico, descontraído, premium etc.)
- Presença digital atual (canais, site, redes sociais)

#### Section 2 — Objetivos e Metas do Projeto
Use the SCR framing:
- **Situação atual** (onde estão hoje)
- **Problema / Tensão** (o que está impedindo ou motivando a mudança)
- **O que esperam alcançar** (resultados concretos, se declarados)
- **O que o cliente realmente quer** (Jobs-to-be-Done — a motivação real por trás do pedido)
- **KPIs mencionados** (se houver — leads, conversões, alcance, ranking, etc.)

#### Section 3 — O Que Foi Fechado (Escopo + Entregáveis)
- Lista de serviços contratados / acordados
- Formato dos entregáveis (posts, relatórios, landing pages, campanhas etc.)
- Frequência / volume (ex: 12 posts/mês, 1 relatório mensal)
- Canais cobertos
- O que está **fora do escopo** (se mencionado)
- Próximos passos acordados

#### Section 4 — Público-Alvo e Persona
- Quem é o cliente do cliente (B2C) ou o decisor (B2B)
- Dados demográficos mencionados (idade, cargo, localização, renda)
- Dores e motivações do público (se o cliente as mencionou)
- Como o cliente descreve seu melhor cliente hoje
- Canal de maior conversão atual (se mencionado)

#### Section 5 — Tom de Voz e Diretrizes Criativas
- Adjetivos que o cliente usou para descrever a marca
- Exemplos de comunicação que o cliente aprovou ou mencionou positivamente
- O que o cliente **não quer** (referências negativas, se houver)
- Restrições visuais ou de linguagem mencionadas
- Concorrentes cujo posicionamento o cliente admira (ou quer evitar)

---

### Step 4 — Gaps & Perguntas em Aberto

After all sections, add a final block:

**Gaps identificados / Perguntas para o cliente:**
- List all fields that could not be filled from the available documents
- Frame each as a direct question to ask in the next touchpoint
  - Example: "Qual é a margem média por produto? (necessário para calcular CAC aceitável)"

---

### Step 5 — Generate the .docx

Use the `docx` skill (Node.js / docx-js) to produce a professional Word document.

**Document structure:**
1. Cover page: Client name, date, "Briefing Interno — Studio Artemis"
2. One page per section (Sections 1–5)
3. Final page: Gaps & Perguntas em Aberto

**Formatting rules:**
- Font: Arial throughout
- Heading 1: 16pt bold (section titles)
- Heading 2: 13pt bold (subsection labels)
- Body: 11pt, 1.15 line spacing
- Use light gray shading (#F2F2F2) on label cells in tables
- Page size: A4 (default in docx-js — do NOT override)
- Margins: 2cm all sides (2835 DXA)
- Color accent for cover: #1A1A2E (dark navy) for the title bar
- Footer: "Artemis | Uso Interno | Confidencial"

**Cover page layout:**
- Full-width dark rectangle at top (~3cm) with white text "BRIEFING INTERNO"
- Below: client name in Heading 1, date in normal text, horizontal rule
- Sub-label: "Preparado por Studio Artemis"

**Use tables for labeled fields** (label in left column, value in right column) for sections 1, 3, and 4.
Use flowing paragraphs for sections 2 and 5.

Always read /mnt/skills/public/docx/SKILL.md before writing the docx generation code.

---

## Quality Checklist (before delivering)

- [ ] All 5 mandatory sections are present
- [ ] "O que o cliente realmente quer" (JTBD) is a single concrete sentence
- [ ] Gaps section lists every field that couldn't be filled
- [ ] No invented information — only what appears in the source documents
- [ ] .docx validates without errors
- [ ] Footer present on all pages
- [ ] Cover page is visually clean and contains client name + date

---

## Language

Always write the briefing in **Brazilian Portuguese**, regardless of the language of the source documents.
The briefing title and section headers should follow the names defined in this skill (in Portuguese).
