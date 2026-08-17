---
name: security-by-design
description: Doutrina de segurança pra decidir ANTES de escrever código — por camada tocada (auth, input, banco, filesystem, API externa, segredo, cripto, dependência, erro/log), com valor concreto, não checklist genérico OWASP. Use ao planejar ou revisar fase que mexe em autenticação, sessão, input de usuário, query, upload, API externa, cripto, pagamento ou dado sensível. Trigger com "essa fase toca auth", "recebe input de fora", "guarda senha/token", "chama API externa", "mexe em pagamento", "é dado sensível".
---

# Security by Design

Segurança decidida **na hora de planejar**, não caçada depois no diff. Cada camada
tocada tem uma pergunta e uma resposta com valor literal — biblioteca, algoritmo,
parâmetro — nunca o adjetivo "seguro". Isto é o par de `scalability-by-design`: uma
decide o que fica fácil de escalar, esta decide o que fica difícil de explorar.

## Usage
Chamado pelo `/ultraplan` (via `ULTRAPLAN-SPEC.md`, item de segurança) sempre que a
fase toca superfície sensível. Também vale isolado: "essa rota tem SQL injection?",
"como devo guardar essa senha?", "revisa segurança desse upload".

## What I Need From You
- O trecho de plano ou código que toca a superfície sensível.
- Qual camada é: auth, input, banco, filesystem/upload, API externa, segredo,
  cripto, ou erro/log. Se não souber, descreva o dado e eu classifico.

## Workflow

### 1. Identificar a camada tocada
Uma fase pode tocar mais de uma. Vá tabela abaixo por tabela — só as que se aplicam.

### 2. Auth & sessão
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Hash de senha | `argon2id` (ou `bcrypt` cost ≥ 12) | MD5/SHA1 puro, sem salt |
| Token de sessão | `httpOnly` + `secure` + `sameSite=strict`, expira, refresh rotativo | token em `localStorage`, sem expiração |
| Rate limit | por IP + por conta, no endpoint de login/reset | nenhum — permite brute force |
| Autorização | checada no servidor, por recurso, a cada request | confiar em flag do client |

### 3. Input do usuário
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Validação | schema na borda (`zod`, `pydantic`, `joi`) — **allowlist**, não denylist | `if (input.includes('<script>'))` |
| Tamanho | limite explícito por campo (evita DoS de payload gigante) | sem limite |
| Onde valida | servidor, sempre — client é UX, não segurança | só no client |

### 4. Banco / query
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Query | parametrizada / prepared statement / ORM | concatenação de string |
| Usuário do banco | least privilege (sem `DROP`/`ALTER` pro app) | usuário `root`/superuser na app |
| Dado sensível em log | mascarado ou omitido | `console.log(user)` com senha/token junto |

### 5. Filesystem / upload
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Nome do arquivo | gerado pelo servidor (UUID), nunca o nome do client | usar `req.file.name` como path |
| Tipo | valida extensão **e** magic bytes | confia no `Content-Type` do header |
| Onde grava | fora do webroot, ou bucket com ACL própria | dentro de pasta servida publicamente |
| Vírus/malware | scan antes de persistir (`clamd`/ClamAV local, ou API do provedor de storage — S3/GCS têm scan nativo) se o arquivo for baixado por outro usuário depois | aceita e serve sem escanear |

### 6. API externa
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Timeout | explícito (ex: 10s) + retry com backoff | sem timeout — trava a cadeia |
| Certificado | validado (nunca `rejectUnauthorized: false`) | TLS ignorado "pra funcionar rápido" |
| Payload logado | sem PII/segredo | log cru da resposta inteira |

### 7. Segredo & config
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Onde mora | env var / secret manager, `.env` no `.gitignore` | hardcoded no arquivo |
| Rotação | documentada — quem troca, onde | nunca rotacionado desde a criação |
Doutrina completa de gestão: `~/.claude/skills-library/05-dev-engenharia/env-config-manager/SKILL.md`.

### 8. Cripto
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Implementação | lib madura (`libsodium`, `crypto` nativo) | cripto escrita à mão |
| Modo | AEAD (`AES-GCM`) com IV/nonce aleatório por operação | `AES-ECB`, IV fixo/reusado |

### 9. Dependência
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Versão | pinada (lockfile commitado) | `^`/`latest` sem lock |
| Antes de adicionar lib nova | checar CVE conhecida / manutenção ativa | instalar sem checar |

### 10. Erro & log
| Decisão | Valor certo | Errado comum |
|---|---|---|
| Erro pro cliente | mensagem genérica, sem stack trace | stack trace / SQL cru na resposta |
| Log do servidor | detalhado, mas sem segredo/PII | log e resposta ao cliente idênticos |

### 11. Hardening anti-intrusão (o que endurece contra tentativa de invasão)

Isto é **defensivo** — reduz a chance de exploração bem-sucedida. Não é pentest,
não é caça a atacante, não é ferramenta ofensiva (ver Constraints).

| Decisão | Valor certo | Errado comum |
|---|---|---|
| Rate limit geral | por IP + por rota, com backoff (`express-rate-limit`, `slowapi`, etc.) | só no login, resto sem limite |
| Brute force / login | bloqueio progressivo (tipo fail2ban) após N tentativas, por conta e por IP | tentativa infinita sem penalidade |
| Headers HTTP | `Content-Security-Policy`, `X-Frame-Options: DENY`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` | resposta sem headers de segurança |
| CORS | allowlist explícita de origem | `Access-Control-Allow-Origin: *` em rota autenticada |
| Log de tentativa suspeita | registra IP + rota + motivo (não bloqueia sozinho — alimenta análise) | silêncio total até o incidente |
| Dependência com CVE conhecida | fixa versão corrigida antes de mergear (ver item 9) | ignora aviso do `npm audit`/`pip-audit` |

### 12. Validate Before Presenting
Toda decisão desta lista que você aplicou virou **valor literal** no plano ou no
código? Se ainda tem "validação adequada" ou "hash seguro" sem nome de lib/algoritmo,
volta e crava. Regra igual à `ULTRAPLAN-SPEC.md`: adjetivo não é decisão.

## Output Format
Quando chamado pelo `/ultraplan`, produz a seção **"Direção de segurança"** do plano
— mesmo espírito da "Direção estética":
```
## Direção de segurança
Camadas tocadas: <auth | input | banco | filesystem | api-externa | segredo | cripto>
- <camada>: <decisão com valor literal> (ex: "auth: argon2id cost 3, token httpOnly+secure+sameSite=strict, expira 15min, refresh rotativo")
- <camada>: ...
Sem superfície sensível: escreva "n/a".
```
Quando chamado isolado (pergunta direta), responde: camada identificada → tabela
relevante → decisão recomendada com valor literal → o que evitar.

## Examples
**"como guardo a senha do usuário?"**
→ camada: auth. Decisão: `argon2id`, cost padrão da lib (não custom), nunca reversível
(hash, não encrypt). Errado comum a evitar: SHA256 sem salt, "encriptar e poder
decriptar depois" (senha nunca deve ser recuperável, só resetável).

**Fase do ULTRAPLAN que sobe upload de avatar**
→ camadas: input + filesystem. Direção: schema valida `mimetype` no `multipart`,
nome do arquivo = `uuid4() + extensão validada por magic bytes`, grava em bucket
separado do webroot com ACL própria, limite de 5MB por arquivo.

## Constraints
- Não vire burocracia em fase sem superfície sensível — se nenhuma camada bate,
  a resposta é "n/a" e ponto, não force um achado.
- Isto decide o **design**, antes do código existir. A auditoria **reativa** sobre
  o diff staged continua sendo o agente `security-reviewer` (chamado pelo
  `nexoflow.sh` no portão de commit) — as duas camadas são complementares, não
  substitutas uma da outra.
- Não decida sozinho compliance regulatória (LGPD/PCI/HIPAA) além do óbvio (não
  logar PII) — isso é `08-hr-ops/compliance-tracking` ou humano.
- **Escopo é defensivo, não ofensivo.** "Anti-hacker" aqui significa hardening —
  rate limit, headers, bloqueio de brute force, scan de upload — não pentest, não
  exploração, não varredura de porta/rede de terceiro, não ferramenta de ataque.
  Engajamento de teste de invasão real (red team, pentest autorizado) é outra
  categoria de trabalho, com autorização explícita — peça ao usuário se for o caso.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
