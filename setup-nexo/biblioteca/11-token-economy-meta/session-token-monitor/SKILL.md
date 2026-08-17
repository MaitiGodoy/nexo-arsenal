---
name: session-token-monitor
description: "Estima consumo de token da sessão atual (heurística, não contagem oficial), detecta inflação de contexto, e gera resumo automático sugerindo nova sessão quando fica pesado. Invocar quando o usuário perguntar 'quanto gastei nessa sessão', 'tá pesado', 'devo abrir sessão nova', ou periodicamente via hook PostToolBatch."
argument-hint: "check | summary | reset"
license: MIT
---

# Session Token Monitor

Rastreia o peso da sessão atual do Claude Code e avisa quando vale a pena
começar do zero. **Não é medição oficial da API** — é estimativa por heurística
(caracteres/4 para respostas, linhas×1.3 para contexto). Ver limitação abaixo.

## ⚠️ Limitação honesta (ler antes de reportar números)

Claude Code **não expõe contagem de token para hooks**. O único jeito real de ver
consumo exato é:
- Comando `/usage` (nativo, sempre correto)
- Um script de `statusLine` lendo `cache_read_input_tokens` /
  `cache_creation_input_tokens` da resposta da API (não implementado aqui ainda)

Os scripts desta skill são **heurística com ±25-30% de erro**. Servem pra dar
"sensação de peso" e disparar o alerta, não pra citar número exato ao usuário.
Sempre que reportar, avisar que é estimado. Prefira `/usage` quando precisão importa.

## Arquivos desta skill

- `real-token-counter.sh` — soma estimativa: resposta do Claude (chars/4) + contexto
  (linhas×1.3) + overhead de tools (~200/call). Grava em `~/.claude/.session-tokens-real.log`.
- `context-inflation-detector.sh` — mede crescimento REAL de linhas do histórico da
  sessão (isso É real, não heurístico) e alerta se crescer >50% entre checagens.
  Grava em `~/.claude/.context-metrics.log`.
- `capture-response-size.sh` — mede tamanho real (em chars) da última resposta do
  Claude, usado como insumo do real-token-counter.
- `auto-session-summary.sh` — roda no fim da sessão (`SessionEnd`), gera markdown em
  `~/.claude/session-summaries/summary-TIMESTAMP.md` com duração, tool count, tokens
  estimados, e sugestão de abrir nova sessão.

## Como ativar (hooks em settings.local.json)

```json
"hooks": {
  "PostToolBatch": [ { "hooks": [
    { "type": "command", "command": "~/.claude/skills/session-token-monitor/real-token-counter.sh", "shell": "bash", "async": true, "timeout": 5 },
    { "type": "command", "command": "~/.claude/skills/session-token-monitor/context-inflation-detector.sh", "shell": "bash", "async": true, "timeout": 3 }
  ]}],
  "SessionEnd": [ { "hooks": [
    { "type": "command", "command": "~/.claude/skills/session-token-monitor/auto-session-summary.sh", "shell": "bash", "timeout": 10 }
  ]}]
}
```

## Comando CHECK (auditoria rápida sob demanda)

```bash
cat ~/.claude/.session-tokens-real.log      # totais estimados da sessão
tail ~/.claude/.context-metrics.log         # crescimento real de linhas
```

Reportar ao usuário sempre como faixa/estimativa: "≈X tokens estimados (±30%),
via /usage você vê o número exato."

## Comando SUMMARY

Roda `auto-session-summary.sh` manualmente, mostra o markdown gerado, sugere se
vale abrir sessão nova (regra prática: se `/usage` mostrar acima de ~70% da janela
do modelo, ou se `context-inflation-detector` acusar crescimento >50% recorrente).

## Comando RESET

`rm ~/.claude/.session-token-state ~/.claude/.session-tokens-real.log` — reinicia
os contadores heurísticos (útil ao começar tarefa nova sem abrir sessão nova).

## Regra de decisão "abrir sessão nova?"

Não decidir sozinho por causa do número heurístico. Sinais reais de que vale:
1. `/usage` mostra que passou de ~70-80% da janela do modelo.
2. Você mudou de tarefa completamente (não relacionada à anterior) — nesse caso
   `/compact` numa pausa natural é melhor que carregar sessão nova (mantém cache).
3. A sessão está visivelmente lenta/repetindo-se — sinal de contexto poluído.

Nunca insistir pra abrir sessão nova só porque o contador heurístico bateu um
threshold arbitrário — isso já causou alarmes falsos nesta máquina antes.
