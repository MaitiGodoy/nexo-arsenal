#!/usr/bin/env node
/**
 * Setup Nexo — hook de PostToolUse para Task.
 * Desarma a lista de código pendente de revisão (motor/revisao.js) quando o
 * agente delegado é um revisor (id contém "review" — code-reviewer,
 * security-reviewer, python-reviewer, etc, ver agentes/mapa.json). Ver
 * rules/ecc/common/code-review.md.
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
  const raizProjeto = entrada.cwd || process.cwd();
  const subagentId = entrada?.tool_input?.subagent_type || '';

  motor.marcarRevisaoFeita(raizProjeto, subagentId);

  process.stdout.write(JSON.stringify({}));
}

main();
