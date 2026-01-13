# 🔧 Diagnóstico: Datos No Cargan + "Unknown" en Pitch/Origen

## 🎯 Problema Reportado
1. ❌ Los datos de ventas NO se están cargando
2. ❌ Sigue mostrando "unknown" en `pitchType`
3. ❌ Sigue mostrando "unknown" en `clientOrigin` (origen)
4. ❌ La app no está contando repeticiones de pitch_type

## 🔍 Comandos de Debug en Consola del Navegador (F12)

### Paso 1: Verificar si hay datos cargados
```javascript
// En la consola del navegador
console.log('Datos cargados:', window.salesData ? window.salesData.length : 'NO HAY DATOS');
console.table(window.salesData);  // Ver tabla completa
```

### Paso 2: Ver los datos CRUDOS después de parsear CSV
```javascript
// Antes de normalización
console.log('Datos RAW:', window.rawData);  // Si existe
```

### Paso 3: Verificar normalización de pitch_type
```javascript
// Ver qué valores tiene pitch_type
const pitches = window.salesData.map(r => r.pitchType);
console.log('Valores de pitchType:', [...new Set(pitches)]);

// Ver si hay "unknown"
const unknownPitches = window.salesData.filter(r => r.pitchType === 'unknown');
console.log(`Registros con "unknown": ${unknownPitches.length}`);
console.table(unknownPitches);
```

### Paso 4: Verificar normalización de clientOrigin  
```javascript
// Ver qué valores tiene clientOrigin
const origins = window.salesData.map(r => r.clientOrigin);
console.log('Valores de clientOrigin:', [...new Set(origins)]);

// Ver si hay "unknown"
const unknownOrigins = window.salesData.filter(r => r.clientOrigin === 'unknown');
console.log(`Registros con "unknown": ${unknownOrigins.length}`);
console.table(unknownOrigins);
```

### Paso 5: Usar nuevas funciones COUNTIF/SUMIF
```javascript
// CONTAR cuántas veces se usó cada pitch
window.analyzeByPitch();   // Ejecuta análisis completo de pitches

// CONTAR por origen
window.analyzeByOrigin();  // Ejecuta análisis completo de orígenes

// COUNTIF manual
const countAutoridad = window.COUNTIF(window.salesData, 'pitchType', 'autoridad');
console.log(`"autoridad" aparece ${countAutoridad} veces`);

// SUMIF manual
const sumAutoridad = window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto');
console.log(`Ingresos de "autoridad": $${sumAutoridad.sum}`);
console.log(`Promedio ticket: $${sumAutoridad.average}`);
```

### Paso 6: Inspeccionar un registro específico
```javascript
// Ver primer registro completo
console.log(window.salesData[0]);

// Ver cómo se leyó un campo específico
const firstRecord = window.salesData[0];
console.log('Primer registro - pitchType:', firstRecord.pitchType);
console.log('Primer registro - clientOrigin:', firstRecord.clientOrigin);
console.log('Primer registro - zona:', firstRecord.zona);
console.log('Primer registro - monto:', firstRecord.monto);
```

## 🎯 Acciones para Resolución

### Si los datos NO se cargan en absoluto:
1. Verifica que el CSV esté en la ubicación correcta
2. Abre DevTools (F12) → Consola → Busca errores
3. Ejecuta: `console.log(window.salesData)` 
4. Si dice `undefined` → El CSV no se procesó

### Si aparecen "unknown" en pitchType:
- El CSV tiene valores diferentes a lo esperado
- Solución: Ejecuta `console.table(window.salesData)` y ve qué dice la columna `pitchType`
- Copia los valores exactos y los agregamos al `VALUE_NORMALIZERS`

### Si aparecen "unknown" en clientOrigin:
- Mismo problema que pitchType
- Solución: Ejecuta `console.table(window.salesData)` y ve qué dice `clientOrigin`
- Copia los valores exactos

## 📊 Nuevas Funciones Disponibles

```javascript
// COUNTIF: Contar cuántas veces aparece un valor en una columna
window.COUNTIF(dataArray, 'columnName', 'criterio')
// Retorna: número

// SUMIF: Sumar valores de otra columna donde coincida criterio
window.SUMIF(dataArray, 'columnName', 'criterio', 'sumColumn')
// Retorna: { sum, count, average }

// Análisis automático por pitch
window.analyzeByPitch()

// Análisis automático por origen
window.analyzeByOrigin()

// Verificación completa de datos
window.verifyDataRead()
```

## 📋 Checklist de Verificación

- [ ] CSV se abre sin errores
- [ ] `window.salesData.length > 0` ✓
- [ ] Valores de `pitchType` son correctos (no "unknown")
- [ ] Valores de `clientOrigin` son correctos (no "unknown")
- [ ] `window.COUNTIF()` cuenta correctamente
- [ ] `window.SUMIF()` suma correctamente
- [ ] `window.analyzeByPitch()` muestra conteos de cada pitch
- [ ] `window.analyzeByOrigin()` muestra conteos de cada origen

---

## 🆘 Si Nada de Esto Funciona

Comparte en consola (F12):
```javascript
// Copia y pega esto en consola, entra al chat y pega el resultado
console.log('=== DEBUG INFO ===');
console.log('Total records:', window.salesData ? window.salesData.length : 'NO DATA');
console.log('First record:', window.salesData ? window.salesData[0] : 'N/A');
console.log('Pitch values:', window.salesData ? [...new Set(window.salesData.map(r => r.pitchType))] : 'N/A');
console.log('Origin values:', window.salesData ? [...new Set(window.salesData.map(r => r.clientOrigin))] : 'N/A');
```
