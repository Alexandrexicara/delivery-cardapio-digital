const fs = require('fs');
const path = require('path');

console.log('=== Aplicando Correção no qr-management.html ===\n');

// Lê o arquivo qr-management.html
const filePath = path.join(__dirname, 'qr-management.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('[1/1] Corrigindo verificação de autenticação para aceitar creator mode...');

// Corrige verificação de autenticação para aceitar admin OU creator
const oldAuth = `if (!adminAccess || !establishmentData) {
                // Redirect to login page if no proper authentication
                console.log('[DEBUG] Redirecionando para login.html');
                window.location.href = 'login.html';
                return;
            }`;

const newAuth = `// Aceita admin OU creator (isAuthenticated)
            let hasAuth = false;
            if (adminAccess && establishmentData) {
                hasAuth = true;
            } else if (establishmentData) {
                try {
                    const data = JSON.parse(establishmentData);
                    hasAuth = data && data.isAuthenticated;
                } catch(e) {}
            }
            
            if (!hasAuth) {
                alert('⚠️ É necessário fazer login!');
                window.location.href = 'login.html';
                return;
            }`;

content = content.replace(oldAuth, newAuth);

// Salva arquivo corrigido
const outputFile = path.join(__dirname, 'qr-management-fixed.html');
fs.writeFileSync(outputFile, content, 'utf8');

console.log('\n=== ✅ Correção Aplicada com Sucesso! ===\n');
console.log(`Arquivo salvo como: ${outputFile}`);
console.log('\n⚠️  Substitua o qr-management.html atual pelo qr-management-fixed.html\n');
