# 🎯 INSTRUCCIONES: Cómo Probar el Plan Debug Implementado

## ⚡ Quick Start (5 minutos)

### Opción 1: Test Rápido en la Aplicación

```
1. Abre: index.html
2. Carga un CSV (cualquiera)
3. Presiona: F12 (DevTools)
4. Ve a: Console
5. Ejecuta: debugDataFlow()
6. Resultado esperado: "5/5 pasos completados" ✅
```

### Opción 2: Test Completo Standalone

```
1. Abre: TEST_DEBUG_FLOW.html
2. Click: "Cargar Datos Mock"
3. Click: "Ejecutar onDataLoaded()"
4. Click: "Debug Flow"
5. Verifica: "5/5 pasos completados" ✅
```

---

## 📊 Qué Ver en los Logs

### Cuando cargas CSV, verás en consola:

```
📋 [processData] Total registros procesados: 50
📊 [processData] Validación completa. Registros limpios: 50
🔗 [processData] Conectando onDataLoaded()...

🔄 [onDataLoaded] Iniciando reinicialización de módulos...
📊 window.salesData: 50 registros
✅ [onDataLoaded] Estructura de datos validada
🧹 [onDataLoaded] Limpiando orquestador anterior...
🚀 [onDataLoaded] Llamando initAdvancedModules()...

🚀 [initAdvancedModules] Iniciando...
✅ [initAdvancedModules] Validación de datos pasada
🔧 [initAdvancedModules] Creando AnalyticsOrchestrator...
📚 [initAdvancedModules] Cargando módulos...
✅ [initAdvancedModules] Módulos cargados exitosamente
```

**Si ves esto:** ✅ TODO FUNCIONA

---

## 🔍 Verificar Estado en Cualquier Momento

En consola, ejecuta:

### Ver estado actual:
```javascript
debugStatus()
```

Muestra:
- Cantidad de registros cargados
- Estructura de primer registro
- Si el orquestador está cargado

### Ver checklist de flujo:
```javascript
debugDataFlow()
```

Muestra:
- ✅ Datos en memory
- ✅ Datos filtrados
- ✅ Estructura válida
- ✅ Orquestador instanciado
- ✅ Módulos cargados

### Ver módulos cargados:
```javascript
debugModules()
```

Muestra:
- Lista de módulos disponibles
- Estado de cada módulo

### Cargar datos de prueba (sin archivo):
```javascript
mockData()
```

Carga 3 registros de ejemplo y puedes ejecutar `onDataLoaded()`

---

## 📁 Archivos Nuevos para Referencia

| Archivo | Propósito | Cuándo Usar |
|---------|-----------|------------|
| **DEBUG_HELPER.js** | Comandos de debugging en consola | En cualquier momento (comandos: `debugStatus()`, etc) |
| **DEBUG_PLAN.md** | Guía completa de debugging | Para entender problemas en profundidad |
| **IMPLEMENTACION_PLAN_DEBUG.md** | Resumen técnico de cambios | Para ver exactamente qué se cambió |
| **TEST_DEBUG_FLOW.html** | Test standalone sin dependencias | Para test sin cargar toda la aplicación |
| **VERIFICACION_RAPIDA_DEBUG.md** | Referencia rápida | Para verificación rápida |

---

## ✅ Checklist de Validación

Después de probar, verifica que:

- [ ] Viste logs de `processData()` y `onDataLoaded()` en consola
- [ ] `debugStatus()` muestra datos en memory
- [ ] `debugDataFlow()` retorna "5/5 pasos completados"
- [ ] No hay errores ❌ en la consola
- [ ] Los módulos de análisis están disponibles (botones activados)

---

## 🐛 Si Algo No Funciona

### Problema: No veo logs de [processData] y [onDataLoaded]

**Causa:** Los logs no aparecen después de cargar CSV

**Solución:**
```javascript
// En consola, verifica si los datos se cargaron:
console.log('Datos:', window.salesData.length)
console.log('Primer registro:', window.salesData[0])

// Si está vacío, el CSV no se procesó correctamente
```

---

### Problema: `debugStatus()` dice "Sin datos"

**Causa:** `window.salesData` está vacío

**Solución:**
```javascript
// Carga datos de prueba:
mockData()
// Luego ejecuta:
onDataLoaded()
// Ahora intenta:
debugStatus()
```

---

### Problema: `debugDataFlow()` retorna menos de 5 pasos

**Causa:** El flujo se interrumpió en algún punto

**Solución:**
1. Lee el output de `debugDataFlow()` cuidadosamente
2. Identifica en qué paso falló (1-5)
3. Consulta [DEBUG_PLAN.md](DEBUG_PLAN.md) sección "Problemas Comunes"

---

### Problema: ERROR en consola

**Solución:**
```javascript
// Copia el error exacto y busca en:
// DEBUG_PLAN.md → Sección "Problemas Comunes y Soluciones"

// O ejecuta:
debugStatus()
// Para ver información detallada
```

---

## 📞 Debugging Avanzado

### Ver estructura completa de un registro:
```javascript
console.log(JSON.stringify(window.salesData[0], null, 2))
```

### Ver el orquestador completo:
```javascript
console.log(window.analyticsOrchestrator)
```

### Listar todos los módulos cargados:
```javascript
console.log(Object.keys(window.analyticsOrchestrator.modules))
```

### Ejecutar un análisis manualmente:
```javascript
const result = await window.analyticsOrchestrator.runAnalysis('bayesian')
console.log(result)
```

---

## 🚀 Lo Que Debería Funcionar Ahora

✅ Cargar CSV → Se procesan datos automáticamente  
✅ UI actualizada → Muestra "N registros cargados"  
✅ Módulos inicializan → Automáticamente después de cargar  
✅ AnalyticsOrchestrator → Se crea y está listo  
✅ Análisis disponibles → Botones activos, funcionales  
✅ Debugging → Comandos en consola para verificar flujo

---

## 📝 Notas Importantes

1. **DEBUG_HELPER.js se carga automáticamente** en index.html
   - Los comandos `debugStatus()`, etc. están SIEMPRE disponibles
   - En cualquier momento, puedes ejecutarlos en consola

2. **Los logs son NORMALES**
   - Si ves logs con 🔄, 📊, ✅ = Funcionando bien
   - Si ves logs con ❌ = Error específico que debe investigarse

3. **El Service Worker puede cachear versión vieja**
   - Si no ves cambios: Ctrl+Shift+R (hard refresh)
   - O limpia cache en DevTools → Application → Clear Storage

4. **MockData es para testing sin archivo**
   - Carga 3 registros de ejemplo
   - Útil para debugging sin CSV

---

## 🎯 Resumen de Cambios Implementados

| Qué | Dónde | Por Qué |
|-----|-------|--------|
| Mejorada `onDataLoaded()` | index.html L2693 | Validar datos y resetear orquestador |
| Conectada a `processData()` | index.html L3440 | **CLAVE:** Ejecutar después de cargar CSV |
| Limpieza de "unknown" | index.html L3388 | Eliminar datos corruptos antes de análisis |
| Mejorada `initAdvancedModules()` | index.html L6468 | Validar y debuggear inicialización |
| Agregado DEBUG_HELPER.js | index.html L52 | Proporcionar herramientas de debugging |
| Documentación completa | 4 archivos `.md` | Guiar al usuario en debugging |
| Test standalone | TEST_DEBUG_FLOW.html | Testing sin dependencias |

---

## 💡 Mejor Práctica

**Siempre que cargues CSV, ejecuta en consola:**
```javascript
debugDataFlow()
```

Esto te dirá instantáneamente si el flujo está funcionando correctamente.

---

**¿Necesitas más ayuda?**
- Lee [DEBUG_PLAN.md](DEBUG_PLAN.md) para guía detallada
- Abre [TEST_DEBUG_FLOW.html](TEST_DEBUG_FLOW.html) para test visual
- Ejecuta `debugStatus()` en consola para estado actual

---

**Versión:** 2026-01-12  
**Status:** ✅ Listo para usar
