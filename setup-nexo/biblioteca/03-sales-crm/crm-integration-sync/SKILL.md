---
name: crm-integration-sync
description: Sincroniza dados entre Prospector, CRM NEXO e Jobs — export de leads qualificados, mensagens WhatsApp/Evolution, status de pipeline. Use quando precisar mandar lead pro CRM, investigar lead que não chegou, checar sync de mensagens, ou entender o fluxo entre os 3 sistemas. Trigger com "exporta pro crm", "manda os leads", "o lead não chegou", "sincroniza", "cadê a mensagem".
---

# CRM Integration Sync — NEXO

Os 3 sistemas compartilham o mesmo Postgres, mas **não se enxergam automaticamente**.
Esta skill cuida do fluxo entre eles.

## Usage
"exporta os leads de SP pro CRM" · "por que esse lead não apareceu no CRM?"
· "as mensagens do WhatsApp estão sincronizando?"

## What I Need From You
- **Export** → recorte (UF/área/período) + **destino confirmado** (o export é visível
  e escolhe destino; não assuma).
- **Investigar** → o CNPJ ou o ID do lead.

## Topologia (não confundir)
| Sistema | Path | Papel |
|---|---|---|
| Prospector | `/opt/prospector` | gera lead qualificado (`leads`) |
| CRM NEXO | `/opt/crm-nexo` | trabalha o lead (cadência, WhatsApp) |
| Jobs (CEO IA) | `/opt/jobs` | enxerga o Prospector; orquestra |
| Evolution API | container | WhatsApp do CRM |

**⚠ Legado:** o `crm-exporter` automático foi **aposentado**. Não é o CRM real.
Export hoje é **com visibilidade + escolha de destino** — se achar código chamando o
crm-exporter antigo, é resíduo, reporte em vez de usar.

## Workflow

### 1. Confirmar o que já existe antes de sincronizar
```sql
SELECT count(*) FROM leads WHERE exportado_em IS NULL;   -- fila de export
SELECT count(*) FROM leads_historico;                     -- já saiu (nunca repete)
```
Lead em `leads_historico` **não deve** ser reexportado — dedup vale no export também.

### 2. Export — idempotente, sempre
```sql
BEGIN;
SELECT cnpj, razao_social, telefone, decisor, fit_score, briefing
  FROM leads
 WHERE uf = %s AND exportado_em IS NULL
 ORDER BY fit_score DESC;
-- ao confirmar entrega:
UPDATE leads SET exportado_em = now() WHERE cnpj = ANY(%s);
INSERT INTO leads_historico SELECT ... ON CONFLICT DO NOTHING;
COMMIT;
```
**Reexecutar não pode duplicar nem re-gastar cota** (regra de ouro do projeto).

### 3. Lead "não chegou no CRM" — ordem de investigação
1. Existe em `leads`? Não → problema é do **Prospector** (foi descartado — veja `lead-data-validator`).
2. Existe e `exportado_em IS NULL`? → está na **fila**, export não rodou.
3. `exportado_em` preenchido mas não aparece no CRM? → problema de **ingestão do CRM**.
Não pule etapas: 90% das vezes o lead foi descartado na origem, não "sumiu".

### 4. Mensagens / Evolution (WhatsApp)
```bash
docker ps | grep evolution
docker logs --tail 50 evolution | grep -iE "conflict|replaced|error"
```
Histórico conhecido: `loop conflict/replaced` já teve **2 causas raiz corrigidas**
(tsunami de histórico; status-check reiniciando handshake em voo). O container é
`docker run` manual → recriar **só** com `/root/scripts/recreate-evolution.sh`.
Não recrie na mão, você perde a config.

### 5. Validate Before Presenting
- Contagem exportada **bate** com a inserida em `leads_historico`?
- Nenhum lead exportado **duas vezes**? (`SELECT cnpj FROM leads_historico GROUP BY 1 HAVING count(*)>1`)
- Todo exportado tem **telefone** e **decisor**? (senão o CRM recebe lead inútil)

## Output Format
```
[export <recorte>] N leads → <destino>
  fila antes: N | exportados: N | já no histórico (skip): N
  ✓ nenhum duplicado | ✓ todos com telefone+decisor
→ <o que a Letícia recebe e onde>
```

## Examples
**"o lead 12.345.678/0001-90 não chegou"**
```
1. leads: não encontrado
2. leads_historico: não encontrado
→ Não foi descartado no export — nunca virou lead. Motivo provável: filtro de
  entrada (sem telefone / porte ME / fit baixo). Ver execucoes do dia.
```

## Constraints
- **Export é ação com destino** — confirme o destino antes de disparar. Não exporte "pra
  todo lugar" por padrão.
- **Nunca** reexportar lead que já está em `leads_historico` (regra: lead nunca repete).
- Não usar o `crm-exporter` automático (legado/aposentado).
- Não mexer no container Evolution na mão — use `recreate-evolution.sh`.
- Dado de lead é dado pessoal B2B: LGPD, legítimo interesse, opt-out respeitado.
