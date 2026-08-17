/**
 * Setup Nexo — leitura/escrita do estado da sessão em .nexo/estado.json
 * Nenhuma outra parte do motor mexe em disco diretamente para estado —
 * tudo passa por aqui, para manter o schema em um único lugar.
 */

const fs = require('fs');
const path = require('path');

const NOME_DIR = '.nexo';
const NOME_ARQUIVO = 'estado.json';

function caminhoEstado(raizProjeto) {
  return path.join(raizProjeto, NOME_DIR, NOME_ARQUIVO);
}

function estadoPadrao() {
  return {
    sessaoId: `nexo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    iniciadaEm: new Date().toISOString(),
    tokensEstimados: 0,
    ultimaCompressao: null,
    faseAtual: null,
    ultimoScanSeguranca: null,
    bannerExibido: false,
    arquivosTocados: false,
    pendenteConsultaCatalogoSkill: false,
    pendenteConsultaCatalogoMcp: false,
    arquivosCodigoPendentesRevisao: [],
  };
}

function garantirDiretorio(raizProjeto) {
  const dir = path.join(raizProjeto, NOME_DIR);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function ler(raizProjeto) {
  garantirDiretorio(raizProjeto);
  const caminho = caminhoEstado(raizProjeto);
  if (!fs.existsSync(caminho)) {
    const inicial = estadoPadrao();
    escrever(raizProjeto, inicial);
    return inicial;
  }
  try {
    const bruto = fs.readFileSync(caminho, 'utf8');
    return { ...estadoPadrao(), ...JSON.parse(bruto) };
  } catch (erro) {
    // Estado corrompido não pode travar a sessão — reinicia.
    const reiniciado = estadoPadrao();
    escrever(raizProjeto, reiniciado);
    return reiniciado;
  }
}

function escrever(raizProjeto, estado) {
  garantirDiretorio(raizProjeto);
  const caminho = caminhoEstado(raizProjeto);
  fs.writeFileSync(caminho, JSON.stringify(estado, null, 2) + '\n', 'utf8');
  return estado;
}

function atualizar(raizProjeto, patch) {
  const atual = ler(raizProjeto);
  const novo = { ...atual, ...patch };
  return escrever(raizProjeto, novo);
}

module.exports = { ler, escrever, atualizar, caminhoEstado, garantirDiretorio, estadoPadrao };
