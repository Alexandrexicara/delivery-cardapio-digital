const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Script para testar a comunicação WebSocket e verificar como os pedidos estão sendo enviados

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

// Testar envio de um pedido simulado
function testOrderSubmission() {
  console.log('=== Testando envio de pedido ===');
  
  // Criar dados de cliente simulados
  const customerData = {
    fullName: "Cliente Teste WebSocket",
    phone: "11987654321",
    cpf: "123.456.789-00",
    tableNumber: "08"
  };
  
  console.log('Dados do cliente:', customerData);
  
  // Criar itens do pedido
  const cartItems = [
    {
      name: "Produto WebSocket",
      quantity: 2,
      price: 30.00,
      category: "main"
    }
  ];
  
  console.log('Itens do pedido:', cartItems);
  
  // Calcular totais
  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const serviceFee = subtotal * 0.10;
  const total = subtotal + serviceFee;
  
  console.log('Subtotal:', subtotal);
  console.log('Taxa de serviço:', serviceFee);
  console.log('Total:', total);
  
  // Criar pedido
  const order = {
    id: `#${Math.floor(Math.random() * 90) + 10}-${Date.now()}`,
    customer: customerData,
    items: cartItems,
    observations: "Teste via WebSocket",
    subtotal: subtotal,
    serviceFee: serviceFee,
    total: total,
    table: customerData.tableNumber ? `Mesa ${customerData.tableNumber}` : 'Mesa 05',
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  console.log('Pedido criado:', order);
  
  // Simular envio via WebSocket
  const message = {
    type: 'submitOrder',
    order: order
  };
  
  console.log('Mensagem a ser enviada via WebSocket:', message);
  
  // Verificar pedidos existentes
  const orders = loadOrders();
  console.log(`\n=== Pedidos existentes (${orders.length}) ===`);
  
  // Verificar se há pedidos com dados de cliente vazios
  const emptyCustomerOrders = orders.filter(order => 
    !order.customer || Object.keys(order.customer).length === 0
  );
  
  console.log(`Pedidos com customer vazio: ${emptyCustomerOrders.length}`);
  
  if (emptyCustomerOrders.length > 0) {
    console.log('Exemplos de pedidos com customer vazio:');
    emptyCustomerOrders.slice(0, 3).forEach(order => {
      console.log(`- Pedido ${order.id}:`, order.customer);
    });
  }
  
  return order;
}

// Executar teste
testOrderSubmission();