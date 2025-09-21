const fs = require('fs');
const path = require('path');

// Script para corrigir a consistência da formatação das mesas

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

// Corrigir consistência da formatação das mesas
function fixTableConsistency() {
  console.log('=== Corrigindo consistência da formatação das mesas ===');
  
  const orders = loadOrders();
  let fixedCount = 0;
  
  orders.forEach(order => {
    if (order.customer && order.customer.tableNumber) {
      // Formatar o número da mesa com 2 dígitos (ex: "05" em vez de "5")
      const tableNumber = order.customer.tableNumber.toString().padStart(2, '0');
      const expectedTable = `Mesa ${tableNumber}`;
      
      // Atualizar customer.tableNumber se necessário
      if (order.customer.tableNumber !== tableNumber) {
        order.customer.tableNumber = tableNumber;
        console.log(`Pedido ${order.id}: Corrigido tableNumber de "${order.customer.tableNumber}" para "${tableNumber}"`);
      }
      
      // Atualizar order.table se necessário
      if (order.table !== expectedTable) {
        order.table = expectedTable;
        fixedCount++;
        console.log(`Pedido ${order.id}: Corrigido mesa de "${order.table}" para "${expectedTable}"`);
      }
    }
  });
  
  if (fixedCount > 0) {
    if (saveOrders(orders)) {
      console.log(`\n✅ ${fixedCount} pedidos corrigidos com sucesso!`);
    } else {
      console.log(`\n❌ Erro ao salvar os pedidos corrigidos`);
    }
  } else {
    console.log('\nℹ️  Nenhum pedido precisa ser corrigido');
  }
  
  return fixedCount;
}

// Executar a correção
fixTableConsistency();