// Script para verificar o sistema de assinatura do domínio

console.log("🔍 Verificando sistema de assinatura do domínio...");

// Função para verificar se os dados da assinatura existem
function verifySubscriptionData() {
    console.log("\n📋 Verificando dados da assinatura...");
    
    const establishmentData = JSON.parse(localStorage.getItem('establishmentData') || '{}');
    
    if (Object.keys(establishmentData).length === 0) {
        console.log("❌ Nenhum dado de estabelecimento encontrado");
        return false;
    }
    
    if (!establishmentData.assinatura) {
        console.log("❌ Dados da assinatura não encontrados");
        return false;
    }
    
    const assinatura = establishmentData.assinatura;
    
    console.log("✅ Dados da assinatura encontrados:");
    console.log(`   - Valor do domínio: R$ ${assinatura.valorDominio}`);
    console.log(`   - Data de compra: ${new Date(assinatura.dataCompra).toLocaleDateString('pt-BR')}`);
    console.log(`   - Data de vencimento: ${new Date(assinatura.dataVencimento).toLocaleDateString('pt-BR')}`);
    console.log(`   - Status de pagamento: ${assinatura.statusPagamento}`);
    console.log(`   - Aviso mostrado: ${assinatura.avisoMostrado}`);
    
    // Calcular dias restantes
    const agora = new Date();
    const dataVencimento = new Date(assinatura.dataVencimento);
    const diasRestantes = Math.ceil((dataVencimento - agora) / (1000 * 60 * 60 * 24));
    
    console.log(`   - Dias restantes: ${diasRestantes}`);
    
    if (diasRestantes <= 0) {
        console.log("   ⚠️  A assinatura está expirada!");
    } else if (diasRestantes <= 30) {
        console.log("   ⚠️  A assinatura vence em breve (menos de 30 dias)!");
    } else {
        console.log("   ✅ A assinatura está válida!");
    }
    
    return true;
}

// Função para verificar funções do sistema
function verifySubscriptionFunctions() {
    console.log("\n🔧 Verificando funções do sistema de assinatura...");
    
    const requiredFunctions = [
        'inicializarAssinatura',
        'verificarStatusAssinatura',
        'mostrarAvisoAssinatura',
        'mostrarAvisoExpiracao',
        'mostrarModalPagamento',
        'processarPagamentoDominio',
        'exibirInfoAssinatura',
        'iniciarSistemaAssinatura'
    ];
    
    let missingFunctions = [];
    
    requiredFunctions.forEach(funcName => {
        if (typeof window !== 'undefined' && window[funcName]) {
            console.log(`✅ Função ${funcName} encontrada`);
        } else {
            missingFunctions.push(funcName);
            console.log(`❌ Função ${funcName} NÃO encontrada`);
        }
    });
    
    if (missingFunctions.length > 0) {
        console.log(`\n⚠️  Funções ausentes: ${missingFunctions.join(', ')}`);
        console.log("   Estas funções devem estar presentes no admin.html");
    } else {
        console.log("\n✅ Todas as funções do sistema de assinatura estão presentes");
    }
    
    return missingFunctions.length === 0;
}

// Função para simular diferentes cenários
function simulateScenarios() {
    console.log("\n🧪 Simulando diferentes cenários de assinatura...");
    
    const establishmentData = JSON.parse(localStorage.getItem('establishmentData') || '{}');
    
    if (!establishmentData.assinatura) {
        console.log("   Nenhuma assinatura encontrada para simulação");
        return;
    }
    
    // Simular vencimento em 15 dias
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 15);
    establishmentData.assinatura.dataVencimento = futureDate.toISOString();
    console.log(`   Simulado: Vencimento em 15 dias - ${futureDate.toLocaleDateString('pt-BR')}`);
    
    // Simular vencimento hoje
    const today = new Date();
    establishmentData.assinatura.dataVencimento = today.toISOString();
    console.log(`   Simulado: Vencimento hoje - ${today.toLocaleDateString('pt-BR')}`);
    
    // Simular vencimento há 5 dias
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5);
    establishmentData.assinatura.dataVencimento = pastDate.toISOString();
    console.log(`   Simulado: Vencimento há 5 dias - ${pastDate.toLocaleDateString('pt-BR')}`);
    
    console.log("   ✅ Cenários simulados com sucesso");
}

// Função principal de verificação
function runVerification() {
    console.log("🚀 Iniciando verificação do sistema de assinatura...\n");
    
    const dataExists = verifySubscriptionData();
    const functionsOK = verifySubscriptionFunctions();
    
    if (dataExists) {
        simulateScenarios();
    }
    
    console.log("\n📊 Resumo da verificação:");
    console.log(`   Dados da assinatura: ${dataExists ? '✅ OK' : '❌ Faltando'}`);
    console.log(`   Funções do sistema: ${functionsOK ? '✅ OK' : '❌ Faltando'}`);
    
    if (dataExists && functionsOK) {
        console.log("\n✅ Sistema de assinatura está configurado corretamente!");
    } else {
        console.log("\n❌ Sistema de assinatura precisa de correções!");
    }
}

// Executar verificação
if (typeof window !== 'undefined') {
    // Se estiver no navegador, esperar o DOM carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runVerification);
    } else {
        runVerification();
    }
} else {
    // Se estiver no Node.js, executar imediatamente
    runVerification();
}

console.log("\n💡 Dica: Para testar o sistema de assinatura, você pode:");
console.log("   1. Acessar o admin.html para verificar o sistema completo");
console.log("   2. Usar o test_domain_subscription.html para testes interativos");
console.log("   3. Modificar manualmente a data de vencimento no localStorage");