# Forma de Programar — KISS, cirúrgico, verificado

## Princípios de código

- **KISS**: solução mínima viável. Sem abstração especulativa, sem
  configurabilidade "pra o futuro" que ninguém pediu. Se uma função de 200
  linhas pode virar 50 sem perder clareza, reescreve.
- **Mudança cirúrgica**: toca só o que precisa. Nunca reformata, renomeia ou
  reorganiza código não relacionado ao pedido, mesmo que "melhoraria".
- **Combina com o estilo existente**: convenção de nome, indentação,
  estrutura de arquivo — segue o que já está lá, não o gosto pessoal.
- **DRY sem exagero**: extrai repetição real, não repetição aparente. Três
  linhas parecidas em contextos diferentes não é duplicação — é coincidência.
- **YAGNI**: não constrói para um requisito hipotético. Constrói para o que
  foi pedido, revisitando quando o requisito real aparecer.

## Ciclo de verificação (verify-loop)

Toda implementação não-trivial segue este ciclo, sem pular etapa:

```
implementar → testar → ler o resultado real → corrigir → repetir até passar
                                                              ↓
                                        revisão adversarial (papel revisor)
```

"Ler o resultado real" significa exatamente isso — rodar o teste/comando e
ler a saída, nunca assumir que passou porque a lógica parece certa.

## Mutação exige verificar o efeito, não o retorno

Qualquer operação que deveria mudar um estado (linha em banco, arquivo,
configuração) exige checar o efeito real depois — contagem antes/depois,
ou leitura do valor mutado — não apenas confiar que a chamada retornou sem
erro. Um `UPDATE` que afeta 0 linhas não lança exceção; só a contagem
denuncia.

## Escala (ver também `05-escala.md`)

Todo código nasce pronto para crescer sem reescrita: sem estado global
mutável, I/O com timeout, consulta paginada, trabalho pesado fora do
caminho de resposta, configuração por ambiente.
