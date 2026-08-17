---
name: profissionalizar
description: "Profissionaliza um projeto: varre codigo por violacoes (print, except:pass, secrets hardcoded, healthcheck trojan, CORS [*], .bak, .dockerignore) e corrige. Inclui criacao do vault Obsidian."
argument-hint: "[caminho-do-projeto] [--vault-only] [--check-only] [--no-vault]"
---

# /profissionalizar

Profissionaliza qualquer projeto aplicando as regras descobertas na limpeza de 6 projetos em producao.

**Uso:**
```
/profissionalizar                                  # projeto atual (cwd)
/profissionalizar /caminho/do/projeto              # projeto especifico
/profissionalizar --check-only                     # so analisa, nao modifica
/profissionalizar --vault-only                     # so adiciona vault Obsidian
/profissionalizar --no-vault                       # profissionaliza sem vault
```

---

## Regras aplicadas (checklist completo)

### 1. Higiene de codigo Python

| Regra | O que procura | Correcao |
|-------|---------------|----------|
| `print()` em producao | `print(` em arquivos .py | Substituir por `logger.info()` / `logger.error()` com structlog |
| `except: pass` | `except:`, `except Exception:`, `.catch(() => {})` | Logar com `exc_info=True` |
| `except Exception: pass` | bloco vazio apos except | Adicionar log |
| Bare `except:` | `except:` sem Exception type | Trocar para `except Exception:` |
| Healthcheck trojan | `True else 1` ou `true ? 0 : 1` | Substituir por chamada real ao endpoint |
| CORS `["*"]` | `allow_origins=["*"]` ou `origin: '*'` | Trocar para env var `CORS_ORIGINS` |
| Secret hardcoded | `api_key = "..."` ou `password = "..."` em .py/.ts | Mover para .env + config.py |
| URL hardcoded | `https://api.exemplo.com` no codigo | Mover para env var + config.py |

### 2. Estrutura de projeto

| Item | O que verifica | Acao |
|------|----------------|------|
| `.dockerignore` | Existe? Tem __pycache__, .env, .git, .venv? | Criar com template padrao |
| `.gitignore` | Existe? Tem .env, *.bak, __pycache__, .qwen? | Criar com template padrao |
| `.env.example` | Existe? Tem todas as vars sem valores reais? | Criar do .env existente |
| `.env` permissoes | `chmod 600`? | Corrigir |
| `pyproject.toml` | Existe com ruff, mypy? | Criar template |
| `requirements.txt` | Existe? Tem structlog, httpx? | Adicionar dependencias faltando |

### 3. Arquivos mortos / lixo

| Item | Acao |
|------|------|
| `*.bak`, `*.backup` no working tree | `git rm --cached` + .gitignore |
| `*.sql` (dump) no projeto | Mover para /root/backups/ |
| `__pycache__/` | Deletar + .gitignore |
| `.qwen/` | Deletar + .gitignore |
| `.venv/`, `node_modules/` | Verificar .gitignore |
| Arquivos de teste mortos (`dbg3.py`, `test_*.py` soltos) | Deletar |
| `.env.backup*` com credenciais | Deletar IMEDIATAMENTE |

### 4. Logging

| Item | Acao |
|------|------|
| Nao tem `logging_setup.py` | Criar com structlog |
| Nao tem `structlog` no requirements | Adicionar |
| `console.log()` em JS/TS | Substituir por logger |
| `.catch(() => {})` | Adicionar tratamento de erro |

### 5. Docker

| Item | Acao |
|------|------|
| `healthcheck:` faltando | Adicionar com chamada real |
| `mem_limit:` faltando | Adicionar 512m |
| `restart:` sem `unless-stopped` | Corrigir |
| `ports:` sem `127.0.0.1:` | Adicionar bind localhost |
| `logging:` faltando | Adicionar log rotation |
| Nao-root user no Dockerfile | Adicionar `adduser --system app` + `USER app` |

### 6. CLAUDE.md

| Item | Acao |
|------|------|
| Nao existe CLAUDE.md | Criar com regras (Claude build-only, codigo seguro, etc.) |
| Existe mas sem regras | Adicionar secoes faltando |

### 7. Segundo cerebro (Obsidian vault)

Sempre chamado a menos que `--no-vault` seja passado.

| Item | Acao |
|------|------|
| Nao tem `obsidian/` | Copiar vault template + scripts |
| Nao tem `scripts/vault.sh` | Copiar do template |
| Nao tem `scripts/vault_writer.py` | Copiar do template |
| VAULT_ROOT no .env | Adicionar se faltando |
| Prompt do worker inclui aprendizado pos-execucao? | Adicionar passo de escrita no vault |

---

## Execucao

### Fase 0: Diagnostico (`--check-only`)

Mostra tudo que viola as regras acima, sem modificar nada. Exemplo de saida:

```
[CHECK] print() encontrado em: src/main.py:42, src/worker.py:15
[CHECK] except: pass em: src/score.py:88
[CHECK] CORS ["*"] em: src/api.py:10
[CHECK] .dockerignore faltando
[CHECK] .bak files: dados.bak, config.bak
[CHECK] Nao tem obsidian/ (vault faltando)
```

### Fase 1: Correcao automatica

Aplica todas as correcoes:

1. **Substitui `print()` por logging** — adiciona `from src.logging_setup import logger`, troca `print(` por `logger.info(`, `logger.error(`, etc.
2. **Corrige `except:`** — adiciona `logger.error("...", exc_info=True)` em blocos vazios
3. **Corrige healthcheck trojan** — `True else 1` → chamada real `/health`
4. **Corrige CORS** — `["*"]` → `os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")`
5. **Remove .bak, .sql, __pycache__, .qwen**
6. **Cria .dockerignore, .gitignore, pyproject.toml, .env.example** (se faltando)
7. **Adiciona logging_setup.py** com structlog
8. **Cria config.py** com env vars centralizadas
9. **Corrige Dockerfile** (non-root, healthcheck real)
10. **Corrige docker-compose.yml** (mem_limit, log rotation, localhost bind)

### Fase 2: Vault Obsidian

Chamada a menos que `--no-vault`:

1. Copia `obsidian/` do vault-template para o projeto
2. Copia `scripts/vault.sh` + `scripts/vault_writer.py`
3. Semeia entidades conhecidas baseado no codigo existente (tabelas do banco, endpoints da API, servicos do docker-compose)
4. Adiciona `VAULT_ROOT=./obsidian` ao `.env`

### Fase 3: Verificacao pos-correcao

1. Syntax check: `python -c "compile(open('f.py').read(), 'f.py', 'exec')"`
2. Se tiver Dockerfile: `docker compose build --dry-run` (ou so syntax check)
3. `vault.sh --lint` para verificar saude do vault
4. `git status` para mostrar o que mudou

---

## Vault template

O vault template esta em `/root/projects/vault-template/obsidian/`. Estrutura:

```
obsidian/
├── 00-INDEX.md               ← MOC mestre
├── 10-EPHEMERA/              ← Inbox, execucoes, raw sources
├── 20-CONHECIMENTO/          ← Entidades, processos, conceitos
├── 30-PROJETOS/              ← Ativo / Finalizados
├── 40-SISTEMAS/              ← Cada sistema tem seu MOC
├── 50-DECISOES/              ← ADRs
├── 60-INSIGHTS/              ← Padroes, objecoes, erros, metricas
├── 70-RUNBOOKS/              ← Deploy, rollback, diagnosticos
├── 80-ARQUIVO/               ← Projetos + decisoes arquivados
└── 90-SISTEMA/               ← SCHEMA.md regras, templates, SCRIPTS/vault.sh
```

Scripts em `scripts/`:
- `vault.sh` — CLI que a LLM chama em runtime pra escrever notas
- `vault_writer.py` — Wrapper Python com `VaultWriter.write_insight()`, `write_execucao()`
- `init-project.py` — Scaffold completo (Docker + logging + vault) pra projetos novos

---

## Referencias

- Regras profissionais: `90-SISTEMA/90.01-SCHEMA.md` no vault
- Templates de nota: `90-SISTEMA/90.01-TEMPLATES/` (entidade, decisao, insight, execucao, runbook)
- Runbooks de operacao: `70-RUNBOOKS/` (deploy, rollback, diagnosticos, recuperacao-banco)
- Vault template source: `/root/projects/vault-template/`

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
