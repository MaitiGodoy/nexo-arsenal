---
name: model-switch-strategy
description: "Decide e executa troca de modelo (Sonnet/Haiku/Opus) por tipo de tarefa sem quebrar o prompt cache. Invocar quando o usuário perguntar 'que modelo usar', 'Haiku dá conta disso', 'trocar pra Opus', ou antes de sugerir troca de modelo no meio de uma sessão."
argument-hint: "sonnet | haiku | opus | recommend"
license: MIT
---

# Model Switch Strategy

Decide qual modelo do Claude usar por tipo de tarefa, e troca com segurança
(entendendo o custo real de trocar no meio de uma sessão).

## Regra de Ouro

```
Sonnet  → coding, refactor, debug, arquitetura, planejamento     (DEFAULT — nunca mudar)
Haiku   → chat, Q&A, leitura, revisão leve, prosa simples          (~90% mais barato)
Opus    → decisão arquitetural crítica, raciocínio máximo          (caro, parcimônia)
```

**Lição já aprendida nesta máquina:** Haiku foi setado como default global uma vez
e causou perda de qualidade em coding. **Nunca deixar Haiku como modelo default de
projeto/global** — só trocar por sessão, conscientemente, pra tarefas de chat.

## ⚠️ Custo real de trocar modelo (por que não trocar à toa)

Prompt cache é por **modelo específico** — cada modelo tem cache próprio. Trocar de
modelo no meio da sessão (via `/model`) força reprocessar TODO o histórico da
conversa sem nenhum cache hit. Isso é **mais caro** no turno seguinte à troca, não
mais barato. Mesma coisa vale pra `/effort` e pra ligar fast mode no meio.

**Portanto:**
- Escolher modelo/effort **no início** da sessão e não mexer durante.
- Se precisar trocar de perfil de tarefa (coding → chat), prefira terminar a sessão
  atual (ou `/compact` numa pausa natural) e abrir nova já com o modelo certo.
- `opusplan` (Opus no plan mode, Sonnet na execução) já invalida cache a cada toggle
  de plan mode — ciente disso ao usar.

## Arquivo desta skill

- `quick-switch-model.sh` — troca o campo `model` em `settings.local.json` via sed.
  Uso: `bash quick-switch-model.sh sonnet` ou `bash quick-switch-model.sh haiku`.
  **Rodar SÓ entre sessões**, nunca no meio de uma sessão ativa (não tem efeito
  imediato mesmo, só aplica na próxima sessão/restart).

## Comando RECOMMEND (decisão assistida)

Perguntar/inferir:
1. A tarefa é escrever/alterar código, debugar, ou decidir arquitetura? → **Sonnet**
2. É só conversa, dúvida rápida, ler/resumir algo, revisão superficial? → **Haiku**
3. É uma decisão de alto risco/irreversível, ou raciocínio muito profundo
   (ex: redesenhar arquitetura de sistema crítico)? → **Opus**

Se a sessão atual já está no meio de uma tarefa, **não recomendar troca agora** —
recomendar pra próxima sessão, e explicar o motivo (custo de invalidar cache).

## Comando SONNET / HAIKU / OPUS

```bash
bash ~/.claude/skills/model-switch-strategy/quick-switch-model.sh sonnet
bash ~/.claude/skills/model-switch-strategy/quick-switch-model.sh haiku
```
Para Opus, editar `settings.local.json` manualmente (`"model": "claude-opus-4-8"`)
ou usar `/model claude-opus-4-8` direto na sessão (aceitando o custo de 1 turno sem
cache, já que normalmente Opus é escolha deliberada pra 1 tarefa específica).
