const WebSocket = require('ws');

console.log('🧪 Testando notificações para todos os setores simultaneamente...\n');

// Conectar aos diferentes setores
const adminWs = new WebSocket('ws://localhost:3001');
const kitchenWs = new WebSocket('ws://localhost:3001');
const counterWs = new WebSocket('ws://localhost:3001');
const waiterWs = new WebSocket('ws://localhost:3001');

let connectionsReady = 0;
const totalConnections = 4;

function checkAllConnected() {
    connectionsReady++;
    console.log(`✅ Conexão ${connectionsReady}/${totalConnections} estabelecida`);
    
    if (connectionsReady === totalConnections) {
        console.log('\n🎉 Todas as conexões estabelecidas!');
        setTimeout(sendTestNotifications, 1000);
    }
}

// Configurar todas as conexões
[adminWs, kitchenWs, counterWs, waiterWs].forEach((ws, index) => {
    const sectorNames = ['ADMIN', 'COZINHA', 'BALCÃO', 'GARÇOM'];
    
    ws.on('open', () => {
        console.log(`🔌 Conectado ao setor: ${sectorNames[index]}`);
        checkAllConnected();
    });

    ws.on('message', (data) => {
        const message = JSON.parse(data);
        console.log(`🔊 ${sectorNames[index]} recebeu:`, message.type);
        
        // Simular resposta sonora para cada setor
        if (message.type === 'newOrder') {
            console.log(`🎵 ${sectorNames[index]}: TOQUE SONORO TRIPLE BEEP ativado`);
        }
    });

    ws.on('error', (error) => {
        console.log(`❌ Erro no setor ${sectorNames[index]}:`, error.message);
    });
});

function sendTestNotifications() {
    console.log('\n🚀 Enviando notificações de teste para todos os setores...\n');
    
    // Enviar novo pedido (deve acionar todos os setores)
    const newOrderMessage = JSON.stringify({
        type: 'newOrder',
        order: {
            id: '#TEST-001',
            table: 'Mesa 05',
            items: [{ name: 'Test Item', quantity: 1, price: 15.90 }],
            total: 15.90,
            timestamp: new Date().toISOString()
        }
    });

    // Enviar para todos os setores
    [adminWs, kitchenWs, counterWs, waiterWs].forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(newOrderMessage);
        }
    });

    console.log('📨 Mensagem de novo pedido enviada para todos os setores');
    console.log('⏱️  Aguardando respostas...\n');

    // Testar status update após 2 segundos
    setTimeout(() => {
        console.log('🔄 Enviando atualização de status...');
        const statusUpdateMessage = JSON.stringify({
            type: 'statusUpdate',
            orderId: '#TEST-001',
            status: 'preparing'
        });

        [adminWs, kitchenWs, counterWs, waiterWs].forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(statusUpdateMessage);
            }
        });
    }, 2000);

    // Encerrar teste após 5 segundos
    setTimeout(() => {
        console.log('\n🏁 Encerrando teste...');
        [adminWs, kitchenWs, counterWs, waiterWs].forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        });
        console.log('✅ Teste concluído!');
    }, 5000);
}