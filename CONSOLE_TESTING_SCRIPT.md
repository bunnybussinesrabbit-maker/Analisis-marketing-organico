# 🖥️ CONSOLE TESTING SCRIPT - Copia y Pega

**Propósito:** Script listo para copiar/pegar en consola del navegador (F12) para validar la implementación

---

## 📋 SCRIPT COMPLETO (Copiar Todo)

```javascript
console.clear();
console.log('🚀 INICIANDO TESTS DE HORA + DEEPSEEK\n');

// ============================================
// TEST 1: Ver primer registro
// ============================================
console.log('═══════════════════════════════════════');
console.log('TEST 1: Verificar hora en primer registro');
console.log('═══════════════════════════════════════');
console.log('Comando: window.salesData[0]');
console.log('Resultado:');
const firstRecord = window.salesData[0];
console.log(firstRecord);
const horaCorrect = /^\d{2}:\d{2}$/.test(firstRecord.hora);
console.log(`Estado: ${horaCorrect ? '✅ CORRECTO (hora: "${firstRecord.hora}")' : '❌ INCORRECTO (hora: "' + firstRecord.hora + '")}`);

// ============================================
// TEST 2: Validar todas las horas
// ============================================
console.log('\n═══════════════════════════════════════');
console.log('TEST 2: Ejecutar validación completa');
console.log('═══════════════════════════════════════');
console.log('Comando: window.validateParsedData(window.salesData)');
console.log('Resultado:');
const validation = window.validateParsedData(window.salesData);
console.log(`Total registros: ${validation.totalRecords}`);
console.log(`Horas válidas: ${validation.validHours} (${validation.porcentajeVálidas || 'N/A'}%)`);
console.log(`Horas faltantes: ${validation.missingHours}`);
console.log(`Horas inválidas: ${validation.invalidHours}`);
const validationOK = parseFloat(validation.porcentajeVálidas) >= 90;
console.log(`Estado: ${validationOK ? '✅ CORRECTO (>90%)' : '❌ INCORRECTO (<90%)'}`);

// ============================================
// TEST 3: Ver distribución horaria
// ============================================
console.log('\n═══════════════════════════════════════');
console.log('TEST 3: Distribución por hora');
console.log('═══════════════════════════════════════');
console.log('Comando: window.validateParsedData(window.salesData).hourDistribution');
console.log('Resultado:');
console.table(validation.hourDistribution);
const hasDistribution = Object.keys(validation.hourDistribution).length > 0;
console.log(`Estado: ${hasDistribution ? '✅ CORRECTO (múltiples horas)' : '❌ INCORRECTO (sin horas)'}`);

// ============================================
// TEST 4: Generar recomendaciones
// ============================================
console.log('\n═══════════════════════════════════════');
console.log('TEST 4: Generar recomendaciones (ESPERA 3-5 SEG)');
console.log('═══════════════════════════════════════');
console.log('Comando: await window.generateDailyRecommendationsWithDeepSeek(window.salesData)');
console.log('Por favor espera mientras se genera...');

(async () => {
  try {
    const startTime = Date.now();
    const result = await window.generateDailyRecommendationsWithDeepSeek(window.salesData);
    const endTime = Date.now();
    
    console.log(`\nTiempo de respuesta: ${(endTime - startTime) / 1000} segundos`);
    console.log('\nResultado:');
    
    if (result.stats) {
      console.log('\n📊 ESTADÍSTICAS:');
      console.log(`  Total pitches: ${result.stats.totalPitches}`);
      console.log(`  Conversión: ${result.stats.conversionRate}%`);
      console.log(`  Exitosos: ${result.stats.successfulPitches}`);
      console.log(`  Top pitches: ${result.stats.topPitches.map(p => p.pitch).join(', ')}`);
      console.log(`  Top zonas: ${result.stats.topZones.map(z => z.zone).join(', ')}`);
      console.log(`  Horas pico: ${result.stats.peakHours.map(h => h.hour + ':00').join(', ')}`);
    }
    
    if (result.recommendations) {
      console.log('\n🤖 RECOMENDACIONES DE DEEPSEEK:');
      console.log(result.recommendations);
    }
    
    if (result.error) {
      console.log('⚠️ ERRORES:');
      console.log(result.error);
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('✅ TEST COMPLETADO');
    console.log('═══════════════════════════════════════');
    
  } catch (error) {
    console.error('❌ ERROR en TEST 4:', error);
  }
})();
```

---

## 📋 SCRIPT POR PASOS (Si Prefieres Uno a Uno)

### PASO 1: Verificar hora
```javascript
window.salesData[0]
```

### PASO 2: Validar todas las horas
```javascript
window.validateParsedData(window.salesData)
```

### PASO 3: Ver distribución
```javascript
window.validateParsedData(window.salesData).hourDistribution
```

### PASO 4: Generar recomendaciones (ESPERA 3-5 SEG)
```javascript
const result = await window.generateDailyRecommendationsWithDeepSeek(window.salesData);
```

### PASO 5: Ver estadísticas
```javascript
result.stats
```

### PASO 6: Ver recomendaciones
```javascript
result.recommendations
```

---

## 🎯 COMANDOS ÚTILES ADICIONALES

### Ver todas las horas únicas
```javascript
new Set(window.salesData.map(s => s.hora))
```

### Contar registros por zona
```javascript
window.COUNTIF(window.salesData, 'zona', 'zona_hotelera')
```

### Contar exitosos totales
```javascript
window.COUNTIF(window.salesData, 'result', 'successful')
```

### Ver distribución en tabla
```javascript
const r = window.salesData.reduce((acc, s) => {
  const h = s.hora.split(':')[0];
  acc[h] = (acc[h] || 0) + 1;
  return acc;
}, {});
console.table(r);
```

### Validar formato de horas (todos deben tener ✅)
```javascript
window.salesData.slice(0, 20).forEach((s, i) => {
  const valid = /^\d{2}:\d{2}$/.test(s.hora);
  console.log(`${i+1}. ${s.hora} - ${valid ? '✅' : '❌'}`);
});
```

### Generar reporte rápido
```javascript
const total = window.salesData.length;
const successful = window.salesData.filter(s => s.result === 'successful').length;
const failed = window.salesData.filter(s => s.result === 'failed').length;
console.log(`Reporte Rápido:\nTotal: ${total}\nÉxito: ${successful} (${((successful/total)*100).toFixed(2)}%)\nFallo: ${failed} (${((failed/total)*100).toFixed(2)}%)`);
```

---

## ✅ CHECKLIST DE VALIDACIÓN

Ejecuta en orden y verifica cada resultado:

- [ ] TEST 1: hora !== "00:00" ✅
- [ ] TEST 2: porcentajeVálidas > 90% ✅
- [ ] TEST 3: hourDistribution tiene múltiples horas ✅
- [ ] TEST 4: Se generan recomendaciones ✅
- [ ] Paso 5: stats contiene datos ✅
- [ ] Paso 6: recommendations es string de 5+ líneas ✅

**Si todos están ✅, la implementación funciona correctamente.**

---

## 🆘 SI ALGO FALLA

### Error: "validateParsedData is not defined"
```javascript
// Recarga la página y espera a que cargue completamente
location.reload();
// Espera 5 segundos y reintentar
```

### Error: "Todas las horas son 00:00"
```javascript
// Verifica que tu CSV tenga columna "hora"
// Debe ser: hora, time, hour, tiempo o htime
// Y debe estar en formato HH:mm (ej: 14:30)
```

### Error en DeepSeek
```javascript
// Configura tu API key
localStorage.setItem('deepseekApiKey', 'tu-api-key-aqui');

// Verifica que sea válida
localStorage.getItem('deepseekApiKey')
```

### Si necesitas debug adicional
```javascript
// Ver objetos completos
console.log(window.salesData);
console.log(window.validateParsedData);
console.log(window.generateDailyRecommendationsWithDeepSeek);
```

---

**Listo para copiar y pegar en consola!** 🚀

**Localización:** F12 → Pestaña Console → Copiar/Pegar
