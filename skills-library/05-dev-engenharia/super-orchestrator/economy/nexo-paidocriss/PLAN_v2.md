# paidocriss v2.0 — Refazer com Enforcement

## Briefing
**Problema:** v1 é documentação (SKILL.md) sem enforcement de hooks. P3 (Output cirúrgico) não roda automático. msg-economy não é obrigatório.

**Solução:** v2.0 com 3 hooks + MSG-ECONOMY checklist automático.

## Sketch

### Hook 1: PrePromptGeneration
- Remove narração "agora vou...", "deixa eu..."
- Detecta padrões: "I'll", "Let me", "I'm going to"
- Substitui por ação silenciosa no ledger

### Hook 2: PostToolUse
- After CADA tool call: registra em LEDGER apenas
- Não outputa "Running...", "Found...", "Completed..."
- Só informa si houve GAP (erro silencioso)

### Hook 3: Stop (Fim sessão)
- Consolida relatório ≤10 linhas
- Gasta-economizado + ledger
- Sem resumo explicativo

### MSG-ECONOMY Checklist
Antes de outputar mensagem:
1. Ultra-terse (≤50 chars)? ✓
2. Batch tools (não 1x1)? ✓
3. Input-file (não inline)? ✓
4. Subagente poderia fazer? ✓
5. Silêncio melhor? ✓
6. Ledger-only? ✓
7. Um-liners (exit 0)? ✓

## Estrutura v2.0
```
paidocriss/
├── SKILL.md (v2.0 + enforcement explain)
├── motor/
│   ├── hooks-config.json (3 hooks)
│   ├── msg-economy-checklist.sh
│   ├── lint-v2.js (R1–R18 + R19–R22 enforcement)
│   └── auto-maint.sh
├── embedded/
│   ├── hooks/ (pré-scripts de enforcement)
│   └── PROVENIENCIA.json
└── GAUNTLET.md (3 críticos: narração?, msg-economy?, ledger-ok?)
```

## Exits
- `0` = v2 pronta, lint pass, hooks instaladas, Gauntlet PASS
- `1` = config invalid (hooks não suportados no harness)
- `2` = regra v1→v2 revertida (fallback seguro)

## Invariantes (I1–I12 + enforcement)
- **I13:** P3 forçada por hook (não prompt)
- **I14:** MSG-ECONOMY checklist automático
- **I15:** Ledger não depende de narração do user
