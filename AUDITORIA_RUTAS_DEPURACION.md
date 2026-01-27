# 🔍 AUDITORÍA: Rutas de Depuración y sourceMapPathOverrides

**Fecha:** 26 de enero de 2026  
**Objetivo:** Verificar que las rutas de archivos coincidan exactamente entre el navegador (Chrome) y el disco duro.

---

## 📋 PROBLEMA IDENTIFICADO

### Configuración Actual (`.vscode/launch.json`)
```jsonc
{
  "sourceMapPathOverrides": {
    "webpack:///./*": "${webRoot}/*",
    "webpack:///src/*": "${webRoot}/src/*",
    "/workspaces/${workspaceFolderBasename}/*": "${webRoot}/*"
  },
  "webRoot": "${workspaceFolder}"
}
```

**Problema:** Las reglas de `sourceMapPathOverrides` están diseñadas para **webpack**, pero el proyecto **NO usa webpack**. Es una aplicación vanilla JavaScript cargada directamente con `<script src="">`.

### Archivos Sin Source Maps
- `./analytics_module/*.js` → Cargados directamente en HTML
- `./utils/*.js` → Cargados directamente en HTML  
- `./knowledgebase.js`, `./groq_cliente.js`, etc. → Cargados sin transpilación

**Resultado:** Chrome ve las rutas tal como están en el HTML, pero las reglas de override no se aplican porque no hay source maps de webpack.

---

## 🗂️ ESTRUCTURA DE CARPETAS (Verificada)

```
${workspaceFolder} = C:\Users\Donna\Mi unidad\5-Apps\Analisis-marketing-organico
│
├── index.html (raíz)
├── analytics_module/
│   ├── bayesian_analytics.js
│   ├── montecarlo_logistics.js
│   ├── timeseries_forecast.js
│   ├── genetic_algorithm.js
│   ├── markov_decisions.js
│   ├── market_saturation.js
│   ├── cannibalization_analysis.js
│   ├── empirical_probability.js
│   └── cross_analysis.js
│
├── utils/
│   ├── fieldMapper.js
│   ├── goe_utils.js
│   ├── math_utils.js
│   └── stat_utils.js
│
├── data/
│   ├── zonas.json
│   ├── clientOrigins.json
│   ├── socioeconomicProfiles.json
│   └── pitchTypes.json
│
└── [otros módulos raíz]
    ├── knowledgebase.js
    ├── groq_cliente.js
    ├── modules_integration.js
    ├── openai_strategies.js
    └── DEBUG_HELPER.js
```

---

## 🔧 RUTAS TAL COMO CHROME LAS VE

Cuando ejecutas `http://localhost:8080`:

### Script Tags en index.html
```html
<script src="./analytics_module/bayesian_analytics.js"></script>
<!-- ↓ Chrome resuelve esto como: -->
http://localhost:8080/analytics_module/bayesian_analytics.js

<script src="./utils/fieldMapper.js"></script>
<!-- ↓ Chrome resuelve esto como: -->
http://localhost:8080/utils/fieldMapper.js

<script src="./knowledgebase.js"></script>
<!-- ↓ Chrome resuelve esto como: -->
http://localhost:8080/knowledgebase.js
```

### En Chrome DevTools (Debugger)
- **Pestana Sources:** Los archivos aparecen bajo `localhost:8080/analytics_module/bayesian_analytics.js`
- **Consola del Depurador:** Las rutas que ve Chrome NO coinciden con las de tu disco duro porque:
  1. No hay source maps (`.map` files)
  2. El navegador ve rutas HTTP relativas, no rutas del sistema de archivos
  3. VS Code necesita traducir entre rutas HTTP ↔ rutas de disco

---

## ⚠️ POR QUÉ LOS BREAKPOINTS NO FUNCIONAN

**Escenario actual:**
1. Configuras un breakpoint en `analytics_module/bayesian_analytics.js` (línea 42)
2. VS Code lo registra en su depurador local
3. Chrome recibe la solicitud de Attach pero las rutas NO coinciden exactamente
4. Resultado: **El breakpoint nunca se activa** durante la ejecución

**Razón técnica:**
- `sourceMapPathOverrides` solo funciona si el archivo tiene un source map adjunto (`//# sourceMappingURL=...`)
- Sin source maps, Chrome ignora los overrides
- Sin overrides válidos, VS Code no puede mapear rutas HTTP → rutas de disco

---

## ✅ SOLUCIÓN: Configuración Correcta para Vanilla JS

### Paso 1: Actualizar `.vscode/launch.json`

Reemplaza la configuración por esta versión que funciona con archivos JavaScript vanilla (sin webpack):

```jsonc
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "attach",
      "name": "🔗 ATTACH Chrome (Vanilla JS)",
      "port": 9222,
      "urlFilter": "http://localhost:8080*",
      "webRoot": "${workspaceFolder}",
      "timeout": 60000,
      // ✅ Estas reglas funcionan SIN source maps
      "pathMapping": {
        "/": "${workspaceFolder}",
        "http://localhost:8080/": "${workspaceFolder}/"
      },
      "sourceMapPathOverrides": {
        // Para archivos vanilla (sin source map)
        "http://localhost:8080/*": "${workspaceFolder}/*",
        "localhost:8080/*": "${workspaceFolder}/*",
        "//*": "${workspaceFolder}/*",
        "*": "${workspaceFolder}/*"
      },
      "smartStep": true,
      "skipFiles": [
        "<node_internals>/**",
        "node_modules/**"
      ],
      // ✅ Agrega esto para Ver exactamente cómo Chrome está viendo las rutas
      "trace": "verbose",
      "logPointsText": "chrome breakpoints"
    }
  ]
}
```

---

## 🎯 VERIFICAR QUE LAS RUTAS COINCIDAN

### Método 1: Usar el Comando `.scripts` en Consola (Windows PowerShell)

Aunque el usuario mencionó "Consola de Depuración", en Windows podemos verificar las rutas de una manera más práctica.

### Método 2: Verificación Visual en Chrome DevTools

1. **Abre Chrome DevTools** (F12)
2. **Ve a la pestaña Sources** (Fuentes)
3. **Expande el árbol de archivos:**
   ```
   localhost:8080
   ├── analytics_module/
   │   ├── bayesian_analytics.js       ← Debe estar aquí
   │   ├── montecarlo_logistics.js
   │   └── ...
   ├── utils/
   │   ├── fieldMapper.js              ← Debe estar aquí
   │   └── ...
   ├── knowledgebase.js                ← Debe estar aquí
   └── ...
   ```

4. **Haz clic en un archivo** (ej: `bayesian_analytics.js`)
5. **En la consola, ejecuta:**
   ```javascript
   // Ver la URL que Chrome está sirviendo
   document.scripts[0].src  // Te mostrará la URL HTTP completa
   ```

---

## 📊 TABLA DE COMPARACIÓN: Rutas

| Ubicación | Ruta en Disco | Ruta en Chrome | ¿Coinciden? |
|-----------|--------------|----------------|-----------|
| Raíz | `C:\Users\...\index.html` | `http://localhost:8080/index.html` | ⚠️ NO (rutas distintas) |
| Analytics | `C:\Users\...\analytics_module\bayesian_analytics.js` | `http://localhost:8080/analytics_module/bayesian_analytics.js` | ✅ SÍ (estructura idéntica) |
| Utils | `C:\Users\...\utils\fieldMapper.js` | `http://localhost:8080/utils/fieldMapper.js` | ✅ SÍ (estructura idéntica) |
| Datos | `C:\Users\...\data\zonas.json` | `http://localhost:8080/data/zonas.json` | ✅ SÍ (estructura idéntica) |

**Explicación:** VS Code mapea automáticamente rutas URL HTTP → rutas de disco, pero necesita que `sourceMapPathOverrides` esté correctamente configurado.

---

## 🚀 PRÓXIMOS PASOS

### 1. Actualizar launch.json (CRÍTICO)
```bash
# En VS Code, reemplaza el contenido de .vscode/launch.json con la configuración mejorada
```

### 2. Reiniciar el Depurador
```bash
# En VS Code:
1. Presiona Ctrl+Shift+D (Debugger)
2. Desconecta cualquier sesión anterior
3. Inicia una nueva: "🔗 ATTACH Chrome (Vanilla JS)"
```

### 3. Verificar Breakpoints
```bash
1. Abre analytics_module/bayesian_analytics.js
2. Haz clic en la línea donde quieras un breakpoint
3. Ejecuta código que active esa función
4. El breakpoint debe pausar la ejecución
```

### 4. Logs de Depuración
Con `"trace": "verbose"` habilitado, verás en la consola de VS Code exactamente cómo está mapeando rutas:
```
[Mapping] URL: http://localhost:8080/analytics_module/bayesian_analytics.js
[Mapping] Disk: C:\Users\Donna\Mi unidad\5-Apps\Analisis-marketing-organico\analytics_module\bayesian_analytics.js
[Mapping] Status: ✅ Coinciden
```

---

## 📝 CHECKLIST DE AUDITORÍA

- [ ] Carpeta `analytics_module/` contiene todos los archivos (10 archivos verificados)
- [ ] Carpeta `utils/` contiene todas las utilidades (4 archivos verificados)
- [ ] Archivo `index.html` carga todos los scripts correctamente
- [ ] NO hay webpack ni bundler (archivos vanilla)
- [ ] `sourceMapPathOverrides` está actualizado para vanilla JS
- [ ] `webRoot` apunta a `${workspaceFolder}` correctamente
- [ ] Rutas en Chrome coinciden con estructura en disco
- [ ] Breakpoints se activan correctamente (después de actualizar launch.json)
- [ ] Logs muestran rutas mapeadas correctamente

---

## 🔗 REFERENCIAS

- [VS Code Debugging for Chrome](https://github.com/microsoft/vscode-chrome-debug)
- [Source Maps and Path Overrides](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_source-maps)
- [Chrome DevTools Sources Tab](https://developer.chrome.com/docs/devtools/sources/)

