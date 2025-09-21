// Patch para corrigir funcionalidades do admin

console.log('Aplicando patch para funcionalidades do admin...');

// Corrigir função de salvar personalizações
function patchSaveCustomization() {
    // Verificar se a função existe no contexto atual
    if (typeof saveCustomization === 'function') {
        console.log('✅ Função saveCustomization já existe');
        return true;
    }
    
    // Criar a função se não existir
    window.saveCustomization = function() {
        // Check if we're in developer mode
        const urlParams = new URLSearchParams(window.location.search);
        const isDeveloper = urlParams.get('developer') === 'true';
        
        if (isDeveloper) {
            alert('Modo desenvolvedor: Personalizações não serão salvas permanentemente.');
            return;
        }
        
        // Save customizations to localStorage
        const customizations = {
            establishmentName: document.getElementById('establishmentName').value,
            establishmentTagline: document.getElementById('establishmentTagline').value,
            establishmentAddress: document.getElementById('establishmentAddress').value,
            establishmentPhone: document.getElementById('establishmentPhone').value,
            establishmentHours: document.getElementById('establishmentHours').value,
            primaryColor: document.getElementById('primaryColor').value,
            secondaryColor: document.getElementById('secondaryColor').value,
            facebook: document.getElementById('facebook').value,
            instagram: document.getElementById('instagram').value,
            whatsapp: document.getElementById('whatsapp').value
        };
        
        // Save to localStorage
        localStorage.setItem('establishmentCustomizations', JSON.stringify(customizations));
        
        alert(`Personalizações salvas com sucesso!\nEstabelecimento: ${customizations.establishmentName}\nCor Primária: ${customizations.primaryColor}\nCor Secundária: ${customizations.secondaryColor}`);
    };
    
    console.log('✅ Função saveCustomization criada');
    return true;
}

// Corrigir função de salvar itens do menu
function patchSaveItem() {
    // Verificar se a função existe no contexto atual
    if (typeof saveItem === 'function') {
        console.log('✅ Função saveItem já existe');
        return true;
    }
    
    // Criar a função se não existir
    window.saveItem = function(itemData) {
        // Load existing items from localStorage
        let menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
        
        // Add new item
        menuItems.push(itemData);
        
        // Save to localStorage
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        
        alert(`Item "${itemData.name}" adicionado com sucesso ao cardápio!`);
        
        // Se estiver em um modal, fechar
        if (typeof closeModal === 'function') {
            closeModal('addItemModal');
        }
        
        // Clear form fields if they exist
        const itemName = document.getElementById('itemName');
        const itemPrice = document.getElementById('itemPrice');
        const itemDescription = document.getElementById('itemDescription');
        const itemImage = document.getElementById('itemImage');
        
        if (itemName) itemName.value = '';
        if (itemPrice) itemPrice.value = '';
        if (itemDescription) itemDescription.value = '';
        if (itemImage) itemImage.value = '';
    };
    
    console.log('✅ Função saveItem criada');
    return true;
}

// Corrigir função de upload de logo
function patchLogoUpload() {
    // Verificar se o event listener já existe
    const logoUpload = document.getElementById('logoUpload');
    if (logoUpload) {
        // Remover event listeners antigos para evitar duplicação
        const newLogoUpload = logoUpload.cloneNode(true);
        logoUpload.parentNode.replaceChild(newLogoUpload, logoUpload);
        
        // Adicionar novo event listener
        newLogoUpload.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                // Read the file and store as data URL
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Save to localStorage as data URL
                    localStorage.setItem('establishmentLogo', event.target.result);
                    alert('Logo carregado com sucesso!');
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        console.log('✅ Event listener para logo upload corrigido');
        return true;
    }
    
    console.log('⚠️ Elemento logoUpload não encontrado');
    return false;
}

// Corrigir função de upload de background
function patchBackgroundUpload() {
    // Verificar se o event listener já existe
    const backgroundUpload = document.getElementById('backgroundUpload');
    if (backgroundUpload) {
        // Remover event listeners antigos para evitar duplicação
        const newBackgroundUpload = backgroundUpload.cloneNode(true);
        backgroundUpload.parentNode.replaceChild(newBackgroundUpload, backgroundUpload);
        
        // Adicionar novo event listener
        newBackgroundUpload.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                // Read the file and store as data URL
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    // Save to localStorage as data URL
                    localStorage.setItem('establishmentBackground', event.target.result);
                    alert('Imagem de fundo carregada com sucesso!');
                };
                
                reader.readAsDataURL(file);
            }
        });
        
        console.log('✅ Event listener para background upload corrigido');
        return true;
    }
    
    console.log('⚠️ Elemento backgroundUpload não encontrado');
    return false;
}

// Aplicar todos os patches
function applyAllPatches() {
    console.log('=== APLICANDO TODOS OS PATCHES ===');
    
    const patches = [
        patchSaveCustomization(),
        patchSaveItem(),
        patchLogoUpload(),
        patchBackgroundUpload()
    ];
    
    const successCount = patches.filter(Boolean).length;
    
    console.log('\n=== RESULTADO DOS PATCHES ===');
    console.log(`✅ ${successCount} de ${patches.length} patches aplicados com sucesso`);
    
    if (successCount === patches.length) {
        console.log('🎉 Todos os patches foram aplicados com sucesso!');
        console.log('As funcionalidades do admin devem estar operacionais agora.');
    } else {
        console.log('⚠️ Alguns patches não puderam ser aplicados.');
        console.log('Verifique se você está na página correta (qr-management.html).');
    }
}

// Aplicar patches automaticamente após o carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAllPatches);
} else {
    applyAllPatches();
}