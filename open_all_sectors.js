// Script para abrir todos os setores e testar sons simultaneamente
console.log('🚀 Abrindo todos os setores para teste de sons...');

// URLs dos setores
const sectors = [
    { name: 'ADMIN', url: 'http://localhost:3001/admin.html' },
    { name: 'COZINHA', url: 'http://localhost:3001/cozinha.html' },
    { name: 'BALCÃO', url: 'http://localhost:3001/balcao.html' },
    { name: 'GARÇOM', url: 'http://localhost:3001/garcom.html' }
];

// Abrir cada setor em uma nova janela
sectors.forEach((sector, index) => {
    setTimeout(() => {
        console.log(`🎯 Abrindo ${sector.name}...`);
        
        // Criar elemento link para abrir em nova aba
        const link = document.createElement('a');
        link.href = sector.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log(`✅ ${sector.name} aberto em nova aba`);
    }, index * 1000); // 1 segundo entre cada abertura
});

console.log('\n🔔 Todos os setores serão abertos em sequência');
console.log('🧪 Após abri-los, execute o teste de notificações');