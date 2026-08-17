---
description: Auditoria profunda via TDD atômico (skill prumo) rodada no ciclo NEXOFLOW, sem deploy
argument-hint: [caminho do repo ou fase específica — vazio = repo atual, tudo]
---

Rode a auditoria profunda usando a skill `prumo` dentro do ciclo NEXOFLOW.

**Sempre com `--no-deploy`.** O prumo mede a parede, não entrega a obra: ele para no
relatório. Commit e push são decisão do usuário, tomada depois de ler o resultado.

Execute:
```
bash ~/.claude/scripts/nexoflow.sh --no-deploy "aplicar a skill prumo (~/.claude/skills/prumo/SKILL.md) neste repo. $ARGUMENTS"
```

Antes de disparar, verifique e reporte se algo bloquear:
- `git status --porcelain` limpo? Sujo → PARE, peça pro usuário commitar ou descartar.
- Proxy :3200 no ar? Off → `deepseek-proxy/start.bat`.

Enquanto roda, o estado vive em dois lugares:
- `.nexoflow/` — `PLAN.md` (Opus), `PROGRESS.md` (DeepSeek), `REVIEW.md` (veredito)
- `.prumo/` — `BASELINE.md`, `ALVOS.md`, `MUTACAO.md`, `LIMITACOES.md`, `RELATORIO.md`

Ao terminar, reporte ao usuário nesta ordem:
1. **O placar** — testes/cobertura/lint/segredos, antes → depois (de `.prumo/RELATORIO.md`)
2. **Bugs reais encontrados** — com arquivo:linha e o input que quebrava
3. **Achado de segurança que exige ação humana** — sobretudo chave no histórico do git,
   que precisa ser **rotacionada** (tirar do arquivo não desfaz o vazamento)
4. **Circuit breakers** — alvos que não convergiram em 5 iterações
5. **Estado** — confirme que nada foi commitado nem deployado

Se `.prumo/MUTACAO.md` tiver qualquer "N" (teste sobreviveu à mutação), **não relate
sucesso**: aquele teste é tautológico e o alvo continua sem cobertura real. Diga qual.

Escopo (passe em `$ARGUMENTS` se o usuário pedir):
- `só a fase 7 (segurança)` — pula o loop TDD, roda só a varredura
- `só o core` — restringe aos alvos de regra de negócio
- `--max 3` — limita iterações do ciclo (repasse pro nexoflow.sh)
