# Guia de Navegação do Sistema Cardápio Digital Universal

## Estrutura do Sistema

### Arquivos Principais
- `index.html` - Página inicial com informações sobre o sistema
- `login.html` - Página de login para administradores
- `admin.html` - Painel administrativo principal
- `qr-management.html` - Gerenciamento de QR codes e personalização
- `usuario.html` - Interface do cliente (cardápio)

## Navegação no Painel Administrativo

### Abas do Admin.html
1. **Dashboard** - Visão geral de pedidos e estatísticas
2. **Pedidos** - Gerenciamento de pedidos recebidos
3. **Cozinha** - Visualização de pedidos para preparo
4. **Balcão** - Gerenciamento de pedidos prontos para entrega
5. **Pagamentos** - Acompanhamento de pagamentos
6. **Histórico** - Histórico completo de pedidos
7. **Pedidos Combinados** - Visualização de pedidos combinados
8. **Ver Cardápio** - Visualização do cardápio como cliente

### Abas do QR-Management.html
1. **Dashboard** - Visão geral do estabelecimento
2. **Cardápio** - Gerenciamento de itens do cardápio
3. **Mesas & QR Codes** - Visualização e gerenciamento do QR code único
4. **Configurações** - Personalização completa do estabelecimento

## Funcionalidades por Seção

### Personalização (qr-management.html > Configurações)
- Cores primária e secundária
- Logo do estabelecimento
- Imagem de fundo
- Informações do estabelecimento (nome, slogan, endereço, etc.)
- Links para redes sociais

### QR Code e URL (qr-management.html > Mesas & QR Codes)
- Visualização do QR code único do estabelecimento
- Cópia da URL personalizada
- Instruções de impressão e posicionamento

### Gerenciamento de Cardápio (qr-management.html > Cardápio)
- Adição de novos itens
- Categorias de itens
- Preços e descrições
- Imagens de produtos

### Visualização do Cliente (usuario.html)
- Registro de clientes
- Navegação do cardápio
- Adição de itens ao carrinho
- Envio de pedidos
- Acompanhamento de status
- Pagamento via PIX

## Fluxos Importantes

### 1. Personalização do Estabelecimento
```
admin.html → "Mesas & QR Codes" → qr-management.html → "Configurações" → Preencher dados → "Salvar Personalizações"
```

### 2. Visualização do Cardápio Personalizado
```
Cliente escaneia QR code → usuario.html → Carrega personalizações do localStorage
```

### 3. Geração e Uso do QR Code
```
qr-management.html → "Mesas & QR Codes" → Visualizar QR Code → Imprimir → Posicionar nas mesas
```

### 4. Adição de Itens ao Cardápio
```
qr-management.html → "Cardápio" → "Adicionar Item" → Preencher formulário → "Adicionar Item"
```

## LocalStorage Keys Importantes

- `establishmentCustomizations` - Cores, informações e links sociais
- `establishmentLogo` - Logo do estabelecimento (data URL)
- `establishmentBackground` - Imagem de fundo (data URL)
- `menuItems` - Itens do cardápio
- `customerData` - Dados de registro do cliente
- `userOrders` - Histórico de pedidos do cliente

## Solução de Problemas Comuns

### Personalizações não aparecem para clientes
1. Verifique se clicou em "Salvar Personalizações"
2. Confirme que as personalizações estão salvas em `localStorage`
3. Teste em modo anônimo ou limpe o cache do navegador

### QR Code não funciona
1. Verifique se o QR code foi gerado corretamente
2. Teste escaneando com um leitor de QR code
3. Confirme que a URL aponta para o lugar correto

### Itens do cardápio não aparecem
1. Verifique se os itens foram salvos em `menuItems`
2. Confirme que estão com as categorias corretas
3. Verifique se a função `loadMenuItems()` está sendo chamada