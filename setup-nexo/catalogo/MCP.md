# Catálogo de MCP — roteador de servidor sob demanda

Mesmo mecanismo do `CATALOGO.md` de skills: **nada conecta por padrão**.
Servidor MCP conectado sem uso custa token em toda mensagem (a lista de
ferramentas entra no contexto). Por isso conectar é decisão consciente,
disparada por domínio de tarefa — nunca "por garantia".

## Como usar

1. O protocolo de entrada (`nucleo/01-protocolo-entrada.md`) identifica o
   domínio da tarefa.
2. Se o domínio casar com uma linha abaixo **e** a tarefa realmente exigir
   aquele acesso, o template correspondente é copiado para a raiz do
   projeto como `.mcp.json` (ou mesclado, se já existir).
3. As credenciais vêm de variável de ambiente do projeto, nunca do stack
   global — ver `nucleo/07-seguranca.md`.
4. Terminou o ciclo de trabalho daquele domínio? Desconectar é economia
   real (a maior alavanca única de token do stack, segundo
   `biblioteca/11-token-economy-meta/token-economy/SKILL.md`).

## Servidores mapeados

| Template | Domínio que aciona | Variáveis exigidas |
|---|---|---|
| `mcp/templates/postgres.json` | consulta/migração de banco, verificar mutação, exportar dados | `NEXO_POSTGRES_URL` |
| `mcp/templates/filesystem.json` | leitura/escrita fora da raiz do projeto atual | `NEXO_PROJETO_RAIZ` |
| `mcp/templates/n8n.json` | automação, cron, webhook, notificação | `NEXO_N8N_URL`, `NEXO_N8N_API_KEY` |
| `mcp/templates/playwright.json` | navegação real de página, scraping, preencher formulário, testar fluxo web | nenhuma (browser local) |

## Regra de custo (a razão de este catálogo existir)

Cada servidor conectado injeta a definição de todas as suas ferramentas no
contexto, em toda mensagem da sessão — mesmo nas que não usam MCP nenhum.
Três servidores pouco usados custam mais, ao longo de uma sessão, do que a
tarefa que motivou conectá-los. Portanto:

- **Conectar** quando a tarefa do domínio começa.
- **Desconectar** quando termina.
- **Nunca** manter conectado "porque pode ser útil depois".

Essa revisão é sempre ação do usuário no CLI hospedeiro (`/mcp` ou
equivalente) — o Setup Nexo indica quando vale conectar e quando vale
desconectar, mas não conecta nem desconecta sozinho.

## Servidor novo

Domínio recorrente sem template? Criar `mcp/templates/<nome>.json` no mesmo
formato (variáveis de ambiente nomeadas, nunca valor literal) e adicionar
uma linha na tabela acima. Isso é uma tarefa como outra qualquer: passa
pelo Nexoflow.
