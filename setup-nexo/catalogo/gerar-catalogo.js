#!/usr/bin/env node
/**
 * Setup Nexo — gerador do catálogo-roteador.
 * Lê biblioteca/ e escreve catalogo/CATALOGO.md a partir do que existe de
 * verdade no disco. Gerado, nunca escrito à mão: assim o catálogo não pode
 * divergir da biblioteca nem citar skill que não existe.
 */

const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const BIBLIOTECA = path.join(RAIZ, 'biblioteca');
const SAIDA = path.join(__dirname, 'CATALOGO.md');

/** Domínio de cada categoria — o que faz a tarefa casar com ela. */
const DOMINIOS = {
  '01-marketing-ads': 'anúncios pagos, copy, campanha, marca, lançamento, e-mail marketing',
  '02-seo': 'SEO técnico e de conteúdo, schema, sitemap, ASO, busca por IA',
  '03-sales-crm': 'prospecção, pipeline, forecast, outreach, CRM, inteligência competitiva',
  '04-cro-conversao': 'teste A/B, otimização e construção de landing page, funil, formulário, paywall',
  '05-dev-engenharia': 'arquitetura, code review, deploy, VPS, banco, SSH, performance, débito técnico',
  '06-data-analytics': 'SQL, dashboard, análise, visualização, métricas, validação de dados',
  '07-produto-pm': 'roadmap, sprint, spec/PRD, status, síntese de pesquisa',
  '08-hr-ops': 'pessoas, contratação, processo, compliance, risco, fornecedor',
  '09-design-visual': 'arte, frontend, imagem, vídeo, animação, responsivo, clonar referência',
  '10-conteudo-escrita': 'aula, documento longo, VSL, whitepaper, YouTube, newsletter',
  '11-token-economy-meta': 'economia de token, troca de modelo, memória, criação de skill',
  '12-utilitarios': 'ferramenta grátis, pesquisa recente, gestão de tarefa, início de sala',
};

function listarCategorias() {
  return fs.readdirSync(BIBLIOTECA)
    .filter((d) => !d.startsWith('_') && fs.statSync(path.join(BIBLIOTECA, d)).isDirectory())
    .sort();
}

function listarSkills(categoria) {
  const dir = path.join(BIBLIOTECA, categoria);
  return fs.readdirSync(dir)
    .filter((s) => fs.existsSync(path.join(dir, s, 'SKILL.md')))
    .sort();
}

function gerar() {
  const categorias = listarCategorias();
  let total = 0;

  const linhas = [];
  linhas.push('# Catálogo — roteador de skills sob demanda');
  linhas.push('');
  linhas.push('**Gerado por `catalogo/gerar-catalogo.js` a partir de `biblioteca/`.**');
  linhas.push('Não editar à mão — rode o gerador depois de mexer na biblioteca.');
  linhas.push('');
  linhas.push('## Como usar (custo zero até casar)');
  linhas.push('');
  linhas.push('Estas skills **não** carregam por padrão. O protocolo de entrada');
  linhas.push('(`nucleo/01-protocolo-entrada.md`) identifica o domínio da tarefa; se casar');
  linhas.push('com uma categoria abaixo, abra **só** a `SKILL.md` da skill correspondente:');
  linhas.push('');
  linhas.push('```');
  linhas.push('biblioteca/<categoria>/<skill>/SKILL.md');
  linhas.push('```');
  linhas.push('');
  linhas.push('Nenhuma tarefa casa? Segue só com o núcleo — ele já cobre o padrão.');
  linhas.push('Nunca invente conteúdo de skill: leia o arquivo real antes de aplicar.');
  linhas.push('');
  linhas.push('---');
  linhas.push('');

  categorias.forEach((cat) => {
    const skills = listarSkills(cat);
    total += skills.length;
    const dominio = DOMINIOS[cat] || 'domínio não descrito';
    linhas.push(`## ${cat} — ${dominio}`);
    linhas.push('');
    linhas.push(skills.join(' · '));
    linhas.push('');
  });

  linhas.push('---');
  linhas.push('');
  linhas.push(`**Total: ${total} skills em ${categorias.length} categorias.**`);
  linhas.push('');
  linhas.push('Skills nativas do Setup Nexo (fora da biblioteca, em `skills/`):');
  linhas.push('`setup-nexo` (prova de vida) · `investigar` (varredura delegada) ·');
  linhas.push('`revisar-seguranca` (checklist antes do commit).');
  linhas.push('');

  fs.writeFileSync(SAIDA, linhas.join('\n'), 'utf8');
  return { total, categorias: categorias.length };
}

if (require.main === module) {
  const r = gerar();
  console.log(`Catálogo gerado: ${r.total} skills em ${r.categorias} categorias.`);
}

module.exports = { gerar, listarCategorias, listarSkills };
