#!/bin/bash
# SCRIPT DE VALIDACIÓN - Verifica que todos los archivos están en su lugar

echo "╔════════════════════════════════════════════════════════╗"
echo "║  🔍 VALIDACIÓN DE ARCHIVOS IMPLEMENTADOS             ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para verificar archivo
check_file() {
    if [ -f "$1" ]; then
        size=$(wc -l < "$1" 2>/dev/null || echo "0")
        echo -e "${GREEN}✅${NC} $1 ($size líneas)"
        return 0
    else
        echo -e "${RED}❌${NC} $1 (NO ENCONTRADO)"
        return 1
    fi
}

# Función para verificar contenido
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}  ✓${NC} Contiene: '$2'"
        return 0
    else
        echo -e "${RED}  ✗${NC} NO contiene: '$2'"
        return 1
    fi
}

echo "📁 ARCHIVOS PRINCIPALES"
echo "─────────────────────"
check_file "index.html"
check_file "modules_integration.js"
check_file "analytics_module/cross_analysis.js"

echo ""
echo "📁 ARCHIVOS NUEVOS"
echo "──────────────────"
check_file "utils/fieldMapper.js"

echo ""
echo "📄 ARCHIVOS DE DOCUMENTACIÓN"
echo "────────────────────────────"
check_file "TESTING_GUIDE.md"
check_file "RESUMEN_IMPLEMENTACION.md"
check_file "TEST_INTEGRATION.js"

echo ""
echo "🔍 VALIDACIÓN DE CAMBIOS EN index.html"
echo "──────────────────────────────────────"
check_content "index.html" "fieldMapper.js" && echo "  → FieldMapper referenciado"
check_content "index.html" "syncAnalysisData" && echo "  → syncAnalysisData implementado"
check_content "index.html" "currentAnalyzer = null" && echo "  → Variable global definida"
check_content "index.html" "hasDemographicData" && echo "  → Detección demográfica activa"

echo ""
echo "🔍 VALIDACIÓN DE CAMBIOS EN cross_analysis.js"
echo "──────────────────────────────────────────────"
check_content "analytics_module/cross_analysis.js" "hasDemographicData" && echo "  → Propiedad demográfica agregada"
check_content "analytics_module/cross_analysis.js" "safeString" && echo "  → Métodos seguros implementados"
check_content "analytics_module/cross_analysis.js" "normalizeResult" && echo "  → Normalización de resultados"

echo ""
echo "🔍 VALIDACIÓN DE CONTENIDO fieldMapper.js"
echo "────────────────────────────────────────"
check_content "utils/fieldMapper.js" "normalizeRecord" && echo "  → Método normalizeRecord"
check_content "utils/fieldMapper.js" "detectDemographicFields" && echo "  → Detección demográfica"
check_content "utils/fieldMapper.js" "generateMappingReport" && echo "  → Reporte de mapeo"
check_content "utils/fieldMapper.js" "VALUE_NORMALIZERS" && echo "  → Normalizadores de valores"

echo ""
echo "════════════════════════════════════════════════════════"
echo "✅ VALIDACIÓN COMPLETADA"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "  1. Abre http://localhost:8000 en tu navegador"
echo "  2. Carga un CSV de prueba"
echo "  3. Abre 'Análisis Completo'"
echo "  4. Verifica que funciona sin errores"
echo ""
echo "🧪 PARA TESTEAR EN CONSOLA:"
echo "  1. Abre DevTools (F12)"
echo "  2. Ve a Console"
echo "  3. Ejecuta: runIntegrationTests()"
echo ""
echo "📖 Ver instrucciones en: TESTING_GUIDE.md"
echo "════════════════════════════════════════════════════════"
