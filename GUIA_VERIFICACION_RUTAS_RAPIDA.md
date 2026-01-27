# ⚡ GUÍA RÁPIDA: Verificar Rutas y Activar Breakpoints

**Fecha:** 26 de enero de 2026

---

## 🎯 Objetivo

Verificar que las rutas de archivos coincidan exactamente entre Chrome y VS Code para que los breakpoints funcionen.

---

## 🚀 PASOS RÁPIDOS (5 MINUTOS)

### 1️⃣ Inicia el Servidor Web
```powershell
# En PowerShell (en el directorio del proyecto)
python -m http.server 8080

# O en CMD:
cd C:\Users\Donna\Mi unidad\5-Apps\Analisis-marketing-organico
python -m http.server 8080
```

✅ Deberías ver:
```
Serving HTTP on 0.0.0.0 port 8080 (http://0.0.0.0:8080/) ...
```

---

### 2️⃣ Abre Chrome en Modo Remote Debugging
```powershell
# Abre Chrome desde PowerShell con remote debugging habilitado:
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 http://localhost:8080

# O en Windows, busca Chrome y ejecuta con parámetro en terminal
```

✅ Deberías ver:
- Chrome abre con una barra amarilla que dice "Advertencia del navegador"
- La URL es `http://localhost:8080`

---

### 3️⃣ Abre DevTools en Chrome (F12)
```
Presiona: F12 o Ctrl+Shift+I
Navega a: Pestaña "Sources" (Fuentes)
```

✅ Deberías ver en el árbol izquierdo:
```
localhost:8080
├── analytics_module/
│   ├── bayesian_analytics.js     ← CLAVE: Debe estar aquí
│   ├── montecarlo_logistics.js
│   └── ...
├── utils/
│   ├── fieldMapper.js            ← CLAVE: Debe estar aquí
│   └── ...
└── knowledgebase.js              ← CLAVE: Debe estar aquí
```

---

### 4️⃣ Ejecuta el Diagnóstico en Consola Chrome

En Chrome DevTools, haz clic en la pestaña **Console** (Consola) y copia-pega esto:

```javascript
// Verificar que todos los archivos estén cargados
console.log('📍 Rutas en Chrome:');
Array.from(document.querySelectorAll('script[src]')).forEach(s => {
  const shortUrl = s.src.replace('http://localhost:8080/', '');
  const status = shortUrl.includes('analytics_module') || shortUrl.includes('utils') ? '✅' : '📌';
  console.log(`${status} ${shortUrl}`);
});

// Verificar que las funciones estén disponibles
console.log('\n🔧 Funciones disponibles:');
console.log(`Bayesian: ${typeof window.bayesianConversionProbability}`);
console.log(`MonteCarlo: ${typeof window.monteCarloLogisticSimulation}`);
console.log(`Analytics: ${typeof window.Analytics}`);
```

✅ Deberías ver:
```
📍 Rutas en Chrome:
✅ analytics_module/bayesian_analytics.js
✅ analytics_module/montecarlo_logistics.js
...
✅ utils/fieldMapper.js
...

🔧 Funciones disponibles:
Bayesian: function
MonteCarlo: function
Analytics: object
```

---

### 5️⃣ Conecta VS Code al Depurador

En VS Code:

```
1. Presiona: Ctrl+Shift+D
2. Selecciona: "🔗 ATTACH Chrome (Vanilla JS - Corrected)"
3. Haz clic en: "Start Debugging" (Play button)
```

✅ Deberías ver en la Terminal:
```
Debugger listening on ws://127.0.0.1:9222/devtools/browser/...
```

---

### 6️⃣ Prueba un Breakpoint

En VS Code:

```javascript
// 1. Abre el archivo: analytics_module/bayesian_analytics.js
// 2. Haz clic en el número de línea para crear un breakpoint (punto rojo)
// 3. En Chrome Console, ejecuta:

bayesianConversionProbability('zona_hotelera', 14, {success: 5, total: 10})

// 4. Esperado: VS Code debe PAUSAR en la línea del breakpoint
```

✅ Si funciona:
- La línea se resalta en amarillo en VS Code
- Puedes inspeccionar variables
- Puedes hacer "step over" (F10) o "step into" (F11)

❌ Si NO funciona:
- Verifica que las rutas en paso 4️⃣ muestren todos ✅
- Revisa que `"trace": "verbose"` esté en `.vscode/launch.json`
- Abre la Consola de VS Code (Ctrl+`) y busca mensajes de error

---

## 📊 VERIFICACIÓN DE RUTAS: Tabla de Control

| Elemento | Ubicación | Estado | Nota |
|----------|-----------|--------|------|
| Analytics Module | `./analytics_module/` | ✅ Existe | 10 archivos .js |
| Utils | `./utils/` | ✅ Existe | 4 archivos .js |
| index.html | Raíz | ✅ Existe | Carga todos los scripts |
| Rutas en Chrome | `http://localhost:8080/analytics_module/...` | ✅ Debe verse | Verifica en paso 4️⃣ |
| launch.json | `.vscode/launch.json` | ✅ Actualizado | Incluye reglas correctas |
| Breakpoints | VS Code | ⏳ Depende | Requiere pasos 1-5 |

---

## 🔴 TROUBLESHOOTING: Si algo NO funciona

### Problema: "Los scripts NO aparecen en Chrome DevTools"
```javascript
// En Chrome Console, verifica:
console.log(document.scripts.length);  // Debería ser > 15

// Si es 0 o muy bajo, los scripts no se cargaron
// Verifica:
// 1. ¿El servidor HTTP está corriendo en el puerto 8080?
// 2. ¿index.html tiene las rutas correctas (./analytics_module/)?
// 3. ¿Los archivos existen en disco?
```

### Problema: "Las funciones muestran 'undefined'"
```javascript
// Si `typeof window.bayesianConversionProbability === 'undefined'`
// significa que bayesian_analytics.js no se ejecutó

// En Chrome Console:
console.log(document.querySelector('script[src*="bayesian"]'));
// Si es null, el script no se cargó

// Verifica index.html:
// <script src="./analytics_module/bayesian_analytics.js"></script>
// ^^^ Debe estar presente
```

### Problema: "Breakpoints NO funcionan, Chrome pausa pero VS Code NO"
```
1. Cierra completamente Chrome
2. Cierra la sesión de Debugging en VS Code
3. En terminal: Abre Chrome nuevamente con --remote-debugging-port=9222
4. En VS Code: Vuelve a hacer Attach
5. Prueba breakpoint nuevamente
```

### Problema: "Rutas NO coinciden entre Chrome y disco"
```
Chrome ve:   http://localhost:8080/analytics_module/bayesian_analytics.js
VS Code cree: C:\Users\Donna\...\analytics_module\bayesian_analytics.js

Si estas NO coinciden estructuralmente:
- Verifica que webRoot en launch.json = "${workspaceFolder}"
- Verifica que sourceMapPathOverrides esté actualizado (paso 4️⃣ de PASO 1)
- Habilita "trace": "verbose" en launch.json para ver logs de mapeo
```

---

## ✅ CHECKLIST FINAL

- [ ] Servidor HTTP corriendo en puerto 8080
- [ ] Chrome abierto en `http://localhost:8080` con `--remote-debugging-port=9222`
- [ ] DevTools abierto (F12), pestaña Sources
- [ ] Scripts de `analytics_module/` visibles en árbol izquierdo
- [ ] Scripts de `utils/` visibles en árbol izquierdo
- [ ] Diagnóstico en Consola muestra todos ✅
- [ ] VS Code conectado al depurador (Ctrl+Shift+D)
- [ ] Breakpoint creado (clic en número de línea)
- [ ] Función ejecutada desde Chrome Console
- [ ] VS Code PAUSÓ en el breakpoint

Si todos están ✅ → **Auditoría completada exitosamente**

---

## 📞 REFERENCIAS

- Documento completo: [AUDITORIA_RUTAS_DEPURACION.md](./AUDITORIA_RUTAS_DEPURACION.md)
- Script de diagnóstico: [DIAGNOSTICO_RUTAS_CHROME.js](./DIAGNOSTICO_RUTAS_CHROME.js)
- Configuración actualizada: [.vscode/launch.json](./.vscode/launch.json)

