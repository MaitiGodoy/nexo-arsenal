/**
 * Setup Nexo — Fase D1: bloqueia execução multi-fase sem PLANO.md em disco.
 * Ver nucleo/03-nexoflow.md. Antes disto, o ciclo de fases dependia só de
 * obediência do agente — nenhum mecanismo impedia um executor/revisor de
 * rodar sem plano escrito.
 */

const fs = require('fs');
const path = require('path');
const estadoMod = require('./estado');
const memoria = require('./memoria');

function carregarMapaAgentes() {
  const p = path.join(__dirname, '..', 'agentes', 'mapa.json');
  if (!fs.existsSync(p)) return { agentes: [] };
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

/** Resolve o papel do Nexoflow (planejador/executor/revisor/auxiliar) de um agente pelo id. */
function papelDoAgente(subagentId) {
  const mapa = carregarMapaAgentes();
  const entrada = (mapa.agentes || []).find((a) => a.id === subagentId);
  return entrada ? entrada.papel : null;
}

/** PLANO.md precisa ter ao menos uma fase escrita (formato do 03-nexoflow.md). */
function planoTemFaseAtiva(raizProjeto) {
  const p = path.join(raizProjeto, '.nexo', 'PLANO.md');
  if (!fs.existsSync(p)) return false;
  const conteudo = fs.readFileSync(p, 'utf8');
  return /^##\s*Fase\s+\d+/im.test(conteudo);
}

/** Só executor e revisor exigem plano — planejador é quem o escreve, auxiliar não decide fase. */
function checarPlano(raizProjeto, subagentId) {
  const papel = papelDoAgente(subagentId);
  if (papel !== 'executor' && papel !== 'revisor') {
    return { bloqueado: false };
  }
  if (planoTemFaseAtiva(raizProjeto)) {
    return { bloqueado: false };
  }
  return {
    bloqueado: true,
    papel,
    motivo: `agente de papel "${papel}" (${subagentId}) chamado sem .nexo/PLANO.md com fase escrita — rode o planejador primeiro (nucleo/03-nexoflow.md)`,
  };
}

/**
 * Enforcement mecânico de nucleo/06-memoria.md, seção "Virada de fase perto
 * do limite". Dispara no mesmo ponto que checarPlano (PreToolUse de Task
 * para executor/revisor — a delegação real de uma próxima fase). Se o
 * contexto acumulado da sessão (`estado.tokensEstimados`, ver
 * motor/compressor.js) já passou do limite e `.nexo/PROGRESSO.md` não foi
 * tocado desde a última compressão (ou desde o início da sessão, se nunca
 * comprimiu), bloqueia — sem isso a regra era só texto no núcleo, sem
 * mecanismo, o que o usuário apontou como "solto".
 */
function checarPersistenciaFase(raizProjeto, config) {
  const estado = estadoMod.ler(raizProjeto);
  const limite = config?.travas?.compressao_limite_tokens ?? 100000;

  if ((estado.tokensEstimados || 0) < limite) {
    return { bloqueado: false };
  }

  const desdeMs = estado.ultimaCompressao
    ? new Date(estado.ultimaCompressao).getTime()
    : new Date(estado.iniciadaEm).getTime();
  const caminhoProgresso = memoria.caminho(raizProjeto, 'progresso');
  const progressoAtualizado = fs.existsSync(caminhoProgresso) && fs.statSync(caminhoProgresso).mtimeMs > desdeMs;

  if (progressoAtualizado) {
    return { bloqueado: false };
  }

  return {
    bloqueado: true,
    tokensEstimados: estado.tokensEstimados,
    motivo: `contexto estimado em ~${estado.tokensEstimados} tokens (heurística) na virada de fase, sem .nexo/PROGRESSO.md atualizado desde a última compressão — grave ali um resumo paste-ready (objetivo da próxima fase, arquivos a ler, decisões tomadas, critério de verificação) antes de delegar (nucleo/06-memoria.md)`,
  };
}

module.exports = { papelDoAgente, planoTemFaseAtiva, checarPlano, checarPersistenciaFase };
