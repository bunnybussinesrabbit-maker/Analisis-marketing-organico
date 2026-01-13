// 🔍 Validador de sintaxis JavaScript
const fs = require('fs');
const path = require('path');

// Leer el archivo HTML
const htmlFile = path.join(__dirname, 'index.html');
const content = fs.readFileSync(htmlFile, 'utf8');

// Extraer bloques <script> de JavaScript
const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;
let matches;
let allCode = '';
const scripts = [];

while ((matches = scriptRegex.exec(content)) !== null) {
  const scriptContent = matches[1];
  // Ignorar scripts externos (src=)
  if (!matches[0].includes('src=')) {
    scripts.push(scriptContent);
    allCode += scriptContent + '\n';
  }
}

console.log(`📝 Se encontraron ${scripts.length} bloques <script> inline`);
console.log(`📊 Total de código JavaScript: ${allCode.length} caracteres\n`);

// Intentar compilar el código
try {
  new Function(allCode);
  console.log('✅ ¡SINTAXIS VÁLIDA! El JavaScript es compilable.');
  process.exit(0);
} catch (error) {
  console.error('❌ Error de sintaxis encontrado:');
  console.error(error.message);
  console.error(`\nLínea aproximada: ${error.message.match(/line (\d+)/)?.[1] || 'desconocida'}`);
  process.exit(1);
}
