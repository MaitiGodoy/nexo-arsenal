/**
 * Setup Nexo — compressão automática de contexto a cada N tokens.
 * Ver nucleo/06-memoria.md, seção "Compressão a cada 100k tokens".
 *
 * Fase F4 — decisão sobre a heurística de contagem (avaliada contra a
 * "tabela de confiança" de biblioteca/11-token-economy-meta/token-economy/SKILL.md):
 * `estimarTokens` (motor/refinador.js) usa chars/4, classificado por aquela
 * skill como 50-70% de confiança — mesma faixa de qualquer heurística
 * alternativa (ex: linhas×1.3), porque nenhuma delas é a contagem real da
 * API. A skill confirma: "Hooks NÃO recebem contagem de token"; o único
 * número real vem de `cache_read_input_tokens`/`cache_creation_input_tokens`
 * (statusLine) ou `/usage`, nenhum dos dois acessível daqui. Trocar chars/4
 * por outra fórmula não aumentaria a confiança, só mudaria o palpite — por
 * isso a heurística foi mantida, mas todo valor que sai deste módulo carrega
 * o rótulo `confiabilidade` para nunca ser lido como contagem exata.
 */

const memoria = require('./memoria');
const estadoMod = require('./estado');
const { estimarTokens } = require('./refinador');

const CONFIABILIDADE_ESTIMATIVA = '50-70% (heurística chars/4, NÃO é contagem oficial da API — ver token-economy/SKILL.md)';

/**
 * Verifica se a sessão passou do limite configurado e, se sim, produz o
 * pacote de compressão: o que persistir em disco e o alvo de contexto vivo.
 * Quem efetivamente descarta contexto é o agente hospedeiro — este módulo
 * decide QUANDO e O QUE persistir.
 */
function verificarECompactar(raizProjeto, textoContextoAtual, config) {
  const limite = config?.travas?.compressao_limite_tokens ?? 100000;
  const alvo = config?.travas?.compressao_alvo_tokens ?? 35000;

  // Acumula por turno — cada chamada mede só a mensagem do turno atual,
  // então soma ao total da sessão em vez de sobrescrever (bug corrigido em
  // 2026-08-02: antes disto o limite de 100k nunca disparava de verdade,
  // porque `tokensAtuais` media só a última mensagem, não a sessão inteira).
  const estadoAtual = estadoMod.ler(raizProjeto);
  const tokensAtuais = (estadoAtual.tokensEstimados || 0) + estimarTokens(textoContextoAtual);
  estadoMod.atualizar(raizProjeto, { tokensEstimados: tokensAtuais });

  if (tokensAtuais < limite) {
    return { compactar: false, tokensAtuais, confiabilidade: CONFIABILIDADE_ESTIMATIVA };
  }

  return {
    compactar: true,
    tokensAtuais,
    alvo,
    confiabilidade: CONFIABILIDADE_ESTIMATIVA,
    instrucao: 'Resuma o progresso da sessão e persista em PROGRESSO.md (e MEMORIA.md se durável) antes de descartar o contexto ativo.',
  };
}

/** Executa a persistência da compressão: grava o resumo e marca o estado. */
function aplicar(raizProjeto, resumoProgresso, resumoMemoriaDuravel) {
  if (resumoProgresso) {
    memoria.registrar(raizProjeto, 'progresso', resumoProgresso);
  }
  if (resumoMemoriaDuravel) {
    memoria.registrar(raizProjeto, 'memoria', resumoMemoriaDuravel);
  }
  estadoMod.atualizar(raizProjeto, {
    ultimaCompressao: new Date().toISOString(),
    tokensEstimados: 0,
  });
}

module.exports = { verificarECompactar, aplicar };
