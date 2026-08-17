# pc-saude / repair.ps1 — muda sistema, so rodar com confirmacao previa do usuario
Write-Output "=== SFC /scannow ==="
sfc /scannow

Write-Output "=== DISM RestoreHealth ==="
DISM /Online /Cleanup-Image /RestoreHealth

Write-Output "=== CHKDSK (somente leitura) ==="
chkdsk C: /scan
