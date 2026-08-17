---
name: github-tool-vetting
description: Metodologia para avaliar e instalar com segurança um repositório do GitHub como ferramenta global do Claude Code (proxy CLI, plugin, hook, skill). Usar antes de instalar qualquer "instale isso e deixe rodando sozinho em todo projeto" vindo de vídeo/redes sociais. Aciona em: "instala esse repositório", "configura pra rodar sozinho", "deixa automático", "ferramenta de economia de token", ou qualquer pedido de instalação global de hook/plugin de terceiros.
---

# Vetting de ferramenta de terceiros antes de instalação global

**Consolidação física (2026-08-11):** [[harness-rollout]] agora mora em
`embedded/harness-rollout/` dentro desta skill (`embedded/PROVENIENCIA.json`
registra origem). Depois de aprovar uma ferramenta aqui, consultar
`embedded/harness-rollout/` pra propagar a instalação pros harnesses locais
e VPS (o passo que normalmente vem em seguida ao vetting).

Origem: processo real usado numa sessão para avaliar e instalar `rtk`, `ECC`
(affaan-m/ECC), `andrej-karpathy-skills` e `open-design`, e para **recusar**
`ruflo/ruflow` e `DeepSpec`.

## Por que isso importa

Instalação **global** (`~/.claude/settings.json`, hooks, plugins) roda em
**todo projeto, para sempre**, sem o usuário revisar cada execução. Diferente
de rodar um comando pontual — aqui o raio de impacto é permanente e o usuário
tipicamente não vai auditar o que foi instalado. Isso exige mais cuidado, não
menos, mesmo (especialmente) quando o pedido é "deixa automático".

## Checklist de vetting (nessa ordem)

1. **Identifique o repositório real.** Nomes ouvidos de vídeo costumam ser
   imprecisos. Busque via `gh search repos` / `WebSearch` e confirme
   descrição, dono, estrelas, atividade recente antes de assumir qual é.

2. **Leia o `install.sh`/instalador antes de rodar.** Veja se ele baixa mais
   coisa, se pede rede, se roda como root/admin, se documenta um perfil
   "mínimo" vs "completo".

3. **Se for binário, valide checksum** contra o publicado no release
   (`sha256sum` vs `checksums.txt`). Nunca execute um binário baixado sem essa
   comparação.

4. **Rode em `--dry-run`/modo plano primeiro**, se o instalador suportar.
   Veja a lista completa de arquivos/paths afetados antes de aplicar de
   verdade.

5. **Audite os hooks por chamada de rede oculta.**
   `grep -rE "https?://|fetch\(|axios|http\.request" <pasta-de-hooks>` e
   confirme que qualquer URL encontrada é só documentação/link, não uma
   chamada real. Isso pega telemetria/exfiltração escondida em ferramentas
   que prometem só "rodar local".

6. **Prefira o caminho de instalação oficialmente recomendado** (ex: plugin
   registrado em `settings.json` via `extraKnownMarketplaces`/
   `enabledPlugins`) em vez de copiar arquivos manualmente — o próprio README
   costuma avisar quando cópia manual causa duplicação/hooks conflitantes.
   Se copiar manualmente hooks.json for desaconselhado no README, respeite.

7. **Faça backup do que já existe** (`settings.json`, `CLAUDE.md`) antes de
   qualquer edição — merge aditivo, nunca sobrescreva sem ler o arquivo atual
   primeiro.

8. **Se existir desinstalador oficial, use-o** para desfazer testes (ex:
   `node scripts/uninstall.js --target claude`) em vez de apagar pastas na
   mão — evita deixar lixo (`install-state.json` etc.) para trás.

9. **Separe "leve" de "pesado".** Um binário de poucos MB ou um único
   `CLAUDE.md` é baixo risco. Um daemon completo (Docker, build de monorepo,
   token de API) é uma decisão de infraestrutura à parte — **sempre confirme
   com o usuário antes de subir um serviço permanente**, mesmo que ele já
   tenha dito "instala tudo".

10. **Verifique a alegação de "economiza token" com fonte independente**, não
    só o marketing do próprio README. Ferramenta com nome/vídeo hype pode
    fazer o oposto (ver lição do `ruflo/ruflow` abaixo).

## Motivos reais de recusa (não instalar) encontrados nesta sessão

- **`ruflo`/`ruflow`** (ex-Claude Flow, 53k+ estrelas): auditoria
  independente publicada mostrou **15-25 mil tokens de overhead por sessão**
  e chamou boa parte dos recursos anunciados de "teatro" (não funcional como
  descrito). Estrelas altas e nome badalado em vídeo **não substituem**
  auditoria de terceiro.
- **`DeepSpec`** (deepseek-ai/DeepSpec): é um projeto de pesquisa de ML para
  treinar modelos de *speculative decoding* (precisa GPU própria e ~38TB de
  cache) — não é uma ferramenta de Claude Code, não existe forma de "rodar em
  toda interação". Antes de instalar, confirme que o repositório resolve o
  problema que o usuário pediu, não apenas que o nome bate.

## Quando pedir confirmação ao usuário (não decidir sozinho)

- Subir um serviço permanente (Docker, daemon) na máquina do usuário.
- Instalar perfil "full"/máximo quando existe opção "mínima" documentada.
- Qualquer coisa que precise reescrever `settings.json` de um jeito não
  aditivo (arriscando apagar configuração já existente).
