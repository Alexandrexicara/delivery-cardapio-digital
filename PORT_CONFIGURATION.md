# Configuração de Portas do Servidor

## Visão Geral

Devido a conflitos com outras aplicações que já estavam usando a porta 3000, o servidor foi configurado para rodar na porta 3001.

## Configuração Atual

- **Servidor HTTP**: http://localhost:3001
- **Servidor WebSocket**: ws://localhost:3001 (mesma porta do HTTP, usando upgrade de conexão)

## Arquivos Modificados

1. **admin.html**: Atualizado para conectar ao WebSocket na porta 3001
2. **port3001-server.js**: Novo arquivo de servidor configurado para porta 3001

## Como Iniciar o Servidor

Para iniciar o servidor, execute:

```bash
node port3001-server.js
```

## Acesso ao Sistema

Após iniciar o servidor, acesse:

- **Página principal**: http://localhost:3001
- **Painel administrativo**: http://localhost:3001/admin.html
- **Painel do usuário**: http://localhost:3001/usuario.html

## Funcionalidade de Pedidos Combinados

A funcionalidade de "Pedidos Combinados" agora está funcionando corretamente:

1. Todos os pedidos são exibidos em um único container
2. Os valores são calculados automaticamente em tempo real
3. É possível processar todos os pagamentos pendentes de uma vez
4. O resumo financeiro é atualizado conforme os pedidos são modificados

## Solução de Problemas

Se encontrar problemas ao iniciar o servidor:

1. Verifique se nenhuma outra aplicação está usando a porta 3001:
   ```bash
   netstat -ano | findstr :3001
   ```

2. Se necessário, altere a porta no arquivo `port3001-server.js`:
   ```javascript
   server.listen(3002, '127.0.0.1', () => {
     console.log('Server running on http://localhost:3002');
   });
   ```

3. Atualize também o arquivo `admin.html` para usar a nova porta:
   ```javascript
   const ws = new WebSocket('ws://localhost:3002');
   ```