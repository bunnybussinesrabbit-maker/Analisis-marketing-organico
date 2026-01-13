/**
 * DEBUG_HELPER.js
 * Herramientas para debuggear el flujo de datos CSV → Módulos Análisis
 * 
 * USO EN CONSOLA DEL NAVEGADOR:
 * - debugStatus()          → Ver estado actual de datos
 * - debugDataFlow()        → Verificar flujo completo
 * - debugModules()         → Ver estado de módulos cargados
 * - clearData()            → Limpiar datos cargados
 */

const DebugHelper = {
  
  /**
   * Estado actual del sistema
   */
  debugStatus() {
    console.clear();
    console.log('═══════════════════════════════════════════════════════');
    console.log('           📊 DEBUG STATUS - Estado del Sistema');
    console.log('═══════════════════════════════════════════════════════\n');
    
    // Datos cargados
    console.log('📂 DATOS CARGADOS:');
    console.log('   window.salesData:', window.salesData?.length || 0, 'registros');
    console.log('   window.filteredData:', window.filteredData?.length || 0, 'registros');
    
    if (window.salesData && window.salesData.length > 0) {
      console.log('\n   ✅ Primer registro:');
      console.log('   ', window.salesData[0]);
      
      // Verificar propiedades requeridas
      const requiredFields = ['zona', 'timestamp', 'pitchType', 'result'];
      const firstRecord = window.salesData[0];
      const hasAllFields = requiredFields.every(f => f in firstRecord);
      console.log(`\n   ${hasAllFields ? '✅' : '❌'} Propiedades requeridas:`, requiredFields);
      requiredFields.forEach(field => {
        const hasIt = field in firstRecord;
        console.log(`      ${hasIt ? '✅' : '❌'} ${field}: ${firstRecord[field]}`);
      });
    }
    
    // Orquestador
    console.log('\n📚 MÓDULOS:');
    if (window.analyticsOrchestrator) {
      console.log('   ✅ AnalyticsOrchestrator: CARGADO');
      console.log('   Datos en orquestador:', window.analyticsOrchestrator.data?.length || 0);
    } else {
      console.log('   ❌ AnalyticsOrchestrator: NO CARGADO');
    }
    
    console.log('\n═══════════════════════════════════════════════════════\n');
  },
  
  /**
   * Verificar flujo completo CSV → Análisis
   */
  debugDataFlow() {
    console.clear();
    console.log('═══════════════════════════════════════════════════════');
    console.log('           🔄 DEBUG DATA FLOW - Flujo de Datos');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const checks = [];
    
    // CHECK 1: Datos en memoria
    const dataLoaded = window.salesData && window.salesData.length > 0;
    checks.push({
      name: '1️⃣ Datos en window.salesData',
      passed: dataLoaded,
      details: dataLoaded ? `✅ ${window.salesData.length} registros` : '❌ Vacío'
    });
    
    // CHECK 2: Datos filtrados
    const filteredLoaded = window.filteredData && window.filteredData.length > 0;
    checks.push({
      name: '2️⃣ Datos en window.filteredData',
      passed: filteredLoaded,
      details: filteredLoaded ? `✅ ${window.filteredData.length} registros` : '❌ Vacío'
    });
    
    // CHECK 3: Estructura de datos
    let structureOK = false;
    if (dataLoaded) {
      const requiredFields = ['zona', 'timestamp', 'pitchType', 'result'];
      const firstRecord = window.salesData[0];
      structureOK = requiredFields.every(f => f in firstRecord);
      checks.push({
        name: '3️⃣ Estructura de datos (zona, timestamp, pitchType, result)',
        passed: structureOK,
        details: structureOK ? '✅ Válida' : '❌ Campos faltantes: ' + requiredFields.filter(f => !(f in firstRecord)).join(', ')
      });
    } else {
      checks.push({
        name: '3️⃣ Estructura de datos',
        passed: false,
        details: '⏭️ Saltado (sin datos)'
      });
    }
    
    // CHECK 4: Orquestador cargado
    const orchestratorLoaded = window.analyticsOrchestrator !== null && window.analyticsOrchestrator !== undefined;
    checks.push({
      name: '4️⃣ AnalyticsOrchestrator instanciado',
      passed: orchestratorLoaded,
      details: orchestratorLoaded ? '✅ Cargado' : '❌ No instanciado'
    });
    
    // CHECK 5: Módulos en orquestador
    let modulesLoaded = false;
    if (orchestratorLoaded) {
      modulesLoaded = window.analyticsOrchestrator.modules && Object.keys(window.analyticsOrchestrator.modules).length > 0;
      checks.push({
        name: '5️⃣ Módulos de análisis cargados',
        passed: modulesLoaded,
        details: modulesLoaded ? `✅ ${Object.keys(window.analyticsOrchestrator.modules).length} módulos` : '❌ Sin módulos'
      });
    } else {
      checks.push({
        name: '5️⃣ Módulos de análisis',
        passed: false,
        details: '⏭️ Saltado (orquestador no cargado)'
      });
    }
    
    // Mostrar resultados
    console.log('CHECKLIST:\n');
    checks.forEach(check => {
      const icon = check.passed ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);
      console.log(`   ${check.details}\n`);
    });
    
    // Resumen
    const passedCount = checks.filter(c => c.passed).length;
    console.log(`\n📊 RESUMEN: ${passedCount}/${checks.length} pasos completados`);
    
    if (passedCount === checks.length) {
      console.log('✅ FLUJO COMPLETO: Todo está conectado correctamente');
    } else {
      console.log('❌ FLUJO INCOMPLETO: Ver detalles arriba');
    }
    
    console.log('\n═══════════════════════════════════════════════════════\n');
    
    return {
      passedCount,
      totalCount: checks.length,
      checks
    };
  },
  
  /**
   * Ver módulos cargados
   */
  debugModules() {
    console.clear();
    console.log('═══════════════════════════════════════════════════════');
    console.log('           📚 DEBUG MODULES - Módulos de Análisis');
    console.log('═══════════════════════════════════════════════════════\n');
    
    if (!window.analyticsOrchestrator) {
      console.log('❌ AnalyticsOrchestrator no está instanciado');
      return;
    }
    
    const modules = window.analyticsOrchestrator.modules || {};
    const moduleNames = Object.keys(modules);
    
    console.log(`📚 MÓDULOS CARGADOS: ${moduleNames.length}\n`);
    
    moduleNames.forEach(name => {
      const module = modules[name];
      const hasFunction = typeof module === 'function';
      console.log(`${hasFunction ? '✅' : '⚠️'} ${name}`);
      console.log(`   Tipo: ${typeof module}`);
      if (hasFunction) {
        console.log(`   ✅ Función disponible\n`);
      } else {
        console.log(`   ⚠️ No es función\n`);
      }
    });
    
    console.log('═══════════════════════════════════════════════════════\n');
  },
  
  /**
   * Limpiar y resetear datos (útil para probar segunda carga)
   */
  clearData() {
    console.log('🧹 Limpiando datos...');
    window.salesData = [];
    window.filteredData = [];
    window.analyticsOrchestrator = null;
    console.log('✅ Datos limpiados. Ahora puedes cargar un nuevo CSV.');
  },
  
  /**
   * Test: simular carga de datos (para debugging sin archivo)
   */
  mockData() {
    console.log('🎭 Cargando datos mock...');
    
    window.salesData = [
      {
        lat: 21.16,
        lng: -86.85,
        monto: 250,
        fechaStr: '2026-01-12',
        zona: 'zona_hotelera',
        pitchType: 'authority',
        result: 'successful',
        clientOrigin: 'CDMX',
        cliente: 'Cliente1',
        id: 0
      },
      {
        lat: 21.17,
        lng: -86.84,
        monto: 150,
        fechaStr: '2026-01-12',
        zona: 'centro',
        pitchType: 'nostalgia',
        result: 'failed',
        clientOrigin: 'Cancun',
        cliente: 'Cliente2',
        id: 1
      }
    ];
    
    window.filteredData = [...window.salesData];
    console.log('✅ Datos mock cargados:', window.salesData.length, 'registros');
    console.log('💡 Ahora ejecuta: onDataLoaded()');
  }
};

// Exponer en consola global
window.debugStatus = DebugHelper.debugStatus.bind(DebugHelper);
window.debugDataFlow = DebugHelper.debugDataFlow.bind(DebugHelper);
window.debugModules = DebugHelper.debugModules.bind(DebugHelper);
window.clearData = DebugHelper.clearData.bind(DebugHelper);
window.mockData = DebugHelper.mockData.bind(DebugHelper);

console.log('✅ DEBUG_HELPER cargado. Comandos disponibles:');
console.log('   - debugStatus()      → Ver estado actual');
console.log('   - debugDataFlow()    → Verificar flujo CSV → Análisis');
console.log('   - debugModules()     → Ver módulos cargados');
console.log('   - clearData()        → Limpiar datos (para nueva carga)');
console.log('   - mockData()         → Cargar datos de prueba (sin archivo)');
