---
name: design-visual-pro
description: Direção de arte e design visual para sites e páginas — paletas de cores, tipografia, espaçamento, estilo e personalidade visual. Use esta skill SEMPRE que for criar ou redesenhar qualquer página, site ou componente visual, mesmo que o usuário não mencione design — o objetivo é evitar que o resultado tenha "cara de template de IA" (gradiente roxo, cards genéricos, tudo centralizado).
---

# Design Visual Profissional

Páginas geradas por IA tendem a parecer iguais: gradiente azul/roxo, emojis como ícones, cards com sombras idênticas, tudo centralizado. Esta skill existe para quebrar esse padrão. Antes de escrever CSS, DEFINA uma direção visual e se comprometa com ela.

## Passo 1 — Escolha uma personalidade visual

Pergunte-se: se esta marca fosse uma pessoa, como ela se vestiria? Escolha UMA direção e leve ao extremo com consistência:

- **Editorial/Sofisticado**: serifa forte nos títulos, muito espaço em branco, paleta neutra + 1 acento, layout asimétrico
- **Tech/Preciso**: sans geométrica, dark mode, detalhes em monospace, bordas de 1px, acento neon único
- **Brutalist/Ousado**: tipografia gigante, cores sólidas vibrantes, bordas pretas grossas, sem sombras suaves
- **Orgânico/Acolhedor**: tons terrosos, cantos bem arredondados, ilustrações, serifa humanista
- **Corporativo premium**: azul profundo ou verde escuro + dourado/off-white, fotografia de qualidade, grid rígido

Se o nicho do cliente for conhecido (advogado, clínica, restaurante, SaaS), derive a personalidade do nicho — advocacia pede "Corporativo premium", hamburgueria artesanal pede "Brutalist/Ousado".

## Passo 2 — Sistema de cores (regra 60-30-10)

- 60% cor de fundo dominante, 30% cor secundária (seções alternadas, cards), 10% cor de acento (CTAs e destaques APENAS)
- Defina as cores como variáveis CSS no `:root` antes de qualquer componente
- Nunca use preto puro (#000) sobre branco puro (#fff): prefira #111 a #1a1a1a sobre #fafafa a #f5f5f5
- PROIBIDO: gradiente roxo/azul genérico como protagonista. Se usar gradiente, que seja sutil e dentro da paleta escolhida
- Verifique contraste mínimo 4.5:1 para texto normal (WCAG AA)

## Passo 3 — Tipografia

- Máximo 2 famílias: uma para títulos (com personalidade), uma para corpo (legível). Boas combinações via Google Fonts:
  - Fraunces + Inter (editorial) · Space Grotesk + Inter (tech) · Archivo Black + Archivo (ousado) · Lora + Source Sans 3 (acolhedor) · Libre Caslon + IBM Plex Sans (premium)
- Escala tipográfica com contraste real: hero 3-4.5rem, h2 2-2.5rem, corpo 1-1.125rem. Título de hero pode ser GRANDE — timidez tipográfica é o que faz parecer template
- `line-height`: 1.1-1.2 em títulos grandes, 1.6-1.7 no corpo
- `letter-spacing` negativo (-0.02em) em títulos grandes; labels em uppercase com letter-spacing positivo (+0.08em)

## Passo 4 — Layout e espaçamento

- Use uma escala de espaçamento consistente (4/8/16/24/32/48/64/96/128px) — nunca valores aleatórios
- Quebre a monotonia: NEM toda seção centralizada. Alterne: texto à esquerda + imagem à direita, seção full-bleed, grid de 3 colunas, seção com fundo invertido
- Container de conteúdo: max-width 1100-1200px; texto corrido max-width ~65ch
- Ícones: use SVG (Lucide, Heroicons) ou desenhe inline — NUNCA emojis como ícones em projetos profissionais

## Passo 5 — Detalhes que separam pro de amador

- Sombras: sutis e coloridas na cor do fundo (ex: `box-shadow: 0 12px 32px rgb(20 20 40 / 0.08)`), nunca `0 4px 6px rgba(0,0,0,0.3)` genérico
- Border-radius consistente em TODO o projeto (escolha: 0, 8px, 12px ou 20px — e mantenha)
- Estados de hover em tudo que é clicável (transição de 150-250ms)
- Imagens: se não houver fotos reais, gere placeholders com CSS (gradientes da paleta, padrões) em vez de cinza quebrado

## Checklist final

- [ ] A página tem UMA personalidade clara e consistente
- [ ] Zero gradiente roxo genérico, zero emoji como ícone
- [ ] Paleta segue 60-30-10 e o acento aparece só em CTAs/destaques
- [ ] Contraste de texto ≥ 4.5:1
- [ ] Pelo menos 2 layouts de seção diferentes (não tudo centralizado)
- [ ] Espaçamentos seguem a escala definida
