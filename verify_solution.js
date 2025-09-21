const fs = require('fs');
const path = require('path');

// Script para verificar se a solução está correta

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

// Verificar se a solução está correta
function verifySolution() {
  console.log('=== Verificando solução ===');
  
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
  
  // Verificar consistência entre mesa e customer.tableNumber
  let inconsistentOrders = 0;
  orders.forEach(order => {
    if (order.customer && order.customer.tableNumber && order.table) {
      // Extrair número da mesa do campo table do pedido
      const tableMatch = order.table.match(/Mesa\s+(\d+)/i);
      if (tableMatch) {
        const tableNumberFromOrder = tableMatch[1];
        const tableNumberFromCustomer = order.customer.tableNumber.toString();
        
        // Verificar se os números correspondem (ignorando zeros à esquerda)
        if (parseInt(tableNumberFromOrder) !== parseInt(tableNumberFromCustomer)) {
          inconsistentOrders++;
          console.log(`❌ Inconsistência no pedido ${order.id}:`);
          console.log(`   Mesa no pedido: ${order.table} (número: ${tableNumberFromOrder})`);
          console.log(`   tableNumber no customer: ${tableNumberFromCustomer}`);
        }
      } else {
        inconsistentOrders++;
        console.log(`❌ Formato inválido de mesa no pedido ${order.id}: ${order.table}`);
      }
    }
  });
  
  if (inconsistentOrders === 0) {
    console.log('✅ Todos os pedidos têm mesa consistente com customer.tableNumber');
  } else {
    console.log(`❌ ${inconsistentOrders} pedidos com inconsistência entre mesa e customer.tableNumber`);
  }
  
  // Verificar pedidos com mesas específicas
  const mesa05Orders = orders.filter(order => {
    const tableMatch = order.table.match(/Mesa\s+(\d+)/i);
    return tableMatch && parseInt(tableMatch[1]) === 5;
  });
  
  const mesa03Orders = orders.filter(order => {
    const tableMatch = order.table.match(/Mesa\s+(\d+)/i);
    return tableMatch && parseInt(tableMatch[1]) === 3;
  });
  
  const mesa10Orders = orders.filter(order => {
    const tableMatch = order.table.match(/Mesa\s+(\d+)/i);
    return tableMatch && parseInt(tableMatch[1]) === 10;
  });
  
  console.log(`\nPedidos com Mesa 05: ${mesa05Orders.length}`);
  console.log(`Pedidos com Mesa 03: ${mesa03Orders.length}`);
  console.log(`Pedidos com Mesa 10: ${mesa10Orders.length}`);
  
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

// Executar a verificação
const result = verifySolution();

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