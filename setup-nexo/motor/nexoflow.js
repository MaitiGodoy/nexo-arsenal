/**
 * Setup Nexo — ponte com o Nexoflow real (~/.claude/skills/nexoflow/SKILL.md:
 * Opus planeja/revisa, DeepSeek flash executa via proxy local :3200,
 * `bash ~/.claude/scripts/nexoflow.sh "<tarefa>"`).
 *
 * `motor/roteador.js` já resolve papel→backend e monta a instrução de troca
 * de proxy, mas ninguém nunca chamava isso — a troca de backend NUNCA deve
 * acontecer no meio da sessão atual (invalida prompt cache, ver
 * `token-economy`/`model-switch-strategy` no stack global e CLAUDE.md:
 * "Não trocar modelo/effort/fast-mode no meio da sessão"). Por isso este
 * módulo só faz um health-check real do proxy — pra oferecer o nexoflow.sh
 * como processo EXTERNO e separado antes de abrir PLANO.md, nunca pra trocar
 * o backend do Task/subagente da sessão em andamento.
 */

const net = require('net');

const HOST_PROXY = '127.0.0.1';
const PORTA_PROXY = 3200;
const TIMEOUT_MS = 250;

/** Verificação real (TCP connect com timeout curto) se o proxy Nexoflow está no ar. */
function proxyDisponivel() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: HOST_PROXY, port: PORTA_PROXY });
    const encerrar = (disponivel) => {
      socket.destroy();
      resolve(disponivel);
    };
    socket.setTimeout(TIMEOUT_MS);
    socket.once('connect', () => encerrar(true));
    socket.once('timeout', () => encerrar(false));
    socket.once('error', () => encerrar(false));
  });
}

// Mesmo espírito de gatilho do SKILL.md real: só oferece pra implementação
// multi-step de verdade, nunca pra pergunta/leitura/tarefa trivial.
const RE_IMPLEMENTACAO_SUBSTANCIAL = /\b(implementa|implementar|cria|criar|refatora|refatorar|constr[oó]i|construir|corrige|corrigir|adiciona|adicionar|migra|migrar|integra|integrar)\b/i;

function pareceImplementacaoSubstancial(texto) {
  return RE_IMPLEMENTACAO_SUBSTANCIAL.test(texto || '');
}

/**
 * Chamado no protocolo de entrada (Etapa 1, antes de qualquer fase abrir).
 * Não bloqueia nada — só devolve se vale oferecer o nexoflow.sh externo.
 */
async function avaliarOferta(mensagem) {
  if (!pareceImplementacaoSubstancial(mensagem)) {
    return { oferecer: false };
  }
  const disponivel = await proxyDisponivel();
  if (!disponivel) {
    return { oferecer: false, motivo: 'proxy :3200 indisponível, seguindo só com o ciclo de papéis interno (nucleo/03)' };
  }
  return {
    oferecer: true,
    motivo: 'tarefa multi-step com proxy Nexoflow (:3200) disponível — considere `bash ~/.claude/scripts/nexoflow.sh "<tarefa>"` (Opus planeja/revisa, DeepSeek executa) antes de abrir PLANO.md com papéis internos; decisão de uma vez só, nunca troca de backend no meio da sessão (invalida prompt cache)',
  };
}

module.exports = { proxyDisponivel, pareceImplementacaoSubstancial, avaliarOferta };
