const express = require("express");
const router = express.Router();
const { 
  confirmarEntrega, 
  getEntregasPorMotoboy, 
  getEntregasPorPedido, 
  getEntrega, 
  getAllEntregas 
} = require("../services/entregaService");

// Confirmar entrega
router.post("/confirmar", (req, res) => {
  try {
    const entrega = confirmarEntrega(req.body);
    if (entrega.error) {
      return res.status(400).json({ success: false, error: entrega.error });
    }
    res.json({ success: true, data: entrega });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver entregas do motoboy
router.get("/motoboy/:id", (req, res) => {
  try {
    const entregas = getEntregasPorMotoboy(req.params.id);
    res.json({ success: true, data: entregas });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver entregas do pedido
router.get("/pedido/:id", (req, res) => {
  try {
    const entregas = getEntregasPorPedido(req.params.id);
    res.json({ success: true, data: entregas });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver entrega específica
router.get("/:id", (req, res) => {
  try {
    const entrega = getEntrega(req.params.id);
    if (!entrega) {
      return res.status(404).json({ success: false, error: "Entrega não encontrada" });
    }
    res.json({ success: true, data: entrega });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Ver todas as entregas
router.get("/", (req, res) => {
  try {
    const entregas = getAllEntregas();
    res.json({ success: true, data: entregas });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
