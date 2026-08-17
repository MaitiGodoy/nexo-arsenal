---
name: whitepaper
description: Gera whitepaper executivo em PDF (12-25 páginas) a partir de pesquisa de mercado, dados próprios e tese editorial. Combina pesquisa rigorosa (HBR/McKinsey/Porter), redação editorial densa e diagramação visual. Acionar quando o usuário pedir "whitepaper", "white paper", "estudo aprofundado em PDF", "relatório executivo pra distribuir", "ebook profissional", "lead magnet de alto valor", "manifesto de mercado", ou quando entregar um tema/dataset e pedir documento longo de autoridade. Diferente de market-report (relatório de marketing pra cliente único), market-report-pdf (mesmo, em PDF), e doc-coauthoring (workflow conversacional sem foco em design final). Saída: PDF entregável com capa, sumário executivo, fundamentação, dados, gráficos, conclusões e CTA.
---

# Whitepaper — gerador de documento executivo de autoridade

Você gera whitepapers profissionais em pt-BR ou en — documentos de 12-25 páginas que combinam pesquisa rigorosa, redação editorial densa e design pensado pra distribuição (lead magnet de alto valor, prova de autoridade no mercado, peça de ABM enterprise).

## Quando usar esta skill

- Lead magnet pra Enterprise (ticket >R$ 50k/ano)
- Manifesto de mercado pra reposicionamento de marca
- Estudo de tendência setorial pra contexto de venda consultiva
- Documento de autoridade pra ABM 1:1
- Whitepaper técnico pra B2B SaaS Série A+
- Peça de RP / imprensa especializada (jornalistas de Valor, Folha, HBR Brasil)

## Quando NÃO usar (use outra skill)

- Relatório de marketing pra cliente único → `market-report-pdf`
- Documento técnico interno → `doc-coauthoring`
- Briefing curto → `market-research-briefing`
- Proposta comercial → `market-proposal`

## Estrutura padrão (12-25 páginas)

```
1. Capa                         (1 pág)  — título, subtítulo, autor, data, logo
2. Sumário executivo            (1 pág)  — 5 conclusões principais
3. Sumário (TOC)                (1 pág)  — auto-gerado
4. Introdução / contexto        (2 págs) — por que este documento, por que agora
5. Fundamentação teórica        (3 págs) — frameworks aplicáveis (Porter, JTBD, etc.)
6. Análise dos dados            (4-6 págs) — gráficos, tabelas, citações
7. Estudos de caso              (2-4 págs) — 2-4 cases ilustrativos
8. Implicações estratégicas     (2 págs) — o que decisor faz com isso
9. Recomendações                (1-2 págs) — top 5 ações
10. Conclusão                    (1 pág)  — síntese + chamado à ação
11. Sobre os autores             (1 pág)  — credenciais
12. Referências                  (1-2 págs) — fontes citadas, ABNT/Chicago
13. Apêndice (opcional)          (1-2 págs) — metodologia, glossário, dados brutos
```

## Workflow em 4 fases

### Fase 1 — Pesquisa (sempre primeiro)

Antes de escrever, **rode a skill `market-research-briefing`** (ou `content-research-briefing` se for tema mais editorial que estratégico). Coleta:

- 5-10 fontes acadêmicas/setoriais (HBR, McKinsey, BCG, Bain, Gartner, jornais sérios)
- 3-5 dados quantitativos citáveis (com fonte e data)
- 2-3 frameworks aplicáveis (Porter's Five Forces, JTBD, Blue Ocean, Value Chain, etc.)
- 1-3 estudos de caso públicos relevantes
- 5-10 citações diretas de figuras de autoridade no tema

**Saída intermediária:** `pesquisa-<tema>.md` em `clientes/<cliente>/research/`.

### Fase 2 — Outline editorial

Antes de escrever o corpo, valide com o usuário:

- Tese central em 1 frase ("o que estamos defendendo")
- Audiência primária ("decisor X com dor Y")
- 5 conclusões que o leitor deve sair carregando
- 3 ações concretas que a peça incita
- Tom: HBR analítico, McKinsey diagnóstico, BCG provocativo, ou autoral-editorial

**Checkpoint humano:** mostre o outline e espere "OK, pode escrever" antes de produzir o corpo.

### Fase 3 — Redação seção por seção

Tom geral:
- **Frases curtas e específicas.** Não use "vale notar", "é importante ressaltar", "interessante observar".
- **Cite com paginação.** "Porter (1985, p. 34)" em vez de "Porter argumenta".
- **Mostra dado, não promete dado.** "57% dos CMOs entrevistados (McKinsey 2025)" em vez de "muitos CMOs".
- **Conclusão por seção.** Cada seção fecha com um insight acionável, não com filosofia.
- **Sem clichê de IA.** Aplica `copywriting-guardrails` no fim — anti-antítese vazia, anti-paradiastole, anti-climax degenerado.

### Fase 4 — Diagramação e PDF

Use `market-report-pdf` ou `doc-coauthoring` pra gerar o PDF final. Padrão:

- **Tipografia:** serifa pra body (Garamond, Source Serif), sans pra heads (Inter, Geist), monospace pra dados (Geist Mono, JetBrains Mono)
- **Paleta:** monocromática + 1 acento (preto/branco/cinza + azul ou verde)
- **Gráficos:** matplotlib/d3, sem 3D, sem skeu — barra/linha/scatter limpos
- **Margens:** generosas (2.5cm), interlinha 1.5
- **Capa:** título grande, subtítulo médio, autor pequeno — Suíço/Bauhaus
- **Numeração:** rodapé direito, com nome do whitepaper no rodapé esquerdo

## Output esperado

- `clientes/<cliente>/whitepapers/<YYYY-MM-DD>-<slug>/whitepaper.md` — texto fonte
- `clientes/<cliente>/whitepapers/<YYYY-MM-DD>-<slug>/whitepaper.pdf` — PDF entregável
- `clientes/<cliente>/whitepapers/<YYYY-MM-DD>-<slug>/assets/` — gráficos, capa, fontes
- `clientes/<cliente>/whitepapers/<YYYY-MM-DD>-<slug>/sources.md` — bibliografia ABNT

## Skills correlatas (use em pipeline)

| Etapa | Skill |
|---|---|
| Pesquisa rigorosa pra Enterprise | `market-research-briefing` |
| Pesquisa pra conteúdo editorial | `content-research-briefing` |
| Diagramação PDF visual | `market-report-pdf` |
| Workflow conversacional iterativo | `doc-coauthoring` |
| Gate de revisão final | `copywriting-guardrails` |

## Pipeline canônico

```
market-research-briefing (ou content-research-briefing)
  ↓
[outline + checkpoint humano]
  ↓
whitepaper (escrita seção por seção)
  ↓
copywriting-guardrails (revisão retórica)
  ↓
market-report-pdf (diagramação)
  ↓
PDF entregável + sources.md
```

## Diferenciação técnica vs concorrência

Whitepapers de IA gen são reconhecíveis: hedging, antítese vazia, dado inventado, citação genérica, fechamento motivacional. Esta skill produz o oposto:

- Tese específica e defendível
- Dado com fonte e data
- Citação com paginação
- Frase curta, sem hedge
- Fechamento operacional

## Referências de qualidade

- HBR ("How High-Performing Companies Develop and Scale AI", 2025)
- McKinsey State of AI 2025
- BCG AI Radar 2026
- Stanford HAI AI Index 2026
- MIT NANDA "GenAI Divide" (2025)

Esses são padrões de qualidade pra mirar, não pra copiar.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
