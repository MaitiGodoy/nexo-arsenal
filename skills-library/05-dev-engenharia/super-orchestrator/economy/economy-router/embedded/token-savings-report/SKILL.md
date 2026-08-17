---
name: token-savings-report
description: "Relatório final combinado de token economy — gasto estimado da sessão + economia real (RTK) + economia por delegação de modelo/subagente, tudo num bloco só. Invocar quando o usuário perguntar 'quanto gastei e quanto economizei', 'me dá o relatório de economia', ou no fechamento de uma sessão/tarefa grande."
argument-hint: "report"
license: MIT
---

# Token Savings Report

Não mede nada novo — agrega o que as outras skills da categoria `11-token-economy-meta`
já produzem, num único bloco de output. Ver [[claude-code-token-stack]] para onde cada
peça mora, [[session-token-monitor]] pro heurístico de sessão, [[token-economy]] pra
tabela de confiança dos números.

## Passo 0 — detectar harness

`~/.session-tokens-real.log` e `/usage` são Claude-Code-specific. Ver
[[harness-detect]] (`~/.claude/economy-skills/harness-detect.md`). Se a sessão
não for Claude Code:
- **RTK** continua funcionando igual (é proxy de shell, universal) — sempre
  incluir no relatório independente do harness.
- **Heurística de sessão**: se `~/.claude/.session-tokens-real.log` não
  existir (harness sem esse hook), calcular fallback bruto na hora — linhas
  do histórico visível da sessão × 1.3 — e rotular claramente como estimativa
  ainda mais grosseira que a heurística padrão.
- **`/usage`**: não existe fora do Claude Code — não citar como fonte se o
  harness não suportar; usar só RTK + heurística nesse caso.
- Não simular um número "como se" o path do Claude existisse — se o arquivo
  não está lá, é porque o harness não gera esse dado, não porque algo quebrou.

## Fontes (nesta ordem de confiança)

1. **RTK real** — `rtk gain` (escopo global, todo histórico) ou `rtk gain --history`
   (por sessão). Números **medidos**, não estimados. Sempre citar esses primeiro.
2. **Sessão atual (heurística)** — `cat ~/.claude/.session-tokens-real.log` da skill
   `session-token-monitor`. ±25-30% de erro, sempre rotular como estimativa.
3. **`/usage` nativo** — se o usuário rodar, é o número oficial exato. Preferir sobre
   qualquer heurística quando disponível.
4. **Economia por delegação** (não é medição, é raciocínio qualitativo): quantos
   subagentes Haiku/DeepSeek rodaram nesta sessão em vez de Sonnet/Opus na janela
   principal — cada delegação evita que o resultado bruto (grep/read de N arquivos)
   entre no contexto principal. Contar via histórico da conversa, não inventar número.

## Comando REPORT

1. Rodar `rtk gain` — captura economia real acumulada (global).
2. Rodar `cat ~/.claude/.session-tokens-real.log` (se existir) — estimativa da sessão atual.
3. Contar quantos `Agent`/Task calls rodaram nesta sessão e em qual modelo (Haiku vs
   Sonnet/Opus) — cada um poupou a janela principal de processar o resultado bruto.
4. Montar o bloco de saída (formato abaixo) e apresentar **uma vez**, no fim da resposta
   ou quando pedido — nunca a cada turno (isso mesmo gastaria token à toa).

## Formato de saída

```
📊 Token Economy — relatório desta sessão
─────────────────────────────────────────
RTK (medido, global):     746K tokens poupados (41.6% de redução) — rtk gain
Sessão atual (estimado):  ≈XXk tokens gerados, ±30% — heurística, não é /usage
Delegação a subagentes:   N chamadas em Haiku/DeepSeek (não custaram Sonnet na janela principal)
Modelo desta sessão:      Sonnet (default correto para coding)
─────────────────────────────────────────
Fonte confiável: RTK e /usage. O resto é estimativa — nunca citar como número exato.
```

## Regra de honestidade (herdada de [[token-economy]])

Nunca somar heurística + medido como se fossem a mesma confiança. Sempre rotular
qual número é medido (RTK, /usage) e qual é estimado (heurística de sessão). Nunca
inflar "economia total" combinando as duas fontes num único percentual — isso já foi
identificado como erro nesta máquina (ver histórico em `token-economy/SKILL.md`).

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
