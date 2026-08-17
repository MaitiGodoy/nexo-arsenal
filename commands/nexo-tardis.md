---
description: Orquestra tarefa multi-step (novo ciclo ou continuação congelada). Passos −1 a 7 (9 no total) obrigatórios. Red Team briefing + Design validação integrada.
argument-hint: <descrição da tarefa> [--continue|--resume|--phase N|--dry-run]
---

**NOVO CICLO:**
Tarefa: $ARGUMENTS

Retomará o protocolo tardis completo (9 passos): passo −1 (detecta continuação)
→ passo 0 (economia) → passo 1 (briefing Red Team 5-moves: challenge/test/gap/assume/anticipate)
→ passo 1.5 (design validação, se UI) → passo 2-7 (planejamento, grill,
execução+lupe integrado, verify, completude, entrega+festa).

**CONTINUAÇÃO:**
```
/nexo-tardis --continue
```
Detecta plano aberto via `motor/continuacao.js`. Plano **CONGELADO** — não refaz
briefing, design, plano, grill. Segue da `proxima_fase` até a última fase.

**OPÇÕES:**
- `--phase N` — pular pra fase N (debug apenas)
- `--resume` — alias para `--continue`
- `--dry-run` — roda tudo menos execução real

Leia `~/.claude/skills/tardis/SKILL.md` para entender os 9 passos (−1 a 7).
