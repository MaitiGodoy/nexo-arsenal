#!/usr/bin/env node
/**
 * Setup Nexo — hook de Stop.
 * Fase D2: se a sessão tocou arquivo (marcado por marcar-escrita.js) e
 * .nexo/PROGRESSO.md (nem PLANO.md) foi atualizado desde o início, devolve
 * decision:block — no contrato de Stop isso faz o agente continuar em vez
 * de encerrar, forçando a realimentação (nucleo/06-memoria.md) antes do fim.
 * `stop_hook_active` evita loop infinito: só bloqueia uma vez por sessão.
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
  const resultado = motor.checarMemoriaAtualizada(raizProjeto);

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
