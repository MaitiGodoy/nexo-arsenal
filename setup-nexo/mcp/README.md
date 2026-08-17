# MCP — templates de servidor por projeto

O Setup Nexo não traz credencial de MCP embutida (segredo é sempre por
projeto, nunca global — ver `nucleo/07-seguranca.md`). Esta pasta guarda
templates de configuração que o instalador copia para o projeto quando
detecta a necessidade; o usuário preenche a credencial localmente.

## Como usar

1. Escolha o template em `mcp/templates/`.
2. Copie para a raiz do projeto como `.mcp.json` (ou mescle se já existir).
3. Preencha as variáveis de ambiente referenciadas — nunca hardcode valor
   real no template versionado.

## Templates disponíveis

| Template | Cobre |
|---|---|
| `templates/postgres.json` | Conexão MCP a um Postgres (leitura/escrita de banco) |
| `templates/filesystem.json` | Acesso MCP a um diretório específico do projeto |
| `templates/n8n.json` | Automações NEXO (cron, webhook, notificação) via n8n |

Novo servidor MCP necessário → novo template aqui, seguindo o mesmo
formato: variáveis de ambiente nomeadas, nunca valor literal.
