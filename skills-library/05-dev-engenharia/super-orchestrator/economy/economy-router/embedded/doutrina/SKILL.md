---
name: paidocriss-doutrina
description: "Doutrina da orquestração de skills de economia de token — camadas, invariantes, regra obrigatória"
embedded: true
---

# Doutrina — Economy Router

## ⚠️ REGRA OBRIGATÓRIA — LER ANTES DE QUALQUER OUTRA COISA

**Todas as fases de TODAS as skills listadas nesta skill são OBRIGATÓRIAS.** Nenhuma fase é opcional, sugestão ou "se der tempo". Isso vale para QUALQUER harness/CLI de IA (Claude Code, Qwen Code, OpenCode, Gemini CLI, Grok CLI, Muse, VPS).

O texto abaixo descreve **QUANDO** cada fase entra na pilha, nunca **SE** ela entra. Uma vez que a condição de gatilho for satisfeita (ex: "início de sessão nova", "sessão passou de ~80-100k tokens"), a execução daquela fase deixa de ser uma escolha e passa a ser um passo obrigatório do fluxo.

Frases como "sob demanda", "só quando pedido", "se justificar" descrevem o **GATILHO** (quando a condição fica verdadeira), nunca uma permissão pra pular a fase depois que o gatilho disparou. Rodar `STATUS` periodicamente e achar uma camada que deveria ter rodado e não rodou é um GAP — corrigir na hora.

**Não é roteamento excludente** (escolher uma skill em vez de outra) — é **orquestração cumulativa**. O objetivo é que TODAS as skills aplicáveis estejam ativas na sessão, cada uma no seu momento certo. Numa sessão inteira, as 11 skills devem rodar pelo menos uma vez cada, dentro do seu gatilho correto — não é "6-8 de 11 é aceitável", é cobertura completa.

## Consolidação Física (2026-08-11)

As 8 skills do cluster `11-token-economy-meta` — [[token-economy]], [[token-savings-report]], [[session-token-monitor]], [[model-switch-strategy]], [[llm-free-first]], [[claude-code-token-stack]], [[memory-management]], [[auto-context-compress]] — agora moram fisicamente em `embedded/<nome>/` dentro desta skill. `embedded/PROVENIENCIA.json` registra a origem de cada uma.

Os wikilinks continuam resolvendo pelo campo `name:` do frontmatter de cada `embedded/<nome>/SKILL.md` — só o caminho físico mudou. Hooks em `settings.local.json` foram repontados para os novos caminhos.

## Camadas Sempre Ativas

Estas não esperam gatilho — correm em paralelo à conversa, via hook ou disciplina constante:

- **RTK** — proxy de shell, mede toda chamada Bash.
- **[[llm-free-first]]** — declarar delegação antes de agir, reaplicada a cada tarefa nova.
- **Regra de modelo por tarefa** ([[model-switch-strategy]]) — vale sessão toda depois de escolhida no início.
- **`session-token-monitor`** — mede em background (hooks `PostToolUse`/`SessionEnd` já registrados em `settings.local.json`).

## Passo 0 — Detectar Harness

Ver [[harness-detect]]. O router só precisa saber se RTK faz sentido no harness atual antes de sugerir algo Claude-Code-only.

## Invariantes (I1–I12)

1. **Responsabilidade Única** — skill gera OU audita, nunca ambos.
2. **Núcleo ≤ 400 Linhas** — `wc -l SKILL.md` ≤ 400 (sem embedded/).
3. **embedded/ LLM-Free** — motor/ = zero chamadas a Claude/LLM.
4. **Idempotência** — marcador `[GERADO POR CREATOR — YYYY-MM-DD]` em SKILL.md.
5. **Contrato Não-Opcional** — seção entrada/saída/exits (0/1/2).
6. **Lint Integrada** — motor/lint-skill.js ou motor/lint.sh.
7. **Status com Evidência** — declarações "✓ Pronto" = ficheiro ou exit 0.
8. **Triage** — valida input; não-skill → recomendação + exit 1.
9. **Zero Secrets** — nenhuma API key / password hardcoded.
10. **ToT Compacto** — ToT.md = 3 decisões × 3 candidatos; ≤ 1 página.
11. **Gauntlet Crítico** — GAUNTLET.md = 3 críticos PASS, zero em aberto.
12. **Auto-Manutenção** — motor/auto-maint.sh roda ≥2/ciclo.

## Regra de Ouro do Router

1. **Cumulativo e obrigatório** — pergunta nunca é "qual skill usar", é "quais dessas 11 já deveriam estar ativas e eu esqueci alguma".
2. **Exceção de ordem** — nunca [[model-switch-strategy]] e [[nexoflow]] ao mesmo tempo (sequencial).
3. **Nenhuma fase é sugestão** — cada harness deve tratar o mapa de camadas como obrigatório assim que o gatilho disparar.
