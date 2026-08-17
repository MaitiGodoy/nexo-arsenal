---
name: ads-video-scripts
description: >
  Roteiros de video ads para Meta Ads (Facebook, Instagram, Reels, Stories).
  Gera roteiros completos em 12 formatos diferentes a partir do campaign-brief.md
  e brand-profile.json. Cada roteiro inclui formato, duração, hook, cenas, text overlays,
  narração e CTA. Roda após /ads create. Triggers: "roteiro de vídeo", "video ads",
  "script de vídeo", "reels script", "roteiro para anúncio", "video script",
  "ads video", "roteiro ads".
---

# Ads Video Scripts — Roteiros de Video Ads para Meta

Gera roteiros completos de video ads em 12 formatos diferentes a partir dos conceitos
de campanha já aprovados. Outputs `video-scripts.md` no diretório do cliente.

## Quick Reference

| Command | What it does |
|---------|-------------|
| `/ads video-scripts` | Roteiros para todos os conceitos aprovados |
| `/ads video-scripts --formats 1,2,5` | Só formatos específicos |
| `/ads video-scripts --duration 15` | Só roteiros de 15 segundos |

## Process

### Step 1: Check for Prerequisites

Look for these files in the current directory:

- `campaign-brief.md` — **obrigatório** (conceitos de campanha aprovados)
- `brand-profile.json` — **obrigatório** (tom de voz, tese, ângulos)
- `copy-deck-expandido.md` — **opcional** (hooks e copies já aprovados para reutilizar)
- `produto-*.md` — **opcional** (detalhes do produto para dados concretos)

**If campaign-brief.md not found**: Ask user to run `/ads create` first.
**If brand-profile.json not found**: Ask user to run `/ads dna` first.

### Step 2: Collect Parameters

Ask (skip if provided via flags):
1. **Quais conceitos?** Todos os do campaign-brief.md ou selecionar específicos?
2. **Quais formatos?** Todos os 12 ou selecionar específicos? (default: todos)
3. **Durações?** 15s, 30s, 60s ou todas? (default: 30s para cada)
4. **Quantos roteiros por conceito?** (default: 3 — um para cada duração)

### Step 3: Generate Video Scripts

Para cada conceito × formato selecionado, gerar um roteiro completo.

Se `copy-deck-expandido.md` existir, reutilizar hooks e copies já escritos como base para os roteiros — não reinventar do zero.

## Os 12 Formatos

### Formato 1 — Talking Head
Pessoa falando direto pra câmera. Fundo limpo. Cortes rápidos a cada 3-5 segundos. Hook nos primeiros 2 segundos. Funciona para autoridade e conexão pessoal.

**Quando usar:** autoridade, história pessoal, provocação, desafio de crença.
**Durações recomendadas:** 30s, 60s

### Formato 2 — Screen Recording + Narração
Tela da ferramenta rodando em tempo real com voz por cima explicando o que está acontecendo. Funciona para prova concreta.

**Quando usar:** demonstração de produto, prova de funcionamento, resultado ao vivo.
**Durações recomendadas:** 30s, 60s

### Formato 3 — Talking Head + Screen Recording (Híbrido)
Começa com pessoa falando (hook), corta pra tela mostrando o sistema, volta pra pessoa com o CTA. Melhor dos dois mundos.

**Quando usar:** quando precisa de autoridade + prova. O formato mais completo.
**Durações recomendadas:** 30s, 60s

### Formato 4 — Text Overlay Animado
Sem rosto. Texto aparecendo em sequência sobre fundo escuro ou motion graphics. CTA no final. Barato de produzir em escala com Remotion.

**Quando usar:** testes em volume, variações rápidas, sem depender de gravação.
**Durações recomendadas:** 15s, 30s

### Formato 5 — B-Roll + Text Overlay
Vídeo genérico de fundo (pessoa no computador, escritório, tela, mãos digitando) com texto forte sobreposto. CTA aparece no segundo 2. Hook é o texto, não a imagem.

**Quando usar:** tráfego frio em escala, alto volume de testes, fácil de variar.
**Durações recomendadas:** 15s, 30s

### Formato 6 — B-Roll + Narração (Voiceover)
Mesmo b-roll mas com voz narrando em vez de texto sobreposto. Mais intimista. Funciona bem em Stories e Reels com som ligado.

**Quando usar:** quando quer tom pessoal sem aparecer na câmera.
**Durações recomendadas:** 30s, 60s

### Formato 7 — Before/After Split Screen
Tela dividida: lado esquerdo mostra o "antes" (ChatGPT, prompts, ferramentas desconectadas), lado direito mostra o "depois" (sistema rodando). Pode ser screen recording real ou animação.

**Quando usar:** transformação, comparação, ruptura com o modelo antigo.
**Durações recomendadas:** 15s, 30s

### Formato 8 — Fake UGC / Estilo Casual
Gravado como se fosse vídeo casual de celular — sem produção, sem iluminação perfeita. "Eu preciso te mostrar uma coisa..." Não parece anúncio.

**Quando usar:** tráfego frio extremo, público que rejeita ads tradicionais.
**Durações recomendadas:** 15s, 30s, 60s

### Formato 9 — Lista/Countdown
"5 coisas que minha IA faz por mim todo dia" com cada item aparecendo em sequência. Pode ser talking head, b-roll ou texto animado. Retenção alta porque o scroll quer ver o próximo item.

**Quando usar:** múltiplos benefícios, features, resultados para mostrar.
**Durações recomendadas:** 30s, 60s

### Formato 10 — Speed Demo (Resultado em Tempo Real)
Screen recording acelerado mostrando a ferramenta executando uma tarefa completa em segundos. Sem narração, só text overlay com o que está acontecendo. Formato "satisfying".

**Quando usar:** prova de velocidade, antes/depois de tempo, resultado concreto.
**Durações recomendadas:** 15s, 30s

### Formato 11 — Hook Estático + Vídeo
Primeiro frame é uma imagem estática com texto forte (como se fosse um ad estático). Depois de 1-2 segundos, "ganha vida" e vira vídeo. Pattern interrupt.

**Quando usar:** quando quer o melhor dos dois mundos (estático para hook, vídeo para engajamento).
**Durações recomendadas:** 15s, 30s

### Formato 12 — Depoimento/Testemunho
Alguém (cliente, aluno, parceiro) falando sobre o resultado. Gravado pelo celular deles. Quanto mais autêntico, melhor. Formato mais poderoso de prova social em vídeo.

**Quando usar:** quando tem depoimentos reais disponíveis.
**Durações recomendadas:** 15s, 30s, 60s

## Estrutura de Cada Roteiro

IMPORTANTE: O roteiro é COPY, não direção de cena. Não descreva ações de câmera ("close de fulano", "plano médio", "fulano olha pra câmera"). Não use timestamps por cena ("[0-2s]", "[3-15s]"). Entregue apenas o TEXTO — o que será falado e/ou exibido na tela. O editor decide como filmar.

Cada roteiro deve conter EXATAMENTE estes campos:

```
### [Número] — [Nome do Conceito] × [Nome do Formato] | [Duração]

**Formato:** [qual dos 12]
**Duração:** [15s / 30s / 60s]
**Texto na tela:** [a frase principal que aparece do início ao fim do vídeo]
**CTA na tela (aparece aos 2s):** [texto do CTA que complementa a frase principal]
**Narração/fala:** [texto exato falado — "N/A" se não tem fala]
```

### Regras de estrutura por formato

**Para formatos com texto na tela (4, 5, 7, 10, 11):**
- UMA frase forte que fica na tela do início ao fim do vídeo — é a mensagem central
- CTA aparece aos 2 segundos complementando a frase
- NÃO fragmentar em múltiplos text overlays sequenciais — uma mensagem, não um carrossel
- A frase pode ser longa — o que importa é ser forte e legível

**Para formatos com fala (1, 2, 3, 6, 8, 9, 12):**
- Entregar o texto exato da fala (o que a pessoa vai dizer)
- Se tiver texto na tela junto com fala, especificar separadamente
- Sem indicações de câmera, planos, movimentos ou timestamps

**Para formato Lista/Countdown (9):**
- Cada item da lista é um texto que aparece na tela
- A narração acompanha os itens se houver fala

## Regras de Qualidade

### Hook (primeiros 2 segundos)
- O hook DECIDE se a pessoa assiste ou passa. É a parte mais importante.
- Deve funcionar COM e SEM som (text overlay obrigatório no hook)
- Tipos de hook eficazes:
  - **Contrarian:** "Todo mundo fala em IA, mas ninguém..."
  - **Problem-Agitation:** "Se você ainda abre o ChatGPT e digita prompts..."
  - **Curiosity Gap:** "Ninguém fala sobre isso, mas..."
  - **Bold Claim:** "Uma IA de R$100/mês entrega mais que agências de R$20 mil."
  - **Pattern Interrupt:** visual ou textual que quebra o padrão do feed
  - **Before/After Compression:** "O que levava 3 dias agora leva 4 minutos."
  - **Tribal Identity:** "Isso separa quem usa IA de quem comanda IA."
  - **Pergunta:** "Você ainda está pagando R$15 mil por mês numa agência?"

### Texto na tela
- Uma frase forte, central, que fica do início ao fim
- Pode ser longa desde que seja legível e impactante
- Deve carregar a mensagem mesmo com som desligado
- CTA visual complementar aparece aos 2 segundos

### Narração/Fala
- Tom: mesmo do brand-profile.json (autoridade sem arrogância, direto)
- Frases curtas, sem subordinadas longas
- Se for talking head: linguagem de conversa, não de teleprompter
- Se for voiceover: pode ser ligeiramente mais polido

### CTA
- Sempre visual (text overlay) + falado (se tiver narração)
- Direto: "Link na bio", "Toque no botão", "Acesse agora"
- Incluir o preço quando fizer sentido (R$297)

### Regras Gerais (mesmas do copy deck)
- PROIBIDO: hedges, clichês de IA, frases de duas palavras com ponto final
- PROIBIDO: descrição de cenas, direção de câmera, timestamps por cena, ações visuais ("close de fulano", "plano médio", "fulano olha pra câmera", "[0-2s]")
- O roteiro é TEXTO (fala + texto na tela), não storyboard
- Tom de quem já fez, não de quem promete
- Números e dados concretos sempre que possível
- Cada roteiro deve funcionar independentemente

## Geração em Waves

Assim como o copy deck, gerar em 3 waves:

### Wave 1 — Core
Para cada conceito, gerar 1 roteiro em cada um dos 3 formatos mais versáteis:
- Formato 5 (B-Roll + Text Overlay) — mais fácil de produzir
- Formato 1 (Talking Head) — mais pessoal
- Formato 3 (Híbrido Talking Head + Screen) — mais completo

### Wave 2 — Extensão
Para os 3 conceitos mais fortes, gerar roteiros em formatos extras:
- Formato 8 (Fake UGC)
- Formato 9 (Lista/Countdown)
- Formato 10 (Speed Demo)

### Wave 3 — Wild Cards
5-10 roteiros experimentais misturando conceitos e formatos:
- Formato 7 (Before/After Split Screen)
- Formato 11 (Hook Estático + Vídeo)
- Formato 4 (Text Overlay Animado para Remotion)
- Combinações inesperadas de conceito × formato

## Output Format

IMPORTANTE: Organizar por FORMATO, não por conceito. Isso permite que o usuário produza em lote — grava todos os talking heads de uma vez, monta todos os b-rolls de uma vez, etc. Fluxo de produção, não fluxo de conceito.

Salvar como `video-scripts.md` no diretório do cliente:

```markdown
# Video Scripts — [Brand Name]
**Gerado:** [date]
**Conceitos base:** [N]
**Total de roteiros:** [N]
**Plataformas:** Meta Ads (Feed, Stories, Reels)

## Formato 1 — Talking Head ([N] roteiros)

### 01 — [Conceito A] | Talking Head | 30s
[roteiro]

### 02 — [Conceito B] | Talking Head | 30s
[roteiro]

[todos os talking heads juntos]

## Formato 3 — Híbrido Talking Head + Screen ([N] roteiros)

### 03 — [Conceito A] | Híbrido | 60s
[roteiro]

[todos os híbridos juntos]

## Formato 5 — B-Roll + Text Overlay ([N] roteiros)

### 04 — [Conceito A] | B-Roll + Text | 30s
[roteiro]

[todos os b-rolls juntos]

## Formato 8 — Fake UGC ([N] roteiros)
[todos os fake UGC juntos]

## Formato 9 — Lista/Countdown ([N] roteiros)
[todos os countdowns juntos]

## Formato 10 — Speed Demo ([N] roteiros)
[todos os speed demos juntos]

## Wild Cards ([N] roteiros)
[formatos variados: Before/After, Hook Estático, Remotion, Voiceover, Depoimento]
```

## Integração no Fluxo /ads create

Esta skill roda APÓS o copy-deck-expandido.md ser gerado. O fluxo completo:

```
/ads create
  ├── Step 4: creative-strategist → campaign-brief.md
  ├── Step 5: validação dos conceitos
  ├── Step 6: copy deck expandido → copy-deck-expandido.md
  ├── Step 7: copywriting guardrails
  ├── Step 8: PERGUNTA — "Quer gerar roteiros de vídeo também?"
  │           Se sim → gera video-scripts.md
  │           Se não → encerra
  └── Step 9: resumo final
```
