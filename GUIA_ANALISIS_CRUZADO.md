# 📊 Guía: Análisis Cruzado de Ventas - COUNTIF/SUMIF

## 🎯 Introducción

Se han agregado **10 nuevas funciones** a `index.html` para hacer análisis avanzados de datos de ventas, como en Excel. Ahora puedes:

- **Contar** cuántas veces aparece un valor (COUNTIF)
- **Sumar** valores según criterios (SUMIF)  
- **Contar con múltiples criterios** (COUNTIFS)
- **Sumar con múltiples criterios** (SUMIFS)
- **Analizar efectividad de pitches**
- **Analizar por cliente origin**
- **Análisis cruzados** (Pitch × Zona, Pitch × Origin, etc.)

---

## 🚀 Cómo Usar

### Paso 1: Cargar datos CSV

1. Abre la aplicación en el navegador
2. Ve a la sección **"Datos y CSV"**
3. Carga tu archivo CSV (o arrastra y suelta)
4. Los datos se normalizan automáticamente

### Paso 2: Abrir Consola del Navegador

- **Windows/Linux**: `F12` o `Ctrl+Shift+J`
- **Mac**: `Cmd+Option+J`

### Paso 3: Ejecutar análisis

En la consola, escribe cualquiera de estos comandos:

```javascript
// Ver TODOS los análisis de una vez
window.showAllAnalysis()

// COUNTIF: Contar ocurrencias
window.COUNTIF(window.salesData, 'pitchType', 'autoridad')
// Resultado: 5 (aparece 5 veces)

// SUMIF: Sumar con criterio
window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto')
// Resultado: { sum: 2450, count: 5, average: 490 }

// Análisis automático por pitch
window.analyzePitchEffectiveness()

// Análisis automático por origen
window.analyzeOriginEffectiveness()

// Análisis cruzado: Pitch × Zona
window.analyzePitchByZone()

// Análisis cruzado: Pitch × Client Origin
window.analyzePitchByOrigin()
```

---

## 📚 Referencia de Funciones

### 1️⃣ **COUNTIF** - Contar valores

```javascript
window.COUNTIF(dataArray, columnName, criteria, options)
```

**Parámetros:**
- `dataArray`: Array de datos (ej: `window.salesData`)
- `columnName`: Nombre de columna a buscar (ej: `'pitchType'`)
- `criteria`: Valor a contar (ej: `'autoridad'`)
- `options`: Objeto opcional
  - `caseSensitive`: true/false (por defecto: false)
  - `partialMatch`: true/false (por defecto: false)

**Ejemplos:**

```javascript
// ¿Cuántas veces se usó "autoridad"?
window.COUNTIF(window.salesData, 'pitchType', 'autoridad')
// → 5

// ¿Cuántos clientes de CDMX?
window.COUNTIF(window.salesData, 'clientOrigin', 'CDMX')
// → 8

// ¿Cuántas conversiones exitosas?
window.COUNTIF(window.salesData, 'result', 'successful')
// → 12
```

---

### 2️⃣ **SUMIF** - Sumar con criterio

```javascript
window.SUMIF(dataArray, columnName, criteria, sumColumn, options)
```

**Parámetros:**
- `dataArray`: Array de datos
- `columnName`: Columna con criterios
- `criteria`: Valor que debe cumplir
- `sumColumn`: Columna con valores a sumar
- `options`: Objeto opcional

**Retorna:**
```javascript
{
  sum: 2450,        // Total sumado
  count: 5,         // Cantidad de filas que cumplen
  average: 490      // Promedio
}
```

**Ejemplos:**

```javascript
// ¿Cuánto dinero en pitches de "autoridad"?
window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto')
// → { sum: 2450, count: 5, average: 490 }

// ¿Ingresos totales de clientes CDMX?
window.SUMIF(window.salesData, 'clientOrigin', 'CDMX', 'monto')
// → { sum: 4200, count: 8, average: 525 }

// ¿Monto total de conversiones exitosas?
window.SUMIF(window.salesData, 'result', 'successful', 'monto')
// → { sum: 6850, count: 12, average: 570.83 }
```

---

### 3️⃣ **COUNTIFS** - Contar con múltiples criterios

```javascript
window.COUNTIFS(dataArray, criteriaArray)
```

**Parámetros:**
- `dataArray`: Array de datos
- `criteriaArray`: Array de arrays con [columna, valor]

**Ejemplos:**

```javascript
// ¿Cuántos pitches de "autoridad" fueron exitosos?
window.COUNTIFS(window.salesData, [
  ['pitchType', 'autoridad'],
  ['result', 'successful']
])
// → 4

// ¿Cuántos clientes CDMX compraron con pitch "nostalgia"?
window.COUNTIFS(window.salesData, [
  ['clientOrigin', 'CDMX'],
  ['pitchType', 'nostalgia']
])
// → 2
```

---

### 4️⃣ **SUMIFS** - Sumar con múltiples criterios

```javascript
window.SUMIFS(dataArray, sumColumn, criteriaArray)
```

**Ejemplos:**

```javascript
// ¿Cuánto dinero de pitches "autoridad" exitosos?
window.SUMIFS(window.salesData, 'monto', [
  ['pitchType', 'autoridad'],
  ['result', 'successful']
])
// → { sum: 1800, count: 4, average: 450 }

// ¿Ingresos de clientes CDMX con pitch "escasez"?
window.SUMIFS(window.salesData, 'monto', [
  ['clientOrigin', 'CDMX'],
  ['pitchType', 'escasez']
])
// → { sum: 950, count: 2, average: 475 }
```

---

### 5️⃣ **analyzePitchEffectiveness** - Análisis completo por pitch

```javascript
window.analyzePitchEffectiveness()
```

**Retorna:**

```javascript
{
  autoridad: {
    total: 5,              // Veces usada
    successful: 4,         // Conversiones
    failed: 1,            // Fracasos
    pending: 0,           // Pendientes
    conversionRate: 80,   // Porcentaje
    totalRevenue: 2450,   // Dinero total
    avgRevenue: 490,      // Promedio
    ticketPromedio: 490
  },
  nostalgia: {...},
  escasez: {...},
  comunidad: {...}
}
```

---

### 6️⃣ **analyzeOriginEffectiveness** - Análisis por client origin

```javascript
window.analyzeOriginEffectiveness()
```

**Retorna:**

```javascript
{
  'CDMX': {
    total: 8,
    successful: 6,
    conversionRate: 75,
    totalRevenue: 4200,
    avgRevenue: 525
  },
  'Cancun_Local': {...},
  'International': {...}
}
```

---

### 7️⃣ **analyzePitchByZone** - Pitch × Zona

```javascript
window.analyzePitchByZone()
```

**Retorna matriz:**

```javascript
{
  'zona_hotelera': {
    'autoridad': { count: 2, successful: 2, rate: 100, totalRevenue: 950 },
    'nostalgia': { count: 1, successful: 0, rate: 0, totalRevenue: 0 },
    'escasez': { count: 2, successful: 2, rate: 100, totalRevenue: 1200 },
    'comunidad': { count: 0, successful: 0, rate: 0, totalRevenue: 0 }
  },
  'centro': {...}
}
```

**Pregunta que responde:** "¿Qué pitch funciona mejor en cada zona?"

---

### 8️⃣ **analyzePitchByOrigin** - Pitch × Client Origin

```javascript
window.analyzePitchByOrigin()
```

**Retorna matriz similar a la anterior**

**Pregunta que responde:** "¿Qué pitch funciona mejor para cada origen de cliente?"

---

### 9️⃣ **showAllAnalysis** - Ver todo de una vez

```javascript
window.showAllAnalysis()
```

Muestra en consola:
- ✅ Resumen general (totales, conversiones, ingresos)
- ✅ Análisis por pitch
- ✅ Análisis por origen
- ✅ Formato bonito con colores

---

## 💡 Casos de Uso

### Caso 1: "¿Cuál es el pitch más efectivo?"

```javascript
const analysis = window.analyzePitchEffectiveness();
const best = Object.entries(analysis).sort((a, b) => 
  b[1].conversionRate - a[1].conversionRate
)[0];

console.log(`Mejor pitch: ${best[0]} (${best[1].conversionRate}% de conversión)`);
```

**Output:** `Mejor pitch: escasez (85.7% de conversión)`

---

### Caso 2: "¿De dónde vienen nuestros mejores clientes?"

```javascript
const analysis = window.analyzeOriginEffectiveness();
const best = Object.entries(analysis).sort((a, b) => 
  b[1].totalRevenue - a[1].totalRevenue
)[0];

console.log(`Mayor ingreso: ${best[0]} ($${best[1].totalRevenue})`);
```

**Output:** `Mayor ingreso: CDMX ($4200)`

---

### Caso 3: "¿Qué pitch funciona en Zona Hotelera?"

```javascript
const analysis = window.analyzePitchByZone();
const zoneAnalysis = analysis['zona_hotelera'];

Object.entries(zoneAnalysis).forEach(([pitch, data]) => {
  if (data.count > 0) {
    console.log(`${pitch}: ${data.rate}% conversión`);
  }
});
```

**Output:**
```
autoridad: 100% conversión
nostalgia: 50% conversión
escasez: 100% conversión
```

---

### Caso 4: "¿Cannibalization entre pitches?"

```javascript
// Si usamos "autoridad" en zona hotelera, 
// ¿afecta negativamente a "escasez"?

const pitchByZone = window.analyzePitchByZone();
const zoneHotel = pitchByZone['zona_hotelera'];

const autoridadRate = zoneHotel['autoridad'].rate;
const escasezRate = zoneHotel['escasez'].rate;

console.log(`Autoridad: ${autoridadRate}%`);
console.log(`Escasez: ${escasezRate}%`);
console.log(`Diferencia: ${Math.abs(autoridadRate - escasezRate)}%`);
```

---

## 🔧 Troubleshooting

### "Función no definida"

✅ **Solución:** 
1. Recarga la página
2. Carga un CSV para que se ejecute `index.html`
3. Abre consola (F12) y prueba de nuevo

### "Sin datos para analizar"

✅ **Solución:**
1. Ve a "Datos y CSV"
2. Carga el archivo `PLANTILLA_CSV_ESTANDAR.csv`
3. Espera a que diga "registros cargados"
4. Luego ejecuta el comando

### Los resultados son "unknown"

✅ **Solución:**
Tus valores CSV no son reconocidos. Verifica que usen:

**Pitch types válidos:**
- `autoridad`, `authority`, `expert`, `especialista`, `experto`
- `nostalgia`, `memories`, `tradicion`, `recuerdo`
- `escasez`, `scarcity`, `limited`, `urgencia`
- `comunidad`, `community`, `local`, `juntos`

**Client origins válidos:**
- `CDMX`, `ciudad de méxico`, `mexico`
- `Cancun`, `local`
- `Quintana Roo`
- `Yucatan`
- `Internacional`, `turista`
- `Migrante`

---

## 📞 Soporte

Si tienes dudas, escribe en consola:

```javascript
// Ver esta guía en consola
console.log('Lee GUIA_ANALISIS_CRUZADO.md')

// Preguntar qué datos tienes
console.table(window.salesData)

// Ver estructura de un registro
console.log(window.salesData[0])
```

---

## 🚀 Próximos pasos

1. Carga tu CSV
2. Ejecuta `window.showAllAnalysis()`
3. Identifica patrones en tus datos
4. Usa COUNTIF/SUMIF para preguntas específicas
5. Exporta resultados para reportes

¡Listo para analizar! 📊
