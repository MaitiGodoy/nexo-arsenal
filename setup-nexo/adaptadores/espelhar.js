/**
 * Setup Nexo — geração dos espelhos de comportamento (CLAUDE.md, GEMINI.md,
 * QWEN.md, etc). Todos idênticos byte a byte, montados a partir do núcleo.
 * O motor nunca escreve direto num espelho, só via esta função, para nunca
 * divergirem entre si.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function lerNucleoConcatenado(raizSetupNexo) {
  const dirNucleo = path.join(raizSetupNexo, 'nucleo');
  const arquivos = fs.readdirSync(dirNucleo)
    .filter((f) => f.endsWith('.md'))
    .sort(); // nomes prefixados 00..07 garantem a ordem canônica

  return arquivos
    .map((f) => fs.readFileSync(path.join(dirNucleo, f), 'utf8'))
    .join('\n\n---\n\n');
}

/**
 * Fase E2 — hash sha256 (16 hex) do núcleo concatenado, usado como versão
 * do espelho. Embutido no cabeçalho de cada espelho; comparar contra o hash
 * atual do núcleo diz se o espelho está desatualizado em relação à fonte.
 */
function hashNucleo(raizSetupNexo) {
  return crypto.createHash('sha256').update(lerNucleoConcatenado(raizSetupNexo), 'utf8').digest('hex').slice(0, 16);
}

const MARCADOR_VERSAO = '<!-- Versão do núcleo (sha256, 16 hex):';

function cabecalhoEspelho(nomeAmbiente, hash) {
  return [
    `<!-- GERADO PELO SETUP NEXO — não editar manualmente. -->`,
    `<!-- Este arquivo é um espelho: ambiente = ${nomeAmbiente}. -->`,
    `<!-- Todos os espelhos (CLAUDE.md, GEMINI.md, QWEN.md, ...) têm este mesmo conteúdo. -->`,
    `<!-- Fonte da verdade: nucleo/ dentro da instalação do Setup Nexo. -->`,
    `${MARCADOR_VERSAO} ${hash} -->`,
    '',
  ].join('\n');
}

/**
 * Gera o conteúdo final de UM espelho. Todos os espelhos recebem o mesmo
 * corpo (núcleo concatenado) — só o cabeçalho varia o nome do ambiente,
 * como comentário informativo, nunca como diferença de comportamento.
 */
function gerarConteudoEspelho(raizSetupNexo, nomeAmbiente) {
  const corpo = lerNucleoConcatenado(raizSetupNexo);
  const hash = hashNucleo(raizSetupNexo);
  return cabecalhoEspelho(nomeAmbiente, hash) + '\n' + corpo + '\n';
}

/** Extrai o hash de versão embutido no cabeçalho de um espelho já escrito em disco. */
function extrairHashDoEspelho(conteudoEspelho) {
  const linha = (conteudoEspelho || '').split('\n').find((l) => l.startsWith(MARCADOR_VERSAO));
  if (!linha) return null;
  const m = linha.match(/([0-9a-f]{16})/);
  return m ? m[1] : null;
}

/**
 * Fase E2 — diz se os espelhos presentes no projeto estão desatualizados em
 * relação ao núcleo atual da instalação do Setup Nexo (hash embutido no
 * cabeçalho difere do hash recalculado agora). Não reescreve nada sozinho —
 * só informa; regenerar é sempre `escreverTodosOsEspelhos`.
 */
function verificarVersaoNucleo(raizSetupNexo, raizProjeto, config) {
  const hashAtual = hashNucleo(raizSetupNexo);
  const nomes = (config.espelhos || []).filter((n) => fs.existsSync(path.join(raizProjeto, n)));
  if (nomes.length === 0) {
    return { hashAtual, desatualizado: false, semEspelho: true, hashEspelho: null };
  }
  const conteudo = fs.readFileSync(path.join(raizProjeto, nomes[0]), 'utf8');
  const hashEspelho = extrairHashDoEspelho(conteudo);
  return {
    hashAtual,
    hashEspelho,
    semEspelho: false,
    desatualizado: hashEspelho !== hashAtual,
  };
}

/**
 * Escreve TODOS os espelhos configurados em config/nexo.config.json no
 * projeto alvo, sempre com o mesmo conteúdo entre si.
 */
function escreverTodosOsEspelhos(raizSetupNexo, raizProjeto, config) {
  const nomes = config.espelhos || [];
  const escritos = [];
  nomes.forEach((nomeArquivo) => {
    const conteudo = gerarConteudoEspelho(raizSetupNexo, nomeArquivo.replace('.md', ''));
    const destino = path.join(raizProjeto, nomeArquivo);
    fs.writeFileSync(destino, conteudo, 'utf8');
    escritos.push(destino);
  });
  return escritos;
}

/**
 * Extrai o corpo do espelho — tudo após o cabeçalho. O cabeçalho varia por
 * ambiente por design (linha "ambiente = X"), então comparar o arquivo
 * inteiro sempre acusa divergência mesmo com instalação perfeita — o que
 * importa é o corpo (núcleo concatenado) ser idêntico entre espelhos.
 */
function extrairCorpoEspelho(conteudo) {
  const linhas = (conteudo || '').split('\n');
  const idx = linhas.findIndex((l) => l.trim() === '');
  return idx === -1 ? conteudo : linhas.slice(idx + 1).join('\n');
}

/** Confere se todos os espelhos presentes têm exatamente o mesmo corpo (ignora cabeçalho). */
function verificarConsistencia(raizProjeto, config) {
  const nomes = (config.espelhos || []).filter((n) => fs.existsSync(path.join(raizProjeto, n)));
  if (nomes.length <= 1) return { consistente: true, divergentes: [] };

  const corpos = nomes.map((n) => extrairCorpoEspelho(fs.readFileSync(path.join(raizProjeto, n), 'utf8')));
  const referencia = corpos[0];
  const divergentes = nomes.filter((_, i) => corpos[i] !== referencia);
  return { consistente: divergentes.length === 0, divergentes };
}

module.exports = {
  lerNucleoConcatenado,
  hashNucleo,
  gerarConteudoEspelho,
  escreverTodosOsEspelhos,
  verificarConsistencia,
  verificarVersaoNucleo,
  extrairCorpoEspelho,
};
