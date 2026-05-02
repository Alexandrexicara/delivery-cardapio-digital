// 🛡️ INTEGRAÇÃO ANTI-CHARGEBACK UNIVERSAL
// 📟 Funciona em: Totem, Cardápio, Delivery, Admin

class AntiChargebackIntegration {
    constructor() {
        this.clienteData = null;
        this.pedidoData = null;
        this.provaData = null;
        this.isInitialized = false;
    }

    // 🚀 Inicializar sistema
    async init() {
        try {
            console.log('🛡️ Inicializando sistema anti-chargeback...');
            
            // Verificar se estamos no totem
            if (this.isTotem()) {
                await this.initTotem();
            } else if (this.isDelivery()) {
                await this.initDelivery();
            } else if (this.isAdmin()) {
                await this.initAdmin();
            }
            
            this.isInitialized = true;
            console.log('✅ Sistema anti-chargeback inicializado');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar anti-chargeback:', error);
        }
    }

    // 📟 Verificar se é totem
    isTotem() {
        return window.location.pathname.includes('totem') || 
               localStorage.getItem('deviceType') === 'totem';
    }

    // 📱 Verificar se é delivery
    isDelivery() {
        return window.location.pathname.includes('delivery') || 
               window.location.pathname.includes('usuario');
    }

    // 🏪 Verificar se é admin
    isAdmin() {
        return window.location.pathname.includes('admin');
    }

    // 📟 Inicializar totem
    async initTotem() {
        console.log('📟 Inicializando anti-chargeback para totem...');
        
        // Adicionar validação de CPF/WhatsApp se não existir
        this.addTotemValidation();
        
        // Configurar dados do totem
        this.setupTotemData();
    }

    // 📱 Inicializar delivery
    async initDelivery() {
        console.log('📱 Inicializando anti-chargeback para delivery...');
        
        // Adicionar opção de cadastro rápido
        this.addDeliveryValidation();
    }

    // 🏪 Inicializar admin
    async initAdmin() {
        console.log('🏪 Inicializando anti-chargeback para admin...');
        
        // Adicionar dashboard de provas
        this.addAdminDashboard();
    }

    // 📋 Adicionar validação no totem
    addTotemValidation() {
        // Se já existe o formulário, não adiciona novamente
        if (document.getElementById('cpf')) {
            return;
        }
        
        // Procurar seção de pagamento
        const paymentSection = document.querySelector('.payment-methods') || 
                             document.querySelector('#payment-section') ||
                             document.querySelector('.payment-container');
        
        if (!paymentSection) {
            console.log('⚠️ Seção de pagamento não encontrada');
            return;
        }
        
        // Criar formulário de cadastro
        const formHTML = `
            <div class="anti-chargeback-form" style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="margin-bottom: 15px; color: #333;">🛡️ Proteção Anti-Chargeback</h3>
                <p style="margin-bottom: 15px; color: #666; font-size: 14px;">
                    Informe seus dados para proteção e receba o comprovante via WhatsApp:
                </p>
                
                <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group" style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">
                            🆔 CPF *
                        </label>
                        <input type="text" id="anti-cpf" placeholder="000.000.000-00" maxlength="14" 
                               style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 5px; font-size: 14px;">
                        <div id="cpf-validation" style="font-size: 12px; margin-top: 3px;"></div>
                    </div>
                    
                    <div class="form-group" style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #333;">
                            📱 WhatsApp *
                        </label>
                        <input type="tel" id="anti-whatsapp" placeholder="(00) 00000-0000" maxlength="15" 
                               style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 5px; font-size: 14px;">
                        <div id="whatsapp-validation" style="font-size: 12px; margin-top: 3px;"></div>
                    </div>
                </div>
                
                <div class="security-info" style="background: #e3f2fd; padding: 10px; border-radius: 5px; font-size: 12px; color: #1976d2;">
                    <strong>🔒 Por que precisamos disso?</strong><br>
                    • Validar sua identidade<br>
                    • Proteger contra chargeback<br>
                    • Enviar comprovante via WhatsApp
                </div>
            </div>
        `;
        
        // Inserir antes dos botões de pagamento
        const firstButton = paymentSection.querySelector('button');
        if (firstButton) {
            firstButton.insertAdjacentHTML('beforebegin', formHTML);
        } else {
            paymentSection.insertAdjacentHTML('afterbegin', formHTML);
        }
        
        // Adicionar eventos de validação
        this.addValidationEvents();
    }

    // 📱 Adicionar validação no delivery
    addDeliveryValidation() {
        // Procurar formulário de endereço ou checkout
        const checkoutForm = document.querySelector('#checkout-form') ||
                           document.querySelector('.checkout-form');
        
        if (!checkoutForm) {
            console.log('⚠️ Formulário de checkout não encontrado');
            return;
        }
        
        // Adicionar campos de CPF/WhatsApp
        const fieldsHTML = `
            <div class="anti-chargeback-fields" style="margin: 20px 0; padding: 15px; background: #f0f8ff; border-radius: 8px; border-left: 4px solid #2196f3;">
                <h4 style="margin-bottom: 10px; color: #1976d2;">🛡️ Proteção Anti-Chargeback (Opcional)</h4>
                <div style="display: flex; gap: 15px;">
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: bold;">CPF</label>
                        <input type="text" id="delivery-cpf" placeholder="000.000.000-00" maxlength="14" 
                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="flex: 1;">
                        <label style="display: block; margin-bottom: 5px; font-size: 14px; font-weight: bold;">WhatsApp</label>
                        <input type="tel" id="delivery-whatsapp" placeholder="(00) 00000-0000" maxlength="15" 
                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>
            </div>
        `;
        
        checkoutForm.insertAdjacentHTML('beforeend', fieldsHTML);
    }

    // 🏪 Adicionar dashboard no admin
    addAdminDashboard() {
        // Procurar seção de dashboard ou relatórios
        const dashboardSection = document.querySelector('#dashboard') ||
                               document.querySelector('.dashboard-section');
        
        if (!dashboardSection) {
            console.log('⚠️ Dashboard não encontrado');
            return;
        }
        
        // Adicionar cards de anti-chargeback
        const cardsHTML = `
            <div class="anti-chargeback-dashboard" style="margin: 20px 0;">
                <h3 style="margin-bottom: 15px; color: #333;">🛡️ Proteção Anti-Chargeback</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div class="stat-card" style="background: #e8f5e8; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #27ae60;" id="total-provas">0</div>
                        <div style="font-size: 14px; color: #666;">Total de Provas</div>
                    </div>
                    <div class="stat-card" style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #2196f3;" id="score-medio">0%</div>
                        <div style="font-size: 14px; color: #666;">Score Médio</div>
                    </div>
                    <div class="stat-card" style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #f57c00;" id="google-pay-count">0</div>
                        <div style="font-size: 14px; color: #666;">Google Pay</div>
                    </div>
                </div>
                
                <div style="margin-top: 15px;">
                    <button onclick="loadAntiChargebackData()" style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        📊 Carregar Dados
                    </button>
                </div>
            </div>
        `;
        
        dashboardSection.insertAdjacentHTML('afterbegin', cardsHTML);
        
        // Expor função global
        window.loadAntiChargebackData = () => this.loadDashboardData();
    }

    // 📋 Adicionar eventos de validação
    addValidationEvents() {
        const cpfInput = document.getElementById('anti-cpf');
        const whatsappInput = document.getElementById('anti-whatsapp');
        
        if (!cpfInput || !whatsappInput) {
            return;
        }
        
        // Validação de CPF
        cpfInput.addEventListener('input', async (e) => {
            const cpf = this.formatCPF(e.target.value);
            e.target.value = cpf;
            
            const validationDiv = document.getElementById('cpf-validation');
            
            if (cpf.length === 14) {
                try {
                    const response = await fetch('/anti-chargeback/validar-cpf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cpf })
                    });
                    
                    const result = await response.json();
                    
                    if (result.data.valido) {
                        e.target.style.borderColor = '#27ae60';
                        validationDiv.innerHTML = '<span style="color: #27ae60;">✅ CPF válido</span>';
                    } else {
                        e.target.style.borderColor = '#e74c3c';
                        validationDiv.innerHTML = '<span style="color: #e74c3c;">❌ CPF inválido</span>';
                    }
                } catch (error) {
                    console.error('Erro ao validar CPF:', error);
                }
            } else {
                e.target.style.borderColor = '#e0e0e0';
                validationDiv.innerHTML = '';
            }
        });
        
        // Validação de WhatsApp
        whatsappInput.addEventListener('input', async (e) => {
            const whatsapp = this.formatWhatsApp(e.target.value);
            e.target.value = whatsapp;
            
            const validationDiv = document.getElementById('whatsapp-validation');
            
            if (whatsapp.length >= 14) {
                try {
                    const response = await fetch('/anti-chargeback/validar-whatsapp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ whatsapp })
                    });
                    
                    const result = await response.json();
                    
                    if (result.data.valido) {
                        e.target.style.borderColor = '#27ae60';
                        validationDiv.innerHTML = '<span style="color: #27ae60;">✅ WhatsApp válido</span>';
                    } else {
                        e.target.style.borderColor = '#e74c3c';
                        validationDiv.innerHTML = '<span style="color: #e74c3c;">❌ WhatsApp inválido</span>';
                    }
                } catch (error) {
                    console.error('Erro ao validar WhatsApp:', error);
                }
            } else {
                e.target.style.borderColor = '#e0e0e0';
                validationDiv.innerHTML = '';
            }
        });
    }

    // 🧹 Formatar CPF
    formatCPF(cpf) {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length <= 11) {
            cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return cpf;
    }

    // 📱 Formatar WhatsApp
    formatWhatsApp(whatsapp) {
        whatsapp = whatsapp.replace(/\D/g, '');
        if (whatsapp.length <= 11) {
            whatsapp = whatsapp.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return whatsapp;
    }

    // 📊 Carregar dados do dashboard
    async loadDashboardData() {
        try {
            const response = await fetch('/anti-chargeback/relatorio');
            const result = await response.json();
            
            if (result.success) {
                const data = result.data;
                
                // Atualizar cards
                document.getElementById('total-provas').textContent = data.totalProvas;
                document.getElementById('score-medio').textContent = Math.round(data.scoreMedio) + '%';
                document.getElementById('google-pay-count').textContent = data.porMetodo['google_pay'] || 0;
                
                console.log('📊 Dados anti-chargeback carregados:', data);
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados:', error);
        }
    }

    // 🔥 Processar pedido com proteção
    async processarPedidoComProva(pedidoData, pagamentoData) {
        try {
            // Verificar se tem dados do cliente
            const cpfInput = document.getElementById('anti-cpf') || document.getElementById('delivery-cpf');
            const whatsappInput = document.getElementById('anti-whatsapp') || document.getElementById('delivery-whatsapp');
            
            if (!cpfInput || !whatsappInput) {
                console.log('⚠️ Dados anti-chargeback não encontrados');
                return null;
            }
            
            const cpf = cpfInput.value;
            const whatsapp = whatsappInput.value;
            
            // Validar se estão preenchidos
            if (cpf.length !== 14 || whatsapp.length < 14) {
                console.log('⚠️ Dados incompletos para proteção anti-chargeback');
                return null;
            }
            
            // Criar cliente
            const clienteResponse = await fetch('/anti-chargeback/cliente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, whatsapp })
            });
            
            const clienteResult = await clienteResponse.json();
            
            if (!clienteResult.success) {
                throw new Error(clienteResult.error);
            }
            
            // Processar pedido com prova
            const pedidoResponse = await fetch('/anti-chargeback/processar-pedido', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clienteId: clienteResult.data.id,
                    carrinho: pedidoData.carrinho || [],
                    valorTotal: pedidoData.valor,
                    metodoPagamento: pagamentoData.metodo,
                    pagamentoData: pagamentoData
                })
            });
            
            const pedidoResult = await pedidoResponse.json();
            
            if (pedidoResult.success) {
                console.log('🛡️ Pedido com prova anti-chargeback processado:', pedidoResult.data);
                return pedidoResult.data;
            } else {
                throw new Error(pedidoResult.error);
            }
            
        } catch (error) {
            console.error('❌ Erro ao processar pedido com prova:', error);
            return null;
        }
    }

    // 📍 Configurar dados do totem
    setupTotemData() {
        // Configurar dados do totem se não existirem
        if (!localStorage.getItem('totemId')) {
            localStorage.setItem('totemId', 'TOTEM_001');
        }
        
        if (!localStorage.getItem('totemEndereco')) {
            localStorage.setItem('totemEndereco', 'Endereço do Estabelecimento');
        }
        
        if (!localStorage.getItem('totemCoords')) {
            localStorage.setItem('totemCoords', JSON.stringify({ lat: -23.5505, lng: -46.6333 }));
        }
    }

    // 🔍 Verificar se cliente pode prosseguir
    podeProsseguir() {
        const cpfInput = document.getElementById('anti-cpf') || document.getElementById('delivery-cpf');
        const whatsappInput = document.getElementById('anti-whatsapp') || document.getElementById('delivery-whatsapp');
        
        if (!cpfInput || !whatsappInput) {
            return true; // Não é obrigatório
        }
        
        const cpfValid = cpfInput.style.borderColor === 'rgb(39, 174, 96)';
        const whatsappValid = whatsappInput.style.borderColor === 'rgb(39, 174, 96)';
        
        // Se for totem, é obrigatório
        if (this.isTotem()) {
            return cpfValid && whatsappValid;
        }
        
        // Se for delivery, é opcional
        return true;
    }

    // 📋 Obter dados do cliente
    getClienteData() {
        const cpfInput = document.getElementById('anti-cpf') || document.getElementById('delivery-cpf');
        const whatsappInput = document.getElementById('anti-whatsapp') || document.getElementById('delivery-whatsapp');
        const nomeInput = document.getElementById('nome') || document.getElementById('delivery-nome');
        
        if (!cpfInput || !whatsappInput) {
            return null;
        }
        
        return {
            cpf: cpfInput.value,
            whatsapp: whatsappInput.value,
            nome: nomeInput ? nomeInput.value : null
        };
    }
}

// 🚀 Inicializar automaticamente
document.addEventListener('DOMContentLoaded', async () => {
    const antiChargeback = new AntiChargebackIntegration();
    await antiChargeback.init();
    
    // Expor globalmente
    window.antiChargeback = antiChargeback;
    
    console.log('✅ Sistema anti-chargeback pronto!');
});

// 🎯 Funções auxiliares globais
window.verificarAntiChargeback = function() {
    return window.antiChargeback?.podeProsseguir() || true;
};

window.getDadosAntiChargeback = function() {
    return window.antiChargeback?.getClienteData() || null;
};

window.processarComProtecao = async function(pedidoData, pagamentoData) {
    return await window.antiChargeback?.processarPedidoComProva(pedidoData, pagamentoData);
};
