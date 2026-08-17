/**
 * Setup Nexo — Fase D4: avisa (não bloqueia) quando uma subtarefa que
 * parece determinística está prestes a virar uma chamada de agente/modelo.
 * Ver nucleo/09-economia-de-token.md, escada LLM-free-first.
 */

const PADROES_DETERMINISTICOS = [
  { chave: 'contagem', re: /\b(conta|contar)\b.*\b(quantas|quantos|linhas|arquivos|ocorr[eê]ncias)\b/i },
  { chave: 'busca_texto', re: /\b(busca|buscar|encontra|encontrar|procura|procurar)\s+(a\s+|o\s+)?(string|texto|palavra|padr[aã]o)\b/i },
  { chave: 'listagem', re: /\b(lista|listar)\s+(os\s+|as\s+)?(arquivos|diret[oó]rios|linhas)\b/i },
  { chave: 'ordenacao_dedup', re: /\b(ordena|ordenar|deduplica|deduplicar|dedup)\b/i },
  { chave: 'extracao_json', re: /\b(extrai|extrair|formata|formatar)\b.*\bjson\b/i },
];

/** Retorna aviso quando a descrição da subtarefa bate um padrão resolvível sem modelo. */
function sugerirLlmFreeFirst(descricao) {
  const texto = descricao || '';
  const achado = PADROES_DETERMINISTICOS.find(({ re }) => re.test(texto));
  if (!achado) {
    return { avisar: false };
  }
  return {
    avisar: true,
    chave: achado.chave,
    motivo: `a descrição bate no padrão "${achado.chave}" — antes de delegar a um agente, considere a escada LLM-free-first (nucleo/09-economia-de-token.md): grep/jq/rtk resolvem isto sem chamada de modelo`,
  };
}

module.exports = { PADROES_DETERMINISTICOS, sugerirLlmFreeFirst };
