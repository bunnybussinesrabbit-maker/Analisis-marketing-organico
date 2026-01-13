# 🚀 INSTRUCCIONES: Cómo Probar Análisis Cruzado

## ⏰ Tiempo estimado: 5 minutos

---

## **PASO 1: Abre la Aplicación (1 min)**

```
1. Navega a: file:///c:/Users/Dona/Mi%20unidad/5-Apps/Analisis%20marketing%20organico/index.html
   
   O simplemente abre la carpeta en VS Code y haz clic en index.html
```

✅ **Verificar:** Deberías ver el dashboard principal con gráficos

---

## **PASO 2: Carga un CSV (1.5 min)**

```
1. Ve a la sección "Datos y CSV" (botón en el menú lateral)

2. En la zona donde dice "Arrastra tu archivo CSV aquí":
   - Haz clic para seleccionar un archivo
   - O arrastra y suelta: data/PLANTILLA_CSV_ESTANDAR.csv

3. Espera a que veas el mensaje: "✅ N registros cargados"
```

✅ **Verificar:**
- Debería cargar 5 registros
- Verás tabla con datos
- Status dirá "5 registros"

---

## **PASO 3: Abre la Consola del Navegador (30 seg)**

```
Windows/Linux: Presiona F12 o Ctrl+Shift+J

Mac: Presiona Cmd+Option+J

Debería abrirse un panel negro en la parte inferior del navegador
```

✅ **Verificar:** Ves el prompt `>`

---

## **PASO 4: Ejecuta tu Primer Análisis (1 min)**

En la consola, copia y pega este comando:

```javascript
window.showAllAnalysis()
```

Presiona **Enter**

✅ **Deberías ver:**
```
📊 ANÁLISIS COMPLETO DE VENTAS
════════════════════════════════════════════════════════════════════

🎯 RESUMEN GENERAL
  Total de ventas: 5
  Conversiones: 4 (80%)
  Ingresos totales: $2000.00
  Ticket promedio: $400.00

🎤 ANÁLISIS POR PITCH
  autoridad: 1 usos | 1 éxitos (100%) | $450
  nostalgia: 1 usos | 0 éxitos (0%) | $0
  escasez: 1 usos | 1 éxitos (100%) | $800
  comunidad: 1 usos | 1 éxitos (100%) | $150

🌍 ANÁLISIS POR ORIGEN
  CDMX: 1 clientes | 1 éxitos (100%) | $450
  Cancun_Local: 1 clientes | 0 éxitos (0%) | $0
  Quintana_Roo: 1 clientes | 1 éxitos (100%) | $800
  Local: 1 clientes | 1 éxitos (100%) | $150
  Internacional: 1 clientes | 1 éxitos (100%) | $600

════════════════════════════════════════════════════════════════════
✅ Análisis completado
```

---

## **PASO 5: Prueba COUNTIF (1 min)**

En la consola, ejecuta:

```javascript
window.COUNTIF(window.salesData, 'pitchType', 'autoridad')
```

✅ **Resultado esperado:** `1` (aparece una sola vez "autoridad")

**Prueba otras:**

```javascript
// ¿Cuántas conversiones exitosas?
window.COUNTIF(window.salesData, 'result', 'successful')
// → 4

// ¿Cuántos clientes de CDMX?
window.COUNTIF(window.salesData, 'clientOrigin', 'CDMX')
// → 1
```

---

## **PASO 6: Prueba SUMIF (1 min)**

En la consola:

```javascript
window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto')
```

✅ **Resultado esperado:**
```javascript
{
  sum: 450,      // Total dinero con autoridad
  count: 1,      // Cuántas veces se usó
  average: 450   // Promedio
}
```

**Prueba otras:**

```javascript
// ¿Dinero total de CDMX?
window.SUMIF(window.salesData, 'clientOrigin', 'CDMX', 'monto')
// → { sum: 450, count: 1, average: 450 }

// ¿Dinero de conversiones exitosas?
window.SUMIF(window.salesData, 'result', 'successful', 'monto')
// → { sum: 2000, count: 4, average: 500 }
```

---

## **PASO 7: Análisis Cruzados (1 min)**

Ver qué pitch funciona en cada zona:

```javascript
window.analyzePitchByZone()
```

✅ **Resultado:** Matriz mostrando efectividad de cada pitch en cada zona

Ver qué pitch funciona para cada origen:

```javascript
window.analyzePitchByOrigin()
```

✅ **Resultado:** Matriz mostrando efectividad de cada pitch por origen de cliente

---

## **PASO 8: Interpretación de Resultados**

### Si ves "unknown"

**Significa:** Tu CSV tiene valores que el sistema no reconoce

**Solución:**
```javascript
// Ver todos los valores:
console.table(window.salesData)

// Buscar el culpable:
window.salesData.filter(r => r.pitchType === 'unknown')
```

**Arreglo:** Edita tu CSV para que use valores válidos:
- Pitch types: `autoridad`, `nostalgia`, `escasez`, `comunidad`
- Origins: `CDMX`, `Cancun_Local`, `Quintana_Roo`, `Yucatan`, `Internacional`, `Migrante`

### Si ves "0" o vacío

**Significa:** No hay datos que cumplan ese criterio

**Ejemplo:**
```javascript
// Si esto retorna 0:
window.COUNTIF(window.salesData, 'pitchType', 'inexistente')
// → 0 (correcto, no existe ese pitch)
```

---

## **PASO 9: Copia el Comando en tu Portapapeles**

Aquí hay una lista de comandos que puedes copiar y pegar:

```javascript
// 1. Ver TODO
window.showAllAnalysis()

// 2. Contar valores
window.COUNTIF(window.salesData, 'pitchType', 'autoridad')
window.COUNTIF(window.salesData, 'result', 'successful')
window.COUNTIF(window.salesData, 'clientOrigin', 'CDMX')

// 3. Sumar valores
window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto')
window.SUMIF(window.salesData, 'result', 'successful', 'monto')
window.SUMIF(window.salesData, 'clientOrigin', 'CDMX', 'monto')

// 4. Análisis automáticos
window.analyzePitchEffectiveness()
window.analyzeOriginEffectiveness()
window.analyzePitchByZone()
window.analyzePitchByOrigin()

// 5. Ver datos crudos
console.table(window.salesData)
console.log(window.salesData[0])
```

---

## **PASO 10: Usa tu Propio CSV** 

1. Abre tu archivo CSV en Excel o editor de texto
2. Asegúrate que tenga columnas para:
   - **zona** (obligatorio)
   - **pitch_type** o **pitchType** (obligatorio)
   - **result** o **resultado** (obligatorio)
   - **monto**, **amount** o **precio** (obligatorio)
   - **client_origin**, **origin** u **origen** (obligatorio)
   - fecha (opcional)
   - cliente (opcional)

3. Guarda como CSV
4. Carga en la aplicación
5. Abre consola y ejecuta: `window.showAllAnalysis()`

---

## **TROUBLESHOOTING**

### ❌ "window.COUNTIF no está definido"

**Solución:**
- Recarga la página (Ctrl+R o Cmd+R)
- Asegúrate que está cargado index.html
- Abre consola y prueba de nuevo

### ❌ "Sin datos para analizar"

**Solución:**
- Ve a "Datos y CSV"
- Carga un archivo CSV
- Espera el mensaje "registros cargados"
- Vuelve a intentar

### ❌ Valores son "unknown"

**Solución:**
1. Abre consola y ejecuta: `console.table(window.salesData)`
2. Mira qué valores tiene pitchType y clientOrigin
3. Compara con los valores válidos en GUIA_ANALISIS_CRUZADO.md
4. Edita tu CSV o crea un nuevo filtro

### ❌ Números aparecen como $0

**Solución:**
- Verifica que tu CSV tenga una columna de montos
- Que los valores sean números (no textos como "mil")
- Que no tenga símbolos especiales ($, comas en miles)

---

## **✅ CHECKLIST DE ÉXITO**

- [ ] Abierto index.html en navegador
- [ ] Cargado un CSV sin errores
- [ ] Consola abierta (F12)
- [ ] `window.showAllAnalysis()` funciona
- [ ] `window.COUNTIF()` retorna números
- [ ] `window.SUMIF()` retorna objetos con sum/count/average
- [ ] `window.analyzePitchEffectiveness()` muestra datos
- [ ] `window.analyzePitchByZone()` muestra matriz
- [ ] Puedo identificar el mejor pitch
- [ ] Puedo ver qué origen es más rentable

---

## **📊 Preguntas que Ahora Puedes Responder**

1. ✅ ¿Cuántas veces usé cada pitch?
2. ✅ ¿Cuánto dinero generó cada pitch?
3. ✅ ¿Cuál es mi tasa de conversión?
4. ✅ ¿De dónde vienen mis mejores clientes?
5. ✅ ¿Qué pitch funciona mejor en cada zona?
6. ✅ ¿Hay cannibalization entre pitches?
7. ✅ ¿Cuál es mi ticket promedio por origen?
8. ✅ ¿Qué combinación de zona + pitch es más rentable?

---

## **🎓 Próximo Paso**

Lee `GUIA_ANALISIS_CRUZADO.md` para:
- Referencia completa de funciones
- Ejemplos avanzados
- Casos de uso reales
- Cómo exportar datos

---

**¡Listo! Ya puedes hacer análisis avanzados como en Excel** 🎉
