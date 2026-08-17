#!/usr/bin/env node
/**
 * Setup Nexo — hook de PreCompact.
 * Disparado antes de uma compactação nativa do CLI hospedeiro (diferente
 * da compressão do motor a cada 100k, que é proativa — este é reativo ao
 * evento nativo do ambiente, como rede de segurança). Garante que
 * PROGRESSO.md está atualizado antes que o contexto seja cortado por fora.
 */

const path = require('path');
const memoria = require(path.join(__dirname, '..', 'motor', 'memoria.js'));

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

  memoria.registrar(
    raizProjeto,
    'progresso',
    'Compactação nativa do ambiente disparada — ver histórico de PLANO.md e DECISOES.md para continuar a partir daqui.'
  );

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreCompact',
      additionalContext: 'Setup Nexo — PROGRESSO.md atualizado antes da compactação. Releia .nexo/ ao retomar.',
    },
  }));
}

main();
