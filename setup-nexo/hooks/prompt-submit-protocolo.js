#!/usr/bin/env node
/**
 * Setup Nexo — hook de UserPromptSubmit.
 * Disparado automaticamente a cada mensagem do usuário. Decide se a
 * mensagem exige o protocolo de entrada completo (nucleo/01) ou se é
 * trivial e pode seguir direto. Injeta o lembrete no contexto — quem
 * executa o protocolo de fato é o agente, isto só sinaliza quando aplicar.
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

/**
 * Fail-closed: só é trivial se bater numa lista curta de saudação/confirmação
 * pura. Qualquer outra coisa passa pelo protocolo — a versão anterior
 * (fail-open, exigia verbo de uma lista fixa para contar como "não-trivial")
 * deixava passar pedidos reais como "pode botar mais de navegação" sem
 * acionar o Nexoflow. Ver .nexo/LICOES.md.
 */
function pareceTrivial(mensagem) {
  const texto = (mensagem || '').trim();
  if (texto.length === 0) return true;
  const trivialPuro = /^(oi|ol[aá]|obrigad[oa]|valeu|blz|beleza|ok|show|sim|n[aã]o|perfeito|excelente|top|bom dia|boa tarde|boa noite)[\s!.,?]*$/i;
  return trivialPuro.test(texto);
}

async function main() {
  const entrada = lerEntradaStdin();
  const mensagem = entrada.prompt || '';
  const raizProjeto = entrada.cwd || process.cwd();

  const compressao = motor.checarCompressao(raizProjeto, mensagem);
  const trivial = pareceTrivial(mensagem);

  const partes = [];
  if (!trivial) {
    motor.marcarTurnoNaoTrivial(raizProjeto);
    partes.push(
      'Setup Nexo — protocolo de entrada obrigatório: briefing (macro+micro) → ' +
      'investigação → tira-dúvida só se necessário, antes de planejar. Depois, ' +
      'passe pelo refinador de prompt (nucleo/02) SEMPRE, sem condição — não só ' +
      'quando parecer cru. Investigação inclui consultar OS DOIS roteadores sob ' +
      'demanda juntos (catalogo/CATALOGO.md skills E catalogo/MCP.md) — ' +
      'obrigatório, travado no primeiro Write/Edit até os dois acontecerem (nucleo/01).'
    );
  }
  if (compressao.compactar) {
    partes.push(
      `Setup Nexo — contexto estimado em ~${compressao.tokensAtuais} tokens (heurística, ${compressao.confiabilidade}), acima do limite. ` +
      'Resuma o progresso em PROGRESSO.md (e MEMORIA.md se durável) antes de continuar.'
    );
  }

  const ofertaNexoflow = await motor.avaliarOfertaNexoflow(mensagem);
  if (ofertaNexoflow.oferecer) {
    partes.push(`Setup Nexo — ${ofertaNexoflow.motivo}.`);
  }

  const saida = partes.length > 0
    ? { hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: partes.join('\n\n') } }
    : {};

  process.stdout.write(JSON.stringify(saida));
}

main();
