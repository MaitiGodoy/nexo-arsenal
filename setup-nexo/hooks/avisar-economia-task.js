#!/usr/bin/env node
/**
 * Setup Nexo — hook de PreToolUse para Task (delegação a agente).
 * Fase D4: avisa (não bloqueia — ver nucleo/09-economia-de-token.md) quando
 * a descrição da subtarefa parece resolvível pela escada LLM-free-first
 * (grep/jq/rtk) em vez de gastar uma chamada de modelo.
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
  const descricao = entrada?.tool_input?.description || entrada?.tool_input?.prompt || '';
  const resultado = motor.sugerirEconomiaTask(descricao);

  if (!resultado.avisar) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: `Setup Nexo — ${resultado.motivo}.`,
    },
  }));
}

main();
