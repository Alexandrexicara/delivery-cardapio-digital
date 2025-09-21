const WebSocket = require('ws');

// Connect to the server
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
  console.log('Connected to server');
  
  // Send a test order with customer data
  const testOrder = {
    type: 'submitOrder',
    order: {
      customer: {
        fullName: 'John Doe',
        phone: '123456789',
        cpf: '123.456.789-00',
        tableNumber: '10'
      },
      items: [
        {
          name: 'Test Item',
          quantity: 2,
          price: 10.50,
          category: 'main'
        }
      ],
      observations: 'No onions please',
      table: 'Mesa 10'
    }
  };
  
  console.log('Sending test order:', testOrder);
  ws.send(JSON.stringify(testOrder));
});

ws.on('message', function incoming(data) {
  const message = JSON.parse(data);
  console.log('Received message:', message);
  
  if (message.type === 'orderConfirmation') {
    console.log('Order confirmed with ID:', message.orderId);
    ws.close();
  }
});

ws.on('close', function close() {
  console.log('Disconnected from server');
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});