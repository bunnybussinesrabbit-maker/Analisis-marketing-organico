const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, './data/PLANTILLA_CSV_ESTANDAR.csv');
console.log('📁 Buscando archivo en:', csvPath);

if (fs.existsSync(csvPath)) {
  console.log('✅ Archivo encontrado');
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  console.log(`📊 Filas: ${lines.length}`);
  console.log(`📝 Headers: ${lines[0]}`);
  console.log(`✅ Todo funciona correctamente`);
} else {
  console.log('❌ Archivo no encontrado');
}
