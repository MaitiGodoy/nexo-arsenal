#!/usr/bin/env node
/**
 * Setup Nexo — hook de Stop.
 * Bloqueia fim de sessão se sobrou código real sem revisão (motor/revisao.js,
 * rules/ecc/common/code-review.md). Mesmo padrão de guarda de
 * bloquear-fim-sem-memoria.js: `stop_hook_active` evita loop infinito, só
 * bloqueia uma vez por sessão.
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

  if (entrada.stop_hook_active) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const raizProjeto = entrada.cwd || process.cwd();
  const resultado = motor.checarRevisaoPendenteFimSessao(raizProjeto);

  if (resultado.bloqueado) {
    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason: `Setup Nexo — ${resultado.motivo}.`,
    }));
    return;
  }

  process.stdout.write(JSON.stringify({}));
}

main();
