#!/usr/bin/env node
/**
 * Setup Nexo — hook de PostToolUse para Write/Edit.
 * Fase D2: marca no estado da sessão que um arquivo foi tocado, para o hook
 * de Stop (bloquear-fim-sem-memoria.js) saber se precisa exigir
 * realimentação de .nexo/ antes de encerrar. Também marca o arquivo como
 * pendente de revisão se for código real (rules/ecc/common/code-review.md,
 * ver motor/revisao.js).
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
  const arquivo = entrada?.tool_input?.file_path || entrada?.tool_input?.path || '';
  motor.marcarEscrita(raizProjeto, arquivo);
  process.stdout.write(JSON.stringify({}));
}

main();
