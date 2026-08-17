/**
 * Setup Nexo — leitura e realimentação obrigatória da memória viva (.nexo/*.md)
 * Ver nucleo/06-memoria.md para a especificação completa.
 */

const fs = require('fs');
const path = require('path');

const ARQUIVOS = {
  licoes: 'LICOES.md',
  plano: 'PLANO.md',
  memoria: 'MEMORIA.md',
  evolucao: 'EVOLUCAO.md',
  decisoes: 'DECISOES.md',
  progresso: 'PROGRESSO.md',
};

function caminho(raizProjeto, chave) {
  return path.join(raizProjeto, '.nexo', ARQUIVOS[chave]);
}

function cabecalhoPadrao(chave) {
  const titulos = {
    licoes: '# Lições\n\nErros e como evitá-los. Máximo 3 linhas por entrada.\n',
    plano: '# Plano\n\nPlano de fases da tarefa em andamento.\n',
    memoria: '# Memória\n\nFatos duráveis do projeto: arquitetura, convenções, decisões estruturais.\n',
    evolucao: '# Evolução\n\nMudanças de abordagem ao longo do tempo.\n',
    decisoes: '# Decisões\n\nDecisões tomadas no protocolo de entrada — assumidas ou respondidas.\n',
    progresso: '# Progresso\n\nEstado corrente do projeto.\n',
  };
  return titulos[chave] + '\n';
}

function garantirTodos(raizProjeto) {
  const dir = path.join(raizProjeto, '.nexo');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  Object.entries(ARQUIVOS).forEach(([chave, nome]) => {
    const p = path.join(dir, nome);
    if (!fs.existsSync(p)) {
      fs.writeFileSync(p, cabecalhoPadrao(chave), 'utf8');
    }
  });
}

function lerTudo(raizProjeto) {
  garantirTodos(raizProjeto);
  const resultado = {};
  Object.keys(ARQUIVOS).forEach((chave) => {
    const p = caminho(raizProjeto, chave);
    resultado[chave] = fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  });
  return resultado;
}

/** Anexa uma entrada datada a um dos seis arquivos — realimentação obrigatória. */
function registrar(raizProjeto, chave, textoEntrada) {
  garantirTodos(raizProjeto);
  const p = caminho(raizProjeto, chave);
  const data = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const linha = `\n## ${data}\n${textoEntrada.trim()}\n`;
  fs.appendFileSync(p, linha, 'utf8');
}

/**
 * Gera um resumo compacto de todos os arquivos para injeção no contexto —
 * usado quando o conteúdo bruto já é grande demais.
 */
function resumoCompacto(raizProjeto, maxCharsPorArquivo = 1200) {
  const tudo = lerTudo(raizProjeto);
  const partes = [];
  Object.entries(tudo).forEach(([chave, conteudo]) => {
    if (!conteudo.trim()) return;
    const corte = conteudo.length > maxCharsPorArquivo
      ? conteudo.slice(-maxCharsPorArquivo) // mantém o mais recente
      : conteudo;
    partes.push(`### ${ARQUIVOS[chave]}\n${corte.trim()}`);
  });
  return partes.join('\n\n');
}

/**
 * Fase D2 — bloqueia fim de sessão sem `.nexo/` atualizado.
 * Só exige atualização se a sessão de fato tocou arquivo (Write/Edit já
 * marcou `estado.arquivosTocados`, ver motor/estado.js). Considera
 * "atualizado" se PROGRESSO.md ou PLANO.md foi modificado depois do início
 * da sessão — não exige os seis arquivos, só os dois que mudam por turno.
 */
function arquivoTocadoDepoisDe(raizProjeto, chave, desdeMs) {
  const p = caminho(raizProjeto, chave);
  if (!fs.existsSync(p)) return false;
  return fs.statSync(p).mtimeMs > desdeMs;
}

function precisaAtualizarMemoria(raizProjeto, estado) {
  if (!estado || !estado.arquivosTocados) {
    return { bloqueado: false };
  }
  const desdeMs = new Date(estado.iniciadaEm).getTime();
  const tocouProgresso = arquivoTocadoDepoisDe(raizProjeto, 'progresso', desdeMs);
  const tocouPlano = arquivoTocadoDepoisDe(raizProjeto, 'plano', desdeMs);
  if (tocouProgresso || tocouPlano) {
    return { bloqueado: false };
  }
  return {
    bloqueado: true,
    motivo: 'a sessão tocou arquivo(s) mas .nexo/PROGRESSO.md (nem PLANO.md) foi atualizado desde o início — realimentação obrigatória (nucleo/06-memoria.md) antes de encerrar',
  };
}

module.exports = {
  ARQUIVOS,
  caminho,
  garantirTodos,
  lerTudo,
  registrar,
  resumoCompacto,
  precisaAtualizarMemoria,
};
