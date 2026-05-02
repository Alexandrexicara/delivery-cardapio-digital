const { vendedores, motoboys, pedidos } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { log, logError, logSuccess } = require("../utils/logs");

const TAXA_PLATAFORMA = 1; // R$1
const TAXA_MOTOBOY = 10; // R$10 (fixo exemplo)

function criarPedido({ vendedorId, motoboyId, valor, metodo }) {
  const id = uuidv4();

  const comissao = TAXA_PLATAFORMA;
  const valorMotoboy = TAXA_MOTOBOY;
  const valorVendedor = valor - comissao - valorMotoboy;

  const pedido = {
    id,
    vendedorId,
    motoboyId,
    valor,
    comissao,
    valorMotoboy,
    valorVendedor,
    metodo,
    status: "criado",
    createdAt: new Date().toISOString()
  };

  pedidos[id] = pedido;
  
  log(`Pedido criado: ${id} - Valor: R$${valor} - Método: ${metodo}`);
  
  return pedido;
}

// PIX (você recebe)
function pagarPix(pedidoId) {
  const pedido = pedidos[pedidoId];
  
  if (!pedido) {
    logError(`Pedido não encontrado: ${pedidoId}`);
    return { error: "Pedido não encontrado" };
  }

  pedido.status = "pago";
  pedido.paidAt = new Date().toISOString();

  if (!vendedores[pedido.vendedorId])
    vendedores[pedido.vendedorId] = { saldo: 0, saldoNegativo: 0, pedidos: [] };

  if (!motoboys[pedido.motoboyId])
    motoboys[pedido.motoboyId] = { saldo: 0, pedidos: [] };

  const vendedor = vendedores[pedido.vendedorId];
  const motoboy = motoboys[pedido.motoboyId];

  // Adiciona pedidos aos históricos
  vendedor.pedidos.push(pedidoId);
  motoboy.pedidos.push(pedidoId);

  // paga motoboy direto
  motoboy.saldo += pedido.valorMotoboy;

  let valorFinal = pedido.valorVendedor;

  // desconta dívida vendedor
  if (vendedor.saldoNegativo < 0) {
    const divida = Math.abs(vendedor.saldoNegativo);

    if (valorFinal >= divida) {
      valorFinal -= divida;
      vendedor.saldoNegativo = 0;
      log(`Dívida do vendedor ${pedido.vendedorId} quitada: R$${divida}`);
    } else {
      vendedor.saldoNegativo += valorFinal;
      valorFinal = 0;
      log(`Dívida do vendedor ${pedido.vendedorId} reduzida: R$${valorFinal}`);
    }
  }

  vendedor.saldo += valorFinal;

  logSuccess(`Pagamento PIX realizado - Pedido: ${pedidoId} - Vendedor recebe: R$${valorFinal} - Motoboy recebe: R$${pedido.valorMotoboy}`);

  return {
    vendedorRecebe: valorFinal,
    motoboyRecebe: pedido.valorMotoboy,
    pedidoId: pedido.id
  };
}

// CARTÃO
function pagarCartao(pedidoId) {
  const pedido = pedidos[pedidoId];
  
  if (!pedido) {
    logError(`Pedido não encontrado: ${pedidoId}`);
    return { error: "Pedido não encontrado" };
  }

  pedido.status = "pago_cartao";
  pedido.paidAt = new Date().toISOString();

  if (!vendedores[pedido.vendedorId])
    vendedores[pedido.vendedorId] = { saldo: 0, saldoNegativo: 0, pedidos: [] };

  if (!motoboys[pedido.motoboyId])
    motoboys[pedido.motoboyId] = { saldo: 0, pedidos: [] };

  const vendedor = vendedores[pedido.vendedorId];
  const motoboy = motoboys[pedido.motoboyId];

  // Adiciona pedidos aos históricos
  vendedor.pedidos.push(pedidoId);
  motoboy.pedidos.push(pedidoId);

  // motoboy ainda precisa receber
  motoboy.saldo += pedido.valorMotoboy;

  // comissão vira dívida
  vendedor.saldoNegativo -= pedido.comissao;

  log(`Pagamento CARTÃO registrado - Pedido: ${pedidoId} - Dívida vendedor: R$${vendedor.saldoNegativo}`);

  return {
    mensagem: "Cartão registrado",
    divida: vendedor.saldoNegativo,
    pedidoId: pedido.id
  };
}

function verSaldoVendedor(vendedorId) {
  const vendedor = vendedores[vendedorId];
  if (!vendedor) {
    return { saldo: 0, saldoNegativo: 0, pedidos: [] };
  }
  return vendedor;
}

function verSaldoMotoboy(motoboyId) {
  const motoboy = motoboys[motoboyId];
  if (!motoboy) {
    return { saldo: 0, pedidos: [] };
  }
  return motoboy;
}

function getPedido(pedidoId) {
  return pedidos[pedidoId] || null;
}

function getPedidosPorVendedor(vendedorId) {
  return Object.values(pedidos).filter(p => p.vendedorId === vendedorId);
}

function getPedidosPorMotoboy(motoboyId) {
  return Object.values(pedidos).filter(p => p.motoboyId === motoboyId);
}

module.exports = { 
  criarPedido, 
  pagarPix, 
  pagarCartao,
  verSaldoVendedor,
  verSaldoMotoboy,
  getPedido,
  getPedidosPorVendedor,
  getPedidosPorMotoboy
};
