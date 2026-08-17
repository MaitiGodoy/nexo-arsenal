---
name: scalability-by-design
description: "Arquitetura pra escala desde day-1: monolítico → modular → distribuído, sempre pronto pra 'ligar a chave'"
argument-hint: "audit | design | review | checklist | migrate"
license: MIT
---

# Scalability by Design

Tudo que você faz — mesmo que pareça minimalista ou pessoal — **deve estar estruturado pra escalar**. A ideia é não refatorar depois; estruturar desde o início pra que a transição monolítico → modular → distribuído seja **transparente e sem redesenho**.

## Core Principle

```
┌─ HOJE: Monolítico (1 container/VM, 1 DB)
│  └─ código modular, SQL idempotente, APIs internas
│
├─ AMANHÃ: Modular (N workers, 1 DB central)
│  └─ trocar import → RPC/HTTP, manter lógica
│
└─ FUTURO: Distribuído (N workers, N BDs, message queue)
   └─ trocar DB.query() → cache/replicação, manter interface
```

**Zero refactoring entre fases.** Só "ligar/desligar" camadas de infra.

---

## Checklist de Escalabilidade

### 1️⃣ **Código**
- [ ] Funções **puras** (sem side effects): `f(x) → y` sempre, nunca `f(x) → y + log global`
- [ ] **Stateless**: se precisar de estado, mete em Redis/DB, não em memória local
- [ ] **Idempotência**: `run_twice() == run_once()` — job que roda 2x não duplica nada
- [ ] **Retry-safe**: cada operação de rede tem timeout + backoff exponencial
- [ ] **Batch-ready**: funções aceitam `list[T]` além de `T`, pra batch later
- [ ] **Logging estruturado**: todo evento tem `correlation_id` + timestamp + contexto (sem print)
- [ ] **Config via env**: zero hardcoded (endpoints, credenciais, limites)

### 2️⃣ **Database**
- [ ] **Migrations versionadas**: `migrations/001_schema.sql`, `002_indexes.sql`, etc.
- [ ] **Índices preemptivos**: antes de query lenta, adicionar índice (não esperar produção reclamar)
- [ ] **UNIQUE constraints**: impedir duplicação na origem (raiz CNPJ, email, etc.)
- [ ] **Soft deletes** se fizer sentido: `deleted_at TIMESTAMP` + filtros `WHERE deleted_at IS NULL`
- [ ] **Particionamento planejado**: se tabela vai ficar > 1GB, já deixar schema com `PARTITION BY`
- [ ] **Connection pooling**: `min_connections = N workers`, não `1 conexão por thread`

### 3️⃣ **APIs/RPC**
- [ ] **Versionagem**: `/api/v1/...` não `api/...` (quando mudar, v2 coexiste)
- [ ] **Timeout + retry**: cada chamada HTTP tem `timeout=5s` e `retry(max=3, backoff=exp)`
- [ ] **Pagination built-in**: `/api/v1/leads?page=1&limit=100` mesmo que hoje tenha 50 registros
- [ ] **Rate limit headers**: response inclui `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- [ ] **Circuit breaker**: se dependência falha 5x em 1min, pula pra fallback (não cascata de erro)

### 4️⃣ **Async/Fila**
- [ ] **Tasks idempotentes**: `process_lead(id)` rodando 2x = mesmo resultado
- [ ] **Dead letter queue**: mensagem que falha 3x vai pra DLQ, não desaparece
- [ ] **Job status tracking**: banco registra `status: PENDING/RUNNING/DONE/FAILED` + log de erro
- [ ] **Timeout em jobs**: se job roda > 5min, mata + retry (não travado forever)

### 5️⃣ **Observabilidade**
- [ ] **Structured logging**: `{"level":"error","service":"prospector","job_id":"123","error":"...","timestamp":"2026-07-12T...Z"}`
- [ ] **Métricas**: counter (jobs processados), gauge (fila pendente), histogram (latência)
- [ ] **Distributed tracing**: `correlation_id` passa de request → queue → worker → DB
- [ ] **Alertas**: CPU > 80%, fila > 1000, latência p99 > 2s

### 6️⃣ **Deploy**
- [ ] **Blue-green ou canary**: não pega 100% do tráfego na v2 direto
- [ ] **Rollback automático**: se error rate sobe > 5%, volta pra v1
- [ ] **Database migrations**: rodar antes do deploy (backward compatible se possível)
- [ ] **Health checks**: `/health` retorna `{status: healthy, db: ok, redis: ok}`

---

## Exemplo: Prospecção NEXO

### HOJE (Monolítico)
```python
# prospector/run.py
def rodar_mcmv(uf):
    leads_raw = pncp.fetch(uf)
    leads = filter_dedup(leads_raw)  # SQL local
    for lead in leads:
        score = score_lead(lead)  # import local
        briefing = briefing_py.montar(lead)  # import local
        leads.insert(lead)
        notify_discord(lead)
```

**Estrutura escalável DESDE JÁ:**
- [ ] `score_lead()` é **pura** (recebe dict, retorna score, sem DB write)
- [ ] `briefing_montar()` é **pura** (sem side effects)
- [ ] `leads.insert()` é **idempotente** (UNIQUE cnpj, ON CONFLICT DO NOTHING)
- [ ] `notify_discord()` tem **retry** (se falhar, requeue em Redis)
- [ ] Config em `.env`: `PSICO_CAPITAL_MIN=100000` (não hardcoded)

### AMANHÃ (Modular)
```python
# worker_score.py — roda em container separado
def score_worker():
    while True:
        lead = queue.pop("leads.raw")  # Redis queue
        score = score_lead(lead)  # mesma função pura
        queue.push("leads.scored", {**lead, score})

# worker_briefing.py — container separado
def briefing_worker():
    while True:
        lead = queue.pop("leads.scored")
        briefing = briefing_montar(lead)  # mesma função pura
        db.update(lead.id, briefing=briefing)  # idempotente
```

**Muda**: importar → fila, tudo mais igual. Zero refactoring de lógica.

### FUTURO (Distribuído)
```yaml
# kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: worker-score
spec:
  replicas: 5  # scale horizontal
  template:
    spec:
      containers:
      - name: score
        image: prospector:score-worker-v1
        env:
        - name: REDIS_URL
          value: redis-cluster:6379
        - name: DB_REPLICA_URL
          value: pg-replica-1:5432  # read-only, escalado
```

**Muda**: SQL local → read-only replica, container count, tudo mais igual. Redis já existe (v1).

---

## Playbook: Auditando Código Legado

Quando herdar um projeto que "parece monolítico", rodar:

```bash
/scalability-by-design audit
```

Vai procurar:
1. **Hardcoded endpoints** → mover pro `.env`
2. **Funções com side effects** → refatorar pra puras
3. **Sem logging estruturado** → adicionar correlation_id
4. **Queries sem índice** → sugerir índices
5. **Sem retry logic** → adicionar exponential backoff
6. **Sem migration versionada** → criar migrations/

---

## Caso de Uso: JOBS (CEO IA)

**Hoje**: 1 script Python rodando no host  
**Amanhã**: N workers (executor, monitor, logger) rodando em n8n containers  
**Futuro**: Workers distribuídos, DB replicado, cache distribuído

**Ação NOW**: estruturar pra isso desde day-1
- [ ] Job status em DB (não em memória)
- [ ] Cada job tem `job_id` + `correlation_id`
- [ ] Logs vão pro banco (SQL, não arquivo)
- [ ] Config via env (não hardcoded)
- [ ] Retry automático (3x com backoff)

Quando chegar o momento de escalar, é só:
```bash
docker-compose scale worker=10
# fim
```

---

## Caso de Uso: CRM NEXO

**Estrutura escalável desde day-1:**
- [ ] Lead CRUD via API (não SQL direto em HTML)
- [ ] Auth middleware (OAuth2 token, não session cookie)
- [ ] Async email (Brevo webhook, não `send()` bloqueante)
- [ ] Read replicas prontas (`DB_PRIMARY` vs `DB_REPLICA_URLS`)
- [ ] Healthcheck em `/api/v1/health` + liveness probe

Quando for pra 10k leads/dia, é só trocar infra, código não muda.

---

## Comandos Disponíveis

```bash
# Auditar código
/scalability-by-design audit [file|dir]

# Gerar checklist pra novo projeto
/scalability-by-design design [tipo: api|worker|full]

# Review de PR antes de merge
/scalability-by-design review [--pr NUMBER]

# Planejar migração monolítico → modular
/scalability-by-design migrate [--from monolith --to modular]

# Gerar Dockerfile + docker-compose.yml escalável
/scalability-by-design template [tipo]
```

---

## Stack Recomendado (já na VPS)

| Layer | Tech | Motivo |
|-------|------|--------|
| Code | Python 3.9+ | async-ready, stateless |
| Queue | Redis | idempotência, retry, TTL |
| DB | PostgreSQL | ACID, indexes, read replicas |
| Async | n8n | workflow orchestration |
| Logs | stdout (JSON) | container-friendly |
| Metrics | Prometheus | scrape-based (stateless) |
| Monitor | Grafana | read-only dashboards |

---

## Regra de Ouro

> **Se algo funciona localmente (monolítico), mas quebra distribuído, a culpa é do design, não da infraestrutura.**

Portanto: **estruture HOJE pra escalar AMANHÃ sem tocar em código.**

---

**Invoke esta skill quando:**
- Começando novo projeto/feature
- Antes de PR review (verificar escalabilidade)
- Planejando migração (monolítico → modular → distribuído)
- Auditando código legado (encontrar tech debt de escalabilidade)
