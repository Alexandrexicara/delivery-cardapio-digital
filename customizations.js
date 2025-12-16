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
            background: null,
            facebook: 'https://facebook.com/restaurantesabores',
            instagram: 'https://instagram.com/restaurantesabores',
            whatsapp: 'https://wa.me/5511999999999'
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
        console.log('[DEBUG] Inicializando customizações');
        let customizations = JSON.parse(localStorage.getItem('establishmentCustomizations') || '{}');
        console.log('[DEBUG] Customizações existentes:', customizations);

        if (Object.keys(customizations).length === 0) {
            console.log('[DEBUG] Nenhuma customização encontrada, criando padrão');
            customizations = { ...this.defaultCustomizations };
            console.log('[DEBUG] Customizações padrão:', customizations);

            // Atribuir imagens aleatórias
            customizations.logo = `/uploads/${this.availableImages[Math.floor(Math.random() * 4)]}`;
            customizations.background = `/uploads/${this.availableImages.slice(4)[Math.floor(Math.random() * 8)]}`;
            console.log('[DEBUG] Imagens atribuídas - logo:', customizations.logo, 'background:', customizations.background);

            localStorage.setItem('establishmentCustomizations', JSON.stringify(customizations));
            console.log('Customizações padrão criadas:', customizations);
        }

        console.log('[DEBUG] Retornando customizações:', customizations);
        return customizations;
    }

    // Salvar customizações
    saveCustomizations(customizations) {
        try {
            console.log('[DEBUG] Salvando customizações:', customizations);
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
            console.log('[DEBUG] Carregando customizações do localStorage');
            const customizations = JSON.parse(localStorage.getItem('establishmentCustomizations') || '{}');
            console.log('[DEBUG] Customizações carregadas:', customizations);
            const result = Object.keys(customizations).length > 0 ? customizations : this.initializeCustomizations();
            console.log('[DEBUG] Resultado do carregamento:', result);
            return result;
        } catch (error) {
            console.error('Erro ao carregar customizações:', error);
            return this.initializeCustomizations();
        }
    }

    // Aplicar customizações no cardápio
    applyToMenu() {
        console.log('[DEBUG] Iniciando aplicação de customizações');
        const customizations = this.loadCustomizations();
        console.log('[DEBUG] Customizações carregadas:', customizations);

        // Aplicar logo
        if (customizations.logo) {
            console.log('[DEBUG] Aplicando logo:', customizations.logo);
            let logoImg = document.getElementById('establishmentLogoImg');
            console.log('[DEBUG] Elemento logoImg encontrado:', logoImg);
            
            if (!logoImg) {
                console.log('[DEBUG] Criando elemento logoImg');
                logoImg = document.createElement('img');
                logoImg.id = 'establishmentLogoImg';
                logoImg.style.maxHeight = '50px';
                logoImg.style.display = 'block';
                logoImg.style.marginBottom = '10px';
                logoImg.style.objectFit = 'contain';
                
                const logoContainer = document.getElementById('establishmentLogo');
                console.log('[DEBUG] Elemento logoContainer encontrado:', logoContainer);
                
                if (logoContainer) {
                    logoContainer.insertBefore(logoImg, logoContainer.firstChild);
                    console.log('[DEBUG] Logo inserido no container');
                } else {
                    console.log('[DEBUG] Container de logo não encontrado');
                }
            }
            
            if (logoImg) {
                logoImg.src = customizations.logo;
                logoImg.alt = 'Logo do Estabelecimento';
                console.log('[DEBUG] Logo atualizado com sucesso');
            }
        }

        // Aplicar background
        if (customizations.background) {
            console.log('[DEBUG] Aplicando background:', customizations.background);
            document.body.style.backgroundImage = `url(${customizations.background})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
            console.log('[DEBUG] Background aplicado');
        }

        // Aplicar cores
        if (customizations.primaryColor) {
            console.log('[DEBUG] Aplicando cor primária:', customizations.primaryColor);
            document.documentElement.style.setProperty('--primary-color', customizations.primaryColor);
        }
        if (customizations.secondaryColor) {
            console.log('[DEBUG] Aplicando cor secundária:', customizations.secondaryColor);
            document.documentElement.style.setProperty('--secondary-color', customizations.secondaryColor);
        }

        // Aplicar nome do estabelecimento
        if (customizations.establishmentName) {
            console.log('[DEBUG] Aplicando nome do estabelecimento:', customizations.establishmentName);
            document.title = `${customizations.establishmentName} - Cardápio Digital`;
            const nameElement = document.getElementById('establishmentName');
            console.log('[DEBUG] Elemento establishmentName encontrado:', nameElement);
            
            if (nameElement) {
                nameElement.textContent = customizations.establishmentName;
                console.log('[DEBUG] Nome do estabelecimento atualizado');
            } else {
                console.log('[DEBUG] Elemento establishmentName não encontrado');
            }
        }

        // Aplicar tagline
        if (customizations.establishmentTagline) {
            console.log('[DEBUG] Aplicando tagline:', customizations.establishmentTagline);
            const taglineElement = document.getElementById('establishmentTagline');
            console.log('[DEBUG] Elemento establishmentTagline encontrado:', taglineElement);
            
            if (taglineElement) {
                taglineElement.textContent = customizations.establishmentTagline;
                console.log('[DEBUG] Tagline atualizada');
            } else {
                console.log('[DEBUG] Elemento establishmentTagline não encontrado');
            }
        }

        // Aplicar links de redes sociais
        if (customizations.facebook || customizations.instagram || customizations.whatsapp) {
            console.log('[DEBUG] Aplicando links de redes sociais');
            const socialMediaContainer = document.getElementById('socialMediaLinks');
            if (socialMediaContainer) {
                socialMediaContainer.innerHTML = '';
                
                // Adicionar ícones animados reais do Font Awesome com cores oficiais
                if (customizations.facebook) {
                    const fbLink = document.createElement('a');
                    fbLink.href = customizations.facebook;
                    fbLink.target = '_blank';
                    fbLink.className = 'social-media-link animated-icon fab fa-facebook-f';
                    fbLink.title = 'Facebook';
                    fbLink.style.color = '#1877F2'; // Cor oficial do Facebook
                    fbLink.style.fontSize = '48px'; // Aumentado em 100% (de 24px para 48px)
                    socialMediaContainer.appendChild(fbLink);
                }
                
                if (customizations.instagram) {
                    const igLink = document.createElement('a');
                    igLink.href = customizations.instagram;
                    igLink.target = '_blank';
                    igLink.className = 'social-media-link animated-icon fab fa-instagram';
                    igLink.title = 'Instagram';
                    igLink.style.color = '#E4405F'; // Cor oficial do Instagram
                    igLink.style.fontSize = '48px'; // Aumentado em 100% (de 24px para 48px)
                    socialMediaContainer.appendChild(igLink);
                }
                
                if (customizations.whatsapp) {
                    const waLink = document.createElement('a');
                    waLink.href = customizations.whatsapp;
                    waLink.target = '_blank';
                    waLink.className = 'social-media-link animated-icon fab fa-whatsapp';
                    waLink.title = 'WhatsApp';
                    waLink.style.color = '#25D366'; // Cor oficial do WhatsApp
                    waLink.style.fontSize = '48px'; // Aumentado em 100% (de 24px para 48px)
                    socialMediaContainer.appendChild(waLink);
                }
                
                console.log('[DEBUG] Links de redes sociais atualizados');
            }
        }

        console.log('[DEBUG] Customizações aplicadas no cardápio');
    }

    // Aplicar customizações no admin
    applyToAdmin() {
        console.log('[DEBUG] Aplicando customizações no admin');
        const customizations = this.loadCustomizations();
        console.log('[DEBUG] Customizações carregadas para admin:', customizations);

        // Aplicar background
        if (customizations.background) {
            console.log('[DEBUG] Aplicando background no admin:', customizations.background);
            document.body.style.backgroundImage = `url(${customizations.background})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
            console.log('[DEBUG] Background aplicado no admin');
        }

        // Aplicar logo
        if (customizations.logo) {
            console.log('[DEBUG] Aplicando logo no admin:', customizations.logo);
            let logoImg = document.getElementById('establishmentLogoImg');
            console.log('[DEBUG] Elemento logoImg encontrado:', logoImg);
            
            if (!logoImg) {
                console.log('[DEBUG] Criando elemento logoImg para admin');
                logoImg = document.createElement('img');
                logoImg.id = 'establishmentLogoImg';
                logoImg.style.maxHeight = '50px';
                logoImg.style.display = 'block';
                logoImg.style.marginBottom = '10px';
                logoImg.style.objectFit = 'contain';
                
                const logoContainer = document.getElementById('establishmentLogo');
                console.log('[DEBUG] Elemento logoContainer encontrado:', logoContainer);
                
                if (logoContainer) {
                    logoContainer.insertBefore(logoImg, logoContainer.firstChild);
                    console.log('[DEBUG] Logo inserido no container do admin');
                } else {
                    console.log('[DEBUG] Container de logo não encontrado no admin');
                }
            }
            
            if (logoImg) {
                logoImg.src = customizations.logo;
                logoImg.alt = 'Logo do Estabelecimento';
                console.log('[DEBUG] Logo atualizado com sucesso no admin');
            }
        }

        // Aplicar cores no admin se necessário
        if (customizations.primaryColor) {
            console.log('[DEBUG] Aplicando cor primária no admin:', customizations.primaryColor);
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
        console.log('[DEBUG] Escurecendo cor:', color);
        // Simples implementação para escurecer cores
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const darkenedR = Math.max(0, r - 30);
        const darkenedG = Math.max(0, g - 30);
        const darkenedB = Math.max(0, b - 30);

        const result = `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
        console.log('[DEBUG] Cor escurecida:', result);
        return result;
    }

    // Upload de imagem
    async uploadImage(file, type) {
        console.log(`[DEBUG] Iniciando uploadImage para ${type}`, file);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const serverUrl = window.location.origin;
            console.log(`[DEBUG] Enviando requisição POST para ${serverUrl}/upload/${type}`);
            const response = await fetch(`${serverUrl}/upload/${type}`, {
                method: 'POST',
                body: formData
            });

            console.log(`[DEBUG] Resposta recebida do servidor para ${type}:`, response);
            const data = await response.json();
            console.log(`[DEBUG] Dados recebidos para ${type}:`, data);

            if (data.success) {
                console.log(`[DEBUG] Upload bem sucedido para ${type}`);
                const customizations = this.loadCustomizations();
                customizations[type] = data.imageUrl;
                this.saveCustomizations(customizations);

                console.log(`${type === 'logo' ? 'Logo' : 'Imagem de fundo'} carregada com sucesso!`);
                return data.imageUrl;
            } else {
                console.log(`[DEBUG] Upload falhou para ${type}`);
                throw new Error(data.error || 'Erro no upload');
            }
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            throw error;
        }
    }

    // Reset para configurações padrão
    resetToDefault() {
        console.log('[DEBUG] Resetando customizações para padrão');
        localStorage.removeItem('establishmentCustomizations');
        const defaultCustomizations = this.initializeCustomizations();
        console.log('Customizações resetadas para padrão');
        return defaultCustomizations;
    }

    // Exportar customizações
    exportCustomizations() {
        console.log('[DEBUG] Exportando customizações');
        const customizations = this.loadCustomizations();
        console.log('[DEBUG] Customizações para exportar:', customizations);
        const dataStr = JSON.stringify(customizations, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const url = URL.createObjectURL(dataBlob);
        console.log('[DEBUG] URL do blob criado:', url);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'customizacoes.json';
        link.click();

        URL.revokeObjectURL(url);
        console.log('Customizações exportadas');
    }

    // Importar customizações
    importCustomizations(file) {
        console.log('[DEBUG] Importando customizações', file);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                console.log('[DEBUG] Arquivo lido com sucesso');
                const customizations = JSON.parse(e.target.result);
                console.log('[DEBUG] Customizações parseadas:', customizations);
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
    console.log('[DEBUG] Chamando initializeCustomizations');
    return customizationManager.initializeCustomizations();
}

function saveCustomizations(customizations) {
    console.log('[DEBUG] Chamando saveCustomizations', customizations);
    return customizationManager.saveCustomizations(customizations);
}

function loadCustomizations() {
    console.log('[DEBUG] Chamando loadCustomizations');
    return customizationManager.loadCustomizations();
}

function applyCustomizationsToMenu() {
    console.log('[DEBUG] Chamando applyCustomizationsToMenu');
    customizationManager.applyToMenu();
}

function applyCustomizationsToAdmin() {
    console.log('[DEBUG] Chamando applyCustomizationsToAdmin');
    customizationManager.applyToAdmin();
}

function uploadImage(file, type) {
    console.log('[DEBUG] Chamando uploadImage', file, type);
    return customizationManager.uploadImage(file, type);
}

function resetCustomizations() {
    console.log('[DEBUG] Chamando resetCustomizations');
    return customizationManager.resetToDefault();
}

function exportCustomizations() {
    console.log('[DEBUG] Chamando exportCustomizations');
    customizationManager.exportCustomizations();
}

function importCustomizations(file) {
    console.log('[DEBUG] Chamando importCustomizations', file);
    customizationManager.importCustomizations(file);
}

console.log('Sistema de Customizações carregado');
