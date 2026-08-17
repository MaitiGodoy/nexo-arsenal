#!/usr/bin/env node
/**
 * Setup Nexo — hook de início de sessão.
 * Disparado automaticamente pelo evento SessionStart do CLI hospedeiro.
 * Lê stdin no formato do hook (JSON com cwd), chama o motor, e imprime
 * o banner + resumo de memória em stdout para o agente injetar no contexto.
 * O usuário nunca roda este arquivo manualmente.
 */

const path = require('path');
const motor = require(path.join(__dirname, '..', 'motor', 'index.js'));
const { verificarVersaoNucleo } = require(path.join(__dirname, '..', 'adaptadores', 'espelhar.js'));

function lerEntradaStdin() {
  try {
    const bruto = require('fs').readFileSync(0, 'utf8');
    return JSON.parse(bruto);
  } catch (erro) {
    return {};
  }
}

function main() {
  const entrada = lerEntradaStdin();
  const raizProjeto = entrada.cwd || process.cwd();
  const nomeAmbiente = entrada.ambiente || process.env.NEXO_AMBIENTE || 'desconhecido';

  const resultado = motor.iniciarSessao({ raizProjeto, nomeAmbiente });

  // Lido UMA VEZ no boot (nucleo/06-memoria.md) — nunca em loop a cada mensagem.
  const path = require('path');
  const fs = require('fs');
  const arqPath = path.join(__dirname, '..', 'ARQUITETURA.md');
  const arquitetura = fs.existsSync(arqPath) ? fs.readFileSync(arqPath, 'utf8') : '';
  const hooksPath = path.join(__dirname, '..', 'baseline', 'settings.hooks.json');
  const hooksAtivos = fs.existsSync(hooksPath) ? fs.readFileSync(hooksPath, 'utf8') : '';
  const envPath = path.join(__dirname, '..', 'baseline', 'settings.env.json');
  const envRecomendado = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

  // Fase E2 — avisa se o espelho (CLAUDE.md/GEMINI.md/...) está desatualizado
  // em relação ao núcleo (nucleo/*.md) desta instalação do Setup Nexo.
  let avisoVersao = '';
  try {
    const raizSetupNexo = path.join(__dirname, '..');
    const versaoNucleo = verificarVersaoNucleo(raizSetupNexo, raizProjeto, resultado.config);
    if (versaoNucleo.desatualizado) {
      avisoVersao = `## Núcleo desatualizado\n\nO espelho neste projeto (hash ${versaoNucleo.hashEspelho || 'sem hash'}) está desatualizado em relação ao núcleo desta instalação (hash ${versaoNucleo.hashAtual}). Reinstale para regenerar: \`node instalador/instalar.js --alvo=<projeto>\`.`;
    }
  } catch (erro) {
    // Checagem best-effort — nunca bloqueia o boot da sessão.
  }

  const saida = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: [
        resultado.banner || '',
        resultado.resumoMemoria ? `## Memória viva do projeto\n\n${resultado.resumoMemoria}` : '',
        arquitetura ? `## Arquitetura do Setup Nexo (lida uma vez no boot)\n\n${arquitetura}` : '',
        hooksAtivos ? `## Hooks ativos nesta instalação\n\n${hooksAtivos}` : '',
        envRecomendado ? `## Env vars de economia recomendadas (config global do CLI, não deste projeto)\n\n${envRecomendado}` : '',
        avisoVersao,
      ].filter(Boolean).join('\n\n'),
    },
  };

  process.stdout.write(JSON.stringify(saida));
}

main();
