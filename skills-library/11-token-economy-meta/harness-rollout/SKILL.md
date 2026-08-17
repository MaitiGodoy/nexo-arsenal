---
name: harness-rollout
description: "Propaga skill, hook, comando, automação ou config do Claude Code local pra outros harnesses/CLIs (Qwen Code, Gemini CLI, Grok CLI, OpenCode, Muse, e a VPS) sem copiar cego. Cobre os dois casos: artefato idêntico entre harnesses (skills, agents, commands, MCP — usa install-everywhere.py) e artefato que depende do mecanismo nativo de cada harness (hooks, system prompt sempre carregado, troca de modelo — exige descobrir o schema de cada um antes de escrever). Invocar sempre que o usuário pedir 'leva isso pra VPS', 'instala em todos os harnesses', 'propaga esse hook/skill/comando pra todo lugar', 'faz isso funcionar no Qwen/Gemini/Grok/OpenCode/Muse também', ou qualquer variação de espalhar algo que só existe hoje no Claude Code local."
---

# Harness Rollout

Propagar algo pra múltiplos harnesses/CLIs nunca é "copiar o arquivo pra lá
também". A pergunta certa não é *"onde eu colo isso?"*, é **"esse harness lê
isso do mesmo jeito que o Claude Code lê?"** — e a resposta muda o método
inteiro. Ver [[harness-detect]] pra tabela de detecção de harness (que CLI é
qual, como identificar).

## Os dois caminhos — decida qual antes de agir

### Caminho A — artefato de conteúdo idêntico entre harnesses

Skills (`SKILL.md`), agents, commands, MCP config (`mcpServers`) são **lidos
da mesma forma** por praticamente todo harness compatível com o formato do
Claude Code — o arquivo em si não muda, só o lugar onde ele mora. Pra isso
existe `~/.claude/scripts/install-everywhere.py` (wrapper: `install-everywhere.sh`,
comando: `/install-everywhere`) — não escreva um script novo pra isso, use o
que já existe:

```bash
python ~/.claude/scripts/install-everywhere.py check              # inventário, não escreve
python ~/.claude/scripts/install-everywhere.py push                # propaga os 6 tipos
python ~/.claude/scripts/install-everywhere.py push skills hooks    # só alguns tipos
python ~/.claude/scripts/install-everywhere.py add skill <url|path> # instala + propaga
```

Alvos ficam em `~/.claude/install-targets.json` (editar lá, não no código).

**Detalhe que já mordeu esta VPS uma vez:** o sshd desta VPS Hostinger rejeita
o subsistema SFTP (`paramiko.open_sftp()` dá "Channel closed" mesmo com
autenticação OK — mesmo motivo pelo qual `scp` do sistema precisa da flag
`-O` aqui). `install-everywhere.py` já foi corrigido pra usar só
`exec_command` + transferência via base64 (2026-08-09) — se um dia voltar a
falhar com esse erro específico, o bug é sempre "alguém reintroduziu SFTP",
não a chave nem a senha.

Antes de rodar `push`, sempre rode `check` primeiro e mostre o inventário —
`push` sobrescreve arquivo de mesmo nome no alvo e não remove órfão.

### Caminho B — artefato que depende do mecanismo nativo do harness

Hooks, "isso deve rodar/carregar automaticamente no início da sessão", troca
de modelo, compressão de contexto — essas coisas **não têm um formato
universal**. Copiar o script e assumir que vai funcionar é a forma mais comum
de gerar um "instalei mas não faz nada" silencioso. Este é o caminho que
exige trabalho de verdade, na ordem abaixo.

## O loop de descoberta + adaptação (Caminho B)

### 1. Não confie em tabela/memória antiga sobre quais harnesses existem

`harness-detect.md` é referência, não inventário ao vivo. Antes de instalar
qualquer coisa, confirme que o harness existe *nesta* máquina/VPS de verdade:

```bash
ls -la ~/.claude ~/.qwen ~/.opencode ~/.gemini ~/.muse ~/.grok 2>&1
```

Espere erros de suposição — por exemplo, nesta VPS `~/.muse` não existe (a
config real do Muse mora em `~/.config/muse/`), e `~/.opencode` é só o
binário instalado via npm, a config de verdade do OpenCode CLI está em
`~/.config/opencode/`. Se um `ls` direto falhar, busque:

```bash
find / -maxdepth 3 -iname '*<nome-do-harness>*' 2>/dev/null
```

### 2. Pra cada harness real, responda três perguntas — não assuma nenhuma

1. **Ele tem algum sistema de hooks (ou equivalente)?** — procure `hooks`
   dentro do `settings.json`/`config.json`, e rode `<binário> --help`
   procurando a palavra. Se não achar, não pare aí — pergunte-se se existe
   um mecanismo *equivalente* (arquivo lido automaticamente todo início de
   sessão, ex.: `AGENTS.md`, `CLAUDE.md`). `muse init --dry-run` foi o
   comando que revelou isso pro Muse — sem rodar, nunca teria descoberto.
2. **Se tem, qual o schema exato?** — nomes de campo, se é lista plana ou
   aninhada, se precisa `matcher`/`timeout`. Compare com `jq` entre
   harnesses, nunca assuma que "parece a mesma família" = mesmo schema. Nesta
   VPS, Claude/Qwen/Gemini/Grok/OpenCode acabaram usando *exatamente* o mesmo
   schema (`hooks.SessionStart[].hooks[].{type,command}`) porque um instalador
   comum (`setup-nexo`) normalizou os cinco — mas isso só foi confirmado
   comparando na prática, não presumido antes de olhar.
3. **Ele já tem hooks/config nossos registrados?** — pra não duplicar cego e,
   principalmente, pra nunca sobrescrever hooks de segurança que já estejam
   lá (ex.: bloqueio de comando destrutivo, bloqueio de escrita de segredo).

### 3. Execute sempre com backup e sempre anexando, nunca sobrescrevendo

```bash
cp "$f" "$f.bak-$(date +%Y%m%d-%H%M%S)"                                   # backup antes de qualquer escrita
jq '.hooks.SessionStart += [{"hooks":[{"type":"command","command":"..."}],"matcher":""}]' \
   "$f" > "$f.tmp" && mv "$f.tmp" "$f"                                     # anexa (+=), nunca substitui o array inteiro
```
Sobrescrever o array inteiro apaga hooks de segurança que já estavam
registrados por outro instalador — isso é o erro mais caro possível aqui,
porque quebra silenciosamente proteção que ninguém vai notar até precisar
dela.

### 4. Quando o harness NÃO tem o mecanismo nativo — não force, não finja

Se depois de investigar (passo 2) não existir hook nem equivalente real,
**documente a lacuna explicitamente** em vez de inventar algo que parece
funcionar mas não roda. Antes disso, verifique se a coisa que você queria
"forçar no início" já é descoberta pelo harness de outro jeito — no caso do
Muse, `economy-router` já aparecia em `muse skills list --source all --json`
sem eu ter feito nada, porque o mecanismo de description-sempre-no-contexto
já é universal entre harnesses compatíveis com skill, independente de hook.
Isso reduz o problema de "preciso simular um hook" pra "só preciso do nudge
extra que o hook dava" — e aí sim vale procurar o mecanismo mais próximo real
(no caso do Muse, o `AGENTS.md` de projeto) em vez de desistir.

**Nunca** marque como "✅ instalado" algo que você não confirmou rodando. Se
não tiver jeito nenhum, escreva explicitamente "❌ sem mecanismo, não
forçado" com a evidência (comando que você rodou, output que confirmou a
ausência) — isso é mais útil pro usuário do que um "instalado em todos" que
não é verdade.

### 5. Verifique o efeito, não o código de saída

`jq` não dar erro não prova que o hook ficou certo. Sempre:
- Conte o array antes/depois (`length` no `jq`) — confirma que anexou, não
  substituiu.
- Imprima o **último elemento** do array — confirma que é exatamente o hook
  novo, com o path certo pra aquele harness específico (cada harness tem seu
  próprio path, copiar o mesmo path de outro é o erro mais comum aqui).
- **Rode o script copiado de verdade** (`bash <path> ; echo exit=$?`) — copiar
  o arquivo não prova que ele roda no ambiente de destino (permissão de
  execução, path de interpretador, etc).

### 6. Documente por harness, nunca com uma linha genérica

Uma tabela "harness | onde o artefato foi parar | onde foi registrado |
status testado" vale muito mais que "propagado pra todos". Guarde isso onde
o resto da automação de economia/config já é documentado
(`~/.claude/economy-skills/MANIFEST.md` se for algo de token economy, ou o
doc de referência mais próximo do domínio do artefato).

## Resumo em uma frase

Descobrir antes de copiar, comparar schema antes de escrever, forçar o
mecanismo real de cada harness (nunca fingir que existe um que não existe),
sempre backup + anexar, sempre verificar rodando de verdade, sempre
documentar por harness — nessa ordem, sem pular passo pra ganhar tempo,
porque um hook "instalado" que nunca dispara custa mais tempo depois do que
os 10 minutos que essa investigação toma agora.
