---
name: investigar
description: Varredura ampla de código antes de planejar — usa quando a tarefa toca muitos arquivos, tem naming convention a descobrir, ou exige mapear uma feature existente antes de mexer. Delegue ao papel auxiliar (barato) do Nexoflow em vez de gastar o planejador nisso.
---

# Investigar — varredura delegada

Parte da etapa 2 do protocolo de entrada (`nucleo/01-protocolo-entrada.md`).
Usada quando confirmar "isso já existe?" ou "onde isso vive?" exigiria ler
mais de ~5 arquivos — nesse ponto, delegar ao papel auxiliar do Nexoflow
(`nucleo/03-nexoflow.md`) é mais barato que o planejador fazer sozinho.

## Quando acionar

- A tarefa menciona um comportamento que pode já existir em outro lugar do
  projeto sob outro nome.
- É preciso confirmar uma convenção (nomenclatura, estrutura de pasta,
  padrão de erro) antes de escrever código novo.
- O escopo da tarefa não está claro até mapear como uma feature existente
  funciona hoje.

## Como conduzir

1. Formule a pergunta objetiva (o que exatamente precisa ser confirmado).
2. Delegue ao auxiliar com a pergunta, não com "investiga tudo" — escopo
   fechado economiza token.
3. Volta com file:line, não com o conteúdo completo dos arquivos.
4. Se a resposta muda o plano, registra em `.nexo/DECISOES.md` antes de
   seguir.

## O que NÃO fazer

Não ler o projeto inteiro "por garantia". Não repetir a mesma varredura em
duas tarefas seguidas sem checar `.nexo/MEMORIA.md` primeiro — se já foi
mapeado antes, está lá.
