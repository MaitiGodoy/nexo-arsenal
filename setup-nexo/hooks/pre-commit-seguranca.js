#!/usr/bin/env node
/**
 * Setup Nexo — hook de pré-commit.
 * Disparado no PreToolUse quando a ferramenta é uma chamada de `git commit`.
 * Roda os três portões de segurança (nucleo/07-seguranca.md) e bloqueia a
 * chamada se algo for encontrado.
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

function ehComandoCommit(entrada) {
  const comando = entrada?.tool_input?.command || '';
  return /git\s+commit/.test(comando);
}

function main() {
  const entrada = lerEntradaStdin();
  if (!ehComandoCommit(entrada)) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const raizProjeto = entrada.cwd || process.cwd();
  const textoFaseAtual = entrada.faseAtual || '';
  const resultado = motor.checarSeguranca(raizProjeto, textoFaseAtual);

  if (resultado.bloqueado) {
    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason: `Setup Nexo — portão ${resultado.portao} de segurança encontrou achado(s): ${JSON.stringify(resultado.achados)}. Corrija antes de commitar.`,
    }));
    return;
  }

  process.stdout.write(JSON.stringify({}));
}

main();
