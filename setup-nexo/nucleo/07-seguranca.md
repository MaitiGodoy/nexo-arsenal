# Portões de Segurança — antes de qualquer commit

Três portões correm em sequência antes de qualquer `git commit` feito sob o
Setup Nexo. Qualquer um que falhe bloqueia o commit — sem exceção manual.

## Portão 1 — Segredo no diff staged

Varre `git diff --cached` contra os padrões em `config/nexo.config.json` →
`seguranca.padroes` (chaves de API, tokens, chaves privadas, senhas em texto
plano). Achado → `git reset` do staged e para. O motivo é reportado ao
usuário com o arquivo e a linha, nunca com o segredo em si exposto de novo.

## Portão 2 — Segredo no histórico ainda não auditado

Na primeira execução em um projeto, varre todo o `git log -p`. Nas seguintes,
varre só o incremento desde a última auditoria (marcador salvo em
`.nexo/estado.json`). Isso pega segredo commitado manualmente fora do fluxo
do Setup Nexo. Achado → mesmo tratamento do portão 1, mais aviso de que o
segredo já está no histórico e precisa de rotação/reescrita, não só remoção
do commit atual.

## Portão 3 — Revisão de segurança da fase

Só roda se a fase que está sendo commitada foi marcada `Segurança: sim` no
plano (`03-nexoflow.md`). O agente auxiliar audita o diff staged contra os
riscos padrão (injeção, exposição de dado sensível, autenticação/autorização
quebrada, entrada de usuário não validada). Achado crítico ou alto → bloqueia
o commit e devolve para correção antes de tentar de novo.

## Depois dos três portões

Passou nos três → commit segue. Se existir rotina de deploy configurada para
o projeto, ela roda depois do commit, nunca antes dos portões.

## Regra de ouro

Nenhum portão é pulado por pressa, por o usuário pedir para pular, ou por o
achado "parecer" falso positivo sem verificação. Se for falso positivo
comprovado, o padrão que gerou o alarme é ajustado em
`config/nexo.config.json`, não ignorado pontualmente.
