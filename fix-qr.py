with open('qr-management.html', 'r', encoding='utf8') as f:
    content = f.read()

old = """            if (!adminAccess || !establishmentData) {
                // Redirect to login page if no proper authentication
                console.log('[DEBUG] Redirecionando para login.html');
                window.location.href = 'login.html';
                return;
            }"""

new = """            // Aceita admin OU creator (isAuthenticated)
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
            }"""

content = content.replace(old, new)

with open('qr-management.html', 'w', encoding='utf8') as f:
    f.write(content)

print('✅ Correção aplicada com Python!')
