"""nexo-market: entrada NL -> tipo -> skills a invocar. Saida JSON."""

import json
import sys

from classifier import TIPOS, classify
from router import aceite, opcionais, route

_PROMPT_LLM = (
    "Classifique a demanda de marketing abaixo em EXATAMENTE um destes tipos "
    "e responda so o tipo:\n"
    + "\n".join(f"- {t}" for t in TIPOS)
    + "\n\nDemanda: {entrada}"
)


def nexo_market(entrada):
    """Classifica a entrada e devolve as skills a invocar (JSON-serializavel)."""
    tipo = classify(entrada)  # levanta ValueError se entrada invalida

    if tipo is None:
        return {
            "entrada": entrada,
            "tipo": None,
            "skills": [],
            "opcionais": [],
            "aceite": None,
            "needs_llm": True,
            "prompt_llm": _PROMPT_LLM.format(entrada=entrada),
        }

    return {
        "entrada": entrada,
        "tipo": tipo,
        "skills": route(tipo),
        "opcionais": opcionais(tipo),
        "aceite": aceite(tipo),
        "needs_llm": False,
        "prompt_llm": None,
    }


def resumo(saida):
    """Uma linha para embutir em prompt/log. Vazio quando nao classificou."""
    if saida["needs_llm"]:
        return ""
    return "Tipo: {} | Skills: {}".format(saida["tipo"], " ".join(saida["skills"]))


def main(argv):
    for fluxo in (sys.stdout, sys.stderr):  # console cp1252 do Windows quebra acento
        try:
            fluxo.reconfigure(encoding="utf-8")
        except (AttributeError, OSError):
            pass
    args = argv[1:]
    modo_resumo = "--resumo" in args
    args = [a for a in args if a != "--resumo"]

    if not " ".join(args).strip():
        print('uso: python main.py [--resumo] "<demanda de marketing>"', file=sys.stderr)
        return 2
    try:
        saida = nexo_market(" ".join(args))
    except ValueError as err:
        print(f"erro: {err}", file=sys.stderr)
        return 2

    print(resumo(saida) if modo_resumo else json.dumps(saida, ensure_ascii=False, indent=2))
    return 1 if saida["needs_llm"] else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
