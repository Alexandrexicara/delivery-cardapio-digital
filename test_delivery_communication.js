/**
 * Script de Teste para Comunicação Delivery-Motoboy
 * Execute este script no console do navegador para testar a comunicação
 */

const DeliveryTest = {
    // Testar conexão WebSocket
    testWebSocketConnection() {
        console.log('🔍 [TESTE] Verificando conexão WebSocket...');
        
        if (window.DeliveryCommunication && window.DeliveryCommunication.ws) {
            const ws = DeliveryCommunication.ws;
            console.log('✅ WebSocket existe:', ws);
            console.log('📊 Estado da conexão:', ws.readyState);
            
            switch(ws.readyState) {
                case 0:
                    console.warn('⚠️  WebSocket CONNECTING - aguarde...');
                    break;
                case 1:
                    console.log('✅ WebSocket OPEN - conectado!');
                    return true;
                case 2:
                    console.error('❌ WebSocket CLOSING - fechando...');
                    return false;
                case 3:
                    console.error('❌ WebSocket CLOSED - desconectado!');
                    return false;
            }
        } else {
            console.error('❌ WebSocket não encontrado!');
            console.log('💡 Dica: Verifique se communication.js foi carregado');
            return false;
        }
    },
    
    // Testar envio de pedido
    testSendOrder() {
        console.log('\n📦 [TESTE] Criando pedido de teste...');
        
        const testOrder = {
            id: `TEST_${Date.now()}`,
            customerName: 'Cliente Teste',
            customerPhone: '(11) 99999-9999',
            address: 'Rua de Teste, 123 - Centro',
            items: [
                { name: 'Produto Teste 1', quantity: 2, price: 25.00 },
                { name: 'Produto Teste 2', quantity: 1, price: 15.00 }
            ],
            total: 65.00,
            status: 'pending',
            orderTime: new Date().toISOString(),
            paymentMethod: 'pix',
            deliveryType: 'delivery',
            estimatedTime: 35
        };
        
        console.log('📋 Pedido criado:', testOrder);
        
        if (window.DeliveryCommunication) {
            console.log('🚀 Enviando pedido via DeliveryCommunication...');
            DeliveryCommunication.broadcastNewOrder(testOrder);
            console.log('✅ Pedido enviado!');
        } else {
            console.error('❌ DeliveryCommunication não disponível!');
            console.log('💡 Usando fallback localStorage...');
            
            const orders = JSON.parse(localStorage.getItem('deliveryOrders') || '[]');
            orders.push(testOrder);
            localStorage.setItem('deliveryOrders', JSON.stringify(orders));
            
            window.dispatchEvent(new CustomEvent('newDeliveryOrder', { detail: testOrder }));
            console.log('✅ Pedido enviado via fallback!');
        }
        
        console.log('\n📊 Verifique no motoboy.html se o pedido apareceu!');
        return testOrder;
    },
    
    // Testar recebimento de notificações
    testReceiveNotifications() {
        console.log('\n🔔 [TESTE] Configurando listener de notificações...');
        
        window.addEventListener('orderStatusChanged', (event) => {
            console.log('📢 Notificação de status recebida:', event.detail);
        });
        
        window.addEventListener('motoboyAssigned', (event) => {
            console.log('🏍️ Motoboy designado:', event.detail);
        });
        
        window.addEventListener('newDeliveryOrder', (event) => {
            console.log('📦 Novo pedido recebido:', event.detail);
        });
        
        console.log('✅ Listeners configurados! Aguardando eventos...');
    },
    
    // Verificar localStorage
    checkLocalStorage() {
        console.log('\n📂 [TESTE] Verificando localStorage...');
        
        const deliveryOrders = JSON.parse(localStorage.getItem('deliveryOrders') || '[]');
        console.log(`📦 Pedidos no delivery: ${deliveryOrders.length}`);
        if (deliveryOrders.length > 0) {
            console.log('Último pedido:', deliveryOrders[deliveryOrders.length - 1]);
        }
        
        const motoboyOrders = JSON.parse(localStorage.getItem('motoboyOrders') || '[]');
        console.log(`🏍️ Pedidos do motoboy: ${motoboyOrders.length}`);
        if (motoboyOrders.length > 0) {
            console.log('Último pedido:', motoboyOrders[motoboyOrders.length - 1]);
        }
        
        const customerNotifications = JSON.parse(localStorage.getItem('customerNotifications') || '[]');
        console.log(`🔔 Notificações do cliente: ${customerNotifications.length}`);
        if (customerNotifications.length > 0) {
            console.log('Última notificação:', customerNotifications[customerNotifications.length - 1]);
        }
    },
    
    // Testar BroadcastChannel
    testBroadcastChannel() {
        console.log('\n📡 [TESTE] Testando BroadcastChannel...');
        
        if (typeof BroadcastChannel !== 'undefined') {
            const channel = new BroadcastChannel('delivery_channel');
            
            channel.onmessage = (event) => {
                console.log('📨 Mensagem BroadcastChannel recebida:', event.data);
            };
            
            const testMessage = {
                type: 'TEST_MESSAGE',
                timestamp: new Date().toISOString(),
                data: 'Teste de broadcast'
            };
            
            channel.postMessage(testMessage);
            console.log('✅ Mensagem de teste enviada via BroadcastChannel');
        } else {
            console.warn('⚠️  BroadcastChannel não suportado neste navegador');
        }
    },
    
    // Simular fluxo completo
    testFullFlow() {
        console.log('\n🎬 [TESTE] Iniciando fluxo completo...\n');
        
        // Passo 1: Verificar conexão
        console.log('Passo 1: Verificando conexão...');
        const connected = this.testWebSocketConnection();
        
        if (!connected) {
            console.warn('⚠️  WebSocket não conectado, usando fallback...');
        }
        
        // Passo 2: Configurar listeners
        console.log('\nPasso 2: Configurando listeners...');
        this.testReceiveNotifications();
        
        // Passo 3: Enviar pedido
        setTimeout(() => {
            console.log('\nPasso 3: Enviando pedido...');
            const order = this.testSendOrder();
            
            // Passo 4: Verificar localStorage
            setTimeout(() => {
                console.log('\nPasso 4: Verificando armazenamento...');
                this.checkLocalStorage();
                
                // Passo 5: Testar broadcast
                setTimeout(() => {
                    console.log('\nPasso 5: Testando broadcast...');
                    this.testBroadcastChannel();
                    
                    console.log('\n✅ Fluxo completo finalizado!');
                    console.log('\n📋 RESUMO:');
                    console.log('- Pedido criado e enviado');
                    console.log('- Listeners configurados');
                    console.log('- Armazenamento verificado');
                    console.log('- Broadcast testado');
                    console.log('\n🔍 Abra motoboy.html em outra aba para ver o pedido!');
                }, 1000);
            }, 1000);
        }, 1000);
    },
    
    // Executar todos os testes
    runAllTests() {
        console.log('🚀 ====================================');
        console.log('🧪 INICIANDO TESTES DE COMUNICAÇÃO');
        console.log('====================================\n');
        
        this.testFullFlow();
        
        console.log('\n====================================');
        console.log('✅ TESTES CONCLUÍDOS!');
        console.log('====================================\n');
        
        console.log('📖 Para mais informações, consulte DELIVERY_COMMUNICATION_GUIDE.md');
    }
};

// Instruções de uso
console.log('\n💡 COMO USAR ESTE SCRIPT:\n');
console.log('1. Para testar tudo: DeliveryTest.runAllTests()');
console.log('2. Para testar envio de pedido: DeliveryTest.testSendOrder()');
console.log('3. Para verificar conexão: DeliveryTest.testWebSocketConnection()');
console.log('4. Para verificar localStorage: DeliveryTest.checkLocalStorage()');
console.log('5. Para testar broadcast: DeliveryTest.testBroadcastChannel()\n');

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.DeliveryTest = DeliveryTest;
}
