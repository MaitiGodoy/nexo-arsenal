"""Testes do roteador nexo-market: classify() + route() + nexo_market()."""

import json
import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from classifier import TIPOS, classify  # noqa: E402
from router import route  # noqa: E402
from main import nexo_market, resumo  # noqa: E402


# --- classify: happy path por tipo -------------------------------------------

@pytest.mark.parametrize(
    "texto,esperado",
    [
        ("create google ads campaign for product launch", "campaign"),
        ("criar campanha de anúncios no Meta com orçamento de 5k", "campaign"),
        ("audit my Google Ads account performance", "audit-internal"),
        ("auditoria da conta de ads do cliente", "audit-internal"),
        ("audit competitor ads and positioning", "audit-competitor"),
        ("benchmark dos concorrentes no mercado", "audit-competitor"),
        ("SEO audit for the site", "site-seo"),
        ("melhorar ranqueamento e schema markup do site", "site-seo"),
        ("pipeline forecast for Q4", "sales-pipeline"),
        ("qualificar leads e revisar o CRM", "sales-pipeline"),
        ("escrever post de blog sobre o produto", "content"),
        ("newsletter e carrossel para o lançamento", "content"),
    ],
)
def test_classify_retorna_tipo_esperado(texto, esperado):
    assert classify(texto) == esperado


def test_classify_cobre_os_seis_tipos():
    assert set(TIPOS) == {
        "campaign",
        "audit-internal",
        "audit-competitor",
        "site-seo",
        "sales-pipeline",
        "content",
    }


def test_classify_sem_match_retorna_none():
    assert classify("consertar o servidor de banco de dados") is None


@pytest.mark.parametrize("entrada", ["", "   ", None, 123])
def test_classify_entrada_invalida_levanta(entrada):
    with pytest.raises(ValueError):
        classify(entrada)


# --- route -------------------------------------------------------------------

@pytest.mark.parametrize("tipo", TIPOS)
def test_route_retorna_skills_validas(tipo):
    skills = route(tipo)
    assert isinstance(skills, list)
    assert len(skills) >= 1
    assert all(isinstance(s, str) and s.startswith("/") for s in skills)


def test_route_tipo_desconhecido_levanta():
    with pytest.raises(ValueError):
        route("tipo-que-nao-existe")


def test_route_e_pura():
    assert route("campaign") == route("campaign")
    primeira = route("campaign")
    primeira.append("/lixo")
    assert "/lixo" not in route("campaign")


# --- nexo_market (orquestração) ----------------------------------------------

def test_nexo_market_saida_serializavel():
    saida = nexo_market("create google ads campaign for product launch")
    assert saida["tipo"] == "campaign"
    assert len(saida["skills"]) >= 1
    assert saida["needs_llm"] is False
    assert saida["aceite"]
    json.dumps(saida)  # não pode levantar


def test_nexo_market_sem_match_pede_llm():
    saida = nexo_market("consertar o servidor de banco de dados")
    assert saida["tipo"] is None
    assert saida["skills"] == []
    assert saida["needs_llm"] is True
    assert "campaign" in saida["prompt_llm"]


def test_resumo_uma_linha():
    linha = resumo(nexo_market("create google ads campaign for product launch"))
    assert linha.startswith("Tipo: campaign | Skills: /ads-plan")
    assert "\n" not in linha


def test_resumo_vazio_quando_precisa_llm():
    assert resumo(nexo_market("consertar o servidor de banco de dados")) == ""


def test_nexo_market_entrada_vazia_levanta():
    with pytest.raises(ValueError):
        nexo_market("")


# --- config ------------------------------------------------------------------

def test_router_config_tem_todos_os_tipos():
    caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), "router_config.json")
    with open(caminho, encoding="utf-8") as fh:
        cfg = json.load(fh)
    assert set(cfg["rotas"]) == set(TIPOS)
    for tipo, rota in cfg["rotas"].items():
        assert rota["skills"], tipo
