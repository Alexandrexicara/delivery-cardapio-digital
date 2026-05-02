const express = require("express");
const router = express.Router();
const antiChargebackService = require("../services/antiChargebackService");
const { criarPedido, pagarPix, pagarCartao } = require("../services/pagamentoService");
const { log, logError, logSuccess } = require("../utils/logs");

// 📋 Criar cliente no totem
router.post("/cliente", async (req, res) => {
    try {
        const { cpf, whatsapp, nome } = req.body;
        
        log(`👤 Criando cliente no totem - CPF: ${cpf?.slice(0, 3)}***`);
        
        if (!cpf || !whatsapp) {
            return res.status(400).json({ 
                success: false, 
                error: "CPF e WhatsApp são obrigatórios" 
            });
        }
        
        const cliente = antiChargebackService.criarCliente({ cpf, whatsapp, nome });
        
        logSuccess(`✅ Cliente criado: ${cliente.id}`);
        
        res.json({ 
            success: true, 
            data: cliente 
        });
        
    } catch (error) {
        logError(`❌ Erro ao criar cliente: ${error.message}`);
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// 🔥 Processar pedido com prova anti-chargeback
router.post("/processar-pedido", async (req, res) => {
    try {
        const { 
            clienteId, 
            carrinho, 
            valorTotal, 
            metodoPagamento,
            pagamentoData,
            enderecoEntrega = null 
        } = req.body;
        
        log(`🛡️ Processando pedido com prova anti-chargeback - Cliente: ${clienteId}`);
        
        // 1. Criar pedido no sistema
        const pedido = criarPedido({
            vendedorId: "v1",
            motoboyId: enderecoEntrega ? "m1" : null,
            valor: parseFloat(valorTotal),
            metodo: metodoPagamento,
            clienteId: clienteId,
            carrinho: carrinho,
            enderecoEntrega: enderecoEntrega
        });
        
        // 2. Processar pagamento
        let resultadoPagamento;
        if (metodoPagamento === 'google_pay') {
            resultadoPagamento = await pagarPix(pedido.id);
        } else if (metodoPagamento === 'pix') {
            resultadoPagamento = await pagarPix(pedido.id);
        } else if (metodoPagamento === 'cartao') {
            resultadoPagamento = await pagarCartao(pedido.id);
        }
        
        // 3. Gerar prova completa anti-chargeback
        const prova = await antiChargebackService.gerarProvaCompleta(
            pedido.id, 
            clienteId, 
            {
                metodo: metodoPagamento,
                valor: valorTotal,
                gateway: pagamentoData?.gateway || 'google_pay',
                token: pagamentoData?.token,
                cardNetwork: pagamentoData?.cardNetwork,
                cardDetails: pagamentoData?.cardDetails,
                pagoEm: new Date().toISOString()
            }
        );
        
        // 4. Adicionar prova ao pedido
        pedido.antiChargebackProva = prova;
        
        logSuccess(`🛡️ Pedido com prova anti-chargeback processado: ${pedido.id}`);
        
        res.json({ 
            success: true, 
            data: {
                pedido: pedido,
                pagamento: resultadoPagamento,
                antiChargeback: prova,
                mensagem: "Pedido processado com proteção anti-chargeback completa!"
            }
        });
        
    } catch (error) {
        logError(`❌ Erro ao processar pedido anti-chargeback: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao processar pedido com proteção anti-chargeback" 
        });
    }
});

// 🔍 Verificar prova específica
router.get("/prova/:provaId", (req, res) => {
    try {
        const prova = antiChargebackService.verificarProva(req.params.provaId);
        
        if (!prova) {
            return res.status(404).json({ 
                success: false, 
                error: "Prova não encontrada" 
            });
        }
        
        res.json({ 
            success: true, 
            data: prova 
        });
        
    } catch (error) {
        logError(`❌ Erro ao verificar prova: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao verificar prova" 
        });
    }
});

// 📊 Listar provas por cliente
router.get("/cliente/:clienteId/provas", (req, res) => {
    try {
        const provas = antiChargebackService.listarProvasPorCliente(req.params.clienteId);
        
        res.json({ 
            success: true, 
            data: provas 
        });
        
    } catch (error) {
        logError(`❌ Erro ao listar provas do cliente: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao listar provas do cliente" 
        });
    }
});

// 📊 Listar provas por pedido
router.get("/pedido/:pedidoId/provas", (req, res) => {
    try {
        const provas = antiChargebackService.listarProvasPorPedido(req.params.pedidoId);
        
        res.json({ 
            success: true, 
            data: provas 
        });
        
    } catch (error) {
        logError(`❌ Erro ao listar provas do pedido: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao listar provas do pedido" 
        });
    }
});

// 📊 Relatório completo anti-chargeback
router.get("/relatorio", (req, res) => {
    try {
        const relatorio = antiChargebackService.gerarRelatorio();
        
        res.json({ 
            success: true, 
            data: relatorio 
        });
        
    } catch (error) {
        logError(`❌ Erro ao gerar relatório: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao gerar relatório" 
        });
    }
});

// 📱 Reenviar prova WhatsApp
router.post("/prova/:provaId/whatsapp", async (req, res) => {
    try {
        const prova = antiChargebackService.verificarProva(req.params.provaId);
        
        if (!prova) {
            return res.status(404).json({ 
                success: false, 
                error: "Prova não encontrada" 
            });
        }
        
        // Reenviar WhatsApp
        const resultado = await antiChargebackService.enviarProvaWhatsApp(prova);
        
        logSuccess(`📱 Prova WhatsApp reenviada: ${req.params.provaId}`);
        
        res.json({ 
            success: true, 
            data: resultado 
        });
        
    } catch (error) {
        logError(`❌ Erro ao reenviar WhatsApp: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao reenviar prova WhatsApp" 
        });
    }
});

// 🔍 Validar CPF
router.post("/validar-cpf", (req, res) => {
    try {
        const { cpf } = req.body;
        
        if (!cpf) {
            return res.status(400).json({ 
                success: false, 
                error: "CPF é obrigatório" 
            });
        }
        
        const valido = antiChargebackService.validarCPF(cpf);
        
        res.json({ 
            success: true, 
            data: { 
                cpf: cpf,
                valido: valido,
                mensagem: valido ? "CPF válido" : "CPF inválido"
            }
        });
        
    } catch (error) {
        logError(`❌ Erro ao validar CPF: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao validar CPF" 
        });
    }
});

// 📱 Validar WhatsApp
router.post("/validar-whatsapp", (req, res) => {
    try {
        const { whatsapp } = req.body;
        
        if (!whatsapp) {
            return res.status(400).json({ 
                success: false, 
                error: "WhatsApp é obrigatório" 
            });
        }
        
        const valido = antiChargebackService.validarWhatsApp(whatsapp);
        
        res.json({ 
            success: true, 
            data: { 
                whatsapp: whatsapp,
                valido: valido,
                mensagem: valido ? "WhatsApp válido" : "WhatsApp inválido"
            }
        });
        
    } catch (error) {
        logError(`❌ Erro ao validar WhatsApp: ${error.message}`);
        res.status(500).json({ 
            success: false, 
            error: "Erro ao validar WhatsApp" 
        });
    }
});

module.exports = router;
