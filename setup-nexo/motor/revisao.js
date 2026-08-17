/**
 * Setup Nexo — enforcement mecânico do checklist de review do ECC
 * (rules/ecc/common/code-review.md, "MANDATORY review triggers: After writing
 * or modifying code"). Antes disto, esse checklist só existia como instrução
 * que a IA seguia de cabeça — nenhum hook do setup-nexo verificava se um
 * agente revisor (code-reviewer/security-reviewer/python-reviewer/etc, ver
 * agentes/mapa.json) realmente rodou depois de código real ser escrito.
 * Mesmo padrão de motor/plano.js e motor/catalogo.js: lista em estado.json +
 * PreToolUse bloqueia + PostToolUse desarma.
 */

const estadoMod = require('./estado');
const planoMod = require('./plano');

// "Código real" para fins deste gate — .md, .json de config e afins ficam de fora.
const EXT_CODIGO = /\.(js|jsx|ts|tsx|mjs|cjs|py|go|rs|java|kt|swift|rb|php|c|cpp|h|hpp|cs|sql)$/i;

// Agentes revisores identificados pelo id, não pelo papel — security-reviewer e
// diff-reviewer são classificados papel "auxiliar" em agentes/mapa.json (ver
// nucleo/07-seguranca.md, "portão 3"), mas ainda contam como revisão de código.
const RE_AGENTE_REVISOR = /review/i;

function ehArquivoDeCodigo(caminho) {
  return EXT_CODIGO.test(caminho || '');
}

function ehAgenteRevisor(subagentId) {
  return RE_AGENTE_REVISOR.test(subagentId || '');
}

/** Chamado pelo hook PostToolUse de Write/Edit — marca arquivo pendente de revisão. */
function marcarCodigoParaRevisao(raizProjeto, caminhoArquivo) {
  if (!ehArquivoDeCodigo(caminhoArquivo)) {
    return { marcado: false };
  }
  const estado = estadoMod.ler(raizProjeto);
  const pendentes = new Set(estado.arquivosCodigoPendentesRevisao || []);
  pendentes.add(caminhoArquivo);
  estadoMod.atualizar(raizProjeto, { arquivosCodigoPendentesRevisao: [...pendentes] });
  return { marcado: true };
}

/** Chamado pelo hook PostToolUse de Task — limpa a lista quando um agente revisor rodou. */
function marcarRevisaoFeita(raizProjeto, subagentId) {
  if (!ehAgenteRevisor(subagentId)) {
    return { limpo: false };
  }
  estadoMod.atualizar(raizProjeto, { arquivosCodigoPendentesRevisao: [] });
  return { limpo: true };
}

function formatarPendentes(pendentes) {
  const lista = pendentes.slice(0, 3).join(', ');
  return pendentes.length > 3 ? `${lista}, +${pendentes.length - 3}` : lista;
}

/** Chamado pelo hook PreToolUse de Task — bloqueia nova fase de executor com código sem revisão. */
function checarRevisaoPendente(raizProjeto, subagentId) {
  const papel = planoMod.papelDoAgente(subagentId);
  if (papel !== 'executor') {
    return { bloqueado: false };
  }
  const estado = estadoMod.ler(raizProjeto);
  const pendentes = estado.arquivosCodigoPendentesRevisao || [];
  if (pendentes.length === 0) {
    return { bloqueado: false };
  }
  return {
    bloqueado: true,
    pendentes,
    motivo: `${pendentes.length} arquivo(s) de código sem revisão da fase anterior (${formatarPendentes(pendentes)}) — rode um agente revisor (code-reviewer/security-reviewer/etc, agentes/mapa.json) antes de abrir fase nova (rules/ecc/common/code-review.md)`,
  };
}

/** Chamado pelo hook Stop — mesma checagem, mas pro fim de sessão. */
function checarRevisaoPendenteFimSessao(raizProjeto) {
  const estado = estadoMod.ler(raizProjeto);
  const pendentes = estado.arquivosCodigoPendentesRevisao || [];
  if (pendentes.length === 0) {
    return { bloqueado: false };
  }
  return {
    bloqueado: true,
    pendentes,
    motivo: `sessão terminando com ${pendentes.length} arquivo(s) de código sem revisão (${formatarPendentes(pendentes)}) — rode um agente revisor antes de encerrar (rules/ecc/common/code-review.md)`,
  };
}

module.exports = {
  ehArquivoDeCodigo,
  ehAgenteRevisor,
  marcarCodigoParaRevisao,
  marcarRevisaoFeita,
  checarRevisaoPendente,
  checarRevisaoPendenteFimSessao,
};
