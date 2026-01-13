# 🚀 Referencia Rápida - Comandos de Consola

**Copiar y pegar estos comandos en DevTools (F12)**

---

## 1️⃣ DIAGNÓSTICO RÁPIDO
```javascript
window.debugCSVData()
```
Muestra estado completo de datos, zonas, pitch types, y registros con "unknown".

---

## 2️⃣ CARGAR DATOS DE PRUEBA
```javascript
window.testLoadSampleData()
```
Carga 5 registros de prueba automáticamente e inicializa el análisis.

---

## 3️⃣ VER CONTEO DE REGISTROS
```javascript
console.log({
  total: window.salesData?.length || 0,
  filtered: window.filteredData?.length || 0,
  problematic: window.salesData?.filter(r => r.zona === 'unknown' || r.pitchType === 'unknown' || r.result === 'unknown').length || 0
})
```

---

## 4️⃣ LISTAR TODAS LAS ZONAS
```javascript
[...new Set(window.salesData?.map(r => r.zona) || [])]
```

---

## 5️⃣ LISTAR TODOS LOS PITCH TYPES
```javascript
[...new Set(window.salesData?.map(r => r.pitchType) || [])]
```

---

## 6️⃣ VER REGISTROS CON "UNKNOWN"
```javascript
window.salesData?.filter(r => r.zona === 'unknown' || r.pitchType === 'unknown' || r.result === 'unknown')
```

---

## 7️⃣ VER DATOS ORIGINALES DE UN REGISTRO
```javascript
window.salesData[0]._rawData
```

---

## 8️⃣ LIMPIAR TODO Y EMPEZAR DE NUEVO
```javascript
delete window.salesData;
delete window.filteredData;
delete window.currentAnalyzer;
location.reload();
```

---

## 9️⃣ CARGAR ANÁLISIS COMPLETO MANUALMENTE
```javascript
if (typeof initCompleteAnalysis === 'function') initCompleteAnalysis();
```

---

## 🔟 SINCRONIZAR DATOS CAPTURADOS
```javascript
syncCapturedDataWithAnalytics()
```

---

## 1️⃣1️⃣ EXPORTAR DATOS A CSV
```javascript
console.save(window.salesData, 'datos_exportados.json')
```

---

## 1️⃣2️⃣ TABLA FORMATEADA DE REGISTROS
```javascript
console.table(window.salesData?.map(r => ({
  zona: r.zona,
  pitch: r.pitchType,
  result: r.result,
  origin: r.clientOrigin,
  monto: r.monto
})) || [])
```

---

## 1️⃣3️⃣ RESUMEN POR ZONA
```javascript
const byZone = {};
window.salesData?.forEach(r => {
  if (!byZone[r.zona]) byZone[r.zona] = 0;
  byZone[r.zona]++;
});
console.table(byZone)
```

---

## 1️⃣4️⃣ VALIDAR FIELDMAPPER
```javascript
console.log({
  loaded: typeof window.FieldMapper !== 'undefined',
  hasDetect: typeof window.FieldMapper?.detectField === 'function',
  hasNormalize: typeof window.FieldMapper?.normalizeValue === 'function',
  hasNormalizers: !!window.FieldMapper?.VALUE_NORMALIZERS
})
```

---

## 1️⃣5️⃣ MOSTRAR PRIMER REGISTRO COMPLETO
```javascript
console.log(JSON.stringify(window.salesData?.[0], null, 2))
```

---

**💡 Tips:**
- Copia el comando exacto
- Pégalo en consola (F12)
- Presiona Enter
- Mira el resultado

**❓ Si hay error:**
1. Asegúrate de estar en la consola (F12)
2. Asegúrate de que el archivo se ha cargado o ejecutado `window.testLoadSampleData()`
3. Copia todo el comando incluyendo paréntesis y llaves
