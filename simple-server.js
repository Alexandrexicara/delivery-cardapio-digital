const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

// Create HTTP server on port 3000
const server = http.createServer((req, res) => {
  // Serve static files
  let filePath = '.' + req.url;
  
  // If root path, serve index.html
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif'
  };
  
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Create WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

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
      { name: 'Feijoada Completa', quantity: 1, price: 32.90 },
      { name: 'Refrigerante', quantity: 2, price: 7.90 }
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
      { name: 'Pudim de Leite', quantity: 1, price: 12.90 },
      { name: 'Suco de Laranja', quantity: 1, price: 8.90 }
    ],
    subtotal: 21.80,
    serviceFee: 2.18,
    total: 23.98,
    status: 'preparing',
    paymentStatus: 'pending',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

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

// Start server on port 3000
server.listen(3000, '127.0.0.1', () => {
  console.log('Server running on http://localhost:3000');
  console.log('WebSocket server attached to HTTP server');
});