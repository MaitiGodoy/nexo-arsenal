# msg-economy — Economizar tokens em mensagens

**Problema:** Messages = 50%+ do orçamento (vs tool execution).  
**Solução:** 7 técnicas que reduzem 60–80% sem sacrificar qualidade.

## Checklist

| # | Técnica | Ganho | Implementação |
|---|---------|-------|---|
| 1 | **Ultra-terse** | ~15% | Sem intro/outro; 1 frase/update; silêncio = OK |
| 2 | **Batch prompts** | ~20% | 5 perguntas → 1 lista (evita overhead olá/entendi) |
| 3 | **Input via arquivo** | ~25% | Prompt longo → BRIEF.md em disco, `Read` depois |
| 4 | **Subagentes Haiku** | ~30% | `explore` (varredura), `verifier` (aceite) |
| 5 | **Clear entre fases** | ~10% | `/clear` quando plano em disco (janela não incha) |
| 6 | **Memory compacta** | ~5% | `/consolidate-memory` (remove duplicatas) |
| 7 | **Modo `spec`** | ~20% | Dense blueprint (1 pág) vs narrativa (3 pág) |

## Aplicar hoje

**Imediato:**
1. Ultra-terse (já ativo)
2. Batch perguntas em 1 lista
3. Input longo → arquivo

**Próxima sessão:**
4. Subagentes Haiku pra varredura
5. `/clear` entre fases
6. Modo spec pra blueprints

**Impacto:** 60–80% redução acumulativa em message tokens.

---

Invocar: `/nexo-paidocriss msg-economy` (sob demanda, P3).

[GERADO POR CREATOR — 2026-08-15]

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
