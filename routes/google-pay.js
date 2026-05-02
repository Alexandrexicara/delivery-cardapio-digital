const express = require("express");
const router = express.Router();
const { 
  criarPedido, 
  pagarPix, 
  pagarCartao,
  verSaldoVendedor,
  verSaldoMotoboy
} = require("../services/pagamentoService");
const { log, logError, logSuccess } = require("../utils/logs");

// Processar pagamento Google Pay
router.post("/", async (req, res) => {
  try {
    const { paymentData, valor, metodo, carrinho, cliente } = req.body;
    
    log(`🚀 Google Pay - Iniciando processamento`);
    log(`📊 Google Pay - Valor: R$${valor}`);
    log(`📦 Google Pay - Itens: ${carrinho?.length || 0}`);
    
    // Validar dados recebidos
    if (!paymentData || !valor) {
      return res.status(400).json({ 
        success: false, 
        error: "Dados de pagamento incompletos" 
      });
    }
    
    // Extrair informações do cartão do Google Pay
    const tokenizedCard = paymentData.paymentMethodData.tokenizationData.token;
    const cardInfo = paymentData.paymentMethodData.info;
    
    log(`💳 Google Pay - Cartão tokenizado: ${tokenizedCard ? 'SIM' : 'NÃO'}`);
    log(`🏷️ Google Pay - Bandeira: ${cardInfo?.cardNetwork || 'N/A'}`);
    log(`🔢 Google Pay - Últimos dígitos: ${cardInfo?.cardDetails || 'N/A'}`);
    
    // Criar pedido no sistema
    const pedido = criarPedido({
      vendedorId: "v1", // Pode vir do cliente logado
      motoboyId: "m1", // Pode ser atribuído automaticamente
      valor: parseFloat(valor),
      metodo: "google_pay"
    });
    
    // Adicionar informações do Google Pay ao pedido
    pedido.googlePayData = {
      token: tokenizedCard,
      cardNetwork: cardInfo?.cardNetwork,
      cardDetails: cardInfo?.cardDetails,
      paymentMethodData: paymentData.paymentMethodData
    };
    
    // Marcar como pago (Google Pay já validou)
    pedido.status = "pago_google_pay";
    pedido.paidAt = new Date().toISOString();
    pedido.paymentGateway = "google_pay";
    
    // Processar como pagamento PIX (dinheiro disponível na hora)
    const resultadoPagamento = pagarPix(pedido.id);
    
    logSuccess(`✅ Google Pay - Pagamento processado com sucesso`);
    log(`💰 Google Pay - Vendedor recebe: R$${resultadoPagamento.vendedorRecebe}`);
    log(`🛵 Google Pay - Motoboy recebe: R$${resultadoPagamento.motoboyRecebe}`);
    
    res.json({ 
      success: true, 
      data: {
        pedido: pedido,
        pagamento: resultadoPagamento,
        mensagem: "Pagamento Google Pay processado com sucesso!"
      }
    });
    
  } catch (error) {
    logError(`❌ Google Pay - Erro no processamento: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: "Erro ao processar pagamento Google Pay" 
    });
  }
});

// Verificar status de pagamento Google Pay
router.get("/status/:pedidoId", (req, res) => {
  try {
    const { pedidos } = require("../db");
    const pedido = pedidos[req.params.pedidoId];
    
    if (!pedido) {
      return res.status(404).json({ 
        success: false, 
        error: "Pedido não encontrado" 
      });
    }
    
    res.json({ 
      success: true, 
      data: {
        pedidoId: pedido.id,
        status: pedido.status,
        metodo: pedido.metodo,
        valor: pedido.valor,
        pagoEm: pedido.paidAt,
        googlePayData: pedido.googlePayData ? {
          cardNetwork: pedido.googlePayData.cardNetwork,
          cardDetails: pedido.googlePayData.cardDetails
        } : null
      }
    });
    
  } catch (error) {
    logError(`❌ Google Pay - Erro ao verificar status: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: "Erro ao verificar status do pagamento" 
    });
  }
});

// Estornar pagamento Google Pay
router.post("/estornar/:pedidoId", (req, res) => {
  try {
    const { pedidos } = require("../db");
    const pedido = pedidos[req.params.pedidoId];
    
    if (!pedido) {
      return res.status(404).json({ 
        success: false, 
        error: "Pedido não encontrado" 
      });
    }
    
    if (pedido.status !== "pago_google_pay") {
      return res.status(400).json({ 
        success: false, 
        error: "Pedido não foi pago com Google Pay" 
      });
    }
    
    // Marcar como estornado
    pedido.status = "estornado_google_pay";
    pedido.estornadoAt = new Date().toISOString();
    pedido.motivoEstorno = req.body.motivo || "Solicitado pelo cliente";
    
    log(`🔄 Google Pay - Pedido estornado: ${pedido.id} - Motivo: ${pedido.motivoEstorno}`);
    
    res.json({ 
      success: true, 
      data: {
        pedidoId: pedido.id,
        status: pedido.status,
        estornadoEm: pedido.estornadoAt,
        motivo: pedido.motivoEstorno,
        mensagem: "Pagamento estornado com sucesso"
      }
    });
    
  } catch (error) {
    logError(`❌ Google Pay - Erro ao estornar: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: "Erro ao estornar pagamento" 
    });
  }
});

// Configuração do Google Pay para frontend
router.get("/config", (req, res) => {
  try {
    const config = {
      environment: process.env.GOOGLE_PAY_ENV || 'TEST',
      merchantId: process.env.GOOGLE_PAY_MERCHANT_ID || 'SEU_MERCHANT_ID',
      gatewayMerchantId: process.env.GATEWAY_MERCHANT_ID || 'SEU_GATEWAY_ID',
      gateway: process.env.PAYMENT_GATEWAY || 'mercadopago',
      allowedCardNetworks: ['VISA', 'MASTERCARD', 'ELO', 'HIPERCARD'],
      currencyCode: 'BRL',
      countryCode: 'BR'
    };
    
    log(`🔧 Google Pay - Configuração enviada para frontend`);
    
    res.json({ 
      success: true, 
      data: config 
    });
    
  } catch (error) {
    logError(`❌ Google Pay - Erro na configuração: ${error.message}`);
    res.status(500).json({ 
      success: false, 
      error: "Erro na configuração do Google Pay" 
    });
  }
});

module.exports = router;
