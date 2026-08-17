/**
 * Setup Nexo — checagens anti-preguiça / anti-alucinação / anti-simulação /
 * anti-esqueleto. Ver nucleo/04-anti-preguica.md.
 *
 * Varre texto de diff/código ANTES de uma fase ser aceita como concluída.
 * Bloqueia a escrita quando encontra violação — não é um lint opcional.
 */

function carregarRegras(config) {
  const cfg = config.integridade || {};
  const termos = cfg.proibido_texto || [];
  return {
    // Marcadores stub em MAIÚSCULO casam case-sensitive com word boundary
    // (antes caíam como substring lowercase e bloqueavam identificadores
    // camelCase — falso positivo visto por execução em 2026-08-03).
    palavrasMaiusculas: termos
      .filter((t) => /[A-Z]/.test(t) && t === t.toUpperCase())
      .map((t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')),
    // Frases proibidas em minúsculo casam case-insensitive, como antes.
    textos: termos
      .filter((t) => !(/[A-Z]/.test(t) && t === t.toUpperCase()))
      .map((t) => t.toLowerCase()),
    regex: (cfg.proibido_regex || []).map((r) => new RegExp(r, 'im')),
  };
}

function verificarTexto(conteudo, regras) {
  const achados = [];
  const conteudoBaixo = conteudo.toLowerCase();

  regras.palavrasMaiusculas.forEach((re) => {
    const m = conteudo.match(re);
    if (m) {
      achados.push({ tipo: 'termo_proibido', termo: re.source });
    }
  });

  regras.textos.forEach((termo) => {
    if (conteudoBaixo.includes(termo)) {
      achados.push({ tipo: 'termo_proibido', termo });
    }
  });

  regras.regex.forEach((re) => {
    const m = conteudo.match(re);
    if (m) {
      achados.push({ tipo: 'padrao_proibido', padrao: re.source, trecho: m[0] });
    }
  });

  return achados;
}

/**
 * Checagem de escala (nucleo/05-escala.md) — heurísticas leves, não
 * substituem revisão humana, mas bloqueiam os riscos mais graves.
 */
function verificarEscala(conteudo) {
  const achados = [];
  const bloqueantes = [
    { chave: 'host_hardcoded', re: /https?:\/\/(localhost|127\.0\.0\.1|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/, bloqueante: true },
    { chave: 'fetch_sem_timeout_aparente', re: /fetch\([^)]*\)(?!.*timeout)/i, bloqueante: false },
  ];
  bloqueantes.forEach(({ chave, re, bloqueante }) => {
    if (re.test(conteudo)) {
      achados.push({ tipo: 'escala', chave, bloqueante });
    }
  });
  return achados;
}

/**
 * Função principal: retorna { bloqueado, achados } para um trecho de
 * conteúdo (diff ou arquivo completo) antes de ser gravado como definitivo.
 */
function checar(conteudo, config) {
  const regras = carregarRegras(config);
  const achadosIntegridade = verificarTexto(conteudo, regras);
  const achadosEscala = verificarEscala(conteudo).filter((a) => a.bloqueante);

  const achados = [...achadosIntegridade, ...achadosEscala];
  return {
    bloqueado: achados.length > 0,
    achados,
  };
}

module.exports = { carregarRegras, verificarTexto, verificarEscala, checar };
