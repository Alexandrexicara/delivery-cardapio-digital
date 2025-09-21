const WebSocket = require('ws');

// Connect to the server
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
  console.log('Connected to server');
  
  // Send a test order with specific ID #13
  const testOrder = {
    type: 'submitOrder',
    order: {
      id: '#13-1757774567890', // Specific order ID #13
      customer: {
        fullName: 'Test Customer',
        phone: '123456789',
        cpf: '123.456.789-00',
        tableNumber: '05'
      },
      items: [
        {
          name: 'Test Item 1',
          quantity: 2,
          price: 15.50,
          category: 'main'
        },
        {
          name: 'Test Item 2',
          quantity: 1,
          price: 8.75,
          category: 'drink'
        }
      ],
      observations: 'No special requests',
      table: 'Mesa 05'
    }
  };
  
  console.log('Sending test order #13:', testOrder);
  ws.send(JSON.stringify(testOrder));
});

ws.on('message', function incoming(data) {
  const message = JSON.parse(data);
  console.log('Received message:', message);
  
  if (message.type === 'orderConfirmation') {
    console.log('Order #13 confirmed with ID:', message.orderId);
    ws.close();
  }
});

ws.on('close', function close() {
  console.log('Disconnected from server');
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});