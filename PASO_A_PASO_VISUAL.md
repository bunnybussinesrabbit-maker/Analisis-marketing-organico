# 📱 GUÍA VISUAL PASO A PASO

## 🎯 Objetivo
Que la sección "Análisis Completo → Demográfico × Pitch × Zona" y "Origen × Pitch × Resultado" funcione correctamente.

---

## 🚀 PASO 1: Verificar Archivos

### 📂 Estructura esperada:
```
c:\Users\Dona\Mi unidad\5-Apps\Analisis marketing organico\
├── index.html ⭐
├── utils/
│   ├── fieldMapper.js ⭐ [NUEVO]
│   ├── goe_utils.js
│   ├── math_utils.js
│   └── stat_utils.js
├── analytics_module/
│   ├── cross_analysis.js ⭐ [MEJORADO]
│   ├── bayesian_analytics.js
│   ├── timeseries_forecast.js
│   └── ... (otros módulos)
├── TEST_INTEGRATION.js ⭐ [NUEVO]
├── TESTING_GUIDE.md ⭐ [NUEVO]
├── RESUMEN_IMPLEMENTACION.md ⭐ [NUEVO]
└── INICIO_RAPIDO_NUEVO.md ⭐ [ESTE ARCHIVO]
```

**Verificación**: Abre File Explorer y confirma que `utils/fieldMapper.js` existe ✅

---

## 🌐 PASO 2: Iniciar Servidor Local

### Windows (PowerShell):
```powershell
# Navega a la carpeta del proyecto
cd "c:\Users\Dona\Mi unidad\5-Apps\Analisis marketing organico"

# Inicia servidor local
python -m http.server 8000
```

### Alternativa con Node.js:
```bash
npx http-server
```

**Resultado esperado**:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

---

## 🌍 PASO 3: Abrir la Aplicación

1. **Abre tu navegador** (Chrome, Firefox, Edge)
2. **Ve a**: `http://localhost:8000`
3. **Deberías ver**: Pantalla de inicio de Geo-Suite Cancún PRO

✅ **Si funciona**: Continúa a PASO 4  
❌ **Si ves error**: Verifica que el servidor esté corriendo

---

## 📥 PASO 4: Cargar Datos CSV

### Opción A: Con Datos de Prueba
1. **Crea archivo** `test_data.csv` en la raíz del proyecto con este contenido:

```csv
zona,hora,estado,pitch_type,monto,origen,edad,ocupacion,ingreso
centro,14:30,successful,nostalgia,250,CDMX,35,professional,high
centro,10:00,failed,authority,0,LOCAL,42,entrepreneur,upper_middle
zona_hotelera,16:45,successful,scarcity,500,CDMX,28,tourist,middle
zona_hotelera,09:00,successful,authority,300,CANCUN,45,business_owner,high
region_237,18:00,failed,community,0,LOCAL,32,artisan,lower_middle
```

2. **En la app**, haz clic en **"Datos"** → **"Subir CSV"**
3. **Selecciona** `test_data.csv`
4. Verás mensaje: ✅ "X registros cargados"

### Opción B: Con tus Propios Datos
- Asegúrate que tenga columnas: `zona, estado, pitch_type, monto, origen`
- Opcional: `edad, ocupacion, ingreso` (para análisis demográfico)

---

## 🔍 PASO 5: Aplicar Filtros (Opcional)

1. En la sección **"Datos"**, debajo de "Subir CSV"
2. **Selecciona** fechas, zona, hora (si quieres)
3. Haz clic en **"Aplicar Filtros"**
4. Verás: ✅ "X registros después de filtrar"

💡 **Nota**: Este paso es opcional. Puedes ir directamente al análisis.

---

## 🎯 PASO 6: Abrir "Análisis Completo"

### En el navegador:

1. **En el menú izquierdo**, busca **"Análisis Completo"**
2. **Haz clic** en él
3. **Espera 1-2 segundos** mientras se carga

**Deberías ver**:
- Título: "Análisis Completo - Resultados Detallados"
- Dos pestañas: "Demográfico" y "Origen"
- Controles: Tabla/Heatmap, Refresh, Export, Print

---

## 📊 PASO 7: Verifica Que Funciona

### Si hay datos demográficos (edad, ocupación, ingreso):

1. **Pestaña "Demográfico"**:
   - Debería mostrar una matriz de edad × ocupación × pitch × zona
   - Con colores indicando tasa de conversión (rojo = bajo, verde = alto)
   - Botones para cambiar entre Tabla/Heatmap

2. **Pestaña "Origen"**:
   - Matriz de origen × pitch × resultado
   - Debería ver: CDMX, LOCAL, CANCUN, etc.

### Si NO hay datos demográficos:

1. **Pestaña "Demográfico"**:
   - Mensaje: ⚠️ "Datos demográficos no disponibles"
   - Es normal, significa que el CSV no tiene edad/ocupación/ingreso

2. **Pestaña "Origen"**:
   - Sigue funcionando normalmente ✅

---

## 🧪 PASO 8: Verifica en DevTools (Importante)

1. **Abre DevTools** con **F12** (o Ctrl+Shift+I)
2. **Ve a la pestaña "Console"**
3. **Deberías ver** mensajes como:
   ```
   ✅ FieldMapper cargado
   ✅ CrossDimensionalAnalyzer inicializado: X registros
   ✅ Análisis sincronizado: X registros
   🔄 Sincronizando datos de análisis...
   ✅ Análisis inicializado correctamente
   ```

4. **NO deberías ver** mensajes rojos (errores)

✅ **Si todo es verde**: ¡Perfecto! Continúa.  
❌ **Si ves rojo**: Anota el error y verifica en la sección "Troubleshooting"

---

## 🚦 PASO 9: Ejecutar Tests Automáticos

En la **consola del DevTools** (desde el Paso 8):

1. **Copia este código**:
```javascript
fetch('./TEST_INTEGRATION.js')
  .then(r => r.text())
  .then(code => eval(code))
  .then(() => runIntegrationTests())
  .catch(err => console.error('Error:', err));
```

2. **Pégalo en la consola y presiona Enter**

3. **Espera a que terminen las pruebas** (5-10 segundos)

4. **Deberías ver** un resumen como:
```
╔════════════════════════════════════════════════════════╗
║  🚀 SUITE DE PRUEBAS - ANÁLISIS CRUZADO INTEGRADO    ║
╚════════════════════════════════════════════════════════╝

✅ FieldMapper
✅ CrossDimensionalAnalyzer
✅ syncAnalysisData
✅ Flujo Completo
✅ Simulación CSV

📈 RESULTADO: 5/5 pruebas pasadas (100%)
🎉 ¡TODAS LAS PRUEBAS PASARON! El sistema está listo.
```

✅ **5/5 pruebas**: ¡Excelente! Sistema funciona perfectamente.  
❌ **Menos de 5/5**: Revisa los errores en rojo.

---

## 🔧 PASO 10: Prueba Interactiva

1. **Desde DevTools console**, simula cambios de filtro:

```javascript
// Simular cambio de filtros
filteredData = filteredData.filter(d => d.zona === 'centro');
syncAnalysisData(filteredData);
console.log('Analyzer actualizado:', currentAnalyzer.records.length);
```

2. **Deberías ver** que `currentAnalyzer` se actualiza automáticamente

3. **Regresa a la sección "Análisis Completo"**:
   - Los análisis deberían mostrar solo datos de "centro"

---

## ✅ Checklist Final

- [ ] Archivos en su lugar (fieldMapper.js existe)
- [ ] Servidor local corriendo (http://localhost:8000)
- [ ] App carga sin errores
- [ ] CSV cargado exitosamente
- [ ] "Análisis Completo" se abre
- [ ] Pestaña "Demográfico" o "Origen" visible
- [ ] DevTools Console muestra mensajes verdes ✅
- [ ] `runIntegrationTests()` pasa 5/5 pruebas
- [ ] Cambios de filtro se reflejan automáticamente

---

## 🐛 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "Página no carga" | Verifica que el servidor esté corriendo |
| "Error 404 fieldMapper.js" | Asegúrate que está en `utils/fieldMapper.js` |
| "Análisis Completo no aparece" | Primero carga un CSV, luego abre el análisis |
| "Consola muestra errores rojos" | Anota el error exacto (p.ej.: "CrossDimensionalAnalyzer is not defined") |
| "Ruebas fallan" | Recarga la página (Ctrl+F5) para limpiar cache |
| "Campos del CSV no se mapean" | Verifica que los nombres sean similares (zona, pitch_type, estado, etc.) |

---

## 📞 Si Algo Aún No Funciona

1. **Abre DevTools** (F12)
2. **Ve a Console**
3. **Copia TODOS los mensajes rojos**
4. **Revisa**: `TESTING_GUIDE.md` → "Si Algo Falla"
5. **O ejecuta**:
```javascript
analysisValidationReport
// Te mostrará exactamente qué está mal
```

---

## 🎉 ¡Éxito!

Si llegaste hasta aquí y todo funciona:

✅ **La implementación está completa y funcional**  
✅ **El análisis cruzado está integrado**  
✅ **Los datos se sincronizan automáticamente**  
✅ **El sistema está listo para usar**

**Ahora puedes**:
- Cargar CSVs con tus datos reales
- Analizar efectividad de pitch por demografía
- Exportar reportes
- Integrar con el resto del sistema

---

## 📖 Documentación Completa

- `TESTING_GUIDE.md` - Guía completa de pruebas
- `RESUMEN_IMPLEMENTACION.md` - Detalles técnicos
- `TEST_INTEGRATION.js` - Suite de tests automatizados

---

**¿Problemas?** Verifica que hayas seguido cada paso en orden. 🚀

