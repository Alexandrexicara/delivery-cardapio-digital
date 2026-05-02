/**
 * Script para corrigir erro de JSON.parse no admin.html
 * Deve ser incluído após o carregamento do admin.html
 */

// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    console.log('[FIX-WS] Aplicando correção WebSocket...');
    
    // Encontra todos os scripts inline
    const scripts = document.getElementsByTagName('script');
    
    for (let script of scripts) {
        if (!script.src && script.textContent.includes('ws.onmessage')) {
            console.log('[FIX-WS] Script WebSocket encontrado, aplicando correção...');
            
            // Substitui o código problemático
            const originalCode = script.textContent;
            const fixedCode = originalCode.replace(
                /const data = JSON\.parse\(event\.data\);/g,
                `let data; try { data = JSON.parse(event.data); } catch (e) { console.warn('[WS] Mensagem não-JSON:', event.data); return; }`
            );
            
            if (originalCode !== fixedCode) {
                console.log('[FIX-WS] Correção aplicada com sucesso!');
                script.textContent = fixedCode;
            } else {
                console.log('[FIX-WS] Nenhuma alteração necessária.');
            }
        }
    }
});

console.log('[FIX-WS] Script de correção carregado.');
