const WebSocket = require('ws');

// Connect to the server
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
  console.log('Connected to server');
  
  // Send payment status update for order #13
  const paymentUpdate = {
    type: 'updatePaymentStatus',
    orderId: '#13-1757774567890', // Specific order ID #13
    paymentStatus: 'completed',
    updatedBy: 'test'
  };
  
  console.log('Sending payment update for order #13:', paymentUpdate);
  ws.send(JSON.stringify(paymentUpdate));
  
  // Close connection after a short delay
  setTimeout(() => {
    ws.close();
  }, 1000);
});

ws.on('message', function incoming(data) {
  const message = JSON.parse(data);
  console.log('Received message:', message);
});

ws.on('close', function close() {
  console.log('Disconnected from server');
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});