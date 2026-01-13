#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Leer CSV plantilla - intentar múltiples ubicaciones
let csvPath = path.join(__dirname, '../data/PLANTILLA_CSV_ESTANDAR.csv');

if (!fs.existsSync(csvPath)) {
  // Intentar ubicación alternativa
  csvPath = path.join(process.cwd(), 'data/PLANTILLA_CSV_ESTANDAR.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ Error: No se encontró PLANTILLA_CSV_ESTANDAR.csv');
    console.error('   Buscando en:', csvPath);
    process.exit(1);
  }
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');
const dataRows = lines.slice(1);

console.log('📊 ANÁLISIS DE CSV - Geo-Suite Cancún PRO');
console.log('═══════════════════════════════════════════\n');

console.log('📝 Headers detectados:');
headers.forEach((h, i) => {
  console.log(`  [${i}] ${h}`);
});

console.log(`\n📈 Estadísticas:`);
console.log(`  Total de filas: ${dataRows.length}`);
console.log(`  Total de columnas: ${headers.length}`);

// Análisis por columna
console.log('\n📋 Valores por columna:\n');

headers.forEach((header, colIndex) => {
  const values = dataRows.map(row => {
    const cells = row.split(',');
    return cells[colIndex]?.trim() || 'VACÍO';
  });
  
  const unique = [...new Set(values)];
  
  console.log(`${header}:`);
  console.log(`  Valores únicos: ${unique.length}`);
  console.log(`  Valores: ${unique.join(', ')}`);
  console.log();
});

// Análisis de pitch_type
const pitchIndex = headers.indexOf('pitch_type');
if (pitchIndex >= 0) {
  const pitches = dataRows.map(row => row.split(',')[pitchIndex]?.trim());
  const pitchCounts = {};
  
  pitches.forEach(p => {
    pitchCounts[p] = (pitchCounts[p] || 0) + 1;
  });
  
  console.log('🎯 ANÁLISIS DE PITCH_TYPE (Disertaciones de Ventas):');
  console.log('══════════════════════════════════════════════════');
  Object.entries(pitchCounts).forEach(([pitch, count]) => {
    const percentage = ((count / dataRows.length) * 100).toFixed(1);
    console.log(`  ${pitch}: ${count} (${percentage}%)`);
  });
}

// Análisis de resultado
const resultIndex = headers.indexOf('result');
if (resultIndex >= 0) {
  const results = dataRows.map(row => row.split(',')[resultIndex]?.trim());
  const resultCounts = {};
  
  results.forEach(r => {
    resultCounts[r] = (resultCounts[r] || 0) + 1;
  });
  
  console.log('\n✓/✗ ANÁLISIS DE RESULTADO:');
  console.log('═══════════════════════════');
  Object.entries(resultCounts).forEach(([result, count]) => {
    const percentage = ((count / dataRows.length) * 100).toFixed(1);
    console.log(`  ${result}: ${count} (${percentage}%)`);
  });
  
  const successCount = resultCounts['successful'] || 0;
  const conversionRate = ((successCount / dataRows.length) * 100).toFixed(1);
  console.log(`\n📊 Tasa de conversión: ${conversionRate}%`);
}

// Análisis de montos
const amountIndex = headers.indexOf('amount');
if (amountIndex >= 0) {
  const amounts = dataRows
    .map(row => {
      const val = row.split(',')[amountIndex]?.trim();
      return parseFloat(val) || 0;
    })
    .filter(v => v > 0);
  
  const totalAmount = amounts.reduce((a, b) => a + b, 0);
  const avgAmount = amounts.length > 0 ? (totalAmount / amounts.length).toFixed(2) : 0;
  const maxAmount = Math.max(...amounts);
  const minAmount = Math.min(...amounts);
  
  console.log('\n💰 ANÁLISIS DE MONTOS:');
  console.log('══════════════════════');
  console.log(`  Total: $${totalAmount.toFixed(2)}`);
  console.log(`  Promedio: $${avgAmount}`);
  console.log(`  Máximo: $${maxAmount}`);
  console.log(`  Mínimo: $${minAmount}`);
  console.log(`  Registros con monto: ${amounts.length}`);
}

// Análisis de zonas
const zonaIndex = headers.indexOf('zona');
if (zonaIndex >= 0) {
  const zonas = dataRows.map(row => row.split(',')[zonaIndex]?.trim());
  const zonaCounts = {};
  
  zonas.forEach(z => {
    zonaCounts[z] = (zonaCounts[z] || 0) + 1;
  });
  
  console.log('\n📍 ANÁLISIS POR ZONA:');
  console.log('═════════════════════');
  Object.entries(zonaCounts).forEach(([zona, count]) => {
    const percentage = ((count / dataRows.length) * 100).toFixed(1);
    console.log(`  ${zona}: ${count} (${percentage}%)`);
  });
}

console.log('\n✅ Análisis completado\n');
