---
name: llm-free-first
description: "Token economy extrema: delegar TUDO que não precisa de LLM (SQL, regex, CLI, cache) antes de chamar modelo"
argument-hint: "analyze | refactor | plan | check"
license: MIT
---

# LLM-Free-First: Máxima Economia de Tokens

**Princípio**: antes de chamar qualquer LLM (Claude, Gemini, Groq, etc.), **gastar 2min pensando se realmente precisa de LLM**. 90% das tarefas não precisam.

```
LLM Call (1 token)
       ↑
    try estas PRIMEIRO:
       ↓
  ┌─────────────────────────────────────────┐
  │ 1. Cache/memoization (zero rede)        │
  │ 2. SQL query (local DB, rápido)         │
  │ 3. Regex/parsing (string ops)           │
  │ 4. CLI tool (curl, jq, grep, awk)       │
  │ 5. API determinística (sem ML)          │
  │ 6. Lookup table/dict (constantes)       │
  │ 7. Math/sorting/dedup (algoritmo)       │
  │ 8. Cache HTTP (ETag, 304)               │
  └─────────────────────────────────────────┘
       ↓ (se nenhuma delas der conta)
    chamar LLM
```

---

## 1️⃣ **Cache / Memoização** (GRÁTIS)

### Antes ❌
```python
def get_company_info(cnpj):
    # Chama LLM pra enriquecer sempre
    return llm.classify(cnpj)  # 50 tokens, toda vez
```

### Depois ✅
```python
# Memoize em Redis + TTL
@cache_ttl(key=f"company:{cnpj}", ttl=86400)  # 24h
def get_company_info(cnpj):
    # Cache hit → 0 tokens
    # Cache miss → LLM 1x, depois reutiliza
    return llm.classify(cnpj)

# Resultado: 1 token por CNPJ/dia, não por query
```

### Template
```python
import redis

redis_client = redis.Redis(host='redis', port=6379)

def cache_ttl(key, ttl=3600):
    def decorator(func):
        def wrapper(*args, **kwargs):
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            result = func(*args, **kwargs)
            redis_client.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator
```

---

## 2️⃣ **SQL Query** (LOCAL DB, < 10ms)

### Antes ❌
```python
# Buscar "qual empresa é fornecedora"
leads = llm.analyze_all_leads()  # 1000 leads × 100 tokens = 100k tokens 😱
```

### Depois ✅
```sql
-- Achada em 1ms, zero tokens
SELECT cnpj, razao_social, porte 
FROM rf_empresas 
WHERE cnae LIKE '4110%' AND porte IN ('EPP', 'MEDIO')
LIMIT 100;
```

### Template
```python
def find_suppliers(cnae_prefix, porte_list):
    """SQL + índice >> LLM"""
    query = """
        SELECT cnpj, razao_social, capital_social, porte
        FROM rf_empresas
        WHERE cnae LIKE %s
        AND porte = ANY(%s)
        AND situacao = 'ATIVA'
        ORDER BY capital_social DESC
        LIMIT 100
    """
    return db.execute(query, (f"{cnae_prefix}%", porte_list))
```

**Regra**: se cabe em SQL, não chamar LLM.

---

## 3️⃣ **Regex / String Parsing** (< 1ms)

### Antes ❌
```python
# Extrair CNPJ do texto
cnpj = llm.extract_cnpj(text)  # 20 tokens por documento
```

### Depois ✅
```python
import re
from brutils import CNPJ

def extract_cnpj(text):
    """Validar CNPJ com dígito verificador — zero LLM"""
    pattern = r'\b(\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}|\d{14})\b'
    matches = re.findall(pattern, text)
    
    valid_cnpjs = [
        m for m in matches 
        if CNPJ.is_valid(m)  # brutils, open source
    ]
    return valid_cnpjs
```

### Templates Built-in
```python
# Telefone
re.match(r'(\+55)?(\d{2})?9?\d{4}-?\d{4}', text)

# Email
re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email)

# CNAE (8 dígitos, com pontos)
re.match(r'^\d{4}-\d{1}\/\d{2}$', cnae)

# URL
re.match(r'https?://[^\s]+', text)

# Data (YYYY-MM-DD)
re.match(r'\d{4}-\d{2}-\d{2}', date_str)
```

---

## 4️⃣ **CLI Tools** (Shell, jq, curl, awk)

### Antes ❌
```python
# Processar JSON gigante
data = llm.transform_json(huge_file)  # timeout + tokens
```

### Depois ✅
```bash
# Shell — super rápido
jq '.[] | select(.status == "ATIVA") | {cnpj, razao_social}' data.json
```

### Template
```python
import subprocess
import json

def process_with_jq(json_file, jq_filter):
    """Usar jq ao invés de LLM pra transform JSON"""
    result = subprocess.run(
        ['jq', '-c', jq_filter],
        stdin=open(json_file),
        capture_output=True,
        text=True
    )
    return [json.loads(line) for line in result.stdout.strip().split('\n')]

# Uso
leads = process_with_jq('leads.json', '.[] | select(.fit_score > 50)')
```

### Outros tools
```bash
# Contar ocorrências
grep -c "padrão" arquivo.txt

# Transformar CSV
awk -F',' '{print $1, $3}' dados.csv

# Find + filter
find . -name "*.py" | xargs grep "def " | cut -d: -f1 | sort | uniq

# Combinar com yq (YAML parser)
yq '.database | .host' config.yaml
```

---

## 5️⃣ **Deterministic APIs** (sem ML, sem LLM)

### Antes ❌
```python
# Validar CNPJ — chamar LLM
is_valid = llm.validate_cnpj(cnpj)  # 10 tokens
```

### Depois ✅
```python
from brutils import CNPJ

# Validar CNPJ — algoritmo puro (0 tokens)
is_valid = CNPJ.is_valid(cnpj)

# Ou chamar API determinística (não ML)
response = requests.get(f"https://api.opencnpj.org/{cnpj}")
data = response.json()
```

### Templates
```python
# Validade de CNPJ (dígito verificador)
from brutils.cnpj import is_valid

# Formatar telefone (normalizar)
from brutils.phone import format_phone

# Validar email (regex + MX lookup)
import re
import dns.resolver
email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
has_mx = dns.resolver.resolve('domain.com', 'MX')

# Calcular idade empresa
from datetime import datetime
def company_age_years(data_abertura):
    return (datetime.now() - data_abertura).days / 365.25
```

---

## 6️⃣ **Lookup Tables / Dicts** (< 1ms)

### Antes ❌
```python
# Traduzir código de porte pra label
label = llm.translate_porte(porte_code)  # 5 tokens
```

### Depois ✅
```python
PORTE_MAP = {
    "MEI": "Microempreendedor Individual",
    "ME": "Micro Empresa",
    "EPP": "Empresa de Pequeno Porte",
    "MEDIO": "Empresa de Médio Porte",
    "GRANDE": "Empresa Grande"
}

label = PORTE_MAP.get(porte_code, "Desconhecido")  # 0 tokens
```

### Lookup Tables Built-in
```python
# Estados brasileiros
STATES = {"SP": "São Paulo", "RJ": "Rio de Janeiro", ...}

# CNAE principais
CNAE_PRINCIPAIS = {
    "4110-7": "Incorporação de empreendimentos imobiliários",
    "6920-7": "Atividades de consultoria em gestão empresarial",
    ...
}

# Segmentos NEXO
SEGMENTOS = {
    "GERIC": "Habitacional",
    "PSICO": "Psicologia",
    "IND": "Indústria",
    "EPC": "Engenharia/Construção",
    "INFRA": "Infraestrutura",
    "MCMV": "Minha Casa Minha Vida"
}

# Acesso
print(STATES.get("SP"))  # "São Paulo" — 0 tokens
```

---

## 7️⃣ **Math / Sorting / Dedup** (Algoritmo Puro)

### Antes ❌
```python
# Achar duplicatas de CNPJ
dupes = llm.find_duplicates(leads)  # 100 tokens
```

### Depois ✅
```python
from collections import defaultdict

def find_duplicate_cnpj_roots(leads):
    """Achar raízes de CNPJ duplicadas — 0 tokens"""
    roots = defaultdict(list)
    for lead in leads:
        root = lead['cnpj'][:8]  # Primeiros 8 dígitos (raiz)
        roots[root].append(lead)
    
    return {root: items for root, items in roots.items() if len(items) > 1}

# Resultado: dict com CNPJs raiz que aparecem 2x+
```

### Outros ejemplos
```python
# Ranking por fit_score
sorted_leads = sorted(leads, key=lambda x: x['fit_score'], reverse=True)

# Remover duplicatas mantendo primeiro
unique_by_cnpj = {lead['cnpj']: lead for lead in leads}.values()

# Contar ocorrências por segmento
from collections import Counter
segmento_counts = Counter(lead['segmento'] for lead in leads)

# Agrupar por área
from itertools import groupby
by_area = {k: list(g) for k, g in groupby(leads, key=lambda x: x['area'])}
```

---

## 8️⃣ **HTTP Cache** (304 Not Modified)

### Antes ❌
```python
# Buscar dados toda vez
data = requests.get("https://api.example.com/data").json()
```

### Depois ✅
```python
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def cached_get(url):
    """HTTP com cache — reutiliza 304 Not Modified"""
    session = requests.Session()
    
    # Retry + backoff
    retry = Retry(total=3, backoff_factor=1)
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    
    headers = {}
    # Se já fetched antes, passa ETag
    cached = cache_get(f"etag:{url}")
    if cached:
        headers['If-None-Match'] = cached
    
    response = session.get(url, headers=headers, timeout=5)
    
    if response.status_code == 304:
        # 304 Not Modified — retorna cache
        return cache_get(f"data:{url}")
    
    # Novo dado — salva + retorna
    if 'ETag' in response.headers:
        cache_set(f"etag:{url}", response.headers['ETag'])
    
    data = response.json()
    cache_set(f"data:{url}", data, ttl=86400)
    return data
```

---

## 🎯 Checklist: LLM-Free-First

Antes de chamar LLM:

- [ ] **Existe em cache?** → Redis hit = 0 tokens
- [ ] **Existe em DB?** → SELECT = 0 tokens
- [ ] **É regex/parse?** → Regex = 0 tokens
- [ ] **É lookup table?** → Dict = 0 tokens
- [ ] **É algoritmo?** → Python = 0 tokens
- [ ] **É determinístico?** → API não-ML = 0 tokens
- [ ] **É CLI tool?** → jq/awk/grep = 0 tokens
- [ ] **É HTTP com cache?** → 304 = 0 tokens

Se **nenhuma** dessas bate, aí sim chama LLM.

---

## Exemplos Reais: Prospector

### Validação de Lead
```python
def validate_lead(lead):
    """Zero LLM, puro SQL + regex"""
    errors = []
    
    # 1. Regex (0 tokens)
    if not re.match(r'^\d{14}$|^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$', lead['cnpj']):
        errors.append("CNPJ formato inválido")
    
    # 2. Validar dígito verificador (0 tokens)
    if not CNPJ.is_valid(lead['cnpj']):
        errors.append("CNPJ dígito verificador inválido")
    
    # 3. SQL (0 tokens)
    existe = db.query(
        "SELECT 1 FROM leads WHERE cnpj_raiz = %s AND data_criacao > NOW() - INTERVAL '180 days'",
        (lead['cnpj'][:8],)
    )
    if existe:
        errors.append("Lead duplicado dentro de 180 dias")
    
    # 4. Lookup table (0 tokens)
    if lead['porte'] not in ["EPP", "MEDIO"]:
        errors.append("Porte fora de escopo")
    
    return {'valid': len(errors) == 0, 'errors': errors}
```

**Total**: 0 tokens | 5ms

---

### Enriquecimento de Lead
```python
def enrich_lead(lead):
    """Combinar dados locais, cache, APIs livres — SÓ DEPOIS chamar LLM"""
    
    # 1. Cache (0 tokens se hit)
    cached = redis.get(f"enriched:{lead['cnpj']}")
    if cached:
        return json.loads(cached)
    
    # 2. SQL lookup (0 tokens)
    rf_data = db.query(
        "SELECT * FROM rf_empresas WHERE cnpj = %s",
        (lead['cnpj'],)
    )
    
    # 3. API grátis (CNPJ) — sem LLM
    cnpj_data = requests.get(f"https://api.opencnpj.org/{lead['cnpj']}").json()
    
    # 4. Lookup table (0 tokens)
    segmento = SEGMENTOS.get(lead['area'], 'DESCONHECIDO')
    
    # 5. Algoritmo (0 tokens)
    idade_anos = (datetime.now() - rf_data['data_abertura']).days / 365.25
    
    # 6. **SÓ AGORA** chamar LLM se realmente precisar de análise
    if need_briefing:
        briefing = llm.generate_briefing(lead, rf_data, cnpj_data)  # 1 token
    else:
        briefing = None
    
    enriched = {
        **lead,
        **rf_data,
        **cnpj_data,
        'segmento': segmento,
        'idade_anos': idade_anos,
        'briefing': briefing
    }
    
    # Cache pra próxima
    redis.setex(f"enriched:{lead['cnpj']}", 86400, json.dumps(enriched))
    
    return enriched
```

**Total**: 1 token (só se briefing) | 50ms (vs 500+ tokens se tudo via LLM)

---

## Comandos

```bash
# Analisar código pra achar chamadas LLM desnecessárias
/llm-free-first analyze [file|dir]

# Refatorar função removendo LLM onde possível
/llm-free-first refactor [function]

# Planejar fluxo LLM-free
/llm-free-first plan [tarefa]

# Validar que função é realmente LLM-free
/llm-free-first check [function]
```

---

## Economia Real: NEXO Prospector

| Tarefa | Abordagem | Tokens | Tempo | Custo |
|--------|-----------|--------|-------|-------|
| Validar 100 leads | LLM | 5000 | 30s | R$0.50 |
| Validar 100 leads | LLM-Free (regex+SQL) | 0 | 100ms | R$0.00 |
| Enriquecer 100 leads | LLM | 50000 | 5min | R$5.00 |
| Enriquecer 100 leads | Cache+SQL+API | 100 | 2s | R$0.01 |
| **Potencial/mês** | | **100k-500k tokens** | | **R$100-500** |
| **Com LLM-Free** | | **10-100 tokens** | | **R$0.10-1.00** |
| **Economia** | | **99%** | | **99%** |

---

## Regra de Ouro

> **Cada chamada de LLM NÃO deve ser um vício. Deve ser uma decisão consciente: "tentei de graça (SQL/regex/cache), não deu, agora LLM".**

Se você está chamando LLM 100x/dia, pergunta:
- Posso cachear? (99% sim)
- Posso SQL? (95% sim)
- Posso regex? (85% sim)

Se a resposta é sim pra uma delas, você tá gastando tokens de graça.

---

**Invoke quando:**
- Começando novo feature (planejar LLM-free ANTES de codar)
- Auditando custo de token (achar where com LLM desnecessário)
- Refatorando pra produção (remover LLM, adicionar cache/SQL)
- Escalando (cada LLM call desnecessário × 10x workers = desastre de custo)

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
