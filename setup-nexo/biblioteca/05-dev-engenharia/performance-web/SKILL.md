---
name: performance-web
description: Otimização de performance e velocidade de sites — Core Web Vitals, imagens, fontes, carregamento e nota alta no PageSpeed/Lighthouse. Use esta skill SEMPRE que finalizar qualquer site ou página (aplique por padrão), quando o usuário reclamar de site lento, mencionar PageSpeed, Lighthouse, "nota do Google", velocidade de carregamento ou conversão caindo por lentidão.
---

# Performance Web

Página lenta mata conversão: cada segundo extra de carregamento derruba vendas — e no Brasil boa parte do tráfego vem de 4G instável. Aplique estas otimizações por padrão em tudo que construir. A meta prática: Lighthouse 90+ em mobile.

## Imagens (a causa nº 1 de página lenta)

- Formato: use WebP (ou AVIF) em vez de PNG/JPG — reduz 30-70% do peso
- Dimensione para o uso real: imagem de card de 400px não deve ter 2000px de largura. Use `srcset` para servir tamanhos diferentes por tela
- `loading="lazy"` em TODAS as imagens abaixo da dobra; NUNCA na imagem do hero
- Na imagem principal do hero: `fetchpriority="high"` e, se for background crítico, `<link rel="preload" as="image">`
- Sempre defina `width` e `height` (ou `aspect-ratio`) para evitar layout shift (CLS)
- Fotos de banco: baixe no tamanho necessário, não o original 4K

## Fontes

- Máximo 2 famílias, 3-4 pesos no total (cada peso é um arquivo)
- Google Fonts: use `&display=swap` na URL e preconnect:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

- Melhor ainda: auto-hospede os arquivos woff2 com `font-display: swap`

## JavaScript e CSS

- Scripts não críticos com `defer` (analytics, pixels, chat) — nunca bloqueando o `<head>`
- Pixels de rastreamento (Meta, Google, TikTok): carregue com `defer` ou após interação; são os maiores vilões de nota no PageSpeed
- Evite bibliotecas para o que é nativo: carrossel, accordion, modal e reveal se fazem com CSS + poucas linhas de JS
- CSS: um único arquivo minificado; para páginas críticas, considere inline do CSS above-the-fold
- Zero jQuery em projetos novos

## Core Web Vitals (o que o Google mede)

- **LCP** (< 2,5s): maior elemento visível — otimize a imagem/título do hero (preload, tamanho certo, sem lazy)
- **CLS** (< 0,1): nada pode "pular" — reserve espaço de imagens, embeds e anúncios com dimensões fixas ou `aspect-ratio`
- **INP** (< 200ms): interações respondem rápido — evite JS pesado no carregamento e handlers lentos

## Vídeo e embeds

- Nunca autoplay de vídeo pesado no hero — use poster + play sob demanda
- YouTube/Vimeo: use fachada (thumbnail clicável que só carrega o iframe no clique) — um embed do YouTube sozinho pesa ~1MB
- VSLs de plataformas (Vturb, Panda etc.): carregue o script da forma recomendada pela plataforma, mas mantenha o resto da página independente dele

## Entrega e hospedagem

- Ative compressão (gzip/brotli) e cache — em Vercel/Netlify/Cloudflare Pages isso já vem pronto
- Minifique HTML/CSS/JS na entrega final
- Teste no PageSpeed Insights (pagespeed.web.dev) simulando mobile e oriente o usuário a testar após publicar

## Checklist final

- [ ] Imagens em WebP, dimensionadas, com lazy loading (exceto hero)
- [ ] Hero com fetchpriority/preload
- [ ] width/height ou aspect-ratio em todas as mídias
- [ ] Fontes: máx. 2 famílias, display swap, preconnect
- [ ] Scripts de rastreamento com defer
- [ ] Embeds de vídeo com fachada
- [ ] Meta: Lighthouse mobile 90+
