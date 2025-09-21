const fs = require('fs');
const path = require('path');

// Script para testar o registro de um novo pedido com mesa real (não Mesa 05)

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

// Testar registro de novo pedido com mesa real
function testNewOrderReal() {
  console.log('=== Testando registro de novo pedido com mesa real ===');
  
  const orders = loadOrders();
  
  // Criar um pedido de teste com mesa real (Mesa 07)
  const testOrder = {
    id: `#${Math.floor(Math.random() * 90) + 10}-${Date.now()}`,
    customer: {
      fullName: "Cliente da Mesa 07",
      phone: "11912345678",
      cpf: "987.654.321-00",
      tableNumber: "07"  // Mesa 07
    },
    items: [
      {
        name: "Prato Principal Teste",
        quantity: 1,
        price: 45.50,
        category: "main"
      },
      {
        name: "Bebida Teste",
        quantity: 2,
        price: 8.90,
        category: "drink"
      }
    ],
    observations: "Sem cebola, por favor",
    subtotal: 63.30,
    serviceFee: 6.33,
    total: 69.63,
    table: "Mesa 07",  // Deve corresponder ao tableNumber do customer
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
    console.log(`Total: R$ ${testOrder.total}`);
    
    // Verificar consistência
    if (testOrder.table === `Mesa ${testOrder.customer.tableNumber}`) {
      console.log('✅ Consistência verificada: mesa corresponde ao tableNumber');
    } else {
      console.log('❌ Inconsistência: mesa não corresponde ao tableNumber');
    }
  } else {
    console.log('\n❌ Erro ao registrar o pedido de teste');
  }
  
  return testOrder;
}

// Executar o teste
const newOrder = testNewOrderReal();

// Verificar se o pedido foi adicionado corretamente
console.log('\n=== Verificando pedido adicionado ===');
const orders = loadOrders();
const addedOrder = orders.find(order => order.id === newOrder.id);

if (addedOrder) {
  console.log('✅ Pedido encontrado no arquivo orders.json');
  console.log('Dados do pedido:', {
    id: addedOrder.id,
    table: addedOrder.table,
    customer: addedOrder.customer,
    total: addedOrder.total
  });
} else {
  console.log('❌ Pedido não encontrado no arquivo orders.json');
}