# Instalando paidocriss v2.0

## Passo 1: Ativar Hooks no settings.json

Adicione ao seu `.claude/settings.json`:

```json
{
  "hooks": [
    {
      "trigger": "PrePromptGeneration",
      "script": "~/.claude/skills/paidocriss/motor/hooks/strip-narration.sh",
      "enabled": true
    },
    {
      "trigger": "PostToolUse",
      "script": "~/.claude/skills/paidocriss/motor/hooks/ledger-checkpoint.sh",
      "enabled": true
    },
    {
      "trigger": "Stop",
      "script": "~/.claude/skills/paidocriss/motor/hooks/final-report.sh",
      "enabled": true
    }
  ]
}
```

## Passo 2: Criar Ledger Directory

```bash
mkdir -p ~/.claude/.paidocriss
chmod 700 ~/.claude/.paidocriss
```

## Passo 3: Verificar Instalação

```bash
/nexo-paidocriss status
# Esperado: ✓ ledger OK · ✓ hooks loaded · ✓ gauntlet ready
```

## Passo 4: Rodar Gauntlet

```bash
motor/lint-paidocriss.js . --mode v2
# Esperado: exit 0 (R1–R22 PASS)
```

## Rollback (se necessário)

```bash
# v2 → v1 (comentar hooks em settings.json)
# Ledger fica intacto para auditoria posterior
```

## Status

✓ v2.0 pronta para deploy  
✓ 3 hooks configuráveis  
✓ MSG-economy automático  
✓ Gauntlet pronto
