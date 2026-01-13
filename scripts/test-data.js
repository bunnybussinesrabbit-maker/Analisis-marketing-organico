#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 TEST DE DATOS - Geo-Suite Cancún PRO');
console.log('════════════════════════════════════════\n');

// 1. Verificar archivos JSON
const dataDir = path.join(__dirname, '../data');
const requiredFiles = [
  'zones.json',
  'pitchTypes.json',
  'clientOrigins.json',
  'socioeconomicProfiles.json'
];

console.log('📁 Verificando archivos de configuración...\n');

let jsonErrors = 0;

requiredFiles.forEach(file => {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      const data = JSON.parse(content);
      console.log(`✅ ${file}`);
      console.log(`   └─ Estructura: ${typeof data === 'object' ? 'Válida' : 'Inválida'}`);
    } catch (e) {
      console.log(`❌ ${file} - JSON inválido: ${e.message}`);
      jsonErrors++;
    }
  } else {
    console.log(`⚠️  ${file} - NO ENCONTRADO`);
  }
});

// 2. Verificar CSV
console.log('\n📊 Verificando CSV...\n');

const csvPath = path.join(dataDir, 'PLANTILLA_CSV_ESTANDAR.csv');
if (fs.existsSync(csvPath)) {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.trim().split('\n');
  console.log(`✅ PLANTILLA_CSV_ESTANDAR.csv`);
  console.log(`   └─ Filas: ${lines.length - 1} (+ 1 header)`);
  console.log(`   └─ Columnas: ${lines[0].split(',').length}`);
} else {
  console.log(`❌ PLANTILLA_CSV_ESTANDAR.csv - NO ENCONTRADO`);
}

// 3. Verificar index.html
console.log('\n🌐 Verificando index.html...\n');

const htmlPath = path.join(__dirname, '../index.html');
if (fs.existsSync(htmlPath)) {
  const content = fs.readFileSync(htmlPath, 'utf-8');
  const hasFieldMapper = content.includes('FieldMapper');
  const hasChartjs = content.includes('Chart.js');
  const hasMapbox = content.includes('mapboxgl');
  const hasPapaParse = content.includes('PapaParse');
  
  console.log(`✅ index.html (${Math.round(content.length / 1024)} KB)`);
  console.log(`   ├─ FieldMapper: ${hasFieldMapper ? '✓' : '✗'}`);
  console.log(`   ├─ Chart.js: ${hasChartjs ? '✓' : '✗'}`);
  console.log(`   ├─ Mapbox: ${hasMapbox ? '✓' : '✗'}`);
  console.log(`   └─ PapaParse: ${hasPapaParse ? '✓' : '✗'}`);
} else {
  console.log(`❌ index.html - NO ENCONTRADO`);
}

// 4. Verificar módulos analíticos
console.log('\n📦 Verificando módulos analíticos...\n');

const analyticsDir = path.join(__dirname, '../analytics_module');
if (fs.existsSync(analyticsDir)) {
  const files = fs.readdirSync(analyticsDir).filter(f => f.endsWith('.js'));
  console.log(`✅ Módulos analíticos: ${files.length} archivos`);
  files.forEach(f => {
    console.log(`   ├─ ${f}`);
  });
} else {
  console.log(`⚠️  analytics_module/ - NO ENCONTRADO`);
}

// 5. Verificar utilidades
console.log('\n🔧 Verificando utilidades...\n');

const utilsDir = path.join(__dirname, '../utils');
if (fs.existsSync(utilsDir)) {
  const files = fs.readdirSync(utilsDir).filter(f => f.endsWith('.js'));
  console.log(`✅ Utilidades: ${files.length} archivos`);
  files.forEach(f => {
    console.log(`   ├─ ${f}`);
  });
} else {
  console.log(`⚠️  utils/ - NO ENCONTRADO`);
}

// Resumen final
console.log('\n════════════════════════════════════════');
if (jsonErrors === 0) {
  console.log('✅ Test completado - Todo OK\n');
} else {
  console.log(`⚠️  Test completado - ${jsonErrors} errores encontrados\n`);
}
