---
name: nexo-ssh-automation
description: Executa comandos, inspeciona containers e consulta Postgres na VPS Hostinger via SSH. Use quando precisar rodar algo na VPS, ver logs de container, checar se serviço está no ar, ou puxar dado do banco remoto. Trigger com "roda na vps", "ssh na vps", "vê os containers", "olha o log do prospector", "a vps tá no ar?", "consulta o banco da vps".
---

# SSH Automation — VPS NEXO

Acesso operacional à VPS Hostinger (`srv1643706`) sem abrir terminal na mão.

## Usage
"roda `docker ps` na vps" · "vê o log do container financial" · "a vps tá no ar?"
· "quantos leads tem no banco?"

## What I Need From You
- **Nada, se for comando de leitura** — host e credencial já estão no ambiente.
- **Confirmação explícita** para: restart/stop de container, DELETE/UPDATE no banco,
  alteração de arquivo, deploy.

## Ambiente (fixo — não perguntar)
| Item | Valor |
|---|---|
| Host | `srv1643706.hstgr.cloud` (porta 22) — o IP `177.105.56.81` está **morto**, não usar |
| User | `root` |
| Auth | **chave**: `-i "$HOME/.ssh/hostinger_vps.pem"` (alias `hostinger-vps` no `~/.ssh/config`) |
| Projetos | `/root/projects/*` · `/opt/prospector` · `/opt/jobs` |
| Stack | Docker (financial, searxng, n8n, postgres+pgvector, redis, evolution) |

## Workflow

### 1. Testar alcance antes de tudo
```bash
timeout 20 ssh -i "$HOME/.ssh/hostinger_vps.pem" -o ConnectTimeout=15 -o StrictHostKeyChecking=no root@srv1643706.hstgr.cloud "echo VPS_OK"
```
Timeout → **pare e reporte "VPS offline"**. Não fique retentando em loop.

### 2. Este servidor derruba conexão em rajada
`Connection reset by peer` no meio de uma sequência de comandos é throttling, não
queda da VPS. Antídoto: **um comando por vez, com backoff**, e **evitar heredoc via
stdin** (`ssh ... 'bash -s' <<EOF` reseta com frequência — prefira comando inline
entre aspas simples, ou `cat > /tmp/x.py && python3 /tmp/x.py`).

```bash
for i in 1 2 3 4; do
  timeout 90 ssh -i "$HOME/.ssh/hostinger_vps.pem" -o ConnectTimeout=25 \
    -o ServerAliveInterval=10 root@srv1643706.hstgr.cloud '<comando>' && break
  sleep 20
done
```
ControlMaster/multiplexing **não ajuda** aqui — o master também cai.

### 3. Rodar o comando
Leitura → direto. Escrita/restart → **confirmar com o usuário antes**.

### 4. Introspecção comum
```bash
docker ps --format '{{.Names}}: {{.Status}}'      # o que está no ar
docker logs --tail 50 financial                    # log recente
docker exec -i postgres psql -U user -d financial -c "SELECT count(*) FROM leads;"
systemctl is-active nexo-proxy                     # serviço do proxy
df -h /                                            # disco (VPS é pequena, ~50GB livres)
```

### 5. Validate Before Presenting
- O comando retornou **exit 0**? Se não, mostre o stderr real — não invente diagnóstico.
- Saída vazia é resultado válido (ex: nenhum container) — diga isso, não conclua "falhou".
- Reporte o **output cru** do que importa, não parafraseie número.

## Output Format
```
[VPS 177.105.56.81] <comando>
<saída real, cortada no que importa>
→ <uma linha de leitura do resultado>
```
Offline: `VPS offline (timeout em 10s) — <o que ficou pendente>`

## Examples
**"a vps tá no ar?"**
```
[VPS] echo VPS_OK → VPS_OK
[VPS] docker ps → financial: Up 3 days | postgres: Up 3 days | n8n: Up 3 days
→ No ar, 3 containers rodando.
```

## Constraints
- **Nunca** rodar `rm -rf`, `DROP`, `TRUNCATE`, `docker rm` sem confirmação explícita.
- **Nunca** ecoar a senha no output ou em log.
- Disco é apertado (~50GB) — checar `df -h` antes de baixar/gerar coisa grande.
- Timeout curto (10-15s) e falha limpa. VPS cai com frequência; não travar a sessão.
- Se for muitos comandos, agrupe numa sessão só — não abrir SSH por comando.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
