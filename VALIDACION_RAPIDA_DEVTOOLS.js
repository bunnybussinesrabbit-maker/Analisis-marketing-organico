// ============================================
// SCRIPT DE VALIDACIÓN RÁPIDA - DevTools Console
// ============================================
// Copia y pega esto en la consola del navegador (F12 > Console)
// para verificar que todo está sincronizado correctamente.

console.log('🔍 INICIANDO VALIDACIÓN DE INTEGRACION...\n');

// ============================================
// PRUEBA 1: Verificar Orquestador
// ============================================
console.log('📋 PRUEBA 1: Orquestador Global');
console.log('├─ window.analyticsOrchestrator:', !!window.analyticsOrchestrator);
console.log('├─ window.analyticsOrchestrator.modules:', !!window.analyticsOrchestrator?.modules);
console.log('├─ window.analyticsOrchestrator.data:', window.analyticsOrchestrator?.data?.length || 0, 'registros');
console.log('└─ Estado: ', window.analyticsOrchestrator ? '✅ DISPONIBLE' : '❌ NO DISPONIBLE\n');

// ============================================
// PRUEBA 2: Verificar Módulos Cargados
// ============================================
console.log('\n📋 PRUEBA 2: Módulos Registrados');
const modules = window.analyticsOrchestrator?.modules || {};
const expectedModules = [
  'TimeSeriesForecast',
  'MonteCarloLogistics',
  'BayesianSalesAnalytics',
  'CannibalizationAnalysis',
  'CrossDimensionalAnalyzer',
  'ZoneSelector',
  'GeneticRouteOptimization',
  'MarketSaturation',
  'MarkovDecisions'
];

expectedModules.forEach(mod => {
  const exists = !!modules[mod];
  const isFunction = typeof modules[mod] === 'function';
  const icon = exists && isFunction ? '✅' : '❌';
  console.log(`${icon} ${mod}`);
});

// ============================================
// PRUEBA 3: Verificar Alias window.Analytics
// ============================================
console.log('\n📋 PRUEBA 3: Alias window.Analytics');
console.log('├─ window.Analytics:', !!window.Analytics);
console.log('├─ Módulos via window.Analytics:', Object.keys(window.Analytics || {}).length);
console.log('└─ Estado: ', window.Analytics ? '✅ SINCRONIZADO' : '❌ NO SINCRONIZADO\n');

// ============================================
// PRUEBA 4: Verificar filteredData
// ============================================
console.log('\n📋 PRUEBA 4: Datos Cargados (filteredData)');
console.log('├─ window.filteredData:', !!window.filteredData);
console.log('├─ Cantidad de registros:', window.filteredData?.length || 0);
if (window.filteredData && window.filteredData.length > 0) {
  const sample = window.filteredData[0];
  console.log('├─ Estructura del primer registro:');
  Object.keys(sample).forEach(key => {
    console.log(`│  ├─ ${key}: ${JSON.stringify(sample[key])}`);
  });
}
console.log('└─ Estado: ', window.filteredData?.length > 0 ? '✅ DATOS DISPONIBLES' : '⚠️ SIN DATOS\n');

// ============================================
// PRUEBA 5: Validación de Accesibilidad
// ============================================
console.log('\n📋 PRUEBA 5: Validación de Accesibilidad Global');
if (typeof window.validateModulesAccess === 'function') {
  const checks = window.validateModulesAccess();
  console.log('└─ Ejecutado correctamente ✅\n');
} else {
  console.log('└─ Función no encontrada ❌\n');
}

// ============================================
// PRUEBA 6: Simular ejecución de Monte Carlo
// ============================================
console.log('\n📋 PRUEBA 6: Simulación de Monte Carlo');
try {
  if (window.analyticsOrchestrator && window.filteredData && window.filteredData.length > 0) {
    console.log('├─ Ejecutando análisis...');
    const result = window.analyticsOrchestrator.modules.MonteCarloLogistics(window.filteredData);
    console.log('├─ Resultado devuelto:');
    console.log('│  ├─ expectedRevenue:', result.expectedRevenue);
    console.log('│  ├─ confidenceInterval:', result.confidenceInterval);
    console.log('│  ├─ riskScore:', result.riskScore);
    console.log('└─ ✅ MONTE CARLO FUNCIONA\n');
  } else {
    console.log('└─ ⚠️ Carga datos primero\n');
  }
} catch (error) {
  console.error('❌ Error en Monte Carlo:', error.message, '\n');
}

// ============================================
// PRUEBA 7: Estado General
// ============================================
console.log('\n📋 PRUEBA 7: Estado General del Sistema');
const ready = {
  'Orquestador': !!window.analyticsOrchestrator,
  'Módulos': !!window.analyticsOrchestrator?.modules,
  'Datos': window.filteredData?.length > 0,
  'Validación': typeof window.validateModulesAccess === 'function'
};

Object.entries(ready).forEach(([key, value]) => {
  console.log(`${value ? '✅' : '❌'} ${key}`);
});

const allReady = Object.values(ready).every(v => v);
console.log('\n' + (allReady ? '🟢 SISTEMA LISTO PARA ANÁLISIS' : '🟡 SISTEMA EN CONFIGURACIÓN'));

// ============================================
// PRUEBA 8: Información de Consola
// ============================================
console.log('\n📋 PRUEBA 8: Información de Debugging');
console.log('├─ Ver Orquestador completo:');
console.log('│  → window.analyticsOrchestrator');
console.log('├─ Ver módulos:');
console.log('│  → Object.keys(window.analyticsOrchestrator.modules)');
console.log('├─ Ver datos:');
console.log('│  → window.filteredData');
console.log('├─ Ver Analytics alias:');
console.log('│  → window.Analytics');
console.log('└─ Validar de nuevo:');
console.log('   → window.validateModulesAccess()');

console.log('\n✅ VALIDACIÓN COMPLETADA');
console.log('='.repeat(50) + '\n');
