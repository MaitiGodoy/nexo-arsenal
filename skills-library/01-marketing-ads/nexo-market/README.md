# nexo-market

Roteador de demanda de marketing: você diz o **objetivo**, ele devolve **quais
skills do arsenal invocar, em que ordem, e qual o critério de aceite**.

Contrato completo: [SKILL.md](SKILL.md).

```bash
python ~/.claude/skills/nexo-market/main.py "<objetivo>"
```

Exits: `0` classificado · `1` precisa de LLM · `2` entrada inválida.

## Exemplos

### 1. Campanha de mídia paga

```bash
python main.py "create google ads campaign for product launch"
```

```json
{
  "tipo": "campaign",
  "skills": ["/ads-plan", "/ads-budget", "/ads-create", "/ads-creative", "/ads-dna"],
  "aceite": "Plano de campanha com objetivo, verba por canal, criativos e critério de sucesso definido.",
  "needs_llm": false
}
```

`opcionais` traz os canais (`/ads-google`, `/ads-meta`, `/ads-tiktok`, …) —
puxe só o do canal em jogo.

### 2. Auditoria da conta própria

```bash
python main.py "auditoria da conta de ads do cliente"
```

→ `audit-internal` · `/ads-audit` `/market-audit` `/ads-budget`

### 3. Análise de concorrente

```bash
python main.py "benchmark dos concorrentes no mercado"
```

→ `audit-competitor` · `/ads-competitor` `/competitive-intelligence` `/competitor-profiling`

Note que **"audit competitor ads"** também cai aqui, não em `audit-internal`:
concorrência é avaliada antes de conta própria.

### 4. SEO

```bash
python main.py "SEO audit for the site"
```

→ `site-seo` · `/seo-audit` `/seo-technical` `/seo-plan` `/site-architecture`

### 5. Pipeline de vendas

```bash
python main.py "pipeline forecast for Q4"
```

→ `sales-pipeline` · `/pipeline-review` `/forecast` `/revops`

### 6. Conteúdo

```bash
python main.py "escrever post de blog sobre o produto"
```

→ `content` · `/content-strategy` `/copywriting` `/social-content`

### 7. Fora do domínio (escala pro LLM)

```bash
python main.py "consertar o servidor de banco de dados"
```

```json
{ "tipo": null, "skills": [], "needs_llm": true, "prompt_llm": "Classifique a demanda..." }
```

Exit `1`. O roteador **não chuta** — devolve o prompt de classificação pronto.

### 8. Pelo tardis

```bash
bash ~/.claude/skills/nexo-tardis/motor/roteador-nexo-market.sh "auditoria de SEO do site"
```

Mesmo JSON, mesmos exits.

## Formato da saída

| Campo | Tipo | Significado |
|-------|------|-------------|
| `entrada` | str | eco do texto recebido |
| `tipo` | str \| null | `campaign` · `audit-internal` · `audit-competitor` · `site-seo` · `sales-pipeline` · `content` |
| `skills` | list[str] | obrigatórias, **em ordem de execução** |
| `opcionais` | list[str] | conforme canal/escopo |
| `aceite` | str \| null | o que precisa existir pra fase estar pronta |
| `needs_llm` | bool | `true` = regex não resolveu |
| `prompt_llm` | str \| null | prompt de classificação, quando `needs_llm` |

## Troubleshooting

**Classificou no tipo errado.** A ordem de avaliação é
`audit-competitor → audit-internal → site-seo → sales-pipeline → campaign → content`;
o primeiro match vence. Ajuste o padrão em `classifier.py` **e acrescente o caso**
em `test_classify_retorna_tipo_esperado` — regex sem teste regride.

**`needs_llm: true` numa entrada que deveria casar.** Falta padrão. Mesmo
caminho acima. Enquanto isso, use `prompt_llm` e siga com
`python -c "from router import route; print(route('<tipo>'))"`.

**`ValueError: entrada deve ser uma string nao-vazia`.** Argumento vazio ou só
espaços. Pelo CLI isso vira exit `2` com mensagem de uso.

**`tipo desconhecido: 'x'`.** `route()` recebeu tipo fora de `TIPOS`. Os tipos
válidos estão na mensagem do erro e nas chaves de `router_config.json`.

**Skill da rota não existe mais no arsenal.** `router_config.json` é mantido à
mão — atualize a lista do tipo afetado. Confira o nome em
`~/.claude/skills-library/<categoria>/`.

**Acento saindo quebrado no terminal.** `main.py` força UTF-8 no stdout; se
ainda quebrar, é o code page do console (`chcp 65001`), não o dado — redirecione
pra arquivo e o JSON sai íntegro.

## Testes

```bash
cd ~/.claude/skills/nexo-market && python -m pytest test_router.py -q
```

30 testes: classificação por tipo, entradas inválidas, pureza de `route()`,
serialização da saída e coerência entre `TIPOS` e `router_config.json`.
