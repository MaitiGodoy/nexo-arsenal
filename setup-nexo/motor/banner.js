/**
 * Setup Nexo — banner de início de sessão.
 * Roda automaticamente uma vez por sessão. Sinaliza claramente ao usuário
 * que o Setup Nexo está ativo e o que ele contempla, em português.
 */

const CORES = {
  reset: '\x1b[0m',
  roxo: '\x1b[38;5;99m',
  ciano: '\x1b[38;5;51m',
  laranja: '\x1b[38;5;208m',
  verde: '\x1b[38;5;42m',
  cinza: '\x1b[38;5;245m',
  negrito: '\x1b[1m',
};

function pintar(texto, cor) {
  return `${cor}${texto}${CORES.reset}`;
}

const SIMBOLO = [
  '        ◆◆◆        ',
  '      ◆◆   ◆◆      ',
  '    ◆◆   ◆   ◆◆    ',
  '   ◆    ◆ ◆    ◆   ',
  '    ◆◆   ◆   ◆◆    ',
  '      ◆◆   ◆◆      ',
  '        ◆◆◆        ',
];

const ITENS = [
  'Protocolo de entrada — briefing, investigação e tira-dúvida antes de agir',
  'Refinador de prompt — transforma pedido cru em prompt profissional (com trava de token)',
  'Nexoflow — execução por fases atômicas, modelo caro planeja/revisa, barato executa',
  'Anti-preguiça, anti-alucinação, anti-simulação e anti-esqueleto — bloqueio automático',
  'Prioridade de escala — pronto para 1 usuário, preparado para milhares',
  'Memória viva — lê e realimenta MEMORIA, PLANO, LICOES, EVOLUCAO, DECISOES, PROGRESSO',
  'Compressão automática a cada 100 mil tokens',
  'Portões de segurança — segredo no diff, no histórico e revisão antes do commit',
  'Espelhamento — CLAUDE.md, GEMINI.md, QWEN.md e demais sempre idênticos',
];

function montarBanner(nomeAmbiente) {
  const linhas = [];
  linhas.push('');
  SIMBOLO.forEach((linha, i) => {
    const cor = i < 2 ? CORES.roxo : i < 5 ? CORES.ciano : CORES.laranja;
    linhas.push(pintar(linha, cor));
  });
  linhas.push('');
  linhas.push(pintar('  SETUP NEXO', CORES.negrito + CORES.verde) + pintar(`  —  ambiente: ${nomeAmbiente}`, CORES.cinza));
  linhas.push(pintar('  Stack de comportamento, diretriz e automação — ativo nesta sessão.', CORES.cinza));
  linhas.push('');
  linhas.push(pintar('  O que este setup contempla:', CORES.negrito));
  ITENS.forEach((item) => {
    linhas.push('   ' + pintar('›', CORES.verde) + ' ' + item);
  });
  linhas.push('');
  linhas.push(pintar('  Comunicação sempre em português. Nada aqui precisa ser chamado por você.', CORES.cinza));
  linhas.push('');
  return linhas.join('\n');
}

function exibirSeNecessario(raizProjeto, nomeAmbiente, estadoModulo) {
  const estado = estadoModulo.ler(raizProjeto);
  if (estado.bannerExibido) {
    return null; // já mostrado nesta sessão de trabalho
  }
  const banner = montarBanner(nomeAmbiente);
  estadoModulo.atualizar(raizProjeto, { bannerExibido: true });
  return banner;
}

module.exports = { montarBanner, exibirSeNecessario, CORES };
