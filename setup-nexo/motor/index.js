/**
 * Setup Nexo — ponto de entrada único do motor.
 * Chamado automaticamente pelos hooks de sessão de cada adaptador
 * (SessionStart / UserPromptSubmit, conforme o CLI hospedeiro). O usuário
 * nunca invoca nada deste arquivo diretamente.
 */

const path = require('path');

const estadoMod = require('./estado');
const memoria = require('./memoria');
const banner = require('./banner');
const refinador = require('./refinador');
const integridade = require('./integridade');
const compressor = require('./compressor');
const seguranca = require('./seguranca');
const roteador = require('./roteador');
const plano = require('./plano');
const economia = require('./economia');
const evolucao = require('./evolucao');
const catalogo = require('./catalogo');
const revisao = require('./revisao');
const nexoflowMod = require('./nexoflow');

function carregarConfig() {
  // Caminho relativo à raiz do Setup Nexo instalado (config/ irmã de motor/).
  return require(path.join(__dirname, '..', 'config', 'nexo.config.json'));
}

/**
 * Chamado uma vez no início de cada sessão pelo hook do adaptador.
 * Retorna o pacote que o agente hospedeiro deve injetar no contexto:
 * banner (se ainda não exibido) + resumo da memória viva.
 */
function iniciarSessao({ raizProjeto, nomeAmbiente }) {
  const config = carregarConfig();
  memoria.garantirTodos(raizProjeto);
  estadoMod.ler(raizProjeto); // garante .nexo/estado.json existir

  const bannerTexto = banner.exibirSeNecessario(raizProjeto, nomeAmbiente || 'desconhecido', estadoMod);
  const resumoMemoria = memoria.resumoCompacto(raizProjeto);

  return { banner: bannerTexto, resumoMemoria, config };
}

/** Chamado a cada turno para decidir se precisa comprimir o contexto. */
function checarCompressao(raizProjeto, textoContextoAtual) {
  const config = carregarConfig();
  return compressor.verificarECompactar(raizProjeto, textoContextoAtual, config);
}

/**
 * Chamado antes de aceitar uma fase como concluída — bloqueia se achar
 * violação de integridade (stub/mock/alucinação) ou risco de escala grave.
 */
function checarIntegridade(conteudo) {
  const config = carregarConfig();
  return integridade.checar(conteudo, config);
}

/** Chamado antes de qualquer `git commit` — roda os três portões em ordem. */
function checarSeguranca(raizProjeto, textoFaseAtual) {
  const config = carregarConfig();
  return seguranca.checarTodos(raizProjeto, config, estadoMod, textoFaseAtual);
}

/** Resolve qual backend/modelo usar para um papel do Nexoflow. */
function resolverModelo(papel) {
  const config = carregarConfig();
  return roteador.resolverPapel(papel, config);
}

/**
 * Fase D1 — bloqueia Task de executor/revisor sem PLANO.md com fase escrita.
 * Também aplica nucleo/06-memoria.md ("virada de fase perto do limite"):
 * mesmo com PLANO.md ok, bloqueia se o contexto acumulado já passou do
 * limite e .nexo/PROGRESSO.md não foi realimentado desde a última
 * compressão — ver motor/plano.js::checarPersistenciaFase.
 */
function checarPlano(raizProjeto, subagentId) {
  const resultadoPlano = plano.checarPlano(raizProjeto, subagentId);
  if (resultadoPlano.bloqueado) {
    return resultadoPlano;
  }
  const resultadoRevisao = revisao.checarRevisaoPendente(raizProjeto, subagentId);
  if (resultadoRevisao.bloqueado) {
    return resultadoRevisao;
  }
  const config = carregarConfig();
  return plano.checarPersistenciaFase(raizProjeto, config);
}

/**
 * Marca no estado da sessão que um Write/Edit foi aplicado (usado pela Fase D2)
 * e, se o arquivo for código real, marca pendente de revisão (rules/ecc/common/
 * code-review.md — ver motor/revisao.js).
 */
function marcarEscrita(raizProjeto, caminhoArquivo) {
  estadoMod.atualizar(raizProjeto, { arquivosTocados: true });
  return revisao.marcarCodigoParaRevisao(raizProjeto, caminhoArquivo);
}

/** Chamado pelo hook PostToolUse de Task — desarma revisão pendente se o agente era revisor. */
function marcarRevisaoFeita(raizProjeto, subagentId) {
  return revisao.marcarRevisaoFeita(raizProjeto, subagentId);
}

/** Chamado pelo hook Stop — bloqueia fim de sessão com código sem revisão. */
function checarRevisaoPendenteFimSessao(raizProjeto) {
  return revisao.checarRevisaoPendenteFimSessao(raizProjeto);
}

/** Fase D2 — bloqueia fim de sessão se tocou arquivo e não realimentou .nexo/. */
function checarMemoriaAtualizada(raizProjeto) {
  const estado = estadoMod.ler(raizProjeto);
  return memoria.precisaAtualizarMemoria(raizProjeto, estado);
}

/** Fase D3 — bloqueia comando Bash destrutivo (rm -rf /, force push, etc.), não só no commit. */
function checarComandoDestrutivo(comando) {
  const config = carregarConfig();
  return seguranca.comandoDestrutivo(comando, config);
}

/** Fase D4 — avisa (não bloqueia) quando uma Task parece resolvível sem modelo. */
function sugerirEconomiaTask(descricao) {
  return economia.sugerirLlmFreeFirst(descricao);
}

/** Fase E1 — lição repetida em LICOES.md vira sugestão de proposta de edição no núcleo. */
function gerarSugestoesEvolucao(raizProjeto) {
  return evolucao.gerarSugestoes(raizProjeto);
}

/** Arma o flag de consulta obrigatória ao roteador (nucleo/01) num turno não-trivial. */
function marcarTurnoNaoTrivial(raizProjeto) {
  return catalogo.marcarTurnoNaoTrivial(raizProjeto);
}

/** Desarma o flag quando um arquivo roteador (catalogo/comandos/agentes) é lido. */
function marcarCatalogoConsultado(raizProjeto, caminhoArquivoLido) {
  return catalogo.marcarCatalogoConsultado(raizProjeto, caminhoArquivoLido);
}

/** Bloqueia Write/Edit se a tarefa não-trivial ainda não consultou o roteador. */
function checarCatalogoConsultado(raizProjeto) {
  return catalogo.checarCatalogoConsultado(raizProjeto);
}

/**
 * Etapa 1 do protocolo de entrada — avalia (não bloqueia) se vale oferecer o
 * Nexoflow real externo (proxy :3200) antes de abrir PLANO.md com papéis
 * internos. Ver motor/nexoflow.js.
 */
function avaliarOfertaNexoflow(mensagem) {
  return nexoflowMod.avaliarOferta(mensagem);
}

module.exports = {
  carregarConfig,
  iniciarSessao,
  checarCompressao,
  checarIntegridade,
  checarSeguranca,
  resolverModelo,
  checarPlano,
  marcarEscrita,
  checarMemoriaAtualizada,
  checarComandoDestrutivo,
  sugerirEconomiaTask,
  gerarSugestoesEvolucao,
  marcarTurnoNaoTrivial,
  marcarCatalogoConsultado,
  checarCatalogoConsultado,
  marcarRevisaoFeita,
  checarRevisaoPendenteFimSessao,
  avaliarOfertaNexoflow,
  registrarMemoria: memoria.registrar,
  criarLoopRefino: refinador.criarLoopRefino,
};
