# paidocriss v2.0 — GAUNTLET (3 Críticos)

## Crítico 1: Narration Detector
**Teste:** Rodar `/nexo-paidocriss task` em sessão limpa. Analisar stdout.
- ✓ PASS: Nenhuma frase começa com "I'll", "Let me", "Analyzing", "Reading"
- ✗ FAIL: Detecta narração (hook falhou)

**Método:** `grep -E "^(I'll|Let me|I'm going|Analyzing|Reading|Getting|Fetching|Running)" <stdout>`

## Crítico 2: MSG-Economy Compliance
**Teste:** Rodar `/nexo-paidocriss msg-economy`. Output deve ser checklist de 7 técnicas.
- ✓ PASS: Checklist gerado, cada item tem ✓ ou ✗, reason documentada
- ✗ FAIL: Checklist ausente, razões vazias, ou técnicas missing

**Método:** Validar contra motor/hooks-config.json `checklist` array.

## Crítico 3: Ledger Audit
**Teste:** Após `/nexo-paidocriss close`, examinar `~/.claude/.paidocriss/LEDGER-YYYY-MM-DD.json`.
- ✓ PASS: Contém eventos de Prompt Caching, RTK, isolamento-carga, savings-report. Sem GAP.
- ✗ FAIL: Eventos missing, GAP encontrado, timestamps inválidos

**Método:** `jq '.events | length' <ledger>` deve ser > 0, `.errors` deve ser [].

---

## Status v2.0
- [ ] Hook 1 (PrePromptGeneration) roda
- [ ] Hook 2 (PostToolUse) roda
- [ ] Hook 3 (Stop) roda
- [ ] MSG-Economy checklist gerado
- [ ] Crítico 1 PASS
- [ ] Crítico 2 PASS
- [ ] Crítico 3 PASS
- [ ] Lint R1–R22 PASS
- [ ] PROVENIENCIA.json atualizada

[GAUNTLET_v2 — 2026-08-15]
