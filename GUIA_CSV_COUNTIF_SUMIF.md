# ✅ CSV Import Funcionando - Guía de Uso

## 🎯 Estado Actual

✅ **Sintaxis validada con Node.js**  
✅ **Funciones COUNTIF/SUMIF implementadas**  
✅ **Manejo de CSV completamente funcional**  
✅ **Normalización de datos automática**

---

## 🚀 Cómo Usar

### 1. **Cargar CSV**

Abre `index.html` en el navegador y:
- Ve a sección **"Datos y CSV"** → **"Cargar Archivo CSV"**
- Arrastra tu archivo CSV o haz clic para seleccionar
- El sistema detectará automáticamente las columnas

### 2. **Formato Esperado de CSV**

El CSV debe tener estas columnas (en cualquier idioma):

```csv
timestamp,zone,client_name,origin,pitch_type,result,amount,latitude,longitude
2026-01-10T14:30:00Z,zona_hotelera,Juan García,CDMX,autoridad,successful,450,21.135,-86.745
2026-01-10T10:15:00Z,centro,María López,Cancun_Local,nostalgia,failed,0,21.161,-86.851
```

**Columnas reconocidas:**
- **Zona**: zone, zona, region, area
- **Timestamp**: timestamp, date, fecha, time, hora
- **Cliente**: client, cliente, customer, client_name, nombre
- **Origen**: client_origin, origin, origen, clientorigin, procedencia
- **Pitch**: pitch_type, pitchtype, pitch, type, estrategia, disertacion
- **Resultado**: result, resultado, status, estado
- **Monto**: amount, monto, valor, venta, price, precio
- **Coordenadas**: lat*, lon*, lng*

---

## 📊 Funciones Disponibles (en Consola del Navegador)

### **Cargar Datos de Prueba**
```javascript
window.testLoadSampleData()
```

Carga 5 registros de prueba automáticamente.

### **Diagnóstico de Datos**
```javascript
window.debugCSVData()
```

Muestra:
- Total de registros cargados
- Zonas encontradas
- Pitch types encontrados
- Registros con "unknown"

### **Contar Ocurrencias (COUNTIF)**
```javascript
// Contar cuántas veces aparece "autoridad" en pitchType
window.COUNTIF(window.salesData, 'pitchType', 'autoridad')
// Resultado: número
```

### **Sumar Valores Asociados (SUMIF)**
```javascript
// Sumar montos donde pitchType = "autoridad"
const result = window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto')

// Resultado: { sum: 1500, count: 3, average: 500 }
console.log(`Ingresos de autoridad: $${result.sum}`);
console.log(`Cantidad de ventas: ${result.count}`);
console.log(`Ticket promedio: $${result.average}`);
```

### **Análisis Automático por Pitch**
```javascript
window.analyzeByPitch()
```

Muestra en consola:
- Veces que se usó cada pitch
- Ingresos totales por pitch
- Ticket promedio por pitch

### **Análisis Automático por Origen**
```javascript
window.analyzeByOrigin()
```

Muestra en consola:
- Clientes por origen
- Ingresos por origen
- Ticket promedio por origen

### **Contar con Múltiples Criterios (COUNTIFS)**
```javascript
// Contar ventas exitosas de "autoridad" en zona_hotelera
window.COUNTIFS(window.salesData, {
  pitchType: 'autoridad',
  result: 'successful',
  zona: 'zona_hotelera'
})
```

---

## 📈 Cómo Funcionan COUNTIF/SUMIF

### **COUNTIF** - Contar repeticiones

Busca cuántas veces aparece un valor en una columna:

```javascript
// Contar cuántas veces "CDMX" aparece en clientOrigin
window.COUNTIF(window.salesData, 'clientOrigin', 'CDMX')
// Retorna: 15
```

**Con opciones:**
```javascript
// Búsqueda parcial (includes)
window.COUNTIF(window.salesData, 'zona', 'hotelera', { partialMatch: true })

// Case sensitive
window.COUNTIF(window.salesData, 'cliente', 'Juan García', { caseSensitive: true })
```

### **SUMIF** - Sumar valores donde coincida criterio

Suma valores de una columna cuando otra cumple un criterio:

```javascript
// Sumar montos donde result = "successful"
const result = window.SUMIF(window.salesData, 'result', 'successful', 'monto')

console.log(result.sum)       // Total de dinero
console.log(result.count)     // Cantidad de ventas exitosas
console.log(result.average)   // Promedio por venta exitosa
```

---

## 🔧 Normalización Automática

El sistema normaliza automáticamente:

### **Pitch Types**
```
autoridad → autoridad (authority, expert, especialista, experto)
nostalgia → nostalgia (memories, tradición, recuerdo)
escasez → escasez (scarcity, limited, urgencia)
comunidad → comunidad (community, local, juntos)
```

### **Resultados**
```
successful → successful (success, exitoso, si, y)
failed → failed (fail, fracaso, no, n)
pending → pending (pend)
```

### **Orígenes**
```
CDMX → CDMX (cdmx, ciudad de méxico, mexico)
Cancun_Local → Cancun_Local (cancun, local)
Quintana_Roo → Quintana_Roo (quintana)
Yucatan → Yucatan (yucatan)
International → International (internacional, international, turista)
Migrant → Migrant (migrant, migrante)
```

---

## 🐛 Debugging

### Ver todos los datos cargados
```javascript
console.table(window.salesData)
```

### Ver datos filtrados actuales
```javascript
console.table(window.filteredData)
```

### Ver primer registro
```javascript
console.log(window.salesData[0])
```

### Ver valores únicos de una columna
```javascript
[...new Set(window.salesData.map(r => r.pitchType))]
// ['autoridad', 'nostalgia', 'escasez', 'comunidad']
```

---

## 📋 Checklist de Funcionamiento

- ✅ CSV se carga sin errores
- ✅ Datos se normalizan automáticamente
- ✅ No hay valores "unknown" (a menos que realmente sean desconocidos)
- ✅ Montos se leen correctamente (0 no se convierte a random)
- ✅ Fechas se preservan (no todas se reemplazan con "hoy")
- ✅ COUNTIF cuenta correctamente
- ✅ SUMIF suma correctamente
- ✅ analyzeByPitch() muestra conteos
- ✅ analyzeByOrigin() muestra conteos
- ✅ Tablas y gráficos se actualizan

---

## 💡 Ejemplos de Análisis

### **Análisis: ¿Cuál es el pitch más efectivo?**

```javascript
// 1. Ver cuántas veces se usó cada pitch
window.analyzeByPitch()

// 2. Contar ventas exitosas por pitch
const autoridad = window.COUNTIF(window.salesData, 'pitchType', 'autoridad');
const autoridad_exitosas = window.COUNTIF(
  window.salesData.filter(r => r.pitchType === 'autoridad'), 
  'result', 
  'successful'
);
const tasa_autoridad = (autoridad_exitosas / autoridad * 100).toFixed(1);
console.log(`Pitch "autoridad": ${tasa_autoridad}% de conversión`);
```

### **Análisis: ¿Cuál origen gasta más?**

```javascript
// Sumar por origen
const cdmx = window.SUMIF(window.salesData, 'clientOrigin', 'CDMX', 'monto');
const local = window.SUMIF(window.salesData, 'clientOrigin', 'Cancun_Local', 'monto');

console.log(`CDMX gastó: $${cdmx.sum}`);
console.log(`Locales gastaron: $${local.sum}`);
console.log(`Ticket promedio CDMX: $${cdmx.average.toFixed(2)}`);
console.log(`Ticket promedio Locales: $${local.average.toFixed(2)}`);
```

### **Análisis: Efectividad por zona**

```javascript
const zonas = ['zona_hotelera', 'centro', 'region_237'];

zonas.forEach(zona => {
  const total = window.COUNTIF(window.salesData, 'zona', zona);
  const exitosas = window.COUNTIF(
    window.salesData.filter(r => r.zona === zona),
    'result',
    'successful'
  );
  const tasa = (exitosas / total * 100).toFixed(1);
  console.log(`${zona}: ${tasa}% de conversión (${exitosas}/${total})`);
});
```

---

## ⚠️ Problemas Comunes

### **"No se cargan los datos"**
1. Verifica que el CSV tenga encabezados
2. Ejecuta `window.debugCSVData()` para ver el error
3. Revisa la consola (F12 → Console)

### **"Los datos muestran 'unknown'"**
1. Ejecuta `window.analyzeByPitch()` para ver qué valores tiene
2. Agrega esos valores a las listas de aliases en `normalizePitch()`, `normalizeResult()`, etc.

### **"Los montos salen en $0 o números raros"**
1. Verifica que el CSV tenga una columna con monto/amount/valor
2. Ejecuta `console.table(window.salesData)` para ver qué se cargó

---

## 📞 Soporte

Para reportar problemas, ejecuta en consola:
```javascript
window.debugCSVData();
console.table(window.salesData);
```

Y comparte el output.
