# Correções Pendentes - Admin.html

## 1. Erro WebSocket - JSON.parse

### Problema
```
VM122:1 Uncaught SyntaxError: Unexpected token 'c', "connected" is not valid JSON
    at JSON.parse (<anonymous>)
    at ws.onmessage (admin.html:1727:35)
```

### Causa
O código está tentando fazer `JSON.parse(event.data)` sem tratamento de erro, e o servidor pode estar enviando mensagens que não são JSON válido (como a string "connected").

### Solução

**No arquivo `admin.html` (linha ~1724), substituir:**

```javascript
ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'adminLoginSuccess') {
        // ...
    }
};
```

**Por:**

```javascript
ws.onmessage = function(event) {
    let data;
    try {
        data = JSON.parse(event.data);
    } catch (e) {
        console.warn('[WS] Mensagem não-JSON recebida:', event.data);
        return;
    }
    
    if (data && data.type === 'adminLoginSuccess') {
        // ...
    }
};
```

### Arquivo de Correção Criado
Foi criado o arquivo `fix-ws-json-error.js` que deve ser incluído no admin.html após o customizations.js:

```html
<script src="customizations.js"></script>
<script src="fix-ws-json-error.js"></script>
```

## 2. Botão "Mesas & QR Codes"

### Problema
Quando clica em "Mesas & QR Codes", redireciona para login e volta para admin.

### Solução
Modificar o botão para abrir em nova aba:

```javascript
// No admin.html, modificar o onclick do botão:
window.open('qr-management.html', '_blank');
```

E modificar o qr-management.html para aceitar ambos os modos de autenticação (admin e creator).

## Como Aplicar as Correções

### Método 1: Manual
1. Editar admin.html linha 1724 e adicionar try-catch no JSON.parse
2. Editar admin.html para incluir fix-ws-json-error.js
3. Editar botão "Mesas & QR Codes" para usar window.open
4. Editar qr-management.html para aceitar creator mode

### Método 2: Automático
O script `fix-ws-json-error.js` tenta aplicar a correção automaticamente via JavaScript.

## Status
- [x] Criado script de correção (fix-ws-json-error.js)
- [ ] Incluir script no admin.html
- [ ] Corrigir botão Mesas & QR Codes
- [ ] Corrigir qr-management.html para creator mode
