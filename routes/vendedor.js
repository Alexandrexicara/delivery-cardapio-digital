const express = require("express");
const router = express.Router();
const { vendedores } = require("../db");
const { verSaldoVendedor, getPedidosPorVendedor } = require("../services/pagamentoService");

// Ver dados do vendedor
router.get("/:id", (req, res) => {
  try {
    const vendedor = verSaldoVendedor(req.params.id);
    res.json({ success: true, data: vendedor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver pedidos do vendedor
router.get("/:id/pedidos", (req, res) => {
  try {
    const pedidos = getPedidosPorVendedor(req.params.id);
    res.json({ success: true, data: pedidos });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver todos os vendedores
router.get("/", (req, res) => {
  try {
    const todosVendedores = Object.keys(vendedores).map(id => ({
      id,
      ...vendedores[id]
    }));
    res.json({ success: true, data: todosVendedores });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Criar/atualizar vendedor
router.post("/:id", (req, res) => {
  try {
    const { nome, saldo = 0, saldoNegativo = 0 } = req.body;
    const vendedorId = req.params.id;
    
    if (!vendedores[vendedorId]) {
      vendedores[vendedorId] = { pedidos: [] };
    }
    
    vendedores[vendedorId] = {
      ...vendedores[vendedorId],
      nome,
      saldo,
      saldoNegativo,
      updatedAt: new Date().toISOString()
    };
    
    res.json({ success: true, data: vendedores[vendedorId] });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
