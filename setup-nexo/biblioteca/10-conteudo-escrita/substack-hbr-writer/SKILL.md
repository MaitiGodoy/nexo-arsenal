---
name: substack-hbr-writer
description: >
  Escreve artigos completos para o Substack "Território Humano" no estilo editorial da Harvard Business Review — analítico, descritivo, orientado a fatos, voltado para líderes sênior e empreendedores. Acionar sempre que Hélio mencionar "artigo para o Substack", "escrever para o Território Humano", "artigo no estilo HBR", "quero publicar um artigo", "escreve um artigo sobre", "newsletter", "artigo para email", "pauta para o Substack" ou quando der um tema e pedir análise em formato de publicação. Usar também quando o usuário trouxer um fato, tendência ou fenômeno de negócios e quiser transformar em conteúdo editorial. Ao ser acionado, escrever o artigo diretamente — sem perguntas, sem etapas intermediárias — e sempre incluir recomendações de imagens ao final.
---

# Substack HBR Writer

Escreve artigos no estilo da Harvard Business Review para o Substack e newsletter de Hélio: "Território Humano" — ensaios na intersecção de filosofia, cultura e negócios.

## Cérebro de Copy — opt-in (referência opcional)

Camada estratégica acima desta skill. **Não compulsória.** Em artigo curto, skill roda sozinha. Em ensaio longo (1500+ palavras), peça-âncora ou quando o usuário pedir "use o Cérebro" / "aplique Cérebro N/M/P", ler **antes** de gerar.

Cérebro vive em `clientes/Hélio Costa Jr./Obsidian/1-Marketing-IA/cerebro-de-copy/`. Mapa completo dos 14 arquivos no CLAUDE.md raiz do projeto.

**Arquivos relevantes pra esta skill:**
- `02-arquitetura-da-copy.md` — Situation-Complication-Resolution + nível Schwartz 3-4
- `04-bridges-e-transicoes.md` — bridges Harris adaptados (artigo HBR usa menos, mas usa)
- `11-anti-padroes.md` — checklist de auditoria (AI tone, hedges, voz Hélio)

---

## Sobre o Território Humano

- Público: empreendedores, líderes, profissionais de marketing e negócios, leitores com interesse intelectual
- Tom: analítico, denso mas acessível, com ocasional profundidade filosófica (Aristóteles, Tomás, Marías)
- Postura: o autor é autoridade no tema — não hedges, não "talvez", não "é importante notar que"
- Canal duplo: publicado no Substack + enviado como email newsletter

---

## Princípios do Estilo HBR (aplicar sempre)

**1. Tese counterintuitive ou surpreendente**
O artigo deve defender uma posição que desafie a sabedoria convencional ou ilumine um ângulo que o leitor ainda não havia considerado. Não é um resumo neutro — é um argumento.

**2. Hook forte no primeiro parágrafo**
Começa com um fato surpreendente, uma contradição, uma cena concreta, ou uma pergunta que o leitor não consegue ignorar. Nunca com "Neste artigo vamos explorar...".

**3. Estrutura com lógica de argumento**
Cada seção avança o argumento — não apenas acrescenta informação. O leitor deve sentir que está sendo guiado por um raciocínio que converge em uma conclusão inevitável.

**4. Evidência concreta: dados, casos, pesquisa**
Usar pesquisas reais, empresas reais, números reais quando possível. Se o Claude não tiver dados precisos, usar exemplos históricos, casos amplamente conhecidos, ou padrões observáveis. Nunca inventar dados — quando não há dado específico, dizer "estudos sugerem" ou usar o exemplo como ilustração, não como prova.

**5. Prosa clara, sem jargão acadêmico**
Frases médias. Parágrafos de 3-5 linhas. Sem "no contexto atual", "é mister", "outrossim". Verbo ativo. Substantivos concretos.

**6. "So what" explícito**
O artigo deve terminar com implicação prática clara: o que o leitor faz diferente depois de ler isso?

**7. Sem listas dentro do corpo do texto**
A HBR usa prosa, não bullet points. Frameworks e listas aparecem apenas quando são o objeto de análise (ex: "os três erros mais comuns").

---

## Estrutura do Artigo

### Cabeçalho
- **Título:** direto, com verbo ou tensão clara. Evitar títulos vagos. Modelo HBR: "Why [X] Fails" / "The Hidden Cost of [Y]" / "What [Trend] Really Means for [Audience]"
- **Subtítulo/Deck:** uma linha que expande o título e situa o argumento
- **Tempo de leitura estimado:** incluir discretamente (ex: "6 min de leitura")

### Abertura (200-300 palavras)
- Cena, fato ou paradoxo concreto
- Tese do artigo enunciada com clareza no final do segundo ou terceiro parágrafo

### Desenvolvimento (600-900 palavras)
- 2 a 3 movimentos argumentativos, cada um com:
  - Claim (o que estou argumentando nesta seção)
  - Evidência (dado, caso, exemplo, pesquisa)
  - Implicação (por que isso importa para o argumento central)
- Usar intertítulos curtos e descritivos (não decorativos)

### Conclusão (150-200 palavras)
- Retoma a tese com nova profundidade
- Implicação prática direta para o leitor
- Frase final memorável — não "em conclusão", mas uma sentença que fica

### Nota de autor (opcional, 1-2 linhas)
- Breve contexto sobre a perspectiva de Hélio quando relevante

---

## Comprimento

- Artigo padrão: **900 a 1.400 palavras** (ideal para Substack + email)
- Artigo curto ("Idea Watch"): **500 a 700 palavras** para análises pontuais
- Sempre indicar o formato no cabeçalho interno antes de escrever

---

## Voz e Postura

Hélio é filósofo-copywriter com formação aristotélico-tomista. Sua voz tem:
- Autoridade sem arrogância
- Densidade intelectual sem hermetismo
- Preferência por exemplos históricos e culturais além dos corporativos
- Ocasional integração de filosofia clássica como lente analítica (não como citação decorativa)
- Português brasileiro culto, mas sem afetação

---

## Recomendação de Imagens

Ao final de **todo artigo**, incluir uma seção:

```
---
## Sugestões de Imagens

[3 a 5 sugestões específicas, cada uma com:]

1. **Descrição da imagem:** o que mostra exatamente
   **Por que funciona:** relação com o argumento ou tema central
   **Onde buscar:** Unsplash / Getty / arquivo histórico / infográfico próprio
   **Posição sugerida:** abertura / meio do artigo / após seção X

[Incluir pelo menos:]
- 1 imagem de abertura (visual forte, metafórico ou documental)
- 1 imagem editorial de meio (dado visual, cena corporativa, gráfico sugerido)
- 1 imagem alternativa conceitual (abstrata ou artística, que evoca o tema)
```

---

## Checklist antes de entregar

- [ ] Título tem tensão ou counterintuition?
- [ ] Primeiro parágrafo prende sem anunciar o que vai acontecer?
- [ ] Tese está enunciada claramente até o parágrafo 3?
- [ ] Cada seção tem claim + evidência + implicação?
- [ ] Não há listas onde deveria haver prosa?
- [ ] Conclusão tem implicação prática + frase final forte?
- [ ] Sugestões de imagens incluídas com contexto?
- [ ] Tom está na voz de Hélio — autoridade, densidade, clareza?
