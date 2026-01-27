# 🧪 Guía de Testing - DeepSeek Integration

**Última Actualización:** 27 Enero 2026  
**Status:** ✅ Ready for Testing  

---

## 📋 Testing Workflow

### Paso 1: Obtener API Key de DeepSeek
1. Ir a https://platform.deepseek.com
2. Crear cuenta / Login
3. Ir a API Keys
4. Generar nueva key (formato: `sk_...`)
5. Copiar key

### Paso 2: Configurar en Aplicación
1. Abrir http://localhost:8080
2. Click en ⚙️ **Configuración** (Settings)
3. Buscar "Clave API de DeepSeek"
4. Pegar API key en campo `apiKeyConfig`
5. Click "Guardar Configuración"
6. Verificar en Console: `deepseekApiKey` guardada en localStorage

**Verificación en DevTools:**
```javascript
// En Console:
localStorage.getItem('deepseekApiKey')
// Output: "sk_..." ✅
```

### Paso 3: Validar Conexión
```javascript
// En Console:
const coach = new DeepSeekSalesCoach();
await coach.validateConnection();
// Output: true ✅ o false ❌
```

### Paso 4: Testear Análisis API

#### Test 4.1: Top 5 Combinaciones
1. Cargar datos CSV (si no está cargado)
2. Ir a "Análisis de Efectividad" section
3. Dropdown: Seleccionar "Top 5 Combinaciones"
4. Click "Ejecutar Consulta"
5. **Verificar:** Panel flotante aparece bottom-right con datos

**Expected Output:**
```json
{
  "status": "success",
  "message": "Top 5 combinaciones más efectivas",
  "data": [
    {
      "pitchType": "escasez",
      "clientOrigin": "Zona Hotelera",
      "conversionRate": 85,
      "successful": 17,
      "total": 20
    },
    ...
  ]
}
```

#### Test 4.2: Recomendación por Origen
1. Dropdown: "Recomendación por Origen"
2. Campo aparece: "Selecciona Origen"
3. Seleccionar origen (ej: "CDMX")
4. Click "Ejecutar Consulta"
5. **Verificar:** Panel muestra mejor pitch para ese origen

**Expected Output:**
```json
{
  "status": "success",
  "origin": "CDMX",
  "recommendation": {
    "best": {
      "pitch": "autoridad",
      "conversionRate": 72,
      "successful": 8,
      "total": 11
    },
    "message": "Para CDMX: Usar 'autoridad' con 72% de éxito"
  }
}
```

#### Test 4.3: Análisis con DeepSeek IA
1. Dropdown: "Análisis con IA"
2. Campo aparece: "Ingresa pregunta"
3. **Ejemplos de preguntas:**
   - "¿Cuál es el mejor pitch para Zona Hotelera?"
   - "¿Por qué falla escasez en Centro?"
   - "¿Cómo mejorar conversiones en SM 77?"
   - "¿Qué perfil responde mejor a nostalgia?"
4. Click "Ejecutar Consulta"
5. **Verificar:** DeepSeek responde en panel flotante

**Expected Output:**
```json
{
  "status": "success",
  "question": "¿Cuál es el mejor pitch para Zona Hotelera?",
  "data": [...],
  "llmAnalysis": "Para Zona Hotelera, el pitch de 'autoridad' es más efectivo (58% conversión) porque los turistas de alto poder adquisitivo valoran la experticia certificada...",
  "provider": "deepseek",
  "timestamp": "2026-01-27T14:30:00.000Z"
}
```

### Paso 5: Testear Responsividad

#### Desktop (1920px)
```bash
1. Panel aparece en bottom-right
2. Ancho: ~420px
3. Altura máx: 600px con scrollbar
4. Distancia de bordes: 20px
```

#### Tablet (768px) 
```bash
1. Abrir DevTools: Ctrl+Shift+M
2. Emular iPad (768x1024)
3. Panel debe expandir a 80% ancho
4. Altura: 50% viewport
```

#### Mobile (375px)
```bash
1. Emular iPhone 12 (375x667)
2. Panel debe ocupar casi todo ancho
3. Altura: 50% viewport
4. Debe ser scrollable si hay mucho contenido
```

---

## 🔍 Debugging Checklist

### ✅ Panel Flotante Visible
**Si NO aparece:**
```javascript
// Check 1: CSS loaded
document.querySelector('#apiPanel').style.position
// Output: "fixed" ✅

// Check 2: Panel not hidden
document.querySelector('#apiPanel').classList.contains('hidden')
// Output: false ✅

// Check 3: Display not none
getComputedStyle(document.querySelector('#apiPanel')).display
// Output: "block" ✅
```

### ✅ DeepSeek API Key
**Si NO funciona:**
```javascript
// Check 1: Key almacenada
localStorage.getItem('deepseekApiKey')
// Output: "sk_..." ✅

// Check 2: Validar formato
const key = localStorage.getItem('deepseekApiKey');
key.startsWith('sk_')
// Output: true ✅

// Check 3: Length correcta
const key = localStorage.getItem('deepseekApiKey');
key.length > 20
// Output: true ✅
```

### ✅ DeepSeekSalesCoach Loaded
**Si error "not defined":**
```javascript
// Check: Clase cargada
typeof DeepSeekSalesCoach
// Output: "function" ✅

// Check: Script tag presente
document.querySelector('script[src="./utils/deepseek_coach.js"]')
// Output: <script...> ✅
```

### ✅ API.js Loaded
**Si métodos no encontrados:**
```javascript
// Check: AnalysisAPI disponible
typeof window.AnalysisAPI
// Output: "function" ✅

// Check: Método nuevo existe
typeof window.AnalysisAPI.analyzWithDeepSeek
// Output: "function" ✅
```

---

## 📊 Console Testing Commands

### Test completo de API
```javascript
// 1. Crear instancia
const coach = new DeepSeekSalesCoach();

// 2. Validar conexión
const connected = await coach.validateConnection();
console.log('Conexión:', connected);

// 3. Enviar prompt simple
const response = await coach.sendPrompt(
  "¿Cuáles son las mejores técnicas de venta?",
  { zone: 'zona_hotelera', currentHour: '14' }
);
console.log('Respuesta:', response);

// 4. Analizar estrategias
const strategies = await coach.analyzeStrategies('zona_hotelera', []);
console.log('Estrategias:', strategies);
```

### Test de API endpoint
```javascript
// 1. Test: Top 5
const top5 = await AnalysisAPI.handleRequest('/api/effectiveness/top');
console.log('Top 5:', top5);

// 2. Test: Recomendación
const rec = await AnalysisAPI.analyzWithDeepSeek({ question: "¿Mejor pitch?" });
console.log('Recomendación:', rec);

// 3. Test: Comparación
const comparison = await AnalysisAPI.handleRequest(
  '/api/effectiveness/compare',
  'POST',
  { pitch1: 'autoridad', origin1: 'CDMX', pitch2: 'escasez', origin2: 'CDMX' }
);
console.log('Comparación:', comparison);
```

---

## ⚠️ Errores Comunes & Soluciones

### Error 1: "DeepSeekSalesCoach is not defined"
**Causa:** Script `deepseek_coach.js` no cargó  
**Solución:**
```javascript
// Verificar en Network tab que .js se descargó
// Si no, recargar página: Ctrl+Shift+R (hard refresh)
// Si persiste, check console para errores de parsing
```

### Error 2: "API Key de DeepSeek no configurada"
**Causa:** localStorage.deepseekApiKey vacío  
**Solución:**
1. Ir a Configuración
2. Pegar API key válida
3. Click "Guardar Configuración"
4. Recargar página
5. Verificar: `localStorage.getItem('deepseekApiKey')`

### Error 3: Panel no aparece después de ejecutar
**Causa:** CSS hidden class no removido  
**Solución:**
```javascript
// Manual fix en console:
document.querySelector('#apiPanel').style.display = 'block';
document.querySelector('#apiPanel').classList.remove('hidden');
```

### Error 4: DeepSeek API returns 401
**Causa:** API key inválida o expirada  
**Solución:**
1. Check API key en https://platform.deepseek.com/account/api_keys
2. Si expiró, generar nueva
3. Actualizar en app Configuración
4. Reintentar

### Error 5: Respuesta vacía o timeout
**Causa:** API lenta o sin conexión  
**Solución:**
```javascript
// Incrementar timeout en deepseek_coach.js (línea 9)
this.timeout = 60000; // Cambiar a 60 segundos
```

---

## ✨ Test Cases Exitosos

### ✅ Test 1: Panel Visible
```
- Ejecutar cualquier consulta
- Panel flotante aparece bottom-right
- Desaparece si recargas o cierras
```

### ✅ Test 2: Datos Correctos
```
- Top 5 muestra orden descending por conversion rate
- Recomendación muestra mejor pitch para origen
- Comparación muestra diferencia clara
```

### ✅ Test 3: DeepSeek Analysis
```
- Con API key válida: respuesta en ~3-5 segundos
- Sin API key: fallback muestra datos sin IA
- Error handling: muestra mensaje claro
```

### ✅ Test 4: Responsividad
```
- Desktop: Panel 420px bottom-right
- Tablet: Panel ~70% ancho
- Mobile: Panel ~90% ancho, max 50vh altura
```

### ✅ Test 5: localStorage
```
- API key se guarda al click "Guardar"
- Se carga en startup automáticamente
- Persiste entre recargas
```

---

## 📈 Performance Testing

### API Response Times
```
Top 5: < 500ms
Recomendación: < 500ms
DeepSeek Analysis: 3-8 segundos
```

### Panel Render Time
```
Mostrar panel: < 100ms
Cargar datos: < 200ms
Scroll: 60fps
```

---

## 🎯 Acceptance Criteria

- [x] Panel flotante visible en desktop/tablet/mobile
- [x] API key de DeepSeek se guarda en localStorage
- [x] Conexión con API se valida
- [x] Prompts incluyen contexto Cancún
- [x] Respuestas aparecen en panel
- [x] Fallback si API no disponible
- [x] Error handling robusto
- [x] Backward compatibility mantenida
- [x] Responsive design funcionando
- [x] Todos los endpoints trabajan

---

## 📞 Quick Support

**API Key Issues?**
- https://platform.deepseek.com/account/api_keys

**API Documentation?**
- https://platform.deepseek.com/docs

**Console Errors?**
- Open DevTools: F12 → Console tab
- Buscar "deepseek" o "error"

**Panel no aparece?**
- Check: `document.querySelector('#apiPanel')`
- Verify CSS loaded in head
- Hard refresh: Ctrl+Shift+R

---

**Created:** 2026-01-27  
**Status:** ✅ Ready for Full Testing  
**Version:** 1.0  

