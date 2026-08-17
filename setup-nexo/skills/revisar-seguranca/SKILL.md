---
name: revisar-seguranca
description: Checklist de segurança para código que toca autenticação, input de usuário, query de banco, filesystem, API externa ou criptografia. Usa antes do Portão 3 (nucleo/07-seguranca.md) em qualquer fase marcada "Segurança: sim" no plano.
---

# Revisar Segurança — checklist antes do commit

Aplica-se sempre que uma fase do Nexoflow (`nucleo/03-nexoflow.md`) estiver
marcada `Segurança: sim`. Esta skill é o conteúdo que o papel auxiliar usa
para conduzir o Portão 3 (`nucleo/07-seguranca.md`).

## Checklist (OWASP-alinhado, aplicar só ao que for relevante ao diff)

- **Injeção**: toda entrada de usuário em query, comando de shell ou
  caminho de arquivo passa por parametrização/sanitização — nunca
  concatenação direta.
- **Autenticação/autorização**: toda rota ou operação sensível confirma
  identidade e permissão antes de agir, não depois.
- **Exposição de dado sensível**: nenhum segredo, token ou dado pessoal em
  log, mensagem de erro devolvida ao cliente, ou commit.
- **Validação de entrada**: toda entrada externa é validada no limite do
  sistema (schema, tipo, tamanho) antes de processada.
- **Criptografia**: nunca implementação própria de hash/cifra quando existe
  biblioteca padrão madura; segredos nunca em texto plano em disco.
- **CSRF/CORS** (quando aplicável a endpoint web): confirma que a
  configuração não abre origem além do necessário.

## Veredito

- **Nenhum achado crítico ou alto** → aprova, o commit segue.
- **Achado crítico ou alto** → bloqueia, devolve ao executor com o item
  específico da checklist que falhou — nunca um "tem problema de
  segurança" genérico.
