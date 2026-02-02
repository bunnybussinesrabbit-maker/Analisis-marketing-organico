# 🚀 GUÍA RÁPIDA: Cómo Verificar que Todo Funciona

**Después de las correcciones de integración - 31 de Enero, 2026**

---

## ⚡ 5 PASOS RÁPIDOS (5 MINUTOS)

### PASO 1: Abre el navegador
```
http://localhost:8080
```

### PASO 2: Abre DevTools (F12)
```
Presiona: F12 o Ctrl+Shift+I
```

### PASO 3: Ve a la pestaña Console
```
Haz clic en "Console" en DevTools
```

### PASO 4: Valida los módulos
Copia y pega esto en la consola:

```javascript
window.validateModulesAccess()
```

**Resultado esperado**: Tabla verde con `true` en todas las filas.

### PASO 5: Carga un CSV y prueba
1. Haz clic en "📤 Cargar CSV"
2. Selecciona un archivo CSV con datos de pitches
3. Haz clic en "Ejecutar Simulación Monte Carlo"
4. Debes ver resultados renderizados con 3 tarjetas (Revenue, Confianza, Riesgo)

---

## 📊 PRUEBA MANUAL - PASO A PASO

### 1. Verificar Carga de Módulos
```javascript
// En DevTools Console, pega:
console.table(Object.keys(window.analyticsOrchestrator.modules))
```

**Esperas ver**:
```
┌──────────────────────────┐
│ TimeSeriesForecast       │
│ MonteCarloLogistics      │ ← IMPORTANTE
│ BayesianSalesAnalytics   │
│ GeneticRouteOptimization │ ← Debe estar aquí
│ ... (resto de módulos)   │
└──────────────────────────┘
```

### 2. Verificar Datos Cargados
Después de cargar un CSV:

```javascript
// En DevTools Console, pega:
console.log(window.filteredData.length, 'registros cargados');
console.table(window.filteredData.slice(0, 3))  // Ver primeros 3
```

### 3. Ejecutar Análisis Manualmente
```javascript
// En DevTools Console, pega:
const results = await window.analyticsOrchestrator.runCompleteAnalysis({
  runMonteCarlo: true
});
console.log(results);
```

**Esperas ver**:
```
{
  timestamp: "2026-01-31T...",
  recordCount: 150,
  results: {
    monteCarlo: {
      expectedRevenue: 2450.75,
      confidenceInterval: [2100, 2800],
      riskScore: 0.28
    }
  }
}
```

---

## ❌ TROUBLESHOOTING

### ERROR 1: `window.analyticsOrchestrator is undefined`
**Causa**: Los módulos ES6 no se cargaron.  
**Solución**:
```javascript
// Abre DevTools y verifica:
window.analyticsOrchestrator  // Debe estar definido

// Si no está, recarga la página:
location.reload()
```

### ERROR 2: `modules is not a property`
**Causa**: El Orquestador no tiene la propiedad `.modules`.  
**Solución**: Verifica que `modules_integration.js` se importó correctamente.

### ERROR 3: `MonteCarloLogistics is not a function`
**Causa**: El módulo no está registrado.  
**Solución**:
```javascript
console.log(Object.keys(window.analyticsOrchestrator.modules))
// Busca "MonteCarloLogistics" en la lista
```

### ERROR 4: `filteredData is empty`
**Causa**: No has cargado un CSV.  
**Solución**:
1. Haz clic en "📤 Cargar CSV"
2. Selecciona un archivo CSV válido
3. Espera a que se procese

---

## 🧪 PRUEBA ESPECÍFICA: Monte Carlo

### Paso 1: Ir a la sección "Simulación Monte Carlo"
En el HTML, busca el botón con id `runMonteCarloBtn`.

### Paso 2: Clic en el botón
Se abrirá un modal con un spinner.

### Paso 3: Esperar 2-5 segundos
El análisis se ejecuta en background.

### Paso 4: Ver resultados
Debes ver:
- 📊 **Ingreso Esperado**: $XXXX.XX MXN
- 🎯 **Rango de Confianza**: $XXXX - $YYYY
- ⚠️ **Puntaje de Riesgo**: X.X% (verde si <30%, naranja si >30%)

---

## 📝 ESTRUCTURA ESPERADA DE CSV

Para que todo funcione, tu CSV debe tener estas columnas:

| zona | timestamp | result | monto | clientOrigin | pitchType | hora |
|------|-----------|--------|-------|--------------|-----------|------|
| centro | 2026-01-30T14:30:00 | successful | 250 | CDMX | authority | 14 |
| zona_hotelera | 2026-01-30T15:45:00 | failed | 0 | Local | scarcity | 15 |
| region_237 | 2026-01-30T09:15:00 | successful | 350 | Cancun | community | 9 |

**Campos obligatorios**:
- `zona` - Nombre de la zona
- `timestamp` - Fecha y hora (ISO 8601)
- `result` - "successful", "failed", o "pending"
- `monto` - Cantidad (número)
- `hora` - Hora del día (0-23)

---

## 🔍 VALIDACIÓN COMPLETA (15 SEGUNDOS)

Ejecuta esto en DevTools Console y verifica que TODO sea `true`:

```javascript
const check = {
  'Orquestador': !!window.analyticsOrchestrator,
  'Módulos disponibles': Object.keys(window.analyticsOrchestrator?.modules || {}).length === 9,
  'window.Analytics': !!window.Analytics,
  'Monte Carlo es función': typeof window.analyticsOrchestrator?.modules?.MonteCarloLogistics === 'function',
  'Validación disponible': typeof window.validateModulesAccess === 'function',
  'Datos cargados': window.filteredData?.length > 0
};

console.table(check);

// Resumen
const allGood = Object.values(check).every(v => v);
console.log(allGood ? '✅ TODO CORRECTO' : '❌ HAY PROBLEMAS');
```

---

## 📞 SI AÚN HAY PROBLEMAS

### Opción 1: Recarga Forzada
```
Ctrl+Shift+R  (Windows/Linux)
Cmd+Shift+R   (Mac)
```

### Opción 2: Limpia el Cache
En DevTools:
```
Settings → Storage → Clear site data → Clear
```

### Opción 3: Verifica la Consola
Abre DevTools Console y busca errores rojos (❌).  
Screenshot y comparte el error exacto.

---

## 🎯 CHECKLIST FINAL

- [ ] Servidor corriendo en `http://localhost:8080`
- [ ] DevTools abierto (F12)
- [ ] `window.validateModulesAccess()` devuelve todo `true`
- [ ] CSV cargado y procesado
- [ ] `window.filteredData.length > 0`
- [ ] Botón Monte Carlo renderiza resultados
- [ ] No hay errores rojos en Console
- [ ] Botones adicionales (Riesgo, Estacional, etc.) funcionan

---

## 📖 DOCUMENTACIÓN COMPLETA

Para detalles técnicos completos, ver:
- **INTEGRACION_CORRECCION_REPORTETECNICO.md** - Reporte técnico
- **modules_integration.js** - Código del Orquestador
- **analytics_module/** - Módulos individuales

---

**Estado del Sistema**: 🟢 Operativo  
**Última Actualización**: 31 de Enero, 2026  
**Versión**: 2.1.0
