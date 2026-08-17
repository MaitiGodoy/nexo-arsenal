/**
 * Setup Nexo — enforcement mecânico de "roteador sob demanda é obrigatório,
 * nunca decisão do usuário" (nucleo/01-protocolo-entrada.md, Etapa 2, e
 * catalogo/CATALOGO.md). Mesmo padrão de motor/plano.js: campos em
 * estado.json + um hook que bloqueia, não um pedido em texto que a IA pode
 * esquecer de seguir.
 *
 * Fluxo: UserPromptSubmit não-trivial arma DOIS flags (skill e MCP) → primeiro
 * Write/Edit da fase é bloqueado até OS DOIS terem sido lidos — catalogo/CATALOGO.md
 * (skills) E catalogo/MCP.md (MCP), não um OU outro. Antes disto qualquer um dos
 * quatro arquivos roteador desarmava sozinho; usuário apontou que passar pelo
 * catálogo de skill sem passar pelo de MCP deixava a decisão de MCP de fora do
 * fluxo — corrigido em 2026-08-02. comandos/mapa.json e agentes/mapa.json continuam
 * roteadores de leitura recomendada mas não bloqueiam sozinhos.
 */

const path = require('path');
const estadoMod = require('./estado');

const CATALOGO_SKILL_RE = /catalogo[\\/]CATALOGO\.md$/;
const CATALOGO_MCP_RE = /catalogo[\\/]MCP\.md$/;

/** Chamado pelo hook de UserPromptSubmit quando a mensagem não é trivial. */
function marcarTurnoNaoTrivial(raizProjeto) {
  return estadoMod.atualizar(raizProjeto, {
    pendenteConsultaCatalogoSkill: true,
    pendenteConsultaCatalogoMcp: true,
  });
}

/** Chamado pelo hook de PostToolUse de Read quando o arquivo lido é um roteador. */
function marcarCatalogoConsultado(raizProjeto, caminhoArquivoLido) {
  const arquivo = (caminhoArquivoLido || '').replace(/\//g, path.sep);
  const patch = {};
  if (CATALOGO_SKILL_RE.test(arquivo)) patch.pendenteConsultaCatalogoSkill = false;
  if (CATALOGO_MCP_RE.test(arquivo)) patch.pendenteConsultaCatalogoMcp = false;
  if (Object.keys(patch).length === 0) {
    return { marcado: false };
  }
  estadoMod.atualizar(raizProjeto, patch);
  return { marcado: true };
}

/** Chamado pelo hook de PreToolUse de Write/Edit — decide se bloqueia. */
function checarCatalogoConsultado(raizProjeto) {
  const estado = estadoMod.ler(raizProjeto);
  const faltaSkill = !!estado.pendenteConsultaCatalogoSkill;
  const faltaMcp = !!estado.pendenteConsultaCatalogoMcp;
  if (!faltaSkill && !faltaMcp) {
    return { bloqueado: false };
  }
  const faltando = [
    faltaSkill && 'catalogo/CATALOGO.md (skill por domínio)',
    faltaMcp && 'catalogo/MCP.md (MCP por domínio)',
  ].filter(Boolean).join(' e ');
  return {
    bloqueado: true,
    motivo: `tarefa não-trivial ainda sem consultar ${faltando} — os dois catálogos são obrigatórios juntos, não um ou outro (nucleo/01-protocolo-entrada.md)`,
  };
}

module.exports = { marcarTurnoNaoTrivial, marcarCatalogoConsultado, checarCatalogoConsultado };
