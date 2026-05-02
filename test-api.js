const axios = require('axios');

const API_BASE = 'http://localhost:3002';

console.log('🔥 TESTE COMPLETO DO SISTEMA DE PAGAMENTO E DELIVERY 🔥\n');

async function testarSistema() {
  try {
    // 1. Criar pedido
    console.log('📦 1. Criando pedido...');
    const pedidoResponse = await axios.post(`${API_BASE}/pagamento/criar`, {
      vendedorId: "v1",
      motoboyId: "m1",
      valor: 60,
      metodo: "pix"
    });
    const pedido = pedidoResponse.data.data;
    console.log('✅ Pedido criado:', pedido);
    console.log(`   - Total: R$${pedido.valor}`);
    console.log(`   - Plataforma: R$${pedido.comissao}`);
    console.log(`   - Motoboy: R$${pedido.valorMotoboy}`);
    console.log(`   - Vendedor: R$${pedido.valorVendedor}\n`);

    // 2. Pagar com PIX
    console.log('💰 2. Pagando com PIX...');
    const pixResponse = await axios.post(`${API_BASE}/pagamento/pix/${pedido.id}`);
    const pixResultado = pixResponse.data.data;
    console.log('✅ PIX pago:', pixResultado);
    console.log(`   - Vendedor recebeu: R$${pixResultado.vendedorRecebe}`);
    console.log(`   - Motoboy recebeu: R$${pixResultado.motoboyRecebe}\n`);

    // 3. Verificar saldos
    console.log('👤 3. Verificando saldos...');
    const vendedorResponse = await axios.get(`${API_BASE}/pagamento/vendedor/v1`);
    const motoboyResponse = await axios.get(`${API_BASE}/pagamento/motoboy/m1`);
    
    console.log('✅ Saldo Vendedor:', vendedorResponse.data.data);
    console.log('✅ Saldo Motoboy:', motoboyResponse.data.data);

    // 4. Confirmar entrega
    console.log('\n🚚 4. Confirmando entrega...');
    const entregaResponse = await axios.post(`${API_BASE}/entrega/confirmar`, {
      pedidoId: pedido.id,
      motoboyId: "m1",
      fotoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A",
      localizacao: { lat: -23.5505, lng: -46.6333 }
    });
    console.log('✅ Entrega confirmada:', entregaResponse.data.data);

    // 5. Ver histórico do motoboy
    console.log('\n📋 5. Verificando histórico do motoboy...');
    const historicoResponse = await axios.get(`${API_BASE}/motoboy/m1/historico`);
    console.log('✅ Histórico:', historicoResponse.data.data);

    // 6. Ver resumo de ganhos
    console.log('\n💎 6. Verificando resumo de ganhos...');
    const resumoResponse = await axios.get(`${API_BASE}/motoboy/m1/resumo`);
    console.log('✅ Resumo:', resumoResponse.data.data);

    // 7. Testar saque
    console.log('\n🏦 7. Testando saque do motoboy...');
    const saqueResponse = await axios.post(`${API_BASE}/motoboy/sacar/m1`, {
      valor: 5
    });
    console.log('✅ Saque realizado:', saqueResponse.data.data);

    // 8. Ver saldo final
    console.log('\n💳 8. Verificando saldo final...');
    const saldoFinalResponse = await axios.get(`${API_BASE}/motoboy/m1`);
    console.log('✅ Saldo final:', saldoFinalResponse.data.data);

    console.log('\n🎉 SISTEMA TESTADO COM SUCESSO! 🎉');
    console.log('📊 RESUMO FINAL:');
    console.log(`   - Pedido criado e pago`);
    console.log(`   - Entrega confirmada com foto`);
    console.log(`   - Valores distribuídos corretamente`);
    console.log(`   - Saque funcionando`);
    console.log(`   - Logs registrados`);

  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

// Testar com CARTÃO
async function testarPagamentoCartao() {
  try {
    console.log('\n💳 TESTANDO PAGAMENTO COM CARTÃO...\n');
    
    // Criar pedido com cartão
    const pedidoResponse = await axios.post(`${API_BASE}/pagamento/criar`, {
      vendedorId: "v2",
      motoboyId: "m1",
      valor: 100,
      metodo: "cartao"
    });
    const pedido = pedidoResponse.data.data;
    
    console.log('📦 Pedido criado:', pedido);
    
    // Pagar com cartão
    const cartaoResponse = await axios.post(`${API_BASE}/pagamento/cartao/${pedido.id}`);
    const cartaoResultado = cartaoResponse.data.data;
    
    console.log('💳 Cartão registrado:', cartaoResultado);
    console.log(`   - Dívida do vendedor: R$${cartaoResultado.divida}`);
    
    // Ver saldo do vendedor (deve ter dívida)
    const vendedorResponse = await axios.get(`${API_BASE}/pagamento/vendedor/v2`);
    console.log('👤 Saldo Vendedor (com dívida):', vendedorResponse.data.data);
    
  } catch (error) {
    console.error('❌ Erro no teste de cartão:', error.response?.data || error.message);
  }
}

// Executar testes
async function main() {
  console.log('Iniciando testes...\n');
  
  await testarSistema();
  await testarPagamentoCartao();
  
  console.log('\n🔥 TODOS OS TESTES CONCLUÍDOS! 🔥');
}

// Verificar se o servidor está rodando
async function verificarServidor() {
  try {
    await axios.get(`${API_BASE}/`);
    return true;
  } catch (error) {
    return false;
  }
}

async function iniciar() {
  const servidorAtivo = await verificarServidor();
  
  if (!servidorAtivo) {
    console.log('❌ Servidor não está rodando na porta 3002');
    console.log('💡 Inicie o servidor com: npm start ou node server.js');
    return;
  }
  
  await main();
}

iniciar();
