# Economia de Token — a lei transversal do Setup Nexo

Isto não é "mais um protocolo entre doze". É o filtro que passa por cima de
todos os outros: antes de aplicar qualquer protocolo deste núcleo — entrada,
refino, Nexoflow, escala, forma de programar — a pergunta é sempre "isto
está gastando token à toa?". Nenhuma decisão de arquitetura do Setup Nexo é
válida se ignorar esta pergunta. Onde há conflito aparente entre "seguir o
protocolo à risca" e "economizar token", a resolução correta é sempre a
mesma usada em `06-memoria.md` para os `.md`: separar o que precisa estar
sempre presente (barato, pequeno) do que só entra sob demanda (o resto).

## LLM-free-first, modelo certo, sem superestimar

Absorvido e digerido das skills reais `token-economy`, `llm-free-first` e
`model-switch-strategy`. Regras operacionais, não teoria.

## A escada LLM-free-first (tentar nesta ordem, antes de chamar modelo)

```
1. Cache/memoização         (zero custo, zero rede)
2. Consulta em banco/SQL    (determinístico, rápido)
3. Regex/parsing de string  (sem ambiguidade)
4. Ferramenta de linha de comando (grep, jq, awk, curl)
5. API determinística       (sem componente de ML)
6. Tabela de lookup/constante
7. Matemática/ordenação/dedup (algoritmo puro)
8. Cache HTTP (ETag, 304)
     ↓ só se nenhuma resolver
   chamar o modelo
```

Antes de qualquer chamada de modelo para uma subtarefa, pergunte: isso é
determinístico? Se sim, não é trabalho de modelo — é código.

## Modelo certo por papel (nunca Haiku como default de coding)

- **Sonnet** (ou equivalente "padrão de raciocínio médio") → coding,
  refactor, debug, arquitetura, planejamento. É o default, nunca troca sem
  motivo.
- **Haiku** (ou equivalente "barato") → chat, Q&A, leitura, revisão leve,
  varredura ampla (papel auxiliar do Nexoflow, `03-nexoflow.md`).
- **Opus** (ou equivalente "raciocínio máximo") → decisão arquitetural
  crítica, papel planejador/revisor do Nexoflow. Caro — parcimônia.

**Lição herdada, já custou qualidade uma vez:** nunca deixar o modelo barato
como default global de programação. Barato é para chat e varredura, não
para escrever ou revisar código de verdade.

## Trocar de modelo no meio da sessão custa caro (não economiza)

O cache de prompt é por modelo específico. Trocar de modelo/effort/fast-mode
no meio de uma sessão interativa invalida o cache inteiro — o próximo turno
reprocessa todo o histórico sem cache hit. Isso é mais caro no turno
seguinte, não mais barato.

Regra: decidir modelo e effort no início da sessão e não mexer durante.
Precisa mudar de perfil de tarefa? Prefira terminar a sessão atual (ou
comprimir numa pausa natural) e abrir nova já com o modelo certo. Isso NÃO
se aplica ao Nexoflow (`03-nexoflow.md`) — lá cada papel roda em processo
próprio, com seu próprio cache, então a troca por papel é gratuita.

## Nunca superestimar economia

Ao reportar economia de token ao usuário: faixa, nunca número exato — exceto
quando vier de uma medição real (ex.: saída de uma ferramenta que mede de
verdade, não heurística de caracteres/4). Heurística de contagem de token é
estimativa, não fato; nunca apresentar como número preciso.

## Catálogo sob demanda

Já coberto em `catalogo/CATALOGO.md` — skill só carrega quando a tarefa casa
com o domínio, nunca por padrão. Isso é a 3ª alavanca de economia, depois de
LLM-free-first e modelo certo por papel.
