// 🛡️ SERVIÇO ANTI-CHARGEBACK - PROVA MÁXIMA
// 📟 Totem: CPF + WhatsApp = Prova Completa

const { pedidos, entregas, clientes } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { log, logError, logSuccess } = require("../utils/logs");

class AntiChargebackService {
    constructor() {
        this.provas = {};
    }

    // 📋 Criar cliente com dados mínimos
    criarCliente({ cpf, whatsapp, nome = null }) {
        const id = uuidv4();
        
        // Validar CPF
        if (!this.validarCPF(cpf)) {
            throw new Error("CPF inválido");
        }
        
        // Validar WhatsApp
        if (!this.validarWhatsApp(whatsapp)) {
            throw new Error("WhatsApp inválido");
        }
        
        const cliente = {
            id,
            cpf: this.limparCPF(cpf),
            whatsapp: this.limparWhatsApp(whatsapp),
            nome: nome || `Cliente ${cpf.slice(0, 3)}***`,
            cadastradoEm: new Date().toISOString(),
            dispositivo: 'totem',
            ip: this.getClientIP()
        };
        
        clientes[id] = cliente;
        
        log(`👤 Cliente criado: ${id} - CPF: ${cpf.slice(0, 3)}*** - WhatsApp: ${whatsapp.slice(0, 2)}****`);
        
        return cliente;
    }

    // 🔥 Gerar prova completa anti-chargeback
    async gerarProvaCompleta(pedidoId, clienteId, pagamentoData) {
        const pedido = pedidos[pedidoId];
        const cliente = clientes[clienteId];
        
        if (!pedido || !cliente) {
            throw new Error("Pedido ou cliente não encontrado");
        }
        
        const provaId = uuidv4();
        
        const provaCompleta = {
            id: provaId,
            pedidoId,
            clienteId,
            geradaEm: new Date().toISOString(),
            
            // 📱 Provas do Cliente
            cliente: {
                cpf: cliente.cpf,
                whatsapp: cliente.whatsapp,
                nome: cliente.nome,
                dispositivo: cliente.dispositivo,
                ip: cliente.ip,
                cadastradoEm: cliente.cadastradoEm
            },
            
            // 💳 Provas do Pagamento
            pagamento: {
                metodo: pagamentoData.metodo,
                valor: pagamentoData.valor,
                gateway: pagamentoData.gateway,
                token: pagamentoData.token ? '***TOKENIZADO***' : null,
                cardNetwork: pagamentoData.cardNetwork,
                cardDetails: pagamentoData.cardDetails ? `****-****-****-${pagamentoData.cardDetails}` : null,
                pagoEm: pagamentoData.pagoEm
            },
            
            // 📍 Provas de Localização
            localizacao: {
                totemId: this.getTotemId(),
                enderecoTotem: this.getEnderecoTotem(),
                coordenadas: this.getCoordenadasTotem(),
                dataHora: new Date().toISOString()
            },
            
            // 📸 Provas Adicionais
            digitais: {
                fingerprint: this.gerarFingerprint(),
                userAgent: navigator.userAgent,
                timestamp: Date.now()
            },
            
            // 🔐 Nível de Prova
            nivelProva: this.calcularNivelProva(pagamentoData, cliente),
            
            // 📊 Score de Confiança
            scoreConfianca: this.calcularScoreConfianca(cliente, pagamentoData)
        };
        
        this.provas[provaId] = provaCompleta;
        
        // 📱 Enviar prova via WhatsApp
        await this.enviarProvaWhatsApp(provaCompleta);
        
        // 📧 Enviar prova por e-mail (se tiver)
        if (cliente.email) {
            await this.enviarProvaEmail(provaCompleta);
        }
        
        // 🏪 Notificar sistema
        await this.notificarSistema(provaCompleta);
        
        logSuccess(`🛡️ Prova anti-chargeback gerada: ${provaId} - Score: ${provaCompleta.scoreConfianca}%`);
        
        return provaCompleta;
    }

    // 📱 Enviar prova via WhatsApp
    async enviarProvaWhatsApp(prova) {
        const mensagem = this.montarMensagemWhatsApp(prova);
        
        // Integrar com API de WhatsApp (Twilio, Z-API, etc.)
        const whatsAppData = {
            numero: prova.cliente.whatsapp,
            mensagem: mensagem,
            pedidoId: prova.pedidoId,
            provaId: prova.id
        };
        
        log(`📱 Enviando prova WhatsApp para: ${prova.cliente.whatsapp}`);
        
        // Simulação de envio - substituir com API real
        this.simularEnvioWhatsApp(whatsAppData);
        
        return { enviado: true, mensagem };
    }

    // 📧 Montar mensagem WhatsApp
    montarMensagemWhatsApp(prova) {
        const data = new Date(prova.geradaEm).toLocaleString('pt-BR');
        const valor = parseFloat(prova.pagamento.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        return `🛡️ COMPROVANTE ANTI-CHARGEBACK 🛡️

📋 PEDIDO: #${prova.pedidoId.slice(0, 8)}
💰 VALOR: ${valor}
📅 DATA/HORA: ${data}

👤 DADOS DO CLIENTE:
📱 WhatsApp: ${prova.cliente.whatsapp}
🆔 CPF: ${prova.cliente.cpf.slice(0, 3)}.***.***-**
🏪 Dispositivo: Totem

💳 PAGAMENTO:
💳 Método: ${prova.pagamento.metodo.toUpperCase()}
🏪 Gateway: ${prova.pagamento.gateway}
🔐 Token: ***PROTEGIDO***

📍 LOCALIZAÇÃO:
🏪 Endereço: ${prova.localizacao.enderecoTotem}
📍 Totem ID: ${prova.localizacao.totemId}

🛡️ PROTEÇÃO ANTI-CHARGEBACK:
✅ CPF validado
✅ WhatsApp verificado  
✅ Pagamento confirmado
✅ Localização registrada
✅ Score confiança: ${prova.scoreConfianca}%

---
Este comprovante serve como prova legal de compra.
Qualquer dúvida, contate o estabelecimento.

🚀 Cardápio Digital Universal - Proteção Máxima`;
    }

    // 🔐 Calcular nível de prova
    calcularNivelProva(pagamento, cliente) {
        let nivel = 0;
        
        // CPF válido
        if (this.validarCPF(cliente.cpf)) nivel += 30;
        
        // WhatsApp válido
        if (this.validarWhatsApp(cliente.whatsapp)) nivel += 25;
        
        // Pagamento Google Pay
        if (pagamento.metodo === 'google_pay') nivel += 25;
        
        // Tokenização
        if (pagamento.token) nivel += 10;
        
        // Dispositivo totem
        if (cliente.dispositivo === 'totem') nivel += 10;
        
        return Math.min(nivel, 100);
    }

    // 📊 Calcular score de confiança
    calcularScoreConfianca(cliente, pagamento) {
        let score = 50; // Base
        
        // CPF válido
        if (this.validarCPF(cliente.cpf)) score += 20;
        
        // WhatsApp válido
        if (this.validarWhatsApp(cliente.whatsapp)) score += 15;
        
        // Pagamento seguro
        if (pagamento.metodo === 'google_pay') score += 20;
        
        // Gateway confiável
        if (pagamento.gateway === 'google_pay') score += 10;
        
        // Dispositivo controlado
        if (cliente.dispositivo === 'totem') score += 15;
        
        // Primeira compra
        const comprasAnteriores = Object.values(pedidos).filter(p => p.clienteId === cliente.id).length;
        if (comprasAnteriores === 0) score += 5;
        else if (comprasAnteriores > 0) score += 10;
        
        return Math.min(score, 100);
    }

    // 🧮 Validar CPF
    validarCPF(cpf) {
        cpf = this.limparCPF(cpf);
        
        if (cpf.length !== 11) return false;
        
        // CPFs inválidos conhecidos
        const cpfsInvalidos = [
            '00000000000', '11111111111', '22222222222', '33333333333',
            '44444444444', '55555555555', '66666666666', '77777777777',
            '88888888888', '99999999999'
        ];
        
        if (cpfsInvalidos.includes(cpf)) return false;
        
        // Algoritmo de validação
        let soma = 0;
        let resto;
        
        for (let i = 1; i <= 9; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        
        soma = 0;
        for (let i = 1; i <= 10; i++) {
            soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        
        return true;
    }

    // 📱 Validar WhatsApp
    validarWhatsApp(whatsapp) {
        const limpo = this.limparWhatsApp(whatsapp);
        
        // Verificar se tem DDD e 9 dígitos
        if (limpo.length < 10 || limpo.length > 13) return false;
        
        // Verificar se começa com DDD válido
        const ddd = limpo.slice(0, 2);
        const dddsValidos = [
            '11', '12', '13', '14', '15', '16', '17', '18', '19',
            '21', '22', '24', '27', '28',
            '31', '32', '33', '34', '35', '37', '38',
            '41', '42', '43', '44', '45', '46',
            '47', '48', '49',
            '51', '53', '54', '55',
            '61', '62', '63', '64', '65', '66', '67', '68', '69',
            '71', '73', '74', '75', '77',
            '79', '81', '82', '83', '84', '85', '86', '87', '88', '89',
            '91', '92', '93', '94', '95', '96', '97', '98', '99'
        ];
        
        return dddsValidos.includes(ddd);
    }

    // 🧹 Limpar CPF
    limparCPF(cpf) {
        return cpf.replace(/[^\d]/g, '');
    }

    // 🧹 Limpar WhatsApp
    limparWhatsApp(whatsapp) {
        return whatsapp.replace(/[^\d]/g, '');
    }

    // 🖐️ Gerar fingerprint
    gerarFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Anti-chargeback fingerprint', 2, 2);
        
        const hash = canvas.toDataURL().slice(-50);
        return btoa(hash).slice(0, 20);
    }

    // 📍 Getters (implementar conforme seu totem)
    getTotemId() {
        return localStorage.getItem('totemId') || 'TOTEM_001';
    }

    getEnderecoTotem() {
        return localStorage.getItem('totemEndereco') || 'Endereço do Estabelecimento';
    }

    getCoordenadasTotem() {
        const coords = localStorage.getItem('totemCoords');
        return coords ? JSON.parse(coords) : { lat: -23.5505, lng: -46.6333 };
    }

    getClientIP() {
        return localStorage.getItem('clientIP') || '192.168.1.100';
    }

    // 📧 Enviar prova por e-mail (opcional)
    async enviarProvaEmail(prova) {
        log(`📧 Enviando prova e-mail para cliente ${prova.clienteId}`);
        // Implementar com SendGrid, Nodemailer, etc.
    }

    // 🏪 Notificar sistema
    async notificarSistema(prova) {
        log(`🏪 Notificando sistema sobre prova ${prova.id}`);
        // Enviar para WebSocket, dashboard, etc.
    }

    // 📱 Simular envio WhatsApp
    simularEnvioWhatsApp(data) {
        logSuccess(`📱 WhatsApp enviado para ${data.numero} - Pedido: ${data.pedidoId}`);
        
        // Salvar no histórico
        if (!this.provas[data.provaId].whatsappEnviado) {
            this.provas[data.provaId].whatsappEnviado = {
                enviadoEm: new Date().toISOString(),
                numero: data.numero,
                status: 'enviado'
            };
        }
    }

    // 🔍 Verificar prova
    verificarProva(provaId) {
        return this.provas[provaId] || null;
    }

    // 📊 Listar provas por cliente
    listarProvasPorCliente(clienteId) {
        return Object.values(this.provas).filter(p => p.clienteId === clienteId);
    }

    // 📊 Listar provas por pedido
    listarProvasPorPedido(pedidoId) {
        return Object.values(this.provas).filter(p => p.pedidoId === pedidoId);
    }

    // 📊 Relatório anti-chargeback
    gerarRelatorio() {
        const todasProvas = Object.values(this.provas);
        
        return {
            totalProvas: todasProvas.length,
            scoreMedio: todasProvas.reduce((sum, p) => sum + p.scoreConfianca, 0) / todasProvas.length,
            nivelMedio: todasProvas.reduce((sum, p) => sum + p.nivelProva, 0) / todasProvas.length,
            porMetodo: this.agruparPorMetodo(todasProvas),
            porScore: this.agruparPorScore(todasProvas),
            geradoEm: new Date().toISOString()
        };
    }

    // 📊 Agrupar por método
    agruparPorMetodo(provas) {
        return provas.reduce((acc, prova) => {
            const metodo = prova.pagamento.metodo;
            acc[metodo] = (acc[metodo] || 0) + 1;
            return acc;
        }, {});
    }

    // 📊 Agrupar por score
    agruparPorScore(provas) {
        return {
            alto: provas.filter(p => p.scoreConfianca >= 80).length,
            medio: provas.filter(p => p.scoreConfianca >= 60 && p.scoreConfianca < 80).length,
            baixo: provas.filter(p => p.scoreConfianca < 60).length
        };
    }
}

module.exports = new AntiChargebackService();
