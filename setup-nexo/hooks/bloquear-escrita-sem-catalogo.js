#!/usr/bin/env node
/**
 * Setup Nexo — hook de PreToolUse para Write/Edit.
 * Bloqueia a primeira escrita de um turno não-trivial (marcado por
 * prompt-submit-protocolo.js) até o roteador sob demanda ter sido consultado
 * (marcar-catalogo-lido.js desarma). Ver motor/catalogo.js e
 * nucleo/01-protocolo-entrada.md — sem isto a regra era só texto, sem
 * mecanismo, dependendo do agente lembrar sozinho.
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
  const resultado = motor.checarCatalogoConsultado(raizProjeto);

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
