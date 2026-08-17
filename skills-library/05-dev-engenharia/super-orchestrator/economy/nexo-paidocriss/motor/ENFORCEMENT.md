# v2.0 Enforcement — TDAH Obrigatório

**Estado:** LIVE (gauntlet ✓)

## 3 Hooks OBRIGATÓRIOS

| Gancho | Trigger | Ação | Arquivo |
|--------|---------|------|---------|
| **1** | UserPromptSubmit | Detecta narração antes de enviar | `strip-narration.sh` |
| **2** | PostToolUse | Registra em silêncio no ledger | `ledger-checkpoint.sh` |
| **3** | PostToolUse | Valida 7 técnicas msg-economy | `msg-economy-check.sh` |
| **4** | Stop | Relatório final ≤10 linhas | `final-report.sh` |

## Validação (Gauntlet)

```bash
bash ~/.claude/skills/nexo-paidocriss/motor/gauntlet.sh
```

- Exit 0 = Todos os hooks OBRIGATÓRIOS estão ativos
- Exit 1 = Alguma regra falhou (ver output)

## Ledger (Prova)

Localização: `~/.claude/.paidocriss/LEDGER-YYYY-MM-DD.jsonl`

Cada evento é registrado:
- `narration_detected` = Saída tinha narração
- `msg_economy_fail` = Técnica #N não foi usada
- `tool_complete` = Tool executou OK

## 7 Técnicas Obrigatórias (MSG-Economy)

1. **Ultra-terse** — Sem intro/outro; 1 frase por update; silêncio = OK
2. **Batch prompts** — Perguntas múltiplas em 1 lista
3. **Input via arquivo** — Prompt longo → BRIEF.md em disco
4. **Subagentes Haiku** — `explore`, `verifier` para varredura
5. **Clear entre fases** — `/clear` quando plano em disco
6. **Memory compacta** — Consolidar duplicatas
7. **Modo spec** — Dense blueprint (1 pág) vs narrativa

## Como Funciona

```
Você escreve prompt
  ↓
[UserPromptSubmit] strip-narration.sh roda
  ↓ (detecta narração? Registra no ledger silencioso)
Prompt enviado
  ↓
Tool executa
  ↓
[PostToolUse] 3 hooks rodam:
  1. ledger-checkpoint.sh → registra evento
  2. msg-economy-check.sh → valida 7 técnicas
  3. compress-bash-output.sh → compacta Bash
  ↓
[Stop] final-report.sh
  ↓
Relatório ≤10 linhas + ledger salvo
```

## Próxima Sessão

Rodar:
```bash
/nexo-paidocriss status
```

Mostra:
- GAPs não conformes
- Contagem de eventos
- Savings acumulados

