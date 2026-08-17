# Pasta dedicada — skills de economia de token (índice, não cópia)

Não duplica conteúdo (duplicar = risco de drift entre cópia e original). Este
arquivo é o índice curado; os SKILL.md reais continuam em `~/.claude/skills/`
(instalados/ativos) e `~/.claude/skills-library/11-token-economy-meta/` (catálogo).

## Ativas nesta máquina (`~/.claude/skills/<nome>/SKILL.md`)

1. token-economy
2. claude-code-token-stack
3. model-switch-strategy
4. session-token-monitor
5. llm-free-first
6. nexoflow
7. memory-management
8. auto-context-compress (nova)
9. token-savings-report (nova)
10. passa-bastao (nova — feita em sessão paralela, item de handoff)
11. paidocriss (nova — skill MESTRA, roteia pra todas as outras acima)

## Vem do plugin ECC — agora com symlink físico em `economy-skills/`

12. context-budget — `economy-skills/context-budget` → symlink pro canônico em
    `~/.claude/plugins/marketplaces/ecc/skills/context-budget/SKILL.md`
13. strategic-compact — `economy-skills/strategic-compact` → symlink pro canônico em
    `~/.claude/plugins/marketplaces/ecc/skills/strategic-compact/SKILL.md`

(Antes só existiam no cache do plugin, sem entrada navegável em `economy-skills/`
— corrigido em 2026-08-08. Symlink, não cópia, pra não duplicar conteúdo e nem
divergir de futuras atualizações do plugin ECC.)

## Fora do contexto de economia (removidas desta lista por pedido do usuário)

- github-tool-vetting — prevenção, não economia ativa
- skill-creator — meta, não economiza token diretamente
- token-budget-advisor — substituída pela regra de output fixa em `~/.claude/CLAUDE.md`

## Ferramenta (não é skill)

- RTK (`rtk.exe`) — proxy CLI, referenciado por `claude-code-token-stack`.

## Referência compartilhada (não é skill invocável)

- `harness-detect.md` — tabela única de detecção de harness (Claude/Qwen/OpenCode/
  Gemini/Muse/Grok), linkada via `[[harness-detect]]` por token-economy,
  token-savings-report, llm-free-first, nexoflow, model-switch-strategy.
- `prp-vs-spec-driven-dev.md` — comparação PRP vs repos de Spec-Driven Dev.
- `rtk-coverage-and-mcp-research.md` — cobertura real do RTK (só Bash,
  confirmado) + pesquisa PARCIAL de outros MCPs de economia (pendência: falta
  busca web pra confirmar `token-optimizer`/`context-mode`).
