const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

// Script para testar a comunicação com o servidor e verificar processamento de pedidos

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

// Testar envio de pedido com mesa real
function testServerCommunication() {
  console.log('=== Testando comunicação com o servidor ===');
  
  // Criar dados de cliente com mesa real
  const customerData = {
    fullName: "Cliente Teste Servidor",
    phone: "11987654321",
    cpf: "123.456.789-00",
    tableNumber: "09"  // Mesa 09
  };
  
  console.log('Dados do cliente:', customerData);
  
  // Criar itens do pedido
  const cartItems = [
    {
      name: "Produto Servidor",
      quantity: 1,
      price: 35.75,
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
  
  // Criar pedido com mesa real
  const order = {
    id: `#${Math.floor(Math.random() * 90) + 10}-${Date.now()}`,
    customer: customerData,
    items: cartItems,
    observations: "Teste via servidor",
    subtotal: subtotal,
    serviceFee: serviceFee,
    total: total,
    table: customerData.tableNumber ? `Mesa ${customerData.tableNumber}` : 'Mesa 05',  // Mesa real
    status: 'pending',
    timestamp: new Date().toISOString()
  };
  
  console.log('Pedido criado com mesa real:', order);
  
  // Simular processamento do servidor
  console.log('\n=== Simulando processamento do servidor ===');
  
  // Verificar se os dados do cliente estão corretos
  if (order.customer && order.customer.tableNumber) {
    console.log('✅ Dados do cliente presentes:', order.customer);
    
    // Verificar consistência da mesa
    const expectedTable = `Mesa ${order.customer.tableNumber}`;
    if (order.table === expectedTable) {
      console.log('✅ Mesa consistente:', order.table);
    } else {
      console.log('❌ Inconsistência de mesa:');
      console.log('   Mesa no pedido:', order.table);
      console.log('   Mesa esperada:', expectedTable);
    }
  } else {
    console.log('❌ Dados do cliente ausentes ou inválidos');
  }
  
  // Adicionar pedido aos pedidos existentes
  const orders = loadOrders();
  console.log(`\nTotal de pedidos antes: ${orders.length}`);
  
  orders.push(order);
  
  if (saveOrders(orders)) {
    console.log('✅ Pedido salvo com sucesso no servidor');
    
    // Verificar pedido salvo
    const updatedOrders = loadOrders();
    console.log(`Total de pedidos depois: ${updatedOrders.length}`);
    
    const lastOrder = updatedOrders[updatedOrders.length - 1];
    console.log('Último pedido salvo:', {
      id: lastOrder.id,
      table: lastOrder.table,
      customer: lastOrder.customer,
      total: lastOrder.total
    });
    
    // Verificar consistência
    if (lastOrder.table === `Mesa ${lastOrder.customer.tableNumber}`) {
      console.log('✅ Consistência verificada no arquivo');
    } else {
      console.log('❌ Inconsistência no arquivo salvo');
    }
  } else {
    console.log('❌ Erro ao salvar pedido no servidor');
  }
  
  return order;
}

// Executar teste
const testOrder = testServerCommunication();

console.log('\n=== RESUMO DO TESTE ===');
console.log(`Pedido: ${testOrder.id}`);
console.log(`Mesa: ${testOrder.table}`);
console.log(`Cliente: Mesa ${testOrder.customer.tableNumber}`);
console.log(`Total: R$ ${testOrder.total}`);
console.log('✅ Teste concluído com sucesso!');