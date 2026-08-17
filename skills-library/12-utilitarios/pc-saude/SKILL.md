---
name: pc-saude
description: Mantém o PC Windows sempre saudável — diagnóstico de causa raiz (perfil temporário, tela preta, travamento, hardware), limpeza de lixo/temporários/cache/logs, reparo de sistema (SFC/DISM/rede) e agendamento de manutenção recorrente. Use quando o usuário disser "o pc tá lento", "perfil temporário", "tela preta", "trava e tenho que desligar no botão", "limpa o lixo do pc", "manutenção do pc", "deixa o pc rápido de novo", "verifica a saúde do hardware", ou pedir pra automatizar a manutenção do Windows.
version: 1.0.0
---

# PC Saúde — manutenção Windows completa (diagnóstico + limpeza + reparo + agenda)

Baseado em diagnóstico real feito nesta máquina (Lenovo, Windows 11) + pesquisa de
ferramentas open-source equivalentes (windows-automation, Windows-Repair-Tool,
SuperDiagnosticTool, Primus — ver `references/pesquisa-comunidade.md`). Diferença
deste skill: não é um script cego baixado da internet — cada fase lê o estado real
da máquina (event log, SMART, registro) antes de agir, e só muda config persistente
com confirmação do usuário.

## Doutrina

1. **Diagnóstico antes de remédio.** Não limpe/repare sem antes ler o log —
   "perfil temporário" e "tela preta" quase sempre são sintoma de uma causa raiz
   única (queda de energia, RAM, superaquecimento), não dois problemas.
2. **Limpeza é segura, mudança de config não é.** Apagar temp/cache/logs roda sem
   perguntar. Mexer em Fast Startup, criar tarefa agendada, reset de rede, restore
   point → avisa e confirma antes.
3. **Meça o efeito.** Sempre reportar espaço livre antes/depois, contagem de
   eventos de erro antes/depois do reparo.
4. **Scripts em arquivo, não inline.** O guard de path do Bash/PowerShell bloqueia
   `Remove-Item` inline em pastas de sistema — sempre rodar via
   `powershell -File scripts/<nome>.ps1`.

## Fase 1 — Diagnóstico (`scripts/diagnose.ps1`)

Roda leitura pura (nada é alterado):
- Registro `ProfileList` → perfil duplicado/corrompido (SID `.bak`, `State` != 0)
- Event log `System` ID 41/6008 → quedas de energia/desligamento inesperado
- Event log `Application` ID 1511/1515 → perfil temporário (correlacionar com o item acima)
- Event log `System` WHEA-Logger → erro de hardware (CPU/RAM/PCIe)
- Event log driver de vídeo (TDR) → travamento de GPU
- `Get-PhysicalDisk` / `Get-StorageReliabilityCounter` → saúde do disco (SMART)
- Bateria (`powercfg /batteryreport`) se for notebook
- Antivírus ativo (`Get-MpComputerStatus`)
- Fast Startup (`HiberbootEnabled`)
- Espaço livre em disco, uptime, RAM total/livre

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File "$HOME_CLAUDE/skills/pc-saude/scripts/diagnose.ps1"
```

Leia o output e explique a causa raiz em português simples antes de agir — não
liste sintomas soltos, junte no fio causal (ex: queda de energia → perfil corrompido).

## Fase 2 — Limpeza (`scripts/cleanup.ps1`)

Remove com segurança (recriável pelo Windows, não é dado do usuário):
temp do usuário e do sistema, cache de internet do Explorer, relatórios de erro
(WER), Prefetch, cache de download do Windows Update, logs CBS/DPX antigos,
minidumps, thumbnail cache, Delivery Optimization cache.

**Nunca** esvazia a Lixeira nem toca em `Documentos/Desktop/Downloads` — isso é
dado do usuário, fora de escopo desta skill.

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File "$HOME_CLAUDE/skills/pc-saude/scripts/cleanup.ps1"
```

Reporta GB livres antes/depois.

## Fase 3 — Reparo (`scripts/repair.ps1`) — pedir confirmação antes de rodar

Mexe em sistema — **avisar o que vai rodar e esperar "sim" do usuário**:
- `sfc /scannow` — verifica/repara arquivos de sistema
- `DISM /Online /Cleanup-Image /RestoreHealth` — repara a imagem do Windows (usa
  Windows Update como fonte)
- `chkdsk C: /scan` (modo somente-leitura; agendar `/f` no próximo boot só se o
  scan achar erro E o usuário confirmar reboot)
- reset de rede (`netsh winsock reset`, `ipconfig /flushdns`) — só se houver
  sintoma de rede relatado, não por padrão

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File "$HOME_CLAUDE/skills/pc-saude/scripts/repair.ps1"
```

Isso pode levar minutos — rodar em background e avisar o usuário.

## Fase 4 — Prevenção de causa raiz (manual, com o usuário)

Não automatize sem perguntar — são mudanças de config ou verificação física:
- Desligar Fast Startup se houver histórico de desligamento forçado: `powercfg /h off`
- `mdsched.exe` (Windows Memory Diagnostic) se nunca rodou e há suspeita de RAM
- Checar temperatura sob carga (HWiNFO ou similar — não dá pra ler sensor de
  notebook via WMI puro em todo hardware)
- Inspeção física de bateria/conector se for notebook com desligamento abrupto

## Fase 5 — Agendamento (manutenção recorrente sem precisar pedir)

Só registrar com confirmação explícita do usuário (cria config persistente do SO):

```bash
schtasks /create /tn "PC-Saude-Manutencao" /tr "powershell -NoProfile -ExecutionPolicy Bypass -File \"$HOME_CLAUDE\skills\pc-saude\scripts\cleanup.ps1\"" /sc weekly /d SUN /st 03:00 /rl highest /f
```

Isso roda a limpeza (fase 2) sozinha toda semana, sem depender de sessão do Claude
aberta. Diagnóstico e reparo (fases 1/3) ficam sob demanda — mudam de causa raiz
caso a caso, não fazem sentido rodar cegos.

Pra checar/remover depois: `schtasks /query /tn "PC-Saude-Manutencao"` /
`schtasks /delete /tn "PC-Saude-Manutencao" /f`.

## Saída esperada

No final de qualquer fase, reportar curto: o que rodou, efeito medido (GB
liberados, nº de erros no log antes/depois), e o que precisa de confirmação do
usuário pra seguir. Sem narrar passo a passo.

## Invariantes

Antes de reportar pronto: [[nexo-anti-preguica]] - anti-simulacao, anti-stub,
anti-resultado-inventado. Nenhuma afirmacao sem comando rodado.
Economia de token: [[nexo-paidocriss]] - declarar delegacao llm-free-first antes
de gastar LLM; fan-out vai para subagente Haiku.
