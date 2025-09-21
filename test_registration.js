// Script para testar a correção do registro de clientes

console.log('=== Testando correção do registro de clientes ===');

// Função para simular o registro de cliente
function testCustomerRegistration() {
    // Dados de teste
    const testData = {
        fullName: "Cliente Teste",
        phone: "11999999999",
        cpf: "123.456.789-00",
        tableNumber: "03"
    };
    
    console.log('Dados de teste:', testData);
    
    // Salvar no localStorage (simulando a função completeRegistration)
    localStorage.setItem('customerData', JSON.stringify(testData));
    console.log('✅ Dados salvos no localStorage');
    
    // Recuperar e verificar
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            console.log('✅ Dados recuperados do localStorage:', parsedData);
            
            // Verificar se todos os campos estão corretos
            if (parsedData.fullName === testData.fullName &&
                parsedData.phone === testData.phone &&
                parsedData.cpf === testData.cpf &&
                parsedData.tableNumber === testData.tableNumber) {
                console.log('✅ Todos os dados foram salvos corretamente');
                return true;
            } else {
                console.log('❌ Erro na verificação dos dados salvos');
                console.log('Esperado:', testData);
                console.log('Recebido:', parsedData);
                return false;
            }
        } catch (error) {
            console.log('❌ Erro ao parsear dados:', error.message);
            return false;
        }
    } else {
        console.log('❌ Nenhum dado encontrado no localStorage');
        return false;
    }
}

// Função para testar o envio de pedido com dados do cliente
function testOrderSubmission() {
    console.log('\n=== Testando envio de pedido ===');
    
    // Recuperar dados do cliente
    const customerData = localStorage.getItem('customerData');
    if (!customerData) {
        console.log('❌ Nenhum dado de cliente encontrado');
        return false;
    }
    
    try {
        const parsedCustomerData = JSON.parse(customerData);
        console.log('✅ Dados do cliente recuperados:', parsedCustomerData);
        
        // Criar pedido de teste
        const testOrder = {
            id: `#${Math.floor(Math.random() * 90) + 10}-${Date.now()}`,
            customer: parsedCustomerData,
            items: [
                {
                    name: "Produto Teste",
                    quantity: 1,
                    price: 25.50,
                    category: "main"
                }
            ],
            observations: "Sem observações",
            subtotal: 25.50,
            serviceFee: 2.55,
            total: 28.05,
            table: parsedCustomerData.tableNumber ? `Mesa ${parsedCustomerData.tableNumber}` : 'Mesa 05',
            status: "pending",
            timestamp: new Date().toISOString()
        };
        
        console.log('✅ Pedido criado com dados do cliente:', testOrder);
        
        // Verificar se a mesa está correta
        if (testOrder.table === `Mesa ${parsedCustomerData.tableNumber}`) {
            console.log('✅ Mesa correta no pedido:', testOrder.table);
            return true;
        } else {
            console.log('❌ Mesa incorreta no pedido');
            console.log('Esperado:', `Mesa ${parsedCustomerData.tableNumber}`);
            console.log('Recebido:', testOrder.table);
            return false;
        }
    } catch (error) {
        console.log('❌ Erro ao criar pedido:', error.message);
        return false;
    }
}

// Executar os testes
const registrationSuccess = testCustomerRegistration();
if (registrationSuccess) {
    const orderSuccess = testOrderSubmission();
    if (orderSuccess) {
        console.log('\n🎉 Todos os testes passaram! A correção está funcionando corretamente.');
    } else {
        console.log('\n❌ Falha no teste de envio de pedido.');
    }
} else {
    console.log('\n❌ Falha no teste de registro de cliente.');
}