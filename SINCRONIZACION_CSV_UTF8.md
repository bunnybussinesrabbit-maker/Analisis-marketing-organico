# 🔧 Sincronización CSV: Columnas + UTF-8 - Guía Completa

## ✅ Cambios Implementados

Tu CSV con estas columnas:
```
timestamp | zona | cliente | origen | tipo_pitch | resultado | monto | latitud | longitud
```

Ahora se mapea **correctamente** a:

| Tu Columna | Mapeo Interno | Uso en Análisis |
|-----------|--------------|-----------------|
| `timestamp` | `timestamp` | Análisis temporal |
| `zona` | `zona` | Análisis por zona |
| `cliente` | `cliente` | Identificación |
| `origen` | `clientOrigin` | Análisis por origen |
| `tipo_pitch` | `pitchType` | Análisis de pitch |
| `resultado` | `result` | Conversión |
| `monto` | `monto` | Ingresos |
| `latitud` | `lat` | Geolocalización |
| `longitud` | `lng` | Geolocalización |

---

## 🔤 Corrección UTF-8

### Problema Original:
```
MarÃ­a LÃ³pez  ❌ (corrupto)
```

### Solución Implementada:
Función `sanitizeUTF8()` que corrige **automáticamente**:

```javascript
MarÃ­a LÃ³pez  →  María López  ✅
```

**Se aplica a:**
- Cliente
- Zona
- Tipo de pitch
- Origen
- Resultado
- Fecha

---

## 🧪 Cómo Verificar

### Paso 1: Carga tu CSV

1. Abre `index.html`
2. Carga tu CSV con las columnas: `timestamp, zona, cliente, origen, tipo_pitch, resultado, monto, latitud, longitud`
3. Espera a que aparezca "N registros cargados" ✅

### Paso 2: Verifica en Consola (F12)

Abre DevTools (F12) y ejecuta:

```javascript
verifySyncData()
```

**Resultado esperado:**
```
✅ VERIFICACIÓN DE SINCRONIZACIÓN DE DATOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 TOTAL REGISTROS: 50

📋 CAMPOS REQUERIDOS:
   ✅ zona: zona_hotelera
   ✅ timestamp: 2026-01-10T14:30:00.000Z
   ✅ pitchType: authority
   ✅ result: successful
   ✅ cliente: María López
   ✅ clientOrigin: CDMX
   ✅ monto: 250
   ✅ fechaStr: 2026-01-10

🔤 VERIFICACIÓN UTF-8:
   ✅ Todos los caracteres UTF-8 están limpios

⚠️ VERIFICACIÓN DE "UNKNOWN":
   ✅ No hay valores "unknown"

🔗 MAPEO DE COLUMNAS:
   zona: zona_hotelera, centro, region_237
   pitchType: autoridad, nostalgia, escasez, comunidad
   result: successful, failed, pending
   clientOrigin: CDMX, Cancun_Local, Quintana_Roo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ SINCRONIZACIÓN COMPLETADA
```

---

## 📊 Nuevos Comandos en Consola

### `verifySyncData()`
Valida sincronización completa de datos y UTF-8

```javascript
verifySyncData()
```

**Retorna:**
- ✅ Campos requeridos presentes
- ✅ Limpieza UTF-8
- ✅ Ausencia de "unknown"
- ✅ Mapeo de columnas

---

### `showDataSample(n)`
Muestra primeros N registros procesados (default 3)

```javascript
// Ver 3 primeros registros
showDataSample()

// Ver 10 registros
showDataSample(10)
```

**Output:**
```
📊 MUESTRA DE DATOS PROCESADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔹 Registro 1:
{
  zona: "zona_hotelera"
  timestamp: "2026-01-10T14:30:00.000Z"
  cliente: "María López"
  pitchType: "autoridad"
  result: "successful"
  monto: 250
  ...
}
```

---

## 🔍 Análisis Cruzados Ahora Funcionan

Ahora puedes usar todos los análisis cruzados con tus columnas:

### Análisis por Pitch
```javascript
window.analyzePitchEffectiveness()
```

Retorna:
```javascript
{
  "autoridad": {
    total: 15,
    successful: 10,
    conversionRate: 66.7%,
    totalRevenue: 3500
  },
  "nostalgia": { ... },
  "escasez": { ... },
  "comunidad": { ... }
}
```

### Análisis por Origen
```javascript
window.analyzeOriginEffectiveness()
```

Retorna:
```javascript
{
  "CDMX": {
    total: 20,
    successful: 14,
    conversionRate: 70%,
    totalRevenue: 5200
  },
  "Cancun_Local": { ... },
  ...
}
```

### Análisis Pitch × Zona
```javascript
window.analyzePitchByZone()
```

Retorna:
```javascript
{
  "zona_hotelera": {
    "autoridad": { total: 8, successful: 6, revenue: 2400 },
    "nostalgia": { ... },
    ...
  },
  "centro": { ... },
  ...
}
```

### Análisis Pitch × Origen
```javascript
window.analyzePitchByOrigin()
```

Retorna:
```javascript
{
  "CDMX": {
    "autoridad": { total: 8, successful: 6, revenue: 1800 },
    "nostalgia": { ... },
    ...
  },
  "Cancun_Local": { ... },
  ...
}
```

---

## 🎯 Flujo de Trabajo Recomendado

### 1️⃣ Carga el CSV
```
index.html → [Drag & Drop CSV] → "50 registros cargados" ✅
```

### 2️⃣ Verifica sincronización
```javascript
verifySyncData()
// Espera: ✅ SINCRONIZACIÓN COMPLETADA
```

### 3️⃣ Ve muestra de datos
```javascript
showDataSample(5)
// Verifica que María López aparece correctamente (no MarÃ­a LÃ³pez)
```

### 4️⃣ Ejecuta análisis cruzados
```javascript
window.analyzePitchEffectiveness()
window.analyzeOriginEffectiveness()
window.analyzePitchByZone()
window.analyzePitchByOrigin()
```

### 5️⃣ Usa en módulos de análisis
Los módulos de análisis avanzado ahora tienen acceso a datos correctamente mapeados

---

## 🛠️ Requisitos del CSV

Tu CSV debe tener:

**✅ Columnas Requeridas:**
- `timestamp` - Fecha/hora (ISO 8601 preferible)
- `zona` - Una de: `zona_hotelera`, `centro`, `region_237`, `region_233`, `sm_91`, `sm_77`
- `cliente` - Nombre de cliente
- `origen` - Una de: `CDMX`, `Cancun_Local`, `Quintana_Roo`, `Yucatan`, `International`, `Migrant`
- `tipo_pitch` - Una de: `autoridad`, `nostalgia`, `escasez`, `comunidad`
- `resultado` - Una de: `successful`, `failed`, `pending`
- `monto` - Número (cantidad en dinero)
- `latitud` - Número (coordenada)
- `longitud` - Número (coordenada)

**✅ Sin valores "unknown"**
**✅ Sin celdas vacías en campos críticos**
**✅ Encoding UTF-8 (se corrige automáticamente)**

---

## 📝 Ejemplo CSV Válido

```csv
timestamp,zona,cliente,origen,tipo_pitch,resultado,monto,latitud,longitud
2026-01-10T14:30:00,zona_hotelera,María López,CDMX,autoridad,successful,500,21.16,-86.85
2026-01-10T15:45:00,centro,Juan García,Cancun_Local,nostalgia,failed,0,21.17,-86.84
2026-01-10T16:20:00,region_237,Ana Martínez,Quintana_Roo,escasez,successful,350,21.15,-86.86
2026-01-10T09:00:00,sm_77,Carlos Rodríguez,CDMX,comunidad,successful,200,21.18,-86.82
```

**Nota:** Los caracteres acentuados (`á`, `é`, `í`, `ó`, `ú`, `ñ`) se preservan correctamente gracias a la sanitización UTF-8.

---

## 🧹 Limpieza Automática

El sistema ahora corrige automáticamente:

| Corrección | Ejemplo |
|-----------|---------|
| UTF-8 corrupto | `MarÃ­a` → `María` |
| Espacios extras | `  María  ` → `María` |
| Mayúsculas inconsistentes | Se normaliza según contexto |
| Caracteres especiales | Se preservan correctamente |

**NO necesitas pre-procesar el CSV - todo se hace automáticamente**

---

## ✨ Beneficios

✅ Columnas con tus nombres exactos (`tipo_pitch`, `resultado`, `origen`)  
✅ UTF-8 se corrige automáticamente  
✅ Análisis cruzados funcionan correctamente  
✅ Módulos de análisis tienen datos limpios  
✅ Sin necesidad de pre-procesamiento manual  
✅ Verificación integrada con `verifySyncData()`

---

## 📞 Testing

Para validar todo funciona:

```javascript
// 1. Cargar CSV
// 2. En consola ejecutar:
verifySyncData()

// 3. Debería retornar:
// ✅ SINCRONIZACIÓN COMPLETADA
```

---

**Versión:** 2026-01-12  
**Status:** ✅ Implementado y Listo
