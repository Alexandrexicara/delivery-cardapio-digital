// Simple test to verify order and payment functionality
const WebSocket = require('ws');

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:3002');

ws.on('open', function open() {
  console.log('Connected to server');
  
  // Send a test order
  const testOrder = {
    type: 'submitOrder',
    order: {
      id: '#TEST-001',
      customer: {
        fullName: 'Test Customer',
        phone: '(11) 99999-9999',
        tableNumber: '05'
      },
      items: [
        { name: 'Test Item', quantity: 1, price: 10.00, category: 'test' }
      ],
      subtotal: 10.00,
      serviceFee: 1.00,
      total: 11.00,
      table: 'Mesa 05',
      status: 'pending',
      paymentStatus: 'pending',
      timestamp: new Date().toISOString()
    }
  };
  
  console.log('Sending test order...');
  ws.send(JSON.stringify(testOrder));
});

ws.on('message', function incoming(data) {
  const message = JSON.parse(data);
  console.log('Received:', message);
  
  if (message.type === 'orderConfirmation') {
    console.log('Order confirmed! Now testing payment update...');
    
    // Send a payment status update
    const paymentUpdate = {
      type: 'updatePaymentStatus',
      orderId: '#TEST-001',
      paymentStatus: 'completed'
    };
    
    console.log('Sending payment update...');
    ws.send(JSON.stringify(paymentUpdate));
  } else if (message.type === 'paymentStatusUpdate') {
    console.log('Payment status updated successfully!');
    console.log('Test completed successfully.');
    ws.close();
  }
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
});

ws.on('close', function close() {
  console.log('Connection closed');
});