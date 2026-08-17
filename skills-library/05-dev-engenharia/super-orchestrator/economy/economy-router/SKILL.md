---
name: nexo-paidocriss
description: "Skill MESTRA de economia de token — NÃO escolhe uma skill em vez de outra: empilha e aplica TODAS as skills de 11-token-economy-meta que forem cabíveis, cada uma no seu momento certo dentro da mesma sessão. É orquestração cumulativa (camadas simultâneas), não roteamento excludente. Invocar no início de qualquer sessão nova, quando o usuário perguntar 'roda a economia de token toda', ou pra garantir que nenhuma camada ficou de fora. [GERADO POR CREATOR — 2026-08-14]"
argument-hint: "start | mid-task | heavy | close | status"
license: MIT
---

# Economy Router — mestra de `11-token-economy-meta`

**Consolidação física (2026-08-11):** as 8 skills do cluster — [[token-economy]], [[token-savings-report]], [[session-token-monitor]], [[model-switch-strategy]], [[llm-free-first]], [[claude-code-token-stack]], [[memory-management]], [[auto-context-compress]] — agora moram fisicamente em `embedded/<nome>/` dentro desta skill. `embedded/PROVENIENCIA.json` registra a origem de cada uma. Os wikilinks continuam resolvendo pelo campo `name:` do frontmatter de cada `embedded/<nome>/SKILL.md` — só o caminho físico mudou.

## ⚠️ REGRA OBRIGATÓRIA — Ler [[paidocriss-doutrina]] antes

Doutrina completa (camadas, invariantes, regra obrigatória, consolidação física) moram em `embedded/doutrina/SKILL.md`. Ler [[paidocriss-doutrina]] antes de usar qualquer comando desta skill.

## Mapa de Camadas (Resumido)

| Momento | Skill(s) a chamar | Ordem |
|---|---|---|
| **Início de sessão nova** | [[token-economy]] `audit` → [[model-switch-strategy]] `recommend` | 1º audit, 2º modelo |
| **Começando qualquer tarefa** | [[llm-free-first]] (declarar delegação antes de agir) | Sempre primeiro passo |
| **Tarefa multi-step** | [[nexoflow]] (ciclo Opus/DeepSeek) | Após delegação, antes de codar |
| **~80-100k tokens** | [[auto-context-compress]] (força compressão) | Automático, não espera |
| **Fim tarefa grande** | [[token-savings-report]] (relatório) | Pedido OU fim grande |
| **Trocar de chat** | [[nexo-passa-bastao]] (retomada) | Antes de fechar, após relatório |
| **Memória duplicada** | [[memory-management]] (audit/merge) | Gatilho = sob demanda |
| **Ferramenta terceira** | [[nexo-github-tool-vetting]] | Antes de instalar global |
| **Multi-subagente** | [[nexo-super-orchestrator]] (orquestrador) | Checar orçamento primeiro |

## Comandos Rápidos

**START** (nova sessão): (1) [[token-economy]] audit (2) [[model-switch-strategy]] recommend (3) não chamar nexoflow/llm-free-first ainda

**MID-TASK** (tarefa nova): (1) [[llm-free-first]] (2) [[nexoflow]] se multi-step (3) [[auto-context-compress]] se ~80k

**HEAVY** (sessão cara): (1) [[auto-context-compress]] status (2) [[nexo-passa-bastao]] gerar se trocar chat (3) [[token-savings-report]]

**CLOSE** (fim): (1) [[token-savings-report]] (2) [[nexo-passa-bastao]] se pedido (com números do relatório)

**STATUS** (auditoria): listar 11 skills + gatilho + evidência rodou nesta sessão. Se faltou = GAP a corrigir.

## Implementação CLI

Ver [[paidocriss-cli-script]] para script wrapper bash (5 skills automatizadas: turbo, input, filter, diff, watch). Idêntico em Claude Code, Qwen Code, OpenCode, Gemini CLI, Grok CLI, Muse.

## Estrutura Física

`embedded/PROVENIENCIA.json` registra origem. Redução: 377L → ~95L (núcleo) + 354L (embedded/) = 60%.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
