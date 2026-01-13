#!/usr/bin/env node

/**
 * Script demostrativo: Usar COUNTIF/SUMIF desde Node.js
 * 
 * Este archivo muestra cómo los análisis funcionan
 * en la aplicación index.html
 */

console.log('📊 DEMOSTRACIÓN: COUNTIF/SUMIF en Geo-Suite Cancún PRO');
console.log('═'.repeat(70));

// Datos de ejemplo (como si vinieran del CSV)
const sampleData = [
  { pitchType: 'autoridad', clientOrigin: 'CDMX', zona: 'zona_hotelera', result: 'successful', monto: 450 },
  { pitchType: 'nostalgia', clientOrigin: 'Cancun_Local', zona: 'centro', result: 'failed', monto: 0 },
  { pitchType: 'escasez', clientOrigin: 'Quintana_Roo', zona: 'region_237', result: 'successful', monto: 800 },
  { pitchType: 'comunidad', clientOrigin: 'Cancun_Local', zona: 'sm_77', result: 'successful', monto: 150 },
  { pitchType: 'autoridad', clientOrigin: 'International', zona: 'sm_91', result: 'successful', monto: 600 },
  { pitchType: 'autoridad', clientOrigin: 'CDMX', zona: 'zona_hotelera', result: 'successful', monto: 500 },
  { pitchType: 'escasez', clientOrigin: 'CDMX', zona: 'centro', result: 'successful', monto: 350 },
  { pitchType: 'nostalgia', clientOrigin: 'Quintana_Roo', zona: 'region_233', result: 'failed', monto: 0 }
];

// Simular COUNTIF
function COUNTIF(dataArray, columnName, criteria) {
  if (!dataArray || dataArray.length === 0) return 0;
  
  const normCriteria = String(criteria).toLowerCase().trim();
  let count = 0;
  
  dataArray.forEach(row => {
    const cellValue = String(row[columnName] || '').toLowerCase().trim();
    if (cellValue === normCriteria) count++;
  });
  
  return count;
}

// Simular SUMIF
function SUMIF(dataArray, columnName, criteria, sumColumn) {
  if (!dataArray || dataArray.length === 0) {
    return { sum: 0, count: 0, average: 0 };
  }
  
  const normCriteria = String(criteria).toLowerCase().trim();
  let sum = 0;
  let count = 0;
  
  dataArray.forEach(row => {
    const cellValue = String(row[columnName] || '').toLowerCase().trim();
    if (cellValue === normCriteria) {
      const sumValue = parseFloat(row[sumColumn]) || 0;
      sum += sumValue;
      count++;
    }
  });
  
  return { 
    sum: parseFloat(sum.toFixed(2)),
    count, 
    average: count > 0 ? parseFloat((sum / count).toFixed(2)) : 0 
  };
}

// ============================================
// DEMOSTRACIONES
// ============================================

console.log('\n1️⃣  COUNTIF: Contar cuántas veces aparece un valor\n');

const autoridadCount = COUNTIF(sampleData, 'pitchType', 'autoridad');
console.log(`   ¿Cuántas veces se usó "autoridad"?`);
console.log(`   → ${autoridadCount} veces\n`);

const cdmxCount = COUNTIF(sampleData, 'clientOrigin', 'CDMX');
console.log(`   ¿Cuántos clientes son de CDMX?`);
console.log(`   → ${cdmxCount} clientes\n`);

const successCount = COUNTIF(sampleData, 'result', 'successful');
console.log(`   ¿Cuántas conversiones exitosas?`);
console.log(`   → ${successCount} conversiones\n`);

// ============================================

console.log('2️⃣  SUMIF: Sumar valores según un criterio\n');

const autoridadRevenue = SUMIF(sampleData, 'pitchType', 'autoridad', 'monto');
console.log(`   ¿Cuánto dinero con pitch "autoridad"?`);
console.log(`   → Total: $${autoridadRevenue.sum}`);
console.log(`   → Promedio por venta: $${autoridadRevenue.average}`);
console.log(`   → Cantidad de ventas: ${autoridadRevenue.count}\n`);

const cdmxRevenue = SUMIF(sampleData, 'clientOrigin', 'CDMX', 'monto');
console.log(`   ¿Cuánto dinero de clientes CDMX?`);
console.log(`   → Total: $${cdmxRevenue.sum}`);
console.log(`   → Promedio por cliente: $${cdmxRevenue.average}`);
console.log(`   → Cantidad de clientes: ${cdmxRevenue.count}\n`);

// ============================================

console.log('3️⃣  ANÁLISIS POR PITCH: Efectividad de cada estrategia\n');

const pitchTypes = ['autoridad', 'nostalgia', 'escasez', 'comunidad'];

pitchTypes.forEach(pitch => {
  const total = COUNTIF(sampleData, 'pitchType', pitch);
  const successful = sampleData.filter(r => 
    r.pitchType.toLowerCase() === pitch && 
    r.result.toLowerCase() === 'successful'
  ).length;
  const revenue = SUMIF(sampleData, 'pitchType', pitch, 'monto');
  
  const rate = total > 0 ? ((successful / total) * 100).toFixed(1) : 0;
  
  if (total > 0) {
    console.log(`   📊 ${pitch.toUpperCase()}`);
    console.log(`      Usos: ${total} | Exitosas: ${successful} | Conversión: ${rate}% | Ingresos: $${revenue.sum}`);
  }
});

// ============================================

console.log('\n4️⃣  ANÁLISIS POR CLIENTE ORIGIN: Procedencia más rentable\n');

const origins = [...new Set(sampleData.map(r => r.clientOrigin))];

origins.forEach(origin => {
  const count = COUNTIF(sampleData, 'clientOrigin', origin);
  const successful = sampleData.filter(r => 
    r.clientOrigin === origin && 
    r.result.toLowerCase() === 'successful'
  ).length;
  const revenue = SUMIF(sampleData, 'clientOrigin', origin, 'monto');
  
  const rate = count > 0 ? ((successful / count) * 100).toFixed(1) : 0;
  
  console.log(`   🏙️  ${origin}`);
  console.log(`      Clientes: ${count} | Exitosas: ${successful} | Conversión: ${rate}% | Ingresos: $${revenue.sum}`);
});

// ============================================

console.log('\n5️⃣  ANÁLISIS CRUZADO: Pitch × Zona\n');
console.log(`   ¿Qué pitch funciona mejor en cada zona?\n`);

const zones = [...new Set(sampleData.map(r => r.zona))];

zones.forEach(zone => {
  console.log(`   📍 ${zone.toUpperCase()}`);
  
  pitchTypes.forEach(pitch => {
    const count = sampleData.filter(r => 
      r.zona === zone && 
      r.pitchType.toLowerCase() === pitch
    ).length;
    
    if (count > 0) {
      const successful = sampleData.filter(r => 
        r.zona === zone && 
        r.pitchType.toLowerCase() === pitch &&
        r.result.toLowerCase() === 'successful'
      ).length;
      
      const rate = ((successful / count) * 100).toFixed(1);
      console.log(`      • ${pitch}: ${successful}/${count} exitosas (${rate}%)`);
    }
  });
  console.log();
});

// ============================================

console.log('═'.repeat(70));
console.log('\n✅ CONCLUSIONES DEL ANÁLISIS:\n');

const totalRevenue = sampleData.reduce((sum, r) => sum + r.monto, 0);
const totalSales = sampleData.length;
const totalSuccessful = COUNTIF(sampleData, 'result', 'successful');

console.log(`   📈 Total de ventas: ${totalSales}`);
console.log(`   ✅ Conversiones: ${totalSuccessful} (${((totalSuccessful/totalSales)*100).toFixed(1)}%)`);
console.log(`   💰 Ingresos totales: $${totalRevenue}`);
console.log(`   🎫 Ticket promedio: $${(totalRevenue/totalSales).toFixed(2)}`);

console.log('\n💡 Tips:\n');
console.log('   1. Carga tu CSV real en la aplicación web');
console.log('   2. Abre la consola del navegador (F12)');
console.log('   3. Ejecuta: window.showAllAnalysis()');
console.log('   4. O usa: window.COUNTIF() y window.SUMIF() manualmente');
console.log('   5. Lee GUIA_ANALISIS_CRUZADO.md para más ejemplos\n');

console.log('═'.repeat(70));
