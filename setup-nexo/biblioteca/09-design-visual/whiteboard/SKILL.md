---
name: whiteboard
description: Cria explainers visuais hand-drawn estilo whiteboard (fundo papel off-white, traço de canetinha, ilustrações SVG sketchy via Roughjs + filtro de tremor) prontos pra Hélio gravar vídeos explicativos. Gera HTML self-contained com 5-9 slides em 16:9 ou 9:16, navegação por teclado, e exporta automaticamente PNGs em 4K + PDF combinado pronto pra modo apresentação. Acionar quando Hélio mencionar "whiteboard", "explainer", "criar slides pra vídeo", "ilustração pra explicar X", "imagem pra mostrar no vídeo", "estilo Davi Valadares", "explicação visual", "quadro branco com setinhas", "explainer hand-drawn", "desenhinhos pra vídeo", ou quando pedir pra transformar uma ideia/conceito/processo em algo visual pra gravar vídeo. Usar SEMPRE em conjunto com `copywriting-guardrails` na revisão dos textos dos slides. Não confundir com `carousel-mktops` (que é pra Instagram, 12 slides estáticos com oferta).
---

# Whiteboard Explainer

Pipeline pra produzir whiteboards visuais estilo Davi Valadares — fundo papel off-white, traço hand-drawn, ilustrações SVG sketchy. Hélio usa pra gravar vídeos explicativos onde ele aparece embaixo falando e o whiteboard fica em cima ou de fundo.

## REGRA-MÃE (não negociável)

> **O whiteboard parece desenhado à mão na hora.**
> Nada perfeitamente alinhado. Nada de gradients smoothy.
> Tudo levemente rotacionado, com tremor de caneta, cores de canetinha de quadro.

Se o resultado parece um Keynote bonito, está errado. Tem que parecer aula numa lousa branca.

---

## LOCALIZAÇÃO

Tudo vive em `automacao/whiteboard-explainers/`:
- `_template.html` — base com design system completo + capa em branco + 1 slide de exemplo
- `economia-token.html` — primeira referência completa (use como modelo de estrutura e tipos de slide)
- `export.js` — exportador Puppeteer (PNGs em 4K + PDF combinado)
- `README.md` — documentação do design system

Saídas finais em `automacao/whiteboard-explainers/out/<slug>/`:
- `01.png` ... `NN.png` (3840×2160 retina)
- `<slug>.pdf` (combinado, 16:9 nativo)

---

## WORKFLOW OBRIGATÓRIO (5 fases)

### Fase 1 — Briefing

Se Hélio NÃO especificou tudo, perguntar (no chat):

1. **Tema** — qual conceito vai explicar?
2. **Objetivo do vídeo** — ensinar / vender / mapear processo / convencer?
3. **Quantos slides** — default 7 (ideal pra vídeo de 2-4min). Reels curto = 4-5. YouTube longo = 9.
4. **Formato** — 16:9 horizontal (default, YouTube) ou 9:16 vertical (Reels/TikTok/Stories)?
5. **Ilustrações específicas** — tem alguma metáfora visual em mente? (ex: balança, plantinha, cérebro, laptop)

Se Hélio passou tudo no prompt inicial, pular essa fase e ir direto pra Fase 2.

### Fase 2 — Estrutura (esboço em texto)

Antes de codar, esboçar os N slides em texto e mostrar pra Hélio aprovar:

```
## Estrutura proposta — <tema>

Slide 1 (capa): <título>
Slide 2: <conteúdo + tipo visual>
Slide 3: <conteúdo + tipo visual>
...
Slide N (fechamento): <regra mental / CTA>
```

**Regras de estrutura:**
- Slide 1 sempre é capa (título grande, subtítulo, ilustração icônica, stamp)
- Slide N sempre é fechamento (regra mental numerada, ou síntese, ou CTA)
- 1 ideia por slide. Se tem duas ideias, são dois slides.
- Hierarquia clara: cada slide tem h1 + lead + conteúdo principal
- Variar tipo de visual: árvore, fluxo, tabela, 3-cols, gráfico — não repetir o mesmo padrão sequencial

**ESPERAR APROVAÇÃO DE HÉLIO** antes de gerar o HTML. Não pular essa fase.

### Fase 3 — Conteúdo (aplicar copywriting-guardrails)

Reescrever cada slide eliminando vícios de IA:
- Sem antítese vazia ("não é X, é Y" sem necessidade)
- Sem paradiastole (rebatizar conceito comum com nome empolado)
- Sem climax degenerado (escalada vazia)
- Sem bomphiologia (frase pomposa sem substância)
- Sem sententia falsa (verdade fabricada que parece sábia)

**Tom**: direto, hand-drawn, frase curta, específico. Evita conectivos longos. Usa verbos no presente.

**Highlight amarelo**: 1 palavra-chave por h1, envolvida em `<span class="highlight">`. Não mais que isso.

### Fase 4 — Geração do HTML

1. Definir o slug (kebab-case, ex: `funil-mktops`, `como-cobrar-mais`).
2. Copiar o template:
   ```bash
   cp automacao/whiteboard-explainers/_template.html automacao/whiteboard-explainers/<slug>.html
   ```
3. Editar o arquivo. **Manter o `<style>` inteiro intacto** — é o design system, não inventar cor nova nem fonte.
4. Trocar `{{TITULO}}`, `{{SUBTITULO}}`, etc da capa.
5. Substituir/duplicar `<section class="slide">` conforme a estrutura aprovada.
6. Adicionar SVGs hand-drawn quando fizer sentido (ver lista de componentes abaixo).
7. Abrir no navegador pra Hélio revisar:
   ```bash
   open "automacao/whiteboard-explainers/<slug>.html"
   ```

### Fase 5 — Export final

Quando Hélio aprovar visualmente, rodar:

```bash
cd "/Users/heliofcostajunior/Studio Artemis/automacao"
node whiteboard-explainers/export.js <slug>.html
```

Flags úteis:
- Default: 1920×1080, scale 2 (4K retina), 7 slides
- `--width 1080 --height 1920` — formato vertical (Reels/Stories)
- `--scale 3` — 6K
- `--slides 9` — se tiver mais que 7

Após exportar, abrir o PDF e a pasta:
```bash
open "automacao/whiteboard-explainers/out/<slug>/<slug>.pdf"
open "automacao/whiteboard-explainers/out/<slug>/"
```

---

## DESIGN SYSTEM (não inventar)

### Paleta whiteboard

| Token | Cor | Uso |
|---|---|---|
| `--paper` | `#f8f5ee` | fundo (papel off-white) |
| `--paper-shade` | `#efeae0` | caixas, sombras de papel |
| `--ink` | `#1a1a1a` | traço grafite (texto principal) |
| `--ink-soft` | `rgba(26,26,26,0.55)` | texto secundário, lead |
| `--ink-faint` | `rgba(26,26,26,0.18)` | bordas dashed, dots |
| `--red` | `#d8453d` | canetinha vermelha — destaques, alertas, números |
| `--blue` | `#2e74c8` | canetinha azul — links, info, h2 |
| `--green` | `#2f9e44` | canetinha verde — positivo, crescimento |
| `--orange` | `#f08c2e` | canetinha laranja — atenção, raio |
| `--yellow` | `#f5c518` | canetinha amarela (linha) |
| `--highlight` | `rgba(245,197,24,0.35)` | highlight amarelo translúcido (no h1) |

### Tipografia (Google Fonts, já carregadas)

- **Caveat** — display handwriting forte. Use em h1, h2, números, labels SVG.
- **Patrick Hand** — handwriting legível pra corpo. Default em parágrafos e listas.
- **Kalam** — handwriting com vibe técnica. Use em árvore de pastas e código.

### Componentes prontos no template

| Classe | Uso |
|---|---|
| `.cover` | Capa centralizada com title + sub + ilustração + stamp rotacionado |
| `.tree-wrap` | Árvore de pastas (esquerda) + lista explicativa (direita) |
| `.flow` | Grid 2 colunas de passos numerados (Roughjs desenha círculos sketchy) |
| `.cost-wrap` | Tabela com barras horizontais + ilustração lateral |
| `.cols` | 3 colunas inclinadas pra comparação ("antes/durante/depois", etc) |
| `.composto-wrap` | Gráfico SVG inline (curva crescente, eixos hand-drawn) |
| `.regra` | Lista numerada gigante com círculos vermelhos (regra mental final) |
| `.punchline` | Caixa amarela rotacionada com frase de impacto |

### Filtros e atributos especiais

- `filter="url(#rough)"` — tremor leve (todo SVG ilustrativo deve usar)
- `filter="url(#rough-strong)"` — tremor mais forte (capa, ícones grandes)
- `data-rough-circle="red"` em qualquer div — Roughjs desenha círculo sketchy em runtime
- `<span class="highlight">palavra</span>` no h1 — destaque amarelo

### Regras visuais NÃO negociáveis

- Tudo levemente rotacionado (`transform: rotate(-1deg)` a `1deg`). Nada perfeitamente alinhado.
- Sombras de papel: `box-shadow: 5px 5px 0 rgba(26,26,26,0.1)` (não blur, é offset puro).
- Ilustrações SVG sempre dentro de `filter="url(#rough)"`.
- Highlight amarelo só em **palavra-chave** do título, não em frase inteira.
- Setas verdes pra fluxo positivo, vermelhas pra alerta/custo.

---

## BIBLIOTECA DE ILUSTRAÇÕES (SVGs hand-drawn)

Reutilizar os SVGs já desenhados em `economia-token.html`:

| Ícone | Quando usar |
|---|---|
| **Cérebro com $** | capas de tema "economia", "eficiência", "trabalho mental" |
| **Balança** | comparações de custo, trade-offs, pesos relativos |
| **Lâmpada acesa** | sempre-on, ideia clara, energia constante |
| **Raio** | trigger, lazy-load, evento que dispara algo |
| **Caixa de agente** | trabalho terceirizado, módulo separado |
| **Plantinha** | crescimento orgânico, semente, início pequeno |
| **Mão com canetinha** | regra prática, "aplica isso", dica acionável |
| **Pasta empilhada** | arquivo, organização, hierarquia |

Se o tema pedir um ícone novo, desenhar SVG novo seguindo os mesmos princípios:
- 2-3 cores no máximo da paleta
- `stroke-width: 2.5-3px`
- `stroke-linecap="round"`
- `filter="url(#rough)"` no `<svg>` raiz

---

## CHECKLIST FINAL (antes de exportar)

- [ ] Slide 1 é capa com ilustração
- [ ] Slide N é fechamento (regra/síntese/CTA)
- [ ] Cada h1 tem 1 palavra com `.highlight`
- [ ] Pelo menos 2 slides têm ilustração SVG (além da capa)
- [ ] Variei tipos de slide (não 5 listas iguais seguidas)
- [ ] Apliquei copywriting-guardrails em todos os textos
- [ ] Tudo abre, navega com seta e fullscreen funciona
- [ ] Abri no navegador pra Hélio revisar antes de exportar
- [ ] Aprovação visual recebida
- [ ] Rodei `export.js` e abri o PDF pra ele

---

## FORMATO DE ENTREGA

Quando terminar, mensagem final pra Hélio:

```
✓ Whiteboard <tema> pronto

📁 automacao/whiteboard-explainers/<slug>.html        ← editável
📁 automacao/whiteboard-explainers/out/<slug>/        ← exports
   ├── 01.png ... NN.png  (4K retina)
   └── <slug>.pdf         (modo apresentação)

Pra apresentar: PDF aberto no Preview, Cmd+Shift+F.
Pra editar texto/cor: o HTML; depois rode export.js de novo.
```

---

## NÃO FAZER

- Não usar paleta dark (chalkboard preto). É whiteboard branco/papel.
- Não inventar tipografia além das 3 fontes (Caveat, Patrick Hand, Kalam).
- Não fazer slides sem rotação leve.
- Não pular `copywriting-guardrails` na fase 3.
- Não exportar antes da aprovação visual de Hélio.
- Não criar HTML do zero — sempre clonar `_template.html` ou `economia-token.html`.
- Não confundir com `carousel-mktops` (Instagram estático, oferta, 12 slides) ou `carousel-writer` (Instagram, 6-10 slides curtos).
