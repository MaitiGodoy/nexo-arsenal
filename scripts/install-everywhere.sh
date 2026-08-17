#!/usr/bin/env bash
# install-everywhere — wrapper fino sobre install-everywhere.py
#
#   install-everywhere check                  inventário local x remoto
#   install-everywhere push [tipo ...]        propaga (default: tudo)
#   install-everywhere add <tipo> <origem>    instala em ~/.claude + propaga
#
# tipos: skills plugins hooks commands agents mcp
#
# A versão antiga só propagava PLUGINS via rsync/scp — rsync não existe nesta
# máquina. Agora: paramiko com a chave ~/.ssh/hostinger_vps.pem (confirmado
# funcionando, $VPS_PASSWORD é só fallback), transferência via exec_command+
# base64 (o SFTP subsystem é rejeitado por esta VPS), e propaga os 6 tipos.
exec python "$HOME/.claude/scripts/install-everywhere.py" "$@"
