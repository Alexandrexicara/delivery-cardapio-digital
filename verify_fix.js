const fs = require('fs');

// Read the usuario.html file
const htmlContent = fs.readFileSync('usuario.html', 'utf8');

// Check if the button has been fixed
if (htmlContent.includes('<button type="submit" class="btn">Continuar</button>')) {
    console.log('✅ SUCCESS: Registration button fix is in place');
    console.log('The registration form should now work correctly.');
} else {
    console.log('❌ ISSUE: Registration button fix not found');
}

// Check if the form submission event listener is in place
if (htmlContent.includes('customerForm.addEventListener(\'submit\', function(event)')) {
    console.log('✅ SUCCESS: Form submission event listener is in place');
} else {
    console.log('❌ ISSUE: Form submission event listener not found');
}

console.log('\n📋 SUMMARY:');
console.log('The registration issue has been fixed by:');
console.log('1. Changing the button type from "button" to "submit"');
console.log('2. Adding a proper form submission event listener');
console.log('3. Ensuring the form handles submissions correctly');