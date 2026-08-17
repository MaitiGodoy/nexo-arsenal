#!/usr/bin/env bash
# Hook UserPromptSubmit — sugere NEXOFLOW quando o prompt parece tarefa de
# implementação multi-step. Injeta dica no contexto; NÃO bloqueia, NÃO dispara.
input=$(cat 2>/dev/null)
prompt=$(printf '%s' "$input" | sed -n 's/.*"prompt"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p')
[ -z "$prompt" ] && exit 0

# gatilhos de implementação (pt+en), exige verbo de construção
if printf '%s' "$prompt" | grep -qiE '(implementa|construir|constr[oó]i|refatora|adiciona.*(feature|funcionalidade|tela|rota|endpoint|worker|m[oó]dulo|coluna|campo)|cria(r)?.*(worker|endpoint|m[oó]dulo|migration|tela|script|componente|feature)|corrig.*(bug|erro).*(complex|v[aá]rios)|build (a|the) |refactor|implement )'; then
  # ignora se já mencionou nexoflow / não quer
  printf '%s' "$prompt" | grep -qiE 'nexoflow|/ultraplan|sem ciclo|direto mesmo' && exit 0
  cat <<'DICA'
[NEXOFLOW — decisão obrigatória antes de responder, não uma sugestão pra passar os olhos]
Este prompt bateu no gatilho de implementação multi-step. Antes de escrever qualquer
código: classifique em voz alta pro usuário — "isto é trivial (1 arquivo, edição
óbvia)" OU "isto é multi-step, rodo/ofereço o NEXOFLOW" (`nexoflow "<tarefa>"`).
Não pule esta classificação em silêncio. Se concluir que é trivial, diga isso em
uma frase e siga direto — não precisa do ciclo. Este hook NUNCA dispara nada
sozinho; a decisão continua sendo sua, mas tem que ser uma decisão declarada,
não uma omissão.
DICA
fi
exit 0
