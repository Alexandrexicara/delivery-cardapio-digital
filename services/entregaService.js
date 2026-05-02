const { entregas, pedidos } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { log, logError, logSuccess } = require("../utils/logs");

function confirmarEntrega({ pedidoId, motoboyId, fotoBase64, localizacao }) {
  const pedido = pedidos[pedidoId];
  
  if (!pedido) {
    logError(`Entrega - Pedido não encontrado: ${pedidoId}`);
    return { error: "Pedido não encontrado" };
  }

  if (pedido.motoboyId !== motoboyId) {
    logError(`Entrega - Motoboy ${motoboyId} não autorizado para pedido ${pedidoId}`);
    return { error: "Motoboy não autorizado para este pedido" };
  }

  const id = uuidv4();

  const entrega = {
    id,
    pedidoId,
    motoboyId,
    fotoBase64,
    localizacao: localizacao || {},
    data: new Date().toISOString(),
    status: "entregue"
  };

  entregas[id] = entrega;
  
  // Atualiza status do pedido
  pedido.status = "entregue";
  pedido.entregueAt = new Date().toISOString();
  pedido.entregaId = id;

  logSuccess(`Entrega confirmada - Pedido: ${pedidoId} - Motoboy: ${motoboyId} - EntregaID: ${id}`);

  return entrega;
}

function getEntregasPorMotoboy(motoboyId) {
  return Object.values(entregas).filter(e => e.motoboyId === motoboyId);
}

function getEntregasPorPedido(pedidoId) {
  return Object.values(entregas).filter(e => e.pedidoId === pedidoId);
}

function getEntrega(entregaId) {
  return entregas[entregaId] || null;
}

function getAllEntregas() {
  return Object.values(entregas);
}

module.exports = { 
  confirmarEntrega, 
  getEntregasPorMotoboy, 
  getEntregasPorPedido, 
  getEntrega, 
  getAllEntregas 
};
