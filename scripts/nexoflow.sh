#!/usr/bin/env bash
# OBSOLETO — o nexoflow foi absorvido pela skill tardis (2026-08-14).
# Este shim existe só pra não quebrar alias/cron antigos. Use /tardis.
echo "aviso: nexoflow.sh foi absorvido pelo tardis. Redirecionando para motor/tardis.sh." >&2
exec bash "$HOME/.claude/skills/tardis/motor/tardis.sh" "$@"
