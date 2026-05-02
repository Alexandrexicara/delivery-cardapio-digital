// MyGateway Integration para Totem
// Sistema de Pagamentos com Split Automático

class MyGatewayIntegration {
    constructor() {
        this.apiKey = 'SEU_API_KEY_MYGATEWAY';
        this.baseURL = 'https://api.mygateway.com/v1';
        this.merchantId = null; // COMERCIANTE/Admin (quem vende)
        this.motoboyId = null; // Motoboy (quem entrega)
        this.creatorId = null; // Criador (dono da plataforma)
        
        // DIVISÃO DO PAGAMENTO
        this.plataformaPercent = 10; // 10% para plataforma/criador
        this.motoboyPercent = 25;    // 25% para motoboy
        // COMERCIANTE fica com: 100% - 10% - 25% = 65%
    }

    // 1️⃣ Criar Conta do Comerciante
    async criarContaComerciante(dadosComerciante) {
        try {
            console.log('[MyGateway] Criando conta do comerciante...');
            
            const response = await fetch(`${this.baseURL}/merchants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    name: dadosComerciante.nome,
                    document: dadosComerciante.cnpj,
                    bankAccount: {
                        bank: dadosComerciante.banco,
                        agency: dadosComerciante.agencia,
                        account: dadosComerciante.conta,
                        accountType: dadosComerciante.tipoConta
                    },
                    commission: {
                        plataformaPercent: this.plataformaPercent,
                        motoboyPercent: this.motoboyPercent
                    }
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('[MyGateway] Conta do comerciante criada:', data.merchantId);
                this.merchantId = data.merchantId;
                return data.merchantId;
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            console.error('[MyGateway] Erro ao criar conta comerciante:', error);
            throw error;
        }
    }

    // 2️⃣ Criar Conta do Motoboy
    async criarContaMotoboy(dadosMotoboy) {
        try {
            console.log('[MyGateway] Criando conta do motoboy...');
            
            const response = await fetch(`${this.baseURL}/motoboys`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    name: dadosMotoboy.nome,
                    document: dadosMotoboy.cpf,
                    bankAccount: {
                        bank: dadosMotoboy.banco,
                        agency: dadosMotoboy.agencia,
                        account: dadosMotoboy.conta,
                        accountType: 'CORRENTE'
                    },
                    contact: {
                        phone: dadosMotoboy.telefone,
                        email: dadosMotoboy.email
                    }
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('[MyGateway] Conta do motoboy criada:', data.motoboyId);
                this.motoboyId = data.motoboyId;
                return data.motoboyId;
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            console.error('[MyGateway] Erro ao criar conta motoboy:', error);
            throw error;
        }
    }

    // 3️⃣ Criar Conta do Criador (Dono da Plataforma)
    async criarContaCriador(dadosCriador) {
        try {
            console.log('[MyGateway] Criando conta do criador...');
            
            const response = await fetch(`${this.baseURL}/creators`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    name: dadosCriador.nome,
                    document: dadosCriador.cpf || dadosCriador.cnpj,
                    bankAccount: {
                        bank: dadosCriador.banco,
                        agency: dadosCriador.agencia,
                        account: dadosCriador.conta,
                        accountType: dadosCriador.tipoConta
                    },
                    contact: {
                        phone: dadosCriador.telefone,
                        email: dadosCriador.email
                    },
                    role: 'CREATOR'
                })
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('[MyGateway] Conta do criador criada:', data.creatorId);
                this.creatorId = data.creatorId;
                return data.creatorId;
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            console.error('[MyGateway] Erro ao criar conta criador:', error);
            throw error;
        }
    }

    // 3️⃣ Processar Pagamento com Split
    async processarPagamento(pedido) {
        try {
            console.log('[MyGateway] 🏪 COMERCIANTE vai receber e dividir...');
            
            // Calcular divisões
            const valorTotal = pedido.total;
            const valorMotoboy = (valorTotal * this.motoboyPercent) / 100;
            const valorCriador = (valorTotal * this.plataformaPercent) / 100;
            const valorComerciante = valorTotal - valorMotoboy - valorCriador;
            
            console.log(`[MyGateway] 💰 DIVISÃO DO COMERCIANTE:`);
            console.log(`  💵 Cliente pagou: R$ ${valorTotal.toFixed(2)}`);
            console.log(`  🏪 COMERCIANTE recebe: R$ ${valorComerciante.toFixed(2)} (${((valorComerciante/valorTotal)*100).toFixed(0)}%)`);
            console.log(`  🏍️ Motoboy recebe: R$ ${valorMotoboy.toFixed(2)} (${this.motoboyPercent}%)`);
            console.log(`  👨‍💻 Criador recebe: R$ ${valorCriador.toFixed(2)} (${this.plataformaPercent}%)`);
            
            const paymentData = {
                merchantId: this.merchantId, // COMERCIANTE é quem processa
                amount: valorTotal,
                paymentMethod: pedido.metodoPagamento, // 'pix' ou 'cartao'
                customer: {
                    name: pedido.cliente.nome,
                    email: pedido.cliente.email,
                    phone: pedido.cliente.telefone
                },
                splits: [
                    {
                        accountId: this.motoboyId || pedido.motoboyId,
                        type: 'PERCENTAGE',
                        value: this.motoboyPercent
                    },
                    {
                        accountId: this.creatorId,
                        type: 'PERCENTAGE', 
                        value: this.plataformaPercent
                    }
                    // COMERCIANTE fica com o restante automaticamente
                ]
            };

            // Taxas MyGateway
            const taxa = pedido.metodoPagamento === 'pix' ? 0.99 : 1.0;
            paymentData.fee = taxa;

            const response = await fetch(`${this.baseURL}/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            
            if (data.success) {
                console.log('[MyGateway] Pagamento processado:', data.transactionId);
                return {
                    success: true,
                    transactionId: data.transactionId,
                    pixCode: data.pixCode, // Se for PIX
                    redirectUrl: data.redirectUrl, // Se for cartão
                    splits: data.splits // Valores divididos
                };
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            console.error('[MyGateway] Erro ao processar pagamento:', error);
            throw error;
        }
    }

    // 4️⃣ Gerar QR Code PIX
    async gerarQRCode(pedido) {
        try {
            console.log('[MyGateway] Gerando QR Code PIX...');
            
            const response = await fetch(`${this.baseURL}/pix/qrcode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    merchantId: this.merchantId,
                    amount: pedido.total,
                    description: `Pedido #${pedido.numero}`,
                    splits: [
                        {
                            accountId: this.motoboyId || pedido.motoboyId,
                            percentage: this.motoboyPercent
                        },
                        {
                            accountId: this.creatorId,
                            percentage: this.creatorPercent
                        },
                        {
                            accountId: 'plataforma_id',
                            percentage: this.plataformaPercent
                        }
                    ]
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return {
                    qrCode: data.qrCode,
                    qrCodeImage: data.qrCodeImage,
                    expirationTime: data.expirationTime,
                    transactionId: data.transactionId
                };
            } else {
                throw new Error(data.error);
            }
            
        } catch (error) {
            console.error('[MyGateway] Erro ao gerar QR Code:', error);
            throw error;
        }
    }

    // 5️⃣ Verificar Status do Pagamento
    async verificarPagamento(transactionId) {
        try {
            console.log('[MyGateway] Verificando status do pagamento...');
            
            const response = await fetch(`${this.baseURL}/transactions/${transactionId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const data = await response.json();
            
            return {
                status: data.status, // 'pending', 'approved', 'rejected'
                amount: data.amount,
                splits: data.splits,
                processedAt: data.processedAt
            };
            
        } catch (error) {
            console.error('[MyGateway] Erro ao verificar pagamento:', error);
            throw error;
        }
    }

    // 6️⃣ Calcular Valores do Split
    calcularSplit(valorTotal, metodoPagamento) {
        const taxa = metodoPagamento === 'pix' ? 0.99 : 1.0;
        const valorComTaxa = valorTotal * (1 - taxa / 100);
        
        const valorPlataforma = valorComTaxa * (this.plataformaPercent / 100);
        const valorMotoboy = valorComTaxa * (this.motoboyPercent / 100);
        const valorComerciante = valorComTaxa - valorPlataforma - valorMotoboy;
        
        return {
            valorTotal: valorTotal,
            taxa: taxa,
            valorComTaxa: valorComTaxa,
            splits: {
                plataforma: {
                    percent: this.plataformaPercent,
                    valor: valorPlataforma
                },
                motoboy: {
                    percent: this.motoboyPercent,
                    valor: valorMotoboy
                },
                comerciante: {
                    percent: (100 - this.plataformaPercent - this.motoboyPercent),
                    valor: valorComerciante
                }
            }
        };
    }
}

// Exportar para usar no totem
window.MyGatewayIntegration = MyGatewayIntegration;
