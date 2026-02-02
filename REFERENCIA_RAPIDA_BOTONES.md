# ⚡ REFERENCIA RÁPIDA: Conectar Botones al Orquestador

## 1️⃣ Los 3 Pasos Principales

```javascript
// PASO 1: Esperar a que el orquestador esté listo
await initializeAnalyticsOrchestrator();

// PASO 2: Ejecutar análisis específico
const analysis = await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true  // Solo este módulo
});

// PASO 3: Usar resultados
const result = analysis.results.monteCarlo;
```

---

## 2️⃣ Plantilla Mínima para Cualquier Botón

```javascript
async function runMyAnalysis() {
  if (!filteredData?.length) return showNotification('Carga datos', 'warning');
  
  showLoading('Procesando...');
  try {
    await initializeAnalyticsOrchestrator();
    const analysis = await window.analyticsOrchestrator.runCompleteAnalysis({
      runMyModule: true
    });
    
    const result = analysis.results?.myModule;
    if (!result) throw new Error('Sin resultados');
    
    // Renderizar: document.getElementById('analysisOutput').innerHTML = ...
    document.getElementById('analysisResults').classList.remove('hidden');
    showNotification('✅ Completado', 'success');
  } catch (error) {
    showNotification(`❌ ${error.message}`, 'error');
  } finally {
    hideLoading();
  }
}
```

---

## 3️⃣ Mapeo Módulos → Opciones

| Botón | Opción | Módulo | Output |
|-------|--------|--------|--------|
| Monte Carlo | `runMonteCarlo: true` | `MonteCarloLogistics` | `{expectedRevenue, confidenceInterval, riskScore}` |
| Series Temporales | `runTimeSeries: true` | `TimeSeriesForecast` | `{hourlyData, smoothed, peaks}` |
| Ruta Óptima | `runGenetic: true` | `GeneticRouteOptimization` | `{route, distance, efficiency}` |
| Bayesiano | `runBayesian: true` | `BayesianSalesAnalytics` | `{zoneHourProbabilities}` |
| Markov | `runMarkov: true` | `MarkovDecisions` | `{nextAction, value}` |
| Saturación | `runSaturation: true` | `MarketSaturation` | `{saturation, growth}` |

---

## 4️⃣ Errores Comunes

### ❌ Problema: "Cannot read properties of undefined"
```javascript
// MAL
const result = analysis.results.monteCarlo.expectedRevenue;  // Crash si null

// BIEN
const result = analysis.results?.monteCarlo?.expectedRevenue;  // Safe check
if (!result) throw new Error('Sin resultados');
```

### ❌ Problema: "aasync" o "assync"
```javascript
// MAL
aasync function runMonteCarlo() { }

// BIEN
async function runMonteCarlo() { }
```

### ❌ Problema: Instanciar como clase cuando es función
```javascript
// MAL
const mc = new this.modules.MonteCarloLogistics(data);  // Error

// BIEN
const result = this.modules.MonteCarloLogistics(data);  // Función
```

---

## 5️⃣ Estructura Mínima de `filteredData`

```javascript
{
  zona: "zona_hotelera",      // ✅ Requerido
  hora: "14:30",              // ✅ Requerido (HH:MM)
  monto: 250.00,              // ✅ Requerido
  cliente: "John Doe",        // Opcional
  distance: 2.5,              // Opcional (para Monte Carlo)
  // ... otros campos
}
```

---

## 6️⃣ Validación Rápida

```javascript
// En consola: F12 → Console
console.log(window.analyticsOrchestrator);  // ¿Existe?
console.log(Object.keys(window.analyticsOrchestrator.modules));  // ¿Módulos?
console.log(filteredData.length);  // ¿Datos?

// Ejecutar manualmente
const result = await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true
});
console.log(result);  // Ver qué retorna
```

---

## 7️⃣ Opciones de `runCompleteAnalysis()`

```javascript
// Ejecutar TODO
await window.analyticsOrchestrator.runCompleteAnalysis();

// Ejecutar solo Monte Carlo
await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true,
  monteCarloIterations: 10000  // Opcional
});

// Ejecutar múltiples
await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true,
  runTimeSeries: true,
  runBayesian: false,  // Saltar este
});
```

---

## 8️⃣ Logs para Debugging

```javascript
// En index.html (donde está runMonteCarlo):
console.log('🚀 Iniciando análisis...');  // Al entrar
console.log('✅ Orquestador listo');      // Después de inicializar
console.log('📊 Resultados:', analysis);  // Después de ejecutar

// En modules_integration.js:
console.log('🔮 Ejecutando Bayesiano...');  // Antes de cada módulo
console.log('✅ Bayesiano completado');     // Después

// En montecarlo_logistics.js:
console.log('🎲 Simulando 5000 iteraciones...');
console.log('✅ Simulación completada:', resultado);
```

---

## 9️⃣ Renderizado HTML

```javascript
// Estructura esperada en index.html:
<div id="analysisResults" class="control-group hidden">
  <h3>Resultados</h3>
  <div id="analysisOutput">
    <!-- Aquí va el HTML renderizado -->
  </div>
</div>

// En el código:
const resultsDiv = document.getElementById('analysisOutput');
resultsDiv.innerHTML = `
  <div class="stat-card">
    <label>Ingreso Esperado</label>
    <strong>$${result.expectedRevenue.toLocaleString('es-MX')}</strong>
  </div>
`;

document.getElementById('analysisResults').classList.remove('hidden');
```

---

## 🔟 Checklist Antes de Push

- [ ] ¿Función es `async`? (no `aasync`)
- [ ] ¿Llamar `await initializeAnalyticsOrchestrator()`?
- [ ] ¿Usar `await` en `runCompleteAnalysis()`?
- [ ] ¿Validar estructura de resultado?
- [ ] ¿Try-catch con manejo de error?
- [ ] ¿Renderizar en `#analysisOutput`?
- [ ] ¿Mostrar `#analysisResults`?
- [ ] ¿Mostrar `loading` y `hideLoading()`?
- [ ] ¿Notificación con `showNotification()`?
- [ ] ¿Logs en console para debug?

---

## 🔗 Archivos Relacionados

- **[GUIA_REFACTORIZACION_ORQUESTADOR.md](./GUIA_REFACTORIZACION_ORQUESTADOR.md)** - Guía completa (400+ líneas)
- **[REFACTORIZACION_COMPLETADA.md](./REFACTORIZACION_COMPLETADA.md)** - Resumen de cambios
- **[modules_integration.js](./modules_integration.js)** - Orquestador principal
- **[index.html](./index.html)** - Líneas 5291-5361 (runMonteCarlo)

---

**Última actualización:** 31 de enero, 2026  
**Proyecto:** Geo-Suite Cancún PRO v2.0
