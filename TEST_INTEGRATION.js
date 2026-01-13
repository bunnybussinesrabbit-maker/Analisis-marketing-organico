/**
 * TEST SUITE - Análisis Cruzado Integrado
 * Prueba las integraciones FieldMapper → Cross-Analysis → initCompleteAnalysis
 * 
 * Ejecución:
 * 1. Abre DevTools en index.html
 * 2. Copia y pega este código en la consola
 * 3. Ejecuta: runIntegrationTests()
 */

// Test 1: Validar FieldMapper
async function testFieldMapper() {
  console.log('\n🧪 TEST 1: FieldMapper - Mapeo de campos');
  console.log('=' .repeat(50));
  
  if (typeof FieldMapper === 'undefined') {
    console.error('❌ FieldMapper no está cargado');
    return false;
  }

  // Datos de prueba con diferentes nombres de campos
  const testRecords = [
    {
      zona: 'centro',
      estado: 'successful',
      pitch_type: 'nostalgia',
      monto: 250,
      hora: '14:30',
      origen: 'CDMX',
      edad: 35,
      ocupacion: 'professional'
    },
    {
      zone: 'zona_hotelera',
      result: 'failed',
      pitchType: 'authority',
      amount: 0,
      time: '10:00',
      clientOrigin: 'Cancun',
      age: '26-35',
      occupation: 'entrepreneur'
    }
  ];

  // Normalizar
  const normalized = FieldMapper.normalizeRecords(testRecords);
  console.log('✅ Registros normalizados:', normalized.length);

  // Generar reporte
  const report = FieldMapper.generateMappingReport(testRecords);
  console.log('📊 Reporte de validación:', report);

  return true;
}

// Test 2: Validar CrossDimensionalAnalyzer
async function testCrossDimensionalAnalyzer() {
  console.log('\n🧪 TEST 2: CrossDimensionalAnalyzer - Instancia y análisis');
  console.log('='.repeat(50));

  if (typeof CrossDimensionalAnalyzer === 'undefined') {
    console.error('❌ CrossDimensionalAnalyzer no está cargado');
    return false;
  }

  // Crear datos de prueba normalizados
  const testData = [
    {
      zone: 'centro',
      result: 'successful',
      pitchType: 'nostalgia',
      amount: 250,
      origin: 'CDMX',
      ageGroup: '26-35',
      occupation: 'professional',
      income: 'high'
    },
    {
      zone: 'centro',
      result: 'successful',
      pitchType: 'nostalgia',
      amount: 180,
      origin: 'CDMX',
      ageGroup: '36-45',
      occupation: 'entrepreneur',
      income: 'upper_middle'
    },
    {
      zone: 'zona_hotelera',
      result: 'failed',
      pitchType: 'authority',
      amount: 0,
      origin: 'Cancun',
      ageGroup: 'unknown',
      occupation: 'unknown',
      income: 'unknown'
    }
  ];

  try {
    const analyzer = new CrossDimensionalAnalyzer(testData);
    console.log('✅ Analyzer creado exitosamente');
    console.log('   Registros:', analyzer.records.length);
    console.log('   Tiene demográfico:', analyzer.hasDemographicData);
    console.log('   Dimensiones:', analyzer.dimensions);
    return true;
  } catch (error) {
    console.error('❌ Error creando analyzer:', error);
    return false;
  }
}

// Test 3: Validar syncAnalysisData
async function testSyncAnalysisData() {
  console.log('\n🧪 TEST 3: syncAnalysisData - Sincronización de datos');
  console.log('='.repeat(50));

  if (typeof syncAnalysisData === 'undefined') {
    console.error('❌ syncAnalysisData no está definida');
    return false;
  }

  // Inyectar datos de prueba en filteredData
  window.filteredData = [
    { zona: 'centro', estado: 'successful', pitch_type: 'nostalgia', monto: 250, origen: 'CDMX' },
    { zona: 'centro', estado: 'failed', pitch_type: 'authority', monto: 0, origen: 'Local' },
    { zona: 'zona_hotelera', estado: 'successful', pitch_type: 'scarcity', monto: 500, origen: 'CDMX' }
  ];

  try {
    const success = syncAnalysisData(window.filteredData);
    console.log('✅ sincAnalysisData ejecutada:', success);
    console.log('   currentAnalyzer existe:', currentAnalyzer !== null);
    console.log('   currentAnalysisData:', currentAnalysisData);
    return success;
  } catch (error) {
    console.error('❌ Error sincronizando:', error);
    return false;
  }
}

// Test 4: Validar flujo completo
async function testCompleteFlow() {
  console.log('\n🧪 TEST 4: Flujo Completo - FieldMapper → Sync → Analyzer');
  console.log('='.repeat(50));

  // Datos crudos (como vendrían del CSV)
  const rawData = [
    { zona: 'centro', estado: 'si', pitch_type: 'nostalgia', monto: 250, hora: '14:30', origen: 'CDMX', edad: 35, ocupacion: 'professional' },
    { zona: 'centro', estado: 'no', pitch_type: 'authority', monto: 0, hora: '10:00', origen: 'LOCAL', edad: 42, ocupacion: 'entrepreneur' },
    { zona: 'zona_hotelera', estado: 'successful', pitchType: 'scarcity', amount: 500, time: '16:45', clientOrigin: 'Cancun', age: '26-35', occupation: 'tourist' }
  ];

  try {
    // Paso 1: Normalizar con FieldMapper
    console.log('\n  Paso 1: Normalizando campos...');
    const normalized = FieldMapper.normalizeRecords(rawData);
    console.log('  ✅ Normalizados:', normalized.length, 'registros');

    // Paso 2: Crear Analyzer
    console.log('\n  Paso 2: Creando CrossDimensionalAnalyzer...');
    const analyzer = new CrossDimensionalAnalyzer(normalized);
    console.log('  ✅ Analyzer creado, demográfico:', analyzer.hasDemographicData);

    // Paso 3: Generar matriz demográfica
    console.log('\n  Paso 3: Generando análisis...');
    const demographics = analyzer.generateDemographicMatrix();
    const origins = analyzer.generateOriginMatrix();
    console.log('  ✅ Demográfica:', demographics.length, 'combinaciones');
    console.log('  ✅ Origen:', origins.length, 'combinaciones');

    // Paso 4: Insights
    console.log('\n  Paso 4: Generando insights...');
    const insights = analyzer.generateInsights('demographic');
    console.log('  ✅ Insights:', insights.length);
    insights.forEach((i, idx) => {
      console.log(`     ${idx + 1}. ${i.label} - ${(i.conversionRate * 100).toFixed(0)}% conversión`);
    });

    return true;
  } catch (error) {
    console.error('❌ Error en flujo:', error);
    return false;
  }
}

// Test 5: Simular carga de CSV
async function testCSVLoad() {
  console.log('\n🧪 TEST 5: Simular carga CSV y filtros');
  console.log('='.repeat(50));

  // Simular datos cargados
  window.salesData = [
    { zona: 'centro', hora: '14:30', estado: 'successful', pitch_type: 'nostalgia', monto: 250, origen: 'CDMX', fecha: new Date('2026-01-05') },
    { zona: 'centro', hora: '10:00', estado: 'failed', pitch_type: 'authority', monto: 0, origen: 'LOCAL', fecha: new Date('2026-01-06') },
    { zona: 'zona_hotelera', hora: '16:45', estado: 'successful', pitchType: 'scarcity', amount: 500, clientOrigin: 'CDMX', fecha: new Date('2026-01-07') }
  ];
  
  window.filteredData = [...salesData];

  console.log('✅ salesData simulado:', salesData.length);
  console.log('✅ filteredData inicializado:', filteredData.length);

  try {
    const success = syncAnalysisData(window.filteredData);
    console.log('✅ syncAnalysisData después de carga CSV:', success);
    return true;
  } catch (error) {
    console.error('❌ Error en simulación CSV:', error);
    return false;
  }
}

// Suite completa
async function runIntegrationTests() {
  console.log('\n\n');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  🚀 SUITE DE PRUEBAS - ANÁLISIS CRUZADO INTEGRADO    ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const tests = [
    { name: 'FieldMapper', fn: testFieldMapper },
    { name: 'CrossDimensionalAnalyzer', fn: testCrossDimensionalAnalyzer },
    { name: 'syncAnalysisData', fn: testSyncAnalysisData },
    { name: 'Flujo Completo', fn: testCompleteFlow },
    { name: 'Simulación CSV', fn: testCSVLoad }
  ];

  const results = [];
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ test: test.name, passed: result });
    } catch (error) {
      console.error(`Excepción no capturada en ${test.name}:`, error);
      results.push({ test: test.name, passed: false });
    }
  }

  // Resumen
  console.log('\n\n');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  📊 RESUMEN DE PRUEBAS                              ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;

  results.forEach((r, idx) => {
    const icon = r.passed ? '✅' : '❌';
    console.log(`${icon} ${r.test}`);
  });

  console.log(`\n📈 RESULTADO: ${passed}/${total} pruebas pasadas (${(passed/total*100).toFixed(0)}%)`);

  if (passed === total) {
    console.log('\n🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está listo.');
  } else {
    console.log('\n⚠️ Algunas pruebas fallaron. Revisa los errores arriba.');
  }

  return results;
}

// Exportar para uso global
window.runIntegrationTests = runIntegrationTests;
console.log('✅ Test suite cargado. Ejecuta: runIntegrationTests()');
