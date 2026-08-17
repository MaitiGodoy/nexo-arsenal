#!/usr/bin/env bash
# montar-sala.sh — scaffold de uma Sala de Operações MktOps a partir da CAMADA CANON.
# Uso: ./montar-sala.sh <slug-cliente> "<Nome do Cliente>" [destino]
# Ex:  ./montar-sala.sh acme "ACME Indústria"
#
# Faz APENAS a parte mecânica: copia canon intacto + esqueleto cliente + preenche placeholders óbvios.
# A skill nova-sala roda isto e DEPOIS orquestra as skills pra preencher brand-context/pesquisa/spy/design.

set -euo pipefail

SLUG="${1:?uso: montar-sala.sh <slug> \"<Nome>\" [destino]}"
NOME="${2:?informe o Nome do Cliente entre aspas}"
ROOT="$HOME/Studio Artemis"
CANON="$ROOT/_sala-canon"
DEST="${3:-$ROOT/clientes/$SLUG}"
VERSAO="$(cat "$CANON/VERSION")"
DATA="$(date +%Y-%m-%d)"

if [ -e "$DEST" ]; then
  echo "ERRO: $DEST já existe. Apague ou escolha outro destino." >&2
  exit 1
fi

echo "→ Montando Sala '$NOME' ($SLUG) | canon $VERSAO | destino: $DEST"
mkdir -p "$DEST"

# 1) CAMADA CANON — copiada intacta
cp -R "$CANON/canon/.claude"                       "$DEST/.claude"
cp -R "$CANON/canon/cerebro-de-copy"               "$DEST/cerebro-de-copy"
cp -R "$CANON/canon/automacao"                     "$DEST/automacao"
cp    "$CANON/canon/playbook-narrativas-mktops.md" "$DEST/playbook-narrativas-mktops.md"
cp    "$CANON/canon/copy-routing.md"               "$DEST/copy-routing.md"
mkdir -p "$DEST/design-system/_base"
cp    "$CANON/canon/design-system/_base/brand-book-v2.md" "$DEST/design-system/_base/brand-book-v2.md"
chmod +x "$DEST/.claude/hooks/"*.sh 2>/dev/null || true

# 2) CAMADA CLIENTE — esqueleto a preencher
cp    "$CANON/template-cliente/brand-context.md"   "$DEST/brand-context.md"
cp    "$CANON/template-cliente/README.md"          "$DEST/README.md"
cp -R "$CANON/template-cliente/pesquisa-mercado"   "$DEST/pesquisa-mercado"
cp -R "$CANON/template-cliente/spy"                "$DEST/spy"
cp    "$CANON/template-cliente/design-system/design-system.md" "$DEST/design-system/design-system.md"
mkdir -p "$DEST/conteudo" "$DEST/entregas" "$DEST/design-system/logo"

# 3) CLAUDE.md a partir do base canônico
cp    "$CANON/canon/CLAUDE-base.md"                "$DEST/CLAUDE.md"

# 4) Rastreabilidade
echo "$VERSAO" > "$DEST/.sala-version"

# 5) Preenche placeholders mecânicos APENAS na CAMADA CLIENTE.
#    Poda canon (.claude/, cerebro-de-copy/, design-system/_base/) — esses contêm
#    {{...}} legítimos das próprias skills e não devem ser tocados.
#    macOS sed -i precisa de sufixo; usamos '' e limpamos.
client_md() {
  find "$DEST" \
    \( -path "$DEST/.claude" -o -path "$DEST/cerebro-de-copy" -o -path "$DEST/automacao" -o -path "$DEST/design-system/_base" \) -prune \
    -o -name '*.md' -type f -print0
}
client_md | while IFS= read -r -d '' f; do
  sed -i '' \
    -e "s/{{CLIENTE}}/$NOME/g" \
    -e "s/{{CLIENTE_SLUG}}/$SLUG/g" \
    -e "s/{{VERSAO_CANON}}/$VERSAO/g" \
    -e "s/{{DATA_BUILD}}/$DATA/g" \
    "$f"
done

find "$DEST" -name '.DS_Store' -delete 2>/dev/null || true

echo "✓ Sala montada. Placeholders de conteúdo restantes (preenchidos pelas skills):"
PEND=$(client_md | xargs -0 grep -l '{{' 2>/dev/null || true)
[ -n "$PEND" ] && echo "$PEND" | sed "s|$DEST|  ·|" || echo "  (nenhuma)"