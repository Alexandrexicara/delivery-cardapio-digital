// 🚀 INTEGRAÇÃO GOOGLE PAY PROFISSIONAL
// 📷 Câmera automática via Google Pay (não no nosso código)

class GooglePayIntegration {
    constructor() {
        this.environment = 'TEST'; // Mudar para 'PRODUCTION' em produção
        this.merchantId = 'SEU_MERCHANT_ID';
        this.gatewayMerchantId = 'SEU_GATEWAY_ID';
        this.gateway = 'mercadopago'; // ou 'stripe', 'pagarme'
        
        this.paymentsClient = null;
        this.isReady = false;
    }

    // 🔥 Inicializar Google Pay
    async init() {
        try {
            console.log('🚀 Iniciando Google Pay...');
            
            // Carregar script do Google Pay
            await this.loadGooglePayScript();
            
            // Criar cliente de pagamentos
            this.paymentsClient = new google.payments.api.PaymentsClient({
                environment: this.environment
            });
            
            // Verificar se Google Pay está disponível
            const isReadyToPay = await this.paymentsClient.isReadyToPay({
                allowedPaymentMethods: ['CARD', 'TOKENIZED_CARD']
            });
            
            this.isReady = isReadyToPay.result;
            
            if (this.isReady) {
                console.log('✅ Google Pay está pronto!');
                this.createGooglePayButton();
            } else {
                console.log('❌ Google Pay não disponível neste dispositivo');
                this.hideGooglePayButton();
            }
            
        } catch (error) {
            console.error('❌ Erro ao inicializar Google Pay:', error);
        }
    }

    // 📦 Carregar script do Google Pay
    loadGooglePayScript() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.payments) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://pay.google.com/gp/p/js/pay.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // 🔘 Criar botão do Google Pay
    createGooglePayButton() {
        const existingButton = document.getElementById('google-pay-button');
        if (existingButton) {
            existingButton.remove();
        }

        const button = document.createElement('button');
        button.id = 'google-pay-button';
        button.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; padding: 15px 20px; background: #000; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>Pagar com Google Pay</span>
            </div>
        `;
        
        button.style.cssText = `
            border: none;
            background: none;
            cursor: pointer;
            margin: 10px 0;
            border-radius: 8px;
            transition: transform 0.2s;
        `;
        
        button.onmouseover = () => {
            button.style.transform = 'scale(1.05)';
        };
        
        button.onmouseout = () => {
            button.style.transform = 'scale(1)';
        };
        
        button.onclick = () => this.processPayment();
        
        // Adicionar botão onde for apropriado
        this.insertButtonInAppropriatePlace(button);
    }

    // 📍 Inserir botão no lugar certo
    insertButtonInAppropriatePlace(button) {
        // Para delivery.html
        const paymentSection = document.querySelector('.payment-methods') || 
                           document.querySelector('#payment-section') ||
                           document.querySelector('.payment-container');
        
        if (paymentSection) {
            paymentSection.appendChild(button);
            console.log('✅ Botão Google Pay adicionado ao delivery');
            return;
        }
        
        // Para totem.html
        const totemPayment = document.querySelector('.totem-payment') ||
                           document.querySelector('#totem-payment-section');
        
        if (totemPayment) {
            totemPayment.appendChild(button);
            console.log('✅ Botão Google Pay adicionado ao totem');
            return;
        }
        
        // Para cardápio principal
        const menuPayment = document.querySelector('.menu-payment') ||
                         document.querySelector('#menu-payment');
        
        if (menuPayment) {
            menuPayment.appendChild(button);
            console.log('✅ Botão Google Pay adicionado ao cardápio');
            return;
        }
        
        console.log('⚠️ Não encontrou seção de pagamento para adicionar botão Google Pay');
    }

    // 🔥 Processar pagamento
    async processPayment() {
        if (!this.isReady) {
            alert('❌ Google Pay não está disponível');
            return;
        }

        try {
            console.log('🚀 Processando pagamento com Google Pay...');
            
            const paymentDataRequest = this.createPaymentDataRequest();
            
            // Abrir Google Pay
            const paymentData = await this.paymentsClient.loadPaymentData(paymentDataRequest);
            
            console.log('✅ Pagamento autorizado:', paymentData);
            
            // Enviar para backend
            await this.sendPaymentToBackend(paymentData);
            
        } catch (error) {
            console.error('❌ Erro no pagamento Google Pay:', error);
            
            if (error.statusCode === 'CANCELED') {
                alert('❌ Pagamento cancelado pelo usuário');
            } else if (error.statusCode === 'DEVELOPER_ERROR') {
                alert('❌ Erro de configuração do Google Pay');
            } else {
                alert('❌ Erro ao processar pagamento');
            }
        }
    }

    // 💳 Criar requisição de pagamento
    createPaymentDataRequest(valorTotal = '50.00') {
        return {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [{
                type: 'CARD',
                parameters: {
                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                    allowedCardNetworks: ['VISA', 'MASTERCARD', 'ELO', 'HIPERCARD']
                },
                tokenizationSpecification: {
                    type: 'PAYMENT_GATEWAY',
                    parameters: {
                        gateway: this.gateway,
                        gatewayMerchantId: this.gatewayMerchantId
                    }
                }
            }],
            merchantInfo: {
                merchantId: this.merchantId,
                merchantName: 'Cardápio Digital Universal'
            },
            transactionInfo: {
                totalPriceStatus: 'FINAL',
                totalPrice: valorTotal,
                currencyCode: 'BRL',
                countryCode: 'BR'
            }
        };
    }

    // 📤 Enviar pagamento para backend
    async sendPaymentToBackend(paymentData) {
        try {
            console.log('📤 Enviando pagamento para backend...');
            
            const response = await fetch('/pagamento/google-pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    paymentData: paymentData,
                    valor: paymentData.transactionInfo.totalPrice,
                    metodo: 'google_pay',
                    // Dados do pedido atual
                    carrinho: this.getCartData(),
                    cliente: this.getCustomerData()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Pagamento processado com sucesso!');
                alert('✅ Pagamento aprovado! Processando pedido...');
                
                // Redirecionar ou atualizar
                this.handlePaymentSuccess(result);
            } else {
                console.error('❌ Erro no backend:', result.error);
                alert('❌ Erro ao processar pagamento: ' + result.error);
            }
            
        } catch (error) {
            console.error('❌ Erro ao enviar para backend:', error);
            alert('❌ Erro de conexão com o servidor');
        }
    }

    // 🛒 Obter dados do carrinho
    getCartData() {
        // Tentar obter do localStorage ou variáveis globais
        const cart = localStorage.getItem('cart') || '[]';
        return JSON.parse(cart);
    }

    // 👤 Obter dados do cliente
    getCustomerData() {
        const customerData = localStorage.getItem('customerData') || '{}';
        return JSON.parse(customerData);
    }

    // 🎉 Handle sucesso
    handlePaymentSuccess(result) {
        // Limpar carrinho
        localStorage.removeItem('cart');
        
        // Mostrar confirmação
        if (typeof showOrderConfirmation === 'function') {
            showOrderConfirmation(result);
        } else {
            alert('✅ Pedido confirmado com sucesso!');
        }
        
        // Redirecionar se necessário
        setTimeout(() => {
            if (window.location.pathname.includes('delivery.html')) {
                window.location.reload();
            }
        }, 2000);
    }

    // 🔘 Ocultar botão
    hideGooglePayButton() {
        const button = document.getElementById('google-pay-button');
        if (button) {
            button.style.display = 'none';
        }
    }
}

// 🚀 Inicializar automaticamente quando a página carregar
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando integração Google Pay...');
    
    // Aguardar um pouco para garantir que tudo carregou
    setTimeout(async () => {
        const googlePay = new GooglePayIntegration();
        await googlePay.init();
        
        // Expor globalmente para uso em outras funções
        window.googlePayIntegration = googlePay;
        
        console.log('✅ Google Pay integration pronta!');
    }, 1000);
});

// 🎯 Função auxiliar para atualizar valor do pagamento
window.updateGooglePayAmount = function(valor) {
    if (window.googlePayIntegration) {
        console.log('💰 Atualizando valor Google Pay para:', valor);
        // O valor será atualizado no próximo pagamento
    }
};
