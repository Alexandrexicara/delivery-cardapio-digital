const fs = require('fs');
const path = require('path');

// Script para testar o registro de um novo pedido com dados de cliente reais

const ORDERS_FILE = path.join(__dirname, 'orders.json');

function loadOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
  return [];
}

function saveOrders(orders) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving orders:', error);
    return false;
  }
}

// Testar registro de novo pedido com dados de cliente reais
function testOrderRegistration() {
  console.log('=== Testando registro de novo pedido ===');
  
  const orders = loadOrders();
  
  // Criar um pedido de teste com dados de cliente reais
  const testOrder = {
    id: `#${Math.floor(Math.random() * 90) + 10}-${Date.now()}`,
    customer: {
      fullName: "Cliente de Teste",
      phone: "11999999999",
      cpf: "123.456.789-00",
      tableNumber: "03"  // Mesa 03
    },
    items: [
      {
        name: "Carne com Mandioca",
        quantity: 2,
        price: 45.60,
        category: "main"
      },
      {
        name: "Refrigerante",
        quantity: 1,
        price: 7.90,
        category: "drink"
      }
    ],
    observations: "Sem cebola",
    subtotal: 99.10,
    serviceFee: 9.91,
    total: 109.01,
    table: "Mesa 03",  // Deve corresponder ao tableNumber do customer
    status: "pending",
    paymentStatus: "pending",
    timestamp: new Date().toISOString()
  };
  
  console.log('Pedido de teste criado:', testOrder);
  
  // Adicionar o pedido aos pedidos existentes
  orders.push(testOrder);
  
  // Salvar os pedidos atualizados
  if (saveOrders(orders)) {
    console.log('\n✅ Pedido de teste registrado com sucesso!');
    console.log(`ID do pedido: ${testOrder.id}`);
    console.log(`Mesa: ${testOrder.table}`);
    console.log(`Dados do cliente:`, testOrder.customer);
  } else {
    console.log('\n❌ Erro ao registrar o pedido de teste');
  }
  
  return testOrder;
}

// Executar o teste
testOrderRegistration();