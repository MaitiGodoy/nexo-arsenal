---
name: nexo-n8n-workflow-builder
description: Cria e edita workflows n8n do stack NEXO — cron, HTTP nodes, webhooks, notificação Discord/Telegram. Use quando precisar agendar o robô, montar automação nova, importar workflow, ou debugar execução que falhou. Trigger com "cria um workflow", "agenda o prospector", "monta automação no n8n", "o workflow falhou", "importa o workflow".
---

# n8n Workflow Builder — NEXO

n8n roda em Docker na VPS e agenda os workers do Prospector. Workflow de referência:
`n8n/financial.workflow.json` (parâmetros: **área** + **UF**).

## Usage
"agenda o GERIC pra rodar 6h/6h em SP" · "monta workflow que notifica no Discord"
· "por que a execução de ontem falhou?"

## What I Need From You
- **Gatilho**: cron (qual frequência?) ou webhook?
- **Parâmetros**: área (GERIC/PSICO/EPC/INFRA/MCMV/CONSTRUTORAS) e UF.
- **Saída**: só grava no banco, ou notifica (Discord/Telegram)?
Faltou algum → **pergunte**, não assuma frequência nem área.

## Anatomia de um workflow NEXO
```
[Schedule Trigger]  cron (ex: 0 */6 * * *)
      ↓
[HTTP Request]      chama o worker → run.py --area X --uf Y
      ↓
[IF]                deu erro? → ramo de alerta
      ↓
[HTTP Request]      Discord webhook / Telegram bot
```

## Workflow

### 1. Ver o que já existe antes de criar
```bash
docker exec n8n n8n list:workflow            # workflows atuais
cat n8n/financial.workflow.json | head -40   # o de referência
```
**Reaproveite o `financial.workflow.json`** — clonar e trocar parâmetro é mais seguro
que montar do zero.

### 2. Montar o JSON
Estrutura mínima de um node:
```json
{
  "parameters": { "rule": { "interval": [{ "field": "hours", "hoursInterval": 6 }] } },
  "name": "Schedule",
  "type": "n8n-nodes-base.scheduleTrigger",
  "position": [250, 300]
}
```
Nodes ligam por `connections` (nome → nome). Node órfão não roda e não avisa.

### 3. Importar
```bash
docker exec -i n8n n8n import:workflow --input=/tmp/wf.json
```
Ou via UI. **Workflow importado nasce inativo** — precisa ativar.

### 4. Ativar e conferir
```bash
docker exec n8n n8n update:workflow --id=<ID> --active=true
docker logs --tail 30 n8n
```

### 5. Debugar execução que falhou
```bash
docker logs --tail 100 n8n | grep -iE "error|fail"
```
Causa nº1 aqui: **credencial/env faltando** no container (não é o JSON). Cheque
`.env` antes de reescrever workflow. → skill `env-config-manager`.

### 6. Validate Before Presenting
- JSON é **válido**? (`python -m json.tool < wf.json`)
- Todo node está **conectado**? Órfão falha em silêncio.
- Workflow ficou **ativo**? Importar ≠ ativar.
- Rodou **uma vez de teste** antes de deixar no cron?

## Output Format
```
[n8n] <workflow> (id: N)
  trigger: cron 0 */6 * * *
  nodes: Schedule → HTTP(run.py --area GERIC --uf SP) → IF → Discord
  status: ativo | inativo
```
→ 1 linha: o que passa a acontecer e quando roda a próxima vez.

## Examples
**"agenda o GERIC 6h/6h em SP"**
```
[n8n] prospector-geric-sp (id: 12)
  trigger: cron 0 */6 * * *   (00h, 06h, 12h, 18h)
  nodes: Schedule → HTTP(run.py --area GERIC --uf SP) → IF erro → Discord
  status: ativo — testado 1x, retornou 200
```

## Constraints
- **Não ative workflow sem rodar teste manual** — cron quebrado gasta cota de API grátis à toa.
- **Idempotência**: reexecução não pode duplicar lead nem re-gastar cota (regra de ouro do projeto).
- Credencial **nunca** hard-coded no JSON — usa credential do n8n ou env.
- Não criar workflow que rode a cada minuto: as APIs grátis têm rate limit (ReceitaWS ~3/min).
- Antes de sobrescrever workflow existente: **exporte o atual** (`n8n export:workflow`).

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
