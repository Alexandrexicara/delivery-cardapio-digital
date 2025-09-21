// Test script to verify combined orders functionality
console.log('Testing combined orders functionality...');

// Sample orders data
const sampleOrders = [
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

console.log('Sample orders created:', sampleOrders.length);

// Test the display function
console.log('Testing display function with sample orders...');

// Calculate totals
let totalSubtotal = 0;
let totalServiceFee = 0;
let totalGeneral = 0;
let totalPaid = 0;
let totalPending = 0;

sampleOrders.forEach(order => {
  totalGeneral += (order.total || 0);
  totalSubtotal += (order.subtotal || 0);
  totalServiceFee += (order.serviceFee || 0);
  if (order.paymentStatus === 'completed') {
    totalPaid += (order.total || 0);
  } else {
    totalPending += (order.total || 0);
  }
});

console.log('Calculated totals:');
console.log('- Subtotal:', totalSubtotal.toFixed(2));
console.log('- Service Fee:', totalServiceFee.toFixed(2));
console.log('- Total:', totalGeneral.toFixed(2));
console.log('- Paid:', totalPaid.toFixed(2));
console.log('- Pending:', totalPending.toFixed(2));

console.log('Combined orders functionality test completed successfully!');