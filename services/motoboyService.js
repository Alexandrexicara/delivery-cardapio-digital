const { motoboys, pedidos, entregas } = require("../db");
const { log, logError, logSuccess } = require("../utils/logs");

function verSaldo(motoboyId) {
  const motoboy = motoboys[motoboyId];
  if (!motoboy) {
    return { saldo: 0, pedidos: [] };
  }
  
  log(`Consulta saldo - Motoboy: ${motoboyId} - Saldo: R$${motoboy.saldo}`);
  
  return motoboy;
}

function sacar(motoboyId, valor) {
  const motoboy = motoboys[motoboyId];
  
  if (!motoboy) {
    logError(`Saque - Motoboy não encontrado: ${motoboyId}`);
    return { error: "Motoboy não encontrado" };
  }

  if (motoboy.saldo < valor) {
    logError(`Saque - Saldo insuficiente - Motoboy: ${motoboyId} - Saldo: R$${motoboy.saldo} - Tentativa: R$${valor}`);
    return { error: "Saldo insuficiente" };
  }

  const sacado = valor;
  motoboy.saldo -= valor;
  
  logSuccess(`Saque realizado - Motoboy: ${motoboyId} - Valor: R$${sacado} - Saldo restante: R$${motoboy.saldo}`);

  return { 
    sacado, 
    saldoRestante: motoboy.saldo,
    motoboyId 
  };
}

function sacarTotal(motoboyId) {
  const motoboy = motoboys[motoboyId];
  
  if (!motoboy) {
    logError(`Saque total - Motoboy não encontrado: ${motoboyId}`);
    return { error: "Motoboy não encontrado" };
  }

  const valor = motoboy.saldo;
  motoboy.saldo = 0;

  logSuccess(`Saque total realizado - Motoboy: ${motoboyId} - Valor: R$${valor}`);

  return { 
    sacado: valor, 
    saldoRestante: 0,
    motoboyId 
  };
}

function getHistoricoPedidos(motoboyId) {
  const pedidosMotoboy = Object.values(pedidos).filter(p => p.motoboyId === motoboyId);
  const entregasMotoboy = Object.values(entregas).filter(e => e.motoboyId === motoboyId);
  
  return {
    pedidos: pedidosMotoboy,
    entregas: entregasMotoboy,
    totalPedidos: pedidosMotoboy.length,
    totalEntregas: entregasMotoboy.length
  };
}

function getResumoGanho(motoboyId) {
  const pedidosMotoboy = Object.values(pedidos).filter(p => p.motoboyId === motoboyId && p.status === "pago");
  
  const totalGanho = pedidosMotoboy.reduce((total, pedido) => total + pedido.valorMotoboy, 0);
  const totalPedidos = pedidosMotoboy.length;
  
  return {
    motoboyId,
    totalGanho,
    totalPedidos,
    mediaPorPedido: totalPedidos > 0 ? totalGanho / totalPedidos : 0
  };
}

function getAllMotoboys() {
  return Object.keys(motoboys).map(id => ({
    id,
    ...motoboys[id],
    resumo: getResumoGanho(id)
  }));
}

module.exports = { 
  verSaldo, 
  sacar, 
  sacarTotal,
  getHistoricoPedidos,
  getResumoGanho,
  getAllMotoboys
};
