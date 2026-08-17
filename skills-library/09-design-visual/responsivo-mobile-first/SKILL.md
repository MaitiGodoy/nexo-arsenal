---
name: responsivo-mobile-first
description: Responsividade impecável com abordagem mobile-first para qualquer site ou página. Use esta skill SEMPRE que criar ou revisar qualquer página web — no Brasil a maioria absoluta do tráfego é mobile, então TODA página deve ser construída com esta skill, mesmo que o usuário não mencione celular ou responsividade.
---

# Mobile-First Impecável

No Brasil, 70-80% do tráfego de páginas de venda vem do celular (principalmente via Instagram e WhatsApp). Construa SEMPRE a versão mobile primeiro e expanda para desktop — nunca o contrário. Uma página linda no desktop e quebrada no celular perde a maioria dos visitantes.

## Método de construção

1. Escreva o CSS base para mobile (viewport de ~375px)
2. Adicione breakpoints com `min-width` expandindo o layout:
   - `768px` — tablet: grids de 2 colunas, tipografia intermediária
   - `1024px` — desktop: layout completo, grids de 3-4 colunas
   - `1280px+` — telas grandes: apenas limite o container, não estique conteúdo
3. Teste mentalmente cada seção nos 3 tamanhos antes de finalizar

## Regras de layout mobile

- Colunas viram pilha: qualquer grid de 2+ colunas empilha verticalmente no mobile — defina a ORDEM da pilha conscientemente (imagem antes ou depois do texto?)
- Use `clamp()` para tipografia fluida: `font-size: clamp(2rem, 6vw, 4rem)` no hero elimina breakpoints de texto
- Padding lateral do container: 20-24px no mobile (nunca conteúdo colado na borda)
- Imagens: `max-width: 100%; height: auto` como base global
- PROIBIDO scroll horizontal: cause comum é elemento com largura fixa, `100vw` com scrollbar, ou palavra longa sem quebra (`overflow-wrap: break-word`)

## Toque e usabilidade

- Alvos de toque com mínimo 44x44px (botões, links de menu, ícones)
- Botão de CTA no mobile: largura total (`width: 100%`) ou quase, na zona do polegar
- Espaço entre elementos clicáveis: mínimo 8px para evitar toque errado
- Menu mobile: hambúrguer com painel que fecha ao clicar em link ou fora dele; links grandes e espaçados
- Considere botão flutuante de WhatsApp para negócios locais — é o padrão de conversão mobile no Brasil

## Tipografia e leitura no mobile

- Corpo de texto: mínimo 16px (abaixo disso o iOS dá zoom em inputs e a leitura sofre)
- Headline do hero no mobile: 1.75-2.5rem — grande, mas sem estourar em 2 palavras por linha
- `line-height` 1.6+ no corpo; parágrafos curtos (o bloco de texto que parece ok no desktop vira paredão no celular)
- Inputs de formulário: `font-size: 16px` no mínimo (evita zoom automático do iOS) e `type` correto (`email`, `tel`) para abrir o teclado certo

## Armadilhas comuns (verifique sempre)

- Tabelas: no mobile, transforme em cards empilhados ou permita scroll horizontal SÓ dentro da tabela
- Vídeos embed: envolva em container com `aspect-ratio: 16/9` e largura fluida
- Imagens de fundo com texto: garanta contraste no recorte mobile (a imagem corta diferente)
- Fixed/sticky headers: no mobile devem ser finos (56-64px) para não roubar tela
- Hover não existe no touch: toda informação essencial deve estar visível sem hover

## Checklist final

- [ ] Página perfeita em 375px, 768px e 1280px
- [ ] Zero scroll horizontal em qualquer largura
- [ ] Todos os alvos de toque ≥ 44px
- [ ] Corpo de texto ≥ 16px, inputs ≥ 16px
- [ ] CTA acessível na zona do polegar
- [ ] Menu mobile funcional (abre, fecha, navega)

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
