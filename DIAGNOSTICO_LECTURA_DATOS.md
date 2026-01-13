## 🔍 DIAGNÓSTICO PROFUNDO - Lectura de Datos CSV

### PROBLEMA REPORTADO
"No está leyendo bien las entradas de los datos para calcular la información"

### ROOT CAUSE ANALYSIS

Después de analizar el código, he identificado **MÚLTIPLES PROBLEMAS** en cómo se leen y calculan los datos:

---

## 1️⃣ PROBLEMA PRINCIPAL: BÚSQUEDA DE COLUMNAS FALLIDA

**Ubicación:** Líneas 3036-3044

**Código actual:**
```javascript
const amountKey = keys.find(k => k.toLowerCase().includes('monto') || k.toLowerCase().includes('amount'));
const dateKey = keys.find(k => k.toLowerCase().includes('fecha') || k.toLowerCase().includes('date'));
const timeKey = keys.find(k => k.toLowerCase().includes('hora') || k.toLowerCase().includes('time'));
const clienteKey = keys.find(k => k.toLowerCase().includes('cliente') || k.toLowerCase().includes('client'));
const zonaKey = keys.find(k => k.toLowerCase().includes('zona') || k.toLowerCase().includes('region'));
```

**Problema:**
- Si el CSV tiene header `"amount"` (inglés), busca `k.toLowerCase().includes('monto')` (español) PRIMERO
- Si `"amount"` no contiene "monto", continúa
- Si `"amount"` contiene "amount", la encuentra ✅
- PERO: Esta búsqueda es **ineficiente y frágil**

**Ejemplo fallido:**
```
CSV header: "Amount"
k.toLowerCase() = "amount"
k.toLowerCase().includes('monto') = false → continúa
k.toLowerCase().includes('amount') = true → encuentra ✅

CSV header: "Monto"  
k.toLowerCase() = "monto"
k.toLowerCase().includes('monto') = true → encuentra ✅

CSV header: "MONTO O VALOR"
k.toLowerCase() = "monto o valor"
k.toLowerCase().includes('monto') = true → encuentra ✅

PERO SI TIENE: "salesperson_value"
k.toLowerCase() = "salesperson_value"
k.toLowerCase().includes('monto') = false → continúa
k.toLowerCase().includes('amount') = false → no encuentra ❌
amountKey = undefined
row[undefined] = undefined ❌
monto = NaN
```

---

## 2️⃣ PROBLEMA SECUNDARIO: ORDER OF OPERATIONS

**Ubicación:** Líneas 3055-3065

**Código actual:**
```javascript
// Parsear monto
let monto = parseFloat(row[amountKey] || normalizedRow['amount']);
if (isNaN(monto) || monto <= 0) {
  monto = 100 + Math.random() * 900; // Valor aleatorio si no hay
}
```

**Problema:**
- Si `amountKey` es `undefined`, entonces `row[undefined]` es `undefined`
- Intenta `normalizedRow['amount']`
- PERO: Si `amountKey` ENCONTRÓ LA COLUMNA, pero con un nombre diferente (ej: "monto"), entonces buscará:
  - `row["monto"]` ✅ (encontrará)
  - Nunca llegará a `normalizedRow['amount']` porque `row["monto"]` existe

**LA TRAMPA:** Si `row[amountKey]` tiene valor (aunque sea "0"), NO CAERÁ EN EL IF isNaN porque:
```javascript
let monto = parseFloat(row[amountKey] || normalizedRow['amount']);
// Si row[amountKey] = "0", parseFloat("0") = 0
// 0 <= 0 es TRUE
// ENTONCES: monto = 100 + Math.random() * 900  ← REEMPLAZA CON ALEATORIO! ❌
```

**¡ESTE ES UN BUG CRÍTICO!** Si el CSV tiene valor "0" para monto, lo reemplaza con un número aleatorio.

---

## 3️⃣ PROBLEMA TERCIARIO: FECHAS NO SE LEEN BIEN

**Ubicación:** Línea 3063

**Código actual:**
```javascript
const fecha = row[dateKey] || normalizedRow['timestamp'] || new Date().toISOString().split('T')[0];
```

**Problema:**
- Si `dateKey` es `undefined`, busca `row[undefined]` ❌
- Si `dateKey` es encontrada pero el CSV tiene formato diferente al esperado, falla
- Luego intenta `normalizedRow['timestamp']` 
- Si ambos fallan, crea UNA FECHA DE HOY para TODOS los registros sin timestamp

**Resultado:** Todos los datos históricos pierden su fecha original y se reemplazan con HOY ❌

---

## 4️⃣ PROBLEMA CUATERNARIO: NORMALIZEDROW NO SE USA

**Ubicación:** Lines 3024-3032

**Código actual:**
```javascript
if (normalizedRow['amount']) {
  normalizedRow['amount'] = window.FieldMapper.VALUE_NORMALIZERS.amount(normalizedRow['amount']);
}
```

**Problema:**
- Normaliza el amount en `normalizedRow['amount']`
- PERO luego NUNCA lo usa porque la línea 3055 hace:
  ```javascript
  let monto = parseFloat(row[amountKey] || normalizedRow['amount']);
  ```
- Si `row[amountKey]` existe (aunque sea inválido), nunca usa `normalizedRow['amount']`

---

## 5️⃣ PROBLEMA QUINTO: COORDINATE DETECTION PUEDE FALLAR

**Ubicación:** Línea 3045-3050

**Código actual:**
```javascript
let lat = parseFloat(normalizedRow['latitude'] || normalizedRow['lat'] || row[latKey]);
let lng = parseFloat(normalizedRow['longitude'] || normalizedRow['lng'] || row[lngKey]);

if (isNaN(lat) || isNaN(lng)) {
  // Generar coordenadas aleatorias para Cancún si no hay
  lat = 21.1619 + (Math.random() - 0.5) * 0.1;
  lng = -86.8515 + (Math.random() - 0.5) * 0.1;
}
```

**Problema:**
- Si CSV no tiene lat/lng, genera COORDENADAS ALEATORIAS
- Esto es OK como fallback, pero significa que TODO se plotea en una zona aleatoria cerca de Cancún
- Los "puntos" no representan ubicaciones reales

---

## RESUMEN DE BUGS

| # | Bug | Impacto | Severidad |
|---|-----|---------|-----------|
| 1 | Búsqueda de columnas frágil | Puede no encontrar "amount", "amount", "monto" | 🔴 CRÍTICO |
| 2 | Reemplaza monto=0 con aleatorio | Datos incorrectos, cálculos falsos | 🔴 CRÍTICO |
| 3 | Fechas reemplazadas con HOY | Pérdida de datos históricos | 🔴 CRÍTICO |
| 4 | normalizedRow no se usa | Normalización ignorada | 🟠 ALTO |
| 5 | Coordenadas aleatorias | Datos de ubicación incorrectos | 🟠 ALTO |

---

## ✅ CÓMO ARREGLARLO

### FIX #1: Orden de búsqueda de columnas

**ANTES:**
```javascript
const amountKey = keys.find(k => k.toLowerCase().includes('monto') || k.toLowerCase().includes('amount'));
```

**DESPUÉS:**
```javascript
// Buscar amount PRIMERO en normalizedRow (ya está mapeado), luego en row original
const amountKey = keys.find(k => 
  k.toLowerCase().includes('amount') || 
  k.toLowerCase().includes('monto') ||
  k.toLowerCase().includes('valor') ||
  k.toLowerCase().includes('venta')
);
```

### FIX #2: Lógica de lectura de monto

**ANTES:**
```javascript
let monto = parseFloat(row[amountKey] || normalizedRow['amount']);
if (isNaN(monto) || monto <= 0) {
  monto = 100 + Math.random() * 900; // Reemplaza 0 con aleatorio ❌
}
```

**DESPUÉS:**
```javascript
// Preferir SIEMPRE normalizedRow que ya fue validado, luego fallback a row
let monto = 0;

// Orden de preferencia: normalizedRow > row > default
if (normalizedRow['amount'] !== undefined && normalizedRow['amount'] !== '') {
  monto = parseFloat(normalizedRow['amount']);
} else if (amountKey && row[amountKey] !== undefined && row[amountKey] !== '') {
  monto = parseFloat(row[amountKey]);
} else {
  monto = 0;  // Usa 0 si no hay dato, NO lo reemplaces con aleatorio
}

// SOLO SI ES NaN (no es un número), usar fallback
if (isNaN(monto)) {
  monto = 0;  // Default es 0, no 100-900 aleatorio
}

// NOTA: Mantener 0 como valor válido (no reemplazar si <= 0)
```

### FIX #3: Lectura de fechas

**ANTES:**
```javascript
const fecha = row[dateKey] || normalizedRow['timestamp'] || new Date().toISOString().split('T')[0];
```

**DESPUÉS:**
```javascript
// Preferir normalizedRow > row > default
let fecha = '';

if (normalizedRow['timestamp'] && normalizedRow['timestamp'] !== '') {
  fecha = normalizedRow['timestamp'];
} else if (dateKey && row[dateKey] && row[dateKey] !== '') {
  fecha = row[dateKey];
} else {
  fecha = new Date().toISOString().split('T')[0];  // Solo si realmente no hay nada
}

// Validar que sea una fecha válida
try {
  new Date(fecha);  // Lanza error si fecha inválida
} catch (e) {
  fecha = new Date().toISOString().split('T')[0];
}
```

### FIX #4: Usar normalizedRow siempre que sea posible

**AHORA:**
```javascript
// En lugar de buscar en 'row', buscar PRIMERO en normalizedRow normalizado
const parseFieldWithFallback = (fieldName, row, normalizedRow) => {
  // Preferencia: 1) normalizedRow, 2) row, 3) undefined
  if (normalizedRow[fieldName] !== undefined && normalizedRow[fieldName] !== '') {
    return normalizedRow[fieldName];
  }
  if (row[fieldName] !== undefined && row[fieldName] !== '') {
    return row[fieldName];
  }
  return undefined;
};

// Usar para todos los campos:
let monto = parseFloat(parseFieldWithFallback('amount', row, normalizedRow)) || 0;
let fecha = parseFieldWithFallback('timestamp', row, normalizedRow) || new Date().toISOString().split('T')[0];
let cliente = parseFieldWithFallback('client_name', row, normalizedRow) || `Cliente${index + 1}`;
```

---

## DIAGRAMA: FLUJO ACTUAL vs FLUJO CORRECTO

### ACTUAL (❌ INCORRECTO):
```
CSV: {amount: "450", timestamp: "2026-01-10", ...}
  ↓
Papa.parse() → row = {amount: "450", timestamp: "2026-01-10"}
  ↓
headerMap = {amount: "amount"}  (No está mapeado a "amount")
  ↓
normalizedRow = {amount: "450"}
  ↓
parseFloat(row[amountKey]) 
  ↓
Busca row["amount"] → "450" ✅
  ↓
parseFloat("450") = 450
  ↓
450 <= 0? NO
  ✅ monto = 450

PERO SI TUVIERA CERO:
parseFloat(row["0"]) = 0
0 <= 0? YES  
monto = 100 + Math.random() * 900  ❌ REEMPLAZA CON ALEATORIO
```

### CORRECTO (✅):
```
CSV: {amount: "450", timestamp: "2026-01-10", ...}
  ↓
Papa.parse() → row = {amount: "450", timestamp: "2026-01-10"}
  ↓
headerMap crea normalizedRow = {amount: "450"}
  ↓
Preferencia: ¿normalizedRow['amount']? = "450" ✅
  ↓
parseFloat("450") = 450
  ✅ monto = 450

SI TUVIERA CERO:
Preferencia: ¿normalizedRow['amount']? = "0" ✅
  ↓
parseFloat("0") = 0
  ✅ monto = 0  (Mantiene el 0 como valor válido)
```

---

## RECOMENDACIÓN

**Hay 5 bugs que necesitan ser arreglados:**
1. Búsqueda de columnas debe ser más robusta
2. La lógica de monto=0 está reemplazando con aleatorio
3. Fechas se pierden si no se encuentran
4. normalizedRow no se usa primero
5. Coordenadas aleatorias hacen que datos sean inexactos

Estos arreglos son CRÍTICOS porque afectan:
- ✓ Cálculos de ventas totales
- ✓ Promedios y estadísticas
- ✓ Análisis histórico (fechas)
- ✓ Ubicación de puntos en mapa

**¿Quieres que aplique estos 5 fixes ahora?**
