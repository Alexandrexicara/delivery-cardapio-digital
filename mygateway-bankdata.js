/**
 * Módulo de Dados Bancários - MyGateway
 * Gerencia informações bancárias para todos os perfis (Motoboy, Admin, Criador)
 * APLICAÇÃO AUTOMÁTICA - Detecta o perfil e configura sozinho
 */

const BankDataModule = {
    // Detectar automaticamente o tipo de perfil
    detectProfileType() {
        const url = window.location.href.toLowerCase();
        if (url.includes('motoboy')) return 'MOTOBOY';
        if (url.includes('admin')) return 'ADMIN';
        if (url.includes('creator')) return 'CREATOR';
        return 'UNKNOWN';
    },
    
    // Aplicar campos bancários automaticamente no formulário
    applyBankFieldsAutomatically() {
        const profileType = this.detectProfileType();
        console.log(`[BANK DATA] Perfil detectado: ${profileType}`);
        
        // Procurar formulário de cadastro
        const forms = document.querySelectorAll('form');
        let targetForm = null;
        
        for (let form of forms) {
            const html = form.innerHTML.toLowerCase();
            if (html.includes('cpf') || html.includes('cnpj') || html.includes('nome') || html.includes('name')) {
                targetForm = form;
                break;
            }
        }
        
        if (!targetForm) {
            console.warn('[BANK DATA] Nenhum formulário encontrado');
            return;
        }
        
        // Verificar se já tem campos bancários
        if (document.getElementById('bankCode')) {
            console.log('[BANK DATA] Campos bancários já existem');
            return;
        }
        
        // Criar container dos campos bancários
        const bankSection = document.createElement('div');
        bankSection.className = 'vehicle-info';
        bankSection.style.cssText = 'margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 8px; border: 2px dashed #4CAF50;';
        
        bankSection.innerHTML = `
            <h4 style="color: #4CAF50; margin-bottom: 15px;">
                <i class="fas fa-university"></i>
                💳 Dados Bancários (MyGateway) - ${profileType}
            </h4>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="font-weight: 600;">Código do Banco</label>
                <input type="text" id="bankCode" required placeholder="001 (Banco do Brasil), 341 (Itaú), etc" maxlength="3" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
            </div>
            
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div class="form-group">
                    <label style="font-weight: 600;">Agência</label>
                    <input type="text" id="bankAgency" required placeholder="0000-0" maxlength="6" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
                </div>
                
                <div class="form-group">
                    <label style="font-weight: 600;">Conta Corrente</label>
                    <input type="text" id="bankAccount" required placeholder="00000-0" maxlength="15" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
                </div>
            </div>
            
            <div class="form-group" style="margin-bottom: 15px;">
                <label style="font-weight: 600;">Tipo de Conta</label>
                <select id="bankAccountType" required style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
                    <option value="">Selecione...</option>
                    <option value="CORRENTE">Conta Corrente</option>
                    <option value="POUPANCA">Poupança</option>
                </select>
            </div>
            
            <div class="form-group">
                <label style="font-weight: 600;">Chave PIX (opcional)</label>
                <input type="text" id="pixKey" placeholder="CPF, email, telefone ou aleatória" style="width: 100%; padding: 10px; border: 2px solid #ddd; border-radius: 5px;">
            </div>
        `;
        
        // Inserir após o último campo CPF/CNPJ ou no final do formulário
        const cpfField = targetForm.querySelector('input[id*="cpf" i], input[id*="cnpj" i]');
        if (cpfField && cpfField.closest('.form-group')) {
            cpfField.closest('.form-group').after(bankSection);
        } else {
            const submitBtn = targetForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.before(bankSection);
            } else {
                targetForm.appendChild(bankSection);
            }
        }
        
        // Adicionar formatação automática
        setTimeout(() => {
            document.getElementById('bankCode')?.addEventListener('input', (e) => this.formatBankCode(e.target));
            document.getElementById('bankAgency')?.addEventListener('input', (e) => this.formatAgency(e.target));
            document.getElementById('bankAccount')?.addEventListener('input', (e) => this.formatAccount(e.target));
        }, 100);
        
        console.log('[BANK DATA] ✅ Campos bancários aplicados automaticamente!');
    },

    // Validar código do banco brasileiro
    validateBankCode(code) {
        const banks = {
            '001': 'Banco do Brasil',
            '033': 'Santander',
            '104': 'Caixa',
            '237': 'Bradesco',
            '341': 'Itaú',
            '756': 'Sicoob',
            '748': 'Sicredi'
        };
        return code.length === 3 && banks[code] !== undefined;
    },

    // Validar agência
    validateAgency(agency) {
        const cleaned = agency.replace(/\D/g, '');
        return cleaned.length >= 4 && cleaned.length <= 5;
    },

    // Validar conta corrente
    validateAccount(account) {
        const cleaned = account.replace(/[\D-]/g, '');
        return cleaned.length >= 6 && cleaned.length <= 13;
    },

    // Formatar código do banco
    formatBankCode(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 3) value = value.substring(0, 3);
        input.value = value;
    },

    // Formatar agência
    formatAgency(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length > 5) value = value.substring(0, 5);
        
        if (value.length >= 4) {
            value = `${value.substring(0, 4)}-${value.substring(4)}`;
        }
        
        input.value = value;
    },

    // Formatar conta corrente
    formatAccount(input) {
        let value = input.value.replace(/[\D-]/g, '');
        if (value.length > 13) value = value.substring(0, 13);
        
        if (value.length >= 1) {
            const accountNumber = value.substring(0, value.length - 1);
            const digit = value.substring(value.length - 1);
            value = `${accountNumber}-${digit}`;
        }
        
        input.value = value;
    },

    // Obter nome do banco pelo código
    getBankName(code) {
        const banks = {
            '001': 'Banco do Brasil',
            '033': 'Santander',
            '104': 'Caixa Econômica Federal',
            '237': 'Bradesco',
            '341': 'Itaú Unibanco',
            '756': 'Sicoob',
            '748': 'Sicredi',
            '260': 'Nu Pagamentos (Nubank)',
            '336': 'C6 Bank',
            '290': 'PagSeguro',
            '380': 'PicPay'
        };
        return banks[code] || 'Banco Desconhecido';
    },

    // Salvar dados bancários no localStorage
    saveBankData(profileType, profileId, bankData) {
        const key = `bankData_${profileType}_${profileId}`;
        localStorage.setItem(key, JSON.stringify(bankData));
        console.log(`[BANK DATA] Dados salvos para ${profileType}: ${profileId}`);
    },

    // Carregar dados bancários do localStorage
    loadBankData(profileType, profileId) {
        const key = `bankData_${profileType}_${profileId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // Verificar se dados bancários estão completos
    isComplete(bankData) {
        if (!bankData) return false;
        
        return bankData.bankCode &&
               bankData.agency &&
               bankData.account &&
               bankData.accountType;
    },

    // Exibir alerta se dados bancários incompletos
    checkAndAlert(profileType, profileName) {
        const storedData = this.loadBankData(profileType, profileName);
        
        if (!this.isComplete(storedData)) {
            console.warn(`⚠️ [BANK DATA] ${profileType} ${profileName} não possui dados bancários completos!`);
            console.warn('💳 É necessário cadastrar dados bancários para receber pagamentos do MyGateway');
            return false;
        }
        
        console.log(`✅ [BANK DATA] ${profileType} ${profileName} possui dados bancários válidos`);
        return true;
    }
};

// Exportar para uso global
window.BankDataModule = BankDataModule;

// APLICAÇÃO AUTOMÁTICA - Detecta e aplica sozinho quando a página carrega
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('[BANK DATA] 🏦 Sistema bancário MyGateway inicializado');
        
        // Aplicar campos automaticamente se for página de cadastro
        const url = window.location.href.toLowerCase();
        if (url.includes('motoboy') || url.includes('admin') || url.includes('creator') || url.includes('login')) {
            setTimeout(() => {
                BankDataModule.applyBankFieldsAutomatically();
            }, 500);
        }
    });
}
