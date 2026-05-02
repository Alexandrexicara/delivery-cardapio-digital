const fs = require('fs');
const content = fs.readFileSync('totem.html', 'utf8');
const scriptStart = content.indexOf('<script>', 10000) + 8;
const scriptEnd = content.lastIndexOf('</script>');
const script = content.substring(scriptStart, scriptEnd);

let open = 0, close = 0;
let inString = false;
let stringChar = '';
let escaped = false;

for (let i = 0; i < script.length; i++) {
    const c = script[i];
    
    if (escaped) {
        escaped = false;
        continue;
    }
    
    if (c === '\\') {
        escaped = true;
        continue;
    }
    
    if (inString) {
        if (c === stringChar) inString = false;
        continue;
    }
    
    if (c === '"' || c === "'") {
        inString = true;
        stringChar = c;
        continue;
    }
    
    if (c === '{') open++;
    else if (c === '}') close++;
}

console.log('Aberturas:', open);
console.log('Fechamentos:', close);
console.log('Diferenca:', open - close);

if (open !== close) {
    console.log('\nERRO: Faltam', Math.abs(open - close), 'chaves!');
} else {
    console.log('\nOK: Chaves balanceadas!');
}
