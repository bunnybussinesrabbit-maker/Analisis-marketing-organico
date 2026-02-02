# 🎯 VISUAL QUICK START: Arquitectura del Orquestador

## 🔄 Flujo de Ejecución: De Botón a Resultado

```
┌─────────────────────────────────────────────────────────────────┐
│ 1️⃣ USUARIO HACE CLICK EN BOTÓN                                  │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2️⃣ runMonteCarlo() [async] INICIA                              │
├─ ✅ Valida filteredData.length > 0                             │
├─ ✅ showLoading('Ejecutando...')                               │
└─ ⏳ await initializeAnalyticsOrchestrator()                     │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3️⃣ initializeAnalyticsOrchestrator() [async]                   │
├─ ¿window.analyticsOrchestrator existe?                         │
│  ├─ SÍ  → return (ya está listo)                              │
│  ├─ NO  → new AnalyticsOrchestrator(filteredData)             │
│  └─ ERROR → throw (modules_integration.js no cargó)           │
└─ window.analyticsOrchestrator = instancia                       │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4️⃣ ORQUESTADOR LISTO                                            │
├─ .data = [registros CSV]                                       │
├─ .modules = {                                                  │
│    MonteCarloLogistics: función,                              │
│    TimeSeriesForecast: clase,                                 │
│    BayesianSalesAnalytics: función,                           │
│    ... 6 módulos más                                          │
│  }                                                             │
└─ ✅ console.log('✅ Orquestador inicializado')                │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5️⃣ runCompleteAnalysis(options) [async]                        │
├─ options = { runMonteCarlo: true }                            │
├─ ✅ Si MonteCarloLogistics existe:                            │
│    └─ analysis.results.monteCarlo = 🎲 SIMULAR()             │
└─ return analysis                                               │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6️⃣ monteCarloLogisticSimulation(data, options) [FUNCIÓN]       │
├─ 1️⃣  Construir rutas desde data                               │
├─ 2️⃣  FOR 5,000 iteraciones:                                   │
│    ├─ Simular tiempo de viaje                                 │
│    ├─ Calcular probabilidad bayesiana                         │
│    ├─ Determinar si hay venta                                 │
│    └─ Acumular ingresos                                       │
├─ 3️⃣  Calcular media y desviación                              │
├─ 4️⃣  Calcular intervalo de confianza (95%)                    │
└─ 5️⃣  return { expectedRevenue, confidenceInterval, riskScore} │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7️⃣ RESULTADO EN runMonteCarlo()                                 │
├─ const monteCarlo = analysis.results?.monteCarlo              │
├─ ✅ Validar estructura:                                        │
│    ├─ expectedRevenue: number ✅                              │
│    ├─ confidenceInterval: [min, max] ✅                       │
│    └─ riskScore: 0-1 ✅                                       │
└─ ⏳ Proceder a renderización                                   │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8️⃣ RENDERIZAR EN DOM                                            │
├─ const resultsDiv = document.getElementById('analysisOutput')│
├─ resultsDiv.innerHTML = `                                     │
│    <div class="stats-grid">                                   │
│      <div class="stat-card">                                  │
│        <label>Ingreso Esperado</label>                        │
│        <strong>$${expectedRevenue.toLocaleString()}</strong> │
│      </div>                                                   │
│      ...                                                      │
│    </div>                                                     │
│  `                                                             │
└─ document.getElementById('analysisResults')                   │
   .classList.remove('hidden')                                  │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9️⃣ MOSTRAR RESULTADO AL USUARIO                                │
├─ ✅ Panel visible con resultados                              │
├─ ✅ showNotification('✅ Completado', 'success')              │
└─ ✅ hideLoading()                                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Estructura de Datos: El Viaje de los Datos

```
📥 INPUT
┌────────────────────────────────────────┐
│ filteredData (CSV)                     │
├────────────────────────────────────────┤
│ [                                      │
│   {                                    │
│     zona: "zona_hotelera",            │ ← Identificador de zona
│     hora: "14:30",                    │ ← Hora de atención (HH:MM)
│     monto: 250.00,                    │ ← Valor de la venta
│     cliente: "John Doe",              │ ← Opcional
│     distance: 2.5                     │ ← Opcional (km)
│   },                                   │
│   { ... },                             │ ← Más registros
│ ]                                      │
└────────────────────────────────────────┘
                  │
                  ▼ Procesa en 5,000 iteraciones
         🎲 SIMULACIÓN MONTE CARLO
                  │
                  ▼

📤 OUTPUT
┌────────────────────────────────────────┐
│ analysis.results.monteCarlo            │
├────────────────────────────────────────┤
│ {                                      │
│   expectedRevenue: 1250.50,           │ ← Media de ingresos
│   confidenceInterval: [               │ ← Intervalo 95%
│     950.25,    ← Mínimo esperado     │
│     1550.75    ← Máximo esperado     │
│   ],                                   │
│   riskScore: 0.24                     │ ← Volatilidad (0-1)
│ }                                      │
└────────────────────────────────────────┘
```

---

## 🔧 Diferencia: FUNCIÓN vs CLASE

### ❌ INCORRECTO (Llamar función como clase)
```javascript
// ❌ NO HAGAS ESTO
const monteCarlo = new this.modules.MonteCarloLogistics(this.data);
const result = monteCarlo.simulate();  // Error: .simulate() no existe
```

### ✅ CORRECTO (Llamar función directamente)
```javascript
// ✅ HAZE ESTO
const result = this.modules.MonteCarloLogistics(this.data, options);
```

### 📋 Cómo Identificar

```javascript
// ¿Es FUNCIÓN?
export default function monteCarloLogisticSimulation(data) {
  return { expectedRevenue, ... };
}
// Llamar: monteCarloLogisticSimulation(data)

// ¿Es CLASE?
export default class TimeSeriesForecast {
  constructor(data) { this.data = data; }
  analyzeTemporalPatterns() { ... }
}
// Llamar: new TimeSeriesForecast(data).analyzeTemporalPatterns()
```

---

## 🎯 Mapeo: Botones → Módulos → Opciones

```
BOTÓN HTML                  MÓDULO              OPCIÓN
═══════════════════════════════════════════════════════════════
Simulación Monte Carlo  →  MonteCarloLogistics  →  runMonteCarlo: true
Ruta Óptima             →  GeneticRoutOpt       →  runGenetic: true
Series Temporales       →  TimeSeriesForecast   →  runTimeSeries: true
Análisis Bayesiano      →  BayesianSalesAnal    →  runBayesian: true
Procesos Markov         →  MarkovDecisions      →  runMarkov: true
Saturación Mercado      →  MarketSaturation     →  runSaturation: true
Análisis Canibaliz.     →  CannibalizAnalysis   →  runCannibalization: true
```

### Ejemplo de Uso
```javascript
// Ejecutar SOLO Monte Carlo
await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true,
  runBayesian: false,    // No ejecutar otros
  runTimeSeries: false,
  // ... resto: false
});

// Ejecutar MÚLTIPLES
await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true,
  runGenetic: true,      // Ejecutar estos dos
  // resto: false implícito
});

// Ejecutar TODOS (default)
await window.analyticsOrchestrator.runCompleteAnalysis();
```

---

## 🚨 Errores Comunes y Cómo Evitarlos

### ❌ Error 1: Tipografía de `async`
```javascript
// ❌ MAL
aasync function runMonteCarlo() { }  // SyntaxError

// ✅ BIEN
async function runMonteCarlo() { }
```

### ❌ Error 2: Sin Validación de Estructura
```javascript
// ❌ MAL
const revenue = analysis.results.monteCarlo.expectedRevenue;  // Crash si null

// ✅ BIEN
const monteCarlo = analysis.results?.monteCarlo;  // Safe chaining
if (!monteCarlo) throw new Error('Sin resultados');
const revenue = monteCarlo.expectedRevenue;
```

### ❌ Error 3: Olvidar `await`
```javascript
// ❌ MAL
const analysis = window.analyticsOrchestrator.runCompleteAnalysis();  // Promise, no resultado

// ✅ BIEN
const analysis = await window.analyticsOrchestrator.runCompleteAnalysis();
```

### ❌ Error 4: Sin Try-Catch
```javascript
// ❌ MAL
const analysis = await window.analyticsOrchestrator.runCompleteAnalysis();
const result = analysis.results.monteCarlo;  // Si falla, todo se rompe

// ✅ BIEN
try {
  const analysis = await window.analyticsOrchestrator.runCompleteAnalysis();
  const result = analysis.results?.monteCarlo;
  if (!result) throw new Error('Sin resultados');
} catch (error) {
  showNotification(`Error: ${error.message}`, 'error');
}
```

---

## 🧪 Validación Rápida en Consola

```javascript
// 1. ¿Orquestador existe y está listo?
console.log(window.analyticsOrchestrator);
// Output: AnalyticsOrchestrator {data: Array(50), modules: {...}, results: {...}}

// 2. ¿Módulos cargados?
console.log(Object.keys(window.analyticsOrchestrator.modules));
// Output: ["TimeSeriesForecast", "MonteCarloLogistics", "BayesianSalesAnalytics", ...]

// 3. ¿Datos válidos?
console.log(filteredData.length);
// Output: 50  (número de registros)

// 4. ¿Ejecutar análisis manualmente?
const result = await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true
});
console.log(result);
// Output: {timestamp: "...", dataPoints: 50, modulesUsed: ["MonteCarloLogistics"], results: {...}}

// 5. ¿Verificar resultado de Monte Carlo?
console.log(result.results.monteCarlo);
// Output: {expectedRevenue: 1250.50, confidenceInterval: [...], riskScore: 0.24}
```

---

## 🎓 Plantilla: Copiar-Pega para Nuevo Botón

```javascript
/**
 * [Nombre del análisis]
 */
async function run[ModuleName]() {
  // 1. Validar
  if (!filteredData?.length) {
    showNotification('Carga datos primero', 'warning');
    return;
  }

  showLoading('[Mensaje]...');

  try {
    // 2. Inicializar
    await initializeAnalyticsOrchestrator();

    // 3. Ejecutar
    const analysis = await window.analyticsOrchestrator.runCompleteAnalysis({
      run[ModuleName]: true,      // ← Cambiar según módulo
      [optionName]Iterations: 5000  // ← Opcional
    });

    // 4. Validar
    const result = analysis.results?.[moduleName];
    if (!result) throw new Error('[Módulo] no devolvió resultados');

    // 5. Validar estructura (personalizar)
    if (typeof result.expectedField === 'undefined') {
      throw new Error('Estructura de resultado inválida');
    }

    // 6. Renderizar
    const div = document.getElementById('analysisOutput');
    div.innerHTML = `
      <div class="control-group">
        <h4>[Título]</h4>
        <p>Campo 1: ${result.field1}</p>
        <p>Campo 2: ${result.field2}</p>
      </div>
    `;

    // 7. Mostrar
    document.getElementById('analysisResults').classList.remove('hidden');
    showNotification('✅ Análisis completado', 'success');

  } catch (error) {
    console.error('Error:', error);
    showNotification(`❌ ${error.message}`, 'error');
  } finally {
    hideLoading();
  }
}
```

---

## 📞 Preguntas Frecuentes Visuales

```
┌─────────────────────────────────────────────────────────────┐
│ P: ¿Qué pasa si filteredData está vacío?                   │
├─────────────────────────────────────────────────────────────┤
│ R: Se muestra notificación y retorna (no procesa)          │
│                                                             │
│    if (!filteredData?.length) {                            │
│      showNotification('⚠️ Carga datos', 'warning');        │
│      return;  ← Sale aquí sin hacer nada                  │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ P: ¿Qué pasa si modules_integration.js no cargó?           │
├─────────────────────────────────────────────────────────────┤
│ R: Se lanza error y se muestra al usuario                   │
│                                                             │
│    if (typeof AnalyticsOrchestrator === 'undefined') {     │
│      throw new Error('Módulos no cargados');  ← Catch esto │
│    }                                                        │
│                                                             │
│    → showNotification('❌ Error: Módulos...', 'error');    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ P: ¿Puedo ver qué está pasando?                            │
├─────────────────────────────────────────────────────────────┤
│ R: Sí, todos los módulos tienen logs con emojis:          │
│                                                             │
│    🚀 Iniciando...                                          │
│    ⏳ Esperando...                                          │
│    🎲 Simulando...                                          │
│    ✅ Completado                                            │
│    ❌ Error                                                 │
│                                                             │
│    Abre consola (F12) y busca los emojis                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Hoja de Trucos (Cheat Sheet)

| Necesito... | Código | Ubicación |
|-------------|--------|----------|
| Inicializar orquestador | `await initializeAnalyticsOrchestrator()` | index.html:5300 |
| Ejecutar Monte Carlo | `{runMonteCarlo: true}` | modules_integration.js |
| Validar resultado | `if (!result)throw Error(...)` | Tu función |
| Renderizar | `document.getElementById(...).innerHTML = ...` | Tu función |
| Mostrar loading | `showLoading('...')` | Tu función |
| Mostrar error | `showNotification('❌ ...', 'error')` | Tu función |
| Ver logs | Abre F12 → Console | Navegador |
| Debug breakpoint | Ctrl+G → línea → Enter | DevTools |

---

**Última Actualización:** 31 de enero, 2026  
**Versión:** 2.0  
**Proyecto:** Geo-Suite Cancún PRO (Asíncrona ES6)
