const express = require("express");
const router = express.Router();
const { 
  criarPedido, 
  pagarPix, 
  pagarCartao,
  verSaldoVendedor,
  verSaldoMotoboy,
  getPedido,
  getPedidosPorVendedor,
  getPedidosPorMotoboy
} = require("../services/pagamentoService");

// Criar pedido
router.post("/criar", (req, res) => {
  try {
    const pedido = criarPedido(req.body);
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Pagar com PIX
router.post("/pix/:id", (req, res) => {
  try {
    const resultado = pagarPix(req.params.id);
    if (resultado.error) {
      return res.status(404).json({ success: false, error: resultado.error });
    }
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Pagar com Cartão
router.post("/cartao/:id", (req, res) => {
  try {
    const resultado = pagarCartao(req.params.id);
    if (resultado.error) {
      return res.status(404).json({ success: false, error: resultado.error });
    }
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver pedido específico
router.get("/pedido/:id", (req, res) => {
  try {
    const pedido = getPedido(req.params.id);
    if (!pedido) {
      return res.status(404).json({ success: false, error: "Pedido não encontrado" });
    }
    res.json({ success: true, data: pedido });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver saldo vendedor
router.get("/vendedor/:id", (req, res) => {
  try {
    const saldo = verSaldoVendedor(req.params.id);
    res.json({ success: true, data: saldo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver saldo motoboy
router.get("/motoboy/:id", (req, res) => {
  try {
    const saldo = verSaldoMotoboy(req.params.id);
    res.json({ success: true, data: saldo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver pedidos do vendedor
router.get("/vendedor/:id/pedidos", (req, res) => {
  try {
    const pedidos = getPedidosPorVendedor(req.params.id);
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver pedidos do motoboy
router.get("/motoboy/:id/pedidos", (req, res) => {
  try {
    const pedidos = getPedidosPorMotoboy(req.params.id);
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
