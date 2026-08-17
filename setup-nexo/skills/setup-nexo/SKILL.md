---
name: setup-nexo
description: Confirma que o Setup Nexo está instalado e ativo neste ambiente — núcleo, motor, memória viva e espelhos. Use quando o usuário perguntar "o setup nexo tá funcionando", "confirma o setup", "checa o nexo", ou quando quiser prova de que o stack está de pé antes de confiar nele.
---

# Setup Nexo — prova de vida

Esta skill existe para uma coisa só: confirmar, de forma verificável, que o
Setup Nexo está instalado e operando neste ambiente — não é o próprio motor
(que roda sozinho, sem precisar ser chamado).

## O que fazer quando esta skill for invocada

1. Rode `node <raiz-config-do-ambiente>/setup-nexo/instalador/verificar.js <raiz-do-projeto>`.
2. Leia o resultado linha a linha — não resuma otimisticamente.
3. Reporte ao usuário, em português, exatamente o que passou e o que falhou:
   - Núcleo, motor, adaptadores, config presentes no diretório instalado.
   - Espelhos (`CLAUDE.md`, `GEMINI.md`, `QWEN.md`, etc.) com conteúdo
     idêntico entre si.
   - Diretório `.nexo/` (memória viva) presente na raiz do projeto.
4. Se algo falhar, não tente consertar silenciosamente — diga o que falta e
   pergunte se o usuário quer que o instalador rode de novo
   (`instalador/instalar.js`, que sobrepõe com backup automático).

## O que esta skill NÃO faz

Não substitui o motor. Ela não inicia sessão, não gera banner, não roda o
protocolo de entrada — isso já acontece sozinho via hook de sessão do
ambiente. Esta skill é só o "prova que está de pé", para o usuário confirmar
sob demanda sem precisar confiar cegamente.
