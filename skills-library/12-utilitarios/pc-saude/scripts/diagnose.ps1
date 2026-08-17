# pc-saude / diagnose.ps1 — leitura pura, nao altera nada
Write-Output "=== PERFIL (ProfileList) ==="
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList\*" -ErrorAction SilentlyContinue |
  Select-Object PSChildName, ProfileImagePath, State | Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== DESLIGAMENTOS INESPERADOS (ultimos 30) ==="
Get-WinEvent -FilterHashtable @{LogName='System'; Id=41,6008} -MaxEvents 30 -ErrorAction SilentlyContinue |
  Select-Object TimeCreated, Id | Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== PERFIL TEMPORARIO (ultimos 30) ==="
Get-WinEvent -LogName Application -MaxEvents 5000 -ErrorAction SilentlyContinue |
  Where-Object { $_.Id -in 1511,1515,1518 } | Select-Object -First 30 TimeCreated, Id |
  Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== ERROS DE HARDWARE (WHEA) ==="
Get-WinEvent -LogName System -MaxEvents 5000 -ErrorAction SilentlyContinue |
  Where-Object { $_.ProviderName -match 'WHEA' } | Select-Object -First 20 TimeCreated, Id, LevelDisplayName |
  Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== DISCO (saude) ==="
Get-PhysicalDisk -ErrorAction SilentlyContinue | Select-Object DeviceId, FriendlyName, MediaType, HealthStatus, OperationalStatus |
  Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== ESPACO EM DISCO ==="
Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" |
  Select-Object DeviceID, @{n='FreeGB';e={[math]::Round($_.FreeSpace/1GB,1)}}, @{n='SizeGB';e={[math]::Round($_.Size/1GB,1)}} |
  Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== MEMORIA E UPTIME ==="
$os = Get-CimInstance Win32_OperatingSystem
"RAM total: {0} GB | RAM livre: {1} GB | Ultimo boot: {2}" -f `
  [math]::Round($os.TotalVisibleMemorySize/1MB,1), [math]::Round($os.FreePhysicalMemory/1MB,1), $os.LastBootUpTime |
  Write-Output

Write-Output "=== FAST STARTUP ==="
$hb = Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Power" -Name HiberbootEnabled -ErrorAction SilentlyContinue
if ($hb) { "HiberbootEnabled = {0} (1=ligado, agrava corrupcao de perfil em desligamento forcado)" -f $hb.HiberbootEnabled | Write-Output }

Write-Output "=== ANTIVIRUS ==="
Get-MpComputerStatus -ErrorAction SilentlyContinue | Select-Object AntivirusEnabled, RealTimeProtectionEnabled |
  Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== BATERIA (se notebook) ==="
Get-CimInstance Win32_Battery -ErrorAction SilentlyContinue | Select-Object Name, EstimatedChargeRemaining, BatteryStatus |
  Format-Table -AutoSize | Out-String | Write-Output

Write-Output "=== MEMORY DIAGNOSTIC (historico) ==="
$mdiag = Get-WinEvent -LogName Application -MaxEvents 5000 -ErrorAction SilentlyContinue | Where-Object { $_.ProviderName -match 'MemoryDiagnostics' }
if ($mdiag) { $mdiag | Select-Object -First 5 TimeCreated, Message | Format-Table -Wrap -AutoSize | Out-String | Write-Output }
else { "Nunca rodou o Windows Memory Diagnostic (mdsched.exe) nesta maquina." | Write-Output }
