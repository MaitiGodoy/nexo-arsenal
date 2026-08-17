/**
 * Setup Nexo — Fase E1: lição repetida em .nexo/LICOES.md (mesma causa, 2ª
 * vez) vira proposta de edição no núcleo, nunca aplicada sozinha.
 * Ver nucleo/06-memoria.md, seção "Auto-evolução do próprio núcleo".
 */

const fs = require('fs');
const path = require('path');

const STOPWORDS = new Set([
  'para', 'com', 'sem', 'que', 'uma', 'um', 'de', 'da', 'do', 'das', 'dos',
  'em', 'no', 'na', 'nos', 'nas', 'por', 'ao', 'aos', 'as', 'os', 'se', 'foi',
  'ser', 'como', 'mais', 'nao', 'não', 'isso', 'isto', 'esta', 'este',
  'estao', 'estão', 'the', 'and', 'for', 'with', 'antes', 'depois', 'sempre',
]);

function normalizarPalavras(texto) {
  return (texto.toLowerCase().match(/[a-zà-ú0-9]+/g) || [])
    .filter((p) => p.length > 3 && !STOPWORDS.has(p));
}

/** Parseia LICOES.md em entradas {data, texto}, no formato gravado por motor/memoria.js::registrar. */
function extrairEntradas(raizProjeto) {
  const p = path.join(raizProjeto, '.nexo', 'LICOES.md');
  if (!fs.existsSync(p)) return [];
  const bruto = fs.readFileSync(p, 'utf8');
  const blocos = bruto.split(/\n##\s+/).slice(1); // descarta o título antes da 1ª entrada
  return blocos
    .map((bloco) => {
      const quebra = bloco.indexOf('\n');
      const data = quebra === -1 ? bloco.trim() : bloco.slice(0, quebra).trim();
      const texto = quebra === -1 ? '' : bloco.slice(quebra + 1).trim();
      return { data, texto };
    })
    .filter((entrada) => entrada.texto);
}

/** Similaridade de Jaccard sobre palavras significativas — barato, determinístico. */
function similaridade(a, b) {
  const pa = new Set(normalizarPalavras(a));
  const pb = new Set(normalizarPalavras(b));
  if (pa.size === 0 || pb.size === 0) return 0;
  let intersecao = 0;
  pa.forEach((palavra) => { if (pb.has(palavra)) intersecao += 1; });
  const uniao = new Set([...pa, ...pb]).size;
  return intersecao / uniao;
}

const LIMIAR_SIMILARIDADE = 0.4;

/** Agrupa entradas por causa semelhante — só devolve grupos com 2+ ocorrências (repetição real). */
function detectarRepetidas(raizProjeto) {
  const entradas = extrairEntradas(raizProjeto);
  const usados = new Set();
  const grupos = [];

  entradas.forEach((entrada, i) => {
    if (usados.has(i)) return;
    const grupo = [entrada];
    usados.add(i);
    for (let j = i + 1; j < entradas.length; j += 1) {
      if (usados.has(j)) continue;
      if (similaridade(entrada.texto, entradas[j].texto) >= LIMIAR_SIMILARIDADE) {
        grupo.push(entradas[j]);
        usados.add(j);
      }
    }
    if (grupo.length >= 2) grupos.push(grupo);
  });

  return grupos;
}

/** Palavras-chave por arquivo do núcleo — usado só para sugerir candidato, nunca decide sozinho. */
const PALAVRAS_CHAVE_NUCLEO = {
  '00-identidade.md': ['identidade', 'nome', 'marca'],
  '01-protocolo-entrada.md': ['entrada', 'briefing', 'macro', 'micro'],
  '02-refinador-prompt.md': ['refino', 'refinador', 'prompt', 'ambiguo'],
  '03-nexoflow.md': ['fase', 'plano', 'executor', 'revisor', 'nexoflow'],
  '04-anti-preguica.md': ['stub', 'mock', 'todo', 'preguica', 'alucinacao'],
  '05-escala.md': ['escala', 'performance', 'grande', 'volume'],
  '06-memoria.md': ['memoria', 'nexo', 'licoes', 'progresso'],
  '07-seguranca.md': ['segredo', 'seguranca', 'commit', 'destrutivo'],
  '08-pensamento.md': ['pensamento', 'raciocinio', 'analise'],
  '09-economia-de-token.md': ['token', 'economia', 'custo', 'modelo'],
  '10-forma-de-programar.md': ['codigo', 'programar', 'kiss', 'dry'],
  '11-forma-de-interagir.md': ['interagir', 'comunicacao', 'resposta'],
};

/** Sugere o arquivo do núcleo mais provável por sobreposição de palavras-chave (heurística, não decisão). */
function sugerirArquivoNucleo(textoLicao) {
  const palavras = new Set(normalizarPalavras(textoLicao));
  let melhor = null;
  let melhorPontuacao = 0;
  Object.entries(PALAVRAS_CHAVE_NUCLEO).forEach(([arquivo, chaves]) => {
    const pontuacao = chaves.filter((chave) => palavras.has(chave)).length;
    if (pontuacao > melhorPontuacao) {
      melhorPontuacao = pontuacao;
      melhor = arquivo;
    }
  });
  return melhorPontuacao > 0 ? melhor : null;
}

/**
 * Gera as sugestões de evolução do núcleo — só monta o material para o
 * agente propor um diff pequeno; nunca edita nucleo/*.md sozinho, e a
 * aprovação do usuário continua obrigatória (nucleo/06-memoria.md).
 */
function gerarSugestoes(raizProjeto) {
  const grupos = detectarRepetidas(raizProjeto);
  return grupos.map((grupo) => ({
    ocorrencias: grupo.length,
    textos: grupo.map((entrada) => entrada.texto),
    arquivoNucleoSugerido: sugerirArquivoNucleo(grupo.map((entrada) => entrada.texto).join(' ')),
  }));
}

module.exports = {
  extrairEntradas,
  detectarRepetidas,
  sugerirArquivoNucleo,
  gerarSugestoes,
  LIMIAR_SIMILARIDADE,
};
