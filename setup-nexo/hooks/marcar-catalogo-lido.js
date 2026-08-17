#!/usr/bin/env node
/**
 * Setup Nexo — hook de PostToolUse para Read.
 * Desarma o flag de consulta obrigatória ao roteador (motor/catalogo.js)
 * quando o arquivo lido é um dos roteadores sob demanda
 * (catalogo/CATALOGO.md, catalogo/MCP.md, comandos/mapa.json, agentes/mapa.json).
 */

const path = require('path');
const motor = require(path.join(__dirname, '..', 'motor', 'index.js'));

function lerEntradaStdin() {
  try {
    const bruto = require('fs').readFileSync(0, 'utf8');
    return JSON.parse(bruto);
  } catch (erro) {
    return {};
  }
}

function main() {
  const entrada = lerEntradaStdin();
  const arquivo = entrada?.tool_input?.file_path || entrada?.tool_input?.path || '';
  const raizProjeto = entrada.cwd || process.cwd();

  motor.marcarCatalogoConsultado(raizProjeto, arquivo);

  process.stdout.write(JSON.stringify({}));
}

main();
