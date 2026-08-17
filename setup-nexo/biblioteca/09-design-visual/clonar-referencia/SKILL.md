---
name: clonar-referencia
description: Analisar um site ou página de referência (por URL ou print/screenshot) e reconstruí-lo do zero com identidade própria. Use esta skill SEMPRE que o usuário enviar um link ou imagem de um site dizendo "quero um site assim", "clona essa página", "usa como referência", "me inspira nesse layout" ou pedir para recriar/adaptar qualquer design existente.
---

# Clonar e Adaptar Referências

Clonar bem não é copiar pixel a pixel: é extrair a ESTRUTURA e as DECISÕES de design da referência e reconstruí-las com o conteúdo e a marca do cliente. O resultado deve funcionar tão bem quanto o original, sem ser uma cópia identificável.

## Nota ética (leia primeiro)

- Estrutura, layout e padrões de design não têm dono — copiá-los é prática padrão do mercado
- NUNCA copie: textos originais, logotipos, fotos, ilustrações ou marca registrada da referência. Todo conteúdo deve ser novo ou do cliente
- Se o usuário pedir cópia idêntica incluindo textos e marca de terceiros, explique o risco e proponha a versão adaptada

## Passo 1 — Auditoria da referência

Analise a referência (via print, URL ou descrição) e documente ANTES de codar:

1. **Mapa de seções**: liste na ordem (ex: hero split → logos → features em grid 3x2 → depoimento full-width → pricing 3 colunas → FAQ acordeão → CTA final)
2. **Grid e ritmo**: largura do container, quantas colunas, alinhamento (centralizado? assimétrico?), densidade de espaço em branco
3. **Sistema tipográfico**: serifa ou sans? Tamanho relativo do hero? Peso dos títulos? Uppercase em labels?
4. **Paleta**: fundo dominante, cor de acento, uso de dark/light, presença de gradientes
5. **Elementos de assinatura**: o que torna esse site memorável? (ex: bordas grossas, cards flutuantes, imagens recortadas, animação no scroll, blur/glassmorphism)
6. **Padrões de conversão**: onde estão os CTAs, que prova social usa, como apresenta preço

Apresente essa auditoria ao usuário em resumo antes de construir — isso demonstra profissionalismo e alinha expectativas.

## Passo 2 — Tradução para a marca do cliente

- Substitua a paleta da referência pela paleta do cliente mantendo a mesma LÓGICA (se a referência usa fundo escuro + acento neon, use o escuro e o acento da marca do cliente)
- Troque as fontes por equivalentes na mesma categoria (a referência usa uma grotesk pesada? use Space Grotesk ou Archivo)
- Reescreva TODO o texto para o negócio do cliente (use a skill `copy-de-paginas`)
- Mantenha: hierarquia, proporções, ritmo de seções, posições de CTA
- Mude: pelo menos 2 elementos de assinatura, para o resultado ter identidade própria

## Passo 3 — Reconstrução

- Construa mobile-first seguindo o mapa de seções da auditoria
- Reproduza o COMPORTAMENTO, não o código: se a referência tem header que encolhe no scroll, implemente o efeito do seu jeito
- Se a referência tiver animações, recrie com a skill `animacoes-microinteracoes`
- Ao final, compare lado a lado com a auditoria: cada seção mapeada foi contemplada?

## Quando a referência é um print (imagem)

- Meça proporções visualmente: o hero ocupa a tela toda? O container tem margens largas?
- Identifique as fontes por características (serifa? geométrica? condensada?) e escolha a Google Font mais próxima
- Extraia as cores dominantes da imagem e monte a paleta em variáveis CSS
- Assuma os estados que não aparecem no print (hover, mobile) seguindo a lógica do design

## Checklist final

- [ ] Estrutura e ritmo fiéis à referência
- [ ] Zero texto, logo ou imagem copiados do original
- [ ] Paleta e fontes adaptadas à marca do cliente
- [ ] Pelo menos 2 elementos diferenciados do original
- [ ] Comportamentos (scroll, hover, menu) recriados
