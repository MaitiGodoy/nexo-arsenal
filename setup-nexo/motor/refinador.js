/**
 * Setup Nexo — refinador de prompt cru → prompt profissional atômico.
 * Ver nucleo/02-refinador-prompt.md para a especificação completa.
 *
 * Este módulo não chama modelo diretamente — ele estrutura o loop e as
 * travas; quem gera cada versão do prompt é o próprio agente hospedeiro,
 * seguindo o protocolo. Aqui vive a lógica determinística: contagem de
 * iteração, orçamento de token e a checklist de completude.
 */

function estimarTokens(texto) {
  // Heurística leve e determinística (sem chamada de rede): ~4 chars/token.
  return Math.ceil((texto || '').length / 4);
}

function autoChecagem(promptEstruturado) {
  const campos = ['objetivo', 'escopo', 'restricoes', 'aceite'];
  const faltando = campos.filter((c) => !promptEstruturado[c] || String(promptEstruturado[c]).trim() === '');
  return { completo: faltando.length === 0, faltando };
}

/**
 * Cria o controlador do loop de refino com as travas da config.
 * O chamador (agente hospedeiro) itera manualmente: a cada rodada, produz
 * uma nova versão do prompt estruturado e chama `avaliar()`.
 */
function criarLoopRefino(travas) {
  const maxIteracoes = travas.refino_max_iteracoes ?? 3;
  const maxTokens = travas.refino_max_tokens ?? 4000;

  let iteracao = 0;
  let tokensGastos = 0;
  let melhorVersao = null;

  function avaliar(promptEstruturado, tokensUsadosNestaRodada) {
    iteracao += 1;
    tokensGastos += estimarTokens(JSON.stringify(promptEstruturado)) + (tokensUsadosNestaRodada || 0);

    const checagem = autoChecagem(promptEstruturado);
    if (checagem.completo || !melhorVersao) {
      melhorVersao = promptEstruturado;
    }

    const estourouIteracoes = iteracao >= maxIteracoes;
    const estourouTokens = tokensGastos >= maxTokens;
    const travado = estourouIteracoes || estourouTokens;

    return {
      pronto: checagem.completo,
      travado,
      motivoTrava: travado ? (estourouIteracoes ? 'max_iteracoes' : 'max_tokens') : null,
      faltando: checagem.faltando,
      iteracao,
      tokensGastos,
      versaoFinal: checagem.completo || travado ? melhorVersao : null,
    };
  }

  return { avaliar, estado: () => ({ iteracao, tokensGastos }) };
}

module.exports = { estimarTokens, autoChecagem, criarLoopRefino };
