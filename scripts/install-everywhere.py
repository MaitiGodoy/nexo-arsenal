#!/usr/bin/env python3
"""install-everywhere — propaga TUDO (skills, skills-active, plugins, hooks,
commands, agents, MCP) de ~/.claude para todos os ambientes.

TODAS as fases abaixo são OBRIGATÓRIAS — check sempre reporta cópias aninhadas
desatualizadas, push sempre sincroniza cópias aninhadas ANTES de propagar. Não
é etapa opcional nem sugestão: pular isso é o que deixa uma skill (ex:
tardis/skills/economy-router) presa numa versão velha mesmo depois do
canônico ter sido atualizado e propagado.

    install-everywhere check                  inventário local x remoto + cópias aninhadas desatualizadas, não escreve
    install-everywhere push [tipo ...]        sincroniza cópias aninhadas E propaga (default: todos os tipos)
    install-everywhere add <tipo> <origem>    instala em ~/.claude e depois propaga
    install-everywhere sync-nested [--fix]    só a varredura de cópias aninhadas (sem tocar em push/check)

tipos: skills skills-active plugins hooks commands agents mcp

Alvos ficam em ~/.claude/install-targets.json (config fora do código — editar lá,
não aqui). Criado com os defaults na primeira execução.

VPS Hostinger aceita CHAVE (~/.ssh/hostinger_vps.pem, confirmado 2026-07-23) — é o
método preferido, sem segredo em lugar nenhum. $VPS_PASSWORD é só fallback, se um
dia a chave for revogada. paramiko em vez de rsync/scp (rsync não existe nesta
máquina). A senha, quando usada, vem de env var — nunca do código, nunca de arquivo.
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# Windows: console é cp1252 por padrão e engasga nos box-drawing/✓ abaixo.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

LOCAL = Path.home() / ".claude"
TARGETS_FILE = LOCAL / "install-targets.json"
SKIP = {".git", "__pycache__", "node_modules", ".DS_Store", "marketplaces", "cache"}
# Registro interno do Claude Code, gerado por máquina (installPath absoluto,
# marketplace cache) — NUNCA propagar. Foi assim que um "installPath":
# "C:\\Users\\..." acabou corrompendo o registro de plugin da VPS (Linux).
SKIP_FILES = {"installed_plugins.json", "known_marketplaces.json", ".last_inuse_sweep"}
SSH_KEY = Path.home() / ".ssh" / "hostinger_vps.pem"


def can_reach_remote():
    """Tem chave OU senha em env — algum jeito de autenticar."""
    return SSH_KEY.is_file() or bool(os.environ.get("VPS_PASSWORD"))

# tipo -> (origem local, caminho relativo no alvo)
ARTIFACTS = {
    "skills":        ("skills-library", "skills-library"),
    "skills-active": ("skills",         "skills"),  # ~/.claude/skills — economy-router, tardis etc,
                                                       # os invocáveis via Skill tool. Sem isso o push
                                                       # nunca propagava essa pasta pra lugar nenhum.
    "plugins":  ("plugins",        "plugins"),
    "hooks":    ("hooks",          "hooks"),
    "commands": ("commands",       "commands"),
    "agents":   ("agents",         "agents"),
    "scripts":  ("scripts",        "scripts"),
}

# Arquivos soltos do nexoflow (não moram em nenhum ARTIFACTS dir) — propagados
# junto com o tipo "scripts", já que nexoflow.sh não funciona sem eles.
NEXOFLOW_FILES = ["NEXOFLOW.md", "nexoflow/ULTRAPLAN-SPEC.md", "secret-patterns.txt"]

DEFAULT_TARGETS = {
    "local": [],
    "remote": [
        {"name": "Claude CLI (VPS)", "host": "177.105.56.81", "user": "root", "base": "/root/.claude"},
        {"name": "Qwen (VPS)",       "host": "177.105.56.81", "user": "root", "base": "/root/.qwen"},
        {"name": "OpenCode (VPS)",   "host": "177.105.56.81", "user": "root", "base": "/opt/open-code"},
        {"name": "Prospector (VPS)", "host": "177.105.56.81", "user": "root", "base": "/opt/prospector"},
    ],
}


def load_targets():
    if not TARGETS_FILE.exists():
        TARGETS_FILE.write_text(json.dumps(DEFAULT_TARGETS, indent=2), encoding="utf-8")
        print(f"→ criado {TARGETS_FILE} com os alvos padrão (edite lá para mudar)")
    return json.loads(TARGETS_FILE.read_text(encoding="utf-8"))


def mcp_payload():
    """mcpServers do config global -> formato .mcp.json. {} se não houver nenhum."""
    cfg = Path.home() / ".claude.json"
    if not cfg.exists():
        return {}
    try:
        return json.loads(cfg.read_text(encoding="utf-8")).get("mcpServers") or {}
    except (json.JSONDecodeError, OSError):
        return {}


def walk(src: Path):
    """(caminho absoluto, caminho relativo) de cada arquivo, pulando lixo."""
    for root, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in SKIP]
        for f in files:
            if f.endswith(".pyc") or f in SKIP_FILES:
                continue
            p = Path(root) / f
            yield p, p.relative_to(src)


def count(src: Path):
    return sum(1 for _ in walk(src)) if src.is_dir() else 0


# ───────────────────── cópias aninhadas ─────────────────────
# Um artefato (skill, hook, agent...) pode ter uma CÓPIA embutida dentro da
# pasta de outro artefato — ex: tardis orquestra economy-router e mantém sua
# própria cópia em skills/tardis/skills/economy-router/, separada da cópia
# canônica em skills/economy-router/. Atualizar só a canônica e propagar não
# alcança essa cópia embutida: ela fica presa na versão antiga, local E em
# todo harness/VPS pra onde isso for propagado. sync_nested() acha e conserta
# ISSO antes do push — vale pra qualquer tipo (skill dentro de skill, hook
# dentro de plugin etc), não só skills.
NESTED_SCAN_ROOTS = ("skills", "skills-library", "hooks", "commands", "agents")


def canonical_map():
    """nome -> caminho canônico, para cada skill de topo e cada hook/command/agent solto."""
    m = {}
    skills_root = LOCAL / "skills"
    if skills_root.is_dir():
        for d in skills_root.iterdir():
            if d.is_dir() and d.name not in SKIP:
                m.setdefault(d.name, d)
    lib_root = LOCAL / "skills-library"
    if lib_root.is_dir():
        for cat in lib_root.iterdir():
            if not cat.is_dir() or cat.name in SKIP:
                continue
            for d in cat.iterdir():
                if d.is_dir():
                    m.setdefault(d.name, d)
    for kind in ("hooks", "commands", "agents"):
        root = LOCAL / kind
        if root.is_dir():
            for f in root.iterdir():
                if f.is_file():
                    m.setdefault(f.name, f)
    return m


def find_nested_copies():
    """(canônico, aninhado) para toda cópia enterrada dentro da pasta de OUTRO
    artefato — não é o mesmo caminho canônico nem um alvo de propagação."""
    canon = canonical_map()
    canon_paths = set(canon.values())
    hits = []
    for root_name in NESTED_SCAN_ROOTS:
        root = LOCAL / root_name
        if not root.is_dir():
            continue
        for path in root.rglob("*"):
            if path in canon_paths:
                continue
            rel_parts = path.relative_to(LOCAL).parts
            if len(rel_parts) < 3:  # precisa estar DENTRO da pasta de outro artefato
                continue
            if any(part in SKIP for part in rel_parts):
                continue
            c = canon.get(path.name)
            if c is None or c == path or c.is_dir() != path.is_dir():
                continue
            hits.append((c, path))
    return hits


def _content_diff(a: Path, b: Path) -> bool:
    if a.is_file():
        return a.read_bytes() != b.read_bytes()
    af = {rel: f for f, rel in walk(a)}
    bf = {rel: f for f, rel in walk(b)}
    if set(af) != set(bf):
        return True
    return any(af[rel].read_bytes() != bf[rel].read_bytes() for rel in af)


def sync_nested(fix: bool) -> int:
    """Relata (fix=False) ou conserta (fix=True) cópias aninhadas desatualizadas.
    SEMPRE roda antes de check/push — não é opcional, é a única forma de garantir
    que a versão que o usuário atualizou é a mesma que corre em todo lugar."""
    hits = find_nested_copies()
    if not hits:
        print("── cópias aninhadas: nenhuma encontrada")
        return 0
    stale = [(c, n) for c, n in hits if _content_diff(c, n)]
    print(f"── cópias aninhadas: {len(hits)} encontrada(s), {len(stale)} desatualizada(s)")
    for c, n in stale:
        rel_c, rel_n = c.relative_to(LOCAL), n.relative_to(LOCAL)
        if fix:
            if n.is_dir():
                shutil.rmtree(n)
                shutil.copytree(c, n, ignore=shutil.ignore_patterns(*SKIP))
            else:
                shutil.copy2(c, n)
            print(f"   ✓ sincronizada  {rel_n}  ←  {rel_c}")
        else:
            print(f"   ⚠ DESATUALIZADA  {rel_n}  (canônica: {rel_c})")
    if stale and not fix:
        print("   → rode `push` (sincroniza e propaga junto) antes de considerar isso feito")
    return 1 if (stale and not fix) else 0


# ─────────────────────────── check ───────────────────────────
def cmd_check(types):
    nested_rc = sync_nested(fix=False)  # obrigatório, não é etapa opcional do check
    print("── LOCAL (~/.claude)")
    for t in types:
        if t == "mcp":
            m = mcp_payload()
            print(f"   mcp        {len(m)} servidor(es): {', '.join(m) or '(nenhum)'}")
            continue
        src, _ = ARTIFACTS[t]
        p = LOCAL / src
        print(f"   {t:<10} {count(p):>4} arquivos  {'' if p.is_dir() else '(pasta não existe)'}")

    tg = load_targets()
    for t in tg.get("local", []):
        base = Path(os.path.expanduser(t["base"]))
        print(f"── {t['name']}  {base}  {'ok' if base.is_dir() else 'AUSENTE'}")

    remote = tg.get("remote", [])
    if not remote:
        return nested_rc
    print(f"── REMOTO ({len(remote)} alvos)")
    if not can_reach_remote():
        print(f"   ⚠ Sem chave ({SSH_KEY}) nem $VPS_PASSWORD — não dá pra inspecionar.")
        senha_help()
        return 1
    for t in remote:
        try:
            with connect(t) as (ssh, _):
                _, out, _ = ssh.exec_command(f"ls {t['base']} 2>/dev/null | tr '\\n' ' '")
                print(f"   {t['name']:<20} {out.read().decode().strip() or '(vazio)'}")
        except Exception as e:  # noqa: BLE001 — offline é resultado válido aqui
            print(f"   {t['name']:<20} ✗ {type(e).__name__}: {e}")
    return nested_rc


def senha_help():
    print(f"     preferido: chave em {SSH_KEY}")
    print("     fallback:  export VPS_PASSWORD='...'   (bash)")
    print("                $env:VPS_PASSWORD='...'     (PowerShell)")
    print("   A senha nunca entra em arquivo versionado.")


def _load_key():
    """hostinger_vps.pem é PKCS#8 genérico (BEGIN PRIVATE KEY) — os loaders
    clássicos do paramiko (RSAKey/Ed25519Key/ECDSAKey.from_private_key_file) só
    entendem PKCS#1 ou OpenSSH nativo, e rejeitam esse arquivo com
    "not a valid ... key file" mesmo ele sendo uma chave RSA válida (o `ssh` do
    sistema abre sem problema). Fix: reconverte em MEMÓRIA pro formato OpenSSH
    via `cryptography` — nunca escreve a chave convertida em disco."""
    import io
    import paramiko
    from cryptography.hazmat.primitives import serialization

    priv = serialization.load_pem_private_key(SSH_KEY.read_bytes(), password=None)
    openssh_pem = priv.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.OpenSSH,
        encryption_algorithm=serialization.NoEncryption(),
    )
    loaders = {"RSAPrivateKey": paramiko.RSAKey, "Ed25519PrivateKey": paramiko.Ed25519Key,
               "EllipticCurvePrivateKey": paramiko.ECDSAKey}
    loader = loaders.get(type(priv).__name__, paramiko.RSAKey)
    return loader.from_private_key(io.StringIO(openssh_pem.decode()))


# ─────────────────────────── push ───────────────────────────
# Esta VPS rejeita o subsistema SFTP (open_sftp() dá "Channel closed" mesmo
# com auth OK — confirmado 2026-08-09, sshd só aceita o protocolo SCP legado,
# o mesmo motivo pelo qual `scp` do sistema precisa de `-O` aqui). exec_command
# funciona normalmente. Por isso todo transfer de arquivo passa por
# exec_command + base64 (via stdin), nunca por sftp.put — não reintroduzir
# open_sftp() nesse arquivo sem antes testar de novo nesta VPS.
def connect(t):
    import paramiko

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    if SSH_KEY.is_file():
        ssh.connect(t["host"], username=t["user"], pkey=_load_key(),
                    timeout=10, allow_agent=False, look_for_keys=False)
    else:
        ssh.connect(t["host"], username=t["user"], password=os.environ["VPS_PASSWORD"],
                    timeout=10, allow_agent=False, look_for_keys=False)
    return _Conn(ssh)


class _Conn:
    def __init__(self, ssh):
        self.ssh = ssh

    def __enter__(self):
        return self.ssh, None

    def __exit__(self, *a):
        self.ssh.close()


def remote_put_bytes(ssh, remote_path, data: bytes):
    """Escreve bytes num arquivo remoto via exec_command (sem SFTP)."""
    import base64
    b64 = base64.b64encode(data).decode()
    stdin, stdout, stderr = ssh.exec_command(f"base64 -d > '{remote_path}'")
    stdin.write(b64)
    stdin.channel.shutdown_write()
    rc = stdout.channel.recv_exit_status()
    if rc != 0:
        raise RuntimeError(f"remote_put_bytes falhou ({remote_path}): {stderr.read().decode()}")


# Extensões cujo conteúdo QUEBRA no Linux se for com CRLF. Windows salva .sh
# com \r\n; o transporte é base64 (byte-a-byte fiel), então o \r chegava intacto
# e o shell lia `exit 0\r` -> "numeric argument required", exit 2. Foi assim que
# um push derrubou 89 hooks .sh nos 4 ambientes (2026-08-16).
LF_EXTS = {".sh", ".bash", ".zsh"}


def normalize_eol(data: bytes, path: Path) -> bytes:
    """CRLF -> LF em arquivo que o shell executa. Binário/resto passa intacto."""
    if path.suffix.lower() not in LF_EXTS:
        return data
    return data.replace(b"\r\n", b"\n")


def remote_put(ssh, local_path: Path, remote_path: str):
    remote_put_bytes(ssh, remote_path, normalize_eol(local_path.read_bytes(), local_path))


def push_local(types, targets):
    for t in targets:
        base = Path(os.path.expanduser(t["base"]))
        base.mkdir(parents=True, exist_ok=True)
        n = 0
        for ty in types:
            if ty == "mcp":
                (base / ".mcp.json").write_text(
                    json.dumps({"mcpServers": mcp_payload()}, indent=2), encoding="utf-8")
                n += 1
                continue
            src, dst = ARTIFACTS[ty]
            s = LOCAL / src
            if s.is_dir():
                for f, rel in walk(s):
                    d = base / dst / rel
                    d.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(f, d)
                    n += 1
            if ty == "scripts":
                for rel in NEXOFLOW_FILES:
                    f = LOCAL / rel
                    if not f.is_file():
                        continue
                    d = base / rel
                    d.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(f, d)
                    n += 1
        print(f"   ✓ {t['name']}: {n} arquivos")


def push_remote(types, targets):
    if not targets:
        return 0
    if not can_reach_remote():
        print(f"   ✗ Sem chave ({SSH_KEY}) nem $VPS_PASSWORD — pulei os alvos remotos.")
        senha_help()
        return 1
    rc = 0
    for t in targets:
        print(f"   [{t['name']}]")
        try:
            with connect(t) as (ssh, _):
                mkdirs(ssh, t["base"])
                n = 0
                for ty in types:
                    if ty == "mcp":
                        remote_write(ssh, f"{t['base']}/.mcp.json",
                                     json.dumps({"mcpServers": mcp_payload()}, indent=2))
                        n += 1
                        continue
                    src, dst = ARTIFACTS[ty]
                    s = LOCAL / src
                    made = set()
                    if s.is_dir():
                        for f, rel in walk(s):
                            remote = f"{t['base']}/{dst}/{rel.as_posix()}"
                            parent = remote.rsplit("/", 1)[0]
                            if parent not in made:
                                mkdirs(ssh, parent)
                                made.add(parent)
                            remote_put(ssh, f, remote)
                            n += 1
                    if ty == "scripts":
                        for rel in NEXOFLOW_FILES:
                            f = LOCAL / rel
                            if not f.is_file():
                                continue
                            remote = f"{t['base']}/{rel}"
                            parent = remote.rsplit("/", 1)[0]
                            if parent not in made:
                                mkdirs(ssh, parent)
                                made.add(parent)
                            remote_put(ssh, f, remote)
                            n += 1
                print(f"     ✓ {n} arquivos")
        except Exception as e:  # noqa: BLE001
            print(f"     ✗ {type(e).__name__}: {e}")
            rc = 1
    return rc


def mkdirs(ssh, path):
    ssh.exec_command(f"mkdir -p '{path}'")[1].channel.recv_exit_status()


def remote_write(ssh, path, text):
    remote_put_bytes(ssh, path, text.encode("utf-8"))


def cmd_push(types):
    sync_nested(fix=True)  # obrigatório: conserta cópia embutida ANTES de propagar,
                            # senão o push espalha a versão desatualizada pra todo lugar
    tg = load_targets()
    print(f"── propagando: {', '.join(types)}")
    print("── LOCAL extra")
    push_local(types, tg.get("local", []))
    print("── REMOTO")
    return push_remote(types, tg.get("remote", []))


# ─────────────────────────── add ───────────────────────────
def cmd_add(kind, source):
    if kind not in ARTIFACTS:
        print(f"✗ tipo inválido pra add: {kind} (use {', '.join(ARTIFACTS)})")
        return 1
    dest_root = LOCAL / ARTIFACTS[kind][0]
    dest_root.mkdir(parents=True, exist_ok=True)

    if source.startswith("http") or source.startswith("git@"):
        tmp = tempfile.mkdtemp(prefix="install-everywhere-")
        print(f"── clonando {source}")
        r = subprocess.run(["git", "clone", "--depth", "1", source, f"{tmp}/repo"],
                           capture_output=True, text=True)
        if r.returncode:
            print(f"✗ clone falhou: {r.stderr.strip().splitlines()[-1:]}")
            return 1
        src = Path(tmp) / "repo"
    else:
        src = Path(os.path.expanduser(source)).resolve()
        if not src.is_dir():
            print(f"✗ origem não é pasta: {src}")
            return 1

    target = dest_root / src.name
    if target.exists():
        shutil.rmtree(target)
    shutil.copytree(src, target, ignore=shutil.ignore_patterns(*SKIP))
    print(f"── instalado em {target} ({count(target)} arquivos)")
    return cmd_push(list(ARTIFACTS) + ["mcp"])


# ─────────────────────────── main ───────────────────────────
def main(argv):
    if not argv or argv[0] in ("-h", "--help", "help"):
        print(__doc__)
        return 0
    cmd, rest = argv[0], argv[1:]
    all_types = list(ARTIFACTS) + ["mcp"]

    if cmd == "add":
        if len(rest) < 2:
            print("uso: install-everywhere add <tipo> <origem>")
            return 1
        return cmd_add(rest[0], rest[1])

    if cmd == "sync-nested":
        return sync_nested(fix=("--fix" in rest))

    types = rest or all_types
    bad = [t for t in types if t not in all_types]
    if bad:
        print(f"✗ tipo desconhecido: {', '.join(bad)} (use {', '.join(all_types)})")
        return 1

    if cmd == "check":
        return cmd_check(types)
    if cmd == "push":
        return cmd_push(types)
    print(f"✗ comando desconhecido: {cmd}")
    print(__doc__)
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
