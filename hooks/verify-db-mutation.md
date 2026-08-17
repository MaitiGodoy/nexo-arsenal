# Padrão: verificar a mutação, não confiar no "deu certo"

> Lição de campo: um extrator/atualizador pode **reportar sucesso escrevendo um no-op**.
> "A chamada retornou 200" ≠ "a linha mudou". Sempre cheque o efeito real no banco.

## Regra

Depois de qualquer operação que deveria **mutar** o banco (INSERT/UPDATE/DELETE, upsert,
extração→persistência), verifique o **efeito**, não o **retorno**:

1. **Conte antes e depois** — `SELECT count(*)` (ou o campo alvo) antes e depois; a diferença tem que bater.
2. **Cheque a linha específica** — releia a linha pelo id/chave e confirme o valor novo.
3. **Teste o caminho negativo** — rode um caso que NÃO deveria escrever nada e confirme count inalterado.
4. **Idempotência** — rodar 2x não deve duplicar nem re-mutar de forma inesperada.

## Anti-padrão

```
# ERRADO: confiar no retorno
res = extractor.run()
if res.ok: print("salvo!")   # pode ter escrito no-op

# CERTO: confirmar no banco
before = db.count("leads")
extractor.run()
after = db.count("leads")
assert after > before, "extração não escreveu nada"
```

## Aplicação NEXO

- Prospector: telefone `not-null` obrigatório; dedup por raiz de CNPJ — ver skill `lead-data-validator`.
- Qualquer skill que persiste (`database-postgres-tool`, importadores) segue este padrão no aceite.
