const WebSocket = require('ws');

console.log('🧪 Testando notificações de pagamento para o garçom...\n');

// Conectar ao servidor
const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => {
    console.log('✅ Conectado ao servidor WebSocket');
    
    // Enviar notificação de pagamento confirmado
    setTimeout(() => {
        console.log('📤 Enviando notificação de pagamento...');
        const paymentNotification = JSON.stringify({
            type: 'paymentStatusUpdate',
            orderId: '#PAYMENT-TEST-001',
            paymentStatus: 'completed'
        });
        
        ws.send(paymentNotification);
        console.log('✅ Notificação de pagamento enviada');
    }, 1000);
    
    // Enviar notificação de novo pedido também
    setTimeout(() => {
        console.log('📤 Enviando notificação de novo pedido...');
        const newOrderNotification = JSON.stringify({
            type: 'newOrder',
            order: {
                id: '#ORDER-TEST-001',
                table: 'Mesa 05',
                items: [{ name: 'Test Item', quantity: 1, price: 25.90 }],
                total: 25.90,
                status: 'pending',
                timestamp: new Date().toISOString()
            }
        });
        
        ws.send(newOrderNotification);
        console.log('✅ Notificação de novo pedido enviada');
    }, 2000);
    
    // Encerrar teste
    setTimeout(() => {
        console.log('\n🏁 Encerrando teste...');
        ws.close();
    }, 3000);
});

ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log('📥 Servidor recebeu:', message.type);
});

ws.on('error', (error) => {
    console.log('❌ Erro:', error.message);
});

ws.on('close', () => {
    console.log('✅ Conexão encerrada');
});