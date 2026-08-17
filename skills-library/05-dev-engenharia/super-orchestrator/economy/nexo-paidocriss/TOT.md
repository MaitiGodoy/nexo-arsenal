# Tree of Thought — Decisões de Arquitetura

**Data:** 2026-08-15  
**Contexto:** Reescrita de `paidocriss` v1 → `paidocriss` v1

---

## Decisão D1 — Tamanho do Núcleo

**Candidatos:**
- A) Mega-skill embedded (v1: 2283 L) — tudo dentro da skill
  - Pró: autocontido
  - Contra: skill cara de carregar; contradição central (gasta mais do que economiza)
  
- B) **Núcleo ≤200 L + embedded enxuto ✓**
  - Pró: skill barata; separação clara; expande só o necessário
  - Contra: requer estrutura de diretórios
  
- C) Núcleo + tudo por referência externa
  - Pró: muito enxuto
  - Contra: quebra em outra máquina; zero autocontido

**Escolha:** **B**  
**Motivo:** A é o que torna a v1 cara e contraditória (§2.1 DEF1); C é frágil. B mantém robustez + leveza.

---

## Decisão D2 — Obrigatoriedade

**Candidatos:**
- A) Tudo obrigatório sempre (v1)
  - Pró: cobertura total
  - Contra: incha a sessão; camadas ausentes = culpa do modelo
  
- B) Tudo opcional
  - Pró: zero custo no caminho não escolhido
  - Contra: camadas sumir silenciosamente
  
- C) **3 camadas sempre-ativas + 4 gatilhos automáticos + resto sob demanda ✓**
  - Pró: cobertura sem inchar; gatilho automático garante execução
  - Contra: mais complexa

**Escolha:** **C**  
**Motivo:** A = DEF1 (v1 incha); B = DEF3 (ausência silenciosa). C dá garantia + opção.

---

## Decisão D3 — Evidência de Execução

**Candidatos:**
- A) Auto-relato do modelo (v1)
  - Pró: zero overhead
  - Contra: alucinação garantida; "✓ rodou" é ficção
  
- B) **Ledger em disco escrito por bash ✓**
  - Pró: verificável; zero LLM; idempotente
  - Contra: requer script
  
- C) Hook que conta token
  - Pró: mede de fato
  - Contra: ±30% heurística; nunca exato

**Escolha:** **B**  
**Motivo:** A = ficção; C = heurística. B = verdade durável.

---

**Status:** 3/3 decisões. Proximo: Fase 3 (esqueleto).
