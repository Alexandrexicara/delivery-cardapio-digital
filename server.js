const hostname = '0.0.0.0'; // Aceita conexões de qualquer dispositivo na rede
const httpPort = 3002; // Changed to 3002 as requested
const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require('ws');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads/';
    if (!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload endpoint for images
app.post('/upload/:type', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  console.log(`📁 Image uploaded: ${imageUrl}`);

  res.json({
    success: true,
    imageUrl: imageUrl,
    message: 'Image uploaded successfully'
  });
});

// Serve static files
app.use(express.static('.'));

// Function to determine establishment based on subdomain
function getEstablishmentIdFromSubdomain(req) {
  const host = req.get('Host');
  if (!host) return null;
  
  // Extract subdomain from host (assuming format: subdomain.cardapiodigital.com.br)
  const parts = host.split('.');
  if (parts.length >= 3 && parts[parts.length - 2] === 'cardapiodigital' && parts[parts.length - 1] === 'com.br') {
    // This is a subdomain request
    return parts[0];
  }
  
  return null; // Default domain, no specific establishment
}

// Middleware to set establishment context based on subdomain
app.use((req, res, next) => {
  const establishmentId = getEstablishmentIdFromSubdomain(req);
  if (establishmentId) {
    req.establishmentId = establishmentId;
    console.log(`[SERVER] Request for establishment: ${establishmentId}`);
  }
  next();
});

// Middleware to handle subdomain routing
app.get('*', (req, res, next) => {
  const establishmentId = req.establishmentId;
  if (establishmentId) {
    // This is a subdomain request, serve the user interface
    console.log(`[SERVER] Serving usuario for establishment: ${establishmentId}`);
    
    // For now, we'll serve usuario.html for subdomain requests
    // In a real implementation, you would validate that the establishment exists
    res.sendFile(path.resolve('usuario.html'));
    return;
  }
  
  // If no subdomain, continue to next middleware (which will serve index.html for root path)
  next();
});

// Fallback route for SPA - Only for root path
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

// Store connected clients and associate them with orders
const clients = new Map(); // Using a Map to store ws connection with an ID
let clientIdCounter = 0; // Track client ID

// Start with an empty list of orders for production
let orders = [];

// Add paymentStatus to any existing orders that might not have it
orders.forEach(order => {
  if (!order.paymentStatus) {
    order.paymentStatus = 'pending';
  }
});

// Create WebSocket server attached to the HTTP server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  const clientId = ++clientIdCounter;
  clients.set(clientId, ws);
  ws.clientId = clientId; // Attach clientId to the ws object for later reference
  console.log(`New client connected with ID: ${clientId}`);
  
  // Send existing orders to new client based on role
  ws.send(JSON.stringify({
    type: 'existingOrders',
    orders: ws.role === 'admin' ? orders : orders.filter(order => order.clientId === ws.clientId)
  }));
  
  // Handle messages from client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Received:', data);
      
      if (data.type === 'userLogin') {
        // Set client role to user
        ws.role = 'user';
        ws.send(JSON.stringify({ type: 'userLoginSuccess' }));
      } else if (data.type === 'adminLogin') {
        // Set client role to admin
        ws.role = 'admin';
        ws.send(JSON.stringify({ type: 'adminLoginSuccess' }));
      } else if (data.type === 'kitchenLogin') {
        // Set client role to kitchen staff
        ws.role = 'kitchen';
        ws.send(JSON.stringify({ type: 'kitchenLoginSuccess' }));
      } else if (data.type === 'counterLogin') {
        // Set client role to counter staff
        ws.role = 'counter';
        ws.send(JSON.stringify({ type: 'counterLoginSuccess' }));
      } else if (data.type === 'waiterLogin') {
        // Set client role to waiter
        ws.role = 'waiter';
        ws.send(JSON.stringify({ type: 'waiterLoginSuccess' }));
      } else if (data.type === 'getExistingOrders') {
        console.log('Sending existing orders to client');
        const userOrders = orders.filter(order => order.clientId === ws.clientId);
        
        // Send different orders based on role
        let ordersToSend = [];
        if (ws.role === 'admin') {
          ordersToSend = orders;
        } else if (ws.role === 'kitchen') {
          // Kitchen staff only see orders with items for kitchen sector
          ordersToSend = orders.filter(order => {
            return order.items.some(item => item.sector === 'kitchen') &&
              (order.status === 'pending' || order.status === 'preparing');
          });
        } else if (ws.role === 'counter') {
          // Counter staff only see orders with items for counter sector
          ordersToSend = orders.filter(order => {
            return order.items.some(item => item.sector === 'counter') &&
              (order.status === 'pending' || order.status === 'preparing');
          });
        } else {
          // Regular users only see their own orders
          ordersToSend = userOrders;
        }
        
        ws.send(JSON.stringify({
          type: 'existingOrders',
          orders: ordersToSend
        }));
      } else if (data.type === 'submitOrder') {
        // Handle submitted order from customer
        if (data.order) {
          console.log('Processing submitted order:', data.order.id);
          // Add the new order to the orders array and associate with the client's WebSocket
          const orderData = { ...data.order, clientId: ws.clientId };
          orders.push(orderData);
          
          // Broadcast new order to all relevant clients
          const newOrderMessage = JSON.stringify({
            type: 'newOrder',
            order: data.order
          });
          
          // Send to admins
          clients.forEach((client, id) => {
            if (client.role === 'admin' && client.readyState === WebSocket.OPEN) {
              client.send(newOrderMessage);
            }
          });
          
          // Send to kitchen staff if order has items for kitchen sector
          const hasKitchenItems = data.order.items.some(item => item.sector === 'kitchen');
          if (hasKitchenItems) {
            clients.forEach((client, id) => {
              if (client.role === 'kitchen' && client.readyState === WebSocket.OPEN) {
                client.send(newOrderMessage);
              }
            });
          }
          
          // Send to counter staff if order has items for counter sector
          const hasCounterItems = data.order.items.some(item => item.sector === 'counter');
          if (hasCounterItems) {
            clients.forEach((client, id) => {
              if (client.role === 'counter' && client.readyState === WebSocket.OPEN) {
                client.send(newOrderMessage);
              }
            });
          }
          
          // Send to waiters
          clients.forEach((client, id) => {
            if (client.role === 'waiter' && client.readyState === WebSocket.OPEN) {
              client.send(newOrderMessage);
            }
          });
          
          // Send confirmation back to the customer
          console.log('Sending order confirmation to customer');
          ws.send(JSON.stringify({
            type: 'orderConfirmation',
            orderId: data.order.id
          }));
        }
      } else if (data.type === 'updateStatus') {
        // Update order status
        console.log('[DEBUG] Servidor: Recebida solicitação de atualização de status', data);
        const order = orders.find(o => o.id === data.orderId);
        if (order) {
          console.log('[DEBUG] Servidor: Pedido encontrado, atualizando status de', order.status, 'para', data.status);
          order.status = data.status;
          
          // Broadcast status update to all relevant clients
          const updateMessage = JSON.stringify({
            type: 'statusUpdate',
            orderId: data.orderId,
            status: data.status
          });
          console.log('[DEBUG] Servidor: Mensagem de atualização criada', updateMessage);
          
          // Send to admins
          console.log('[DEBUG] Servidor: Enviando atualização para admins');
          let adminCount = 0;
          clients.forEach((client, id) => {
            if (client.role === 'admin' && client.readyState === WebSocket.OPEN) {
              console.log('[DEBUG] Servidor: Enviando para admin', id);
              client.send(updateMessage);
              adminCount++;
            }
          });
          console.log('[DEBUG] Servidor: Total de admins notificados:', adminCount);
          
          // Send to kitchen staff for all status updates
          // Kitchen should see the entire order lifecycle
          console.log('[DEBUG] Servidor: Enviando atualização para cozinha');
          let kitchenCount = 0;
          clients.forEach((client, id) => {
            if (client.role === 'kitchen' && client.readyState === WebSocket.OPEN) {
              console.log('[DEBUG] Servidor: Enviando para cozinha', id);
              client.send(updateMessage);
              kitchenCount++;
            }
          });
          console.log('[DEBUG] Servidor: Total de cozinheiros notificados:', kitchenCount);
          
          // Send to counter staff for all status updates
          // Counter should see the entire order lifecycle
          console.log('[DEBUG] Servidor: Enviando atualização para balcão');
          let counterCount = 0;
          clients.forEach((client, id) => {
            if (client.role === 'counter' && client.readyState === WebSocket.OPEN) {
              console.log('[DEBUG] Servidor: Enviando para balcão', id);
              client.send(updateMessage);
              counterCount++;
            }
          });
          console.log('[DEBUG] Servidor: Total de balcões notificados:', counterCount);
          
          // Send to waiters for all status updates
          console.log('[DEBUG] Servidor: Enviando atualização para garçons');
          let waiterCount = 0;
          clients.forEach((client, id) => {
            if (client.role === 'waiter' && client.readyState === WebSocket.OPEN) {
              console.log('[DEBUG] Servidor: Enviando para garçom', id);
              client.send(updateMessage);
              waiterCount++;
            }
          });
          console.log('[DEBUG] Servidor: Total de garçons notificados:', waiterCount);
          
          // Send to the user who owns the order
          const orderOwnerClient = clients.get(order.clientId);
          if (orderOwnerClient && orderOwnerClient.readyState === WebSocket.OPEN) {
            console.log('[DEBUG] Servidor: Enviando atualização para o cliente dono do pedido');
            orderOwnerClient.send(updateMessage);
            
            // Send additional notification messages based on status
            let notificationMessage = '';
            switch (data.status) {
              case 'preparing':
                notificationMessage = 'Seu pedido está sendo preparado. Aguarde um momento.';
                break;
              case 'ready':
                notificationMessage = 'Seu pedido está pronto e a caminho!';
                break;
              case 'delivered':
                notificationMessage = 'Seu pedido foi entregue. Bom apetite!';
                break;
            }
            
            if (notificationMessage) {
              const notificationMsg = JSON.stringify({
                type: 'orderNotification',
                message: notificationMessage,
                status: data.status
              });
              console.log('[DEBUG] Servidor: Enviando notificação especial para cliente', notificationMsg);
              orderOwnerClient.send(notificationMsg);
            }
          } else {
            console.log('[DEBUG] Servidor: Cliente dono do pedido não encontrado ou não conectado');
          }
        } else {
          console.log('[DEBUG] Servidor: Pedido não encontrado:', data.orderId);
        }
      } else if (data.type === 'updatePaymentStatus') {
        // Update payment status
        console.log('Updating payment status for order:', data.orderId, 'to', data.paymentStatus);
        const order = orders.find(o => o.id === data.orderId);
        if (order) {
          order.paymentStatus = data.paymentStatus;
          
          // Broadcast payment status update to all relevant clients
          const updateMessage = JSON.stringify({
            type: 'paymentStatusUpdate',
            orderId: data.orderId,
            paymentStatus: data.paymentStatus
          });
          
          // Send to admins
          clients.forEach((client, id) => {
            if (client.role === 'admin' && client.readyState === WebSocket.OPEN) {
              client.send(updateMessage);
            }
          });
          
          // Send to waiters
          clients.forEach((client, id) => {
            if (client.role === 'waiter' && client.readyState === WebSocket.OPEN) {
              client.send(updateMessage);
            }
          });
          
          // Send to the user who owns the order
          const orderOwnerClient = clients.get(order.clientId);
          if (orderOwnerClient && orderOwnerClient.readyState === WebSocket.OPEN) {
            orderOwnerClient.send(updateMessage);
          }
        } else {
          console.log('Order not found:', data.orderId);
        }
      } else if (data.type === 'paymentConfirmed') {
        console.log('Payment confirmed for order:', data.orderId);
        const orderIndex = orders.findIndex(o => o.id === data.orderId);
        if (orderIndex > -1) {
          const order = orders[orderIndex];
          const userClientId = order.clientId; // Store the client ID
          const userClient = clients.get(userClientId);

          if (userClient && userClient.readyState === WebSocket.OPEN) {
            console.log(`Sending clearHistory to client ${userClientId} for order ${order.id}`);
            userClient.send(JSON.stringify({ type: 'clearHistory' }));
          } else {
            console.log(`Client ${userClientId} not found or not connected.`);
          }

          // Remove ALL orders from the same client (not just one)
          const ordersToRemove = [];
          for (let i = orders.length - 1; i >= 0; i--) {
            if (orders[i].clientId === userClientId) {
              ordersToRemove.push(orders[i].id);
              orders.splice(i, 1);
            }
          }
          
          console.log(`Removed ${ordersToRemove.length} orders for client ${userClientId}`);
          
          // Notify all admins that the orders are completed and removed
          ordersToRemove.forEach(orderId => {
            const removalMessage = JSON.stringify({ type: 'orderRemoved', orderId: orderId });
            
            // Send to admins only
            clients.forEach((client, id) => {
              if (client.role === 'admin' && client.readyState === WebSocket.OPEN) {
                client.send(removalMessage);
              }
            });
          });

        } else {
          console.log('Order not found for payment confirmation:', data.orderId);
        }
      } else if (data.type === 'notifyWaiterForDelivery') {
        // Handle notify waiter for delivery request from kitchen/counter
        console.log('[DEBUG] Servidor: Notificação de entrega recebida para pedido:', data.orderId);
        
        // Broadcast notification to all waiter clients and admins
        const notifyWaiterMessage = JSON.stringify({
          type: 'notifyWaiterForDelivery',
          orderId: data.orderId,
          message: `Pedido ${data.orderId} está pronto para entrega. Favor buscar na cozinha/balcão.`
        });
        
        let waiterCount = 0;
        clients.forEach((client, id) => {
          if (client.role === 'waiter' && client.readyState === WebSocket.OPEN) {
            console.log('[DEBUG] Servidor: Enviando notificação para garçom', id);
            client.send(notifyWaiterMessage);
            waiterCount++;
          }
        });
        
        // Also notify admins
        clients.forEach((client, id) => {
          if (client.role === 'admin' && client.readyState === WebSocket.OPEN) {
            client.send(notifyWaiterMessage);
          }
        });
        
        console.log('[DEBUG] Servidor: Total de garçons notificados:', waiterCount);
      } else if (data.type === 'callWaiter') {
        // Handle call waiter request from customer
        console.log('Call waiter request received for table:', data.table, 'payment method:', data.paymentMethod);
        
        // Broadcast call waiter request to all admin clients and waiters
        const callWaiterMessage = JSON.stringify({
          type: 'callWaiter',
          table: data.table,
          paymentMethod: data.paymentMethod,
          orderId: data.orderId
        });
        
        clients.forEach((client, id) => {
          if ((client.role === 'admin' || client.role === 'waiter') && client.readyState === WebSocket.OPEN) {
            client.send(callWaiterMessage);
          }
        });
        
        // Send confirmation back to the customer
        ws.send(JSON.stringify({
          type: 'callWaiterConfirmation',
          message: 'Garçom foi notificado e virá até sua mesa.'
        }));
      } else if (data.type === 'sendMessageToClient') {
        // Handle send message to client request from admin
        console.log('Send message to client request received for order:', data.orderId, 'message:', data.message);
        
        // Find the order and the client who owns it
        const order = orders.find(o => o.id === data.orderId);
        if (order) {
          const clientOwner = clients.get(order.clientId);
          if (clientOwner && clientOwner.readyState === WebSocket.OPEN) {
            // Send message to the client
            clientOwner.send(JSON.stringify({
              type: 'adminMessage',
              message: data.message
            }));
            
            // Send confirmation back to the admin
            ws.send(JSON.stringify({
              type: 'messageSent',
              message: 'Mensagem enviada com sucesso para o cliente.'
            }));
          } else {
            // Send error back to the admin
            ws.send(JSON.stringify({
              type: 'messageError',
              message: 'Cliente não está conectado no momento.'
            }));
          }
        } else {
          // Send error back to the admin
          ws.send(JSON.stringify({
              type: 'messageError',
              message: 'Pedido não encontrado.'
          }));
        }
      } else {
        console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    console.log(`Client ${ws.clientId} disconnected`);
    clients.delete(ws.clientId);
  });
});

// Start HTTP server
server.listen(httpPort, hostname, () => {
  console.log(` HTTP server running on: http://${hostname}:${httpPort}/`);
  console.log(` Project directory: ${path.resolve(".")}`);
  console.log(`📂 Project directory: ${path.resolve(".")}`);
  console.log('WebSocket server attached to HTTP server on the same port');
});

// The order simulation has been removed for production use.