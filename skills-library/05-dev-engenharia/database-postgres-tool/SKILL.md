---
name: database-postgres-tool
description: Opera o Postgres+pgvector dos sistemas NEXO (Prospector, Jobs, CRM) — consultas, migrations, import/export, checagem de integridade. Use quando precisar consultar leads, rodar migration, verificar duplicata de CNPJ, exportar dados ou investigar o banco. Trigger com "consulta o banco", "quantos leads", "roda a migration", "exporta os leads", "tem duplicado?".
---

# Postgres Tool — NEXO

Banco único servindo os 3 sistemas. Postgres + **pgvector**, em Docker na VPS.

## Usage
"quantos leads sem telefone?" · "roda a migration 003" · "exporta leads de SP pra csv"
· "tem CNPJ duplicado?"

## What I Need From You
- **Query de leitura** → nada, execute.
- **Migration / UPDATE / DELETE** → confirmação + qual ambiente (prod é o padrão, cuidado).
- Se a pergunta for ambígua ("os leads"), pergunte o recorte (UF? área? período?).

## Ambiente
| Item | Valor |
|---|---|
| Acesso | `docker exec -i postgres psql -U <user> -d financial` |
| Extensão | pgvector (embeddings dos leads) |
| Tabelas core | `leads` · `leads_historico` · `rf_empresas` · `execucoes` · `diario_licencas` · `sinais_mcmv` |
| Migrations | `migrations/001_schema.sql`, `002_mcmv.sql`, `003_sinais_mcmv.sql` |
| Conexão app | `DATABASE_URL` no `.env` |

## Regras de negócio que o banco reflete (não violar)
- `leads.cnpj` é **UNIQUE**; índice em `cnpj_raiz` (8 primeiros dígitos).
- **Lead sem telefone não entra.** `SELECT count(*) FROM leads WHERE telefone IS NULL` deve ser **0**.
- Dedup por **raiz de CNPJ** contra `leads` **e** `leads_historico` (janela `DEDUP_JANELA_DIAS`).

## Workflow

### 1. Alcançar o banco
```bash
docker exec -i postgres psql -U user -d financial -c "SELECT 1;"
```
Falhou → checar container (`docker ps | grep postgres`) antes de concluir qualquer coisa.

### 2. Explorar antes de assumir schema
```sql
\dt                                    -- tabelas
\d+ leads                              -- colunas reais
SELECT count(*) FROM leads;            -- volume
```
**Nunca escreva query contra coluna que você não confirmou que existe.**

### 3. Rodar a query
Leitura → direto. Escrita → `BEGIN;` … inspeciona … `COMMIT;`/`ROLLBACK;`

### 4. Migration (quando for o caso)
```bash
docker exec -i postgres psql -U user -d financial < migrations/00X_nome.sql
```
Antes: backup da tabela afetada. Migrations aqui são **idempotentes** — reexecutar não pode duplicar.

### 5. Validate Before Presenting
- Confira invariantes: telefone nulo = 0? raiz duplicada entre `leads` e `leads_historico` = 0?
- Número que surpreende (0 ou muito alto) → **investigue antes de reportar**, pode ser query errada.
- Mostre a query que rodou junto do resultado.

## Output Format
```sql
-- <query executada>
```
```
<resultado real>
```
→ <leitura em 1 linha + alerta se violar invariante>

## Examples
**"tem lead sem telefone?"**
```sql
SELECT count(*) FROM leads WHERE telefone IS NULL;
```
```
 count
-------
     0
```
→ 0 — invariante do projeto respeitada (lead sem telefone não entra).

**Checar dedup:**
```sql
SELECT l.cnpj_raiz FROM leads l
JOIN leads_historico h USING (cnpj_raiz)
LIMIT 5;
```
→ vazio = dedup íntegro.

## Constraints
- **Sem `DROP`/`TRUNCATE`/`DELETE` sem confirmação explícita.** Prod não tem undo.
- `UPDATE`/`DELETE` sempre com `WHERE` — e rode o `SELECT` equivalente antes pra ver o escopo.
- Query pesada: use `LIMIT`. A VPS é pequena, não derrube o banco dos 3 sistemas.
- Não hospedar a base RF completa (~20GB) — o modelo é consultivo, fatia curada só.
