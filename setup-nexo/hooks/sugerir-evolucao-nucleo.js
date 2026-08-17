#!/usr/bin/env node
/**
 * Setup Nexo — hook de PostToolUse para Write/Edit.
 * Fase E1: quando .nexo/LICOES.md é escrito, checa se alguma lição se
 * repetiu (mesma causa, 2ª vez) e avisa o agente para propor um diff
 * pequeno no arquivo do núcleo relevante — nunca aplica sozinho, aprovação
 * do usuário é obrigatória (nucleo/06-memoria.md).
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
  const arquivo = entrada?.tool_input?.file_path || entrada?.tool_input?.path || '';

  if (!/LICOES\.md$/.test(arquivo)) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const raizProjeto = entrada.cwd || process.cwd();
  const sugestoes = motor.gerarSugestoesEvolucao(raizProjeto);

  if (sugestoes.length === 0) {
    process.stdout.write(JSON.stringify({}));
    return;
  }

  const texto = sugestoes
    .map((s) => {
      const candidato = s.arquivoNucleoSugerido
        ? `candidato: nucleo/${s.arquivoNucleoSugerido}`
        : 'nenhum arquivo do núcleo casou por palavra-chave, avalie manualmente';
      const exemplo = s.textos[s.textos.length - 1].slice(0, 200);
      return `- Lição repetida ${s.ocorrencias}x — ${candidato}\n  "${exemplo}"`;
    })
    .join('\n');

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `Setup Nexo — auto-evolução do núcleo (nucleo/06-memoria.md): lição(ões) repetida(s) detectada(s) em .nexo/LICOES.md. Monte um diff pequeno e específico para o arquivo do núcleo sugerido e peça aprovação do usuário antes de editar — nunca aplique sozinho.\n\n${texto}`,
    },
  }));
}

main();
