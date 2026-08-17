#!/usr/bin/env bash
# extract-yt-transcript.sh
#
# Baixa transcrição de um vídeo do YouTube, limpa e salva como markdown
# com frontmatter padronizado para o repositório de conhecimento.
#
# Uso:
#   ./extract-yt-transcript.sh <URL> <DIR_SAIDA>
#
# Exemplo:
#   ./extract-yt-transcript.sh \
#     "https://www.youtube.com/watch?v=abc123" \
#     "clientes/kenia/conhecimento/transcricoes/"
#
# Saída:
#   - Cria <DIR_SAIDA>/yt-<videoId>-<slug>.md
#   - Imprime o path do arquivo gerado em stdout (última linha)
#   - Retorna 0 em sucesso, !=0 em falha

set -euo pipefail

URL="${1:-}"
OUTDIR="${2:-}"

if [[ -z "$URL" || -z "$OUTDIR" ]]; then
  echo "Uso: $0 <URL> <DIR_SAIDA>" >&2
  exit 2
fi

if ! command -v yt-dlp >/dev/null 2>&1; then
  echo "ERRO: yt-dlp nao encontrado. Instale com: brew install yt-dlp" >&2
  exit 3
fi

mkdir -p "$OUTDIR"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "$TMPDIR"' EXIT

# 1. Metadata
META="$(yt-dlp --print "%(id)s|||%(title)s|||%(channel)s|||%(duration)s|||%(upload_date)s" \
  --skip-download "$URL" 2>/dev/null || true)"

if [[ -z "$META" ]]; then
  echo "ERRO: nao foi possivel ler metadata do video. URL invalida ou video privado." >&2
  exit 4
fi

VIDEO_ID="$(echo "$META" | awk -F'\\|\\|\\|' '{print $1}')"
TITLE="$(echo "$META" | awk -F'\\|\\|\\|' '{print $2}')"
CHANNEL="$(echo "$META" | awk -F'\\|\\|\\|' '{print $3}')"
DURATION="$(echo "$META" | awk -F'\\|\\|\\|' '{print $4}')"
UPLOAD_DATE_RAW="$(echo "$META" | awk -F'\\|\\|\\|' '{print $5}')"

# Formata upload date YYYYMMDD -> YYYY-MM-DD
if [[ "$UPLOAD_DATE_RAW" =~ ^[0-9]{8}$ ]]; then
  UPLOAD_DATE="${UPLOAD_DATE_RAW:0:4}-${UPLOAD_DATE_RAW:4:2}-${UPLOAD_DATE_RAW:6:2}"
else
  UPLOAD_DATE=""
fi

ADDED_AT="$(date +%Y-%m-%d)"

# 2. Slug do título — minúsculo, sem acento, hífen, max 60 chars
SLUG="$(echo "$TITLE" \
  | iconv -f UTF-8 -t ASCII//TRANSLIT 2>/dev/null \
  | tr '[:upper:]' '[:lower:]' \
  | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$//g' \
  | cut -c1-60)"

if [[ -z "$SLUG" ]]; then
  SLUG="$VIDEO_ID"
fi

OUTFILE="$OUTDIR/yt-$VIDEO_ID-$SLUG.md"

# Se ja existe, nao reprocessa — apenas avisa e devolve o path
if [[ -f "$OUTFILE" ]]; then
  echo "AVISO: transcricao ja existe, nao reprocessei." >&2
  echo "$OUTFILE"
  exit 0
fi

# 3. Tenta baixar legendas — manual primeiro (melhor qualidade), depois auto
LANG_FOUND=""
SUB_FILE=""

for LANG in "pt-BR" "pt" "en"; do
  # Manual subs
  yt-dlp --write-subs --skip-download \
    --sub-lang "$LANG" --sub-format vtt \
    --output "$TMPDIR/sub.%(ext)s" \
    "$URL" >/dev/null 2>&1 || true

  if compgen -G "$TMPDIR/sub.$LANG.vtt" >/dev/null; then
    SUB_FILE="$(ls "$TMPDIR"/sub."$LANG".vtt 2>/dev/null | head -n1)"
    LANG_FOUND="$LANG"
    break
  fi

  # Auto subs como fallback
  yt-dlp --write-auto-subs --skip-download \
    --sub-lang "$LANG" --sub-format vtt \
    --output "$TMPDIR/auto.%(ext)s" \
    "$URL" >/dev/null 2>&1 || true

  if compgen -G "$TMPDIR/auto.$LANG.vtt" >/dev/null; then
    SUB_FILE="$(ls "$TMPDIR"/auto."$LANG".vtt 2>/dev/null | head -n1)"
    LANG_FOUND="$LANG"
    break
  fi
done

if [[ -z "$SUB_FILE" || ! -f "$SUB_FILE" ]]; then
  echo "ERRO: video nao tem legendas em pt-BR, pt ou en. Pede outro video ou use Whisper." >&2
  exit 5
fi

# 4. Limpa o VTT
#    - remove cabecalhos WEBVTT, Kind, Language
#    - remove linhas de timestamp (-->)
#    - remove tags HTML/cor (<c>, <00:00:00.000>)
#    - dedupe linhas consecutivas (auto-subs duplicam)
#    - junta em paragrafos por agrupamento simples
CLEAN="$TMPDIR/clean.txt"

grep -v -E "^WEBVTT|^Kind:|^Language:|^\s*$|-->" "$SUB_FILE" \
  | sed -E 's/<[^>]+>//g' \
  | awk '!seen[$0]++' \
  > "$CLEAN"

# Conta palavras pra sanity check
WORDS="$(wc -w < "$CLEAN" | tr -d ' ')"

if [[ "$WORDS" -lt 50 ]]; then
  echo "ERRO: transcricao limpa tem menos de 50 palavras ($WORDS). Provavelmente vtt corrompido." >&2
  exit 6
fi

# 5. Quebra em paragrafos — agrupa a cada ~5 linhas
PARAS="$TMPDIR/paragraphs.txt"
awk 'NR%5==0 {print $0 "\n"; next} {printf "%s ", $0}' "$CLEAN" > "$PARAS"

# 6. Escreve o markdown final com frontmatter
{
  echo "---"
  echo "source: youtube"
  echo "url: $URL"
  echo "videoId: $VIDEO_ID"
  echo "title: \"$(echo "$TITLE" | sed 's/"/\\"/g')\""
  echo "channel: \"$(echo "$CHANNEL" | sed 's/"/\\"/g')\""
  echo "durationSec: ${DURATION:-0}"
  echo "publishedAt: ${UPLOAD_DATE:-null}"
  echo "addedAt: $ADDED_AT"
  echo "language: $LANG_FOUND"
  echo "transcriptType: $([ "${SUB_FILE##*/auto*}" = "$SUB_FILE" ] && echo "manual" || echo "auto")"
  echo "wordCount: $WORDS"
  echo "tags: []  # preencher manualmente ou via skill apos leitura"
  echo "relatedTopics: []"
  echo "summary: |"
  echo "  PENDENTE: gerar resumo de 4-6 linhas apos primeira leitura."
  echo "keyQuotes: []"
  echo "---"
  echo ""
  echo "# $TITLE"
  echo ""
  echo "> Canal: **$CHANNEL** | Duração: ${DURATION}s | Idioma: $LANG_FOUND"
  echo ""
  echo "## Transcrição"
  echo ""
  cat "$PARAS"
} > "$OUTFILE"

echo "OK: transcricao salva ($WORDS palavras, idioma=$LANG_FOUND)" >&2
echo "$OUTFILE"
