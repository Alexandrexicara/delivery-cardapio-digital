# Cardápio Digital Universal

Sistema completo de cardápio digital para restaurantes e estabelecimentos comerciais.

## Modelo de Negócio

O sistema funciona com um modelo de licenciamento único:
- O administrador do estabelecimento adquire o sistema por R$ 500,00
- Recebe acesso vitalício a todas as funcionalidades
- Recebe **um único QR code** para todo o estabelecimento (não um por mesa)
- Pode personalizar seu cardápio com logo, cores, imagens e informações

## Descrição

Este sistema permite que estabelecimentos comerciais ofereçam aos seus clientes um cardápio digital acessível via navegador (sem necessidade de aplicativo), onde os clientes podem fazer pedidos, escolher formas de pagamento e acompanhar o status do pedido em tempo real. O administrador pode gerenciar todos os pedidos, validar pagamentos PIX, gerar relatórios e personalizar completamente a aparência do cardápio.

## Estrutura do Sistema

### 1. Página Principal (index.html)
- Página de aquisição do sistema para administradores de estabelecimentos
- Banner comercial com preço de R$ 500,00
- Informações sobre o modelo de negócio e funcionalidades
- Formulário de compra e acesso à área administrativa

### 2. Área do Cliente (usuario.html)
- Acesso via **QR code único** do estabelecimento (mesmo QR code para todas as mesas)
- Interface personalizada com **todas as customizações feitas pelo administrador**:
  - Cores primárias e secundárias
  - Logo do estabelecimento
  - Imagem de fundo personalizada
  - Nome, slogan e informações do estabelecimento
  - Links para redes sociais
- Cadastro de clientes
- Navegação por categorias do cardápio
- Seleção de itens e quantidades
- Carrinho de compras
- Escolha de método de pagamento
- Acompanhamento de status do pedido
- Histórico de pedidos
- Repetição de pedidos anteriores
- Avaliação do atendimento
- Promoções automáticas (Happy Hour)

### 3. Área Administrativa (admin.html)
- Dashboard com estatísticas em tempo real
- Gerenciamento de pedidos
- Validação de pagamentos PIX
- Controle por setores (cozinha e balcão)
- Relatórios de vendas
- Controle de estoque
- Notificações em tempo real

### 4. Gerenciamento do Estabelecimento (qr-management.html)
- Personalização completa do estabelecimento:
  - Cores primárias e secundárias
  - Logo do estabelecimento
  - Imagem de fundo personalizada
  - Informações de contato (endereço, telefone, horário)
  - Links para redes sociais
- Geração do **QR code único** para todo o estabelecimento
- Gerenciamento do cardápio
- Configurações do estabelecimento

## Como Usar

### Para Estabelecimentos (Administração):
1. Acesse `index.html` e clique em "Adquirir Agora"
2. Preencha os dados do estabelecimento e finalize a compra (R$ 500,00)
3. Receba acesso imediato à área administrativa
4. Personalize seu estabelecimento (cores, logo, imagem de fundo, contatos)
5. **Todas as personalizações aparecem automaticamente para os clientes**
6. Receba seu **QR code único** para todo o estabelecimento
7. Imprima e posicione o **mesmo QR code** em todas as mesas

### Para Clientes:
1. Escaneie o **QR code único** do estabelecimento (mesmo em todas as mesas)
2. Acesse o cardápio digital personalizado com **a identidade visual completa do estabelecimento**
3. Faça seu pedido
4. Escolha a forma de pagamento
5. Acompanhe o status do pedido em tempo real

### Para Desenvolvedores:
Para acessar todas as funcionalidades do sistema como desenvolvedor, utilize os botões na seção "Área do Desenvolvedor/Criador" na página inicial (`index.html`) ou adicione o parâmetro `?developer=true` às URLs:
- `usuario.html?developer=true` - Interface do cliente em modo desenvolvedor
- `admin.html?developer=true` - Área administrativa em modo desenvolvedor
- `qr-management.html?developer=true` - Gerenciamento do estabelecimento em modo desenvolvedor

No modo desenvolvedor:
- Não é necessário preencher dados de estabelecimento ou cliente
- Todas as funcionalidades estão acessíveis
- As personalizações não são salvas permanentemente
- O sistema utiliza dados de exemplo para demonstração

## Funcionalidades

- Sistema de aquisição com pagamento único de R$ 500,00
- Acesso vitalício a todas as funcionalidades
- Cardápio digital acessível via navegador (sem app)
- **QR code único para todo o estabelecimento** (não por mesa)
- **Personalização completa visível para clientes**:
  - Cores primárias e secundárias aplicadas automaticamente
  - Logo do estabelecimento exibida no cabeçalho
  - Imagem de fundo personalizada
  - Informações de contato e redes sociais
- Sistema de pedidos com observações
- Pagamento via PIX com validação automática
- Distribuição de pedidos por setores (cozinha/balcão)
- Atualizações em tempo real do status do pedido
- Relatórios de vendas e desempenho
- Controle de estoque de ingredientes e produtos
- Sistema de avaliações de clientes
- Promoções automáticas (Happy Hour)
- Notificações em tempo real
- Repetição de pedidos anteriores

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript

## Requisitos

- Navegador web moderno

## Observações

Este é um frontend completo do sistema. Para um ambiente de produção, seria necessário implementar:
- Backend para processamento de dados
- Banco de dados para armazenamento de informações
- Sistema de autenticação
- Integração com API de pagamentos PIX
- Sistema de impressão de pedidos
- Hospedagem e domínio
- **Sistema de armazenamento e aplicação das personalizações do administrador**