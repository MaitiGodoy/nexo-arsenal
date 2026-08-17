#!/usr/bin/env node
/**
 * Setup Nexo — hook de PreToolUse para Write/Edit.
 * Bloqueia a escrita de um segredo em disco no momento da escrita, não só
 * no commit (o Portão 1 de nucleo/07-seguranca.md pega no commit; este
 * hook pega antes disso, na origem).
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

function extrairConteudo(entrada) {
  const input = entrada.tool_input || {};
  return input.content || input.new_string || '';
}

function main() {
  const entrada = lerEntradaStdin();
  const conteudo = extrairConteudo(entrada);

  if (!conteudo) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const resultado = motor.checarIntegridade(conteudo);

  if (resultado.bloqueado) {
    process.stdout.write(JSON.stringify({
      decision: 'block',
      reason: `Setup Nexo — bloqueado por integridade (anti-esqueleto/anti-escala): ${JSON.stringify(resultado.achados)}. Ajuste antes de escrever.`,
    }));
    return;
  }

  process.stdout.write(JSON.stringify({}));
}

main();
