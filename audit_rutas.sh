#!/bin/bash
# SCRIPT DE AUDITORÍA Y DIAGNÓSTICO DE RUTAS
# 
# Este script verifica que todas las rutas de archivos coincidan correctamente
# entre el navegador (Chrome) y el disco duro

set -e

echo "=================================="
echo "🔍 AUDITORÍA DE RUTAS - Geo-Suite Cancún PRO"
echo "=================================="
echo ""

# Detectar el directorio de trabajo
PROJECT_ROOT="${PWD}"

echo "📂 Directorio del Proyecto: $PROJECT_ROOT"
echo ""

# ===== VERIFICAR ESTRUCTURA DE CARPETAS =====
echo "📋 PASO 1: Verificando Estructura de Carpetas"
echo "-------------------------------------------"

check_directory() {
  local dir="$1"
  local label="$2"
  
  if [ -d "$dir" ]; then
    echo "✅ $label: $dir"
    ls -1 "$dir" | head -5 && echo "   ..." || true
  else
    echo "❌ $label NO EXISTE: $dir"
  fi
}

check_directory "./analytics_module" "📊 Analytics Module"
check_directory "./utils" "🔧 Utils"
check_directory "./data" "📁 Data"

echo ""

# ===== VERIFICAR ARCHIVOS CRÍTICOS =====
echo "📋 PASO 2: Verificando Archivos Críticos"
echo "----------------------------------------"

check_file() {
  local file="$1"
  local label="$2"
  
  if [ -f "$file" ]; then
    local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "?")
    echo "✅ $label: $file ($size bytes)"
  else
    echo "❌ $file NO EXISTE"
  fi
}

check_file "./index.html" "HTML Principal"
check_file "./.vscode/launch.json" "Config Depurador"
check_file "./groq_cliente.js" "LLM Client"
check_file "./modules_integration.js" "Orchestrator"
check_file "./knowledgebase.js" "Knowledge Base"

echo ""

# ===== VERIFICAR RUTAS EN index.html =====
echo "📋 PASO 3: Verificando Rutas en index.html"
echo "-------------------------------------------"

if [ -f "./index.html" ]; then
  echo "Scripts cargados en index.html:"
  grep -o 'src="[^"]*"' index.html | grep -E "(analytics_module|utils|\.js)" | head -10
  echo ""
else
  echo "❌ index.html no encontrado"
fi

echo ""

# ===== VERIFICAR CONFIGURACIÓN LAUNCH.JSON =====
echo "📋 PASO 4: Verificando Configuración de Depuración"
echo "---------------------------------------------------"

if [ -f "./.vscode/launch.json" ]; then
  echo "✅ .vscode/launch.json encontrado"
  echo ""
  echo "Configuraciones disponibles:"
  grep -E '"name"|"type"' .vscode/launch.json | head -6
  echo ""
else
  echo "❌ .vscode/launch.json no encontrado"
fi

echo ""

# ===== CREAR RESUMEN =====
echo "📊 PASO 5: Resumen de Auditoría"
echo "------------------------------"

TOTAL_ANALYTICS=$(find ./analytics_module -name "*.js" 2>/dev/null | wc -l)
TOTAL_UTILS=$(find ./utils -name "*.js" 2>/dev/null | wc -l)

echo "Total de módulos en analytics_module: $TOTAL_ANALYTICS"
echo "Total de utilidades en utils: $TOTAL_UTILS"
echo ""

# ===== INSTRUCCIONES FINALES =====
echo "✅ AUDITORÍA COMPLETADA"
echo ""
echo "📌 PRÓXIMOS PASOS:"
echo "1. Abre Chrome: http://localhost:8080"
echo "2. Presiona F12 para abrir DevTools"
echo "3. Copia el código de DIAGNOSTICO_RUTAS_CHROME.js en la Consola"
echo "4. Analiza la salida para verificar que todas las rutas coincidan"
echo ""
echo "🔗 Si los breakpoints NO funcionan:"
echo "   - Verifica que Chrome está en modo Remote Debugging (puerto 9222)"
echo "   - En VS Code, presiona Ctrl+Shift+D"
echo "   - Selecciona '🔗 ATTACH Chrome (Vanilla JS - Corrected)'"
echo ""
