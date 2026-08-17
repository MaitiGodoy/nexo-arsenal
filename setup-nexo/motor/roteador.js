/**
 * Setup Nexo — roteador de backend de modelo por papel.
 * Ver nucleo/03-nexoflow.md. Resolve papel (planejador/executor/revisor/
 * auxiliar) contra config/nexo.config.json → modelos + backends.
 * Trocar de provedor é editar a config — este módulo nunca hardcoda nome
 * de provedor fora do que a config declarar.
 */

function resolverPapel(papel, config) {
  const modeloCfg = config?.modelos?.[papel];
  if (!modeloCfg) {
    throw new Error(`Papel desconhecido no roteador: "${papel}". Verifique config/nexo.config.json -> modelos.`);
  }
  const backendCfg = config?.backends?.[modeloCfg.provider];
  if (!backendCfg) {
    throw new Error(`Backend "${modeloCfg.provider}" não configurado. Verifique config/nexo.config.json -> backends.`);
  }
  return {
    papel,
    provider: modeloCfg.provider,
    modelo: modeloCfg.modelo,
    tipoBackend: backendCfg.tipo, // 'nativo' | 'proxy'
    baseUrl: backendCfg.base_url,
    rotaTroca: backendCfg.rota_troca || null,
  };
}

/**
 * Gera a instrução de troca de backend, se o backend for do tipo proxy.
 * Quem executa a chamada HTTP é o adaptador do ambiente — aqui só se monta
 * a instrução determinística.
 */
function instrucaoTroca(resolucao) {
  if (resolucao.tipoBackend !== 'proxy' || !resolucao.rotaTroca) {
    return null;
  }
  return {
    metodo: 'POST',
    url: `${resolucao.baseUrl}${resolucao.rotaTroca}`,
    corpo: { backend: resolucao.provider, modelo: resolucao.modelo },
  };
}

module.exports = { resolverPapel, instrucaoTroca };
