/**
 * Setup Nexo — portões de segurança antes de commit.
 * Ver nucleo/07-seguranca.md. Wrapper puro em cima de child_process/git;
 * quem invoca é o hook PreToolUse configurado no adaptador do ambiente.
 */

const { execFileSync } = require('child_process');

/** Roda git sem shell — argumentos como array, nunca string interpolada. */
function rodarGit(argsArray, cwd) {
  try {
    return execFileSync('git', argsArray, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (erro) {
    return erro.stdout ? erro.stdout.toString() : '';
  }
}

function compilarPadroes(config) {
  return (config?.seguranca?.padroes || []).map((p) => {
    // `(?i)` é sintaxe PCRE, inválida em new RegExp do JS. Converte para a
    // flag `i` e remove o marcador do source (visto por execução em
    // 2026-08-03: o Portão 1 morria com SyntaxError em qualquer git commit).
    const insensivel = p.includes('(?i)');
    return new RegExp(p.replace(/\(\?i\)/g, ''), insensivel ? 'gi' : 'g');
  });
}

/** Portão 1 — segredo no diff staged. */
function portaoDiffStaged(raizProjeto, config) {
  const diff = rodarGit(['diff', '--cached'], raizProjeto);
  const padroes = compilarPadroes(config);
  const achados = [];
  padroes.forEach((re) => {
    const m = diff.match(re);
    if (m) achados.push({ padrao: re.source, ocorrencias: m.length });
  });
  return { bloqueado: achados.length > 0, achados };
}

/** Portão 2 — segredo no histórico ainda não auditado (incremental). */
function portaoHistorico(raizProjeto, config, estadoMod) {
  const estado = estadoMod.ler(raizProjeto);
  const desde = estado.ultimoScanSeguranca;
  const args = desde ? ['log', '-p', `--since=${desde}`] : ['log', '-p'];
  const log = rodarGit(args, raizProjeto);
  const padroes = compilarPadroes(config);
  const achados = [];
  padroes.forEach((re) => {
    const m = log.match(re);
    if (m) achados.push({ padrao: re.source, ocorrencias: m.length });
  });
  estadoMod.atualizar(raizProjeto, { ultimoScanSeguranca: new Date().toISOString() });
  return { bloqueado: achados.length > 0, achados };
}

/** Portão 3 — sinaliza que a fase precisa de revisão de segurança dedicada
 *  (a revisão em si é feita pelo agente auxiliar; este módulo só decide
 *  se o portão se aplica, lendo o campo `Segurança:` do PLANO.md da fase). */
function faseExigeRevisao(textoFase) {
  return /segurança:\s*sim/i.test(textoFase || '');
}

function checarTodos(raizProjeto, config, estadoMod, textoFaseAtual) {
  const p1 = portaoDiffStaged(raizProjeto, config);
  if (p1.bloqueado) return { portao: 1, ...p1 };

  const p2 = portaoHistorico(raizProjeto, config, estadoMod);
  if (p2.bloqueado) return { portao: 2, ...p2 };

  const exigeP3 = faseExigeRevisao(textoFaseAtual);
  return { portao: exigeP3 ? 3 : 0, bloqueado: false, exigeRevisaoDedicada: exigeP3 };
}

/**
 * Fase D3 — porta a única checagem realmente nova de
 * hooks/shell/block-destructive-bash-global.sh (as outras 12 .sh são
 * redundantes com este motor ou superadas pelo rtk — ver ARQUITETURA.md).
 * Roda no PreToolUse de qualquer Bash, não só antes de commit.
 */
function comandoDestrutivo(comando, config) {
  const padroes = (config?.seguranca?.comandos_destrutivos || []).map((p) => new RegExp(p, 'i'));
  const achado = padroes.find((re) => re.test(comando || ''));
  return achado
    ? { bloqueado: true, padrao: achado.source }
    : { bloqueado: false };
}

module.exports = { portaoDiffStaged, portaoHistorico, faseExigeRevisao, checarTodos, comandoDestrutivo, compilarPadroes };
