const fs = require('fs');
const path = require('path');

// Read the orders file
const ordersFilePath = path.join(__dirname, 'orders.json');
const orders = JSON.parse(fs.readFileSync(ordersFilePath, 'utf8'));

console.log('=== ORDER VERIFICATION REPORT ===\n');

// Count orders by table
const tableCounts = {};
let totalOrders = 0;
let ordersWithValidCustomerData = 0;

orders.forEach(order => {
  totalOrders++;
  
  // Count by table
  if (tableCounts[order.table]) {
    tableCounts[order.table]++;
  } else {
    tableCounts[order.table] = 1;
  }
  
  // Check if customer data is valid
  if (order.customer && Object.keys(order.customer).length > 0) {
    ordersWithValidCustomerData++;
  }
});

console.log(`Total Orders: ${totalOrders}`);
console.log(`Orders with Valid Customer Data: ${ordersWithValidCustomerData}`);
console.log(`Orders with Missing Customer Data: ${totalOrders - ordersWithValidCustomerData}\n`);

console.log('Orders by Table:');
Object.keys(tableCounts).sort().forEach(table => {
  console.log(`  ${table}: ${tableCounts[table]} orders`);
});

console.log('\n=== VERIFICATION COMPLETE ===');

// Check if the system is working correctly
if (ordersWithValidCustomerData === totalOrders) {
  console.log('\n✅ SUCCESS: All orders have valid customer data!');
} else {
  console.log(`\n⚠️  WARNING: ${totalOrders - ordersWithValidCustomerData} orders still have missing customer data.`);
}

// Check for variety in tables
const uniqueTables = Object.keys(tableCounts).length;
if (uniqueTables > 1) {
  console.log(`\n✅ SUCCESS: Orders are distributed across ${uniqueTables} different tables.`);
} else {
  console.log('\n⚠️  WARNING: All orders are on the same table.');
}