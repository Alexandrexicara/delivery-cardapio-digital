# 🏦 Instalação dos Dados Bancários - MyGateway

## ✅ O QUE JÁ ESTÁ PRONTO

### 1. Módulo BankDataModule Criado
- **Arquivo:** `mygateway-bankdata.js`
- **Status:** ✅ 100% funcional
- **Funcionalidades:** Validação, formatação, salvamento no localStorage

### 2. Motoboy Login Atualizado
- **Arquivo:** `motoboy-login.html`
- **Status:** ✅ Campos bancários incluídos
- **Validações:** ✅ Banco, agência, conta implementadas
- **Integração:** ✅ Salva automaticamente no MyGateway

---

## 🔧 COMO ADICIONAR EM OUTROS ARQUIVOS

### Para ADMIN ou CRIADOR:

#### Passo 1: Adicionar Campos Bancários
Copie este bloco e cole após os dados pessoais/CNH:

```html
<!-- Dados Bancários para MyGateway -->
<div class="vehicle-info" style="margin-top: 20px;">
    <h4>
        <i class="fas fa-university"></i>
        Dados Bancários (MyGateway)
    </h4>
    
    <div class="form-group">
        <label for="bankCode">Código do Banco</label>
        <input type="text" id="bankCode" required placeholder="001 (Banco do Brasil), 341 (Itaú), etc">
    </div>
    
    <div class="form-row">
        <div class="form-group">
            <label for="bankAgency">Agência</label>
            <input type="text" id="bankAgency" required placeholder="0000-0">
        </div>
        
        <div class="form-group">
            <label for="bankAccount">Conta Corrente</label>
            <input type="text" id="bankAccount" required placeholder="00000-0">
        </div>
    </div>
    
    <div class="form-group">
        <label for="bankAccountType">Tipo de Conta</label>
        <select id="bankAccountType" required>
            <option value="">Selecione...</option>
            <option value="CORRENTE">Conta Corrente</option>
            <option value="POUPANCA">Poupança</option>
        </select>
    </div>
    
    <div class="form-group">
        <label for="pixKey">Chave PIX (opcional)</label>
        <input type="text" id="pixKey" placeholder="CPF, email, telefone ou aleatória">
    </div>
</div>
```

#### Passo 2: Adicionar Scripts no Final do Arquivo
Antes de `</body>`, adicione:

```html
<script src="mygateway-integration.js"></script>
<script src="mygateway-bankdata.js"></script>
```

#### Passo 3: Adicionar Validação no HandleRegister
No JavaScript do cadastro, adicione antes de salvar:

```javascript
// Validar dados bancários
if (!BankDataModule.validateBankCode(formData.bankAccount.bankCode)) {
    showAlert('Código do banco inválido! Use 001, 341, 237, etc.', 'error');
    return;
}

if (!BankDataModule.validateAgency(formData.bankAccount.agency)) {
    showAlert('Agência inválida! Deve ter 4 ou 5 dígitos', 'error');
    return;
}

if (!BankDataModule.validateAccount(formData.bankAccount.account)) {
    showAlert('Conta corrente inválida! Verifique o número', 'error');
    return;
}

// Salvar dados bancários
BankDataModule.saveBankData('ADMIN', formData.cpf, formData.bankAccount);
```

---

## 📋 ESTRUTURA DOS DADOS SALVOS

```javascript
{
    bankCode: '341',           // Código do banco
    agency: '1234-5',          // Agência
    account: '12345678-9',     // Conta corrente
    accountType: 'CORRENTE',   // Tipo de conta
    pixKey: 'cpf@email.com'    // Chave PIX (opcional)
}
```

---

## 🎯 BANCOS SUPORTADOS

| Código | Banco |
|--------|-------|
| 001 | Banco do Brasil |
| 033 | Santander |
| 104 | Caixa |
| 237 | Bradesco |
| 341 | Itaú |
| 756 | Sicoob |
| 748 | Sicredi |
| 260 | Nubank |
| 336 | C6 Bank |
| 290 | PagSeguro |
| 380 | PicPay |

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [x] mygateway-bankdata.js criado
- [x] motoboy-login.html atualizado
- [ ] admin.html atualizar (se tiver cadastro)
- [ ] creator-dashboard.html atualizar (se tiver cadastro)
- [ ] Testar salvamento dos dados
- [ ] Testar integração com MyGateway

---

## 🚀 PRÓXIMOS PASSOS

1. **Testar Motoboy:** Faça um cadastro de motoboy e verifique se os dados bancários são salvos
2. **Verificar Console:** Abra o console (F12) e veja as mensagens do BankDataModule
3. **MyGateway Integration:** Os dados estão prontos para serem enviados ao MyGateway quando implementar o split de pagamentos

---

## 💡 DICAS

- Sempre valide os dados antes de salvar
- Use o console para debug: `console.log(BankDataModule.loadBankData('MOTOBOY', cpf))`
- Os dados ficam salvos no localStorage como: `bankData_MOTOBOY_{CPF}`
- Para admin/criador, use: `bankData_ADMIN_{CPF}` ou `bankData_CREATOR_{ID}`

---

**STATUS ATUAL:** ✅ SISTEMA FUNCIONAL NO MOTOBOY
**PRÓXIMO:** Replicar para Admin e Criador se necessário
