# 🚀 Guía de Implementación: Sistema Completo de Análisis CSV

**Estado**: ✅ Sistema implementado y listo para pruebas
**Última actualización**: Enero 9, 2026

---

## 📋 Resumen de Cambios Implementados

### 1. ✅ Cadena de CSV Completa (COMPLETA)
- **Entrada**: `handleFiles()` - Detecta y lee archivos CSV  
- **Procesamiento**: `processData()` - Normaliza headers y valores  
- **FieldMapper**: Mapea variantes (ES/EN/acentos) automáticamente  
- **Salida**: `window.salesData` - Array de registros normalizados

### 2. ✅ Sincronización Automática  
- Después de cargar CSV → Se llama `syncCapturedDataWithAnalytics()`
- Análisis se actualiza automáticamente con nuevos datos
- Filtros se populan dinámicamente al abrir "Análisis Cruzado"

### 3. ✅ Funciones de Debugging Agregadas
- `window.debugCSVData()` - Diagnostica estado de datos
- `window.testLoadSampleData()` - Carga datos de prueba localmente

---

## 🧪 PRUEBAS PASO A PASO

### **PASO 1: Verificar Carga Inicial**

1. Abre el navegador (F12 para DevTools)
2. En la consola, ejecuta:
```javascript
window.debugCSVData()
```

**Resultado esperado:**
```
🔍 ===== DIAGNÓSTICO DE DATOS CSV =====
1️⃣ window.salesData: undefined
2️⃣ window.filteredData: undefined
FieldMapper disponible: true
CurrentAnalyzer disponible: false
```
(Esto es normal - no hay datos todavía)

---

### **PASO 2: Prueba con Datos de Muestra (SIN CSV)**

1. En la consola, ejecuta:
```javascript
window.testLoadSampleData()
```

**Resultado esperado:**
```
📝 Cargando datos de prueba...
✅ 5 registros de prueba cargados
🔍 ===== DIAGNÓSTICO DE DATOS CSV =====
1️⃣ window.salesData: 5 registros
2️⃣ window.filteredData: 5 registros
3️⃣ Primer registro: {zona: 'zona_hotelera', pitchType: 'autoridad', ...}
4️⃣ Zonas encontradas: ['zona_hotelera', 'centro', 'region_237', 'sm_77', 'sm_91']
5️⃣ Pitch types encontrados: ['autoridad', 'nostalgia', 'escasez', 'comunidad']
6️⃣ Resultados encontrados: ['successful', 'failed']
✅ Todos los registros normalizados correctamente
FieldMapper disponible: true
CurrentAnalyzer disponible: true
✅ Análisis iniciado
```

**Si ves esto**: ✅ Sistema funcionando correctamente

---

### **PASO 3: Cargar CSV Real**

#### **Opción A: Usar plantilla**

1. Descarga [data/PLANTILLA_CSV_ESTANDAR.csv](data/PLANTILLA_CSV_ESTANDAR.csv)
2. En la app, haz clic en "Cargar Archivo CSV"
3. Selecciona el archivo

#### **Opción B: Crear tu propio CSV**

Campos **REQUERIDOS** (mínimo):
```
zona,timestamp,pitchType,result
zona_hotelera,2026-01-10T14:30:00Z,autoridad,successful
centro,2026-01-10T10:15:00Z,nostalgia,failed
```

Campos **OPCIONALES** (para análisis demográfico):
```
age,occupation,income,clientOrigin,amount,latitude,longitude
36-45,profesional,alto,CDMX,450,21.135,-86.745
26-35,vendedor,medio,Cancun_Local,0,21.161,-86.851
```

---

### **PASO 4: Verificar Carga CSV Real**

1. En DevTools → Consola, ejecuta:
```javascript
window.debugCSVData()
```

**Resultado esperado:**
```
1️⃣ window.salesData: X registros
4️⃣ Zonas encontradas: ['zona_hotelera', 'centro', ...]
5️⃣ Pitch types encontrados: ['autoridad', 'nostalgia', ...]
✅ Todos los registros normalizados correctamente
```

---

### **PASO 5: Verificar Filtros en "Análisis Cruzado"**

1. Navega a **"Análisis Cruzado"** tab
2. Busca la sección **"Demográfico × Pitch × Zona"**
3. Abre el dropdown **"Zona"**

**Resultado esperado:**
```
- Todas
- zona_hotelera ✅
- centro ✅
- region_237 ✅
- sm_77 ✅
- sm_91 ✅
```

**Si ves "unknown"**: 🔴 Hay un problema de normalización

---

### **PASO 6: Troubleshooting - Si ves "unknown"**

#### **Problema: "unknown" aparece en filtros**

1. En consola, ejecuta:
```javascript
// Ver qué zonas tiene cada registro
window.salesData.forEach(r => {
  if (r.zona === 'unknown') {
    console.log('❌ UNKNOWN ZONA:', r._rawData);
  }
});
```

2. Mira qué valor original tenía:
```
❌ UNKNOWN ZONA: {zona: 'hotelera', ...}  // Falta el prefijo 'zona_'
```

3. **Solución**: Agregar variante a fieldMapper.js:
```javascript
// En utils/fieldMapper.js, agregar a zoneMap:
'hotelera': 'zona_hotelera',  // Ahora también acepta 'hotelera'
```

---

### **PASO 7: Verificar que todo funciona**

1. **Dashboard**: Debe mostrar datos en gráficos
2. **Mapa**: Debe mostrar puntos con colores por zona
3. **Análisis**: Filtros funcionan correctamente
4. **Cross-dimensional**: Matriz muestra conversiones por zona×pitch

---

## 🔧 Funciones Disponibles en Consola

### **Debugging**
```javascript
// Ver estado completo de datos
window.debugCSVData()

// Ver lista de zonas detectadas
const zonas = [...new Set(window.salesData.map(r => r.zona))];
console.log('Zonas:', zonas);

// Ver registros con "unknown"
const unknowns = window.salesData.filter(r => r.zona === 'unknown' || r.pitchType === 'unknown' || r.result === 'unknown');
console.log('Registros con unknown:', unknowns);

// Ver registro específico
window.salesData[0]

// Ver todos los registros
window.salesData.forEach((r, i) => console.log(`[${i}]`, r));
```

### **Test**
```javascript
// Cargar datos de prueba
window.testLoadSampleData()

// Recargar análisis
if (typeof initCompleteAnalysis === 'function') initCompleteAnalysis();

// Sincronizar datos capturados
syncCapturedDataWithAnalytics()
```

---

## 📊 Estructura de Datos Esperada

### **Entrada (CSV)**
```csv
zona,timestamp,pitchType,result,clientOrigin,age,occupation,income,amount,latitude,longitude
zona_hotelera,2026-01-10T14:30:00Z,autoridad,successful,CDMX,36-45,profesional,alto,450,21.135,-86.745
```

### **Salida (window.salesData)**
```javascript
{
  zona: "zona_hotelera",
  pitchType: "autoridad",
  result: "successful",
  clientOrigin: "CDMX",
  age: "36-45",
  occupation: "profesional",
  income: "alto",
  lat: 21.135,
  lng: -86.745,
  monto: 450,
  fecha: Date,
  id: 0,
  cliente: "Cliente1",
  hora: "14:30",
  _rawData: {...}  // Original sin normalizar
}
```

---

## ⚙️ Configuración de FieldMapper

**Ubicación**: `utils/fieldMapper.js`

**Variantes Soportadas**:

| Campo | Variantes Aceptadas |
|-------|-----------------|
| **zona** | zona, zone, region, area, hotelera, hotel, turismo, centro, region_237, region_233, sm_77, sm_91 |
| **pitchType** | pitch_type, pitchtype, tipo_pitch, autoridad, authority, expert, nostalgia, escasez, scarcity, comunidad, community |
| **result** | result, resultado, estado, status, successful, failed, pending, exitoso, fallido |
| **clientOrigin** | clientorigin, client_origin, origin, origen, CDMX, Cancun, Quintana_Roo, Internacional |
| **income** | income, ingreso, alto, medio, bajo |
| **age** | age, edad, 25, 36-45, etc. |

---

## 🚨 Checklist de Validación Final

- [ ] CSV se carga sin errores
- [ ] `window.salesData` tiene registros
- [ ] `window.debugCSVData()` muestra datos correctos
- [ ] No hay "unknown" values en zonas/pitchType/result
- [ ] Filtros en "Análisis Cruzado" muestran valores reales
- [ ] Dashboard/Mapa/Charts se actualizan con datos
- [ ] Análisis demográfico funciona (si hay campos de edad/ocupación/ingreso)
- [ ] Datos capturados manualmente se sincronizan con análisis

---

## 📞 Si Algo No Funciona

### **Script para diagnóstico completo**
```javascript
console.log('=== DIAGNÓSTICO COMPLETO ===');
console.log('1. CSV Data:', window.salesData ? window.salesData.length + ' records' : 'NO LOADED');
console.log('2. Filtered Data:', window.filteredData ? window.filteredData.length + ' records' : 'NO LOADED');
console.log('3. FieldMapper:', typeof window.FieldMapper);
console.log('4. CurrentAnalyzer:', typeof window.currentAnalyzer);

if (window.salesData) {
  const zonas = [...new Set(window.salesData.map(r => r.zona))];
  console.log('5. Unique Zonas:', zonas);
  
  const problematic = window.salesData.filter(r => r.zona === 'unknown' || r.pitchType === 'unknown' || r.result === 'unknown');
  if (problematic.length > 0) {
    console.warn(`6. PROBLEMS: ${problematic.length} records with 'unknown'`);
    problematic.forEach(r => console.warn(r._rawData));
  }
}
```

Comparte el output de consola si tienes problemas.

---

## 📁 Archivos Modificados

- ✅ **index.html** - Agregadas funciones `debugCSVData()` y `testLoadSampleData()`
- ✅ **utils/fieldMapper.js** - Ya existente, con normalización completa
- ✅ **data/PLANTILLA_CSV_ESTANDAR.csv** - Plantilla de referencia

---

## 🎯 Próximos Pasos

1. **Prueba con datos reales** - Carga tu CSV y verifica
2. **Si ves "unknown"** - Ejecuta `window.debugCSVData()` y comparte output
3. **Una vez funcionando** - Ejecuta todos los análisis en "Análisis Cruzado"

---

**¡El sistema está listo para usar! 🚀**

Pruébalo con `window.testLoadSampleData()` y verifícalo con `window.debugCSVData()`.
