---
name: molina-reel-script
description: Escreve roteiro de reel no estilo @afonsomolina — talking-head 30-80s, headline branco no topo + corpo falado direto + CTA-padrão de DM. Skill escolhe automaticamente o melhor arquétipo (afirmação polêmica, hábito prescritivo, print de DM, tutorial tático, dado real ou desabafo) com base no insumo. Modelada da análise de 15 reels dele em maio/2026 (clientes/Hélio Costa Jr./MktOps/refs/afonsomolina/analise-reels-afonsomolina.md). Acionar quando o usuário pedir "roteiro de reel", "roteiro estilo Molina", "roteiro estilo Afonso", "reel de talking-head", "reel curto pro Instagram", "transformar texto em reel", ou passar um insumo (artigo, dado, princípio, DM, observação) e pedir reel a partir dele. Diferente de `vsl-writer` (estrutura de venda longa) e `ads-video-scripts` (formato de ad pago). Entrega APENAS o texto do roteiro — sem briefings de produção, sem explicação da escolha, sem comentários. Usar SEMPRE em conjunto com `copywriting-guardrails` na revisão final.
---

# Molina Reel Script — roteiros talking-head em 6 arquétipos

## IDENTIDADE

Esta skill produz roteiros de reel modelados a partir do sistema de @afonsomolina (1,8M seg.) cristalizado na análise de 15 reels: `clientes/Hélio Costa Jr./MktOps/refs/afonsomolina/analise-reels-afonsomolina.md`.

A tese: **um talking-head pobre em produção + uma headline autossuficiente + um corpo falado direto + um CTA-padrão de DM** vence reel elaborado quando o objetivo é aquisição direta. A skill escala isso pra Studio Artemis, MktOps e marca pessoal do Hélio.

## REGRA-MÃE (não negociável)

> **Entrega apenas o texto do roteiro.**
> Sem briefings de produção. Sem comentários sobre a escolha do arquétipo. Sem "duração estimada", "sugestão de corte", "tom recomendado", "público-alvo". Texto pronto pra ler na câmera. Pronto.

Se o usuário pedir explicação, ele pergunta no chat. O artefato que sai da skill é só o roteiro.

---

## QUANDO USAR vs outras skills

| Caso | Skill |
|---|---|
| Reel talking-head 30-80s, estilo direto, com CTA de DM | **molina-reel-script** |
| VSL com estrutura de venda (ad-VSL 60-90s, sales VSL 15-25min) | `vsl-writer` |
| Roteiro de video ad com hook+story+offer pra Reels Stories Meta Ads | `ads-video-scripts` |
| Roteiro de aula longa (15-30min) | `aula-script-writer` |
| Roteiro de YouTube long-form (8-20min) | `youtube-content` |

Se o usuário disser "reel" + "estilo Molina/Afonso" / "talking-head" / "headline forte" / "30-60 segundos" / "DM no final" — é esta skill.

---

## INPUTS NECESSÁRIOS

1. **Insumo** — UM dos seguintes:
   - Tema/tese ("quero um reel sobre IA não substituir estrategista")
   - Dado / número / curva ("MRR Artemis cresceu 40% em 3 meses")
   - Princípio / observação ("notei que clientes que pagam adiantado nunca cancelam")
   - DM / email / comentário real ("um lead me mandou: 'IA é overhype, prefiro contratar gente'")
   - Processo / fórmula ("o pipeline molina-style produz reel em 4 passos")
   - Frustração relacional ("já cansei de cliente que pede orçamento e some")
2. **Voz/cliente** (opcional) — default = Hélio. Se for cliente Artemis, ler `clientes/<nome>/CLAUDE.md` antes.
3. **Quantidade** — N roteiros (default 1).
4. **Oferta** (opcional) — se o usuário quiser oferta no fim, qual keyword (ANÁLISE, MENTORIA, MKTOPS, ARTEMIS, etc.). Se omitido, **default = sem oferta**.

Se algum input crítico faltar, inferir do contexto. Não perguntar.

---

## ESCOLHA AUTOMÁTICA DO ARQUÉTIPO

A skill **lê o insumo e escolhe sozinha** o melhor de 6 arquétipos (descarta parábola religiosa — não cabe ao Hélio nem a clientes B2B). Algoritmo de decisão:

| Sinais no insumo | Arquétipo escolhido |
|---|---|
| Texto contém número específico, curva, gráfico, dashboard, métrica concreta | **DADO REAL** |
| Insumo é mensagem/DM/email/comentário/print de alguém real | **PRINT DE DM** |
| Insumo é processo, pipeline, fórmula, formato com passos definidos | **TUTORIAL TÁTICO** |
| Insumo é mudança de hábito, ritual, rotina, ação repetida | **HÁBITO PRESCRITIVO** |
| Insumo é princípio que contradiz senso comum, observação contraintuitiva, requalificação semântica | **AFIRMAÇÃO POLÊMICA** |
| Insumo é frustração relacional, irritação, padrão social que o usuário odeia | **DESABAFO** |

Se o insumo encaixar em mais de um, prefira nesta ordem: **DADO REAL > PRINT DE DM > AFIRMAÇÃO POLÊMICA > TUTORIAL TÁTICO > HÁBITO PRESCRITIVO > DESABAFO**. Dado real vence porque vulnerabilidade quantificada gera mais credibilidade. Desabafo é último porque humaniza mas não converte.

A skill **não anuncia** qual arquétipo escolheu. O roteiro sai pronto. O Hélio reconhece o formato pela estrutura.

---

## ANATOMIA DO ROTEIRO (estrutura comum)

Todo roteiro tem 4 blocos, na ordem:

```
[HEADLINE]                  primeira frase — autossuficiente, vira texto branco no topo do vídeo
[CORPO]                     desenvolvimento de 30-60s — cena, exemplo, princípio, em parágrafos curtos
[FECHO / PRINCÍPIO]         última afirmação que sintetiza a ideia
[CTA]                       opcional, só se houver oferta — frase de DM padrão
```

**Duração-alvo do corpo falado:** 150 palavras/min (ritmo dele). Reel de 60s ≈ 150 palavras totais. Reel de 30s ≈ 75 palavras.

---

## OS 6 ARQUÉTIPOS DE ROTEIRO

### Arquétipo 1 — AFIRMAÇÃO POLÊMICA

**Estrutura:**
```
[HEADLINE — afirmação que contradiz senso comum]

Cara, {{confissão / observação}}.

{{Sintoma comum entre criadores/empreendedores que reforça a tese}}.

{{Confissão quantitativa pessoal — número específico}}.

{{Princípio universal sintético — uma frase}}.

{{[CTA opcional]}}
```

**Quando a skill escolhe:** insumo é princípio contraintuitivo, requalificação ("seja chato", "seja repetitivo"), reframe de algo percebido como negativo.

**Exemplo modelado pra Hélio:**

> Não usei estagiário em 2025. Usei Claude Code.
>
> Cara, todo mundo que conheci esse ano tava contratando ou demitindo. Eu fiz nem uma coisa nem outra.
>
> Sabe quando você passa duas horas escrevendo briefing pra alguém que vai voltar com o trabalho meio pronto? É exatamente isso que a IA faz, só que sem a parte do "meio".
>
> A operação da Artemis girou cerca de 15 milhões em receita esse ano. Quatro sócios. Zero estagiário. Tudo rodou no Claude Code como infraestrutura.
>
> IA não substitui estrategista. Mas estrategista com IA substitui equipe.

---

### Arquétipo 2 — HÁBITO PRESCRITIVO

**Estrutura:**
```
[HEADLINE — "Pega o hábito de [DIA/HORÁRIO] [AÇÃO]" ou "Faz isso [QUANDO]"]

Cara, {{instrução específica passo a passo, com calendário}}.

{{Detalhe operacional pequeno — quanto tempo leva, com que ferramenta}}.

{{Resultado previsto — o que vai acontecer se você fizer}}.

{{Razão por trás do efeito}}.

{{[CTA opcional]}}
```

**Quando a skill escolhe:** insumo é ação repetida, ritual, rotina, mudança comportamental concreta.

**Exemplo modelado pra Hélio:**

> Toda segunda às sete da manhã, abre o Search Console.
>
> Cara, antes de checar Slack, antes de abrir Notion, antes de qualquer coisa: Search Console aberto.
>
> Filtra as últimas 4 semanas e olha as 10 queries que mais perderam CTR. Leva uns 3 minutos.
>
> Você vai ver coisa que nenhum dashboard de agência te mostra. Página que tava convertendo em janeiro e morreu em março, sem ninguém perceber.
>
> Quem trata SEO como projeto perde. Quem trata como turno de manhã ganha.

---

### Arquétipo 3 — PRINT DE DM / COMENTÁRIO POLÊMICO

**Estrutura:**
```
[HEADLINE — reação curta ao print, tipo "Que doideira" / "Olha isso" / "Doido né"]

[Indicar entre colchetes que o reel abre com print da mensagem real]

Aí ele/ela me mandou assim: "{{citação literal da DM/comentário}}".

Eu respondi {{resposta dele dada / cena}}.

{{Tipificação do remetente — categoria de pessoa / mentalidade}}.

{{Conclusão / princípio / oferta}}.
```

**Quando a skill escolhe:** insumo é DM real, email real, comentário público, mensagem privada, qualquer texto de terceiro com aspas. O reel abre com print + reação.

**Exemplo modelado pra Hélio:**

> Olha o que me mandaram.
>
> [print da DM]
>
> Aí o cara me manda assim: "IA é overhype. Prefiro contratar gente que pensa." E me cobrou pra debater.
>
> Cara, a pergunta nunca foi IA ou humano. Foi humano com IA, contra humano sem.
>
> O tipo de pessoa que entra nessa discussão tratando como ideologia é o mesmo que vai estar contratando os colegas que aprenderam a usar daqui a três anos.
>
> Não tenha medo da ferramenta. Tenha medo do colega que aprendeu antes de você.

---

### Arquétipo 4 — TUTORIAL TÁTICO COM FORMATO LITERAL

**Estrutura:**
```
[HEADLINE — "Tem um [FORMATO] ridículo que tá funcionando demais" ou "Se [SINTOMA], o erro está nisso"]

Cara, {{descrição do problema / oportunidade}}.

{{Diagnóstico — o que causa, em 1 frase}}.

{{Exemplo literal — caso concreto, contraexemplo, fórmula passo a passo}}.

{{O que fazer — a fórmula em 1-3 imperativos}}.

{{[CTA opcional, frequentemente "testa e me fala"]}}
```

**Quando a skill escolhe:** insumo é processo, pipeline, fórmula com passos, formato copiável, diagnóstico operacional.

**Exemplo modelado pra Hélio:**

> Tem um pipeline ridículo de criar carrossel que tá funcionando demais.
>
> Cara, a maioria abre o Canva, escolhe template, escreve direto. O pipeline morre porque a copy nasce dentro do design.
>
> Inverte. Primeiro escreve a copy de 12 slides em markdown puro, sem cor, sem fonte, sem nada. Só texto. Depois passa por uma camada que checa se você não escorregou em frase de IA. Só aí gera a arte.
>
> Texto primeiro. Forma depois. Quando inverte essa ordem, você passa duas horas mexendo em fonte e o post sai vazio.
>
> Testa e me fala.

---

### Arquétipo 5 — DADO REAL / SCREENSHOT

**Estrutura:**
```
[HEADLINE — "É aqui que [GRUPO] [AÇÃO]" ou "Olha o que acontece quando [DADO]"]

[Indicar entre colchetes que o reel abre com screenshot/gráfico/dashboard]

Cara, {{descrição do dado mostrado — pico, vale, número específico}}.

{{Reframe — o que esse dado revela de princípio universal}}.

{{Aplicação — o que fazer quando o leitor estiver no vale}}.

{{[CTA opcional]}}
```

**Quando a skill escolhe:** insumo contém número específico, curva, gráfico, dashboard, métrica.

**Exemplo modelado pra Hélio:**

> É aqui que a maioria das agências fecha as portas.
>
> [screenshot de gráfico de receita]
>
> Em janeiro a Artemis faturou 1.2 milhão. Em março, oitocentos mil. Em maio, voltamos pra 1.4.
>
> Não existe receita linear. Quem opera achando que mês ruim é falha esquece que o normal é a oscilação.
>
> Quando o mês cair, não corta time. Não muda posicionamento. Acelera o que já estava funcionando — mais conteúdo, mais retomada de cliente antigo, mais oferta na lista que já existe.
>
> Vale do gráfico não é problema. É calendário.

---

### Arquétipo 6 — DESABAFO / RANT PESSOAL

**Estrutura:**
```
[HEADLINE — "Eu tenho ranço de [X]" ou "Já cansei de [Y]"]

Cara, {{descrição da irritação geral}}.

{{Item 1 — exemplo específico + reação}}.

{{Item 2 — exemplo específico + reação}}.

{{Validação social — "não sei se é só eu"}}.
```

**Quando a skill escolhe:** insumo é frustração relacional, padrão social irritante, observação humana sem objetivo educacional.

**Sem CTA por padrão neste arquétipo.** Função é humanizar, não converter.

**Exemplo modelado pra Hélio:**

> Tem dois tipos de email de cliente que eu já cansei de receber.
>
> Cara, primeiro tipo: "preciso falar urgente com você, me liga." Sem assunto. Cara, não vou ligar. Manda no texto, manda no áudio do WhatsApp, mas não me convoca pra ligação sem agenda.
>
> Segundo tipo: "vi um print no Instagram que faz isso, dá pra fazer pra mim?" Aí manda print da concorrência rodando algo que demorou três anos pra construir. Não dá pra fazer pra você. Dá pra construir pra você. Em três anos.
>
> Não sei se é só eu que tô ficando intolerante com email assim, mas tô.

---

## CTA-PADRÃO

Quando há oferta, fechar com **uma das três variantes**, calibradas pra Hélio (sem "te agradeço" servil que destoa do tom):

**Variante 1 — DM por keyword (default):**
> "Pegou a sacada? Dá dois toques aí. Quiser **{{O QUÊ}}**, digita **{{KEYWORD}}** nos comentários e te chamo no direct."

**Variante 2 — link na bio (pra ofertas pagas):**
> "Pegou a sacada? Se quiser **{{O QUÊ}}**, link tá na minha bio."

**Variante 3 — convite passivo (pra reels de autoridade alta):**
> "Pegou a sacada? Dá dois toques aí. Tem mais coisa nessa linha — me segue se quiser receber."

**Keywords padrão pro Hélio:**
- `MKTOPS` → conteúdo MktOps / Sala de Operações
- `ARTEMIS` → serviços da agência
- `ROTA` → conteúdo educacional / aula
- `IA` → conteúdo sobre IA aplicada / Notas de IA
- `SUBSTACK` → assinatura do Território Humano

---

## VOZ E ESTILO

- **Voz:** direta, imperativa, sem hedge. Sem "talvez", "pode ser", "é importante notar".
- **Maneirismos orais permitidos** (calibrados pra soar oral, não escrito):
  - "Cara" — vocativo, 1-3× por reel, no início de blocos
  - "Tá?" — confirmação pós-frase, usar com parcimônia (1-2× por reel)
  - "Né?" — variação do "tá?", em pergunta retórica
  - "Pegou a sacada?" — exclusivamente no CTA
- **Densidade:** ~150 palavras/minuto. 60s = ~150 palavras. 30s = ~75 palavras. Não passar de 200.
- **Frases curtas.** Raramente subordinadas. Pontuação seca.
- **Religiosidade descartada.** Hélio não usa. Substituir referencial bíblico por:
  - Casos históricos
  - Filósofos (Aristóteles, Tomás de Aquino, Marías — quando couber)
  - Padrões observados em clientes ("vi com a Plugue, vi com a Do, vi com a ORA")
- **Sem clichês de IA:** aplicar `copywriting-guardrails` como gate final — eliminar antítese vazia, paradiastole, climax degenerado, bomphiologia, sententia falsa.

---

## PROCESSO DE EXECUÇÃO

1. Ler o insumo até o fim. Identificar âncoras concretas (números, nomes, citações, casos).
2. Escolher arquétipo via algoritmo de decisão (sem anunciar).
3. Escrever o roteiro preenchendo a estrutura do arquétipo.
4. Calibrar duração — contar palavras, ajustar pra 75-150 (30-60s) ou até 200 (até 80s).
5. **Aplicar `copywriting-guardrails`** internamente — varrer o texto eliminando vícios de IA.
6. Entregar **somente o roteiro** no formato de saída abaixo.

---

## FORMATO DE SAÍDA (rigoroso)

Quando esta skill é invocada, a resposta no chat deve ter **exatamente** esta estrutura:

```
## Reel {{N — só se houver mais de 1}}

**[HEADLINE]** {{frase autossuficiente, peso de capa de carrossel}}

{{Corpo do roteiro em parágrafos curtos, como ele falaria. Use [print da DM] / [screenshot de gráfico] / [foto do despertador] entre colchetes apenas quando o arquétipo exigir overlay visual específico.}}

{{Última frase = princípio sintético}}

{{[CTA — só se o usuário pediu oferta]}}
```

**Proibido no output final:**
- Qualquer indicação do arquétipo escolhido
- Seção "duração estimada", "tom recomendado", "público-alvo"
- "Headline visual:" / "Texto on-screen:" como rótulos separados — o headline já é a primeira linha, com `[HEADLINE]` como tag única
- Comentários sobre o porquê da escolha
- Sugestões de produção (figurino, locação, edição, música)
- "Notas de produção" no fim

Se o usuário pedir explicação, a skill responde no chat — fora do artefato.

Quando há mais de 1 reel pedido, separar com `---` entre eles.

---

## EXEMPLO DE EXECUÇÃO COMPLETA

**Input do usuário:**
> "Faz um reel sobre essa observação que fiz: 'Cliente que paga adiantado nunca cancela'. Coloca CTA pra MKTOPS."

**Output esperado da skill:**

```
## Reel

**[HEADLINE]** Cliente que paga adiantado nunca cancela.

Cara, eu já tive uns 200 clientes na Artemis. Dá pra contar nos dedos quem cancelou contrato anual pago à vista.

Sabe por quê? Não é cláusula. Não é vínculo legal. É que quem aceita pagar 12 meses de uma vez já fez o cálculo. Já entendeu o que tá comprando. Não precisa testar.

Quem pede mensal, quem pede trimestral com desconto, quem quer "começar pequeno pra ver se vale" — esse é o que cancela no terceiro mês ruim.

Cobre adiantado. Não pra travar o cliente. Pra filtrar quem você quer atender.

Pegou a sacada? Dá dois toques aí. Quiser ver como a Sala de Operações roda esse modelo, digita MKTOPS nos comentários e te chamo no direct.
```

Sem nada antes. Sem nada depois. Pronto pra ler na câmera.

---

## REFERÊNCIA-FONTE

Análise estrutural completa: `clientes/Hélio Costa Jr./MktOps/refs/afonsomolina/analise-reels-afonsomolina.md`

15 reels tabulados com transcrição segmentada por tempo, arquétipo, formato visual e oferta. Sempre que houver dúvida sobre um caso, consultar essa análise.

Companion skill: `molina-style` (carrosséis no mesmo sistema visual P&B).
