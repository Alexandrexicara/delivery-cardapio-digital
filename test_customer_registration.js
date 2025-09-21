// Script para testar o registro de cliente e envio de pedido

console.log('=== Testando registro de cliente ===');

// Simular dados de cliente
const testCustomerData = {
  fullName: "Cliente Teste Mesa 08",
  phone: "11987654321",
  cpf: "123.456.789-00",
  tableNumber: "08"
};

console.log('Dados de cliente de teste:', testCustomerData);

// Salvar no localStorage
localStorage.setItem('customerData', JSON.stringify(testCustomerData));
console.log('Dados salvos no localStorage');

// Verificar se foram salvos corretamente
const savedCustomerData = localStorage.getItem('customerData');
console.log('Dados recuperados do localStorage:', savedCustomerData);

if (savedCustomerData) {
  try {
    const parsedData = JSON.parse(savedCustomerData);
    console.log('Dados parseados:', parsedData);
    
    if (parsedData.tableNumber) {
      console.log('Número da mesa:', parsedData.tableNumber);
      console.log('Mesa formatada:', `Mesa ${parsedData.tableNumber}`);
    } else {
      console.log('Número da mesa não encontrado');
    }
  } catch (error) {
    console.error('Erro ao parsear dados:', error);
  }
}

// Simular criação de pedido
console.log('\n=== Testando criação de pedido ===');

const cartItems = [
  {
    name: "Produto Teste",
    quantity: 1,
    price: 25.50,
    category: "main"
  }
];

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
const orderId = `#${Math.floor(Math.random() * 90) + 10}-${Date.now()}`;
const order = {
  id: orderId,
  customer: testCustomerData,
  items: cartItems,
  observations: "Teste de mesa real",
  subtotal: subtotal,
  serviceFee: serviceFee,
  total: total,
  table: testCustomerData.tableNumber ? `Mesa ${testCustomerData.tableNumber}` : 'Mesa 05',
  status: 'pending',
  timestamp: new Date().toISOString()
};

console.log('Pedido criado:', order);

// Verificar se a mesa está correta
if (order.table === `Mesa ${testCustomerData.tableNumber}`) {
  console.log('✅ Mesa correta no pedido:', order.table);
} else {
  console.log('❌ Mesa incorreta no pedido:', order.table);
}

// Salvar pedido no histórico
let userOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
userOrders.push(order);
localStorage.setItem('userOrders', JSON.stringify(userOrders));
console.log('Pedido salvo no histórico');

// Verificar pedidos salvos
const savedOrders = localStorage.getItem('userOrders');
if (savedOrders) {
  try {
    const parsedOrders = JSON.parse(savedOrders);
    console.log(`Total de pedidos no histórico: ${parsedOrders.length}`);
    const lastOrder = parsedOrders[parsedOrders.length - 1];
    console.log('Último pedido:', {
      id: lastOrder.id,
      table: lastOrder.table,
      customer: lastOrder.customer
    });
  } catch (error) {
    console.error('Erro ao parsear pedidos:', error);
  }
}