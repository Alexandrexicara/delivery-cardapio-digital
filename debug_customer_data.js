// Script para debugar os dados do cliente no localStorage

console.log('=== Debugando dados do cliente ===');

// Verificar se há dados do cliente no localStorage
const customerData = localStorage.getItem('customerData');
console.log('Dados do cliente no localStorage:', customerData);

if (customerData) {
  try {
    const parsedData = JSON.parse(customerData);
    console.log('Dados do cliente parseados:', parsedData);
    
    if (parsedData.tableNumber) {
      console.log('Número da mesa:', parsedData.tableNumber);
      console.log('Mesa formatada:', `Mesa ${parsedData.tableNumber}`);
    } else {
      console.log('Número da mesa não encontrado nos dados do cliente');
    }
  } catch (error) {
    console.error('Erro ao parsear dados do cliente:', error);
  }
} else {
  console.log('Nenhum dado de cliente encontrado no localStorage');
}

// Verificar pedidos salvos localmente
const userOrders = localStorage.getItem('userOrders');
console.log('\n=== Pedidos do usuário ===');
if (userOrders) {
  try {
    const parsedOrders = JSON.parse(userOrders);
    console.log(`Encontrados ${parsedOrders.length} pedidos:`);
    parsedOrders.forEach((order, index) => {
      console.log(`Pedido ${index + 1}:`, {
        id: order.id,
        table: order.table,
        customer: order.customer
      });
    });
  } catch (error) {
    console.error('Erro ao parsear pedidos do usuário:', error);
  }
} else {
  console.log('Nenhum pedido encontrado no localStorage');
}