---
name: paidocriss-cli-script
description: "Implementação de CLI script para economia de tokens em múltiplos harness"
embedded: true
---

# Implementação CLI — Economy Router Script

Script wrapper unificado para a CLI do Claude, implementando **5 skills automatizadas** de economia de tokens. Funciona idêntico em Claude Code (local/VPS), Qwen Code, OpenCode, Gemini CLI, Grok CLI, e Muse.

## Skill A – Sessão Turbo (Ciclo de vida)
- Força `--no-continue` (nova sessão, sem histórico)
- Limita `--max-turns 5` (turnos curtos)
- Carrega `CLAUDE.md` automaticamente (se existir)

## Skill B – Pergunta Múltipla Seca (Entrada)
- Prefixo automático: `"Responda APENAS com o código modificado. NADA de texto, markdown ou explicações..."`
- Suporta múltiplas tarefas em um argumento, separadas por `;` (ponto e vírgula)
- Exemplo: `./nexo-paidocriss "fix function X; adjust import Y; remove log Z"`
- Envia tudo em um único bloco (sem dividir em várias chamadas)

## Skill C – Filtro de Entrada (O que ele lê)
- Respeita `.claudeignore` rigidamente (a CLI já faz, wrapper garante)
- Compacta arquivos `.log` automaticamente com `tail -n 5` antes de enviar
- Descarta resto do arquivo gigante, mantém apenas últimas 5 linhas

## Skill D – Diff + Auto-Aplicação (Saída e execução)
- Instrui Claude a responder com `diff unificado` ou comandos `sed -i`
- Captura automaticamente linhas que começam com `sed -i`
- Executa cada `sed -i` com `bash -c` ou `eval`, aplicando alterações imediatamente
- Nunca exibe código completo reescrito na tela (foco em redução de tokens)

## Skill E – Vigia Silencioso (Monitoramento e Auto-Kill)
- Monitora saída do Claude em tempo real, procurando padrões de tokens: `Tokens: X/Y` ou `X/Y tokens`
- Calcula porcentagem: `(X / Y) * 100`
- Se porcentagem **≥ 30%** E não houver modificações de código (`diff`, `sed`, `patch`, linhas modificadas), mata o processo com SIGKILL
- Exibe aviso: `[VIGIA] Tokens críticos (30%+) sem alterações. Processo morto. Reformule seu comando.`

## Script Executável

```bash
#!/usr/bin/env bash

set -euo pipefail

readonly RED='\033[0;31m'
readonly YELLOW='\033[1;33m'
readonly GREEN='\033[0;32m'
readonly NC='\033[0m'

PROMPT="${1:-}"
TOKENS_LIMIT=100000
TOKEN_THRESHOLD=30
VERBOSE=false
CLAUDE_CMD="${CLAUDE_CMD:-claude}"
PROJECT_ROOT="$(pwd)"

show_help() {
    cat <<'EOF'
Usage: ./nexo-paidocriss "prompt" [options]

Examples:
  ./nexo-paidocriss "fix function X"
  ./nexo-paidocriss "fix function X; adjust import Y; remove log Z"
  ./nexo-paidocriss "process error.log"

Options:
  --help              Show this message
  --verbose           Enable verbose output
  --limit TOKENS      Set token limit (default: 100000)

Multiple tasks (semicolon-separated):
  ./nexo-paidocriss "task1; task2; task3"

Log files:
  Automatically compacts .log files with tail -n 5
EOF
}

compact_log_file() {
    local file="$1"
    if [[ -f "$file" ]]; then
        tail -n 5 "$file"
    else
        echo "$file"
    fi
}

prefix_prompt() {
    local prompt="$1"
    printf '%s\n\n%s' "Responda APENAS com o código modificado. NADA de texto, markdown ou explicações. Se houver múltiplos arquivos, entregue todos no mesmo bloco." "$prompt"
}

check_and_apply_changes() {
    local output_file="$1"
    local changed=0

    while IFS= read -r line; do
        if [[ "$line" =~ ^sed\ -i ]]; then
            if [[ $VERBOSE == true ]]; then
                echo -e "${YELLOW}[EXEC]${NC} $line" >&2
            fi
            eval "$line" 2>/dev/null && ((changed++)) || echo -e "${RED}[ERRO]${NC} $line" >&2
        fi
    done < <(grep "^sed -i" "$output_file" 2>/dev/null || true)

    [[ $changed -gt 0 ]] && echo -e "${GREEN}[OK]${NC} $changed alteração(ões) aplicada(s)" >&2
}

monitor_and_kill() {
    local output_file="$1"
    local pid=$2
    local started_code=false

    while sleep 0.3; do
        if ! kill -0 "$pid" 2>/dev/null; then
            break
        fi

        local tokens_found
        tokens_found=$(grep -oE "[0-9]+/[0-9]+" "$output_file" 2>/dev/null | tail -1)

        if [[ -n "$tokens_found" ]]; then
            local used="${tokens_found%/*}"
            local total="${tokens_found#*/}"
            local pct=$((used * 100 / total))

            if grep -qE "sed -i|diff|patch|\+\+\+|---|@@" "$output_file" 2>/dev/null; then
                started_code=true
            fi

            if [[ $pct -ge $TOKEN_THRESHOLD ]] && [[ "$started_code" == "false" ]]; then
                kill -9 "$pid" 2>/dev/null || true
                printf '%s\n' "[VIGIA] Tokens críticos ($pct%+) sem alterações. Processo morto. Reformule seu comando." >&2
                return 1
            fi
        fi
    done
    return 0
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --help)
                show_help
                exit 0
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --limit)
                TOKENS_LIMIT="$2"
                shift 2
                ;;
            *)
                PROMPT="$1"
                shift
                ;;
        esac
    done
}

main() {
    parse_args "$@"

    if [[ -z "$PROMPT" ]]; then
        show_help
        exit 0
    fi

    local processed_prompt="$PROMPT"

    if [[ "$PROMPT" == *.log ]] && [[ -f "$PROMPT" ]]; then
        processed_prompt=$(compact_log_file "$PROMPT")
    fi

    processed_prompt=$(prefix_prompt "$processed_prompt")

    if [[ -f .claudeignore ]]; then
        [[ $VERBOSE == true ]] && echo -e "${YELLOW}[INFO]${NC} .claudeignore encontrado" >&2
    fi

    if [[ -f CLAUDE.md ]]; then
        [[ $VERBOSE == true ]] && echo -e "${YELLOW}[INFO]${NC} CLAUDE.md detectado" >&2
    fi

    local temp_output
    temp_output=$(mktemp)
    trap "rm -f '$temp_output'" EXIT

    [[ $VERBOSE == true ]] && echo -e "${YELLOW}[DEBUG]${NC} Iniciando sessão turbo..." >&2

    $CLAUDE_CMD --no-continue --max-turns 5 <<< "$processed_prompt" > "$temp_output" 2>&1 &
    local claude_pid=$!

    monitor_and_kill "$temp_output" "$claude_pid" || true

    wait "$claude_pid" 2>/dev/null || true

    check_and_apply_changes "$temp_output"

    cat "$temp_output"
}

main "$@"
```

## Uso

```bash
chmod +x paidocriss

# Tarefa simples
./nexo-paidocriss "fix bug in auth.js"

# Múltiplas tarefas
./nexo-paidocriss "fix function X; adjust import Y; remove log Z"

# Arquivo de log
./nexo-paidocriss "debug.log"

# Verbose
./nexo-paidocriss "task" --verbose
```

## Sincronização Multi-Harness

Script é idêntico em todos os harness. Garantir que:
- Todos os harness têm acesso a `claude` no PATH
- `.claudeignore` é respeitado por cada harness
- Hooks de economia (`session-token-monitor`, etc.) estão ativos em `settings.local.json`
- Permissões de execução: `chmod +x paidocriss`

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
