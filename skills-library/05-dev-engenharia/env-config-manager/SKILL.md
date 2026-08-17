---
name: nexo-env-config-manager
description: Gerencia .env, chaves de API e configuração nos 6 ambientes NEXO (local, Skills Maestro, VPS Claude/Qwen/OpenCode, projetos). Use quando faltar variável, chave estiver vazia causando falha silenciosa, ou precisar propagar config entre ambientes. Trigger com "falta a chave", "cadê a env", "a API key tá vazia", "configura o .env", "propaga a config".
---

# Env Config Manager — NEXO

Config espalhada por 6 ambientes. O erro mais caro aqui é **chave vazia que falha em
silêncio** — o robô roda, não acha nada, e ninguém sabe por quê.

## Usage
"a SERPER_API_KEY tá configurada?" · "propaga o .env pra vps" · "por que o
websearch não retorna nada?" · "quais chaves faltam?"

## What I Need From You
- **Auditar/ler** → nada, execute.
- **Gravar chave nova** → o valor (nunca invente/adivinhe chave).
- **Propagar** → quais ambientes (padrão: todos os 6).

## Mapa dos ambientes
| Ambiente | Config |
|---|---|
| Local Claude | `~/.claude/settings.json` (`env`) + `~/.env` |
| VPS Claude CLI | `/root/.claude/settings.json` + `/root/.env` |
| VPS Qwen | `/root/.qwen/settings.json` |
| VPS OpenCode | `/opt/open-code/settings.json` |
| Projetos | `/opt/{prospector,jobs,crm-nexo}/.env` |
| Proxy | `~/.claude/deepseek-proxy/deepseek.key` |

## Chaves que importam (e o que quebra sem elas)
| Chave | Sem ela | Grátis? |
|---|---|---|
| `DATABASE_URL` | nada roda | — |
| `SERPER_API_KEY` | **telefone-fallback morre → lead descartado** (falha silenciosa clássica) | 2500 créditos |
| `NVIDIA/CEREBRAS/GROQ/GEMINI_API_KEY` | llm_router sem provider → scoring para | sim |
| `DEEPSEEK_API_KEY` | proxy não roteia → NEXOFLOW quebra | pago-barato |
| `TRANSPARENCIA_API_KEY` | risco.py sem sanções | grátis c/ cadastro |
| `DISCORD_WEBHOOK_URL` / `TELEGRAM_*` | roda mas ninguém é avisado | sim |

## Workflow

### 1. Auditar o que existe (nunca assuma)
```bash
grep -E "^[A-Z_]+=" ~/.env | sed 's/=.*/=<set>/'      # nomes, sem vazar valor
```

### 2. Caçar chave vazia — a falha silenciosa
```bash
grep -E "^[A-Z_]+=$" ~/.env   # linhas com chave SEM valor = bomba-relógio
```
Chave declarada e vazia é **pior que ausente**: o código acha que tem, chama a API,
recebe 401, e engole o erro. Se achar, **reporte como bloqueador**, não como aviso.

### 3. Gravar / atualizar
```bash
# nunca sobrescreve o arquivo inteiro; edita a linha
sed -i 's|^SERPER_API_KEY=.*|SERPER_API_KEY=<valor>|' ~/.env
```
Não existe a linha? Faça append. **Backup antes** (`cp ~/.env ~/.env.bak`).

### 4. Propagar
```bash
bash ~/.claude/scripts/install-everywhere.sh config   # config completa
```
VPS offline → reporte quais ambientes ficaram pendentes, não finja sucesso.

### 5. Validate Before Presenting
- Chave gravada **responde de verdade**? Teste com 1 request real quando possível.
- `settings.json` continua **JSON válido**? (`python -m json.tool < settings.json`)
- Chave duplicada em dois lugares com valor diferente? Aponte qual vence.

## Output Format
```
[ambiente] arquivo
  CHAVE=<set|VAZIA|ausente>
```
→ veredito: o que está bloqueando + o que fazer.
**Nunca imprima o valor da chave.** Só `<set>` / `<vazia>`.

## Examples
**"por que o websearch não acha telefone?"**
```
[local] ~/.env
  SERPER_API_KEY=<VAZIA>   ← bloqueador
```
→ Chave declarada mas vazia: o worker chama Serper, toma 401, descarta o lead por
"sem telefone". Não é bug do código — é config. Precisa da chave de serper.dev.

## Constraints
- **Nunca ecoar valor de chave** em output, log ou commit.
- **Nunca inventar/adivinhar** valor de chave — peça ao usuário.
- `.env` **nunca** vai pro git. Confira o `.gitignore` antes de commitar.
- Não trocar chave paga por grátis sem avisar (restrição do projeto: custo R$0).
- Ao editar `settings.json`: cuidado com **chave duplicada** — a última vence e apaga
  a primeira em silêncio (já quebrou o `rtk hook` uma vez desse jeito).

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
