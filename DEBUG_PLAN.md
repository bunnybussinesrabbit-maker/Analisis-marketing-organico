# Plan de Debugging: Desconexión CSV → Módulos de Análisis

## 🎯 Problema Identificado

Cuando cargas un CSV:
- ✅ Se muestra "N registros cargados correctamente"
- ❌ Pero los módulos de análisis dicen "Favor de cargar datos"

**Causa Raíz:** `onDataLoaded()` (función que inicializa los módulos) nunca se ejecutaba después de procesar el CSV.

---

## 📋 Cambios Implementados

### 1. **Mejorada `onDataLoaded()`** (index.html L2693)
- Ahora incluye validación completa de estructura de datos
- Verifica que existan campos requeridos: `zona`, `timestamp`, `pitchType`, `result`
- Resetea el orquestador anterior para evitar conflictos entre cargas
- Incluye debug logs detallados en consola

### 2. **Conectado `onDataLoaded()` a `processData()`** (index.html L3405)
- **Cambio crítico:** Al final de procesar el CSV, ahora se ejecuta `onDataLoaded()`
- Esto asegura que los módulos se inicialicen automáticamente después de cargar datos

### 3. **Mejorada validación en `processData()`** (index.html L3388)
- Elimina registros con valores "unknown" (datos corruptos)
- Verifica que al menos haya registros válidos después de limpiar
- Log detallado de cuántos registros se limpian

### 4. **Mejorada `initAdvancedModules()`** (index.html L6468)
- Valida que haya datos reales (no solo array vacío)
- Verifica registro válido sin zonas "unknown"
- Debug logs en cada paso del proceso
- Asigna a `window.analyticsOrchestrator` explícitamente

### 5. **Herramienta DEBUG_HELPER.js** (nuevo archivo)
- Comandos en consola para debuggear en tiempo real
- Sin necesidad de archivo - facilita testing

---

## 🔧 Cómo Debuggear

### Paso 1: Abre DevTools (F12 en el navegador)

### Paso 2: Ve a la pestaña **Console**

### Paso 3: Carga un CSV normalmente

### Paso 4: En la consola, ejecuta los comandos:

```javascript
// Ver estado actual del sistema
debugStatus()

// Verificar flujo completo CSV → Análisis
debugDataFlow()

// Ver módulos cargados
debugModules()
```

---

## 📊 Entender los Debug Logs

Cuando cargas CSV, verás logs como:

```
🔄 [onDataLoaded] Iniciando reinicialización de módulos...
📊 window.salesData: 50 registros
🔍 window.filteredData: 50 registros
✅ [onDataLoaded] Estructura de datos validada
🧹 [onDataLoaded] Limpiando orquestador anterior...
🚀 [onDataLoaded] Llamando initAdvancedModules()...
```

**Esto significa:** Flujo correctamente ejecutado

---

## ✅ Checklist de Validación

Después de cargar CSV, verifica que:

- [ ] Console muestra "🔄 [onDataLoaded] Iniciando..."
- [ ] Sin errores "❌ [onDataLoaded]"
- [ ] `debugStatus()` muestra:
  - ✅ window.salesData con N registros
  - ✅ Primer registro con propiedades: zona, timestamp, pitchType, result
  - ✅ AnalyticsOrchestrator: CARGADO

- [ ] `debugDataFlow()` muestra:
  - ✅ 1️⃣ Datos en window.salesData
  - ✅ 2️⃣ Datos en window.filteredData
  - ✅ 3️⃣ Estructura de datos válida
  - ✅ 4️⃣ AnalyticsOrchestrator instanciado
  - ✅ 5️⃣ Módulos de análisis cargados

---

## 🐛 Problemas Comunes y Soluciones

### Problema: "No hay datos en window.salesData"

**Causa:** CSV no se procesó correctamente
**Solución:**
```javascript
// En consola:
console.log(window.salesData)  // Ver qué hay
```

---

### Problema: "Campos faltantes"

**Causa:** CSV no tiene columnas: zona, timestamp, pitchType, result
**Solución:** Revisa que tu CSV tenga estas columnas (o variantes como "zone", "fecha", "pitch_type")

---

### Problema: "Todos los registros tienen zona unknown"

**Causa:** El CSV tiene datos corruptos o mal formateados
**Solución:**
```javascript
// Ver registro para debuggear:
console.log(window.salesData[0])
```

---

### Problema: "AnalyticsOrchestrator no cargado"

**Causa:** `initAdvancedModules()` no se ejecutó o falló
**Solución:** Revisa consola para ver errores específicos:
```javascript
// En consola:
debugModules()  // Ver si hay módulos
```

---

## 🎭 Testing sin Archivo CSV

Para probar sin cargar archivo, ejecuta en consola:

```javascript
mockData()
// Carga 2 registros de prueba
// Luego ejecuta:
onDataLoaded()
```

Y verifica:
```javascript
debugDataFlow()
```

---

## 🔄 Flujo Ahora (después de fixes)

```
┌─────────────────────────────────┐
│  Usuario carga CSV              │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│  handleFiles() → Papa.parse()    │
└──────────────┬──────────────────┘
               ▼
┌─────────────────────────────────┐
│  processData()                   │
│  - Llena window.salesData        │
│  - Limpia "unknown"              │
│  ✅ LLAMA onDataLoaded() ◄─────┐
└──────────────┬──────────────────┘│
               ▼                     │
┌─────────────────────────────────┐ │
│  onDataLoaded()                 │ │
│  ✅ AHORA se ejecuta aquí       │ │
│  - Valida estructura            │ │
│  - Resetea orquestador          │ │
│  - Llama initAdvancedModules()  │ │
└──────────────┬──────────────────┘ │
               ▼                     │
┌─────────────────────────────────┐ │
│  initAdvancedModules()          │ │
│  ✅ Crea AnalyticsOrchestrator  │ │
│  ✅ Carga módulos de análisis   │ │
└──────────────┬──────────────────┘ │
               ▼                     │
┌─────────────────────────────────┐ │
│  enableAdvancedFeatures()       │ │
│  ✅ Activa botones de análisis  │ │
└─────────────────────────────────┘ │
                                     │
                     CONEXIÓN ◄──────┘
```

---

## 📝 Variables Globales Clave

| Variable | Contenido | Inicialización |
|----------|-----------|-----------------|
| `window.salesData` | Array de ventas procesadas | En `processData()` |
| `window.filteredData` | Copia de salesData | En `processData()` |
| `window.analyticsOrchestrator` | Instancia AnalyticsOrchestrator | En `initAdvancedModules()` |

---

## 🚀 Próximos Pasos si Aún Hay Problemas

1. **Ejecuta en consola:**
   ```javascript
   debugDataFlow()
   ```

2. **Si falla en paso 1 o 2:** El problema está en `processData()` (CSV no se procesa)

3. **Si falla en paso 3:** Datos tienen estructura incorrecta. Verifica columnas del CSV.

4. **Si falla en paso 4 o 5:** El problema está en `initAdvancedModules()`. Revisa consola para errores específicos.

5. **Abre issue con output de:**
   ```javascript
   debugStatus()
   debugDataFlow()
   ```

---

## 📞 Debugging Avanzado

Si necesitas información aún más detallada:

```javascript
// Ver toda la estructura del orquestador
console.log(window.analyticsOrchestrator)

// Ver si un módulo específico está cargado
console.log(window.analyticsOrchestrator.modules.bayesian)

// Ejecutar análisis manualmente
const result = await window.analyticsOrchestrator.runAnalysis('bayesian')
console.log(result)
```

---

## ✅ Resumen de Changes

| Archivo | Línea | Cambio |
|---------|-------|--------|
| index.html | 2693 | `onDataLoaded()` mejorada con validación y reset |
| index.html | 3388-3405 | `processData()` limpia "unknown" y llama `onDataLoaded()` |
| index.html | 6468 | `initAdvancedModules()` con validación y debug logs |
| index.html | 50 | Script `DEBUG_HELPER.js` agregado |
| DEBUG_HELPER.js | - | Nuevo archivo con herramientas de debug |

**Total de cambios:** 5 archivos/ubicaciones modificadas, 1 archivo nuevo

---

**Versión:** 2026-01-12 v1.0  
**Estado:** ✅ Implementado y listo para testing
