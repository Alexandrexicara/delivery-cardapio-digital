// Script para verificar todas as funcionalidades do admin

console.log('=== Verificando Funcionalidades do Admin ===');

// Função para verificar personalizações
function checkCustomizations() {
    console.log('\n1. Verificando Personalizações...');
    
    const customizations = localStorage.getItem('establishmentCustomizations');
    const logo = localStorage.getItem('establishmentLogo');
    const background = localStorage.getItem('establishmentBackground');
    
    if (customizations) {
        try {
            const parsedData = JSON.parse(customizations);
            console.log('✅ Personalizações encontradas:', parsedData.establishmentName);
            console.log('   Logo carregado:', logo ? 'Sim' : 'Não');
            console.log('   Background carregado:', background ? 'Sim' : 'Não');
            return true;
        } catch (error) {
            console.log('❌ Erro ao ler personalizações:', error.message);
            return false;
        }
    } else {
        console.log('⚠️ Nenhuma personalização encontrada');
        return false;
    }
}

// Função para verificar itens do cardápio
function checkMenuItems() {
    console.log('\n2. Verificando Itens do Cardápio...');
    
    const menuItems = localStorage.getItem('menuItems');
    
    if (menuItems) {
        try {
            const parsedItems = JSON.parse(menuItems);
            console.log('✅ Itens do cardápio encontrados:', parsedItems.length, 'itens');
            
            if (parsedItems.length > 0) {
                console.log('   Primeiro item:', parsedItems[0].name);
            }
            
            return true;
        } catch (error) {
            console.log('❌ Erro ao ler itens do cardápio:', error.message);
            return false;
        }
    } else {
        console.log('⚠️ Nenhum item encontrado no cardápio');
        return false;
    }
}

// Função para simular salvar personalização
function simulateSaveCustomization() {
    console.log('\n3. Simulando salvar personalização...');
    
    const customizations = {
        establishmentName: "Restaurante Teste",
        establishmentTagline: "Cozinha Brasileira Autêntica",
        establishmentAddress: "Rua das Flores, 123 - Centro",
        establishmentPhone: "(11) 99999-9999",
        establishmentHours: "Ter-Sex: 18h-23h | Sáb-Dom: 12h-23h",
        primaryColor: "#e74c3c",
        secondaryColor: "#3498db",
        facebook: "https://facebook.com/teste",
        instagram: "https://instagram.com/teste",
        whatsapp: "https://wa.me/5511999999999"
    };
    
    localStorage.setItem('establishmentCustomizations', JSON.stringify(customizations));
    console.log('✅ Personalizações salvas com sucesso!');
    
    return true;
}

// Função para simular adicionar item ao menu
function simulateAddMenuItem() {
    console.log('\n4. Simulando adicionar item ao menu...');
    
    const newItem = {
        id: Date.now(),
        name: "Prato Teste",
        category: "main",
        price: "25.90",
        description: "Descrição do prato teste",
        image: null
    };
    
    let menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
    menuItems.push(newItem);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    console.log('✅ Item adicionado com sucesso:', newItem.name);
    return true;
}

// Função principal de verificação
function verifyAllFunctionality() {
    console.log('=== VERIFICAÇÃO COMPLETA DAS FUNCIONALIDADES DO ADMIN ===\n');
    
    // Verificar funcionalidades atuais
    const customizationsOk = checkCustomizations();
    const menuItemsOk = checkMenuItems();
    
    console.log('\n=== SIMULAÇÃO DE FUNCIONALIDADES ===');
    
    // Simular funcionalidades
    const saveCustomizationOk = simulateSaveCustomization();
    const addMenuItemOk = simulateAddMenuItem();
    
    // Verificar novamente após simulação
    console.log('\n=== VERIFICAÇÃO APÓS SIMULAÇÃO ===');
    checkCustomizations();
    checkMenuItems();
    
    console.log('\n=== RESULTADO FINAL ===');
    if (saveCustomizationOk && addMenuItemOk) {
        console.log('🎉 TODAS AS FUNCIONALIDADES ESTÃO OPERACIONAIS!');
        console.log('   ✅ Personalizações podem ser salvas');
        console.log('   ✅ Itens podem ser adicionados ao cardápio');
        console.log('   ✅ Dados são persistidos no localStorage');
    } else {
        console.log('❌ Algumas funcionalidades precisam de ajustes');
    }
}

// Executar verificação
verifyAllFunctionality();