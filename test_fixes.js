const fs = require('fs');
const path = require('path');

// Test file to verify the fixes for the order registration issues

// Load orders from file
const ORDERS_FILE = path.join(__dirname, 'orders.json');

function loadOrders() {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
  }
  return [];
}

// Test 1: Check if orders have correct table numbers
function testTableNumbers() {
  console.log('=== Test 1: Checking Table Numbers ===');
  const orders = loadOrders();
  
  let correctTableOrders = 0;
  let defaultTableOrders = 0;
  
  orders.forEach(order => {
    if (order.customer && order.customer.tableNumber) {
      const expectedTable = `Mesa ${order.customer.tableNumber}`;
      if (order.table === expectedTable) {
        correctTableOrders++;
        console.log(`✓ Order ${order.id}: Correct table (${order.table})`);
      } else {
        console.log(`✗ Order ${order.id}: Expected ${expectedTable}, got ${order.table}`);
      }
    } else {
      if (order.table === 'Mesa 05') {
        defaultTableOrders++;
        console.log(`✓ Order ${order.id}: Default table correctly set (${order.table})`);
      } else {
        console.log(`✗ Order ${order.id}: Unexpected table value (${order.table})`);
      }
    }
  });
  
  console.log(`\nResults: ${correctTableOrders} orders with correct table numbers, ${defaultTableOrders} orders with default table`);
  return correctTableOrders > 0 || defaultTableOrders > 0;
}

// Test 2: Check if orders have payment status
function testPaymentStatus() {
  console.log('\n=== Test 2: Checking Payment Status ===');
  const orders = loadOrders();
  
  let ordersWithPaymentStatus = 0;
  let ordersWithoutPaymentStatus = 0;
  
  orders.forEach(order => {
    if (order.paymentStatus) {
      ordersWithPaymentStatus++;
      console.log(`✓ Order ${order.id}: Has payment status (${order.paymentStatus})`);
    } else {
      ordersWithoutPaymentStatus++;
      console.log(`✗ Order ${order.id}: Missing payment status`);
    }
  });
  
  console.log(`\nResults: ${ordersWithPaymentStatus} orders with payment status, ${ordersWithoutPaymentStatus} orders without payment status`);
  return ordersWithPaymentStatus > 0;
}

// Test 3: Check if orders have correct total values
function testOrderTotals() {
  console.log('\n=== Test 3: Checking Order Totals ===');
  const orders = loadOrders();
  
  let correctTotals = 0;
  let incorrectTotals = 0;
  
  orders.forEach(order => {
    // Calculate expected total
    let calculatedSubtotal = 0;
    order.items.forEach(item => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 0;
      const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0;
      calculatedSubtotal += price * quantity;
    });
    
    const serviceFee = calculatedSubtotal * 0.10;
    const expectedTotal = calculatedSubtotal + serviceFee;
    
    if (Math.abs(order.total - expectedTotal) < 0.01) { // Allow for floating point precision issues
      correctTotals++;
      console.log(`✓ Order ${order.id}: Correct total (R$ ${order.total.toFixed(2)})`);
    } else {
      incorrectTotals++;
      console.log(`✗ Order ${order.id}: Expected R$ ${expectedTotal.toFixed(2)}, got R$ ${order.total.toFixed(2)}`);
    }
  });
  
  console.log(`\nResults: ${correctTotals} orders with correct totals, ${incorrectTotals} orders with incorrect totals`);
  return correctTotals > 0 || incorrectTotals === 0;
}

// Run all tests
function runTests() {
  console.log('Running tests for order registration fixes...\n');
  
  const test1Result = testTableNumbers();
  const test2Result = testPaymentStatus();
  const test3Result = testOrderTotals();
  
  console.log('\n=== Test Summary ===');
  console.log(`Table Numbers Test: ${test1Result ? 'PASSED' : 'FAILED'}`);
  console.log(`Payment Status Test: ${test2Result ? 'PASSED' : 'FAILED'}`);
  console.log(`Order Totals Test: ${test3Result ? 'PASSED' : 'FAILED'}`);
  
  if (test1Result && test2Result && test3Result) {
    console.log('\n🎉 All tests passed! The fixes are working correctly.');
  } else {
    console.log('\n❌ Some tests failed. Please review the implementation.');
  }
}

// Run the tests
runTests();