# 🚀 GUÍA DE PRUEBA - Implementación Análisis Cruzado

## ✅ Cambios Implementados

### 1. **fieldMapper.js** (Nuevo)
- **Ubicación**: `utils/fieldMapper.js`
- **Función**: Mapear variantes de nombres de campos CSV a formato canónico
- **Soporta**: Multiple formatos de entrada (zona/zoneId/zone_id, estado/result, etc.)
- **Métodos principales**:
  - `normalizeRecord(record)` - Normaliza un registro
  - `normalizeRecords(records)` - Normaliza array
  - `detectDemographicFields(records)` - Detecta si hay datos demográficos
  - `generateMappingReport(records)` - Crea reporte de validación

### 2. **cross_analysis.js** (Mejorado)
- **Mejoras**:
  - Mejor manejo de campos faltantes (fallback a 'unknown')
  - Detección automática de disponibilidad de datos demográficos
  - Métodos de normalización seguros (safeString, safeNumber, safeDate)
  - Validación robusta de registros normalizados

### 3. **index.html** (Modificado)
- **Agregados**:
  - Script de carga de `fieldMapper.js`
  - Función `syncAnalysisData()` - Sincroniza datos filtrados con analyzer
  - Mejora en `initCompleteAnalysis()` - Ahora valida y normaliza entrada
  - Auto-inicialización en `showView()` cuando se abre sección análisis
  - Event listeners en `applyFilters()` y `resetFilters()` para sincronizar

## 🧪 Cómo Probar

### Opción A: Testing en DevTools (Recomendado)

1. **Abre la aplicación** en tu navegador (requiere servidor local):
   ```bash
   # En terminal, desde la carpeta del proyecto
   python -m http.server 8000
   # O con Node.js:
   npx http-server
   ```
   Luego abre: `http://localhost:8000`

2. **Abre la consola del DevTools** (F12 o Ctrl+Shift+I)

3. **Copia y pega el siguiente código** en la consola:
   ```javascript
   // Cargar el script de tests
   fetch('./TEST_INTEGRATION.js')
     .then(r => r.text())
     .then(code => eval(code))
     .then(() => runIntegrationTests())
     .catch(err => console.error('Error:', err));
   ```

4. **Verifica que todas las pruebas pasen** ✅

### Opción B: Testing Manual

1. **Abre la aplicación** en navegador

2. **Carga un CSV** con datos de prueba:
   - Usa el botón "Subir CSV" en la sección "Datos"
   - El CSV debe tener columnas como: `zona, estado, pitch_type, monto, origen`

3. **Aplica filtros** (opcional):
   - Selecciona fecha, zona, hora
   - Haz clic en "Aplicar Filtros"

4. **Abre "Análisis Completo"**:
   - En el menú lateral, haz clic en "Análisis Completo"
   - Debería cargarse automáticamente si hay datos

5. **Verifica que funciona**:
   - Deberías ver las pestañas "Demográfico" y "Origen"
   - Si no hay datos demográficos, verás un mensaje de advertencia
   - Podés cambiar entre vistas (tabla/heatmap) con los botones

### Opción C: Testing en Consola (Rápido)

En la consola del DevTools (F12):

```javascript
// 1. Simular carga de datos
window.salesData = [
  { zona: 'centro', hora: '14:30', estado: 'successful', pitch_type: 'nostalgia', monto: 250, origen: 'CDMX', fecha: new Date('2026-01-05') },
  { zona: 'zona_hotelera', hora: '16:45', estado: 'failed', pitchType: 'authority', amount: 0, clientOrigin: 'Cancun', fecha: new Date('2026-01-07') }
];
window.filteredData = [...salesData];

// 2. Validar FieldMapper
console.log('Normalización:', FieldMapper.normalizeRecords(salesData).length);

// 3. Sincronizar análisis
syncAnalysisData(filteredData);
console.log('Analyzer:', currentAnalyzer ? 'Activo ✅' : 'Inactivo ❌');
console.log('Demográfico:', currentAnalyzer.hasDemographicData);
```

## 🔍 Qué se Valida

| Aspecto | Validación |
|---------|-----------|
| **FieldMapper** | Mapea correctamente campos con variantes (zona→zone, estado→result) |
| **Normalización** | Convierte valores (si→successful, no→failed) |
| **Fallbacks** | Si falta un campo, usa 'unknown' en lugar de crashear |
| **Demografía** | Detecta si hay datos de edad/ocupación/ingreso |
| **Analyzer** | Crea instancia sin errores |
| **Matrices** | Genera combinaciones de dimensiones |
| **Sincronización** | Mantiene actualizado `currentAnalyzer` al filtrar |
| **Auto-inicialización** | `initCompleteAnalysis()` se ejecuta al cambiar vista |

## ✨ Puntos Clave de la Implementación

### 1. Dos Sistemas Mantienen Separados (Decisión A)
- ✅ `AnalyticsOrchestrator` (bayesiano, monte carlo, etc.) sigue siendo independiente
- ✅ `CrossDimensionalAnalyzer` (análisis demográfico/origen) sigue siendo independiente
- ⚠️ NO están integrados, pero ahora se comunican mejor vía `currentAnalyzer`

### 2. Sin Datos Demográficos (Decisión A)
- ✅ Si CSV no tiene edad/ocupación/ingreso → mostrará solo análisis por Origen × Pitch × Zona
- ✅ No crashea, simplemente adapta el análisis
- ⚠️ El usuario ve advertencia clara en DevTools

### 3. Validación en Browser (Decisión B)
- ✅ `TEST_INTEGRATION.js` permite probar sin backend
- ✅ `syncAnalysisData()` valida antes de crear analyzer
- ⚠️ Si hay errores, se loguean en consola con contexto

## 📋 Checklist de Verificación

Después de probar, verifica que:

- [ ] ✅ `FieldMapper` carga sin errores
- [ ] ✅ `CrossDimensionalAnalyzer` se instancia correctamente
- [ ] ✅ `syncAnalysisData()` sincroniza datos filtrados
- [ ] ✅ Al abrir "Análisis Completo", se ejecuta `initCompleteAnalysis()` automáticamente
- [ ] ✅ Si hay demográfico, muestra análisis 5D
- [ ] ✅ Si no hay demográfico, muestra advertencia y análisis 3D
- [ ] ✅ Al cambiar filtros, el análisis se actualiza automáticamente
- [ ] ✅ Botones de tabla/heatmap funcionan en ambas pestañas (Demográfico, Origen)
- [ ] ✅ No hay errores en console.log del DevTools

## 🐛 Si Algo Falla

1. **Abre DevTools** (F12)
2. **Ve a Console**
3. **Busca errores** (rojo) o advertencias (amarillo)
4. **Copia el error completo** y compartilo para debugging

### Errores Comunes

| Error | Solución |
|-------|----------|
| `FieldMapper is not defined` | Asegúrate que `utils/fieldMapper.js` esté en la carpeta `utils/` |
| `CrossDimensionalAnalyzer is not defined` | Verifica que `analytics_module/cross_analysis.js` esté actualizado |
| `currentAnalyzer is null` | Primero carga datos (CSV) y luego abre "Análisis Completo" |
| `No se ve Análisis Completo` | Recarga la página (Ctrl+F5) para limpiar cache |
| `Campos mapeados incorrectamente` | Verifica que los nombres del CSV coincidan con los del fieldMapper |

## 📊 Datos de Prueba CSV

Crea un archivo `test_data.csv` con este contenido:

```csv
zona,hora,estado,pitch_type,monto,origen,edad,ocupacion,ingreso
centro,14:30,successful,nostalgia,250,CDMX,35,professional,high
centro,10:00,failed,authority,0,LOCAL,42,entrepreneur,upper_middle
zona_hotelera,16:45,successful,scarcity,500,CDMX,28,tourist,middle
zona_hotelera,09:00,successful,authority,300,CANCUN,45,business_owner,high
region_237,18:00,failed,community,0,LOCAL,32,artisan,lower_middle
```

Sube este CSV en la sección "Datos" y verifica que funcione el análisis.

---

**Última actualización**: 2026-01-09  
**Versión**: 1.1.0  
**Estado**: ✅ Listo para pruebas

