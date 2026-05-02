// Patch para aplicar correções automaticamente
console.log('[PATCH] Iniciando correções...');

// 1. Corrige WebSocket no admin.html
const wsPattern = /ws\.onmessage\s*=\s*function\(event\)\s*\{\s*const data = JSON\.parse\(event\.data\);/g;
const wsReplacement = `ws.onmessage = function(event) {
    let data;
    try {
        data = JSON.parse(event.data);
    } catch (e) {
        console.warn('[WS] Mensagem não-JSON:', event.data);
        return;
    }`;

// 2. Adiciona script fix-ws-json-error.js
const scriptPattern = /(<script src="customizations\.js"><\/script>)/;
const scriptReplacement = `$1\n    <script src="fix-ws-json-error.js"></script>`;

// 3. Corrige botão Mesas & QR Codes
const buttonPattern = /onclick="window\.location\.href='qr-management\.html'">Mesas & QR Codes/g;
const buttonReplacement = `onclick="window.open('qr-management.html','_blank')">Mesas & QR Codes`;

// Aplica todas as correções
let content = document.documentElement.outerHTML;
content = content.replace(wsPattern, wsReplacement);
content = content.replace(scriptPattern, scriptReplacement);
content = content.replace(buttonPattern, buttonReplacement);

// Salva como novo arquivo
const blob = new Blob([content], {type: 'text/html'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'admin-fixed.html';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);

console.log('[PATCH] Correções aplicadas! Baixe admin-fixed.html');
