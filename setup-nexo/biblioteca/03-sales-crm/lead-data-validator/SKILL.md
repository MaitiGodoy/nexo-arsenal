---
name: lead-data-validator
description: Valida e sanitiza dados de lead do Prospector NEXO — telefone (obrigatório, precisa ser WhatsApp do dono), CNPJ (dígito verificador + raiz), porte, situação cadastral e dedup. Use quando for gravar lead, auditar qualidade da base, investigar lead descartado, ou checar se as regras de ouro estão sendo respeitadas. Trigger com "valida o lead", "esse lead presta?", "tem lead sem telefone", "checa duplicado", "por que descartou".
---

# Lead Data Validator — Prospector NEXO

Guarda as **regras invioláveis** do projeto. Lead que fura qualquer uma delas não entra —
sem exceção, sem "quase".

## Usage
"esse lead presta?" · "tem lead sem telefone na base?" · "por que esse CNPJ foi descartado?"
· "audita a qualidade dos leads de SP"

## What I Need From You
- **Validar 1 lead** → o CNPJ (ou o registro).
- **Auditar base** → recorte (UF? área? período?). Se não disser, pergunte — a base é grande.
- Nunca invente telefone, CNPJ ou sócio pra "completar" um lead. Faltou → descarta.

## As regras de ouro (não negociáveis)

| # | Regra | Consequência |
|---|---|---|
| 1 | **Telefone obrigatório** | Sem telefone após RF + fallback web → **DESCARTA** |
| 2 | Telefone deve ser **WhatsApp do dono**, não da loja/central | Telefone de loja = lead fraco, marcar |
| 3 | **Lead nunca repete** | Raiz de CNPJ (8 primeiros díg.) já em `leads` ou `leads_historico` (janela `DEDUP_JANELA_DIAS`) → **skip** |
| 4 | `situacao != 'ATIVA'` | **DESCARTA** |
| 5 | `porte` ∈ {MEI, ME} | **DESCARTA** (só EPP/MEDIO) — exceto MCMV (SPE nova nasce sem porte) |
| 6 | `fit_score < FIT_SCORE_MIN` | **DESCARTA** |
| 7 | Domínio de notícia/blog/rede social/portal gov | **nunca vira lead** |

LinkedIn do dono é **desejável, não bloqueia**.

## Workflow

### 1. Normalizar antes de validar
```python
from brutils import is_valid_cnpj, format_cnpj, is_valid_phone
cnpj = ''.join(filter(str.isdigit, cnpj_raw))   # só dígitos
raiz = cnpj[:8]                                  # raiz = chave de dedup
```
Use **`brutils`** (já é dependência do projeto) — não escreva regex de CNPJ na mão.
Regex cru não valida dígito verificador e deixa passar CNPJ inventado.

### 2. Validar CNPJ de verdade
```python
if not is_valid_cnpj(cnpj):   # confere dígito verificador
    return DESCARTE("cnpj_invalido")
```

### 3. Telefone — o filtro que mais descarta
```python
if not telefone:
    telefone = fallback_web(razao_social, municipio)   # Serper Maps / SearXNG
if not telefone or not is_valid_phone(telefone):
    return DESCARTE("sem_telefone")   # regra 1 — sem choro
```
**Atenção à falha silenciosa:** se `SERPER_API_KEY` estiver vazia, o fallback retorna
nada e o lead é descartado por "sem telefone" — quando o problema é **config**, não o lead.
Antes de concluir "a base é ruim", cheque a chave (→ skill `env-config-manager`).

### 4. Dedup por raiz
```sql
SELECT 1 FROM leads WHERE cnpj_raiz = %s
UNION ALL
SELECT 1 FROM leads_historico
 WHERE cnpj_raiz = %s AND exportado_em > now() - interval '%s days';
```
Achou → **skip** (não é erro, é dedup funcionando).

### 5. Validate Before Presenting
Rode as invariantes antes de dar veredito:
```sql
SELECT count(*) FROM leads WHERE telefone IS NULL;          -- DEVE ser 0
SELECT cnpj_raiz FROM leads GROUP BY 1 HAVING count(*) > 1; -- DEVE ser vazio
SELECT count(*) FROM leads WHERE situacao <> 'ATIVA';       -- DEVE ser 0
SELECT count(*) FROM leads WHERE porte IN ('MEI','ME');     -- DEVE ser 0 (exceto MCMV)
```
Qualquer uma quebrada = **bug no pipeline**, reporte como bloqueador.

## Output Format
**Lead único:**
```
CNPJ 12.345.678/0001-90 — <razão social>
  ✓ CNPJ válido (DV ok)   ✓ ATIVA   ✓ EPP   ✓ telefone (11) 9xxxx-xxxx
  ⚠ telefone parece central, não WhatsApp do dono
→ APROVADO (fit 72) | DESCARTADO (motivo: <regra N>)
```
**Auditoria:**
```
Base <recorte>: N leads
  sem telefone: 0 ✓ | raiz duplicada: 0 ✓ | não-ATIVA: 0 ✓ | MEI/ME: 0 ✓
→ íntegra | ⚠ <invariante quebrada> = bug no pipeline
```

## Constraints
- **Nunca "salvar" lead incompleto** inventando dado. Descarte é resultado válido.
- Descarte **não é bug** — é o filtro funcionando. Muitos descartes seguidos → investigue
  a *fonte* (chave vazia? CNAE errado?), não afrouxe a regra.
- Não afrouxar porte/telefone "pra render mais lead". A regra existe porque lead ruim
  custa mais caro que lead nenhum.
- LGPD: só dado manifestamente público (Art. 7º §4º). Opt-out registrado.
- MCMV é a exceção de porte — SPE recém-aberta nasce sem porte classificado.
