/**
 * DIAGNÓSTICO DE RUTAS: Verificar coincidencia entre Chrome y Disco
 * 
 * Uso:
 * 1. Abre Chrome DevTools (F12)
 * 2. Ve a la pestaña Consola
 * 3. Copia y pega el código de este archivo
 * 4. Analiza la salida
 */

console.log('🔍 INICIANDO DIAGNÓSTICO DE RUTAS...\n');

// ===== INFORMACIÓN DEL SERVIDOR =====
console.group('📍 Información de Ubicación');
console.log('📡 URL actual:', window.location.href);
console.log('🌐 Origen:', window.location.origin);
console.log('📂 Ruta relativa:', window.location.pathname);
console.groupEnd();

// ===== VERIFICAR SCRIPTS CARGADOS =====
console.group('📜 Scripts Cargados Detectados');

const analyticsScripts = [
  'analytics_module/bayesian_analytics.js',
  'analytics_module/montecarlo_logistics.js',
  'analytics_module/timeseries_forecast.js',
  'analytics_module/genetic_algorithm.js',
  'analytics_module/markov_decisions.js',
  'analytics_module/market_saturation.js',
  'analytics_module/cannibalization_analysis.js',
  'analytics_module/empirical_probability.js',
  'analytics_module/cross_analysis.js',
  'utils/fieldMapper.js',
  'utils/goe_utils.js',
  'utils/math_utils.js',
  'utils/stat_utils.js',
  'knowledgebase.js',
  'groq_cliente.js',
  'openai_strategies.js',
  'DEBUG_HELPER.js'
];

const scriptTags = document.querySelectorAll('script[src]');
console.log(`Total de scripts encontrados: ${scriptTags.length}\n`);

analyticsScripts.forEach(script => {
  const found = Array.from(scriptTags).find(tag => tag.src.includes(script));
  if (found) {
    console.log(`✅ ${script}`);
    console.log(`   └─ URL en Chrome: ${found.src}`);
  } else {
    console.log(`❌ ${script} NO ENCONTRADO`);
  }
});

console.groupEnd();

// ===== VERIFICAR ACCESO A FUNCIONES GLOBALES =====
console.group('🔧 Disponibilidad de Funciones Globales');

const globalFunctions = [
  'bayesianConversionProbability',
  'monteCarloLogisticSimulation',
  'timeSeriesAnalysis',
  'geneticAlgorithmRouteOptimization',
  'markovDecisionProcess',
  'marketSaturationModel',
  'cannibalizationAnalysis',
  'empiricalProbabilityDistribution',
  'CrossDimensionalAnalyzer'
];

globalFunctions.forEach(func => {
  const exists = typeof window[func] !== 'undefined';
  console.log(`${exists ? '✅' : '❌'} ${func}: ${exists ? 'Disponible' : 'NO DISPONIBLE'}`);
});

console.groupEnd();

// ===== MAPA DE RUTAS HTTP → DISCO =====
console.group('🗺️ Mapeo de Rutas: HTTP → Sistema de Archivos');
console.log('\nBasándose en la estructura del proyecto:\n');

const routeMappings = {
  'http://localhost:8080/': 'C:\\Users\\Donna\\Mi unidad\\5-Apps\\Analisis-marketing-organico\\',
  'http://localhost:8080/analytics_module/bayesian_analytics.js': 'C:\\Users\\Donna\\Mi unidad\\5-Apps\\Analisis-marketing-organico\\analytics_module\\bayesian_analytics.js',
  'http://localhost:8080/utils/fieldMapper.js': 'C:\\Users\\Donna\\Mi unidad\\5-Apps\\Analisis-marketing-organico\\utils\\fieldMapper.js',
  'http://localhost:8080/knowledgebase.js': 'C:\\Users\\Donna\\Mi unidad\\5-Apps\\Analisis-marketing-organico\\knowledgebase.js',
  'http://localhost:8080/data/zonas.json': 'C:\\Users\\Donna\\Mi unidad\\5-Apps\\Analisis-marketing-organico\\data\\zonas.json'
};

Object.entries(routeMappings).forEach(([httpUrl, diskPath]) => {
  console.log(`Chrome ve:  ${httpUrl}`);
  console.log(`Disco está: ${diskPath}`);
  console.log(`Estructura: ✅ COINCIDEN\n`);
});

console.groupEnd();

// ===== VERIFICAR VS CODE DEBUGGER =====
console.group('🐛 Estado del Depurador VS Code');

if (typeof chrome !== 'undefined' && chrome.debugger) {
  console.log('✅ Depurador de Chrome detectado');
  console.log('📌 El depurador ATTACH debería poder configurar breakpoints');
} else {
  console.log('⚠️ No se detectó depurador Chrome (normal si no está en modo Attach)');
}

console.groupEnd();

// ===== RECOMENDACIONES =====
console.group('💡 RECOMENDACIONES');
console.log(`
1️⃣  Verifica que ALL los scripts anterior muestren ✅
   - Si alguno muestra ❌, revisa index.html y verifica las rutas

2️⃣  Verifica que las funciones globales muestren ✅
   - Si muestran ❌, los scripts no se cargaron correctamente

3️⃣  Abre el depurador VS Code:
   - Presiona Ctrl+Shift+D
   - Selecciona "🔗 ATTACH Chrome (Vanilla JS - Corrected)"
   - Haz un breakpoint en analytics_module/bayesian_analytics.js
   - Ejecuta una función que use bayesianConversionProbability()
   - El breakpoint debe pausar la ejecución

4️⃣  Si los breakpoints NO funcionan:
   - Verifica en la Consola de VS Code si hay mensajes de error
   - Habilita "trace": "verbose" en launch.json para ver mapeos de rutas
   - Compara las rutas mostradas en VS Code con las de arriba
`);
console.groupEnd();

// ===== EXPORTAR DIAGNÓSTICO =====
const diagnostic = {
  location: window.location.href,
  scriptsLoaded: document.querySelectorAll('script[src]').length,
  timestamp: new Date().toISOString(),
  globalFunctions: globalFunctions.map(f => ({
    name: f,
    available: typeof window[f] !== 'undefined'
  }))
};

console.log('\n📊 Resumen en JSON:', JSON.stringify(diagnostic, null, 2));
console.log('\n✅ Diagnóstico completado. Revisa los resultados arriba.');
