#!/usr/bin/env bash

# 🔍 VERIFICACIÓN DE NAVIGATION BUTTONS - Geo-Suite Cancún PRO
# Este script verifica que todos los cambios se aplicaron correctamente

echo "=================================="
echo "  🔍 VERIFICACIÓN DE NAVIGATION FIX"
echo "=================================="
echo ""

# Función para buscar patrón en archivo
search_in_file() {
    local pattern=$1
    local file=$2
    local line_num=$(grep -n "$pattern" "$file" 2>/dev/null | head -1 | cut -d: -f1)
    
    if [ -z "$line_num" ]; then
        echo "❌ NO ENCONTRADO: $pattern"
        return 1
    else
        echo "✅ ENCONTRADO en línea $line_num: $pattern"
        return 0
    fi
}

echo "1. Verificando cambios en index.html..."
echo ""

# Cambio 1: return false en onclick
echo "📝 Cambio 1: onclick con return false"
search_in_file 'onclick="showView.*return false' index.html

# Cambio 2: pointer-events en CSS
echo ""
echo "📝 Cambio 2: pointer-events en .dashboard-nav-item"
search_in_file 'pointer-events: auto' index.html

# Cambio 3: Event listeners para dashboard-nav-item
echo ""
echo "📝 Cambio 3: Event listeners para dashboard-nav-item"
search_in_file "dashboard-nav-item.*addEventListener" index.html

# Cambio 4: Logging en showView
echo ""
echo "📝 Cambio 4: Logging en showView()"
search_in_file 'console.log.*showView.*called' index.html

echo ""
echo "=================================="
echo "  📊 RESUMEN DE CAMBIOS"
echo "=================================="
echo ""

# Contar cantidad de botones del dashboard
button_count=$(grep -c 'dashboard-nav-item' index.html)
echo "📌 Botones del dashboard: $((button_count / 2)) (x2 por cada línea)"

# Contar secciones
section_count=$(grep -c 'view-section' index.html)
echo "📌 Secciones disponibles: $section_count"

# Contar ocurrencias de showView
showview_count=$(grep -c 'showView' index.html)
echo "📌 Referencias a showView(): $showview_count"

echo ""
echo "=================================="
echo "  ✅ VERIFICACIÓN COMPLETADA"
echo "=================================="
echo ""
echo "Próximos pasos:"
echo "1. Abre index.html en tu navegador"
echo "2. Presiona F12 para abrir DevTools"
echo "3. Haz clic en los botones del dashboard"
echo "4. Verifica los logs en la consola"
echo ""
