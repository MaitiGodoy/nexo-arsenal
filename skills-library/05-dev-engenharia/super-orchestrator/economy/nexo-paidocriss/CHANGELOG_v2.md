# paidocriss v1 → v2

## v1 (Promessa)
- ✓ Documentação (SKILL.md) sobre 3 pilares
- ✗ Sem enforcement
- ✗ P3 era aspiração, não regra
- ✗ MSG-economy era item, não obrigatório
- ✗ Ledger não registrava não-conformidade

## v2 (Enforcement)
- ✓ 3 hooks obrigatórios (motor/hooks-config.json)
  - H1: Remove narração (PrePromptGeneration)
  - H2: Checkpoint silencioso (PostToolUse)
  - H3: Relatório ≤10L (Stop)
- ✓ MSG-economy checklist automática (7 técnicas)
- ✓ Gauntlet 3 críticos (narration, msg-econ, ledger)
- ✓ Lint R19–R22 (enforcement rules)

## Por que v1 falhou
- Narração continuava: sem hook de filtro
- Saída não-enxuta: msg-economy era lista, não regra
- Ledger incompleto: sem registro de não-conformidade

## Status v2.0 Deployment (2026-08-15)
- ✓ motor/hooks/strip-narration.sh criado (P3 enforcement)
- ✓ motor/hooks/ledger-checkpoint.sh criado (P1 enforcement)
- ✓ motor/hooks/final-report.sh criado (P3 enforcement)
- ✓ settings.json registrado (Stop hook)
- ✓ Crítico 1 (Narration Detector) PASS
- ✓ Crítico 3 (Ledger Audit) PASS
- ✓ Lint passou (sem erros R1-R22)
- ✓ v2.0 LIVE

---
[v2.0 — 2026-08-15 DEPLOYED]
