---
name: nexo-install-everywhere
description: Propaga skills, plugins, hooks, commands, agents e MCP de ~/.claude para todos os ambientes
---

# /nexo-install-everywhere

Propaga **os 7 tipos** — não só plugins:

| tipo | origem local | vai pra |
|---|---|---|
| `skills` | `~/.claude/skills-library/` (catálogo, ~198 skills) | `<base>/skills-library/` |
| `skills-active` | `~/.claude/skills/` (invocáveis via Skill tool: paidocriss, tardis...) | `<base>/skills/` |
| `plugins` | `~/.claude/plugins/` | `<base>/plugins/` |
| `hooks` | `~/.claude/hooks/` | `<base>/hooks/` |
| `commands` | `~/.claude/commands/` | `<base>/commands/` |
| `agents` | `~/.claude/agents/` | `<base>/agents/` |
| `mcp` | `mcpServers` do `~/.claude.json` | `<base>/.mcp.json` |

Alvos: `~/.claude/install-targets.json` (config, não código — editar lá).
Padrão = 4 ambientes na VPS: Claude CLI, Qwen, OpenCode, Prospector.

## TODAS as fases são obrigatórias — nada aqui é opcional

Não existe fase "sugerida" ou "se quiser" neste fluxo. `check` **sempre** varre
cópias aninhadas antes de mostrar o inventário; `push` **sempre** sincroniza
cópias aninhadas antes de propagar. Nenhum harness (Claude Code, Qwen, OpenCode,
VPS, ou qualquer outro que rode esta skill) tem permissão pra pular essas etapas
achando que são passo opcional ou nice-to-have — pular é o motivo de existir
drift silencioso entre a cópia canônica e as cópias embutidas em outras skills.

## Cópias aninhadas (skill dentro de skill, hook dentro de skill, etc)

Um artefato pode ter uma cópia embutida dentro da pasta de OUTRO artefato — o
caso real que motivou isto: `tardis` orquestra `paidocriss` e mantém sua
própria cópia em `skills/tardis/skills/paidocriss/`, separada da canônica
em `skills/paidocriss/`. Atualizar só a canônica e propagar **não** alcança
essa cópia embutida — ela fica presa na versão antiga local, no harness, e em
toda VPS pra onde isso for propagado.

Isso vale para qualquer tipo, não só skills: hook copiado dentro de uma pasta
de skill, skill duplicada em `skills-library/<categoria>/` e em `skills/`, etc.

`install-everywhere.py` acha e resolve isso automaticamente:
- `check` → reporta toda cópia aninhada desatualizada (não escreve nada).
- `push` → sincroniza (sobrescreve a aninhada com o conteúdo da canônica) e
  DEPOIS propaga — assim o alvo remoto já recebe a versão corrigida.
- `sync-nested [--fix]` → só a varredura, sem tocar em check/push. Sem `--fix`
  é dry-run (lista o que está desatualizado); com `--fix` sincroniza local.

## Usage

```bash
bash ~/.claude/scripts/install-everywhere.sh check              # inventário + cópias aninhadas desatualizadas, não escreve
bash ~/.claude/scripts/install-everywhere.sh push               # sincroniza cópias aninhadas + propaga tudo
bash ~/.claude/scripts/install-everywhere.sh push skills hooks  # só alguns tipos
bash ~/.claude/scripts/install-everywhere.sh add skill <url|path>   # instala + propaga
bash ~/.claude/scripts/install-everywhere.sh sync-nested --fix  # só corrige cópias aninhadas, sem propagar
```

## Antes de propagar
1. Rode `check` e mostre o inventário ao usuário — inclui as cópias aninhadas desatualizadas, obrigatório mostrar, não é detalhe a esconder.
2. Rode `bash ~/.claude/scripts/sync-nexo.sh check` — se o repo NEXO-COMPLETO estiver
   divergente, resolva antes; propagar drift multiplica o problema por 4.
3. `push` **sobrescreve** arquivo de mesmo nome no alvo e não remove órfão. Se o
   usuário quer espelho exato, avise que sobra lixo antigo e ofereça limpar antes.
4. `push` já sincroniza cópias aninhadas sozinho — não pule isso nem pergunte se é
   necessário, é parte obrigatória do comando.

## Autenticação na VPS
A **chave** (`~/.ssh/hostinger_vps.pem`) é o método preferido e confirmado
funcionando (2026-08-09) — `$VPS_PASSWORD` é só fallback se a chave for
revogada um dia. **Importante:** o sshd desta VPS rejeita o subsistema SFTP
(`open_sftp()` do paramiko dá "Channel closed" mesmo com auth OK — mesmo
motivo pelo qual `scp` do sistema precisa de `-O` aqui). Por isso o script usa
só `exec_command` + transferência via base64, nunca `sftp.put` — se for tocar
nesse arquivo, não reintroduzir SFTP sem testar de novo.

```bash
export VPS_PASSWORD='...'   # só se a chave parar de funcionar
```

Nunca coloque a senha em arquivo, nem peça pro usuário colar no chat. Se nem
chave nem variável estiverem disponíveis, o script pula os alvos remotos e
avisa — não trava.

## Constraints
- Não propague com o proxy DeepSeek ativo achando que é Anthropic — irrelevante aqui,
  mas confira antes de rodar dentro de um ciclo NEXOFLOW.
- VPS offline não é erro fatal: os alvos que responderem recebem, o resto reporta ✗.
- Nada de `--delete`/espelho destrutivo sem o usuário pedir explicitamente.
