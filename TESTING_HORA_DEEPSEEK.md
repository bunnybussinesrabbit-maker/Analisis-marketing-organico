# 🧪 Testing Guide: Verificación de Hora y DeepSeek Recommendations

**Objetivo:** Validar que los fixes de hora y DeepSeek funcionan correctamente después de cargar datos CSV.

---

## 📍 Localización de Tests

Todos estos tests se ejecutan en la **Consola del Navegador** (F12 → Pestaña Console).

---

## 🔍 TEST 1: Verificar que horaKey se Detecta

**Comando:**
```javascript
// En consola, después de cargar CSV:
console.log('Búsqueda de horaKey en datos:');
console.log(window.salesData[0]);
```

**Resultado Esperado:**
```javascript
{
  lat: 21.156,
  lng: -86.847,
  monto: 250,
  fecha: Date Wed Jan 27 2026 00:00:00 GMT-0600 (...),
  hora: "14:30",  // ✅ IMPORTANTE: NO debe ser "00:00"
  fechaStr: "2026-01-27",
  zona: "zona_hotelera",
  pitchType: "autoridad",
  result: "successful",
  clientOrigin: "CDMX",
  cliente: "Cliente1",
  id: 0
}
```

**Validación:** Si `hora` contiene un valor como "14:30", "09:00", etc., el parsing está **✅ CORRECTO**.

---

## 📊 TEST 2: Ejecutar Validación Completa de Horas

**Comando:**
```javascript
// En consola:
window.validateParsedData(window.salesData)
```

**Resultado Esperado:**
```javascript
🔍 [DataValidator] Analizando 250 registros...
✅ Validación Hora: {
  total: 250,
  válidas: 248,        // >90% debe estar entre estos números
  faltantes: 2,
  inválidas: 0,
  porcentajeVálidas: '99.20%'  // ✅ DEBE SER >90%
}
📊 Distribución por hora: {
  '09': 12,
  '10': 18,
  '11': 14,
  '12': 16,
  '14': 31,  // ✅ Muestra distribución real por hora
  '15': 28,
  '16': 22,
  ...
}
📋 Muestras primeras 5: [
  {hora: "14:30", zona: "zona_hotelera", pitchType: "autoridad", result: "successful"},
  {hora: "09:15", zona: "zona_centro", pitchType: "nostalgia", result: "failed"},
  ...
]
```

**Validación Checklist:**
- [x] `total` = número de registros en CSV
- [x] `válidas` > (total × 0.90) → Al menos 90% válidas
- [x] `porcentajeVálidas` > "90%"
- [x] `hourDistribution` muestra todas las horas del día
- [x] `samples` muestran horas reales (no "00:00")

---

## 🎯 TEST 3: Generar Recomendaciones Diarias

**Comando:**
```javascript
// En consola (ESPERAR 2-3 segundos por API):
const result = await window.generateDailyRecommendationsWithDeepSeek(window.salesData);
console.log('📈 Estadísticas:', result.stats);
console.log('🤖 Recomendaciones:', result.recommendations);
```

**Resultado Esperado - Estadísticas:**
```javascript
{
  totalPitches: 250,
  successfulPitches: 148,
  conversionRate: '59.20',           // ✅ Porcentaje real
  byHour: {
    '09': { total: 12, successful: 7, rate: '58.33' },
    '10': { total: 18, successful: 12, rate: '66.67' },
    '14': { total: 31, successful: 21, rate: '67.74' },  // ✅ Picos por hora
    '15': { total: 28, successful: 18, rate: '64.29' },
    ...
  },
  byPitch: {
    'autoridad': { total: 65, successful: 45, rate: '69.23' },  // ✅ Mejor pitch
    'nostalgia': { total: 60, successful: 32, rate: '53.33' },
    'escasez': { total: 58, successful: 33, rate: '56.90' },
    'comunidad': { total: 67, successful: 38, rate: '56.72' }
  },
  byZone: {
    'zona_hotelera': { total: 88, successful: 62, rate: '70.45' },  // ✅ Mejor zona
    'zona_centro': { total: 85, successful: 48, rate: '56.47' },
    ...
  },
  topPitches: [
    {pitch: 'autoridad', total: 65, successful: 45, rate: '69.23'},
    {pitch: 'escasez', total: 58, successful: 33, rate: '56.90'},
    {pitch: 'nostalgia', total: 60, successful: 32, rate: '53.33'}
  ],
  topZones: [
    {zone: 'zona_hotelera', total: 88, successful: 62, rate: '70.45'},
    {zone: 'region_237', total: 70, successful: 40, rate: '57.14'},
    {zone: 'sm_77', total: 65, successful: 35, rate: '53.85'}
  ],
  peakHours: [
    {hour: '14', total: 31, successful: 21, rate: '67.74'},
    {hour: '15', total: 28, successful: 18, rate: '64.29'},
    {hour: '16', total: 22, successful: 14, rate: '63.64'}
  ]
}
```

**Validación Checklist:**
- [x] `totalPitches` = total de registros en CSV
- [x] `conversionRate` es un número entre 0-100
- [x] `byHour` contiene distribución por cada hora (09, 10, 14, 15, etc.)
- [x] `byPitch` contiene los 4 tipos de pitch con estadísticas
- [x] `byZone` contiene todas las zonas con estadísticas
- [x] `topPitches` ranqueados por effectiveness (rate descendente)
- [x] `peakHours` son las horas con más actividad

---

## 🎨 TEST 4: Verificar Recomendaciones de DeepSeek

**Resultado Esperado - Recomendaciones:**
```javascript
"Basándose en el análisis de los datos de ventas de puerta en puerta del día en Cancún:

1. **PRIORIDAD MÁXIMA - Enfoque en Autoridad (69.23% de conversión):**
   Mantén agentes altamente capacitados en Zona Hotelera entre 14:00-16:00 
   usando el pitch de 'Autoridad'. Es tu mejor combinación hora-zona-pitch.

2. **ROTACIÓN DE PITCHES:**
   - De 09:00-12:00: Enfatiza 'Comunidad' en Región 237 (40%+ conversión)
   - De 14:00-17:00: Predomina 'Autoridad' en Zona Hotelera (70%+ conversión)
   - De 17:00-19:00: Alterna 'Escasez' en Centro (mejor performance tarde)

3. **OPTIMIZACIÓN DE ZONAS:**
   Zona Hotelera > Región 237 > SM 77 (en orden de efectividad)
   Dedica 40% de tiempo a Zona Hotelera (mayor ROI).

4. **VALIDACIÓN DE HIPÓTESIS:**
   Tu tesis de que 'Autoridad' + hora pico = máxima conversión 
   se confirma con 67.74% en horario pico (14:00-15:00).

5. **PRÓXIMAS ACCIONES:**
   - Prueba 'Escasez' en Zona Hotelera entre 17:00-18:00 (territorio sin explorar)
   - Incremente intensidad de canvasing en Zona Hotelera 14:00-16:00
   - Mapea barreras en SM 77 (solo 53.85% conversion rate)"
```

**Validación:**
- [x] Contiene recomendaciones específicas por zona
- [x] Menciona horas pico identificadas
- [x] Ranquea pitch types por efectividad
- [x] Propone próximas acciones concretas
- [x] Usa datos reales del CSV (no genérico)

---

## 🔧 TEST 5: Verificar Sintaxis y Formato de Horas

**Comando:**
```javascript
// En consola - Verificar 10 registros aleatorios:
const randomSample = window.salesData.sort(() => 0.5 - Math.random()).slice(0, 10);
randomSample.forEach((record, i) => {
  const horaValida = /^\d{2}:\d{2}$/.test(record.hora);
  console.log(`${i+1}. ${record.zona} - Hora: ${record.hora} ${horaValida ? '✅' : '❌'} - Pitch: ${record.pitchType}`);
});
```

**Resultado Esperado:**
```
1. zona_hotelera - Hora: 14:30 ✅ - Pitch: autoridad
2. zona_centro - Hora: 09:15 ✅ - Pitch: nostalgia
3. region_237 - Hora: 11:00 ✅ - Pitch: escasez
4. sm_77 - Hora: 15:45 ✅ - Pitch: comunidad
5. zona_hotelera - Hora: 10:20 ✅ - Pitch: autoridad
6. zona_centro - Hora: 16:50 ✅ - Pitch: escasez
7. region_237 - Hora: 13:30 ✅ - Pitch: comunidad
8. sm_91 - Hora: 09:00 ✅ - Pitch: nostalgia
9. region_233 - Hora: 14:15 ✅ - Pitch: autoridad
10. centro - Hora: 17:30 ✅ - Pitch: escasez
```

**Validación:** Todas las horas deben mostrar ✅ y formato HH:mm

---

## 📈 TEST 6: Verificar Efectividad Cruzada (Pitch × Zona × Hora)

**Comando:**
```javascript
// En consola - Análisis cruzado manual:
const crossAnalysis = {};

window.salesData.forEach(record => {
  const key = `${record.pitchType}|${record.zona}|${record.hora.split(':')[0]}`;
  if (!crossAnalysis[key]) {
    crossAnalysis[key] = { total: 0, success: 0, rate: 0 };
  }
  crossAnalysis[key].total++;
  if (record.result === 'successful') crossAnalysis[key].success++;
});

// Calcular rates
Object.keys(crossAnalysis).forEach(key => {
  const data = crossAnalysis[key];
  data.rate = (data.success / data.total * 100).toFixed(2);
});

// Mostrar top 10
const sorted = Object.entries(crossAnalysis)
  .sort((a, b) => parseFloat(b[1].rate) - parseFloat(a[1].rate))
  .slice(0, 10);

console.log('Top 10 Combinaciones Pitch×Zona×Hora:');
sorted.forEach(([key, data], i) => {
  const [pitch, zone, hour] = key.split('|');
  console.log(`${i+1}. ${pitch} en ${zone} a las ${hour}:00 → ${data.rate}% (${data.success}/${data.total})`);
});
```

**Resultado Esperado:**
```
Top 10 Combinaciones Pitch×Zona×Hora:
1. autoridad en zona_hotelera a las 14:00 → 75.00% (9/12)
2. autoridad en zona_hotelera a las 15:00 → 72.22% (13/18)
3. escasez en zona_centro a las 16:00 → 68.75% (11/16)
4. comunidad en region_237 a las 10:00 → 65.38% (17/26)
5. autoridad en sm_91 a las 14:00 → 63.16% (12/19)
...
```

**Validación:** Muestra combinaciones reales de efectividad (datos parseados correctamente)

---

## ⚠️ TROUBLESHOOTING

### Problema: `validateParsedData is not defined`
**Solución:** Asegúrate de que el navegador cargó la página completamente. Espera a que cargue o recarga la página (F5).

### Problema: Todas las horas muestran "00:00"
**Solución:** El CSV no tiene columna "hora" o está mal nombrada. Verifica que el CSV tenga una columna llamada "hora", "time", "htime", "hour" o "tiempo".

### Problema: `generateDailyRecommendationsWithDeepSeek` retorna error
**Solución:** Verifica que:
1. `localStorage.getItem('deepseekApiKey')` retorna una API key válida
2. La API key es de DeepSeek (no OpenAI o Groq)
3. Tienes conexión a internet

### Problema: Recomendaciones tardían (>5 segundos)
**Esperado:** Los primeros 3-5 segundos son normales. Si tarda más, verifica tu conexión.

---

## 🚀 Checklist Final de Validación

Ejecuta estos tests en orden:

- [ ] **TEST 1:** window.salesData[0].hora es "HH:mm" (no "00:00")
- [ ] **TEST 2:** validateParsedData() muestra >90% válidas
- [ ] **TEST 3:** generateDailyRecommendationsWithDeepSeek() retorna stats
- [ ] **TEST 4:** Recomendaciones incluyen 5 puntos específicos
- [ ] **TEST 5:** Random sample muestra todas horas ✅
- [ ] **TEST 6:** Cross-analysis muestra top 10 combinaciones

**Si todos están ✅, la implementación está LISTA PARA PRODUCCIÓN.**

---

## 📞 Soporte

Si encuentras algún problema:
1. Verifica que tu CSV tenga una columna "hora"
2. Ejecuta `validateParsedData(window.salesData)` para diagnosticar
3. Revisa la consola (F12) para mensajes de error
4. Intenta con un CSV pequeño (5-10 registros) para debug

---

**Última actualización:** 27 Enero 2026  
**Status:** ✅ LISTO PARA TESTING
