const fs = require('fs');
const path = require('path');

// Script para corrigir pedidos existentes no orders.json

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

// Corrigir pedidos existentes
function fixExistingOrders() {
  console.log('=== Corrigindo pedidos existentes ===');
  
  const orders = loadOrders();
  let fixedCount = 0;
  
  orders.forEach(order => {
    // Se o pedido tem customer vazio mas a mesa não é "Mesa 05", corrigir
    if (order.customer && Object.keys(order.customer).length === 0) {
      // Verificar se a mesa está correta
      if (order.table === 'Mesa 05') {
        console.log(`Pedido ${order.id}: Já está com mesa padrão Mesa 05`);
      } else {
        // Tentar extrair o número da mesa do campo table
        const tableMatch = order.table.match(/Mesa\s+(\d+)/i);
        if (tableMatch) {
          const tableNumber = tableMatch[1];
          // Atualizar o customer com os dados da mesa
          order.customer = {
            tableNumber: tableNumber
          };
          fixedCount++;
          console.log(`Pedido ${order.id}: Corrigido com número da mesa ${tableNumber}`);
        } else {
          console.log(`Pedido ${order.id}: Não foi possível extrair número da mesa de "${order.table}"`);
        }
      }
    } else if (order.customer && order.customer.tableNumber) {
      // Verificar se a mesa está correta
      const expectedTable = `Mesa ${order.customer.tableNumber}`;
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
fixExistingOrders();