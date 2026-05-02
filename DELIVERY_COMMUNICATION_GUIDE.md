# Guia de Comunicação entre Delivery, Usuário e Motoboy

## ✅ Sistema de Comunicação Implementado

Foi implementado um sistema robusto de comunicação entre as páginas de **Delivery**, **Motoboy** e **Servidor** usando WebSocket com fallback para localStorage.

---

## 📋 Arquitetura da Comunicação

### Componentes Principais:

1. **communication.js** - Módulo centralizado de comunicação
2. **server.js** - Servidor WebSocket aprimorado
3. **delivery.html** - Interface do cliente fazendo pedidos
4. **motoboy.html** - Interface do motoboy recebendo pedidos

---

## 🔄 Fluxo de Comunicação

### 1. Cliente faz pedido no Delivery:

```javascript
// delivery.html
DeliveryCommunication.broadcastNewOrder(order);
```

**O que acontece:**
- Pedido é enviado via WebSocket para o servidor
- Servidor armazena no localStorage
- Servidor notifica todos os motoboys conectados
- Servidor notifica admins
- Fallback usa localStorage se WebSocket falhar

### 2. Motoboy recebe o pedido:

```javascript
// motoboy.html
// Pedido chega automaticamente via WebSocket
ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type === 'newDeliveryOrder') {
        receiveRealOrder(message.order);
    }
};
```

### 3. Motoboy aceita o pedido:

```javascript
// motoboy.html
DeliveryCommunication.send({
    type: 'acceptDeliveryOrder',
    orderId: orderId,
    motoboyName: motoboyData.name,
    motoboyPhone: motoboyData.phone
});
```

**O que acontece:**
- Servidor atualiza status do pedido
- Notifica cliente que pedido foi aceito
- Envia nome e telefone do motoboy
- Atualiza localStorage

### 4. Motoboy inicia entrega:

```javascript
// motoboy.html
DeliveryCommunication.send({
    type: 'startDeliveryOrder',
    orderId: orderId,
    estimatedTime: order.estimatedTime
});
```

**O que acontece:**
- Status muda para "delivering"
- Cliente recebe notificação
- ETA (tempo estimado) é enviado
- Mapa de rastreamento é atualizado

### 5. Motoboy completa entrega:

```javascript
// motoboy.html
DeliveryCommunication.send({
    type: 'completeDeliveryOrder',
    orderId: orderId
});
```

**O que acontece:**
- Status muda para "completed"
- Cliente recebe confirmação
- Pedido é arquivado
- Estatísticas do motoboy são atualizadas

---

## 🧪 Como Testar a Comunicação

### Pré-requisitos:

1. **Iniciar o servidor:**
```bash
node server.js
```

2. **Verificar se o servidor está rodando:**
- HTTP: http://localhost:3002
- WebSocket: ws://localhost:3002

### Passo a Passo dos Testes:

#### Teste 1: Fazer Pedido no Delivery

1. Abra o navegador em: `http://localhost:3002/delivery.html`
2. Adicione itens ao carrinho
3. Preencha endereço
4. Selecione forma de pagamento (PIX ou Cartão)
5. Clique em "Finalizar Pedido"

**✅ Resultado Esperado:**
- Pedido aparece no console do delivery
- Pedido é salvo no localStorage
- WebSocket envia pedido para o servidor

#### Teste 2: Receber Pedido no Motoboy

1. Abra outra aba/janela: `http://localhost:3002/motoboy.html`
2. Aguarde o motoboy fazer login automático
3. Verifique se o pedido aparece na lista

**✅ Resultado Esperado:**
- Pedido aparece na lista do motoboy
- Status inicial: "pending"
- Ícone de delivery visível

#### Teste 3: Aceitar Pedido

1. No motoboy.html, clique em "Aceitar Pedido"
2. Verifique o console do motoboy

**✅ Resultado Esperado:**
- Status muda para "preparing"
- Rota é mostrada no mapa
- Notificação de sucesso aparece

#### Teste 4: Iniciar Entrega

1. No motoboy.html, clique em "Iniciar Entrega"
2. Verifique o rastreamento

**✅ Resultado Esperado:**
- Status muda para "delivering"
- Rota em tempo real é exibida
- GPS tracking é ativado

#### Teste 5: Completar Entrega

1. No motoboy.html, clique em "Completar Entrega"
2. Confirme a conclusão

**✅ Resultado Esperado:**
- Status muda para "completed"
- Ganho do motoboy é calculado
- Mapa é limpo
- Estatísticas são atualizadas

---

## 🔍 Debug da Comunicação

### Verificar Conexão WebSocket:

No console do navegador:

```javascript
// Verificar se módulo está carregado
console.log(window.DeliveryCommunication);

// Verificar estado do WebSocket
console.log(DeliveryCommunication.ws.readyState);
// 0 = CONNECTING
// 1 = OPEN
// 2 = CLOSING
// 3 = CLOSED
```

### Monitorar Mensagens:

```javascript
// Adicionar listener para mensagens
window.addEventListener('newDeliveryOrder', (event) => {
    console.log('Novo pedido detectado:', event.detail);
});
```

### Verificar localStorage:

```javascript
// Ver pedidos no delivery
console.log(JSON.parse(localStorage.getItem('deliveryOrders')));

// Ver pedidos do motoboy
console.log(JSON.parse(localStorage.getItem('motoboyOrders')));

// Ver notificações
console.log(JSON.parse(localStorage.getItem('customerNotifications')));
```

---

## 🛠️ Solução de Problemas

### Problema: Pedido não aparece no Motoboy

**Solução:**
1. Verifique se o servidor está rodando
2. Confira console do delivery por erros
3. Verifique se WebSocket está conectado:
```javascript
console.log(DeliveryCommunication.ws.readyState === 1);
```

### Problema: Status não atualiza

**Solução:**
1. Verifique se ambas páginas estão abertas
2. Confira se BroadcastChannel está funcionando:
```javascript
const channel = new BroadcastChannel('delivery_channel');
channel.postMessage({test: 'message'});
```

### Problema: WebSocket não conecta

**Solução:**
1. Verifique porta do servidor (padrão: 3002)
2. Tente recarregar página
3. Sistema usará fallback localStorage automaticamente

---

## 📊 Tipos de Mensagens

### Do Delivery para Servidor:
- `submitDeliveryOrder` - Novo pedido
- `heartbeat` - Manter conexão viva

### Do Motoboy para Servidor:
- `motoboyLogin` - Login do motoboy
- `acceptDeliveryOrder` - Aceitar pedido
- `startDeliveryOrder` - Iniciar entrega
- `completeDeliveryOrder` - Completar entrega

### Do Servidor para Clientes:
- `newDeliveryOrder` - Novo pedido disponível
- `orderAccepted` - Pedido aceito pelo motoboy
- `orderDelivering` - Pedido saiu para entrega
- `orderCompleted` - Pedido entregue
- `existingDeliveryOrders` - Pedidos existentes (login)

---

## 🚀 Recursos Avançados

### BroadcastChannel API

Usado para comunicação entre abas do mesmo navegador:

```javascript
// Enviar mensagem
const channel = new BroadcastChannel('delivery_channel');
channel.postMessage({type: 'NEW_DELIVERY_ORDER', order: order});

// Receber mensagem
channel.onmessage = (event) => {
    console.log('Mensagem recebida:', event.data);
};
```

### Fallback Automático

O sistema tenta na seguinte ordem:
1. WebSocket (tempo real)
2. BroadcastChannel (mesmo navegador)
3. localStorage (fallback universal)
4. postMessage (iframe/popup)

---

## 📝 Exemplo de Código

### Enviar Pedido do Delivery:

```javascript
// Criar objeto do pedido
const order = {
    id: `DEL_${Date.now()}`,
    customerName: 'João Silva',
    items: [{name: 'Pizza', quantity: 2, price: 50.00}],
    total: 100.00,
    status: 'pending',
    address: 'Rua das Flores, 123'
};

// Usar módulo de comunicação
if (window.DeliveryCommunication) {
    DeliveryCommunication.broadcastNewOrder(order);
} else {
    // Fallback manual
    const orders = JSON.parse(localStorage.getItem('deliveryOrders') || '[]');
    orders.push(order);
    localStorage.setItem('deliveryOrders', JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('newDeliveryOrder', {detail: order}));
}
```

### Receber Pedido no Motoboy:

```javascript
// Listener para novos pedidos
window.addEventListener('newDeliveryOrder', (event) => {
    const order = event.detail;
    console.log('Novo pedido recebido:', order);
    
    // Adicionar à interface
    receiveRealOrder(order);
});

// Ou via WebSocket
if (window.DeliveryCommunication) {
    DeliveryCommunication.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'newDeliveryOrder') {
            receiveRealOrder(message.order);
        }
    };
}
```

---

## ✅ Checklist de Funcionamento

- [ ] Servidor rodando na porta 3002
- [ ] WebSocket conectado (readyState = 1)
- [ ] communication.js carregado em todas as páginas
- [ ] Pedidos aparecem no motoboy após criar no delivery
- [ ] Status atualiza em tempo real
- [ ] Notificações aparecem para o cliente
- [ ] Mapa de rastreamento funciona
- [ ] Fallback localStorage opera quando WebSocket falha

---

## 🎯 Próximos Passos

1. **Testar em produção** com domínio real
2. **Adicionar autenticação** para motoboys
3. **Implementar geolocalização** em tempo real
4. **Adicionar histórico** de corridas
5. **Criar dashboard** administrativo

---

## 📞 Suporte

Para dúvidas ou problemas, verifique os logs do console e do servidor. O sistema possui logging extensivo para facilitar debugging.

**Logs importantes:**
- `[COMMUNICATION]` - Módulo de comunicação
- `[DELIVERY]` - Página de delivery
- `[MOTOBOY]` - Página do motoboy
- `[SERVER]` - Servidor WebSocket
