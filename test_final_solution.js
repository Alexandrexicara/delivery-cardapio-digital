const fs = require('fs');
const path = require('path');

// Script para testar a solução final do problema de registro de pedidos

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

// Testar a solução final
function testFinalSolution() {
  console.log('=== Testando solução final ===');
  
  const orders = loadOrders();
  console.log(`Total de pedidos: ${orders.length}`);
  
  // Verificar se há pedidos com dados de cliente vazios
  const emptyCustomerOrders = orders.filter(order => 
    !order.customer || Object.keys(order.customer).length === 0
  );
  
  console.log(`Pedidos com customer vazio: ${emptyCustomerOrders.length}`);
  
  if (emptyCustomerOrders.length > 0) {
    console.log('❌ Ainda há pedidos com customer vazio:');
    emptyCustomerOrders.slice(0, 5).forEach(order => {
      console.log(`  - Pedido ${order.id}: customer =`, order.customer);
    });
  } else {
    console.log('✅ Todos os pedidos têm dados de cliente válidos');
  }
  
  // Verificar pedidos com mesas específicas
  const mesa05Orders = orders.filter(order => order.table === 'Mesa 05');
  const mesa03Orders = orders.filter(order => order.table === 'Mesa 03');
  const otherMesaOrders = orders.filter(order => 
    order.table && order.table.startsWith('Mesa') && 
    order.table !== 'Mesa 05' && order.table !== 'Mesa 03'
  );
  
  console.log(`\nPedidos com Mesa 05: ${mesa05Orders.length}`);
  console.log(`Pedidos com Mesa 03: ${mesa03Orders.length}`);
  console.log(`Pedidos com outras mesas: ${otherMesaOrders.length}`);
  
  if (otherMesaOrders.length > 0) {
    console.log('Exemplos de pedidos com outras mesas:');
    otherMesaOrders.slice(0, 3).forEach(order => {
      console.log(`  - Pedido ${order.id}: ${order.table}`, order.customer.tableNumber);
    });
  }
  
  // Verificar consistência entre mesa e customer.tableNumber
  let inconsistentOrders = 0;
  orders.forEach(order => {
    if (order.customer && order.customer.tableNumber && order.table) {
      const expectedTable = `Mesa ${parseInt(order.customer.tableNumber)}`;
      if (order.table !== expectedTable) {
        inconsistentOrders++;
        console.log(`❌ Inconsistência no pedido ${order.id}:`);
        console.log(`   Mesa no pedido: ${order.table}`);
        console.log(`   Mesa esperada: ${expectedTable}`);
        console.log(`   tableNumber no customer: ${order.customer.tableNumber}`);
      }
    }
  });
  
  if (inconsistentOrders === 0) {
    console.log('✅ Todos os pedidos têm mesa consistente com customer.tableNumber');
  } else {
    console.log(`❌ ${inconsistentOrders} pedidos com inconsistência entre mesa e customer.tableNumber`);
  }
  
  // Mostrar último pedido registrado
  if (orders.length > 0) {
    const lastOrder = orders[orders.length - 1];
    console.log('\n=== Último pedido registrado ===');
    console.log(`ID: ${lastOrder.id}`);
    console.log(`Mesa: ${lastOrder.table}`);
    console.log(`Customer:`, lastOrder.customer);
    console.log(`Total: R$ ${lastOrder.total}`);
  }
  
  return {
    totalOrders: orders.length,
    emptyCustomerOrders: emptyCustomerOrders.length,
    inconsistentOrders: inconsistentOrders
  };
}

// Executar o teste
const result = testFinalSolution();

console.log('\n=== RESUMO FINAL ===');
if (result.emptyCustomerOrders === 0 && result.inconsistentOrders === 0) {
  console.log('🎉 SUCESSO: Todos os pedidos estão corretamente registrados!');
  console.log('✅ Mesas reais estão sendo registradas');
  console.log('✅ Dados do cliente estão sendo preservados');
  console.log('✅ Consistência entre mesa e dados do cliente');
} else {
  console.log('❌ AINDA HÁ PROBLEMAS:');
  if (result.emptyCustomerOrders > 0) {
    console.log(`  - ${result.emptyCustomerOrders} pedidos com dados de cliente vazios`);
  }
  if (result.inconsistentOrders > 0) {
    console.log(`  - ${result.inconsistentOrders} pedidos com inconsistência de mesa`);
  }
}