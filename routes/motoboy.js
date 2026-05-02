const express = require("express");
const router = express.Router();
const { 
  verSaldo, 
  sacar, 
  sacarTotal,
  getHistoricoPedidos,
  getResumoGanho,
  getAllMotoboys
} = require("../services/motoboyService");

// Ver saldo do motoboy
router.get("/:id", (req, res) => {
  try {
    const saldo = verSaldo(req.params.id);
    res.json({ success: true, data: saldo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Sacar valor específico
router.post("/sacar/:id", (req, res) => {
  try {
    const { valor } = req.body;
    if (!valor || valor <= 0) {
      return res.status(400).json({ success: false, error: "Valor inválido" });
    }
    
    const resultado = sacar(req.params.id, valor);
    if (resultado.error) {
      return res.status(400).json({ success: false, error: resultado.error });
    }
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Sacar tudo
router.post("/sacar-total/:id", (req, res) => {
  try {
    const resultado = sacarTotal(req.params.id);
    if (resultado.error) {
      return res.status(400).json({ success: false, error: resultado.error });
    }
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver histórico de pedidos
router.get("/:id/historico", (req, res) => {
  try {
    const historico = getHistoricoPedidos(req.params.id);
    res.json({ success: true, data: historico });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver resumo de ganhos
router.get("/:id/resumo", (req, res) => {
  try {
    const resumo = getResumoGanho(req.params.id);
    res.json({ success: true, data: resumo });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver todos os motoboys
router.get("/", (req, res) => {
  try {
    const todosMotoboys = getAllMotoboys();
    res.json({ success: true, data: todosMotoboys });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
