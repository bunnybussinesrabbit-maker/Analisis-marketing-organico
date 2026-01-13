# 🔧 DEBUGGING: ¿Por qué 5 registros tienen "unknown"?

## 📊 Mejoras Implementadas

He mejorado significativamente el debugging en `processData()` para que **identifiques exactamente cuál es el problema**. Ahora verás:

### ✅ **Nivel 1: Mapeo de Headers**
```javascript
📝 Header map recibido: {
  "zona": "zone",
  "pitch_type": "pitchType",
  "resultado": "result",
  ...
}
```

### ✅ **Nivel 2: Normalización por Fila**
```javascript
Fila 1 normalizada: {
  zone: "zona_hotelera",
  pitchType: "autoridad",
  result: "successful",
  ...
}
✅ pitchType: "autoridad" → "autoridad"
✅ result: "exitoso" → "successful"
✅ zone: "zona_hotelera" → "zona_hotelera"
```

### ✅ **Nivel 3: Registros Problemáticos**
```javascript
🔴 ERROR: 5 registros NO se normalizaron correctamente:

  Fila CSV #1:
    Datos originales: { zona: "Zona Hotelera", pitch_type: "Autoridad", ... }
    Datos después de mapeo: { zone: "Zona Hotelera", pitchType: "Autoridad", ... }
    Problemas encontrados: zona, pitchType
```

### ✅ **Nivel 4: Detalles de "unknown"**
```javascript
⚠️ 5 registros tienen valores "unknown"
📋 DETALLE:
  Registro #1:
    zona: ❌ unknown (pero debería ser: "Zona Hotelera")
    pitchType: ❌ unknown (pero debería ser: "Autoridad")
    Datos originales: { zona: "Zona Hotelera", pitch_type: "Autoridad", ... }
```

---

## 🎯 AHORA CARGA TU CSV Y SIGUE ESTOS PASOS:

### PASO 1: Abre DevTools
```
Presiona: F12
Ve a: Console
```

### PASO 2: Carga el CSV
```
En la app: Importar Datos → Selecciona tu CSV
```

### PASO 3: Mira los Logs

**Busca los 4 niveles de debugging:**

1. **¿Detectó los headers correctamente?**
   ```
   📝 Header map recibido: {...}
   ```
   Si aquí ves `pitchtype: null`, el problema es que `pitch_type` no se mapeó a `pitchType`

2. **¿Normalizó los valores por fila?**
   ```
   Fila 1 normalizada:
   ✅ pitchType: "autoridad" → "autoridad"
   ```
   Si aquí NO aparece (o aparece ❌), el valor original no se normalizó

3. **¿Qué registros tienen problemas?**
   ```
   🔴 ERROR: 5 registros NO se normalizaron correctamente
   ```
   Expande esto para ver EXACTAMENTE qué valores originales causaron problema

4. **¿Cuáles son los valores de "unknown"?**
   ```
   ⚠️ 5 registros tienen valores "unknown"
   📋 DETALLE: [lista completa con datos originales]
   ```

---

## 🔴 ESCENARIOS POSIBLES

### Escenario A: Headers no se mapean

**Síntomas:**
```
📝 Header map: { pitch_type: null, resultado: null }
```

**Causa:** Los headers del CSV no coinciden con lo que espera FieldMapper

**Solución:** En console, ejecuta:
```javascript
// Ver los headers originales del CSV
console.log('Headers del CSV:', Object.keys(window.salesData[0]));
```

Luego actualiza `FIELD_MAP` en `fieldMapper.js` con esas claves.

---

### Escenario B: Valores no se normalizan

**Síntomas:**
```
Fila 1 normalizada:
  ❌ pitchType permanece como "AUTORIDAD" (NO se normaliza a "autoridad")
```

**Causa:** El `VALUE_NORMALIZER` para `pitchType` no reconoce ese valor

**Solución:** En console, ejecuta:
```javascript
// Ver el valor original que falla
const problematico = window.salesData.find(r => r.pitchType === 'unknown');
console.log('Valor que falla:', problematico._rawData);
```

Luego actualiza el normalizador en `fieldMapper.js` VALUE_NORMALIZERS.pitchType para incluir esa variante.

---

### Escenario C: Zona se calcula automáticamente

**Síntomas:**
```
zona: 'centro' (aunque en el CSV decía "Zona Hotelera")
```

**Causa:** El CSV no tiene columna `zona` y se usa `determineZone(lat, lng)`

**Solución:** Asegúrate que tu CSV tiene columna `zona` o `zone`

---

## 📋 GUÍA PASO A PASO PARA DIAGNOSTICAR

### 1. VER TODOS LOS LOGS EN ORDEN:

En DevTools, copia y pega:
```javascript
// Limpia logs previos
console.clear();

// Recarga datos
console.log('🔍 DIAGNÓSTICO COMPLETO:\n');

// 1. Headers detectados
console.log('1️⃣ HEADERS:');
window.salesData && Object.keys(window.salesData[0]).forEach(h => console.log(`   - "${h}"`));

// 2. Valores únicos por campo clave
console.log('\n2️⃣ VALORES ÚNICOS:');
console.log('   Zonas:', [...new Set(window.salesData.map(r => r.zona))]);
console.log('   PitchTypes:', [...new Set(window.salesData.map(r => r.pitchType))]);
console.log('   Results:', [...new Set(window.salesData.map(r => r.result))]);

// 3. Registros con "unknown"
console.log('\n3️⃣ REGISTROS CON "unknown":');
window.salesData.filter(r => 
  r.zona === 'unknown' || r.pitchType === 'unknown' || r.result === 'unknown'
).forEach((r, i) => {
  console.log(`   Registro ${i + 1}:`, {
    zona: r.zona,
    pitchType: r.pitchType,
    result: r.result,
    originalData: r._rawData
  });
});

// 4. Ver si problemRecords fue capturado
console.log('\n4️⃣ PROBLEM RECORDS:', window.problemRecords || 'No disponible');
```

### 2. COMPARTIR RESULTADO:

Copia los logs y comparte conmigo para que identifique qué normalizar.

---

## 💡 CHECKLIST DE DEBUGGING

- [ ] ¿Aparecen logs de "Fila X normalizada"?
- [ ] ¿Dice "ERROR: 5 registros NO se normalizaron"?
- [ ] ¿Mostramos los "Datos originales" de cada uno?
- [ ] ¿Qué variantes no reconoce FieldMapper?
- [ ] ¿Hay datos vacíos en el CSV?
- [ ] ¿Los headers del CSV coinciden con los esperados?

---

## 🚀 PRÓXIMO PASO

**Carga tu CSV y comparte conmigo:**

1. Screenshot de DevTools Console
2. Los 4 niveles de logging que aparecen
3. Especialmente: Los "Datos originales" de registros con "unknown"

Con eso, voy a actualizar `fieldMapper.js` para que reconozca esas variantes. ✨
