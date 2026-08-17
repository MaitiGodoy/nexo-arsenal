---
name: carousel-mktops
description: Escreve carrosséis de Instagram/LinkedIn no método MktOps em três modos — CASO (12 slides, narrativa de personagem real, 4 atos), MEC (10 slides, mecanismo próprio com screenshot-prova) e DESTILADO (10 slides, comentário editorial sobre insumo já curado por terceiro). Sempre com capa em arquétipo definido, oferta sóbria no fim e legenda padrão. Acionar quando o usuário pedir carrossel "no estilo MktOps", "no formato Plugue", "carrossel narrativo", "narrativa → princípio → aplicação → oferta", quando passar artigo/dado/tese e pedir N carrosséis, ou quando entregar um insumo curado (vídeo, podcast, transcrição, artigo, livro) e pedir comentário editorial em formato carrossel. Usar SEMPRE em conjunto com `copywriting-guardrails` na revisão final.
---

# Carousel MktOps — método narrativo de 4 atos

## IDENTIDADE

Esta skill produz carrosséis no padrão MktOps cristalizado nos kits da Plugue (`clientes/Plugue/conteudo/playbook-narrativas-mktops.md` e `kit-narrativas-5-carrosseis-v3.md`). Toda peça parte de uma **história/cena interessante por si só** e só depois faz a ponte com o cliente da agência. A oferta entra como consequência natural — nunca como conclusão forçada.

A skill resolve internamente: triagem do insumo, seleção do personagem-âncora, escolha do arquétipo de capa, escrita dos 4 atos, legenda e checklist. A resposta visível é o carrossel pronto pra colar no documento de entrega.

## Cérebro de Copy — opt-in (referência opcional)

Camada estratégica acima desta skill. **Não compulsória.** Em carrossel rotineiro, skill roda sozinha — o método MktOps já está embutido aqui. Em carrossel-âncora (lançamento, posicionamento, peça-chave) ou quando o usuário pedir "use o Cérebro" / "aplique Cérebro N/M/P", ler **antes** de gerar.

Cérebro vive em `clientes/Hélio Costa Jr./Obsidian/1-Marketing-IA/cerebro-de-copy/`. Mapa completo dos 14 arquivos no CLAUDE.md raiz do projeto.

**Arquivos relevantes pra esta skill:**
- `02-arquitetura-da-copy.md` — frame stacking, chunking, 4 atos MktOps detalhados
- `03-hooks-e-aberturas.md` — capa: 10 openers Sultanic + 6 arquétipos
- `05-body-copy-frameworks.md` — body do Ato 2 e 3 (princípio + aplicação)
- `06-closes-e-ctas.md` — Ato 4 (oferta sóbria, Identity Close, No Choice)
- `11-anti-padroes.md` — checklist de auditoria pré-arte
- `13-integracao-mktops.md` — mapa skill-por-skill, modos CASO/MEC/DESTILADO

## REGRA-MÃE (não negociável)

> **O carrossel é interessante mesmo se o leitor nunca for cliente.**
> Se o leitor sair antes do CTA e ainda assim aprender algo, o post cumpriu a função.
> A oferta é consequência da história — não conclusão forçada.

Se a história precisar do produto pra fazer sentido, a história não está pronta. Recomeça.

## QUANDO USAR ESTA SKILL VS `carousel-writer`

| Caso | Skill |
|---|---|
| Carrossel curto (6-10 slides), sem oferta, foco em ruptura | `carousel-writer` |
| Carrossel narrativo MktOps (10-12 slides, com oferta sóbria) | **carousel-mktops** |
| Cliente da agência (Plugue, MktOps, etc.) com posicionamento próprio | **carousel-mktops** |
| Pesquisa de conteúdo + N carrosséis para um cliente | **carousel-mktops** |

## TRÊS MODOS — escolher antes de escrever

Antes de partir pra estrutura, decidir o modo:

| Modo | Quando usar | Estrutura |
|---|---|---|
| **CASO** (default 4 atos) | Insumo tem personagem real, empresa, fundador, evento com data e cena reconstituível, e o objetivo é narrar/expandir | 12 slides — Narrativa (1-4) → Princípio (5-7) → Aplicação (8-10) → Oferta (11-12) |
| **MEC** (mecanismo/sistema) | Insumo é método, framework, sistema, conjunto de práticas que **o autor** opera (não personagem externo) | 10 slides — Cover (1) → Mecanismos (2-6) → Princípio (7) → Aplicação (8) → Oferta (9) → CTA (10) |
| **DESTILADO** (insumo curado, comentário crítico) | Insumo já curado por terceiro (vídeo, podcast, artigo, transcrição, livro). Objetivo é **comentar** sob lente MktOps, sem narrar cena nem buscar nada fora | 10 slides — Capa-tese (1) → Fonte e enquadramento (2) → 4 destaques (3-6) → Princípio (7) → Aplicação (8) → Oferta (9) → CTA (10) |

**Regra de decisão:**
- Insumo é "como [empresa/pessoa] fez X" + objetivo de **narrar e expandir** com cena reconstituída → **CASO**.
- Insumo é "5 jeitos de [resultado]", "como eu opero [tema]", "framework próprio com mecanismos numerados" → **MEC**.
- Insumo é vídeo, podcast, artigo, transcrição ou livro **já curado por terceiro** + objetivo de **comentar criticamente** sem buscar nada fora → **DESTILADO**.
- Em dúvida entre CASO e DESTILADO: se você precisa **buscar** personagem ou contexto fora do insumo, é CASO. Se o personagem/contexto **já está** no insumo e você só quer comentá-lo sob lente MktOps, é DESTILADO.
- Em dúvida entre MEC e DESTILADO: se o sistema é **seu**, é MEC. Se é de terceiro e você está comentando, é DESTILADO.

**Referências canônicas:**
- Modo CASO — `clientes/Plugue/conteudo/playbook-narrativas-mktops.md`
- Modo MEC — `automacao/paper-designs/carrossel-10-claude-token-economy/` (5 mecanismos de token economy, MktOps como oferta)
- Modo DESTILADO — _referência canônica a ser cristalizada após primeira execução_ (salvar primeiro carrossel-destilado em `clientes/Hélio Costa Jr./MktOps/conteudo/` como referência futura)

---

## INPUTS NECESSÁRIOS

Ao ser invocada, a skill espera receber (explicitamente ou inferindo do contexto):

1. **Insumo de conteúdo** — UM dos seguintes:
   - URL de artigo, vídeo ou tese
   - Trecho de texto bruto
   - Tema/assunto
   - Banco de dados/pesquisa já consolidado
   - Transcript de aula/entrevista
2. **Cliente da agência** — pasta em `clientes/<nome>/` (ler `brand-context.md` ou `CLAUDE.md` do cliente antes de escrever).
3. **Quantidade de carrosséis** — N carrosséis distintos.
4. **Público-alvo** (opcional, infere do brand-context se omitido).

Se algum input crítico estiver faltando, a skill pode inferir do contexto da conversa. Não fazer perguntas se a informação está disponível.

---

## PROCESSO INTERNO (nunca expor no output final)

### Passo 1 — Extração de âncoras do insumo

Quando o insumo é artigo/dado/tese (não personagem pronto):

1. Ler o insumo até o fim. Não resumir, não pular.
2. Listar **todas** as âncoras concretas encontradas: números, datas, nomes de empresa/pessoa, citações diretas, casos.
3. Agrupar âncoras por **cluster temático** — cada cluster vai virar 1 carrossel.
4. Para cada cluster, identificar o **personagem-âncora** (pessoa real, empresa, evento, cena verificável). Se o insumo não tiver, **buscar fora**: caso público recente, fundador, evento, cena clássica que ilustre o cluster.

**Critério de seleção do personagem-âncora:**
- Tem nome próprio? (Pessoa, empresa, evento, lugar)
- Tem data ou janela temporal específica?
- Tem cena reconstituível (lugar, ação, citação)?
- Conecta com o cluster de dados sem forçar?

Se faltar algum dos quatro, escolher outro personagem.

**Adaptação para DESTILADO (não fazer Passo 1 padrão):**
- **NÃO buscar fora.** O insumo é o universo inteiro do carrossel. Buscar contexto externo aqui é falha de modo.
- O autor do insumo (host do podcast, palestrante do vídeo, autor do artigo) é a fonte — não há "personagem-âncora" a escolher.
- Listar âncoras concretas do insumo: quotes literais (entre aspas), números específicos citados, ações descritas pelo próprio autor.
- Critério de viabilidade: o insumo precisa ter **pelo menos 4 âncoras literais distintas** pra sustentar 4 destaques. Se não tiver, o insumo é fraco demais pra DESTILADO — usar como matéria-prima pra modo CASO ou MEC, ou descartar.
- Não há "cluster temático que vira N carrosséis" — em DESTILADO, **1 insumo = 1 carrossel**. Múltiplos carrosséis exigem múltiplos insumos.

### Passo 2 — Validar a ponte

Para cada (personagem + cluster + cliente da agência), conferir os 3 elementos da ponte:

1. **A história engaja sozinha?** (Compartilhar com amigo não-cliente faz sentido?)
2. **O princípio é universal e claro?** (Cabe em uma frase?)
3. **A ponte com a dor do leitor é natural?** (O salto do princípio para a aplicação é orgânico ou forçado?)

Se algum dos 3 falhar, voltar ao passo 1 e escolher outro personagem.

**Adaptação para DESTILADO:**
- Em vez de "engaja sozinha", validar: **a tese editorial extraída do insumo é interessante mesmo pra quem não viu o vídeo/leu o artigo?**
- Em vez de "ponte com a dor do leitor", validar: **o salto da fala do autor pra realidade do ICP brasileiro é orgânico?** Se precisar de muita construção pra conectar, o insumo não cabe ao ICP — descartar.
- Validação extra do DESTILADO: cada destaque tem **âncora literal** (quote ou número) que pode ser citada de volta ao insumo? Se algum destaque vira paráfrase genérica ("ele falou que produtividade importa"), reformular ou trocar.

### Passo 3 — Escolher arquétipo de capa

A capa é 80% do carrossel. Escolher UM arquétipo, não misturar.

**Arquétipos para modo CASO (1-6):**

| Arquétipo | Quando usar | Estrutura |
|---|---|---|
| **A1. Cena cinematográfica** | Há momento dramático/decisivo (acidente, demissão, reunião) | "EM [DATA], [EVENTO BRUTAL ACONTECEU]." → "E o motivo é exatamente [tese do carrossel]." |
| **A2. Personagem fundador** | Há fundador/criador com trajetória conhecida | "EM [ANO], UM [PROFISSÃO] DE [LUGAR] FUNDOU UMA EMPRESA QUE HOJE [NÚMERO IMPACTANTE]." → "E o que ele fez é o oposto do que [maioria] tenta." |
| **A3. Pesquisa-âncora** | Há estudo/relatório/pesquisa com instituição forte | "EM [DATA], [INSTITUIÇÃO] PUBLICOU [TIPO DE ESTUDO] QUE [DESMONTA/PROVA] [NARRATIVA COMUM]." → "E só [%/N] das empresas está pronta." |
| **A4. Contraste numérico** | Há dois números que se contradizem visualmente | "[NÚMERO A] [CONTEXTO]. [NÚMERO B] [CONTEXTO]." → "[Pergunta que conecta]." |
| **A5. Reviravolta histórica** | Há fato que muda interpretação consagrada | "[FATO QUE PARECE X]. [REVIRAVOLTA QUE MOSTRA Y]." → "E o que isso revela sobre [aplicação]." |
| **A6. Frase-bandeira** | Há citação direta forte de pessoa real | "[FRASE QUE [PESSOA] REPETE/REPETIU]." → "E o que isso revela sobre [tese]." |

**Arquétipos para modo MEC (7-8):**

| Arquétipo | Quando usar | Estrutura |
|---|---|---|
| **A7. Dor direta em 2ª pessoa + promessa numerada** | Insumo é mecanismo/sistema, leitor sente custo concreto agora | "VOCÊ ESTÁ [DOR CONCRETA] TODA VEZ QUE [GATILHO]." → "[N] MECANISMOS QUE [VERBO QUE RESOLVE] ESSE *[PALAVRA-ÂNCORA]*." → gancho italic verde "→ Salva o post. Você vai voltar nele." |
| **A8. Tese-bandeira + lista visual** | Insumo é framework próprio do autor com nome | "[TESE EM 1-2 LINHAS, CAIXA ALTA]." → "POR QUE [SISTEMA/MÉTODO] *[VERBO]*." → gancho italic verde |

**Arquétipos para modo DESTILADO (9-10):**

| Arquétipo | Quando usar | Estrutura |
|---|---|---|
| **A9. Manchete-tese editorial** | Insumo curado por terceiro (vídeo, podcast, artigo). Você quer abrir com a leitura editorial direta — sem cena, sem reconstrução | "[FATO/AÇÃO/NÚMERO LITERAL DO INSUMO, CAIXA ALTA, 3-5 LINHAS CURTAS]." → "[O QUE ISSO REVELA SOBRE __[PALAVRA-ÂNCORA]__]." → gancho italic verde com seta |
| **A10. Quote-âncora literal** | Há frase literal forte do autor do insumo que carrega o argumento sozinha | "__'[CITAÇÃO LITERAL CURTA, 6-12 PALAVRAS]'__" (italic verde grande) → linha de assinatura discreta: "[Autor], [contexto curto], [data]." → seta de gancho com tese editorial em italic verde |

**Padrão visual da capa (todos os arquétipos):**
- Texto em **CAIXA ALTA**, dividido em 4-6 linhas curtas (exceto A10, que usa quote literal em italic verde grande)
- Cada linha cabe em 1 respiração
- Palavra-âncora final em `__italic__` (renderiza italic verde-deep, Instrument Serif)
- Linha de gancho com seta `→` separada do bloco principal, cor verde-deep
- A capa entrega ruptura + credibilidade + promessa
- Modo MEC pode dispensar imagem na capa (o impacto é tipográfico — ver carrossel-10)
- Modo CASO sempre tem imagem real do personagem/empresa na capa quando disponível
- Modo DESTILADO é **tipográfico puro** na capa (sem foto). Se houver foto do autor do insumo, vai no slide 2 (fonte), nunca na capa — a tese editorial carrega sozinha

### Passo 4 — Escrever a estrutura

Escolher entre **4A (CASO — 12 slides)**, **4B (MEC — 10 slides)** ou **4C (DESTILADO — 10 slides)** conforme decidido no início.

---

## ESTRUTURA 4A — Modo CASO (12 slides, 4 atos)

#### Ato 1 — A NARRATIVA (slides 1-4) — ~30% do carrossel
- Slide 1: capa (ver passo 3)
- Slide 2: a cena/o personagem — abertura concreta com data, lugar, nome
- Slide 3: o detalhe que importa — número, citação, fato verificável
- Slide 4: o número/dado-âncora que conecta com o cluster do insumo

**Regra-ouro do Ato 1:** NÃO mencionar o cliente, o produto, a oferta, o leitor. A história é interessante por si só.

#### Ato 2 — O PRINCÍPIO (slides 5-7) — ~25% do carrossel
- Slide 5: a leitura preguiçosa + correção
  - Padrão fixo: "A leitura fácil dessa história é '[X]'. Errada." (ou "Rasa.")
  - Em seguida, a leitura correta com substância.
- Slide 6: o segundo dado/citação que aprofunda — pesquisa cruzada, contexto adicional
- Slide 7: o princípio universal em uma frase — moral da história, sem mencionar produto ainda

**Regra-ouro do Ato 2:** o princípio é uma frase que cabe num post solto. Se não couber, não está pronto.

#### Ato 3 — A APLICAÇÃO (slides 8-10) — ~30% do carrossel
- Slide 8: a cena equivalente no mundo do leitor — descrição do padrão típico que o leitor reconhece em si mesmo
- Slide 9: o erro de classificação ou o sintoma — onde a maioria erra ao reagir
- Slide 10: o teste prático ou a janela curta — critério honesto que o leitor pode aplicar essa semana

**Regra-ouro do Ato 3:** TOCAR a dor sem PROPOR solução comercial ainda. O leitor precisa sentir o problema antes da oferta entrar.

#### Ato 4 — A OFERTA (slides 11-12) — ~15% do carrossel
- Slide 11: a oferta como consequência natural — o que o cliente da agência faz, em tom mole, sem pressão
- Slide 12: o CTA — "Se essa história ressoou com [contexto]: comenta [PALAVRA-TEMA] ou chama no direct. [Frase de fechamento curta]."

**Regra-ouro do Ato 4:** sem pressão. Sem urgência fabricada. Sem pricing. Sem "última chance". Se o leitor não engajar, paciência — o post já fez seu trabalho.

---

## ESTRUTURA 4B — Modo MEC (10 slides, sem narrativa de personagem)

Padrão cristalizado em `carrossel-10-claude-token-economy`. Cada slide-mecanismo é um mini-ensaio com prova visual.

#### Slide 1 — CAPA (arquétipo A7 ou A8)
Tipográfica pura, sem imagem. Bloco grande caixa alta + palavra-âncora em italic verde + gancho com seta. Já detalhado no Passo 3.

#### Slides 2-6 — OS MECANISMOS (5 slides com a mesma anatomia)

Cada slide tem:
- `kind: "narrative"`, `withImage: true`
- **Imagem:** screenshot real que prova a tese do slide (ver Passo 4C abaixo)
- **Eyebrow:** `Mecanismo N · [NomeCurto]` (uppercase via CSS, em-dash verde antes)
- **Título:** uma frase imperativa direta — "Crie um X", "Quebre Y em Z", "Delegue trabalho W", "Tire a IA de A". Instrument Serif, ~70px. Pode ter `**bold**` em substantivo-chave ou `__italic__` em palavra-âncora.
- **Body:** 2 parágrafos, separados por `\n\n`. Total ~50-70 palavras.
  - Parágrafo 1: O QUE é o mecanismo + COMO ele funciona tecnicamente. Bold em conceito-chave (`**mapa**`, `**72 skills**`).
  - Parágrafo 2: A CONSEQUÊNCIA prática + número-âncora real do autor. Bold no número (`**7 subagentes simultâneos**`, `**TTL 5 min**`).

**Regra-ouro dos mecanismos:** cada slide encerra um ponto inteiro. Não termina em cliffhanger ("vou explicar no próximo"). Quem sair no slide 3 já aprendeu o mecanismo 2 inteiro.

#### Slide 7 — POR QUE ISSO FUNCIONA (princípio)
- `kind: "narrative"`, `withImage: true`
- **Imagem:** screenshot que ancora o princípio (ex: doc oficial mostrando o pricing model, paper acadêmico, dashboard de custo)
- **Eyebrow:** `Por que isso funciona`
- **Título:** o princípio universal em 1 frase, com palavra-âncora em `**bold**` ou `__italic__`. Ex: "LLM cobra por __leitura__, não só por geração."
- **Body:** 2 parágrafos. Parágrafo 1 explica o porquê. Parágrafo 2 amarra os 5 mecanismos sob esse princípio único.

#### Slide 8 — COMO COMEÇAR HOJE (aplicação)
- `kind: "scene"` (texto puro, sem imagem)
- **Eyebrow:** `Como começar hoje`
- **Título:** Instrument Serif grande, frase de ação em prazo curto. Ex: "Hoje à noite você faz a parte 1."
- **Body:** 2 parágrafos. Parágrafo 1 = a primeira ação concreta (mais simples dos 5 mecanismos). Parágrafo 2 = a pergunta-régua para iterar nos outros 4, com a frase-pergunta entre `__"..."__` (italic verde).

#### Slide 9 — A OFERTA (mechlist visual)
- `kind: "offer"`
- **Eyebrow:** `Se quiser pular a curva`
- **Título:** "É esse desenho que entrego como **[Marca]**." (Instrument Serif, com nome da marca em bold)
- **pastaList:** array com 5 pares `["Chave", "descrição curta"]` — um por mecanismo. As chaves viram chips lime no template.
- **pastaClosing:** uma frase em italic serif que define a tese final ("Marketing tratado como sistema operacional...").

#### Slide 10 — CTA
- `kind: "cta"`
- **Eyebrow:** `Curtiu?` (display italic, não mono)
- **Título:** "**curte e segue**" ou "**comenta [palavra]**" — em mega serif, lowercase, peso 700.
- **ctaCall:** italic verde explicando o motivo ("pra receber mais bastidor da operação.").

**Regra-ouro do MEC:** o carrossel é um pequeno ensaio operacional. Cada mecanismo é executável; cada screenshot prova que o autor opera assim de verdade. A oferta vem só depois que a credibilidade já foi construída pelos 5 mecanismos.

---

## ESTRUTURA 4C — Modo DESTILADO (10 slides, comentário editorial sobre insumo curado)

Padrão para destilar 1 insumo já curado por terceiro (vídeo, podcast, artigo, transcrição, livro) em comentário editorial sob lente MktOps. **Não narra cena. Não reconstroi biografia. Não busca nada fora do insumo.** Comenta.

#### Slide 1 — CAPA (arquétipo A9 ou A10)
Tipográfica pura, sem foto. Bloco caixa alta (A9) ou quote literal grande em italic verde (A10). Já detalhado no Passo 3.

#### Slide 2 — FONTE E ENQUADRAMENTO
- `kind: "scene"` (texto puro) — opcionalmente `withImage: true` se houver foto do autor do insumo (LinkedIn, press)
- **Eyebrow:** `A fonte` (ou `Quem falou, quando`)
- **Título:** posicionamento curto da fonte. Ex: "Andrew Wilkinson, fundador da Tiny."
- **Body:** 2-3 linhas posicionando o leitor — quem é (1 linha de credencial, **no máximo**), qual o veículo da fala (podcast, artigo, evento), data. **Sem biografia inflada.** "Fundador da Tiny" basta — não escrever "holding canadense com 30 empresas, board JPMorgan, ex-MetaLab, etc.". Se a credencial precisa de mais de 1 linha, o autor é desconhecido demais pro carrossel funcionar.

#### Slides 3-6 — OS 4 DESTAQUES (mesma anatomia)

Cada slide tem:
- `kind: "narrative"`, `withImage: false` (default tipográfico) — opcional `withImage: true` apenas no slide com âncora numérica forte
- **Eyebrow:** `Destaque N · [PalavraCurta]` (uppercase via CSS, em-dash verde antes)
- **Título:** a tese editorial do destaque em 1 frase imperativa ou declarativa. Instrument Serif, ~70px. `**bold**` em substantivo-chave ou `__italic__` em palavra-âncora.
- **Body:** 2 parágrafos, separados por `\n\n`. Total ~50-70 palavras.
  - **Parágrafo 1 — A âncora literal do insumo.** Quote entre aspas OU número específico citado por nome do autor. Sempre fato literal, nunca paráfrase. Ex: *"'We have a $40,000 a month Claude bill', disse Wilkinson."* OU: *"O CFO construiu o substituto em duas semanas, segundo Wilkinson."* Bold no número-âncora ou nome próprio.
  - **Parágrafo 2 — A leitura crítica.** O que essa âncora significa quando lida sob a lente MktOps. Ponte com a operação do leitor sem ainda propor solução. Bold em substantivo-tese.

**Regra-ouro dos destaques:** cada slide é um mini-ensaio crítico autosuficiente. **NÃO recapitule** o insumo. **NÃO reconstrua cena** ("imagine que ele acordou às 7h..."). Comente. Quem sair no slide 4 já levou os 2 destaques anteriores inteiros.

#### Slide 7 — O PRINCÍPIO QUE EMERGE
- `kind: "narrative"` ou template específico de princípio
- **Eyebrow:** `Princípio` (ou `O que isso revela`)
- **Título:** a tese MktOps que se cristaliza dos 4 destaques. **Uma frase**. `__italic__` na palavra-âncora.
- **Body:** 2 parágrafos. P1 explica o porquê do princípio. P2 amarra os 4 destaques sob ele.

#### Slide 8 — APLICAÇÃO NO ICP
- `kind: "scene"` (texto puro, sem imagem)
- **Eyebrow:** `O que muda pra você` (ou `Pro escritório que opera`)
- **Título:** Instrument Serif grande, frase de mudança operacional concreta. Ex: "A próxima auditoria do seu dia tem regra única."
- **Body:** 2 parágrafos. **Sem cena reconstituída**, sem "imagine que você acorda...". Direto na operação do ICP brasileiro de serviços profissionais. P1 = a mudança concreta. P2 = a régua de teste curta que o leitor aplica essa semana.

#### Slide 9 — A OFERTA
- `kind: "offer"`
- **Eyebrow:** `Se quiser pular a curva`
- **Título:** "É esse desenho que entrego como **MktOps**." (ou variação coerente com o argumento do carrossel)
- **Body / pastaList:** descrição operacional curta — o que MktOps entrega que aplica o princípio do carrossel. Sem pricing, sem urgência fabricada.

#### Slide 10 — CTA
- `kind: "cta"`
- Padrão minimalista: eyebrow display italic + título mega serif lowercase + ctaCall italic verde com palavra-tema do carrossel.

**Regra-ouro do DESTILADO:** o carrossel é **comentário editorial**, não resumo. Se o leitor sair querendo assistir/ler o insumo original, o post cumpriu a função. Se sair achando que já viu tudo, falhou — virou recapitulação.

**Proibições específicas do DESTILADO:**
- "Em [data], [pessoa] [ação]..." — isso é cena reconstituída de modo CASO. No DESTILADO, citar é diferente de narrar.
- Reconstruir cena com lugar, gestos, ações sequenciais ("ele acorda, abre o Telegram, lê...")
- Inflar biografia do autor do insumo: mais de 1 linha de credencial = inflação
- Buscar dados, casos ou personagem fora do insumo. **Zero conteúdo externo.**
- Inventar quote ou paráfrase como se fosse literal — todo trecho entre aspas precisa estar literalmente no insumo
- Slide-resumo do tipo "no vídeo, ele falou que..." — comentar é diferente de relatar

---

### Passo 4-MEC-img — Imagem que PROVA a tese (sub-passo do modo MEC)

Toda imagem em modo MEC tem que provar o slide onde aparece. Não é decoração; é evidência.

**Tipos de screenshot canônicos:**

| Tese do slide | Tipo de screenshot |
|---|---|
| "Crie um arquivo de contexto" | Print do próprio arquivo aberto no editor (terminal, VS Code, Cursor) |
| "Quebre em N módulos" | Print do file explorer mostrando a estrutura de pastas/módulos |
| "Use o recurso X da plataforma" | Print da doc oficial da plataforma (Anthropic, Google, Meta) na seção exata |
| "Delegue para Y" | Print do CLI/dashboard executando Y (ex: `Spawn 7 agents in parallel:`) |
| "Construa um pipeline" | Print do código + terminal mostrando a execução |
| "Princípio econômico/técnico" | Print da tabela de pricing oficial, paper, gráfico de custo |

**O que NÃO é screenshot válido:**
- Stock photo (mesa de trabalho, laptop genérico, mãos no teclado)
- Mockup ilustrativo desenhado
- Captura de Twitter/LinkedIn como prova (a menos que seja do autor mostrando o próprio resultado)
- Logo de empresa solto sem contexto

**Mínimo:** 5 dos 7 slides com imagem em MEC têm que ter screenshot real (capa pode ser tipográfica, slide 8 é text-only). Se não tiver screenshot pra um mecanismo, repensar o mecanismo.

---

### Passo 5 — Escrever a legenda do post

Estrutura fixa em 4 parágrafos:

1. **Parágrafo 1:** recapitula a cena/personagem em 2-3 frases. Adiciona detalhes que NÃO entraram no carrossel.
2. **Parágrafo 2:** aprofunda o número-âncora ou o detalhe que importa.
3. **Parágrafo 3:** reapresenta o princípio + a aplicação em linguagem direta. É o miolo.
4. **Parágrafo 4:** fecha com a oferta + CTA com palavra-tema.

A legenda **não recapitula** o carrossel slide a slide. Adiciona contexto ou opinião extra.

### Passo 6 — Validar contra os filtros do cliente

Antes de entregar, conferir contra o `brand-context.md` ou `CLAUDE.md` do cliente:

- Carrega bandeira do cliente? (Ex: Plugue = "pague só depois de aprovar"; MktOps = "doc viva + ferramentas + time")
- Sem clichês de mercado proibidos pelo cliente?
- Sem pricing, nome de cliente, nome de sócio (se a regra do cliente for essa)?
- Tom da voz da marca está calibrado?

### Passo 7 — Aplicar copywriting-guardrails

Revisão final antes de entregar. Eliminar:

- **Antítese vazia** ("não é X, é Y" sem substância concreta)
- **Paradiastole** (renomear vício como virtude)
- **Climax degenerado** ("Não é A. Não é B. Não é C." como escalada vazia)
- **Bomphiologia** (linguagem inflada, "imprimir dinheiro", "destruir", "revolucionar")
- **Sententia falsa** (frase de efeito sem substância — "Tudo o resto é teatro" só vale se tiver substância concreta)

Se algum slide falhar, reescrever antes de entregar.

---

## REGRAS DE LINGUAGEM E TOM

### Voz padrão (calibrada pelo brand-context)
- **PT-BR coloquial executivo**. Direto, sem floreio, sem termo academiquês.
- **Pode usar 2ª pessoa** ("você", "sua operação", "seu time") — diferente de `carousel-writer`. A 2ª pessoa puxa a aplicação no Ato 3 (CASO) ou na capa A7 (MEC).
- **Frases curtas.** Cada frase = 1 respiração.
- **Cada slide carrega UMA tese, em DOIS parágrafos.** Não é uma frase por slide. É um mini-ensaio: parágrafo 1 estabelece a tese, parágrafo 2 ancora com número/consequência. Total ~50-70 palavras de body por slide.
- **Coloquialismos calibrados:** "tá", "pô", "cara", "fera" — uso parcimonioso, na legenda mais que nos slides.

### Densidade editorial (regra do c-10)

Cada body de slide segue este padrão:

```
[Frase de tese, sujeito + verbo + objeto direto, com **palavra-chave técnica** em bold.]
[Frase de mecanismo — como funciona — com termo técnico em **bold**.]

[Frase de consequência prática.]
[Frase de número-âncora do autor com **número em bold**.]
```

Exemplo do c-10, slide 5:
> Pesquisa de concorrente, auditoria SEO, transcrição longa — não rode na sessão principal. Dispare em janela de contexto própria.
>
> Numa auditoria SEO completa disparo **7 subagentes simultâneos** lendo 500 páginas. Voltam 7 sumários, não 500 HTMLs.

### Formatação dentro do body — bold e italic

Os dois marcadores têm função distinta no template:

- **`**palavra**`** → Bold preto (peso 600). Usar em: substantivo técnico (`**mapa**`, `**skills**`, `**pipelines**`), número-âncora (`**72 skills**`, `**5 min**`, `**$8k em 1 semana**`), nome próprio quando relevante.
- **`__palavra__` ou `__"frase"__`** → Italic verde-deep. Usar em: palavra-âncora retórica que carrega a tese ("custo", "leitura", "mapa"), frase-pergunta interna que o leitor deve fazer pra si (`__"isso devia estar num arquivo cacheado?"__`), citação curta.

**Regra:** todo slide-body tem pelo menos 1 bold. Slide-chave (princípio, oferta, capa) tem pelo menos 1 italic-âncora.

### Proibições absolutas em qualquer carrossel
- "Saiba mais", "descubra", "entenda por que"
- "Transforme seu negócio", "leve sua empresa pro próximo nível"
- "3x mais leads", "24/7", "robô que vende" (clichês de mercado)
- "Quando X vira Y", "a ascensão de", "o impacto de"
- Inventar fatos, números, datas ou fontes — TUDO precisa ser verificável
- Acusação direta a pessoa ou empresa nominal — crítica permitida só a incentivos, mecânicas, lógica de mercado

### Nomes de fonte sempre citados
Cada número aparece com fonte. Formato: "Fonte: [Instituição], [Ano]" ou "[Instituição], [tipo de estudo], [ano]".

---

## FORMATO DE SAÍDA

### Documento único entregue ao cliente

Salvar em `clientes/<nome-do-cliente>/conteudo/<nome-arquivo>.md` (ou local que o usuário pedir).

```markdown
# [Título descritivo do pacote]

**Data:** [DD/MM/AAAA]
**Conteúdo:** N carrosséis seguindo o método "Narrativa → Princípio → Aplicação → Oferta".
**Fonte do insumo:** [URL/arquivo/tema]
**Público-alvo:** [perfil]
**Posicionamento do cliente:** [bandeira central + diferencial]

**Seleção das narrativas:**
- Carrossel #1: [personagem/cena] — [tese]
- Carrossel #2: [personagem/cena] — [tese]
- ...

**Filtros aplicados:**
- ✅ Cada história engaja se o leitor nunca contratar
- ✅ Proporção 4 atos: ~30% / ~25% / ~30% / ~15%
- ✅ Sem clichês do mercado do cliente
- ✅ Copywriting-guardrails: zero antítese vazia, paradiastole, climax degenerado, bomphiologia, sententia falsa
- ✅ Cada número com fonte explícita
- ✅ Bandeira do cliente carregada nos slides 11-12

---

# CARROSSEL #1 — [Título do carrossel]

**Cluster de dados:** [tema do cluster]
**Total de slides:** 12

## Slide 1 — CAPA

> **[CAPA EM CAIXA ALTA, 4-6 LINHAS]**

> → [Linha de gancho com seta]

## Slide 2 — Ato 1: a cena
[texto do slide]

## Slide 3 — Ato 1: o detalhe
[texto]

## Slide 4 — Ato 1: o número-âncora
[texto]

## Slide 5 — Ato 2: a leitura preguiçosa
[texto seguindo padrão "A leitura fácil é... Errada/Rasa."]

## Slide 6 — Ato 2: o segundo dado
[texto]

## Slide 7 — Ato 2: o princípio universal
[texto — uma frase forte que cabe solta]

## Slide 8 — Ato 3: a cena no mundo do leitor
[texto]

## Slide 9 — Ato 3: o erro de classificação
[texto]

## Slide 10 — Ato 3: o teste prático ou janela curta
[texto]

## Slide 11 — Ato 4: a oferta
[texto sóbrio, sem pressão, com bandeira do cliente]

## Slide 12 — CTA

> **Se essa história ressoou com [contexto]:**
>
> comenta **[PALAVRA-TEMA]** ou chama no direct.
>
> [Frase de fechamento curta]

## Caption do Instagram

> [Parágrafo 1: cena/personagem]
>
> [Parágrafo 2: número/detalhe que aprofunda]
>
> [Parágrafo 3: princípio + aplicação]
>
> [Parágrafo 4: oferta + CTA]

---

[CARROSSEL #2 ... CARROSSEL #N seguindo a mesma estrutura]

---

## Cadência sugerida

| Dia | Carrossel | Cluster |
|---|---|---|
| ... | ... | ... |

## Notas de produção (não vai pro feed)

- [Observações de produção, palavras-chave dos CTAs, sequência sugerida]
- Revisão aplicada: copywriting-guardrails — sem antítese vazia, paradiastole, climax degenerado, bomphiologia, sententia falsa.
```

---

## INTEGRAÇÃO COM OUTRAS SKILLS

| Skill | Quando usar em conjunto |
|---|---|
| `copywriting-guardrails` | **OBRIGATÓRIO** — revisão final |
| `content-research-briefing` | Antes, quando o insumo é tema bruto sem dados |
| `mktops-content-engine` | Quando for ciclo recorrente de carrosséis (semanal/mensal) — esta skill é o motor de redação dentro do engine |

---

## PRODUÇÃO VISUAL — pipeline obrigatório quando o usuário pede a arte

Quando o usuário pedir "gera a arte", "renderiza", "faz o carrossel" ou equivalente, a copy desta skill é o input. A produção visual segue o pipeline canônico documentado em `automacao/paper-designs/README.md`:

1. **Scaffold** — `cd automacao/paper-designs && ./novo-carrossel.sh carrossel-N-slug`
2. **Coletar imagens reais (CASO, MEC ou DESTILADO):**
   - **CASO:** foto real do personagem/empresa (site oficial, LinkedIn, press). Nunca stock.
   - **MEC:** screenshot real que prova a tese de cada mecanismo (terminal, doc oficial Anthropic/Google/Meta, file explorer mostrando estrutura, código). Nunca mockup ilustrativo.
   - **DESTILADO:** opcional. Default é tipográfico puro. Se usar imagem, só no slide 2 (foto do autor do insumo) ou em 1-2 slides de destaque com número-âncora forte. Nunca foto na capa.
   - **Mínimo:** CASO = 4 slides com imagem; MEC = 5 slides com screenshot; DESTILADO = 0 slides com imagem (tipográfico puro é válido).
3. **Processar imagens** — editar `processa-imagens.js` listando arquivos brutos → outputs `-final.jpg`. Rodar `node processa-imagens.js`.
4. **Escrever `slides.json`** — mapear os slides para os `kind` do template:
   - **CASO (12 slides):** cover (1) → narrative com imagem (2,4,6) → scene (3,9,10) → rebuttal (5) → principle (7) → scenelist (8) → offer (11) → cta (12).
   - **MEC (10 slides):** cover tipográfica (1) → narrative com imagem (2-7) → scene (8) → offer com pastaList de 5 chaves (9) → cta minimalista (10).
   - **DESTILADO (10 slides):** cover tipográfica A9 ou A10 (1) → scene fonte com foto opcional do autor (2) → narrative tipográfico (3-6, eyebrow `"Destaque N · Nome"`) → narrative ou principle (7) → scene aplicação text-only (8) → offer (9) → cta minimalista (10).
   - Em MEC, todo slide-mecanismo (2-6) tem `withImage: true`, eyebrow `"Mecanismo N · Nome"`, title imperativo, body com `\n\n` separando 2 parágrafos.
   - Em DESTILADO, slides 3-6 são tipográficos por default (`withImage: false`); imagem só se houver número-âncora forte que mereça destaque visual. Capa nunca tem foto.
5. **Renderizar** — `node gerar.js` → PNGs 1080×1350 em `out/`.
6. **Salvar markdown canônico** — em `clientes/<cliente>/conteudo/carrossel-<tema>.md` com copy, legenda e paths dos PNGs.

**Paleta default MktOps — Brand Book v2.0** (canônica desde 11/05/2026): Paper `#F3EEE6` (fundo) + Soft `#ECE6DB` (cards) + Ink `#15321B` (texto/glifo) + Accent `#A8E87A` (destaque), com auxiliares `accent-text #3D6B27` (texto destaque sobre Paper) e `accent-dark #88C45E`. **Tipografia: DM Sans em tudo** — display 500 (cover/title), body 400, label 500 uppercase tracking 0.14em. **Sem Instrument Serif, sem Geist, sem Geist Mono, sem branco/preto puros.** Itálico foi abolido — markdown `__palavra__` renderiza como texto colorido em `accent-text`, peso 500, **sem `font-style: italic`**. Glifo: 32×32 com recorte 2×2 (`clip-path: polygon(0 0,100% 0,100% 60%,60% 60%,60% 100%,0 100%)`). Source of truth: `automacao/remotion-reels/_assets/refs/mktops-brand-v2/SOURCE-OF-TRUTH.md`. **Quando a SKILL menciona "Instrument Serif" ou "italic verde" em descrições antigas dos kinds, ler como "DM Sans 500 em tamanho display" e "texto em accent-text colorido sem itálico".**

**Não pular a aprovação:** mostrar a copy estruturada no chat e aguardar OK do usuário antes de gerar a arte. A arte custa tempo de render — não desperdiçar com copy não aprovada.

**Referência canônica (06/05/2026 em diante):** `carrossel-10-claude-token-economy` é a régua atual para modo MEC. Quando em dúvida sobre densidade, anatomia de slide ou tipo de screenshot, abrir o `slides.json` desse carrossel e modelar.

---

## CHECKLIST DE VALIDAÇÃO INTERNA (antes de entregar)

### Comum aos dois modos
- [ ] Modo declarado no início (CASO ou MEC) e estrutura coerente com a escolha
- [ ] Cada body tem 2 parágrafos, ~50-70 palavras, com pelo menos 1 `**bold**`
- [ ] Slide-chave (capa, princípio, oferta) tem pelo menos 1 `__italic__` em palavra-âncora
- [ ] Cada legenda tem 4 parágrafos no padrão
- [ ] Bandeira do cliente carregada nos slides finais
- [ ] Zero antítese vazia, paradiastole, climax degenerado, bomphiologia, sententia falsa
- [ ] Toda fonte citada é real e verificável
- [ ] Cada número tem fonte explícita

### Modo CASO (12 slides)
- [ ] Cada Ato 1 tem personagem real, data, lugar, nome verificável
- [ ] Cada Ato 1 NÃO menciona o cliente da agência
- [ ] Cada Ato 2 começa com "A leitura fácil é... Errada/Rasa." ou variação válida
- [ ] Cada Ato 2 termina com princípio universal em uma frase
- [ ] Cada Ato 3 toca a dor sem propor solução comercial ainda
- [ ] Cada Ato 4 entra a oferta como consequência, sem pressão
- [ ] Cada Slide 12 tem palavra-tema específica do carrossel (não genérica)
- [ ] Sem 2ª pessoa na capa (slide 1) — pode usar nos slides 8-12

### Modo MEC (10 slides)
- [ ] Capa em arquétipo A7 ou A8 (dor-2ª-pessoa + promessa numerada, ou tese-bandeira)
- [ ] Capa termina com gancho italic verde com seta `→`
- [ ] Slides 2-6 são 5 mecanismos com a mesma anatomia (eyebrow `Mecanismo N · Nome` + título imperativo + body 2-parágrafos)
- [ ] Pelo menos 5 dos 7 slides interiores têm screenshot real (não stock, não mockup)
- [ ] Cada screenshot prova literalmente a tese do slide onde aparece
- [ ] Slide 7 amarra os 5 mecanismos sob 1 princípio econômico/técnico
- [ ] Slide 8 (aplicação) tem ação concreta executável hoje + pergunta-régua em italic verde
- [ ] Slide 9 (oferta) usa `kind: "offer"` com pastaList de 5 chaves (uma por mecanismo)
- [ ] Slide 10 (CTA) é minimalista — eyebrow display italic + título mega serif + ctaCall italic verde

### Modo DESTILADO (10 slides)
- [ ] Capa em arquétipo A9 (manchete-tese editorial) ou A10 (quote-âncora literal)
- [ ] Capa é tipográfica pura — sem foto
- [ ] Slide 2 (fonte) tem **no máximo 1 linha** de credencial do autor do insumo
- [ ] Cada destaque (slides 3-6) tem **âncora literal verificável** no insumo (quote entre aspas OU número citado por nome)
- [ ] **Zero conteúdo externo ao insumo** — nenhum dado, caso, número ou personagem buscado fora
- [ ] Cada destaque comenta criticamente sob lente MktOps — não recapitula o insumo
- [ ] Nenhum slide reconstroi cena do autor ("ele acorda às 7h, abre o Telegram...") — isso é modo CASO
- [ ] Slide 7 (princípio) é UMA frase que cabe num post solto
- [ ] Slide 8 (aplicação) não reconstroi cena no leitor — vai direto pra mudança operacional
- [ ] Slide 9 (oferta) é sóbrio, sem pressão, sem pricing
- [ ] Slide 10 (CTA) tem palavra-tema específica do carrossel (não genérica)
- [ ] Sem 2ª pessoa na capa (slide 1) — pode usar nos slides 8-10
- [ ] Toda paráfrase do autor está fora de aspas; tudo entre aspas é literal verificável

## MANDAMENTO FINAL

Resolver internamente qualquer dúvida de execução. Mostrar apenas o documento final, salvo no caminho do cliente, sem expor processo. Quando o usuário pedir N carrosséis a partir de um insumo, a entrega é UM arquivo .md com todos os N carrosséis no padrão acima — não N arquivos separados.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
