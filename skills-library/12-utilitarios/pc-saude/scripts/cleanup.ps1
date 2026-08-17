# pc-saude / cleanup.ps1 — remove apenas lixo recriavel pelo Windows, nunca dado do usuario
$before = (Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace
Write-Output ("ANTES_GB={0}" -f [math]::Round($before/1GB,2))

$targets = @(
  "$env:TEMP",
  "C:\Windows\Temp",
  "$env:LOCALAPPDATA\Microsoft\Windows\INetCache",
  "$env:LOCALAPPDATA\Microsoft\Windows\WER",
  "C:\Windows\Prefetch",
  "C:\Windows\SoftwareDistribution\Download",
  "C:\Windows\Logs\CBS",
  "C:\Windows\Logs\DPX",
  "C:\Windows\Minidump",
  "$env:LOCALAPPDATA\Microsoft\Windows\DeliveryOptimization\Cache"
)

foreach ($t in $targets) {
  if (Test-Path $t) {
    Get-ChildItem -Path $t -Force -ErrorAction SilentlyContinue | ForEach-Object {
      try { $_ | Remove-Item -Recurse -Force -ErrorAction Stop }
      catch { }
    }
  }
}

Get-ChildItem "$env:LOCALAPPDATA\Microsoft\Windows\Explorer" -Filter "thumbcache_*.db" -Force -ErrorAction SilentlyContinue | ForEach-Object {
  try { $_ | Remove-Item -Force -ErrorAction Stop } catch { }
}

$after = (Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'").FreeSpace
Write-Output ("DEPOIS_GB={0}" -f [math]::Round($after/1GB,2))
Write-Output ("LIBERADO_GB={0}" -f [math]::Round(($after-$before)/1GB,2))
