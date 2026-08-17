"""Classificador de entrada NL -> tipo de demanda de marketing.

llm-free-first: 100% regex. Sem I/O, sem rede, sem estado. Se nenhum padrao
casa, retorna None e quem chama decide escalar para LLM (ver main.nexo_market).
"""

import re

TIPOS = (
    "campaign",
    "audit-internal",
    "audit-competitor",
    "site-seo",
    "sales-pipeline",
    "content",
)

_AUDIT = r"audit|auditor|revis[aã]o|health\s*check|diagn[oó]stic"
_CONTA = r"conta|account|campanha|campaign|ads|an[uú]ncio|verba|or[cç]amento|budget|spend"

# Ordem importa: o primeiro match vence. Mais especifico primeiro.
_PADROES = (
    (
        "audit-competitor",
        (
            r"concorrent|competitor|competiti|rival|benchmark|share\s+of\s+voice",
            r"espionar|swipe\s*file|ad\s*librar",
        ),
    ),
    (
        "audit-internal",
        (
            rf"(?:{_AUDIT}).{{0,40}}(?:{_CONTA})",
            rf"(?:{_CONTA}).{{0,40}}(?:{_AUDIT})",
            r"desperd[ií]cio|wasted\s+spend|onde\s+estou\s+queimando",
        ),
    ),
    (
        "site-seo",
        (
            r"\bseo\b|\bserp\b|\bsge\b|\baso\b",
            r"schema\s*markup|sitemap|hreflang|core\s+web\s+vitals|robots\.txt|canonical",
            r"org[aâ]nic|ranquea|ranking|indexa|palavra[- ]chave|keyword|backlink",
            r"arquitetura\s+do?\s+site|site\s+architecture",
        ),
    ),
    (
        "sales-pipeline",
        (
            r"pipeline|forecast|previs[aã]o\s+de\s+vendas|quota|deal\b|neg[oó]cia[cç]",
            r"\bcrm\b|revops|prospec|outbound|cadence|cad[eê]ncia",
            r"\bleads?\b|\bmql\b|qualifica[cç][aã]o",
            r"funil\s+de\s+vendas|sales\s+funnel",
        ),
    ),
    (
        "campaign",
        (
            r"\bads?\b|an[uú]ncio|campanha|campaign|m[ií]dia\s+paga|paid\s+(?:media|social|search)",
            r"google\s+ads|meta\s+ads|facebook\s+ads|instagram\s+ads|tiktok|linkedin\s+ads",
            r"\bcpa\b|\broas\b|\bcpc\b|\bctr\b|lance|bidding",
            r"or[cç]amento\s+de\s+m[ií]dia|budget\s+de\s+m[ií]dia",
        ),
    ),
    (
        "content",
        (
            r"conte[uú]do|content|blog|artigo|post\b|newsletter|substack",
            r"carrossel|carousel|reel|v[ií]deo|roteiro|script",
            r"copy\b|copywriting|headline|cta\b",
            r"social|instagram|linkedin|e-?mail\s+(?:sequence|marketing)|sequ[eê]ncia\s+de\s+e-?mail",
        ),
    ),
)

_COMPILADOS = tuple(
    (tipo, tuple(re.compile(p, re.IGNORECASE) for p in padroes))
    for tipo, padroes in _PADROES
)


def classify(texto):
    """Retorna o tipo da demanda, ou None se nenhum padrao casar.

    Levanta ValueError se `texto` nao for string nao-vazia.
    """
    if not isinstance(texto, str) or not texto.strip():
        raise ValueError("entrada deve ser uma string nao-vazia")

    for tipo, regexes in _COMPILADOS:
        if any(rx.search(texto) for rx in regexes):
            return tipo
    return None
