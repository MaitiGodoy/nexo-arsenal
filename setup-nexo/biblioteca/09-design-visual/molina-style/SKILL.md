---
name: molina-style
description: Escreve e renderiza carrosséis no estilo @afonsomolina (1,8M seguidores) — máximas universais em fundo branco/preto, sans-serif extra-bold único, sem decoração, sem watermark. Modelado a partir da análise estrutural de 30 carrosséis dele em maio/2026 (clientes/Hélio Costa Jr./MktOps/refs/afonsomolina/analise-afonsomolina.md). Acionar quando o usuário pedir "estilo Afonso Molina", "estilo Molina", "carrossel preto e branco com frase forte", "máxima Instagram", "Conselho de vida:", "carrossel motivacional sem decoração", "frase única fundo preto", ou quando pedir conteúdo aspiracional/motivacional/principia em formato de carrossel curto (1-6 slides). Diferente de `carousel-mktops` (12 slides, 4 atos com oferta) e `carousel-writer` (6-10 slides com ruptura). Usar SEMPRE em conjunto com `copywriting-guardrails` na revisão final.
---

# Molina Style — máximas em P&B

## IDENTIDADE

Esta skill modela o sistema de conteúdo de **@afonsomolina** identificado na análise de 30 carrosséis (28/04/2026 a 07/05/2026). Engajamento médio dos posts virais da amostra: 22k–28k likes em slides únicos, sem CTA, com uma frase em fundo branco ou preto.

A tese: **uma afirmação universal autossuficiente, projetada com maior contraste visual possível, vence carrossel longo e elaborado** quando o público-alvo é aspiracional/motivacional/principia.

A skill produz dois artefatos:
1. **Copy** — frase ou bloco de frases modelados em 7 formatos fixos.
2. **Design** — PNGs 1080×1350 renderizados via `automacao/paper-designs/_template-molina/`, com paleta P&B pura, sans-serif extra-bold única, zero decoração.

## REGRA-MÃE (não negociável)

> **A frase tem que ser interessante mesmo sozinha, sem oferta, sem desdobramento.**
> Se o leitor só vir o slide 1 e ainda assim sair com uma sentença na cabeça que pode repetir pra outra pessoa, o post funcionou. Volume de ofertas → zero. Volume de máximas → alto.

22 dos 30 carrosséis analisados não têm oferta nenhuma. **A oferta não é o objetivo — autoridade é.**

---

## QUANDO USAR vs outras skills de carrossel

| Caso | Skill |
|---|---|
| 1-6 slides, frase universal, P&B, sem oferta na maioria | **molina-style** |
| 12 slides, 4 atos, oferta sóbria no fim, paleta MktOps verde | `carousel-mktops` |
| 6-10 slides, ruptura/insight, capa de impacto, com decoração | `carousel-writer` |

Se o usuário disser "frase forte no fundo preto", "Conselho de vida:", "estilo Molina/Afonso", "máxima motivacional", "post de princípio" — é esta skill.

---

## INPUTS NECESSÁRIOS

1. **Tema ou tese** — uma ideia, princípio, observação, ou texto bruto.
2. **Voz/cliente** (opcional) — se for pra cliente da Artemis, ler `clientes/<nome>/CLAUDE.md` antes pra calibrar tom. Se for pro Hélio, usar memória `user_padrao-imposicao.md` e `feedback_voz-conteudo-pessoal-helio.md`.
3. **Quantidade** — N carrosséis (default 1).
4. **Tem oferta?** — default **não**. Se sim, qual keyword pra DM automation.

Se algum input crítico faltar, inferir do contexto. Não perguntar se já está claro.

---

## OS 7 MODELOS DE COPY (modelos literais)

Cada modelo tem:
- **Estrutura literal** com placeholders `{{...}}`
- **Quando usar**
- **1 exemplo Molina** (referência)
- **2 exemplos modelados** (B2B / Studio Artemis / Hélio)

### Modelo 1 — "Conselho de vida: [frase única]"

**Estrutura:**
```
Conselho de vida:
{{afirmação prescritiva em 1-2 frases, voz imperativa, sem hedge}}
```

**Quando usar:** princípio universal de comportamento, lealdade, ética de trabalho, vida pessoal. **Default fundo branco.**

**Exemplo Molina:**
> Conselho de vida:
> Quando seu amigo te mandar um post dele por direct, pelo menos curta. Provavelmente ele está lutando para fazer o negócio dele dar certo.

**Modelado para Studio Artemis / Hélio:**
> Conselho de vida:
> Quando o cliente atrasar o pagamento pela primeira vez, ligue antes de cobrar. Quase sempre é vergonha, não má-fé.

> Conselho de vida:
> Quando a IA escrever bem demais pra ser sua, atribua o crédito. Quem nega depende do mérito alheio pra parecer maior do que é.

---

### Modelo 2 — "[Imperativo polêmico]: [lista] + [princípio fechador]"

**Estrutura:**
```
{{imperativo polêmico de 2-4 palavras com requalificação semântica}}:
- {{comportamento 1}}
- {{comportamento 2}}
- {{comportamento 3}}
- {{comportamento 4}}
- {{comportamento 5}}
{{princípio fechador moral universal — uma frase que justifica a lista}}
```

**Quando usar:** quando se quer transformar adjetivo negativo em virtude (chato, estranho, repetitivo, lento). **Default fundo branco.** Lista entre 4 e 6 itens.

**Exemplo Molina:**
> Seja chato:
> - Saia de grupos de fofoca
> - Deixe de seguir influenciador que divulga tigrinho
> - Treine 1x ao dia
> - Não dê ouvidos pra gente negativa
> - Ore todo dia
> - Fale a verdade, sempre
> Ser chato, te destacará nessa multidão de hipócritas.

**Modelado para Studio Artemis / Hélio:**
> Seja repetitivo:
> - Diga a mesma tese de cinco formas diferentes
> - Repita o caso do cliente até cansar
> - Volte na mesma palavra-chave todo mês
> - Defenda o mesmo princípio em cada post
> - Não invente ângulo novo só pra parecer fresco
> Repetição não é preguiça — é como uma marca entra na memória de quem ainda não confia em você.

> Seja lento:
> - Dê três dias antes de responder uma briga
> - Releia o documento antes de mandar
> - Pense duas vezes antes de aceitar o cliente
> - Espere o desconto sair antes de comprar
> - Pergunte mais do que afirma
> Lento no impulso, rápido na execução — é o oposto do que o feed te ensinou.

---

### Modelo 3 — "Comecei a [ação]: [lista de resultados]"

**Estrutura:**
```
Comecei a {{ação contraintuitiva ou custosa}}:
- {{resultado 1}}
- {{resultado 2}}
- {{resultado 3}}
- {{resultado 4}}
- {{resultado 5}}
{{princípio mínimo — frase de uma linha}}
```

**Quando usar:** confissão de mudança de comportamento como prova social pessoal. **Default fundo branco.** Voz primeira pessoa. Lista de 4 a 6 resultados concretos.

**Exemplo Molina:**
> Comecei a postar 13x ao dia:
> - Alcancei mais pessoas
> - Minha autoridade aumentou
> - Passei a ser copiado por outros criadores
> - Recebi proposta de marca
> - Fiz minha primeira venda
> - Fui convidado pra podcast
> Consistência é o único caminho.

**Modelado para Studio Artemis / Hélio:**
> Comecei a publicar tudo no Substack antes de virar post:
> - Os artigos ganharam densidade
> - O carrossel virou consequência, não objetivo
> - Os clientes chegavam já lidos
> - O Instagram virou indexador
> - A conta de e-mail cresceu mais que a de seguidores
> Texto longo é o que sobra quando o resto cansa.

> Comecei a usar Claude Code pra rodar a operação inteira:
> - Demiti três ferramentas
> - Recuperei seis horas por semana
> - Documentei o que sempre repetia
> - Os clientes começaram a perguntar como
> - A receita dobrou sem entrar funcionário novo
> IA não substitui estratégia — mas um estrategista com IA substitui equipes.

---

### Modelo 4 — Cena mundana específica → princípio de negócios

**Estrutura:**
```
Slide 1 (gancho — cena concreta):
{{cena hiperdetalhada com número, lugar, contexto real}}

Slide 2 (princípio):
{{frase universal extraída da cena}}

Slide 3 (aplicação — opcional):
{{tradução prática pro leitor: "Você pode ser X ou Y"}}
```

**Quando usar:** explicar princípio de marketing, posicionamento, precificação, consistência. A cena precisa ser **real e específica** — número, lugar, contexto. Genérico não funciona. **Default fundo branco** (slide 2 pode ir pra preto pra impacto).

**Exemplo Molina:**
> [Slide 1] Fui no aeroporto hoje e paguei R$18 no pão de queijo. Na padaria perto da minha casa, custa R$2.
> [Slide 2] O pão de queijo é o mesmo. O que muda é o contexto, a percepção, o posicionamento.
> [Slide 3] Você pode ser o pão de queijo de R$2 ou o de R$18. O que muda é como você se posiciona.

**Modelado para Studio Artemis / Hélio:**
> [Slide 1] Comprei um cabo USB-C ontem. Anker R$89. Genérico R$12. Mesma especificação, mesmo lúmen de saída.
> [Slide 2] O preço não está no cobre — está em quem te garante que o cobre não vai derreter o seu MacBook.
> [Slide 3] Seu serviço também é cobre. Quem te paga 6x mais não está pagando o entregável. Está pagando a tranquilidade de ele não derreter nada.

> [Slide 1] Fui ao mercado às 22h. A fila do caixa expresso tinha 11 pessoas. A do caixa normal, vazia.
> [Slide 2] Atalho conhecido vira gargalo. O que era inteligente quando ninguém fazia, é multidão quando todo mundo descobre.
> [Slide 3] Em marketing, o canal que está funcionando hoje é a fila do expresso. O que vai funcionar amanhã está vazio agora.

---

### Modelo 5 — Narrativa de conquista com foto

**Estrutura:**
```
Slide 1 (foto pessoal real + frase):
{{foto em contexto de conquista — podcast, evento, viagem, milestone}}
{{caixa branca com frase de virada}}

Slide 2 (foto + contexto):
{{frase que reforça que não foi sorte — foi processo}}

Slide 3 (assinatura):
{{frase profética — "isso é só o começo"}}
```

**Quando usar:** marcar milestone público sem soar exibicionista. A foto importa mais que a copy. **Default Template B (foto lifestyle + caixa branca)**. Funciona melhor com foto sem filtro evidente.

**Exemplo Molina:**
> [Foto no estúdio do podcast Kiwify] Hoje eu sentei em um lugar que, por muito tempo, parecia longe demais da minha realidade.
> [Foto] Participar de um podcast dentro da Kiwify não foi sorte. Foi escolha, consistência e fé.
> [Foto] Isso é só o começo. O melhor ainda está por vir.

**Modelado para Studio Artemis / Hélio:**
> [Foto na frente da câmera, gravando aula] Hoje gravei a primeira aula do curso que eu queria que existisse quando comecei.
> [Foto] Não é talento. Não é sorte. É 15 anos lendo o mesmo livro de seis maneiras diferentes até virar coisa minha.
> [Foto] Quando virar 100, eu volto aqui pra agradecer quem ficou desde a primeira.

---

### Modelo 6 — Slide único de afirmação bruta

**Estrutura:**
```
{{frase única — uma sentença autossuficiente}}
```

**Quando usar:** princípio universal que não precisa de desdobramento. Funciona melhor com fundo preto + alarme 04:00 (autenticidade) ou fundo branco puro. **Sem CTA, sem kicker, sem foto.** É o formato que mais bombou na amostra (28k likes em um post desses).

**Exemplos Molina:**
> Eu nunca conheci ninguém, que mudou a vida da própria família, sem esgotar até sua última gota de suor. [fundo preto + alarme 04:00]

> No final da minha vida vou ter me arrependido de muitas coisas, mas não vou me arrepender de ter dado 100% da minha força para fazer aquilo que Deus me chamou para fazer. [fundo preto + alarme 04:00]

> Publique mesmo que ninguém engaja. Seu começo pode parecer pequeno, mas em breve terá milhões de pessoas te escutando. [fundo preto + alarme 04:00]

**Modelado para Studio Artemis / Hélio:**
> A única coisa que escala sem te custar mais é o que você já escreveu. [fundo branco]

> O cliente que você não quer atender hoje é o que vai te procurar daqui a três anos pra renegociar valor. Pense bem antes de devolver. [fundo preto]

> Eu nunca vi alguém construir autoridade publicando uma vez por mês. Vi muitos perderem por publicar todo dia sem ter o que dizer. O preço é o conteúdo — não o calendário. [fundo preto + timestamp]

---

### Modelo 7 — Reframing de crítica/julgamento externo

**Estrutura:**
```
Slide 1 (gancho — observação polêmica):
{{algo que "as pessoas dizem" ou parece verdade — invertido}}

Slide 2 (contexto):
{{por que a inversão é verdade}}

Slide 3 (princípio fechador):
{{frase que normaliza/resolve}}
```

**Quando usar:** transformar dor em sinal de progresso (hater → validação, cópia → referência, crítica de família → caminho certo). **Default fundo branco.**

**Exemplo Molina:**
> [Slide 1] Se você recebeu algum hater, o correto é agradecer, pois você está no caminho certo.
> [Slide 2] Hater é o sinal de que você está crescendo. Ninguém perde tempo criticando quem não tem relevância.
> [Slide 3] Continue no seu caminho. Os resultados vão calar qualquer boca.

**Modelado para Studio Artemis / Hélio:**
> [Slide 1] Quando o concorrente começar a copiar sua proposta, agradeça — você acabou de virar parâmetro.
> [Slide 2] Quem é referência define o jogo. Quem copia paga o custo de entrar atrasado num jogo que outro escreveu.
> [Slide 3] Continue publicando. Quem chega depois sempre paga mais caro.

> [Slide 1] Quando alguém te disser que IA "vai roubar seu trabalho", responda: "vai sim, se você não aprender a usar."
> [Slide 2] A pergunta nunca foi "IA ou humano". Foi "humano com IA, contra humano sem".
> [Slide 3] Não tenha medo da ferramenta. Tenha medo do colega que aprendeu antes de você.

---

## OS 4 ARQUÉTIPOS DE CAPA

Toda capa Molina cai em um destes:

| Arquétipo | Quando usar | Template visual |
|---|---|---|
| **Afirmação polêmica** | Frase que contradiz senso comum ou requalifica algo negativo | Template A (branco) ou C (preto) |
| **Cena concreta** | Cena hiperdetalhada com número/lugar | Template B (foto + caixa) ou A (texto puro) |
| **Confissão/contrário** | "Comecei a X" ou "Eu nunca conheci..." (1ª pessoa) | Template B (foto) ou C (preto + alarme) |
| **Pergunta afiada (implícita)** | Premissa que força leitor a se posicionar internamente | Template A (branco) |

---

## OS 6 RECURSOS RETÓRICOS A USAR

1. **Requalificação semântica** — pegar adjetivo negativo (chato, estranho, lento, repetitivo) e transformar em virtude. Provocação está na primeira palavra.
2. **Cena mundana + salto universal** — detalhe específico (R$18 no pão de queijo, fila do caixa expresso) → princípio. Nunca abstrato.
3. **Confissão quantitativa** — número como autoridade pessoal ("postar 13x ao dia", "li 40 livros em 2025"). Não vale "muito" ou "vários".
4. **Alarme/timestamp como assinatura** — foto de tela com horário (04:00, 03:22) ou Garmin no pulso. Prova de rotina invisível. Não usar em todo post — desgasta.
5. **Lista prescritiva com fechador moral** — "faça X, Y, Z" + "isso te fará [princípio]". Estrutura recorrente.
6. **Anáfora leve** — "Não é talento. Não é sorte. Não é o algoritmo. É aparecer todo dia." Repetição do "não é/é" cria ritmo.

---

## REGRAS DE OFERTA (segue o padrão Molina)

- **22/30 carrosséis dele não têm oferta.** Default desta skill é **sem oferta.**
- Quando há oferta: **sempre no último slide**, nunca antes.
- Mecânica: DM automation com keyword única.
  - `digita {{KEYWORD}} aqui nos comentários e olha seu direct`
  - Keywords curtas, memoráveis: MENTORIA, ANÁLISE, TP, ROTA, AURA, ARTEMIS.
- Nunca interrompe o conteúdo. A oferta é a porta, não a sala.
- Carrossel de awareness/autoridade pode rodar em tráfego pago **sem CTA** — constrói lista de remarketing pro carrossel de oferta converter.

---

## VOZ E DENSIDADE

- **Voz:** direta, imperativa, sem hedges. Nunca "talvez", "pode ser que", "é importante notar". Fala como quem viveu, não como quem leu.
- **Densidade:** telegráfica. Uma ideia por slide. Raramente mais de 3 frases por slide.
- **Religiosidade:** funciona pro público de Molina, **não funciona pro Hélio nem pra clientes B2B**. Substituir argumento religioso por argumento de processo, princípio de ofício, ou referência intelectual (Aristóteles, Tomás de Aquino, Marías) quando for pro Hélio.

---

## PROCESSO DE EXECUÇÃO

### Etapa 1 — Copy

1. Identificar tema/tese.
2. Escolher um dos 7 modelos.
3. Escolher arquétipo de capa (1 dos 4).
4. Escrever o bloco de copy preenchendo placeholders.
5. **Aplicar `copywriting-guardrails`** — eliminar antítese vazia, paradiastole, climax degenerado, bomphiologia, sententia falsa.
6. Mostrar copy no chat. **Esperar OK do Hélio antes de gerar arte.**

### Etapa 2 — Design (após aprovação)

Pipeline em `automacao/paper-designs/_template-molina/`:

```bash
cd "/Users/heliofcostajunior/Studio Artemis/automacao/paper-designs"
./novo-carrossel-molina.sh carrossel-molina-N-tema
cd carrossel-molina-N-tema
# editar slides.json
# se usar fotos lifestyle: baixar pra assets/, listar em processa-imagens.js, rodar `node processa-imagens.js`
node gerar.js
```

**Kinds disponíveis no template Molina:**

| `kind` | Quando usar | Aceita imagem? |
|---|---|---|
| `bold-white` | Template A — fundo branco, texto preto extra-bold | Não |
| `bold-black` | Template C — fundo preto, texto branco extra-bold | Não |
| `bold-black-alarm` | Template C com alarme 04:00 no rodapé | Não |
| `lifestyle-card` | Template B — foto fundo + caixa branca arredondada com texto | Sim (obrigatório) |
| `list-prescriptive` | Lista vertical de imperativos + frase fechadora | Não |
| `single-affirmation` | Frase única, fundo branco ou preto, sem nada mais | Não |

**Markdown leve no texto:**
- `**palavra**` → mais peso (extra-black 950)
- Quebra de linha simples → `\n`
- Listas: array `bullets` no JSON

### Etapa 3 — Markdown canônico

Salvar copy + paths dos PNGs em:
```
clientes/<cliente>/conteudo/carrossel-molina-<tema>.md
```

Estrutura:
```markdown
# {{título}}

**Modelo:** {{1 dos 7}}
**Arquétipo de capa:** {{1 dos 4}}
**Data:** {{YYYY-MM-DD}}

## Copy
{{copy estruturada por slide}}

## Legenda
{{frase única ou só @handle, no padrão Molina}}

## Arquivos
- assets renderizados: `automacao/paper-designs/carrossel-molina-N-tema/out/`
- 01.png ... NN.png
```

---

## OUTPUT FINAL ESPERADO

Quando esta skill é invocada, o output visível no chat deve ter exatamente esta estrutura:

```
## Carrossel {{N}} — {{título curto}}

**Modelo:** {{1 dos 7}}
**Arquétipo de capa:** {{1 dos 4}}
**Template visual:** {{bold-white | bold-black | bold-black-alarm | lifestyle-card | list-prescriptive | single-affirmation}}

### Copy

**Slide 1**
{{texto literal}}

**Slide 2** (se houver)
{{texto literal}}

…

### Legenda
{{frase única ou só "@handle"}}

### Próximo passo
Aprovação da copy → renderizo a arte com o pipeline `_template-molina/`.
```

Sem seções de "conceito", "por que funciona", "sugestão visual", "plano de teste". Texto limpo. Pronto pra colar.

---

## REFERÊNCIA-FONTE

Análise estrutural completa: `clientes/Hélio Costa Jr./MktOps/refs/afonsomolina/analise-afonsomolina.md`

30 carrosséis tabulados slide a slide, com copy literal, arquétipo de capa, função narrativa de cada slide, tema, métricas. Sempre que dúvida sobre um caso, consultar a tabela slide-a-slide nessa análise.
