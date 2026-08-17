---
description: Crítica paralela do plano — roda até 5 agentes contra .tardis/PLAN_<projeto>.md e consolida em .tardis/GRILL_<projeto>.md. Primeira linha PLANO_OK ou PLANO_REFAZER.
argument-hint: (nenhum — lê .tardis/PLAN_<projeto>.md do cwd)
---

# /nexo-grill — Crítica Paralela do Plano

Orquestra até 5 críticos especializados em paralelo contra o plano. Consolida veredito: PLANO_OK ou PLANO_REFAZER.

## Fluxo

1. Ler projeto e plano: `.tardis/PLAN_<projeto>.md`
2. Chamar `node $TARDIS_DIR/motor/grill.js` → roteiro[] (2-5 críticos)
3. Invocar cada crítico em **paralelo** (Agent com subagent_type)
4. Consolidar em `.tardis/GRILL_<projeto>.md`
5. Primeira linha: exatamente `PLANO_OK` ou `PLANO_REFAZER`

## Passo 1 — Projeto

Bash: `echo "$TARDIS_PROJETO"` (sufixo de arquivo de estado).

## Passo 2 — Ler plano e gerar roteiro

Bash:
```bash
TARDIS_DIR="${HOME}/.claude/skills/tardis"
export TARDIS_DIR
node "$TARDIS_DIR/motor/grill.js" ".tardis/PLAN_${TARDIS_PROJETO}.md"
```

Saída: JSON com `roteiro[]` — cada crítico tem `{id, agente, procura}`.

## Passo 3 — Invocar críticos em paralelo

Para cada item de `roteiro[]`, abra um Agent:
- `subagent_type: <agente>` (e.g., "security-reviewer", "planner", "explore", "diff-reviewer", "verifier")
- Prompt: `procura` + "Veredito PASS/FAIL. Listar achados como arquivo:linha ou escrever 'sem achado'."

Rodar TODOS em paralelo (uma chamada Agent por crítico).

Cada crítico devolve JSON:
```json
{
  "id": "seguranca",
  "veredito": "PASS",
  "achados": []
}
```

## Passo 4 — Consolidar GRILL_<projeto>.md

Escreva `.tardis/GRILL_<projeto>.md`:

```markdown
PLANO_OK

## Crítico: security-reviewer
**Veredito:** PASS
Achados: (sem achado)

## Crítico: planner
**Veredito:** PASS
Achados: (sem achado)
```

**Regra crítica:** primeira linha é EXATAMENTE `PLANO_OK` (todos PASS) ou `PLANO_REFAZER` (qualquer FAIL).

## Passo 5 — Saída

Mostra veredito (primeira linha de GRILL_<projeto>.md). Se `PLANO_REFAZER`, lista achados por crítico.
