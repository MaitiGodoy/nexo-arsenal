---
name: token-economy
description: "Auditoria e aplicação de economia de token do Claude Code — settings.local.json, .claudeignore, MCP cleanup, prompt caching, modelo por tarefa. Invocar no início de sessão nova, quando o usuário mencionar 'economia de token', 'reduzir custo', 'token economy', 'otimizar claude code', ou quando o contexto estiver ficando pesado."
argument-hint: "audit | apply | status | mcp-check"
license: MIT
---

# Token Economy

Aplica e audita a configuração de economia de token do Claude Code nesta máquina.
Baseado em pesquisa de docs oficiais (code.claude.com) e GitHub (anthropics/claude-code).

**IMPORTANTE — honestidade sobre confiança:** nem tudo aqui é igualmente confiável.
Ver tabela de confiança abaixo antes de reportar números ao usuário como fato.

## Arquivos desta skill

- `SKILL.md` — este arquivo (instruções)
- `check-settings.sh` — script de auditoria (mesmo usado pelo SessionStart hook)
- `REFERENCE.md` — guia mestre completo com todo o JSON/.claudeignore/fontes

## Quando isto roda automaticamente

Esta skill é referenciada pelo `SessionStart` hook (`~/.claude/session-start-check.sh`,
cópia idêntica de `check-settings.sh` desta skill) e por uma linha em
`~/.claude/CLAUDE.md`. Isso significa:
- **No início de toda sessão nova:** o hook silenciosamente confere se
  `settings.local.json` tem as env vars corretas e avisa (stderr) se algo sumiu ou
  se `.claudeignore` falta no projeto atual.
- **CLAUDE.md sempre carregado:** garante que a diretriz de "terse, sem narrar" já
  está em vigor em toda mensagem da sessão (isso é o único mecanismo real de
  "toda mensagem" que o Claude Code oferece — skills não interceptam mensagem a
  mensagem, só disparam por keyword ou invocação).
- **Invocação manual:** `/token-economy audit` faz auditoria completa sob demanda.

## Tabela de Confiança (não inflar números)

| Camada | Confiança | O que é |
|--------|-----------|---------|
| Env vars (prompt caching, subagent model, thinking, autocompact) | 95-100% | Documentado oficialmente |
| .claudeignore | 100% | Documentado, efeito comprovado |
| MCP server cleanup | 100% | Maior ganho real, mas é AÇÃO MANUAL (`/mcp`) |
| RTK ativo | 100% | Medido via `rtk gain` |
| CLAUDE.md terse | 90% | Reduz tokens de sistema, efeito pequeno mas real |
| Hooks de compressão de output (.sh) | 60-85% | Dependem de Git Bash; regex pode ter bugs — TESTAR antes de confiar |
| Token counter / session monitor (.sh) | 50-70% | HEURÍSTICA (chars/4, linhas×1.3). NÃO é contagem real. Nunca reportar como número exato. |

**Regra:** ao reportar economia ao usuário, dê faixa (ex: "30-40%"), nunca número
exato, exceto quando vier de `rtk gain` ou `/usage` (esses são reais).

## Passo AUDIT (o que checar)

1. `cat ~/.claude/settings.local.json` — confirma bloco `env` tem:
   `ENABLE_PROMPT_CACHING_1H`, `CLAUDE_CODE_SUBAGENT_MODEL=haiku`,
   `MAX_THINKING_TOKENS=10000`, `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE=70`,
   `DISABLE_NON_ESSENTIAL_MODEL_CALLS=1`
2. Confirma `model` é `claude-sonnet-5` (NUNCA deixar Haiku como default de coding —
   Haiku é só para chat leve, não dá conta de coding complexo. Lição aprendida
   nesta máquina: já foi corrigido uma vez).
3. Checa se `.claudeignore` existe na raiz do projeto atual (`pwd`). Se não existir
   e o projeto tiver `node_modules/`, `dist/`, lock files etc — criar.
4. `rtk gain` — reporta economia real medida (não heurística).
5. Roda `/mcp` mentalmente/sugere ao usuário revisar servers conectados não usados
   há 2+ semanas — **este é o maior ganho e é sempre ação manual do usuário**,
   nunca finja que foi feito automaticamente.
6. Confirma `~/.claude/CLAUDE.md` está na versão terse (não a versão longa de 66
   linhas explicativa).

## Passo APPLY (o que fazer se algo estiver faltando)

Recriar/editar `~/.claude/settings.local.json` com o bloco completo (ver
`~/.claude/MASTER-TOKEN-ECONOMY-SETUP.md` PASSO 1 pro JSON inteiro). Nunca inventar
campos fora do schema oficial do settings.json — se a validação rejeitar um campo,
remover esse campo específico, não abandonar o arquivo inteiro.

Se `.claudeignore` faltar no projeto, criar com o conteúdo padrão (ver
`~/.claude/MASTER-TOKEN-ECONOMY-SETUP.md` PASSO 2).

## Passo STATUS (relatório rápido, sem re-configurar)

Rodar `bash ~/.claude/status-token-optimization.sh` se existir, senão montar
manualmente: model atual, env vars presentes, .claudeignore presente/ausente,
`rtk gain` output.

## Regras de Cache (não quebrar sem querer)

Prompt cache é match de PREFIXO — qualquer mudança no começo invalida tudo depois.
Por isso, dentro desta skill e em qualquer sessão:
- **Nunca sugerir trocar de modelo no meio da sessão** só por "economia" — isso
  invalida o cache inteiro e custa MAIS caro no turno seguinte. Trocar modelo só
  entre sessões.
- **Nunca sugerir religar/desligar fast mode no meio.**
- **Nunca sugerir conectar/desconectar MCP server no meio de uma tarefa em
  andamento** — fazer isso entre tarefas, não durante.

## Estratégia de Modelo (lembrete permanente)

```
Sonnet  → coding, refactor, debug, arquitetura, planejamento (DEFAULT)
Haiku   → chat, Q&A, leitura, revisão leve (troca manual via /model ou
          quick-switch-model.sh, NUNCA default global)
Opus    → decisão arquitetural crítica, raciocínio máximo (caro, usar com parcimônia)
```

## Documentos de Referência (nesta máquina)

- `~/.claude/MASTER-TOKEN-ECONOMY-SETUP.md` — guia completo com todo o JSON,
  .claudeignore, CLAUDE.md, fontes. É o arquivo pra copiar em máquina nova.
- `~/.claude/GITHUB-RESEARCH-FINDINGS.md` — fontes originais (docs oficiais + GitHub
  issues) de cada técnica.
- `~/.claude/REALIDADE-VS-SIMULACAO.md` — histórico de quais camadas são reais vs
  heurística, e por quê (importante para não regredir e inflar números de novo).

## Erros já cometidos nesta máquina (não repetir)

1. Setar Haiku como modelo global default — corrigido, causa perda de qualidade
   em coding. Sonnet é o default correto.
2. Inventar campos customizados no settings.json (`tokenSavingsMode`,
   `outputCompression`) — settings.json tem schema fechado, campos não reconhecidos
   quebram a validação inteira do arquivo.
3. Reportar "45% de economia" como número exato sem medição real — sempre dar faixa
   e dizer a fonte (medido vs estimado).
4. Regex quebrada em `compress-bash-output.sh` (`.{200}` sem escape em BRE) — testar
   qualquer script sed/grep antes de declarar que funciona.
5. Salvar arquivo em `C:\Users\User\Desktop` quando o Desktop real do usuário é
   `C:\Users\User\OneDrive\Desktop` (perfil com OneDrive redireciona a pasta) — ao
   entregar arquivo pro usuário achar no Explorer, confirmar o caminho real via
   `[Environment]::GetFolderPath("Desktop")` no PowerShell, não assumir
   `~/Desktop` do Git Bash.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
