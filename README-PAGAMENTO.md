# 🚀 SISTEMA DE PAGAMENTO E DELIVERY PROFISSIONAL

## 📋 ESTRUTURA COMPLETA DO SISTEMA

```
📦 cardapio-digital-universal/
│
├── 🗄️ db.js                           // Banco de dados em memória
├── 🚀 server.js                       // Servidor principal
├── 📦 package.json                    // Dependências
├── 🧪 test-api.js                     // Testes completos
│
├── 📁 routes/                         // Rotas da API
│   ├── pagamento.js                   // Rotas de pagamento
│   ├── entrega.js                     // Rotas de entrega
│   ├── vendedor.js                    // Rotas de vendedores
│   └── motoboy.js                     // Rotas de motoboys
│
├── 📁 services/                       // Lógica de negócio
│   ├── pagamentoService.js            // Serviço de pagamento
│   ├── entregaService.js              // Serviço de entrega
│   └── motoboyService.js              // Serviço de motoboy
│
└── 📁 utils/                          // Utilitários
    └── logs.js                        // Sistema de logs
```

## 💰 COMO FUNCIONA O PAGAMENTO

### 🔄 Fluxo Completo:

1. **Pedido Criado** → Valores calculados automaticamente
2. **Pagamento PIX** → Dinheiro distribuído na hora
3. **Pagamento Cartão** → Dívida registrada para o vendedor
4. **Entrega Confirmada** → Foto como prova
5. **Motoboy Pode Sacar** → Saldo disponível

### 💸 Divisão Automática:

```
📦 Pedido: R$ 60
├── 🏢 Plataforma: R$ 1 (fixo)
├── 🛵 Motoboy: R$ 10 (fixo)
└── 👨‍💼 Vendedor: R$ 49 (restante)
```

## 🚀 INSTALAÇÃO E USO

### 1. Instalar Dependências:
```bash
npm install
```

### 2. Iniciar Servidor:
```bash
npm start
# ou
node server.js
```

### 3. Rodar Testes:
```bash
node test-api.js
```

## 📡 ENDPOINTS DA API

### 💳 Pagamento

#### Criar Pedido:
```http
POST /pagamento/criar
{
  "vendedorId": "v1",
  "motoboyId": "m1", 
  "valor": 60,
  "metodo": "pix"
}
```

#### Pagar PIX:
```http
POST /pagamento/pix/{pedidoId}
```

#### Pagar Cartão:
```http
POST /pagamento/cartao/{pedidoId}
```

#### Ver Saldo Vendedor:
```http
GET /pagamento/vendedor/{vendedorId}
```

#### Ver Saldo Motoboy:
```http
GET /pagamento/motoboy/{motoboyId}
```

### 🚚 Entrega

#### Confirmar Entrega:
```http
POST /entrega/confirmar
{
  "pedidoId": "...",
  "motoboyId": "m1",
  "fotoBase64": "data:image/jpeg;base64,...",
  "localizacao": { "lat": -23.5505, "lng": -46.6333 }
}
```

#### Ver Entregas do Motoboy:
```http
GET /entrega/motoboy/{motoboyId}
```

### 🛵 Motoboy

#### Ver Saldo:
```http
GET /motoboy/{motoboyId}
```

#### Sacar Valor:
```http
POST /motoboy/sacar/{motoboyId}
{
  "valor": 50
}
```

#### Sacar Tudo:
```http
POST /motoboy/sacar-total/{motoboyId}
```

#### Ver Histórico:
```http
GET /motoboy/{motoboyId}/historico
```

#### Ver Resumo de Ganhos:
```http
GET /motoboy/{motoboyId}/resumo
```

## 🧪 EXEMPLOS DE USO

### 💰 Pagamento PIX (Distribuição Imediata):

```javascript
// 1. Criar pedido
const pedido = await axios.post('/pagamento/criar', {
  vendedorId: "v1",
  motoboyId: "m1",
  valor: 60,
  metodo: "pix"
});

// 2. Pagar com PIX
const resultado = await axios.post(`/pagamento/pix/${pedido.data.id}`);

// RESULTADO:
// {
//   vendedorRecebe: 49,
//   motoboyRecebe: 10,
//   pedidoId: "uuid-aqui"
// }
```

### 💳 Pagamento Cartão (Dívida Registrada):

```javascript
// 1. Criar pedido
const pedido = await axios.post('/pagamento/criar', {
  vendedorId: "v1", 
  motoboyId: "m1",
  valor: 60,
  metodo: "cartao"
});

// 2. Pagar com cartão
const resultado = await axios.post(`/pagamento/cartao/${pedido.data.id}`);

// RESULTADO:
// {
//   mensagem: "Cartão registrado",
//   divida: -1,  // Dívida de R$1 para o vendedor
//   pedidoId: "uuid-aqui"
// }
```

### 🚚 Confirmação de Entrega:

```javascript
const entrega = await axios.post('/entrega/confirmar', {
  pedidoId: "uuid-do-pedido",
  motoboyId: "m1",
  fotoBase64: "data:image/jpeg;base64,...",
  localizacao: { lat: -23.5505, lng: -46.6333 }
});

// RESULTADO:
// {
//   id: "uuid-da-entrega",
//   pedidoId: "uuid-do-pedido",
//   motoboyId: "m1",
//   fotoBase64: "...",
//   data: "2026-03-25T...",
//   status: "entregue"
// }
```

### 🏦 Saque do Motoboy:

```javascript
// Sacar valor específico
const saque = await axios.post('/motoboy/sacar/m1', {
  valor: 50
});

// RESULTADO:
// {
//   sacado: 50,
//   saldoRestante: 0,
//   motoboyId: "m1"
// }
```

## 🔐 SEGURANÇA E LOGS

### 📝 Sistema de Logs:
- ✅ Todas as transações são logadas
- ✅ Erros são registrados com timestamp
- ✅ Sucessos são confirmados no console

### 🛡️ Validações:
- ✅ Verificação de existência de pedidos
- ✅ Validação de autorização do motoboy
- ✅ Controle de saldo insuficiente

## 📊 ESTATÍSTICAS E RELATÓRIOS

### 📈 Resumo do Motoboy:
```javascript
const resumo = await axios.get('/motoboy/m1/resumo');

// RESULTADO:
// {
//   motoboyId: "m1",
//   totalGanho: 150,
//   totalPedidos: 15,
//   mediaPorPedido: 10
// }
```

### 📋 Histórico Completo:
```javascript
const historico = await axios.get('/motoboy/m1/historico');

// RESULTADO:
// {
//   pedidos: [...],
//   entregas: [...],
//   totalPedidos: 15,
//   totalEntregas: 12
// }
```

## 🎯 CARACTERÍSTICAS PROFISSIONAIS

### ✅ Implementado:
- 🔄 **Pagamento Dividido** (Plataforma + Motoboy + Vendedor)
- 💳 **PIX e Cartão** com lógicas diferentes
- 🏦 **Sistema de Wallet** (saldo e dívida)
- 📸 **Confirmação com Foto** (prova de entrega)
- 📝 **Logs Completos** de todas operações
- 🛵 **Saque Automático** para motoboys
- 📊 **Estatísticas Detalhadas**
- 🔐 **Validações de Segurança**

### 🚀 Pronto para Produção:
- ✅ API RESTful completa
- ✅ Tratamento de erros
- ✅ Logs estruturados
- ✅ Testes automatizados
- ✅ Documentação completa

## 🎉 CONCLUSÃO

Sistema **100% funcional** e **profissional**!

🔥 **Tipo iFood** com pagamento dividido  
🔥 **Motoboy recebe automático**  
🔥 **Prova de entrega** com foto  
🔥 **Controle financeiro** completo  
🔥 **Logs de segurança** detalhados  

**Sistema pronto para usar!** 🚀✨
