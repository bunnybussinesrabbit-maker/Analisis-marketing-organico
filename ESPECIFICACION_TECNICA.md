# 📊 DASHBOARD DE ANÁLISIS CRUZADO - ESPECIFICACIÓN TÉCNICA

## 🎯 Objetivo Final
Permitir análisis interactivo y multidimensional de la efectividad de pitches de ventas, cruzando dimensiones demográficas, geográficas y de origen del cliente para optimizar estrategias D2D.

---

## 🏗️ ARQUITECTURA IMPLEMENTADA

```
┌─────────────────────────────────────────────────────────────────┐
│                       INDEX.HTML (SHELL)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  SCRIPTS IMPORTADOS:                                      │  │
│  │  - groq_cliente.js (LLM API)                              │  │
│  │  - knowledgebase.js (Business logic)                      │  │
│  │  - modules_integration.js (Orchestrator)                  │  │
│  │  - cross_analysis.js ✨ (NEW - Analyzer)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              SECCIÓN: "ANÁLISIS DETALLADO"                 │ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │ TAB 1: DEMOGRÁFICO × PITCH × ZONA                      ││ │
│  │  ├─ Filtros: Edad, Ocupación, Ingreso, Zona, Pitch       ││ │
│  │  ├─ Vizualizaciones: Heatmap / Tabla                      ││ │
│  │  ├─ Insights: Top 5 recomendaciones                       ││ │
│  │  └─ Matriz 4D: [Edad][Ocupación][Pitch][Zona]            ││ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │ TAB 2: ORIGEN × PITCH × RESULTADO                      ││ │
│  │  ├─ Filtros: Origen, Pitch, Resultado                     ││ │
│  │  ├─ Vizualizaciones: Heatmap / Tabla                      ││ │
│  │  ├─ Insights: Top 5 recomendaciones                       ││ │
│  │  └─ Matriz 2D: [Origen][Pitch]                            ││ │
│  │  ┌─────────────────────────────────────────────────────────┐│ │
│  │  │ TOOLBAR                                                ││ │
│  │  ├─ 🔄 Actualizar                                         ││ │
│  │  ├─ ⬇️ Exportar JSON                                      ││ │
│  │  ├─ 🖨️ Imprimir                                           ││ │
│  │  └─ ◀️ ▶️ Paginación                                       ││ │
│  │  └─────────────────────────────────────────────────────────┘│ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ CSS STYLING:                                              │ │
│  │ - .analysis-tabs (navegación entre análisis)              │ │
│  │ - .filters-panel (responsivo, 5 niveles de filtrado)     │ │
│  │ - .heatmap-container (5 intensidades: rojo→verde)         │ │
│  │ - .analysis-table (datos estilizados con gradiente)       │ │
│  │ - .insights-panel (tarjetas interactivas con hover)       │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ JAVASCRIPT INTERACTIVITY:                                 │ │
│  │ - initCompleteAnalysis() - Inicializa analizador          │ │
│  │ - renderDemographicAnalysis() - Renderiza tab 1           │ │
│  │ - renderOriginAnalysis() - Renderiza tab 2                │ │
│  │ - updateDemographicVisualization() - Actualiza con filtros│ │
│  │ - updateOriginVisualization() - Actualiza con filtros     │ │
│  │ - setupAnalysisEventListeners() - Event delegation        │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         ↓ DATOS
┌─────────────────────────────────────────────────────────────────┐
│         CROSS_ANALYSIS.JS (CrossDimensionalAnalyzer)             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ INPUT: CSV filteredData array                              │ │
│  │  {edad_grupo, ocupacion, nivel_ingreso, cliente_origen,    │ │
│  │   zona, tipo_pitch, resultado, monto, timestamp}           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                        ↓ normalizePitchRecords()
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ NORMALIZATION:                                              │ │
│  │ - Auto-map column variants (edad_grupo → ageGroup)          │ │
│  │ - Validate/coerce types (strings → lowercase)               │ │
│  │ - Remove 'unknown' values                                   │ │
│  │ - Extract dimensions (unique values per dimension)          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                        ↓ extractDimensions()
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ OUTPUT: Dimensions object                                   │ │
│  │  {                                                           │ │
│  │    ageGroups: [18-25, 26-35, 36-45, ...],                  │ │
│  │    occupations: [professional, artisan, ...],               │ │
│  │    incomes: [bajo, medio, alto],                            │ │
│  │    origins: [CDMX, Cancun, Internacional, ...],             │ │
│  │    zones: [zona_hotelera, centro, sm_91, ...],              │ │
│  │    pitchTypes: [autoridad, nostalgia, escasez, comunidad], │ │
│  │    results: [successful, failed, pending]                   │ │
│  │  }                                                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ ANÁLISIS PARALELO:                                          │ │
│  │                                                              │ │
│  │  generateDemographicMatrix(filters)                         │ │
│  │  └─ Itera records filtrando por cada dimensión             │ │
│  │  └─ Agrupa por: ageGroup|occupation|pitchType|zone         │ │
│  │  └─ Calcula: successful, failed, pending, total, monto      │ │
│  │  └─ Computa: conversionRate, avgAmount, intensity,         │ │
│  │             confidence                                      │ │
│  │  └─ Ordena por: conversionRate DESC                         │ │
│  │  └─ RETORNA: Array de 4D matrix entries                     │ │
│  │                                                              │ │
│  │  generateOriginMatrix(filters)                              │ │
│  │  └─ Similar pero agrupa por: origin|pitchType              │ │
│  │  └─ RETORNA: Array de 2D matrix entries                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                        ↓
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ INSIGHT GENERATION:                                         │ │
│  │                                                              │ │
│  │  generateInsights(analysisType, filters)                    │ │
│  │  └─ Obtiene top 5 combinaciones                             │ │
│  │  └─ Genera ranking y recomendación para cada               │ │
│  │  └─ RETORNA: Array de insights con:                         │ │
│  │     {rank, label, pitchType, conversionRate, count,         │ │
│  │      successful, avgAmount, recommendation}                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
         ↓ RESULTADOS
┌─────────────────────────────────────────────────────────────────┐
│                    VISUALIZACIÓN (DOM)                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ HEATMAP: Tabla con celdas coloreadas por intensidad        │ │
│  │ ┌──────────────────────────────────────────────────────┐   │ │
│  │ │ Demográfico│Pitch │Zona        │Conv. │Intensidad  │   │ │
│  │ ├──────────────────────────────────────────────────────┤   │ │
│  │ │26-35/Prof │Auto  │Zona Hotel  │70.6% │████ (5)    │   │ │
│  │ │36-45/Art  │Esca  │Centro      │65.0% │███ (4)     │   │ │
│  │ │18-25/Stu  │Nost  │SM 91       │45.0% │██ (3)      │   │ │
│  │ │46-55/Const│Comu  │Región 237  │28.0% │█ (2)       │   │ │
│  │ │56+/Reti   │Auto  │SM 77       │15.0% │ (1)        │   │ │
│  │ └──────────────────────────────────────────────────────┘   │ │
│  │                                                              │ │
│  │ TABLE: HTML table con todos los datos detallados            │ │
│  │ - Columnas: Demográfico, Pitch, Zona, Conversión%, Monto   │ │
│  │ - Filas: Máx 20 (paginadas)                                 │ │
│  │ - Color de fila según intensidad                            │ │
│  │                                                              │ │
│  │ INSIGHTS: 5 tarjetas interactivas                           │ │
│  │ ┌──────────────────────────────────┐                        │ │
│  │ │ Ranking #1     [70.6% ✅]        │                        │ │
│  │ │ 26-35 - Professional             │                        │ │
│  │ │ Pitch: Autoridad | 17 registros  │                        │ │
│  │ │ (12 exitosos)                    │                        │ │
│  │ │ ⭐⭐⭐ ESTRATEGIA ÓPTIMA           │                        │ │
│  │ └──────────────────────────────────┘                        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ EXPORTACIÓN: JSON con ambas matrices + timestamp            │ │
│  │ IMPRESIÓN: Print-friendly version                           │ │
│  │ ACTUALIZACIÓN: Recalcula y re-renderiza todo                │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 EJEMPLO DE PROCESAMIENTO

### INPUT CSV:
```csv
edad_grupo,ocupacion,nivel_ingreso,cliente_origen,zona,tipo_pitch,resultado,monto,timestamp
26-35,professional,alto,CDMX,zona_hotelera,autoridad,successful,250,2025-01-09T14:30:00
26-35,professional,alto,CDMX,zona_hotelera,autoridad,successful,240,2025-01-09T18:00:00
36-45,entrepreneur,medio,Cancun,centro,escasez,successful,180,2025-01-09T15:00:00
36-45,entrepreneur,medio,Cancun,centro,escasez,failed,0,2025-01-10T15:00:00
18-25,student,bajo,Internacional,sm_77,comunidad,successful,100,2025-01-09T16:30:00
```

### DEMOGRAPHIC MATRIX (Después de agrupar):
```
KEY: 26-35|professional|autoridad|zona_hotelera
  ageGroup: "26-35"
  occupation: "professional"
  pitchType: "autoridad"
  zone: "zona_hotelera"
  successful: 2
  failed: 0
  pending: 0
  total: 2
  totalAmount: 490
  conversionRate: 1.0       ← 100%
  avgAmount: 245
  intensity: 5              ← Verde oscuro
  confidence: "medium"      ← 2 registros

KEY: 36-45|entrepreneur|escasez|centro
  successful: 1
  failed: 1
  total: 2
  conversionRate: 0.5       ← 50%
  intensity: 3              ← Amarillo
  confidence: "medium"

KEY: 18-25|student|comunidad|sm_77
  successful: 1
  total: 1
  conversionRate: 1.0
  intensity: 5
  confidence: "low"         ← 1 registro (será filtrado en insights)
```

### ORIGIN MATRIX (Después de agrupar):
```
KEY: CDMX|autoridad
  origin: "CDMX"
  pitchType: "autoridad"
  successful: 2
  total: 2
  conversionRate: 1.0       ← 100%
  intensity: 5
  confidence: "medium"

KEY: Cancun|escasez
  origin: "Cancun"
  pitchType: "escasez"
  successful: 1
  failed: 1
  total: 2
  conversionRate: 0.5       ← 50%
  intensity: 3
  confidence: "medium"

KEY: Internacional|comunidad
  origin: "Internacional"
  pitchType: "comunidad"
  successful: 1
  total: 1
  conversionRate: 1.0
  intensity: 5
  confidence: "low"         ← Será filtrado
```

### INSIGHTS GENERADOS:
```
[
  {
    rank: 1,
    label: "26-35 - professional",
    pitchType: "autoridad",
    conversionRate: 1.0,
    count: 2,
    successful: 2,
    avgAmount: 245,
    recommendation: "⭐⭐⭐ ESTRATEGIA ÓPTIMA - Maximizar esta combinación"
  },
  {
    rank: 2,
    label: "36-45 - entrepreneur",
    pitchType: "escasez",
    conversionRate: 0.5,
    count: 2,
    successful: 1,
    avgAmount: 180,
    recommendation: "⭐⭐ ESTRATEGIA BUENA - Potencial de mejora"
  }
]
```

---

## 🎨 INTENSIDAD Y COLORES

```
INTENSIDAD  RANGO           COLOR      HEX        SIGNIFICADO
1           0-20%          🔴 Rojo     #ef4444    Muy baja
2           20-40%         🟠 Naranja  #f97316    Baja
3           40-60%         🟡 Amarillo #eab308    Media
4           60-80%         🟢 Lima     #84cc16    Alta
5           80-100%        🟢 Verde    #10b981    Muy alta
```

---

## ✨ CARACTERÍSTICAS DESTACADAS

### ✅ Normalización Automática de Columnas
El módulo reconoce múltiples variantes de nombres de columnas:
- `edad_grupo` / `age_group` / `demographic.ageGroup` → `ageGroup`
- `ocupacion` / `occupation` / `demographic.occupation` → `occupation`
- `nivel_ingreso` / `income_level` / `demographic.income` → `income`
- Similar para zona, pitch, origen, resultado, monto

### ✅ Filtrado Multi-nivel
Aplicar filtros en cualquier combinación sin afectar otros:
```javascript
// Ejemplo: "¿Qué funciona mejor para profesionales CDMX?"
filters = {
  occupation: "professional",
  origin: "CDMX"
}
// Los filtros se aplican AND lógico
```

### ✅ Visualización Dual
Alternar entre Heatmap (visual rápido) y Tabla (datos detallados) sin recargar

### ✅ Insights Inteligentes
- Filtra automáticamente combinaciones con < 2 registros (falta de validez)
- Genera Top 5 con ranking automático
- Incluye recomendación contextual (⭐⭐⭐ vs ⭐ vs ❌)

### ✅ Exportación JSON
Descarga análisis completo para procesamiento externo/BI

### ✅ Caché y Performance
- Service Worker v2 cachea módulo y assets
- Algoritmo O(n) para cada análisis
- DOM rendering optimizado (max 20 filas iniciales)

---

## 🧪 TESTING RECOMENDADO

```javascript
// 1. Verificar carga de módulo
console.log(window.CrossDimensionalAnalyzer) // ✅ Debe existir

// 2. Cargar datos de prueba
filteredData = [
  {edad_grupo: "26-35", ocupacion: "professional", ...},
  ...
]

// 3. Inicializar análisis
initCompleteAnalysis()

// 4. Verificar instancia
console.log(currentAnalyzer) // ✅ Debe ser instancia de CrossDimensionalAnalyzer

// 5. Generar matriz demográfica
const matrix = currentAnalyzer.generateDemographicMatrix({})
console.log(matrix.length) // ✅ Debe tener resultados

// 6. Verificar insights
const insights = currentAnalyzer.generateInsights('demographic')
console.log(insights[0]) // ✅ Debe tener rank, label, recommendation, etc.
```

---

## 📝 NOTAS DE IMPLEMENTACIÓN

1. **Namespacing**: Todas las funciones están en scope de index.html `<script>`
2. **Error Handling**: Try-catch en initCompleteAnalysis() con feedback al usuario
3. **Responsive**: CSS uses media queries (@media 768px) para mobile
4. **Accesibilidad**: Todos los botones usan `aria-labels` (a añadir si necesario)
5. **PWA**: Service Worker v2 cachea nuevo módulo cross_analysis.js

---

## 🚀 PRÓXIMAS MEJORAS (Opcional)

- [ ] Agregar Chart.js para gráficos avanzados (scatter, bubble)
- [ ] Exportar a PDF con estilos
- [ ] Integración con groq_cliente.js para insights con IA
- [ ] Real-time updates con WebSocket (si hay backend)
- [ ] Drill-down: clic en celda → ver detalles de registros individuales
- [ ] Time-series overlay: mostrar trends temporales

---

**Versión**: 1.0.0  
**Estado**: ✅ Production Ready  
**Última actualización**: 9 Enero 2025
