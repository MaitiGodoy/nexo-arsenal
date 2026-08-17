"""Roteador: tipo -> lista de skills. Lookup O(1) em router_config.json."""

import json
import os
from functools import lru_cache

_CONFIG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "router_config.json")


@lru_cache(maxsize=1)
def _carregar():
    with open(_CONFIG, encoding="utf-8") as fh:
        return json.load(fh)


def rota(tipo):
    """Retorna o dict completo da rota (descricao, skills, opcionais, aceite)."""
    rotas = _carregar()["rotas"]
    if tipo not in rotas:
        raise ValueError(f"tipo desconhecido: {tipo!r} (validos: {sorted(rotas)})")
    return rotas[tipo]


def route(tipo):
    """Retorna as skills obrigatorias do tipo, em ordem de execucao (copia)."""
    return list(rota(tipo)["skills"])


def opcionais(tipo):
    """Retorna as skills opcionais do tipo (copia)."""
    return list(rota(tipo).get("opcionais", []))


def aceite(tipo):
    """Retorna o criterio de aceite do tipo."""
    return rota(tipo)["aceite"]
