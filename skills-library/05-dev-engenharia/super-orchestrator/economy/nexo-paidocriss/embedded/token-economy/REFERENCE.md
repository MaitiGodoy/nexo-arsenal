# 🎛️ MASTER — Claude Code Token Economy Self-Configuration Guide

> **O que é este arquivo:** Guia único e completo para (re)configurar QUALQUER Claude Code
> do zero para máxima economia de token. Contém tudo que foi montado nas sessões
> "deepseek" e "token economy". Cole este arquivo inteiro num Claude Code novo e diga:
> **"Leia este .md e auto-configure o Claude Code seguindo exatamente estas instruções."**
>
> **Data de origem:** 2026-07-12 | **Autor:** maiti.wayper@gmail.com + Claude
> **Plataforma testada:** Windows 11, Git Bash disponível, plano Claude subscription.

---

## ⚠️ LEIA PRIMEIRO — Honestidade sobre o que funciona

| Camada | Confiabilidade | Natureza |
|--------|---------------|----------|
| **A. Env vars + settings oficiais** | 95-100% | REAL — documentado nos docs oficiais |
| **B. .claudeignore + MCP cleanup** | 100% | REAL — maior ganho, comprovado |
| **C. RTK (Rust Token Killer)** | 100% | REAL — mede 2.7% ativo |
| **D. Compressão de output (hooks .sh)** | 85% | REAL, mas depende de Git Bash no Windows |
| **E. Token counter / session monitor (hooks .sh)** | 60-70% | SEMI-REAL — heurística ±30%, NÃO é contagem oficial |

**Regra de ouro:** Se você quer só o que dá retorno garantido, implemente **A + B + C**.
As camadas D e E são bônus que ajudam mas têm margem de erro. Não confie nos números
que os scripts .sh cospem como se fossem exatos.

**A verdade sobre contagem de token:** O único monitor de token REAL do Claude Code é o
`statusLine` lendo `cache_read_input_tokens` / `cache_creation_input_tokens` da API, e o
comando `/usage`. Hooks NÃO recebem contagem de token. Todo script .sh que "conta tokens"
aqui é estimativa por caracteres/linhas.

---

## 📊 AS 7 TÉCNICAS REAIS (do GitHub + docs oficiais) — ORDEM DE IMPACTO

| # | Técnica | Economia real | Confiança | Ação |
|---|---------|--------------|-----------|------|
| 1 | **Desabilitar MCP servers não usados** | 10-70K tok/sessão | 100% | Manual `/mcp` |
| 2 | **.claudeignore** (junk out of context) | 5-15K tok/sessão | 100% | Criar arquivo |
| 3 | **Prompt caching 1h TTL** | -90% em cache reads | 100% | Env var |
| 4 | **MAX_THINKING_TOKENS=10000** | 5-15K tok/resposta | 95% | Env var |
| 5 | **Subagent model = haiku** | -90% custo/subagent | 100% | Env var |
| 6 | **Auto-compact @ 70%** | 10-20K tok | 85% | Env var |
| 7 | **DISABLE_NON_ESSENTIAL_MODEL_CALLS** | 1-5K tok | 90% | Env var |

**Fontes:** code.claude.com/docs/en/prompt-caching, /best-practices, /sub-agents,
/context-window; GitHub anthropics/claude-code issues #52979, #7172, #23711.

---

## 🔧 PASSO 1 — settings.local.json (arquivo `~/.claude/settings.local.json`)

Este é o coração. Cria/substitui `~/.claude/settings.local.json` com:

```json
{
  "model": "claude-sonnet-5",
  "fallbackModel": ["claude-opus-4-8"],
  "env": {
    "ENABLE_PROMPT_CACHING_1H": "1",
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku",
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "70",
    "DISABLE_NON_ESSENTIAL_MODEL_CALLS": "1"
  },
  "outputStyle": "terse",
  "verbose": false,
  "showTurnDuration": false,
  "showMessageTimestamps": false,
  "respondToBashCommands": false,
  "alwaysThinkingEnabled": false,
  "fastMode": true,
  "autoCompactEnabled": true,
  "fileCheckpointingEnabled": false,
  "skillListingMaxDescChars": 256,
  "skillListingBudgetFraction": 0.005,
  "cleanupPeriodDays": 7,
  "viewMode": "focus",
  "spinnerTipsEnabled": false,
  "showClearContextOnPlanAccept": false,
  "language": "portuguese"
}
```

### Explicação de cada campo (por que economiza):

**Bloco `env` (o que mais importa — 5 env vars REAIS):**
- `ENABLE_PROMPT_CACHING_1H` — cache do prefixo (system prompt + CLAUDE.md + histórico)
  dura 1h em vez de 5min. Cache read = 10% do custo de input normal. Grátis em subscription.
- `CLAUDE_CODE_SUBAGENT_MODEL: haiku` — Explore/Agent/subagentes rodam em Haiku
  (~15× mais barato que Opus). Task de subagente é leve (search, sort), não precisa Sonnet.
- `MAX_THINKING_TOKENS: 10000` — limita raciocínio interno. Sem isso pode gastar 30-50%
  da resposta em thinking. 10K é suficiente pra tarefa complexa.
- `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE: 70` — compacta em 70% da janela (default 95%).
  Contexto mais enxuto = menos re-processamento por turno.
- `DISABLE_NON_ESSENTIAL_MODEL_CALLS: 1` — mata chamadas de fundo (sugestões de prompt,
  auto-memory não-essencial).

**Campos de UI/comportamento (economizam output tokens):**
- `outputStyle: terse` — respostas curtas por padrão.
- `alwaysThinkingEnabled: false` — thinking off por padrão (liga só quando pedir).
- `fastMode: true` — Opus com output rápido (não baixa modelo). Ligar no INÍCIO da sessão
  (ligar no meio invalida cache uma vez).
- `verbose: false`, `showTurnDuration/showMessageTimestamps: false` — menos ruído.
- `skillListingMaxDescChars: 256` + `skillListingBudgetFraction: 0.005` — encolhe a
  listagem de skills injetada no system prompt (default ~1536 chars/skill × N skills = caro).
- `viewMode: focus` — menos re-render.
- `fileCheckpointingEnabled: false` — sem snapshots (economiza I/O; perde /rewind de arquivo).

### ⚠️ Cuidado com o campo `permissions`
No setup original havia `"permissions": {"defaultMode": "auto", "allow": ["Bash(*)", ...]}`.
Isso reduz prompts MAS `Bash(*)` + `defaultMode: auto` é permissivo. **Recomendação:**
só inclua se você confia no ambiente. Para o de outra pessoa, OMITA o bloco permissions
(deixe o padrão de aprovação manual).

### ⚠️ NÃO invente campos
`settings.json` tem schema restrito. Campos inventados (ex: `tokenSavingsMode`,
`outputCompression`) **quebram** a validação. Só use chaves que existem no schema oficial.
Se o Claude Code recusar o arquivo, ele diz qual campo é inválido — remova esse campo.

---

## 🔧 PASSO 2 — .claudeignore (na RAIZ de cada projeto)

Cria `.claudeignore` na raiz do repositório (mesma sintaxe do .gitignore):

```
# Dependencies & build artifacts (o maior desperdício)
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml
*.lock
dist/
build/
target/
out/
.next/
.nuxt/

# Cache & generated
__pycache__/
*.pyc
.cache/
.pytest_cache/
.mypy_cache/
coverage/

# IDE & sistema
.vscode/
.idea/
.DS_Store
.git/

# Dados & binários grandes
*.db
*.sqlite
*.sqlite3
*.log
*.o
*.so
*.dll
*.exe
```

**Por quê:** um `package-lock.json` sozinho = 50K+ tokens. Claude indexa o workspace no
início; sem isso ele puxa lixo. Economia 20-40% em projeto grande.

---

## 🔧 PASSO 3 — LIMPAR MCP SERVERS (o MAIOR ganho, é manual)

**Este é o #1 em impacto e quase ninguém faz.** Cada MCP server conectado injeta
10-20K tokens de schema NO INÍCIO de cada sessão, use você ou não.

No estado auditado desta máquina havia **30+ conectores** referenciados (small-business,
productivity, legal, marketing, bio-research, sales, etc). Se metade estiver conectada
mas sem uso = **150-300K tokens desperdiçados por sessão**.

### Ação (numa sessão interativa `claude`):
```
/mcp
```
Desabilite TUDO que você não usou nas últimas 2 semanas. Regra prática: mantenha só os
servers que você vai usar NESTA sessão. Reabilita quando precisar.

### Alternativa (deferir schema em vez de desconectar):
Em modelos que suportam tool search, os schemas ficam "deferred" (carregam sob demanda).
Confirme que tool search está ativo. Em Haiku e alguns gateways o defer não funciona —
aí desabilitar é a única saída.

---

## 🔧 PASSO 4 — CLAUDE.md ultra-terse (`~/.claude/CLAUDE.md`)

CLAUDE.md é injetado TODA mensagem (custo de input fixo). Mantenha curtíssimo.
Versão usada (10 linhas):

```markdown
@RTK.md
# ULTRA-TERSE MODE

**Act, not narrate.** No intro/outro/explanation. One-line updates only.
**Code:** KISS. Min viable. No speculative code/abstractions. 200→50? Rewrite.
**Changes:** Surgical. Touch only needed. Match style.
**Verify:** Tests first. Define success. Loop until pass.
**Respond:** No summaries. No trailing notes. One sentence per update. Done = silence.

Ref: karpathy-skills
```

> Nota: o `@RTK.md` no topo importa o RTK.md (também deixe curto). Só faça isso se RTK
> estiver instalado; senão remova a linha.

---

## 🔧 PASSO 5 — RTK (Rust Token Killer) — opcional mas real

RTK é um proxy CLI que comprime output de comandos dev (git status, ls, cargo test etc).
Mede ~2.7% de economia global nesta máquina (real, verificado via `rtk gain`).

### Instalar/verificar:
```bash
which rtk           # deve achar o binário
rtk --version       # ex: rtk 0.43.0
rtk gain            # mostra economia (não pode dar "command not found")
```
⚠️ Colisão de nome: `reachingforthejack/rtk` é OUTRO projeto (Rust Type Kit). O certo
responde a `rtk gain`.

### Ativar via hook (em `~/.claude/settings.json` — o GLOBAL, não o local):
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [ { "type": "command", "command": "rtk hook claude" } ] }
    ]
  }
}
```

### RTK.md curto (`~/.claude/RTK.md`):
```markdown
# RTK - Rust Token Killer
**CLI proxy:** 60-90% savings on dev ops. Auto-hooked via settings.json.

**Commands:**
- `rtk gain` → token savings analytics
- `rtk gain --history` → usage history + savings
- `rtk discover` → missed opportunities in history
- `rtk proxy <cmd>` → raw command (debug)
```

---

## 🔧 PASSO 6 — Prompt caching: MAXIMIZAR o hit rate (grátis, alto impacto)

Regras do cache (docs oficiais). Cache é **match de prefixo** — mudar QUALQUER coisa no
começo invalida tudo depois. Portanto:

**FAÇA (mantém cache quente):**
- Escolha modelo e effort no INÍCIO e não troque no meio.
- Rode `/compact` só em pausas naturais entre tarefas (não no meio).
- Editar arquivos do repo, invocar skills/commands, mudar permission mode, `/recap`,
  `/rewind` — tudo isso PRESERVA o cache.

**EVITE (invalida cache — 1 turno lento + caro):**
- Trocar modelo mid-sessão (`/model`) — cada modelo tem cache próprio.
- Trocar effort level mid-sessão.
- Ligar fast mode no meio (ligue no início).
- Conectar/desconectar MCP server no meio.
- Editar CLAUDE.md mid-sessão (nem aplica até restart).

**Verificar hit rate:** use um `statusLine` script lendo `current_usage`:
`cache_read_input_tokens` alto vs `cache_creation_input_tokens` baixo = cache saudável.

TTL: em subscription, Claude Code já pede 1h automaticamente. Em API key, ligue
`ENABLE_PROMPT_CACHING_1H=1` (já está no PASSO 1).

---

## 🔧 PASSO 7 — Estratégia de modelo (Sonnet coding / Haiku chat)

**Regra:** Sonnet para programar, Haiku para conversar/tirar dúvida.

| Tarefa | Modelo | Motivo |
|--------|--------|--------|
| Coding, refactor, debug, arquitetura, plano | **Sonnet** | qualidade de raciocínio |
| Chat, Q&A, ler doc, revisar, escrever prosa | **Haiku** | 90% mais barato, suficiente |
| Decisão arquitetural crítica | **Opus** | raciocínio máximo (caro) |

Trocar modelo invalida cache (1 turno caro) — então NÃO fique alternando no meio.
Escolha no início conforme a sessão. Script auxiliar `quick-switch-model.sh` faz o sed
no settings.local.json; use ENTRE sessões, não durante.

> IMPORTANTE (lição desta máquina): **não deixe Haiku como default global.** Haiku não
> dá conta de coding complexo. Default = Sonnet. Haiku é opt-in por sessão de chat.

---

## 🔧 PASSO 8 — Hooks de compressão (BÔNUS, 85% confiável, precisa Git Bash)

Estes hooks comprimem output ANTES de virar contexto. **Só funcionam com Git Bash
disponível no Windows.** Se `shell: bash` não existir, eles falham silenciosamente
(não quebram nada, só não economizam).

### Scripts (colocar em `~/.claude/`):

**`compress-bash-output.sh`** — remove ANSI, trunca linhas >200 chars, colapsa linhas vazias.
**`trim-read-output.sh`** — remove docstrings/comentários, trunca arquivo >500 linhas.
**`load-notation.sh`** — injeta notação comprimida se o prompt tem palavras-chave do projeto.

### Ativar no settings.local.json (bloco hooks):
```json
"hooks": {
  "PostToolUse": [
    { "matcher": "Bash", "hooks": [
        { "type": "command", "command": "rtk hook claude", "timeout": 5 },
        { "type": "command", "command": "~/.claude/compress-bash-output.sh",
          "shell": "bash", "timeout": 10, "if": "Bash(*)" }
    ]},
    { "matcher": "Read", "hooks": [
        { "type": "command", "command": "~/.claude/trim-read-output.sh",
          "shell": "bash", "timeout": 5 }
    ]}
  ]
}
```

> ⚠️ CAVEAT REAL: a substituição `$OUTPUT` como argumento de hook pode não funcionar como
> imaginado — hooks recebem input via stdin/JSON, não via env `$OUTPUT` garantido. Trate
> estes hooks como "best effort". Se quiser garantir, escreva o script para ler stdin.
> Torne executável: `chmod +x ~/.claude/*.sh`.

---

## 🔧 PASSO 9 — Monitor de sessão / auto-resumo (BÔNUS, 60-70% — HEURÍSTICA)

**Seja honesto sobre isto:** NÃO é contagem real de token. É estimativa (~200 tok/tool,
1 tok/4 chars de resposta, 1.3 tok/linha de contexto). Margem ±30%. Serve como
"sensação de peso", não como número exato.

Componentes (em `~/.claude/`):
- `real-token-counter.sh` — estima total e avisa perto de ~400-500K.
- `context-inflation-detector.sh` — mede crescimento REAL de linhas do histórico, alerta
  se inflar >50% entre checagens (essa parte É real — conta linhas de verdade).
- `auto-session-summary.sh` — no `SessionEnd`, gera um resumo em
  `~/.claude/session-summaries/` e sugere abrir nova conversa.

Ativar (bloco hooks do settings.local.json):
```json
"PostToolBatch": [ { "hooks": [
  { "type": "command", "command": "~/.claude/real-token-counter.sh", "shell": "bash", "async": true, "timeout": 5 },
  { "type": "command", "command": "~/.claude/context-inflation-detector.sh", "shell": "bash", "async": true, "timeout": 3 }
]}],
"SessionEnd": [ { "hooks": [
  { "type": "command", "command": "~/.claude/auto-session-summary.sh", "shell": "bash", "timeout": 10 }
]}]
```

**Melhor alternativa REAL para "quando trocar de sessão":** em vez de confiar no heurístico,
use o comando nativo `/usage` para ver consumo real, e o `statusLine` para ver
`cache_read/creation` ao vivo. O padrão saudável: quando o contexto passa de ~70% (o
auto-compact @70% já cuida disso), ou quando você troca de tarefa, rode `/compact` ou
abra sessão nova.

---

## 🔧 PASSO 10 — Plugins (auditar peso)

Nesta máquina estavam habilitados via `~/.claude/settings.json`:
- `ecc@ecc` (github affaan-m/ECC) — guidelines de engenharia (rules/ecc/*.md).
- `open-design@open-design` (github nexu-io/open-design).

Plugins que só trazem skills/commands/agents/hooks **não invalidam cache** (append no fim).
O que pesa é: (a) MCP servers que o plugin traga, (b) skills com descrições longas
(por isso `skillListingMaxDescChars: 256`). Audite: desabilite plugin cujo valor não
justifica o peso. ECC é leve (markdown); os conectores MCP é que pesam (ver PASSO 3).

---

## ✅ CHECKLIST DE AUTO-CONFIGURAÇÃO (para um Claude Code novo executar)

```
[ ] 1. Criar ~/.claude/settings.local.json (PASSO 1) — bloco env é o essencial
[ ] 2. Criar .claudeignore na raiz do projeto (PASSO 2)
[ ] 3. Rodar /mcp e desabilitar servers não usados (PASSO 3) — MAIOR ganho
[ ] 4. Encurtar ~/.claude/CLAUDE.md para versão terse (PASSO 4)
[ ] 5. Verificar/instalar RTK + hook global (PASSO 5) — opcional
[ ] 6. Fixar modelo/effort no início; não trocar no meio (PASSO 6)
[ ] 7. Default Sonnet; Haiku só para chat (PASSO 7)
[ ] 8. (Bônus) Scripts de compressão + chmod +x (PASSO 8) — só com Git Bash
[ ] 9. (Bônus) Monitor heurístico de sessão (PASSO 9) — não confiar nos números
[ ] 10. Auditar plugins (PASSO 10)
[ ] 11. Validar: settings carrega sem erro de schema; /usage mostra consumo real
```

---

## 📈 ECONOMIA REALISTA ESPERADA

| Fonte | Economia | Confiança |
|-------|----------|-----------|
| MCP cleanup (se 4+ servers) | 10-70K tok/sessão | 100% |
| .claudeignore (projeto grande) | 5-15K tok/sessão | 100% |
| Prompt caching 1h | -90% em cache reads | 100% |
| MAX_THINKING=10K | 5-15K tok/resposta | 95% |
| Subagent Haiku | -90% custo/subagent | 100% |
| Auto-compact 70% | 10-20K tok | 85% |
| RTK | ~2.7% global | 100% |
| CLAUDE.md terse + skill shrink | 300-500 tok/sessão | 90% |
| Hooks compressão (bônus) | 30-50% do output | 85% |

**Total realista combinado: 40-60% de redução de tokens processados por sessão.**
(Não é 90%+ — desconfie de qualquer guia que prometa isso sem trocar de modelo/provider.)

---

## 🚀 EVOLUÇÃO FUTURA (não implementado, requer ação/custo)

- **DeepSeek backend (deepclaude / claudecode-deepseek-stack):** aponta
  `ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic` + `ANTHROPIC_AUTH_TOKEN`. Custo
  por token ~94% menor, mas TROCA o cérebro (qualidade Llama/DeepSeek, não Claude). NÃO é
  economia de token — é economia de $. Só vale se qualidade servir.
- **token-optimizer-mcp (ooples):** MCP que promete 95% via cache/compressão agressiva.
  Não testado aqui — avaliar antes de confiar no número.
- **statusLine com contagem real:** escrever um statusline script que lê
  `cache_read_input_tokens`/`cache_creation_input_tokens` = ÚNICA forma de ver token real
  ao vivo. Vale implementar para parar de depender de heurística.

---

## 📚 FONTES (todas verificadas nesta sessão)

**Docs oficiais Claude Code:**
- Prompt caching: https://code.claude.com/docs/en/prompt-caching
- Best practices: https://code.claude.com/docs/en/best-practices
- Sub-agents: https://code.claude.com/docs/en/sub-agents
- Context window / compaction: https://code.claude.com/docs/en/context-window
- Reduce costs: https://code.claude.com/docs/en/costs

**GitHub (anthropics/claude-code):**
- #52979 (20-30K baseline overhead), #7172 (MCP token overhead),
  #23711 (compact threshold configurável), #38239/#41249 (consumo rápido).

**Comunidade:**
- firecrawl.dev/blog/claude-code-token-efficiency
- mindstudio.ai/blog/claude-code-token-management-hacks
- buildtolaunch.substack.com/p/claude-code-token-optimization
- github.com/drona23/claude-token-efficient, github.com/ooples/token-optimizer-mcp

**Backend DeepSeek (evolução):**
- github.com/aattaran/deepclaude, github.com/MG-Cafe/claudecode-deepseek-stack
- api-docs.deepseek.com/guides/agent_integrations/claude_code

---

## 🗂️ INVENTÁRIO DO QUE FOI CRIADO (arquivos desta máquina em ~/.claude/)

**Config ativa:**
- `settings.local.json` — todas as otimizações (PASSO 1)
- `settings.json` (global) — plugins ECC/open-design + RTK PreToolUse hook
- `.env.token-saver` — env vars em formato shell (backup/referência)
- `CLAUDE.md`, `RTK.md` — versões terse

**Scripts (bônus, Git Bash):**
- `compress-bash-output.sh`, `trim-read-output.sh`, `load-notation.sh`
- `real-token-counter.sh`, `context-inflation-detector.sh`, `capture-response-size.sh`
- `auto-session-summary.sh`, `monitor-session-tokens.sh`
- `quick-switch-model.sh`, `run-token-optimized.sh`, `status-token-optimization.sh`

**No projeto:**
- `.claudeignore` (raiz do repo)

**Documentação (referência):**
- `MASTER-TOKEN-ECONOMY-SETUP.md` (ESTE arquivo — o único que importa guardar)
- `GITHUB-RESEARCH-FINDINGS.md`, `REALIDADE-VS-SIMULACAO.md`, `REAL-TOKEN-MEASUREMENT.md`
- `TOKEN_OPTIMIZATION_REPORT.md`, `IMPLEMENTATION_FINAL.md`, `AUTO_SESSION_MANAGER.md`
- `MODELO-STRATEGY.md`, `README-OPTIMIZATION.md`, `NOTATION.md`, `TOKEN_SAVINGS_CHECKLIST.md`

> Para reprogramar outra máquina: você só precisa deste arquivo. Ele contém todo o
> conteúdo necessário (settings, .claudeignore, CLAUDE.md, comandos). Os outros .md são
> histórico/detalhe.

---

## 🎯 PROMPT PRONTO — cole num Claude Code novo

> "Leia o arquivo MASTER-TOKEN-ECONOMY-SETUP.md. Execute o CHECKLIST DE AUTO-CONFIGURAÇÃO
> na ordem, do PASSO 1 ao 11. Priorize A+B+C (settings env vars, .claudeignore, RTK e MCP
> cleanup) que são 100% confiáveis. Trate as camadas D e E (scripts .sh de compressão e
> monitor) como bônus best-effort e me avise se Git Bash não estiver disponível. NÃO
> invente campos no settings.json — se a validação recusar um campo, remova-o. Ao final,
> rode /usage e me diga o consumo real, e liste o que ficou pendente de ação manual (ex:
> /mcp cleanup)."

---

**FIM. Este arquivo é auto-suficiente para reconfigurar qualquer Claude Code.**
