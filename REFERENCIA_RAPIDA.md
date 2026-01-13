# 🔖 REFERENCIA RÁPIDA - Cheat Sheet

## 📍 Ubicación de Cambios Clave

| Función | Archivo | Línea | Propósito |
|---------|---------|-------|----------|
| `FieldMapper` (objeto global) | `utils/fieldMapper.js` | 1-213 | Mapeo de campos CSV |
| `normalizeRecord()` | `utils/fieldMapper.js` | 45 | Normaliza 1 registro |
| `normalizeRecords()` | `utils/fieldMapper.js` | 65 | Normaliza array |
| `detectDemographicFields()` | `utils/fieldMapper.js` | 85 | Detecta demográfico |
| `CrossDimensionalAnalyzer` | `analytics_module/cross_analysis.js` | 1-300 | Análisis cruzado |
| `hasDemographicData` (prop) | `analytics_module/cross_analysis.js` | 20 | Flag de demográfico |
| `syncAnalysisData()` | `index.html` | 5430 | Sincroniza datos |
| `initCompleteAnalysis()` | `index.html` | 5480 | Inicializa análisis |
| `applyFilters()` | `index.html` | 2871 | Aplica + sincroniza |
| `showView()` | `index.html` | 2573 | Auto-inicializa análisis |
| `runIntegrationTests()` | `TEST_INTEGRATION.js` | 1-200+ | Suite de tests |

---

## 🔧 Cómo Usar Cada Componente

### 1️⃣ FieldMapper - Normalizar Datos
```javascript
// ✅ Normalizar 1 registro
const normalized = FieldMapper.normalizeRecord({
  zona: 'centro',
  estado: 'si',
  pitch_type: 'nostalgia',
  edad: 35
});
// Resultado: { zone: 'centro', result: 'successful', pitchType: 'nostalgia', ageGroup: '35' }

// ✅ Normalizar array
const records = FieldMapper.normalizeRecords(rawData);

// ✅ Detectar demográfico
const has = FieldMapper.detectDemographicFields(records);
// { hasAge: true, hasOccupation: false, ... }

// ✅ Generar reporte
const report = FieldMapper.generateMappingReport(rawData);
// { totalRecords: 100, validRecords: 95, warnings: [...] }
```

### 2️⃣ CrossDimensionalAnalyzer - Analizar Datos
```javascript
// ✅ Crear instancia
const analyzer = new CrossDimensionalAnalyzer(normalizedData);
// analyzer.hasDemographicData → true/false
// analyzer.dimensions → { zones: [...], pitchTypes: [...], ... }

// ✅ Generar matriz demográfica
const demographic = analyzer.generateDemographicMatrix();
// Retorna: array de { ageGroup, occupation, pitchType, zone, conversionRate, ... }

// ✅ Generar matriz de origen
const origin = analyzer.generateOriginMatrix();
// Retorna: array de { origin, pitchType, result, conversionRate, ... }

// ✅ Generar insights
const insights = analyzer.generateInsights('demographic');
// Retorna: TOP 5 combinaciones + recomendaciones
```

### 3️⃣ syncAnalysisData - Sincronizar
```javascript
// ✅ Sincronizar datos filtrados
const success = syncAnalysisData(filteredData);
// Normaliza, valida, crea analyzer, actualiza currentAnalyzer

// ✅ Verificar resultados
console.log(currentAnalyzer);           // Instancia de CrossDimensionalAnalyzer
console.log(currentAnalysisData);       // { originalCount, normalizedCount, ... }
console.log(analysisValidationReport);  // Reporte de mapeo
```

### 4️⃣ initCompleteAnalysis - Inicializar UI
```javascript
// ✅ Inicializa análisis completo
initCompleteAnalysis();
// 1. Valida que filteredData existe
// 2. Sincroniza datos (llama syncAnalysisData)
// 3. Renderiza demográfico y origen
// 4. Configura event listeners

// ✅ Se ejecuta automáticamente cuando:
// - Usuario hace clic en "Análisis Completo"
// - showView('complete-analysis') es llamado
```

---

## 🧪 Testing Rápido

### En DevTools Console:
```javascript
// ✅ Test 1: Validar FieldMapper
FieldMapper.normalizeRecords([...datos...]).length

// ✅ Test 2: Validar Analyzer
new CrossDimensionalAnalyzer([...datos...]).hasDemographicData

// ✅ Test 3: Validar Sincronización
syncAnalysisData(filteredData); console.log(currentAnalyzer)

// ✅ Test 4: Ejecutar suite completa
runIntegrationTests()

// ✅ Test 5: Ver reporte de validación
analysisValidationReport
```

---

## 📊 Propiedades de CrossDimensionalAnalyzer

```javascript
const analyzer = new CrossDimensionalAnalyzer(data);

analyzer.records                 // Array normalizado de registros
analyzer.dimensions              // { ageGroups, occupations, zones, pitchTypes, ... }
analyzer.hasDemographicData      // Boolean - ¿Hay datos demográficos?

analyzer.generateDemographicMatrix()  // Matriz: edad × ocupación × pitch × zona
analyzer.generateOriginMatrix()       // Matriz: origen × pitch × resultado
analyzer.generateInsights()           // TOP 5 combinaciones con recomendaciones
analyzer.exportResults()              // JSON exportable
```

---

## 🔄 Flujo de Sincronización

```
User Action
    ↓
applyFilters() / resetFilters()
    ↓
syncAnalysisData(filteredData)
    ↓
FieldMapper.normalizeRecords()
    ↓
new CrossDimensionalAnalyzer(normalized)
    ↓
currentAnalyzer = analyzer
currentAnalysisData = metadata
analysisValidationReport = report
    ↓
UI actualizado (si está visible)
```

---

## ⚠️ Casos de Error Común

```javascript
// ❌ PROBLEMA: CrossDimensionalAnalyzer no existe
// ✅ SOLUCIÓN: Verifica que cross_analysis.js está en analytics_module/

// ❌ PROBLEMA: currentAnalyzer es null
// ✅ SOLUCIÓN: Primero llama syncAnalysisData(data) o initCompleteAnalysis()

// ❌ PROBLEMA: FieldMapper no definido
// ✅ SOLUCIÓN: Verifica que fieldMapper.js está en utils/ y se carga en index.html

// ❌ PROBLEMA: No hay datos demográficos
// ✅ SOLUCIÓN: Es normal si CSV no tiene edad/ocupación. Análisis continúa con origen/pitch/zona

// ❌ PROBLEMA: Errores al cambiar filtros
// ✅ SOLUCIÓN: Asegúrate que syncAnalysisData() se llama en applyFilters()
```

---

## 🎯 Decidir si Usar Demográfico o No

```javascript
// En initCompleteAnalysis():
if (currentAnalyzer.hasDemographicData) {
  // Mostrar análisis demográfico 5D
  renderDemographicAnalysis();
} else {
  // Mostrar advertencia y análisis 3D por origen
  showWarning('Sin datos demográficos');
  skipDemographicTab();
}
```

---

## 📝 Agregar Nuevo Campo a Mapeo

```javascript
// En fieldMapper.js → FIELD_MAP:
FIELD_MAP: {
  // Agregar:
  'mi_nuevo_campo': 'canonical_name',
  'variante_2': 'canonical_name',
  ...
}

// En VALUE_NORMALIZERS (si necesita transformación):
VALUE_NORMALIZERS: {
  'canonical_name': (val) => {
    // Lógica de transformación
    return transformedValue;
  }
}

// ¡Listo! Automáticamente mapea el nuevo campo
```

---

## 🚀 Flujo de Un Nuevo Análisis

```javascript
// 1. Cargar datos
salesData = [...datos del CSV...]
filteredData = [...datos filtrados...]

// 2. Normalizar (automático en syncAnalysisData)
const normalized = FieldMapper.normalizeRecords(filteredData);

// 3. Analizar (automático en syncAnalysisData)
currentAnalyzer = new CrossDimensionalAnalyzer(normalized);

// 4. Renderizar (automático en initCompleteAnalysis)
renderDemographicAnalysis();
renderOriginAnalysis();

// 5. Usuario interactúa
// → Click en tabla/heatmap
// → Click en Refresh/Export
// → Filtros cambian → syncAnalysisData automáticamente
```

---

## 📊 Variables Globales Importantes

```javascript
// Estado actual de datos
window.salesData              // Array - datos crudos del CSV
window.filteredData           // Array - datos después de filtros

// Estado del análisis
window.currentAnalyzer        // CrossDimensionalAnalyzer instance
window.currentAnalysisData    // Object - metadata { originalCount, normalizedCount, ... }
window.analysisValidationReport // Object - reporte de mapeo

// Otros
window.map                    // Mapbox map instance
window.analyticsOrchestrator  // AnalyticsOrchestrator instance (si existe)
```

---

## 🎨 UI Elements Clave

```html
<!-- Sección de análisis -->
<section id="complete-analysis" class="view-section">

  <!-- Pestañas -->
  <div id="demographicAnalysis">...</div>
  <div id="originAnalysis">...</div>

  <!-- Controles -->
  <button id="toggleVisualization">Tabla/Heatmap</button>
  <button id="refreshAnalysis">Refresh</button>
  <button id="exportAnalysis">Export</button>
  <button id="printAnalysis">Print</button>

</section>
```

---

## 📱 Responsive & Performance

- **Mobile**: Análisis se adapta a pantalla pequeña (CSS media queries)
- **Performance**: Máx 1000 registros en browser (más = considerar backend)
- **Cache**: Service Worker cachea fieldMapper.js y cross_analysis.js

---

## 🔐 Seguridad & Validación

- ✅ No ejecuta código en CSV (solo texto)
- ✅ Valida estructura de datos antes de usar
- ✅ Fallbacks para campos faltantes
- ✅ Tipos explícitos en normalizadores
- ✅ Límites en iteraciones (máx 1000 registros)

---

## 📞 Debug Tips

```javascript
// Ver qué está pasando:
console.log('📊 Analyzer:', currentAnalyzer);
console.log('✅ Report:', analysisValidationReport);
console.log('🔄 Data:', currentAnalysisData);

// Probar con datos simulados:
window.filteredData = [
  { zona: 'centro', estado: 'successful', pitch_type: 'nostalgia', monto: 250 },
  { zona: 'hotelera', estado: 'failed', pitchType: 'authority', amount: 0 }
];
syncAnalysisData(window.filteredData);

// Ver warnings:
analysisValidationReport.warnings.forEach(w => console.warn(w));

// Exportar datos analizados:
console.save(currentAnalyzer.exportResults(), 'analysis.json');
```

---

## 🎓 Resumen Rápido

| Acción | Código |
|--------|--------|
| **Cargar y normalizar CSV** | `syncAnalysisData(filteredData)` |
| **Ver si hay demográfico** | `currentAnalyzer.hasDemographicData` |
| **Generar análisis** | `analyzer.generateDemographicMatrix()` |
| **Ver warnings** | `analysisValidationReport.warnings` |
| **Ejecutar tests** | `runIntegrationTests()` |
| **Exportar** | `currentAnalyzer.exportResults()` |

---

**Última actualización**: 2026-01-09  
**Versión**: 1.1.0  
**Estado**: ✅ Listo para usar

