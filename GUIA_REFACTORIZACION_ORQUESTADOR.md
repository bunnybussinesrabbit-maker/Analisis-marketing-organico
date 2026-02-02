# 🏗️ Guía de Refactorización: Orquestador de Análisis Asíncrono

## Contexto

Este documento describe cómo refactorizar funciones de análisis del `index.html` para usar el `AnalyticsOrchestrator` centralizado en `modules_integration.js`. El objetivo es migrar de funciones sincrónicas/mock hacia una arquitectura asíncrona basada en ES6 modules.

---

## 1. Estructura General del Orquestador

### En `modules_integration.js`

```javascript
export default class AnalyticsOrchestrator {
  constructor(data) {
    this.data = data;
    
    // Almacenar módulos importados (pueden ser funciones o clases)
    this.modules = {
      MonteCarloLogistics: monteCarloLogisticSimulation,  // FUNCIÓN
      TimeSeriesForecast: timeSeriesAnalysis,             // CLASE o FUNCIÓN
      BayesianSalesAnalytics: bayesianConversionProbability,  // FUNCIÓN
      // ... otros módulos
    };
    
    this.results = {};
  }

  async runCompleteAnalysis(options = {}) {
    // Ejecuta todos los módulos registrados
    // Retorna: {timestamp, dataPoints, modulesUsed, results}
  }
}
```

### Instanciación Global (en el `<script type="module">`)

```javascript
const orchestrator = new AnalyticsOrchestrator(window.capturedRecords || []);
window.analyticsOrchestrator = orchestrator;
```

---

## 2. Patrón: Función para Botón HTML

### Estructura Recomendada

```javascript
/**
 * Inicializa el Orquestador si no existe
 * @returns {Promise<AnalyticsOrchestrator>}
 */
async function initializeAnalyticsOrchestrator() {
  if (window.analyticsOrchestrator) {
    return window.analyticsOrchestrator;
  }

  if (typeof AnalyticsOrchestrator === 'undefined') {
    throw new Error('AnalyticsOrchestrator no disponible. Verifica modules_integration.js');
  }

  window.analyticsOrchestrator = new AnalyticsOrchestrator(filteredData);
  return window.analyticsOrchestrator;
}

/**
 * Función del botón: Análisis específico
 * @async
 */
async function runMonteCarlo() {
  // 1. Validar datos
  if (!filteredData || filteredData.length === 0) {
    showNotification('⚠️ Carga datos primero', 'warning');
    return;
  }

  showLoading('Procesando...');

  try {
    // 2. Inicializar Orquestador
    await initializeAnalyticsOrchestrator();

    // 3. Ejecutar análisis
    const analysis = await window.analyticsOrchestrator.runCompleteAnalysis({
      runMonteCarlo: true,  // Solo ejecutar este módulo
      monteCarloIterations: 5000
    });

    // 4. Extraer y validar resultados
    const monteCarlo = analysis.results?.monteCarlo;
    
    if (!monteCarlo) {
      throw new Error('No se devolvieron resultados de Monte Carlo');
    }

    // 5. Validar estructura
    if (typeof monteCarlo.expectedRevenue === 'undefined') {
      throw new Error('Estructura de resultados inválida');
    }

    // 6. Renderizar
    renderMontCarloResults(monteCarlo);

    // 7. Mostrar UI
    document.getElementById('analysisResults').classList.remove('hidden');
    showNotification('✅ Análisis completado', 'success');

  } catch (error) {
    console.error('❌ Error:', error);
    showNotification(`❌ Error: ${error.message}`, 'error');
  } finally {
    hideLoading();
  }
}
```

---

## 3. Diferencia: Funciones vs Clases

### Módulo como FUNCIÓN (ej: MonteCarloLogistics)

**En `montecarlo_logistics.js`:**
```javascript
export default function monteCarloLogisticSimulation(data, options = {}) {
  // Procesa directamente
  return {expectedRevenue, confidenceInterval, riskScore};
}
```

**En `modules_integration.js`:**
```javascript
MonteCarloLogistics: monteCarloLogisticSimulation,  // Almacenar función
```

**En `runCompleteAnalysis()`:**
```javascript
// ✅ CORRECTO: Llamar como función
analysis.results.monteCarlo = this.modules.MonteCarloLogistics(this.data, options);

// ❌ INCORRECTO: Intentar instanciar como clase
const mc = new this.modules.MonteCarloLogistics(this.data);
```

---

### Módulo como CLASE (ej: TimeSeriesForecast)

**En `timeseries_forecast.js`:**
```javascript
export default class TimeSeriesForecast {
  constructor(data) {
    this.data = data;
  }
  
  analyzeTemporalPatterns() {
    return {...};
  }
}
```

**En `modules_integration.js`:**
```javascript
TimeSeriesForecast: timeSeriesAnalysis,  // Almacenar clase
```

**En `runCompleteAnalysis()`:**
```javascript
// ✅ CORRECTO: Instanciar
const timeSeries = new this.modules.TimeSeriesForecast(this.data);
analysis.results.timeSeries = timeSeries.analyzeTemporalPatterns();

// ❌ INCORRECTO: Llamar como función
const result = this.modules.TimeSeriesForecast(this.data);
```

---

## 4. Mapeo de Datos: Entrada y Salida

### Input: `filteredData` (desde CSV)

```javascript
{
  zona: "zona_hotelera",
  hora: "14:30",
  monto: 250,
  cliente: "John Doe",
  distance: 2.5,  // Opcional
  // ... otros campos
}
```

### Output: Estructura de Resultados (por módulo)

#### Monte Carlo
```javascript
{
  expectedRevenue: number,
  confidenceInterval: [min, max],
  riskScore: number  // 0-1
}
```

#### Series Temporales
```javascript
{
  hourlyData: {...},
  smoothed: [...],
  peaks: [...],
  recommendation: string
}
```

#### Bayesiano
```javascript
{
  zoneHourProbabilities: {
    "zona_hotelera_14": 0.68,
    "zona_hotelera_15": 0.72,
    // ...
  }
}
```

---

## 5. Manejo de Errores

### En el Botón: Try-Catch

```javascript
async function runAnalysis() {
  showLoading('Procesando...');

  try {
    // Inicialización
    await initializeAnalyticsOrchestrator();

    // Análisis
    const analysis = await window.analyticsOrchestrator.runCompleteAnalysis(options);

    // Validación
    const result = analysis.results?.specificModule;
    if (!result) throw new Error('No hay resultados');

    // Renderizado
    displayResults(result);

  } catch (error) {
    // Log detallado para debug
    console.error('Error en runAnalysis:', error);
    console.error('Stack:', error.stack);

    // Mensaje al usuario
    showNotification(`Error: ${error.message}`, 'error');

  } finally {
    hideLoading();
  }
}
```

### En el Orquestador: Graceful Degradation

```javascript
async runCompleteAnalysis(options = {}) {
  const analysis = {timestamp: ..., results: {}};

  // Cada módulo con try-catch independiente
  if (this.modules.MonteCarlo) {
    try {
      analysis.results.monteCarlo = this.modules.MonteCarlo(this.data);
    } catch (error) {
      console.error('Error en MonteCarlo:', error);
      analysis.results.monteCarlo = null;  // Fallback a null
    }
  }

  return analysis;  // Devuelve incluso si un módulo falló
}
```

---

## 6. Checklist para Conectar un Nuevo Botón

- [ ] **1. Crear función `async`**
  ```javascript
  async function runMyAnalysis() { ... }
  ```

- [ ] **2. Validar datos**
  ```javascript
  if (!filteredData?.length) {
    showNotification('Carga datos', 'warning');
    return;
  }
  ```

- [ ] **3. Mostrar loading**
  ```javascript
  showLoading('Procesando...');
  ```

- [ ] **4. Inicializar orquestador**
  ```javascript
  await initializeAnalyticsOrchestrator();
  ```

- [ ] **5. Ejecutar análisis**
  ```javascript
  const analysis = await window.analyticsOrchestrator.runCompleteAnalysis({
    runMyModule: true
  });
  ```

- [ ] **6. Extraer resultados**
  ```javascript
  const result = analysis.results?.myModule;
  if (!result) throw new Error('No hay resultados');
  ```

- [ ] **7. Validar estructura**
  ```javascript
  if (typeof result.expectedField === 'undefined') {
    throw new Error('Estructura inválida');
  }
  ```

- [ ] **8. Renderizar HTML**
  ```javascript
  document.getElementById('analysisOutput').innerHTML = `...${result.field}...`;
  ```

- [ ] **9. Mostrar contenedor**
  ```javascript
  document.getElementById('analysisResults').classList.remove('hidden');
  ```

- [ ] **10. Manejar errores**
  ```javascript
  } catch (error) {
    console.error('Error:', error);
    showNotification(`Error: ${error.message}`, 'error');
  } finally {
    hideLoading();
  }
  ```

---

## 7. Ejemplo Completo: Refactorizar "Calcular Ruta Óptima"

### Antes (Viejo)
```javascript
function calculateOptimalRoute() {
  try {
    const ruta = knowledgeBase.AdvancedAnalytics.optimizarRuta(puntos, origen);
    // ... mostrar resultados
  } catch (e) {
    alert('Error');
  }
}
```

### Después (Nuevo)
```javascript
async function calculateOptimalRoute() {
  if (!filteredData?.length) {
    showNotification('Carga datos primero', 'warning');
    return;
  }

  showLoading('Optimizando ruta...');

  try {
    // Inicializar
    await initializeAnalyticsOrchestrator();

    // Ejecutar (solo genetic algorithm, no todo)
    const analysis = await window.analyticsOrchestrator.runCompleteAnalysis({
      runBayesian: false,
      runTimeSeries: false,
      runGenetic: true,      // ← Solo este
      runMonteCarlo: false,
      // ... otros: false
    });

    // Extraer resultados
    const genetic = analysis.results?.geneticOptimization;
    if (!genetic || !genetic.route) {
      throw new Error('No se calculó ruta óptima');
    }

    // Renderizar
    const resultsDiv = document.getElementById('analysisOutput');
    resultsDiv.innerHTML = `
      <div class="control-group">
        <h4>Ruta Óptima</h4>
        <p>Distancia: ${genetic.totalDistance.toFixed(2)} km</p>
        <p>Puntos: ${genetic.route.length}</p>
        <ul>
          ${genetic.route.map(p => `<li>${p.name}</li>`).join('')}
        </ul>
      </div>
    `;

    document.getElementById('analysisResults').classList.remove('hidden');
    showNotification('✅ Ruta calculada', 'success');

  } catch (error) {
    console.error('Error en ruta:', error);
    showNotification(`Error: ${error.message}`, 'error');
  } finally {
    hideLoading();
  }
}
```

---

## 8. Debugging & Testing

### En la Consola del Navegador (F12)

```javascript
// Verificar orquestador
console.log(window.analyticsOrchestrator);

// Verificar módulos cargados
console.log(Object.keys(window.analyticsOrchestrator.modules));

// Ejecutar análisis manualmente
const result = await window.analyticsOrchestrator.runCompleteAnalysis();
console.log(result);

// Verificar datos
console.log(filteredData);
```

### Breakpoints

1. En **`modules_integration.js:74`** - línea del `console.log('✅ Orquestador inicializado')`
2. En **`index.html:5319`** - línea del `const analysis = await ...`
3. En **`montecarlo_logistics.js:60`** - línea del `return {...}`

---

## 9. Buenas Prácticas

✅ **DO:**
- Usar `async/await` para operaciones asincrónicas
- Validar siempre antes de renderizar
- Mostrar `showLoading()` y `hideLoading()`
- Log detallado en consola para debugging
- Manejar errores con mensajes claros

❌ **DON'T:**
- Mezclar funciones sincrónicas y asincrónicas
- Asumir que un módulo siempre retorna resultados
- Renderizar sin validar estructura
- Ocultar errores con `try { } catch { }`
- Usar `eval()` o `new Function()`

---

## 10. FAQ

### P: ¿Por qué `MonteCarloLogistics` es una función y no una clase?
**R:** Por flexibilidad. Una función es más ligera y permite composición. Puede cambiar a clase si necesita estado.

### P: ¿Cómo agrego un nuevo módulo?
**R:** 
1. Importarlo en `modules_integration.js`
2. Agregarlo a `this.modules`
3. Agregarlo a `runCompleteAnalysis()` con try-catch
4. Crear función en `index.html` siguiendo este patrón

### P: ¿Qué pasa si `filteredData` está vacío?
**R:** El módulo retorna `{}` o null. Valida siempre antes de acceder a propiedades.

### P: ¿Cómo debugueo si no se ejecuta?
**R:** 
1. Verifica `window.analyticsOrchestrator` en consola
2. Verifica `filteredData.length > 0`
3. Mira los `console.log` del orquestador
4. Usa breakpoints en DevTools

---

**Última actualización:** 31 de enero, 2026
**Arquitectura:** Geo-Suite Cancún PRO v2.0 (Asíncrona ES6)
