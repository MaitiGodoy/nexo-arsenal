/**
 * Setup Nexo — detecção automática do ambiente hospedeiro.
 * Usado pelo instalador para decidir onde e como se sobrepor sem exigir
 * que o usuário informe qual CLI está usando.
 */

const fs = require('fs');
const path = require('path');

const mapa = require('./mapa.json');

/** Pistas de presença de cada ambiente na árvore do projeto/usuário. */
const PISTAS = {
  'claude-code': ['.claude', 'CLAUDE.md'],
  'gemini-cli': ['.gemini', 'GEMINI.md'],
  'qwen-code': ['.qwen', 'QWEN.md'],
  'opencode': ['.opencode', 'opencode.json'],
  'hermes': ['.hermes', 'HERMES.md'],
  'grok-cli': ['.grok', 'GROK.md'],
  'cursor': ['.cursor', '.cursorrules'],
  'copilot': ['.github/copilot-instructions.md'],
  'codex': ['.codex', 'CODEX.md'],
};

/** Binário real de cada CLI hospedeiro, usado para não criar pasta de config de ambiente fantasma. */
const BINARIOS = {
  'claude-code': 'claude',
  'gemini-cli': 'gemini',
  'qwen-code': 'qwen',
  'opencode': 'opencode',
  'hermes': 'hermes',
  'grok-cli': 'grok',
  'codex': 'codex',
};

function existeAlgum(base, relativos) {
  return relativos.some((r) => fs.existsSync(path.join(base, r)));
}

/** `command -v` em Node puro: procura o binário nos diretórios de PATH. */
function binarioNoPath(comando) {
  if (!comando) return false;
  const dirs = (process.env.PATH || '').split(path.delimiter).filter(Boolean);
  return dirs.some((d) => fs.existsSync(path.join(d, comando)));
}

/**
 * Diz se o ambiente é de verdade instalável na máquina — pasta de config
 * real existe, OU o binário do CLI está no PATH. A detecção por espelho
 * (PISTAS) é uma pista fraca: o próprio instalador escreve os espelhos na
 * raiz, então aceitar espelho como prova de presença faz a instalação
 * crescer sozinha a cada reinstalação (cria `.grok/`, `.codex/` para CLIs
 * que nunca existiram — visto por execução em 2026-08-03).
 */
function estaDeFatoPresente(raiz, id) {
  const configAmbiente = obterConfigAmbiente(id);
  if (fs.existsSync(path.join(raiz, configAmbiente.raizConfig))) return true;
  return binarioNoPath(BINARIOS[id]);
}

/**
 * Detecta todos os ambientes presentes na raiz informada. Retorna lista de
 * ids de `mapa.json`. Se nenhum for detectado, retorna ['generico'] — o
 * Setup Nexo sempre se instala em algum formato, mesmo sem CLI reconhecido.
 */
function detectarAmbientes(raiz) {
  const encontrados = Object.entries(PISTAS)
    .filter(([, relativos]) => existeAlgum(raiz, relativos))
    .map(([id]) => id);

  return encontrados.length > 0 ? encontrados : ['generico'];
}

function obterConfigAmbiente(id) {
  const config = mapa.ambientes.find((a) => a.id === id);
  if (!config) {
    throw new Error(`Ambiente "${id}" não está em adaptadores/mapa.json.`);
  }
  return config;
}

module.exports = { detectarAmbientes, obterConfigAmbiente, estaDeFatoPresente, binarioNoPath, mapa };
