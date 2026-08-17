---
name: mktops-content-engine
description: >
  Gera 10 fichas-de-ideia de carrossel por semana para um cliente, modelando
  estrutura de carrosseis-referencia do Instagram + dados frescos da semana
  + playbook MktOps de narrativas. Orquestra 4 subagentes em sequencia
  (downloader, analyzer, researcher, writer) e entrega markdown unico em
  clientes/<cliente>/conteudo/ideias-semana-YYYY-WNN.md. Acionar quando o
  Helio mencionar "rodar content engine", "gerar ideias da semana",
  "atualizar carrosseis", ou ao receber argumento de cliente alvo.
---

# MktOps Content Engine

## O que faz

Pipeline semanal de 4 etapas que devolve 10 fichas-de-ideia de carrossel
para 1 cliente. Cada ficha cruza:

1. Estrutura comprovada (de um carrossel-referencia do IG)
2. Dado/caso fresco da semana (jornal, HBR, McKinsey, fonte do nicho)
3. Playbook MktOps de 4 atos (NARRATIVA → PRINCIPIO → APLICACAO → OFERTA)
4. Brand-context do cliente (ICP, dores, vocabulario)

Saida: markdown com 10 fichas, cada uma esqueleto editorial pronto para o
Helio expandir manualmente com a skill `carousel-writer`.

## Quando rodar

- **Manual:** `mktops-content-engine cliente=Plugue.Ai`
- **Automatico:** cron seg 7h (plist em
  `automacao/mktops-content-engine/com.studioartemis.mktops-content-engine.plist`,
  pre-setado mas NAO carregado por padrao)

## Entrada

Argumento obrigatorio: `cliente=<nome>` (deve existir em `automacao/mktops-content-engine/clientes.json`)

Argumentos opcionais:
- `n_ideias=10` (default)
- `dias=7` (janela de coleta IG)

## Fluxo de execucao

### Passo 0 — preparar ambiente

1. Read `automacao/mktops-content-engine/clientes.json`
2. Validar que o cliente existe na config. Se nao, abortar com mensagem clara.
3. Calcular semana ISO atual (ex: `2026-W18`)
4. Criar pasta de execucao: `automacao/mktops-content-engine/runs/<YYYY-WNN>-<cliente>/`
5. Definir `output_final = clientes/<cliente>/conteudo/ideias-semana-<YYYY-WNN>.md`

### Passo 1 — downloader

Use Task tool com `subagent_type=mktops-downloader`. Passe:
- cliente
- perfis_modelo (da config)
- output_dir (pasta de execucao)
- dias

Aguarde retorno. Se falhar (rate limit, sem material), abortar com mensagem
clara — nao adianta seguir sem materia-prima.

### Passo 2 — analyzer

Use Task tool com `subagent_type=mktops-analyzer`. Passe:
- carrosseis_json (caminho retornado pelo downloader)
- playbook_path (da config)
- output_dir

Aguarde retorno.

### Passo 3 — researcher

Use Task tool com `subagent_type=mktops-researcher`. Passe:
- cliente
- nicho (da config)
- temas_modelo (extraidos do retorno do analyzer — ele te diz quais temas
  apareceram nos carrosseis-referencia)
- brand_context_path (da config)
- output_dir

Roda em paralelo com o passo 2 se quiser otimizar tempo (analyzer e
researcher sao independentes — researcher so precisa dos temas, que voce
pode inferir antes de analisar tudo a fundo). Para V1, manter sequencial.

### Passo 4 — writer

Use Task tool com `subagent_type=mktops-writer`. Passe:
- analises_path
- pesquisa_path
- playbook_path
- brand_context_path
- n_ideias
- output_path (caminho final em `clientes/<cliente>/conteudo/`)

Aguarde retorno.

### Passo 5 — notificar Daily

Adicionar entrada na nota Daily do dia atual em
`clientes/Hélio Costa Jr./Obsidian/Daily/<YYYY-MM-DD>.md` (se existir):

```markdown
## MktOps Content Engine

- Cliente: <cliente>
- Semana: <YYYY-WNN>
- Fichas geradas: <N>
- Output: [[ideias-semana-<YYYY-WNN>]]
```

Se o arquivo do dia nao existir, criar entrada minima. Se ja existir secao
"## MktOps Content Engine", append (nao sobrescrever).

### Passo 6 — limpeza

Manter pasta de execucao em `runs/` por 4 semanas para debug, depois apagar
runs mais antigos automaticamente.

## Output final

Markdown unico em `clientes/<cliente>/conteudo/ideias-semana-<YYYY-WNN>.md`.

Estrutura:
- Cabecalho: cliente, semana, data, total de fichas, distribuicao por
  familia/tema
- Sumario tabular (10 linhas): #, titulo, familia, dor-alvo, arquetipo
- 10 fichas completas no formato definido pelo agent mktops-writer
- Secao final "Notas de producao" se houver specs visuais

## Configuracao por cliente

Em `automacao/mktops-content-engine/clientes.json`:

```json
{
  "Plugue.Ai": {
    "perfis_modelo": [
      "https://www.instagram.com/tallisgomes/"
    ],
    "nicho": [
      "whatsapp business",
      "atendimento conversacional",
      "chatbot"
    ],
    "playbook_path": "clientes/Plugue.Ai/conteudo/playbook-narrativas-mktops.md",
    "brand_context_path": "clientes/Plugue.Ai/brand-context.md"
  }
}
```

Adicionar novos clientes editando o JSON. O orquestrador nao requer mudanca.

## Reportar para o usuario

No final, devolver mensagem curta:
- Path do markdown final
- Numero de fichas produzidas
- Distribuicao por familia
- Tempo total (opcional)
- Se algo falhou ou foi pulado, declarar explicitamente

NAO listar as 10 fichas no chat. O usuario abre o markdown.

## Limites do V1

- Suporta 1 cliente por execucao (nao multi-cliente em paralelo)
- Apenas Instagram como fonte de carrosseis-modelo
- Pesquisa apenas em fontes web publicas
- Nao integra com Mautic ou agendador de posts (apenas gera fichas)

Quando V1 estiver validado (4 semanas rodando, taxa de uso de fichas >40%),
escalar para multi-cliente, adicionar X/LinkedIn como fontes, integrar
agendamento.
