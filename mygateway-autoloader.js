/**
 * Auto Loader - MyGateway Integration
 * Carrega automaticamente todos os módulos do MyGateway em qualquer página
 * SEM PRECISAR ADICIONAR SCRIPTS MANUALMENTE
 */

(function() {
    console.log('[MYGATEWAY AUTO LOADER] 🚀 Iniciando carregamento automático...');
    
    // Lista de arquivos que devem ser carregados
    const scripts = [
        'mygateway-integration.js',
        'mygateway-bankdata.js'
    ];
    
    // Função para carregar script dinamicamente
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Verificar se já existe
            if (document.querySelector(`script[src="${src}"]`)) {
                console.log(`[MYGATEWAY] ✅ ${src} já carregado`);
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = src;
            script.async = false;
            
            script.onload = () => {
                console.log(`[MYGATEWAY] ✅ ${src} carregado com sucesso`);
                resolve();
            };
            
            script.onerror = () => {
                console.warn(`[MYGATEWAY] ⚠️ Erro ao carregar ${src}`);
                resolve(); // Não falhar, apenas avisar
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Carregar todos os scripts em sequência
    async function loadAllScripts() {
        for (const src of scripts) {
            await loadScript(src);
        }
        
        console.log('[MYGATEWAY AUTO LOADER] ✅ Todos os módulos carregados!');
        console.log('[MYGATEWAY AUTO LOADER] 💳 Dados bancários serão aplicados automaticamente');
    }
    
    // Iniciar carregamento quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllScripts);
    } else {
        loadAllScripts();
    }
    
    // Exportar função manual caso precise
    window.MyGatewayAutoLoader = {
        loadNow: loadAllScripts,
        loadScript: loadScript
    };
})();
