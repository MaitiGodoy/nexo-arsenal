---
name: animacoes-microinteracoes
description: Animações elegantes e micro-interações para sites — reveal no scroll, hovers, transições, contadores, parallax sutil e efeitos que transmitem qualidade. Use esta skill SEMPRE que o usuário pedir uma página "moderna", "animada", "premium", "com efeitos", "viva" ou quando o projeto pedir sensação de sofisticação — e aplique o nível básico por padrão em qualquer landing page.
---

# Animações e Micro-interações

Animação boa é sentida, não notada. O objetivo é transmitir qualidade e guiar o olhar — nunca distrair. Regra de ouro: anime propriedades baratas (`transform` e `opacity`), com durações curtas e easing natural. Se parecer "site de 2012" (coisas girando, piscando, quicando), está errado.

## Fundamentos técnicos

- Anime APENAS `transform` e `opacity` (não animam layout, rodam a 60fps). Evite animar `width`, `height`, `top`, `margin`
- Durações: micro-interações 150-250ms · entradas de elementos 400-700ms · nada acima de 1s
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out expressivo) para entradas; `ease-out` simples para hovers
- Respeite acessibilidade — inclua sempre:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## Reveal no scroll (o efeito que mais valoriza uma página)

Use `IntersectionObserver` — leve, sem bibliotecas:

```js
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => e.isIntersecting && e.target.classList.add('visivel'));
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
```

```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity .6s, transform .6s cubic-bezier(0.22,1,0.36,1); }
.reveal.visivel { opacity: 1; transform: none; }
```

- Aplique em títulos de seção, cards e imagens — não em TUDO
- Stagger em grupos: atrase itens irmãos em 80-120ms cada (`transition-delay` via `:nth-child` ou variável CSS)
- Anime uma única vez (não reverta ao rolar de volta)

## Micro-interações essenciais

- **Botões**: hover com elevação sutil (`translateY(-2px)` + sombra levemente maior) e `:active` com `scale(0.98)` — dá sensação tátil
- **Cards**: hover com borda/sombra realçada; se tiver imagem, `scale(1.04)` na imagem com `overflow: hidden` no card
- **Links**: sublinhado animado (pseudo-elemento com `transform: scaleX`)
- **Inputs**: borda/label com transição de cor no `:focus`
- **Header**: encolher ou ganhar fundo sólido após rolar (classe via JS no `scroll`)

## Efeitos de destaque (use no máximo 1-2 por página)

- **Contadores animados**: números de prova social subindo quando entram na tela (via IntersectionObserver + requestAnimationFrame)
- **Parallax sutil**: fundo do hero com deslocamento leve (máx. 10-15% da velocidade do scroll) — nunca parallax agressivo
- **Texto do hero**: entrada em stagger por palavra/linha no carregamento
- **Marquee de logos**: faixa de logos deslizando em loop (CSS `animation` linear infinita, pausa no hover)
- **Gradiente animado ou blob**: apenas se combinar com a direção visual da skill `design-visual-pro`

## O que NUNCA fazer

- Animações que atrasam o acesso ao conteúdo (preloaders longos, textos que demoram a aparecer)
- Autoplay de carrossel rápido, elementos piscando, cursor customizado pesado
- Bibliotecas pesadas (GSAP, AOS) para efeitos que CSS + IntersectionObserver resolvem — só aceite biblioteca se o usuário pedir efeito complexo específico
- Animar durante o scroll de forma travada (scroll-jacking)

## Checklist final

- [ ] Só `transform`/`opacity` animados
- [ ] `prefers-reduced-motion` respeitado
- [ ] Reveal no scroll com stagger nos grupos
- [ ] Botões e cards com hover/active táteis
- [ ] No máximo 1-2 efeitos de destaque
- [ ] Nada compete com o CTA pela atenção

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
