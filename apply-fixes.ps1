# Script PowerShell para aplicar correções no admin.html

$ErrorActionPreference = "Stop"

Write-Host "=== Aplicando Correções no admin.html ===" -ForegroundColor Cyan

# Lê o arquivo
$filePath = "admin.html"
$content = Get-Content $filePath -Raw -Encoding UTF8

Write-Host "[1/3] Corrigindo WebSocket..." -ForegroundColor Yellow

# Corrige JSON.parse sem try-catch
$oldWS = 'ws.onmessage = function(event) {
                const data = JSON.parse(event.data);'

$newWS = 'ws.onmessage = function(event) {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    console.warn(''[WS] Mensagem não-JSON:'', event.data);
                    return;
                }'

$content = $content.Replace($oldWS, $newWS)

Write-Host "[2/3] Adicionando script fix-ws-json-error.js..." -ForegroundColor Yellow

# Adiciona referência ao script de correção
$oldScript = '<script src="customizations.js"></script>'
$newScript = '<script src="customizations.js"></script>
    <script src="fix-ws-json-error.js"></script>'

$content = $content.Replace($oldScript, $newScript)

Write-Host "[3/3] Corrigindo botão Mesas & QR Codes..." -ForegroundColor Yellow

# Corrige botão para abrir em nova aba
$oldButton = 'onclick="window.location.href=''qr-management.html''">Mesas & QR Codes</div>'
$newButton = 'onclick="window.open(''qr-management.html'',''_blank'')">Mesas & QR Codes</div>'

$content = $content.Replace($oldButton, $newButton)

# Salva arquivo corrigido
$outputFile = "admin-fixed.html"
$content | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "`n=== Correções Aplicadas com Sucesso! ===" -ForegroundColor Green
Write-Host "Arquivo salvo como: $outputFile" -ForegroundColor Green
Write-Host "`nSubstitua o admin.html atual pelo admin-fixed.html" -ForegroundColor Yellow
