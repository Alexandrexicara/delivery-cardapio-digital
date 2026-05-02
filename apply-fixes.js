const fs = require('fs');
const path = require('path');

console.log('=== Aplicando Correções no admin.html ===\n');

// Lê o arquivo admin.html
const filePath = path.join(__dirname, 'admin.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('[1/3] Corrigindo WebSocket...');

// Corrige JSON.parse sem try-catch
const oldWS = `ws.onmessage = function(event) {
                const data = JSON.parse(event.data);`;

const newWS = `ws.onmessage = function(event) {
                let data;
                try {
                    data = JSON.parse(event.data);
                } catch (e) {
                    console.warn('[WS] Mensagem não-JSON:', event.data);
                    return;
                }`;

content = content.replace(oldWS, newWS);

console.log('[2/3] Adicionando script fix-ws-json-error.js...');

// Adiciona referência ao script de correção
const oldScript = '<script src="customizations.js"></script>';
const newScript = `<script src="customizations.js"></script>
    <script src="fix-ws-json-error.js"></script>`;

content = content.replace(oldScript, newScript);

console.log('[3/3] Corrigindo botão Mesas & QR Codes...');

// Corrige botão para abrir em nova aba
const oldButton = `onclick="window.location.href='qr-management.html'">Mesas & QR Codes</div>`;
const newButton = `onclick="window.open('qr-management.html','_blank')">Mesas & QR Codes</div>`;

content = content.replace(oldButton, newButton);

// Salva arquivo corrigido
const outputFile = path.join(__dirname, 'admin-fixed.html');
fs.writeFileSync(outputFile, content, 'utf8');

console.log('\n=== ✅ Correções Aplicadas com Sucesso! ===\n');
console.log(`Arquivo salvo como: ${outputFile}`);
console.log('\n⚠️  Substitua o admin.html atual pelo admin-fixed.html\n');
