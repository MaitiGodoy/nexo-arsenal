# Prioridade de Escala — construir para 1, pronto para milhares

Todo código produzido sob o Setup Nexo assume que hoje serve um único usuário,
mas nunca fecha a porta para escalar sem reescrever do zero. Isso é uma
checagem que o planejador aplica ao desenhar cada fase (ver `03-nexoflow.md`).

## Exigências mínimas em qualquer fase que crie ou altere lógica de serviço

1. **Sem estado mutável global** entre requisições/execuções — estado vive em
   armazenamento explícito (arquivo, banco, cache), nunca em variável de
   módulo compartilhada mutável.
2. **I/O com timeout e retry explícitos** — nenhuma chamada de rede ou disco
   sem tempo limite definido.
3. **Consulta com índice e paginação** — nunca varredura completa de uma
   tabela ou diretório grande como caminho padrão.
4. **Trabalho pesado fora do caminho de resposta** — processamento longo vai
   para fila/background, a resposta ao usuário não espera por ele.
5. **Configuração por ambiente** — nada de host, porta, caminho ou segredo
   hardcoded; tudo lido de config/env.
6. **Custo declarado** — cada fase do plano diz, em uma linha, o custo
   esperado da operação (chamadas de modelo, I/O, tempo) para que decisões de
   escala sejam conscientes, não acidentais.

## O que isso NÃO significa

Não significa construir infraestrutura de milhares de usuários para uma
tarefa de um usuário só. Significa não fechar portas: usar os padrões acima
como default barato, não montar Kubernetes para salvar um arquivo. A régua é
"o dobro do esforço para escalar depois deve ser trivial", não "escalar já".

## Checagem automática

`motor/integridade.js` varre o diff de cada fase contra os seis pontos acima
quando a fase mexe em código de serviço (não em documentação, config estática
ou scripts de uso único). Achados viram observação no `REVIEW.md` da fase —
bloqueiam a aprovação se envolverem os pontos 1, 2 ou 5 (os mais perigosos em
produção real); os pontos 3, 4 e 6 geram aviso, não bloqueio automático.
