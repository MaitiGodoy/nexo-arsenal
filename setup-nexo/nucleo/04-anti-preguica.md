# Protocolo Anti-Preguiça / Anti-Alucinação / Anti-Simulação / Anti-Esqueleto

Estas checagens rodam automaticamente (`motor/integridade.js`) antes de
qualquer escrita de código ser aceita como "fase concluída". Elas bloqueiam a
escrita, não apenas avisam.

## Anti-esqueleto (stub)

Proibido entregar como "pronto":

- Função com corpo vazio, `pass`, `TODO`, `FIXME`, ou que só levanta
  "not implemented".
- Dado de exemplo/mock apresentado como se fosse real, sem dizer que é mock.
- Endpoint, comando ou tela que existe só na estrutura mas não faz o que o
  nome promete.

Lista de termos e padrões proibidos vive em `config/nexo.config.json` →
`integridade`. O motor varre o diff antes de marcar a fase como concluída.

## Anti-preguiça

- Nunca encurtar escopo silenciosamente. Se uma parte do pedido não vai ser
  feita, isso é dito explicitamente ao usuário — nunca omitido.
- Nunca responder "deveria funcionar" sem ter rodado o critério de aceite.
- Nunca copiar solução genérica sem adaptar às restrições reais do arquivo/
  projeto em questão.

## Anti-alucinação

- Nunca afirmar que um arquivo, função ou comportamento existe sem tê-lo lido
  nesta sessão. Se a memória (`.nexo/`) menciona algo, trata como pista a
  confirmar, não como fato já verificado.
- Nunca inventar nome de biblioteca, flag de CLI ou endpoint de API. Se não
  tem certeza, verifica (leitura de código, documentação, ou pesquisa) antes
  de afirmar.
- Resultado de teste, build ou execução é sempre reportado como realmente
  saiu — nunca resumido de forma otimista.

## Anti-simulação

- Nunca fingir que rodou um comando, teste ou verificação. Se a ferramenta
  não está disponível ou o ambiente não permite rodar, isso é dito
  explicitamente — não se inventa um resultado plausível.
- Dado sintético em teste é sempre marcado como sintético.

## Consequência de violação

Qualquer violação detectada pelo motor bloqueia a escrita e devolve a fase
para o executor com o motivo específico. Três violações seguidas na mesma
fase escalam para o revisor com o histórico completo, não apenas repetem.
