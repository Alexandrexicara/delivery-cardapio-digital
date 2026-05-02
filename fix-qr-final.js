const fs = require('fs');

let content = fs.readFileSync('qr-management.html', 'utf8');

// Substitui toda a seção de autenticação
const oldSection = `            // Check if admin has proper access
            const adminAccess = localStorage.getItem('adminAccess');
            const establishmentData = localStorage.getItem('establishmentData');
            
            console.log('[DEBUG] adminAccess:', adminAccess);
            console.log('[DEBUG] establishmentData:', establishmentData);
            
            if (!adminAccess || !establishmentData) {
                // Redirect to login page if no proper authentication
                console.log('[DEBUG] Redirecionando para login.html');
                window.location.href = 'login.html';
                return;
            }`;

const newSection = `            // Aceita admin OU creator (isAuthenticated)
            const adminAccess = localStorage.getItem('adminAccess');
            const establishmentData = localStorage.getItem('establishmentData');
            
            console.log('[DEBUG] adminAccess:', adminAccess);
            console.log('[DEBUG] establishmentData:', establishmentData);
            
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

content = content.replace(oldSection, newSection);
fs.writeFileSync('qr-management.html', content, 'utf8');

console.log('✅ Correção FINAL aplicada no qr-management.html!');
