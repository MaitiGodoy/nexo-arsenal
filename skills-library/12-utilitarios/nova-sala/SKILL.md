---
name: nova-sala
description: Monta uma Sala de Operações MktOps completa para um cliente novo a partir da CAMADA CANON versionada (_sala-canon/). Faz o scaffold mecânico (canon herdado intacto + esqueleto cliente) e depois orquestra as skills de pesquisa, espionagem, brand e design para preencher a inteligência específica do cliente, terminando em um .zip de entrega. Acionar quando o Hélio disser "nova sala", "montar sala pra <cliente>", "setup MktOps pra <cliente>", "criar sala de operações", "monta a infra de marketing do <cliente>", ou passar nome+site de um cliente novo e pedir o setup. NÃO confundir com mktops-content-engine (gera ideias de carrossel da semana) nem com market-research-briefing (só a pesquisa). Esta skill é o build COMPLETO da Sala.
---

# nova-sala — Build canônico da Sala de Operações MktOps

Produz a Sala de um cliente novo de forma **fluída e versionada**, com a fronteira CANON/CLIENTE garantida. Substitui o build ad-hoc que gerava drift.

## Princípio

Duas camadas, fronteira que nunca se cruza:

- **CANON** (`_sala-canon/canon/`): `.claude/` (99 skills · 16 agents · 1 command), `cerebro-de-copy/`, `playbook-narrativas-mktops.md`, `design-system/_base/`. Herdado **intacto**, snapshot versionado. Nunca reescrito dentro da Sala.
- **CLIENTE** (`_sala-canon/template-cliente/`): `brand-context.md`, `pesquisa-mercado/`, `spy/`, `design-system/`, `conteudo/`, `entregas/`. Preenchido **via skills**, por cliente.

Fonte da verdade e versão: `~/Studio Artemis/_sala-canon/` (ler `README.md` + `VERSION` lá).

## Inputs mínimos

- **Slug** (kebab-case, sem acento): ex `acme`
- **Nome** do cliente: ex `ACME Indústria`
- **URL do site** (pra ads-dna + pesquisa)
- **Transcrições de call** (opcional mas decisivo pro brand-context — pedir se não houver)

Se faltar slug/nome/URL, perguntar **uma vez** os três juntos e seguir.

## Pipeline (ordem canônica)

### Passo 0 — Scaffold mecânico
```bash
cd "$HOME/Studio Artemis/.claude/skills/nova-sala"
chmod +x montar-sala.sh empacotar-sala.sh   # primeira vez
./montar-sala.sh <slug> "<Nome>"
```
Isso cria `clientes/<slug>/` com canon intacto + esqueleto cliente + placeholders mecânicos já resolvidos (`{{CLIENTE}}`, `{{VERSAO_CANON}}`, `{{DATA_BUILD}}`). Restam placeholders de **conteúdo** (`{{QUEM_E_CLIENTE}}`, `{{ICP_CLIENTE}}`, `{{TOM_CLIENTE}}`, `{{REGRA_0_CLIENTE}}`) — preenchidos nos passos seguintes.

### Passo 1 — Pesquisa de mercado → `pesquisa-mercado/briefing.md`
Rodar `market-research-briefing` com a URL. Salvar o output substituindo o template.

### Passo 2 — Espionagem → `spy/`
Rodar `market-competitors` (ou `/spy`) sobre os concorrentes que a pesquisa revelou. Um `.md` por player + preencher `spy/SINTESE-CONCORRENCIA.md`.

**Pra analisar conteúdo de Instagram (concorrentes/perfis de referência):** baixe com `automacao/instagram-watch/baixar-instagram.sh <url>` (gallery-dl) → imagens em `spy/_downloads/instagram/<handle>/` → **leia as imagens com o Read tool** pra confirmar visual/copy/formato. **NUNCA Playwright nem WebFetch pra Instagram** (quebram: perfil em uso, login wall, base64). 1–3 perfis por vez pra evitar 401.

### Passo 3 — Brand context → `brand-context.md`
Destilar: pesquisa (passo 1) + spy (passo 2) + **transcrições de call** (se houver). Preencher as 10 seções do template. **A §9 (restrições de copy) alimenta a REGRA 0** — extrair de lá as restrições e escrever em `{{REGRA_0_CLIENTE}}` no `CLAUDE.md`.

### Passo 4 — Design system → `design-system/`
Rodar `ads-dna` na URL → `brand-profile.json`. Traduzir pro `design-system/design-system.md` (paleta/tipografia/logo do cliente, herdando a estrutura do `_base/brand-book-v2.md`). Baixar o logo pra `design-system/logo/`.

### Passo 5 — Preencher o CLAUDE.md
Com brand-context pronto, escrever no `CLAUDE.md` da Sala: `{{QUEM_E_CLIENTE}}`, `{{ICP_CLIENTE}}`, `{{TOM_CLIENTE}}`, `{{REGRA_0_CLIENTE}}`. Conferir que **não sobrou nenhum `{{`**:
```bash
grep -rn '{{' "$HOME/Studio Artemis/clientes/<slug>" --include='*.md' || echo "limpo"
```

### Passo 6 — Kit inicial de conteúdo (opcional, sob pedido)
Se o Hélio pedir, gerar 3 carrosséis-modelo (`carousel-mktops`) + 3-5 ads (`ads-create`) em `conteudo/`, cada um pela bandeira central definida no brand-context. Gate `copywriting-guardrails` (+ `copy-format-check` nos ads) — sempre.

### Passo 7 — Empacotar
```bash
./empacotar-sala.sh <slug>
```
O script avisa se sobrou placeholder. Zip vai pra `clientes/<slug>/<slug>-sala-AAAA-MM-DD.zip`.

## Regras de execução

- **Nunca editar nada dentro de `cerebro-de-copy/`, `playbook-narrativas-mktops.md`, `design-system/_base/` ou `.claude/` da Sala.** São canon. Mudou canon? É no `_sala-canon/` do Studio Artemis, com bump de versão.
- **Toda copy gerada nos passos 6** passa por `copywriting-guardrails`. Ads passam também por `copy-format-check`.
- **Mostrar ao Hélio** o brand-context destilado (passo 3) **antes** de gerar conteúdo — é o documento que calibra tudo.
- Ao terminar, reportar: caminho da Sala, versão canon herdada, o que foi preenchido vs pendente, e caminho do zip.

## Manutenção do canon

Se durante o build perceber que uma skill/regra deveria ser canônica (vale pra todo cliente), **não** improvisar na Sala — anotar no relatório final como sugestão de bump pro `_sala-canon/CHANGELOG.md`.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
