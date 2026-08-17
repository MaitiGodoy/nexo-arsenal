#!/usr/bin/env node
/**
 * Setup Nexo — hook de PreToolUse para Task (delegação a agente).
 * Fase D1: nenhum agente de papel executor/revisor roda sem PLANO.md com
 * fase escrita em .nexo/ (nucleo/03-nexoflow.md) — antes disto, o ciclo de
 * fases dependia só de obediência do agente, não de mecanismo.
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
  const subagentId = entrada?.tool_input?.subagent_type || '';

  if (!subagentId) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const raizProjeto = entrada.cwd || process.cwd();
  const resultado = motor.checarPlano(raizProjeto, subagentId);

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
