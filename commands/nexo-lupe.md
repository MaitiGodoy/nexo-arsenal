---
description: Loop micro em uma fase (5 tempos até passar no gauntlet). Lupe orquestra as tentativas; tardis orquestra as fases.
argument-hint: <fase.md> [--dimensionar|--estado|--volta PASS/FAIL]
---

**LUPE** — orquestra o loop **dentro** de uma fase.

Enquanto tardis orquestra o macro (fases 0-8), lupe orquestra o micro: as
tentativas até a fase passar no critério de aceite (gauntlet).

**OS 5 TEMPOS:**

| Tempo | Técnica | O que faz | Trava |
|-------|---------|-----------|-------|
| 1 | Chain-of-Draft | rascunho ≤5 linhas do que vai fazer, antes de tocar arquivo | 1 draft |
| 2 | Tree of Thoughts | ambiguidade? ≤3 candidatos, poda pra 1 | ≤3 candidatos, 1 nível |
| 3 | ReAct | executa e **observa saída real** | proibido simular |
| 4 | Gauntlet | prova objetiva (comando de aceite + N críticos do `grill.js`) | PASS/FAIL binário |
| 5 | Lição (DSPy offline) | FAIL vira lição de ≤3 linhas; volta 2 entra com ela | histórico de aprendizado |

**TRAVA:** `lupe_max_voltas` (default 3, em `motor/config.json`). Bateu a trava
→ `motor/blockage.js --fechar` e escreve dossiê.

**QUANDO USAR:**
- Fase com critério de aceite executável (comando, teste, prova objetiva)
- Fase não-trivial (>1 edição)
- Fase com dependências (versão menor da trava)

**QUANDO NÃO USAR:**
- Tarefa de 1 edição óbvia
- Fase sem critério executável → volte pro plano, reescreva a aceite

Leia `~/.claude/skills/lupe/SKILL.md` para o contrato completo.
