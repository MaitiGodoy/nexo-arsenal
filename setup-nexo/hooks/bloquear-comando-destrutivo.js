#!/usr/bin/env node
/**
 * Setup Nexo — hook de PreToolUse para Bash.
 * Fase D3: porta hooks/shell/block-destructive-bash-global.sh — bloqueia
 * comando obviamente destrutivo (rm -rf /, force push, reset --hard, DROP
 * TABLE, TRUNCATE) em qualquer Bash, não só antes de `git commit`
 * (pre-commit-seguranca.js só cobre o momento do commit).
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
  const comando = entrada?.tool_input?.command || '';

  if (!comando) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const resultado = motor.checarComandoDestrutivo(comando);

  if (resultado.bloqueado) {
    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason: `Setup Nexo — comando bate padrão destrutivo (${resultado.padrao}). Confirme com o usuário antes de rodar.`,
    }));
    return;
  }

  process.stdout.write(JSON.stringify({}));
}

main();
