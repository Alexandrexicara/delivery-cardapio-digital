const fs = require('fs');
const path = require('path');

// Script para corrigir todos os pedidos existentes no orders.json

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

// Corrigir todos os pedidos
function fixAllOrders() {
  console.log('=== Corrigindo todos os pedidos ===');
  
  const orders = loadOrders();
  let fixedCount = 0;
  let skippedCount = 0;
  
  orders.forEach(order => {
    // Se o pedido tem customer vazio, vamos corrigir com dados de exemplo
    if (order.customer && Object.keys(order.customer).length === 0) {
      // Tentar extrair o número da mesa do campo table
      const tableMatch = order.table ? order.table.match(/Mesa\s+(\d+)/i) : null;
      
      if (tableMatch) {
        const tableNumber = tableMatch[1];
        // Criar dados de cliente com base na mesa
        order.customer = {
          fullName: `Cliente da ${order.table}`,
          phone: "11999999999",
          cpf: "123.456.789-00",
          tableNumber: tableNumber.padStart(2, '0') // Garantir que tenha 2 dígitos
        };
        fixedCount++;
        console.log(`Pedido ${order.id}: Corrigido com dados da ${order.table}`);
      } else if (order.table === 'Mesa 05' || !order.table) {
        // Para pedidos com Mesa 05 ou sem mesa, manter como está mas adicionar dados mínimos
        order.customer = {
          fullName: "Cliente da Mesa 05",
          phone: "11999999999",
          cpf: "123.456.789-00",
          tableNumber: "05"
        };
        fixedCount++;
        console.log(`Pedido ${order.id}: Corrigido com dados da Mesa 05`);
      } else {
        // Para outros casos, pular
        skippedCount++;
        console.log(`Pedido ${order.id}: Pulado - Mesa desconhecida "${order.table}"`);
      }
    } else if (order.customer && order.customer.tableNumber) {
      // Verificar se a mesa está correta
      const expectedTable = `Mesa ${parseInt(order.customer.tableNumber)}`;
      if (order.table !== expectedTable) {
        order.table = expectedTable;
        fixedCount++;
        console.log(`Pedido ${order.id}: Corrigido mesa de "${order.table}" para "${expectedTable}"`);
      } else {
        // Já está correto
        skippedCount++;
      }
    } else {
      // Já tem dados válidos
      skippedCount++;
    }
  });
  
  if (fixedCount > 0) {
    if (saveOrders(orders)) {
      console.log(`\n✅ ${fixedCount} pedidos corrigidos com sucesso!`);
      console.log(`ℹ️  ${skippedCount} pedidos já estavam corretos ou foram pulados`);
    } else {
      console.log(`\n❌ Erro ao salvar os pedidos corrigidos`);
    }
  } else {
    console.log('\nℹ️  Nenhum pedido precisa ser corrigido');
  }
  
  return fixedCount;
}

// Executar a correção
fixAllOrders();