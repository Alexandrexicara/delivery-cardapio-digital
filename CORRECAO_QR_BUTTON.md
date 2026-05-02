# Correção Pendente - Botão Mesas & QR Codes

## Problema
Quando o admin clica em "Mesas & QR Codes" no dashboard, o sistema redireciona para login.html e depois volta para admin.html, criando um loop.

## Causa
O arquivo `qr-management.html` verifica se há `adminAccess` no localStorage, mas não aceita o modo creator (`establishmentData.isAuthenticated`).

## Solução Implementada
Foi modificado o botão para abrir em nova aba usando `window.open('qr-management.html', '_blank')` ao invés de `window.location.href`.

## Próximos Passos
É necessário modificar o qr-management.html para aceitar ambos os tipos de autenticação:
1. Admin mode: `localStorage.getItem('adminAccess') === 'true'`
2. Creator mode: `JSON.parse(localStorage.getItem('establishmentData')).isAuthenticated === true`

## Código Sugerido para qr-management.html (linha ~947)

```javascript
// Substituir:
if (!adminAccess || !establishmentData) {
    window.location.href = 'login.html';
    return;
}

// Por:
let hasAuth = false;
if (establishmentData) {
    try {
        const ed = JSON.parse(establishmentData);
        hasAuth = (ed && ed.isAuthenticated) || !!adminAccess;
    } catch(e) { hasAuth = !!adminAccess; }
}

if (!hasAuth) {
    alert('Acesso requer login!');
    window.location.href = 'login.html';
    return;
}
```
