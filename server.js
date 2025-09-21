const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require('ws');

const hostname = "127.0.0.1";
const httpPort = 3002;
const wsPort = 3002;

console.log('Attempting to start servers on port 3002...');

// Create HTTP server first
const server = http.createServer((req, res) => {
  // Remove query string (ex: ?developer=true)
  let filePath = "." + req.url.split("?")[0];

  // Log da requisição
  console.log(`📥 ${req.method} ${req.url} | Arquivo: ${filePath}`);

  // Se for a raiz, abre o index.html
  if (filePath === "./") {
    filePath = "./index.html";
  }

  // Resolve o caminho absoluto
  filePath = path.resolve(filePath);

  // Segurança: só serve arquivos dentro do diretório do projeto
  const projectDir = path.resolve(".");
  if (!filePath.startsWith(projectDir)) {
    res.statusCode = 403;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>403 Forbidden</h1>");
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // Página não encontrada
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end(`
          <html>
            <head>
              <title>404 Not Found</title>
              <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #e74c3c; }
              </style>
            </head>
            <body>
              <h1>404 - Página não encontrada</h1>
              <p>O arquivo solicitado não existe: ${req.url}</p>
              <a href="/">Voltar para a página inicial</a>
            </body>
          </html>
        `);
        console.error(`❌ Arquivo não encontrado: ${filePath}`);
      } else {
        // Erro interno
        res.statusCode = 500;
        res.setHeader("Content-Type", "text/html");
        res.end(`<h1>500 Internal Server Error</h1><p>${error.code}</p>`);
        console.error("🔥 Erro interno:", error);
      }
    } else {
      // Sucesso
      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      res.end(content, "utf-8");
      console.log(`✅ Servido com sucesso: ${filePath}`);
    }
  });
});

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".wav": "audio/wav",
  ".mp4": "video/mp4",
  ".woff": "application/font-woff",
  ".ttf": "application/font-ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "application/font-otf",
  ".wasm": "application/wasm",
};

// Store connected clients
const clients = new Set();

// Sample orders data
let orders = [
  {
    id: '#01-001',
    table: 'Mesa 01',
    customer: {
      fullName: 'João Silva',
      phone: '(11) 99999-9999'
    },
    items: [
      { name: 'Feijoada Completa', quantity: 1, price: 32.90, category: 'main' },
      { name: 'Refrigerante', quantity: 2, price: 7.90, category: 'drink' }
    ],
    subtotal: 48.70,
    serviceFee: 4.87,
    total: 53.57,
    status: 'pending',
    paymentStatus: 'pending',
    timestamp: new Date().toISOString()
  },
  {
    id: '#02-002',
    table: 'Mesa 02',
    customer: {
      fullName: 'Maria Oliveira',
      phone: '(11) 88888-8888'
    },
    items: [
      { name: 'Pudim de Leite', quantity: 1, price: 12.90, category: 'dessert' },
      { name: 'Suco de Laranja', quantity: 1, price: 8.90, category: 'drink' }
    ],
    subtotal: 21.80,
    serviceFee: 2.18,
    total: 23.98,
    status: 'preparing',
    paymentStatus: 'pending',
    timestamp: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
  },
  {
    id: '#03-003',
    table: 'Mesa 03',
    customer: {
      fullName: 'Carlos Santos',
      phone: '(11) 77777-7777'
    },
    items: [
      { name: 'Bife à Parmegiana', quantity: 1, price: 28.90, category: 'main' },
      { name: 'Arroz e Feijão', quantity: 1, price: 6.90, category: 'side' }
    ],
    subtotal: 35.80,
    serviceFee: 3.58,
    total: 39.38,
    status: 'ready',
    paymentStatus: 'completed',
    timestamp: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
  }
];

// Create WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.add(ws);
  
  // Send existing orders to new client
  ws.send(JSON.stringify({
    type: 'existingOrders',
    orders: orders
  }));
  
  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      if (data.type === 'getExistingOrders') {
        ws.send(JSON.stringify({
          type: 'existingOrders',
          orders: orders
        }));
      } else if (data.type === 'newOrder') {
        // Add new order
        orders.push(data.order);
        
        // Broadcast new order to all clients
        const newOrderMessage = JSON.stringify({
          type: 'newOrder',
          order: data.order
        });
        
        clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(newOrderMessage);
          }
        });
      } else if (data.type === 'updateStatus') {
        // Update order status
        const order = orders.find(o => o.id === data.orderId);
        if (order) {
          order.status = data.status;
          
          // Broadcast status update to all clients
          const updateMessage = JSON.stringify({
            type: 'statusUpdate',
            orderId: data.orderId,
            status: data.status
          });
          
          clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(updateMessage);
            }
          });
        }
      } else if (data.type === 'updatePaymentStatus') {
        // Update payment status
        const order = orders.find(o => o.id === data.orderId);
        if (order) {
          order.paymentStatus = data.paymentStatus;
          
          // Broadcast payment status update to all clients
          const updateMessage = JSON.stringify({
            type: 'paymentStatusUpdate',
            orderId: data.orderId,
            paymentStatus: data.paymentStatus
          });
          
          clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(updateMessage);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

// Start HTTP server
server.listen(httpPort, hostname, () => {
  console.log(`🚀 HTTP server running on: http://${hostname}:${httpPort}/`);
  console.log(`📂 Project directory: ${path.resolve(".")}`);
  console.log('WebSocket server attached to HTTP server on the same port');
});

// Simulate new orders every 30 seconds
setInterval(() => {
  const newOrder = {
    id: `#${Math.floor(Math.random() * 100)}-${Math.floor(1000 + Math.random() * 9000)}`,
    table: `Mesa 0${Math.floor(1 + Math.random() * 5)}`,
    customer: {
      fullName: `Cliente ${Math.floor(1000 + Math.random() * 9000)}`,
      phone: `(11) ${Math.floor(10000 + Math.random() * 90000)}-${Math.floor(1000 + Math.random() * 9000)}`
    },
    items: [
      { name: 'Feijoada Completa', quantity: 1, price: 32.90, category: 'main' },
      { name: 'Refrigerante', quantity: 1, price: 7.90, category: 'drink' }
    ],
    subtotal: 40.80,
    serviceFee: 4.08,
    total: 44.88,
    status: 'pending',
    paymentStatus: 'pending',
    timestamp: new Date().toISOString()
  };
  
  orders.push(newOrder);
  console.log('New order created:', newOrder.id);
  
  // Broadcast new order to all clients
  const newOrderMessage = JSON.stringify({
    type: 'newOrder',
    order: newOrder
  });
  
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(newOrderMessage);
    }
  });
}, 30000);