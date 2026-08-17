---
name: paginas-de-funil
description: Criação de páginas de funil de vendas — página de captura (squeeze page), página de vendas com VSL, página de obrigado, página de upsell/downsell e página de checkout. Use esta skill SEMPRE que o usuário mencionar funil, captura de leads, isca digital, lançamento, VSL, upsell, order bump, página de obrigado ou qualquer página de infoproduto/marketing digital.
---

# Páginas de Funil

Cada página de funil tem UM trabalho específico. Identifique qual página o usuário precisa e siga o padrão correspondente. Se ele pedir "o funil", construa o conjunto na ordem: captura → obrigado → vendas → upsell.

## Página de Captura (Squeeze Page)

Objetivo: trocar um material gratuito pelo contato do lead. Quanto menos elementos, maior a conversão.

- Estrutura mínima: headline de benefício + 3 bullets do que a pessoa vai receber + mockup da isca + formulário (nome e e-mail OU só e-mail/WhatsApp) + botão
- SEM menu, SEM rodapé com links, SEM rolagem longa — o ideal é caber em uma tela
- Headline: prometa o resultado da isca, não a isca ("Descubra os 5 erros que travam suas vendas" > "Baixe nosso e-book")
- Botão: "Quero receber grátis" + micro-copy "Seus dados estão seguros"
- Inclua link discreto para política de privacidade (exigência da LGPD para coleta de dados)

## Página de Vendas (com ou sem VSL)

- Com VSL: vídeo no topo (acima da dobra), headline curta acima do vídeo criando curiosidade, botão de compra que pode aparecer só após X minutos de vídeo (delay controlado por JS) se o usuário pedir
- Sem VSL: siga a estrutura completa da skill `landing-page-conversao`
- Elementos obrigatórios: ancoragem de preço, stack da oferta (lista de tudo que está incluso com valores individuais), garantia em destaque com selo, FAQ, urgência/escassez APENAS se real
- Botão de compra deve ir direto ao checkout — sem passos intermediários

## Página de Obrigado

Nunca desperdice esta página — é o momento de maior atenção do lead:

- Confirme a ação: "Pronto! Seu material está a caminho do seu e-mail"
- Instrução clara do próximo passo (verificar spam, salvar contato, entrar no grupo)
- Aproveite para UMA oferta leve: vídeo de apresentação, oferta tripwire de baixo valor, ou convite para seguir no Instagram
- Se houver pixel de conversão (Meta/Google), esta é a página onde o evento de conversão dispara — inclua o comentário `<!-- PIXEL DE CONVERSÃO AQUI -->` no head

## Página de Upsell / Downsell

- Barra de progresso no topo ("Etapa 2 de 3 — seu pedido ainda não está completo") 
- Headline conectando com a compra anterior: "Seu pedido foi aprovado! Antes de acessar, uma oportunidade única..."
- Oferta complementar, não repetida. Preço menor que o produto principal no downsell
- DOIS botões: aceitar (grande, cor de acento) e recusar (link discreto de texto: "Não, obrigado — quero acessar minha compra")
- Sem menu, sem distrações, contagem regressiva apenas se a oferta realmente expirar

## Integrações típicas (pergunte antes de assumir)

- Formulários: enviar para onde? (ActiveCampaign, Mailchimp, RD Station, webhook, planilha)
- Checkout: Hotmart, Kiwify, Eduzz, Kirvano, Stripe — o botão de compra aponta para o link de checkout da plataforma
- Sempre deixe os pontos de integração marcados com comentários claros no código: `<!-- COLE AQUI O LINK DO CHECKOUT -->`

## Checklist final

- [ ] Cada página tem UM único objetivo e zero rotas de fuga
- [ ] Captura pede o mínimo de campos possível
- [ ] Página de vendas tem stack de oferta + garantia + FAQ
- [ ] Obrigado aproveita a atenção com próximo passo
- [ ] Pontos de integração marcados com comentários no código
- [ ] Urgência/escassez apenas quando verdadeira

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
