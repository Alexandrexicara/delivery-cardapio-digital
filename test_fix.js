const fs = require('fs');
const path = require('path');

// Test script to verify the fix for customer data in orders

console.log('=== TESTE DE VERIFICAÇÃO DA CORREÇÃO ===\n');

// Read the orders file
const ordersFilePath = path.join(__dirname, 'orders.json');
let orders = [];

try {
  const data = fs.readFileSync(ordersFilePath, 'utf8');
  orders = JSON.parse(data);
  console.log(`✓ Carregados ${orders.length} pedidos do arquivo`);
} catch (error) {
  console.error('✗ Erro ao ler o arquivo de pedidos:', error.message);
  process.exit(1);
}

// Check for orders with empty customer data
let ordersWithEmptyCustomer = 0;
let ordersWithValidCustomer = 0;
let tableDistribution = {};

orders.forEach(order => {
  // Check if customer data is empty
  if (!order.customer || Object.keys(order.customer).length === 0) {
    ordersWithEmptyCustomer++;
    console.log(`⚠️  Pedido ${order.id} tem dados de cliente vazios`);
  } else {
    ordersWithValidCustomer++;
    
    // Track table distribution
    if (tableDistribution[order.table]) {
      tableDistribution[order.table]++;
    } else {
      tableDistribution[order.table] = 1;
    }
    
    // Verify that table number matches customer data
    if (order.customer.tableNumber) {
      const expectedTable = `Mesa ${order.customer.tableNumber}`;
      if (order.table !== expectedTable) {
        console.log(`⚠️  Inconsistência no pedido ${order.id}: mesa esperada ${expectedTable}, mas encontrada ${order.table}`);
      }
    }
  }
});

console.log(`\n=== RESULTADOS ===`);
console.log(`Pedidos com dados de cliente válidos: ${ordersWithValidCustomer}`);
console.log(`Pedidos com dados de cliente vazios: ${ordersWithEmptyCustomer}`);

if (ordersWithEmptyCustomer === 0) {
  console.log('✅ Todos os pedidos têm dados de cliente válidos!');
} else {
  console.log(`❌ ${ordersWithEmptyCustomer} pedidos ainda têm dados de cliente vazios.`);
}

console.log('\nDistribuição de mesas:');
Object.keys(tableDistribution).sort().forEach(table => {
  console.log(`  ${table}: ${tableDistribution[table]} pedidos`);
});

// Check if there's variety in tables
const uniqueTables = Object.keys(tableDistribution).length;
if (uniqueTables > 1) {
  console.log(`\n✅ Pedidos distribuídos em ${uniqueTables} mesas diferentes.`);
} else {
  console.log(`\n⚠️  Todos os pedidos estão na mesma mesa.`);
}

console.log('\n=== FIM DO TESTE ===');

// Summary
if (ordersWithEmptyCustomer === 0 && uniqueTables > 1) {
  console.log('\n🎉 SUCESSO: A correção está funcionando corretamente!');
  console.log('   - Todos os pedidos têm dados de cliente válidos');
  console.log('   - Pedidos estão distribuídos em várias mesas');
} else {
  console.log('\n❌ AINDA HÁ PROBLEMAS QUE PRECISAM SER CORRIGIDOS');
}