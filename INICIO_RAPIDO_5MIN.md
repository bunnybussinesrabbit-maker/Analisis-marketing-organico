# 🎯 GUÍA RÁPIDA - Cómo Empezar (5 Minutos)

## ⚡ Paso 1: Abre la Aplicación (30 segundos)

1. Haz doble clic en **`index.html`**
2. Se abrirá en tu navegador
3. Verás el dashboard principal con varias secciones

---

## 📂 Paso 2: Prepara tu Archivo CSV (1 minuto)

Tu CSV debe tener estas columnas (en el mismo orden o desordenadas):

```
timestamp | zona | cliente | origen | tipo_pitch | resultado | monto | latitud | longitud
```

**Ejemplo de fila válida:**
```
2026-01-10T09:00:00Z,zona_hotelera,Juan García,CDMX,autoridad,exitoso,450,21.135,-86.745
```

### Variaciones Aceptadas:

- **Timestamp**: `timestamp`, `date`, `fecha`, `time`, `hora`
- **Zona**: `zone`, `zona`, `region`, `area`
- **Cliente**: `client`, `cliente`, `customer`, `client_name`, `nombre`
- **Origen**: `origin`, `origen`, `clientorigin`, `client_origin`, `procedencia`
- **Pitch**: `pitch_type`, `pitchtype`, `pitch`, `type`, `estrategia`
- **Resultado**: `result`, `resultado`, `status`, `estado`
- **Monto**: `amount`, `monto`, `valor`, `venta`, `price`, `precio`

**Si tu CSV ya tiene estos nombres, ¡listo! Procede al paso 3.**

---

## 📤 Paso 3: Carga el CSV (1 minuto)

1. En el navegador, ve a **"Datos y CSV"** (menú izquierdo)
2. En la sección **"Cargar Archivo CSV"**, haz clic en la zona gris
3. Selecciona tu archivo (o arrastra y suelta)
4. Espera a que diga "X registros cargados correctamente" ✅

---

## 🔍 Paso 4: Verifica que los Datos Se Cargaron (1 minuto)

Abre la **consola del navegador**:
- **Windows/Linux**: Presiona `F12`
- **Mac**: Presiona `Cmd + Option + J`

En la consola, escribe:
```javascript
window.debugCSVData()
```

Deberías ver:
```
🔍 ===== DIAGNÓSTICO DE DATOS CSV =====
1️⃣ window.salesData: 20 registros
4️⃣ Zonas encontradas: (6) ['zona_hotelera', 'centro', 'region_237', ...]
5️⃣ Pitch types encontrados: (4) ['autoridad', 'nostalgia', 'escasez', 'comunidad']
✅ Todos los registros normalizados correctamente
```

Si ves ✅ "Todos los registros normalizados", ¡perfecto!

---

## 📊 Paso 5: Analiza tus Datos (2 minutos)

En la consola, ejecuta:

### **Ver cuántas veces se usó cada pitch:**
```javascript
window.analyzeByPitch()
```

Verás algo como:
```
🎯 ANÁLISIS DE PITCHES
🎤 AUTORIDAD
   Veces usado: 7
   Ingresos: $4250.00
   Ticket promedio: $607.14
```

### **Ver cuántos clientes por origen:**
```javascript
window.analyzeByOrigin()
```

Verás algo como:
```
🌍 ANÁLISIS DE ORÍGENES
🏙️ CDMX
   Clientes: 5
   Ingresos: $2950.00
   Ticket promedio: $590.00
```

### **Contar cuántas veces aparece un valor:**
```javascript
window.COUNTIF(window.salesData, 'pitchType', 'autoridad')
// Resultado: 7
```

### **Sumar ingresos por criterio:**
```javascript
const resultado = window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto')
console.log(resultado)
// { sum: 4250, count: 7, average: 607.14 }
```

---

## 🎓 Ejemplos Prácticos

### **Pregunta: ¿Cuál es el pitch más efectivo?**

```javascript
// 1. Ver cuántas veces se usó cada pitch
window.analyzeByPitch()

// 2. Contar ventas exitosas por pitch
const autoridad_total = window.COUNTIF(window.salesData, 'pitchType', 'autoridad');
const autoridad_exitosas = window.salesData.filter(r => 
  r.pitchType === 'autoridad' && r.result === 'successful'
).length;

const tasa = (autoridad_exitosas / autoridad_total * 100).toFixed(1);
console.log(`Autoridad: ${tasa}% de conversión`);
```

### **Pregunta: ¿Cuánto gastó CDMX vs Locales?**

```javascript
const cdmx = window.SUMIF(window.salesData, 'clientOrigin', 'CDMX', 'monto');
const local = window.SUMIF(window.salesData, 'clientOrigin', 'Cancun_Local', 'monto');

console.log(`CDMX: $${cdmx.sum} (${cdmx.count} clientes, promedio $${cdmx.average.toFixed(2)})`);
console.log(`Locales: $${local.sum} (${local.count} clientes, promedio $${local.average.toFixed(2)})`);
```

### **Pregunta: ¿Cuál zona es más rentable?**

```javascript
const zonas = [...new Set(window.salesData.map(r => r.zona))];
const resultados = {};

zonas.forEach(zona => {
  const data = window.SUMIF(window.salesData, 'zona', zona, 'monto');
  resultados[zona] = data;
});

console.table(resultados);
```

---

## 🐛 Si Algo Sale Mal

### **"Los datos no se cargan"**
```javascript
window.debugCSVData()
// Mira el output para ver qué está pasando
```

### **"Salen valores desconocidos o raros"**

Primer, verifica qué valores tiene el CSV:
```javascript
// Ver todos los pitchTypes únicos
[...new Set(window.salesData.map(r => r.pitchType))]

// Ver todos los orígenes únicos  
[...new Set(window.salesData.map(r => r.clientOrigin))]

// Ver todas las zonas únicas
[...new Set(window.salesData.map(r => r.zona))]
```

Si ves valores que no están normalizados, avísame en el chat con el output.

### **"Los gráficos no se actualizan"**

Ejecuta:
```javascript
window.updateCharts()
window.updateTable()
```

---

## 📋 Resumen de Funciones

| Función | Uso | Ejemplo |
|---------|-----|---------|
| `debugCSVData()` | Ver diagnóstico | `window.debugCSVData()` |
| `COUNTIF()` | Contar ocurrencias | `window.COUNTIF(window.salesData, 'pitchType', 'autoridad')` |
| `SUMIF()` | Sumar valores | `window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto')` |
| `analyzeByPitch()` | Análisis de pitches | `window.analyzeByPitch()` |
| `analyzeByOrigin()` | Análisis de orígenes | `window.analyzeByOrigin()` |
| `testLoadSampleData()` | Cargar datos de prueba | `window.testLoadSampleData()` |

---

## ✅ Checklist

- [ ] Abrí `index.html` en el navegador
- [ ] Tengo mi CSV listo con los datos
- [ ] Cargué el CSV en la app
- [ ] Ejecuté `window.debugCSVData()` y vi ✅ confirmación
- [ ] Ejecuté `window.analyzeByPitch()` y vi resultados
- [ ] Puedo contar ocurrencias con `COUNTIF()`
- [ ] Puedo sumar ingresos con `SUMIF()`

¡Si completaste todo, ¡listo! 🎉

---

## 💬 Preguntas?

Si algo no funciona:
1. Ejecuta `window.debugCSVData()`
2. Copia el output de la consola
3. Comparte conmigo en el chat
4. Te ayudaré a resolver rápidamente ✨
