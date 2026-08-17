#!/usr/bin/env node
/**
 * Setup Nexo — hook de UserPromptSubmit.
 * Decisão de 2026-08-06: escolha de MCP deixa de depender do agente lembrar
 * de ler catalogo/MCP.md. Este hook casa o prompt contra os domínios
 * mapeados e já escreve o servidor no .mcp.json do projeto. MCP só conecta
 * no boot da sessão (limite do protocolo, não deste hook) — por isso o
 * aviso deixa claro que vale a partir da próxima sessão do CLI.
 */

const fs = require('fs');
const path = require('path');

const RAIZ_SETUP_NEXO = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(RAIZ_SETUP_NEXO, 'mcp', 'templates');

const DOMINIOS = [
  { re: /\b(postgres|banco de dados|consulta sql|migration|migra[cç][aã]o)\b/i, template: 'postgres.json', nome: 'postgres' },
  { re: /\b(fora da raiz do projeto|outro diret[oó]rio|filesystem mcp)\b/i, template: 'filesystem.json', nome: 'filesystem' },
  { re: /\b(n8n|webhook|cron job|automa[cç][aã]o de fluxo)\b/i, template: 'n8n.json', nome: 'n8n' },
  { re: /\b(playwright|scraping|preencher formul[aá]rio|navegar (na|no) p[aá]gina|testar fluxo web)\b/i, template: 'playwright.json', nome: 'playwright' },
];

function lerEntradaStdin() {
  try {
    return JSON.parse(fs.readFileSync(0, 'utf8'));
  } catch {
    return {};
  }
}

function carregarMcpJson(destino) {
  if (!fs.existsSync(destino)) return { mcpServers: {} };
  try {
    const atual = JSON.parse(fs.readFileSync(destino, 'utf8'));
    atual.mcpServers = atual.mcpServers || {};
    return atual;
  } catch {
    return { mcpServers: {} };
  }
}

function main() {
  const entrada = lerEntradaStdin();
  const mensagem = entrada.prompt || '';
  const raizProjeto = entrada.cwd || process.cwd();
  const destino = path.join(raizProjeto, '.mcp.json');

  const conectados = [];
  for (const dominio of DOMINIOS) {
    if (!dominio.re.test(mensagem)) continue;

    const templatePath = path.join(TEMPLATES_DIR, dominio.template);
    if (!fs.existsSync(templatePath)) continue;

    const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
    const config = carregarMcpJson(destino);

    if (config.mcpServers[dominio.nome]) continue; // já conectado, nada a fazer

    Object.assign(config.mcpServers, template.mcpServers);
    fs.writeFileSync(destino, JSON.stringify(config, null, 2) + '\n', 'utf8');
    conectados.push(dominio.nome);
  }

  const saida = conectados.length > 0
    ? {
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext:
            `Setup Nexo — MCP auto-conectado por domínio detectado no prompt: ${conectados.join(', ')} ` +
            `(escrito em ${destino}). MCP só carrega no boot da sessão — só fica ativo de fato na ` +
            `próxima vez que o CLI abrir este projeto. Confira as variáveis de ambiente exigidas em ` +
            `catalogo/MCP.md antes de reiniciar.`,
        },
      }
    : {};

  process.stdout.write(JSON.stringify(saida));
}

main();
