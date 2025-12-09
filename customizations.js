// Sistema de Gerenciamento de Customizações
// Arquivo: customizations.js

class CustomizationManager {
    constructor() {
        this.defaultCustomizations = {
            establishmentName: 'Restaurante Sabores',
            establishmentTagline: 'Cozinha Brasileira Autêntica',
            establishmentAddress: 'Rua das Flores, 123 - Centro',
            establishmentPhone: '(11) 99999-9999',
            establishmentHours: 'Ter-Sex: 18h-23h | Sáb-Dom: 12h-23h',
            primaryColor: '#e74c3c',
            secondaryColor: '#3498db',
            facebook: 'https://facebook.com/restaurantesabores',
            instagram: 'https://instagram.com/restaurantesabores',
            whatsapp: 'https://wa.me/5511999999999',
            logo: null,
            background: null
        };

        this.availableImages = [
            '1758641231853-802575236.png',
            '1758641246866-164303529.png',
            '1758642907142-51736523.png',
            '1758642917233-508455064.png',
            '1758643322703-268957204.png',
            '1758643332548-420301807.png',
            '1758651056176-255564749.png',
            '1758651071345-12727815.png',
            '1758652590368-578727251.png',
            '1758652600948-978263467.png',
            '1758653233471-942831681.png',
            '1758653243815-780406311.png'
        ];
    }

    // Inicializar customizações padrão se não existirem
    initializeCustomizations() {
        let customizations = JSON.parse(localStorage.getItem('establishmentCustomizations') || '{}');

        if (Object.keys(customizations).length === 0) {
            customizations = { ...this.defaultCustomizations };

            // Atribuir imagens aleatórias
            customizations.logo = `/uploads/${this.availableImages[Math.floor(Math.random() * 4)]}`;
            customizations.background = `/uploads/${this.availableImages.slice(4)[Math.floor(Math.random() * 8)]}`;

            localStorage.setItem('establishmentCustomizations', JSON.stringify(customizations));
            console.log('Customizações padrão criadas:', customizations);
        }

        return customizations;
    }

    // Salvar customizações
    saveCustomizations(customizations) {
        try {
            localStorage.setItem('establishmentCustomizations', JSON.stringify(customizations));
            console.log('Customizações salvas com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao salvar customizações:', error);
            return false;
        }
    }

    // Carregar customizações
    loadCustomizations() {
        try {
            const customizations = JSON.parse(localStorage.getItem('establishmentCustomizations') || '{}');
            return Object.keys(customizations).length > 0 ? customizations : this.initializeCustomizations();
        } catch (error) {
            console.error('Erro ao carregar customizações:', error);
            return this.initializeCustomizations();
        }
    }

    // Aplicar customizações no cardápio
    applyToMenu() {
        const customizations = this.loadCustomizations();

        // Aplicar logo
        if (customizations.logo) {
            let logoImg = document.getElementById('establishmentLogoImg');
            if (!logoImg) {
                logoImg = document.createElement('img');
                logoImg.id = 'establishmentLogoImg';
                logoImg.style.maxHeight = '50px';
                logoImg.style.display = 'block';
                logoImg.style.marginBottom = '10px';
                logoImg.style.objectFit = 'contain';
                const logoContainer = document.getElementById('establishmentLogo');
                if (logoContainer) {
                    logoContainer.insertBefore(logoImg, logoContainer.firstChild);
                }
            }
            logoImg.src = customizations.logo;
            logoImg.alt = 'Logo do Estabelecimento';
        }

        // Aplicar background
        if (customizations.background) {
            document.body.style.backgroundImage = `url(${customizations.background})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
        }

        // Aplicar cores
        if (customizations.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', customizations.primaryColor);
        }
        if (customizations.secondaryColor) {
            document.documentElement.style.setProperty('--secondary-color', customizations.secondaryColor);
        }

        // Aplicar nome do estabelecimento
        if (customizations.establishmentName) {
            document.title = `${customizations.establishmentName} - Cardápio Digital`;
            const nameElement = document.getElementById('establishmentName');
            if (nameElement) {
                nameElement.textContent = customizations.establishmentName;
            }
        }

        // Aplicar tagline
        if (customizations.establishmentTagline) {
            const taglineElement = document.getElementById('establishmentTagline');
            if (taglineElement) {
                taglineElement.textContent = customizations.establishmentTagline;
            }
        }

        console.log('Customizações aplicadas no cardápio');
    }

    // Aplicar customizações no admin
    applyToAdmin() {
        const customizations = this.loadCustomizations();

        // Aplicar cores no admin se necessário
        if (customizations.primaryColor) {
            // Atualizar cores dos botões e elementos do admin
            const style = document.createElement('style');
            style.textContent = `
                .btn-primary { background-color: ${customizations.primaryColor} !important; }
                .btn-primary:hover { background-color: ${this.darkenColor(customizations.primaryColor)} !important; }
                .tab.active { background-color: ${customizations.primaryColor} !important; }
            `;
            document.head.appendChild(style);
        }

        console.log('Customizações aplicadas no admin');
    }

    // Função auxiliar para escurecer cores
    darkenColor(color) {
        // Simples implementação para escurecer cores
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const darkenedR = Math.max(0, r - 30);
        const darkenedG = Math.max(0, g - 30);
        const darkenedB = Math.max(0, b - 30);

        return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
    }

    // Upload de imagem
    async uploadImage(file, type) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const serverUrl = window.location.origin;
            const response = await fetch(`${serverUrl}/upload/${type}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                const customizations = this.loadCustomizations();
                customizations[type] = data.imageUrl;
                this.saveCustomizations(customizations);

                console.log(`${type === 'logo' ? 'Logo' : 'Imagem de fundo'} carregada com sucesso!`);
                return data.imageUrl;
            } else {
                throw new Error(data.error || 'Erro no upload');
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            throw error;
        }
    }

    // Reset para configurações padrão
    resetToDefault() {
        localStorage.removeItem('establishmentCustomizations');
        const defaultCustomizations = this.initializeCustomizations();
        console.log('Customizações resetadas para padrão');
        return defaultCustomizations;
    }

    // Exportar customizações
    exportCustomizations() {
        const customizations = this.loadCustomizations();
        const dataStr = JSON.stringify(customizations, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'customizacoes.json';
        link.click();

        URL.revokeObjectURL(url);
        console.log('Customizações exportadas');
    }

    // Importar customizações
    importCustomizations(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const customizations = JSON.parse(e.target.result);
                this.saveCustomizations(customizations);
                console.log('Customizações importadas com sucesso');
                location.reload(); // Recarregar para aplicar as mudanças
            } catch (error) {
                console.error('Erro ao importar customizações:', error);
                alert('Erro ao importar arquivo. Verifique se é um arquivo JSON válido.');
            }
        };
        reader.readAsText(file);
    }
}

// Criar instância global
const customizationManager = new CustomizationManager();

// Funções globais para uso nos arquivos HTML
function initializeCustomizations() {
    return customizationManager.initializeCustomizations();
}

function saveCustomizations(customizations) {
    return customizationManager.saveCustomizations(customizations);
}

function loadCustomizations() {
    return customizationManager.loadCustomizations();
}

function applyCustomizationsToMenu() {
    customizationManager.applyToMenu();
}

function applyCustomizationsToAdmin() {
    customizationManager.applyToAdmin();
}

function uploadImage(file, type) {
    return customizationManager.uploadImage(file, type);
}

function resetCustomizations() {
    return customizationManager.resetToDefault();
}

function exportCustomizations() {
    customizationManager.exportCustomizations();
}

function importCustomizations(file) {
    customizationManager.importCustomizations(file);
}

console.log('Sistema de Customizações carregado');
