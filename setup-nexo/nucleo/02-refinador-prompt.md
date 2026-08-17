# Refinador de Prompt — de input cru a prompt profissional, com trava

Todo pedido cru e não-trivial do usuário passa por este refino antes de virar
plano de execução. O objetivo é transformar uma frase solta em um prompt
atômico, específico e verificável — sem queimar token indefinidamente.

## O que "prompt atômico" significa aqui

Um prompt atômico descreve **uma unidade de trabalho verificável**: tem um
objetivo, um escopo de arquivos, uma restrição e um critério de aceite. Um
pedido grande ("cria um setup completo") não vira um prompt atômico só — vira
uma **sequência de fases**, cada uma com seu próprio prompt atômico
(ver `03-nexoflow.md`).

## Loop de refino (com trava dura)

```
entrada crua
   │
   ▼
[1] Extrai objetivo, restrições, critério de aceite do que já foi dito
   │
   ▼
[2] Está completo e sem ambiguidade que mude o resultado?
   │             │
  sim            não → protocolo de entrada (01) decide se pergunta
   │
   ▼
[3] Reescreve como prompt atômico: objetivo · escopo · restrição · aceite
   │
   ▼
[4] Passou pela auto-checagem? (ver abaixo)
   │             │
  sim            não → repete a partir de [3]
   │
   ▼
prompt profissional pronto para virar fase(s)
```

**Trava dura** (lida de `config/nexo.config.json` → `travas`):

- Máximo de `refino_max_iteracoes` voltas no loop (padrão: 3).
- Orçamento de `refino_max_tokens` para todo o refino (padrão: 4000).
- Estourou qualquer um dos dois → para o loop, usa a melhor versão obtida,
  registra em `.nexo/LICOES.md` que esse tipo de pedido precisa de mais
  contexto do usuário da próxima vez, e segue para execução com as premissas
  explícitas no plano (nunca trava o usuário esperando um refino perfeito).

## Auto-checagem (passo 4)

Um prompt está pronto quando responde a estas quatro perguntas sem "depende":

1. O que exatamente deve existir/mudar quando terminar?
2. Em quais arquivos ou área do sistema?
3. O que está fora de escopo?
4. Como alguém confirma que terminou (comando, teste, ou verificação visual)?

## Onde isso pluga

O refinador não substitui o protocolo de entrada — ele roda depois da
investigação, sobre o resultado dela. Pedidos já claros (o usuário já deu
arquivo, escopo e critério) pulam o loop e vão direto para o plano de fases.
