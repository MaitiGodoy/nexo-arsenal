# Pesquisa de ferramentas open-source equivalentes (fonte: GitHub Copilot, colado pelo usuário 2026-08-10)

| Ferramenta | O que faz | Coberto no pc-saude? |
|---|---|---|
| [MCCMDave/windows-automation](https://github.com/MCCMDave/windows-automation) | Update manager (Windows Update/Winget/Choco), planeja cleanup/backup/rede/perf/registro | Cleanup sim (fase 2); update manager fora de escopo (risco de quebrar app) |
| [Windows-Repair-Tool](https://github.com/Mohabdo21/Windows-Repair-Tool) | Diagnóstico, SFC, DISM, restore, checagem de FS via CLI | Sim — fase 3 (`repair.ps1`) |
| [SuperDiagnosticTool](https://github.com/Guettaf-hossam/SuperDiagnosticTool) | Diagnóstico com IA, scan de malware, reparo de driver | Diagnóstico sim (fase 1); scan de malware fica pro antivírus já instalado |
| [Primus](https://github.com/R4in84/Primus) | Cleanup profundo, backup de registro, reset de rede, SFC/DISM com log | Sim — fases 2/3, mas sem backup de registro (não avaliado como necessário aqui) |
| Windows Maintenance Framework | Framework modular preventivo | Estrutura similar (fases separadas, doutrina "medir antes/depois") |
| PowerShell Gallery (`PSWindowsUpdate` etc) | Módulos individuais da comunidade | Não usado — preferi script próprio, auditável, sem dependência externa |
| [Win11Debloat](https://github.com/ChrisTitusTech/winutil) | Remove bloatware, desativa telemetria | Fora de escopo — usuário não pediu debloat/privacidade |
| Script de Code Review (SFC/DISM/CHKDSK) | Health check automatizado | Sim — mesma base, fase 3 |

## Por que não usar um desses prontos

Regra `github-tool-vetting`: script de terceiro rodando com privilégio de sistema
precisa de vetting antes de instalar globalmente. Nenhum dos itens acima tem
histórico de uso conhecido nesta máquina. Preferi escrever `pc-saude` fino e
auditável, cobrindo só o que o diagnóstico real desta máquina mostrou que
importa (queda de energia → perfil temporário; disco cheio de temp/log) —
mais seguro que importar um framework genérico de terceiro com escopo maior
do que o problema real.

## O que ficou de fora de propósito

- Update manager (Winget/Choco automation) — mudar versão de app sem pedir é
  risco de quebrar algo; usuário deve rodar Windows Update manualmente.
- Debloat/telemetria — não foi pedido, é mudança de privacidade/produto, não
  manutenção de saúde do PC.
- Backup de registro automático — usar Restore Point nativo do Windows é
  suficiente e já embutido no SO.
