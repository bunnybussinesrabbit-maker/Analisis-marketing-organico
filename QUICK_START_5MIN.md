# ⚡ QUICK START: Hora + DeepSeek (5 Minutos)

**Usuario finali:** Simplemente copia y pega estos comandos en la consola para validar.

---

## 🚀 5 Pasos (Copia-Pega en Consola F12)

### PASO 1: Ver primer registro (verificar hora)
```javascript
window.salesData[0]
```
**Espera:** Ver objeto con `hora: "14:30"` (no `"00:00"`) ✅

---

### PASO 2: Validar todas las horas
```javascript
window.validateParsedData(window.salesData)
```
**Espera:** Ver `porcentajeVálidas: 'XX%'` (debe ser >90%)  ✅

---

### PASO 3: Ver distribución horaria
```javascript
window.validateParsedData(window.salesData).hourDistribution
```
**Espera:** Ver objeto con horas como `'09': 12, '14': 31, ...` ✅

---

### PASO 4: Generar recomendaciones (espera 3-5 segundos)
```javascript
const r = await window.generateDailyRecommendationsWithDeepSeek(window.salesData);
r.stats
```
**Espera:** Ver estadísticas completas ✅

---

### PASO 5: Ver recomendaciones finales
```javascript
r.recommendations
```
**Espera:** Ver texto con 5 puntos de recomendación ✅

---

## 📊 Qué esperar en cada paso

### PASO 1 Output
```
{
  lat: 21.156,
  lng: -86.847,
  hora: "14:30",          ← ✅ Debe tener formato HH:mm
  zona: "zona_hotelera",
  pitchType: "autoridad",
  result: "successful",
  ...
}
```

### PASO 2 Output
```
🔍 [DataValidator] Analizando 250 registros...
✅ Validación Hora: {
  total: 250,
  válidas: 248,
  faltantes: 2,
  inválidas: 0,
  porcentajeVálidas: '99.20%'    ← ✅ >90% es bueno
}
```

### PASO 3 Output
```
{
  '09': 15,
  '10': 22,
  '14': 31,           ← ✅ Hay gente a las 14:00
  '15': 28,
  ...
}
```

### PASO 4 Output
```
{
  totalPitches: 250,
  successfulPitches: 148,
  conversionRate: '59.20',        ← ✅ Porcentaje real
  byHour: {...},
  byPitch: {...},
  byZone: {...},
  topPitches: [...],
  topZones: [...],
  peakHours: [...]
}
```

### PASO 5 Output
```
"Basándose en el análisis de los datos...

1. **PRIORIDAD**: Mantén 'autoridad' en Zona Hotelera...
2. **ROTACIÓN**: De 09-12: Usa 'Comunidad'...
3. **OPTIMIZACIÓN**: Zona Hotelera > Región 237...
4. **VALIDACIÓN**: Tu hipótesis se confirma...
5. **PRÓXIMAS ACCIONES**: Prueba 'Escasez' en..."
```

---

## 🆘 Si algo falla

### ❌ "validateParsedData is not defined"
```javascript
// Solución: Recarga página y espera 2 segundos
location.reload();
```

### ❌ "Horas muestran 00:00"
```javascript
// Solución: CSV no tiene columna "hora"
// Renombra a: "hora", "time", "hour" o "tiempo"
```

### ❌ "DeepSeek error"
```javascript
// Solución: Configura API key
localStorage.setItem('deepseekApiKey', 'sk-xxxxx');
```

---

## 📋 Comandos Útiles

**Ver todas las horas únicas:**
```javascript
new Set(window.salesData.map(s => s.hora))
```

**Contar por zona:**
```javascript
window.COUNTIF(window.salesData, 'zona', 'zona_hotelera')
```

**Contar exitosos:**
```javascript
window.COUNTIF(window.salesData, 'result', 'successful')
```

**Generar CSV de análisis:**
```javascript
const stats = (await window.generateDailyRecommendationsWithDeepSeek(window.salesData)).stats;
console.table(stats.byHour);
```

---

**¡Listo!** Si todo muestra ✅ en los 5 pasos, está funcionando correctamente.
