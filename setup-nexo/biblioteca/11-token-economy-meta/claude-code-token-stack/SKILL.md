---
name: claude-code-token-stack
description: Referência do stack global de economia de token instalado no Claude Code desta máquina (rtk, ECC, karpathy-skills, open-design leve) — onde cada peça mora, como checar se está ativa, e como reverter. Usar quando o usuário perguntar "o que instalamos de economia de token", "como reverto isso", "cadê o backup do settings.json", ou antes de instalar mais uma ferramenta global (para não duplicar).
---

# Stack de economia de token instalado (referência)

Tudo abaixo é **configuração global do usuário** em `C:\Users\User\.claude\`,
válida para **todo projeto**, não só este. Instalado numa sessão dedicada a
reduzir consumo de token do Claude Code.

## Peças ativas

| Peça | O que faz | Onde mora |
|---|---|---|
| **rtk** (Rust Token Killer) | Proxy CLI que comprime saída de comandos de terminal (git status, npm install, docker logs) antes de entrar no contexto | binário: `C:\Users\User\bin\rtk.exe`; hook: `settings.json` → `hooks.PreToolUse` matcher `Bash` |
| **ECC** (`affaan-m/ECC`, perfil full) | Plugin com hooks de qualidade (format/typecheck no Stop), monitor de custo/contexto, skills de token (`context-budget`, `token-budget-advisor`, `strategic-compact`) | plugin registrado via `settings.json` → `extraKnownMarketplaces.ecc` + `enabledPlugins["ecc@ecc"]`; rules copiadas manualmente em `~/.claude/rules/ecc/{common,python}` |
| **karpathy-skills** | 4 regras de comportamento (pensar antes de codar, simplicidade, edição cirúrgica, execução orientada a objetivo) — reduz retrabalho e diffs desnecessários | anexado direto ao `~/.claude/CLAUDE.md`, abaixo de `@RTK.md` |
| **open-design (leve)** | Plugin/skill de design registrado, SEM o daemon `od` (que exigiria Docker ou Node 24 + pnpm 10.33 rodando permanentemente) | `settings.json` → `extraKnownMarketplaces.open-design` + `enabledPlugins["open-design@open-design"]` |

## Como checar se está ativo

```bash
rtk --version                      # deve responder com versão, sem "command not found"
cat ~/.claude/settings.json        # deve ter os 4 blocos acima
cat ~/.claude/CLAUDE.md            # deve ter "@RTK.md" + seção karpathy
```

Tudo isso só entra em vigor **depois de reiniciar o Claude Code** — mudanças
em `settings.json`/`CLAUDE.md` não recarregam a quente numa sessão já aberta.

## Backup / rollback

- Backup do `settings.json`/`CLAUDE.md`/`RTK.md` de **antes** de qualquer
  instalação: `C:\Users\User\.claude\_backup_pre_ecc\`.
- Repositório clonado do ECC (fonte para re-rodar installer/uninstaller):
  `C:\Users\User\tools\ECC\`.
- Para desfazer o ECC por completo: `node scripts/uninstall.js --target
  claude` dentro de `C:\Users\User\tools\ECC` (usa
  `~/.claude/ecc/install-state.json`, remove só o que o installer escreveu,
  não toca no resto).
- Para desfazer rtk/karpathy/open-design: remover manualmente as chaves
  correspondentes do `settings.json` e a seção karpathy do `CLAUDE.md`
  (arquivos pequenos, edição direta é segura).

## Descartado nesta sessão (não instalar sem novo motivo)

- **ruflo/ruflow**: aumenta consumo de token (15-25k overhead/sessão por
  auditoria independente).
- **DeepSpec**: não é ferramenta de Claude Code (pesquisa de ML/speculative
  decoding, exige GPU e ~38TB).

## Antes de adicionar mais uma ferramenta global

Ver a skill irmã `github-tool-vetting` — mesmo processo de checksum/dry-run/
auditoria de hook antes de qualquer novo plugin global.
