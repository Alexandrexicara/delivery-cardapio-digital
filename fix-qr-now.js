const fs = require('fs');

let content = fs.readFileSync('qr-management.html', 'utf8');

// Encontra e substitui a seção exata
const search = `if (!adminAccess || !establishmentData) {
                // Redirect to login page if no proper authentication
                console.log('[DEBUG] Redirecionando para login.html');
                window.location.href = 'login.html';
                return;
            }`;

const replace = `// Aceita admin OU creator (isAuthenticated)
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

content = content.replace(search, replace);
fs.writeFileSync('qr-management.html', content, 'utf8');

console.log('✅ Correção aplicada no qr-management.html!');
