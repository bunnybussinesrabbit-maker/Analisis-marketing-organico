## COMO RESOLVER LOS ERRORES DE CHARSET Y CROSS-ORIGIN

### Problema 1: SecurityError - Cross-Origin Frame Access
**Error**: `Uncaught SecurityError: Failed to read a named property 'showView' from 'Window'`

**Causa**: Los iframes creados con `file://` protocol no pueden acceder a funciones del padre window.

**Solución**: Usar HTTP server en lugar de abrir archivos localmente.

---

### Problema 2: Caracteres Corruptos (âŒ)
**Error**: `> âŒ showView() not found`

**Causa**: Falta de declaración `<meta charset="UTF-8">` en los archivos HTML.

**Solución**: Ya agregada. Los archivos TEST.html y VERIFY_FIX.html ahora incluyen:
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    ...
</head>
```

---

## PASOS PARA PROBAR CORRECTAMENTE

### 1. Asegura que el HTTP Server está corriendo
```powershell
python -m http.server 8080
```
Debe mostrar: `Serving HTTP on 0.0.0.0 port 8080`

### 2. Abre el NUEVO archivo de prueba (sin iframes)
Navega a: **http://localhost:8080/SIMPLE_NAV_TEST.html**

Este archivo:
✓ NO usa iframes (evita cross-origin)
✓ Tiene charset UTF-8 correcto
✓ Carga index.html directamente
✓ Prueba todos los botones sin errores de seguridad

### 3. Sigue estos pasos en SIMPLE_NAV_TEST.html:

**Paso A**: Click en "Load App (index.html)"
- Esto cargará la aplicación principal

**Paso B**: Abre F12 (Developer Tools) → Console
- Busca cualquier error en la consola
- La consola del test mostrará:
  - ✓ "Test page loaded" (verde)
  - ✓ "INSTRUCTION: Click Load App first..." (azul)

**Paso C**: Si la app cargó, haz click en "Test All 10 Buttons"
- Esto probará automáticamente todos los botones
- Verás en la consola:
  - ✓ "Step 1/10: Navigating to dashboard..." (azul)
  - ✓ "Successfully called showView('dashboard')" (verde)

**Paso D**: Si todo funciona, abre directamente index.html
- http://localhost:8080/index.html
- Prueba manualmente todos los botones del dashboard

---

## QUE ESPERAR EN LA CONSOLA (F12)

### Sin Errores (Esperado):
```
✓ [INFO] Test page loaded
✓ [INFO] INSTRUCTION: Click Load App first, then test buttons
✓ [INFO] Step 1/10: Navigating to dashboard...
✓ [SUCCESS] Successfully called showView('dashboard')
✓ [SUCCESS] 🔄 showView('dashboard') called
✓ [SUCCESS] ✅ Section found: dashboard
✓ [INFO] Step 2/10: Navigating to map-section...
...
```

### Con Errores (Si aún persisten):
- "showView() is not defined" → groq_cliente.js no cargó
- "Module parse error" → Todavía hay duplicados en las exportaciones
- "SyntaxError" en groq_cliente.js → El archivo no se guardó correctamente

---

## SI AUN TIENES PROBLEMAS

### Verificar que groq_cliente.js fue modificado correctamente:
```bash
grep -n "export" groq_cliente.js | grep testConnection
```
Debería mostrar SOLO UNA línea (la línea 323).
Si muestra dos líneas, el fix no se aplicó correctamente.

### Forza actualización del navegador (sin cache):
- Presiona: **Ctrl + Shift + R** (en index.html)
- Esto limpia el cache y recarga

### Si usas PWA Service Worker:
- Abre DevTools → Application → Service Workers
- Click en "Unregister" para limpiar caché PWA
- Luego recarga

### Reinicia el servidor HTTP:
```powershell
# En terminal, presiona Ctrl+C
taskkill /PID <PID> /F
python -m http.server 8080
```

---

## RESUMEN FINAL

✓ Fixed: Charset encoding (UTF-8 meta tag agregado)
✓ Fixed: Cross-origin iframe error (nuevo SIMPLE_NAV_TEST.html sin iframes)
✓ Fixed: groq_cliente.js duplicate export (línea 353 removida)

**Próximo paso**: 
1. Abre http://localhost:8080/SIMPLE_NAV_TEST.html
2. Click "Load App"
3. Abre F12 console
4. Click "Test All 10 Buttons"
5. Reporta resultados
