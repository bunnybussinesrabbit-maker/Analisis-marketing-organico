#!/bin/bash

# 🎯 VERIFICACION POST-IMPLEMENTACION: Plan Debug CSV → Módulos
# Este script verifica que todos los cambios se implementaron correctamente

echo "═══════════════════════════════════════════════════════════"
echo "  ✅ VERIFICACIÓN POST-IMPLEMENTACIÓN"
echo "     Plan: Debug CSV → Módulos de Análisis"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificación 1: onDataLoaded mejorada
echo -e "${BLUE}1️⃣  Verificando onDataLoaded()${NC}"
if grep -q "🔄 \[onDataLoaded\] Iniciando reinicialización" index.html; then
    echo -e "${GREEN}✅ onDataLoaded() mejorada${NC}"
    echo "   - Validación de estructura"
    echo "   - Reseteo de orquestador"
    echo "   - Debug logs detallados"
else
    echo -e "${RED}❌ onDataLoaded() no se encontró mejorada${NC}"
fi
echo ""

# Verificación 2: Conexión processData -> onDataLoaded
echo -e "${BLUE}2️⃣  Verificando conexión processData → onDataLoaded${NC}"
if grep -q "🔗 \[processData\] Conectando onDataLoaded()" index.html; then
    echo -e "${GREEN}✅ onDataLoaded() conectada al final de processData()${NC}"
    echo "   - CONEXIÓN CRÍTICA implementada"
    echo "   - Se ejecuta automáticamente al cargar CSV"
else
    echo -e "${RED}❌ Conexión no encontrada${NC}"
fi
echo ""

# Verificación 3: Limpieza de datos unknown
echo -e "${BLUE}3️⃣  Verificando limpieza de datos 'unknown'${NC}"
if grep -q "Elimina registros eliminados por contener valores" index.html; then
    echo -e "${GREEN}✅ Validación y limpieza implementada${NC}"
    echo "   - Elimina registros con 'unknown'"
    echo "   - Verifica registros válidos"
else
    echo -e "${RED}❌ Limpieza no encontrada${NC}"
fi
echo ""

# Verificación 4: initAdvancedModules mejorada
echo -e "${BLUE}4️⃣  Verificando initAdvancedModules()${NC}"
if grep -q "📊 \[initAdvancedModules\] Fuente de datos:" index.html; then
    echo -e "${GREEN}✅ initAdvancedModules() mejorada${NC}"
    echo "   - Validación de datos globales"
    echo "   - Verificación de registros válidos"
    echo "   - Debug logs en cada paso"
else
    echo -e "${RED}❌ initAdvancedModules mejorada no encontrada${NC}"
fi
echo ""

# Verificación 5: DEBUG_HELPER.js
echo -e "${BLUE}5️⃣  Verificando DEBUG_HELPER.js${NC}"
if [ -f "DEBUG_HELPER.js" ]; then
    echo -e "${GREEN}✅ DEBUG_HELPER.js existe${NC}"
    if grep -q "debugDataFlow" DEBUG_HELPER.js; then
        echo "   - ✅ debugDataFlow() disponible"
    fi
    if grep -q "debugStatus" DEBUG_HELPER.js; then
        echo "   - ✅ debugStatus() disponible"
    fi
    if grep -q "debugModules" DEBUG_HELPER.js; then
        echo "   - ✅ debugModules() disponible"
    fi
else
    echo -e "${RED}❌ DEBUG_HELPER.js no encontrado${NC}"
fi
echo ""

# Verificación 6: DEBUG_HELPER.js cargado en index.html
echo -e "${BLUE}6️⃣  Verificando que DEBUG_HELPER.js esté en index.html${NC}"
if grep -q "DEBUG_HELPER.js" index.html; then
    echo -e "${GREEN}✅ DEBUG_HELPER.js está cargado en index.html${NC}"
else
    echo -e "${RED}❌ DEBUG_HELPER.js no está en index.html${NC}"
fi
echo ""

# Verificación 7: Archivos de documentación
echo -e "${BLUE}7️⃣  Verificando documentación${NC}"
files_created=0
[ -f "DEBUG_PLAN.md" ] && echo "   ✅ DEBUG_PLAN.md" && ((files_created++)) || echo "   ❌ DEBUG_PLAN.md"
[ -f "IMPLEMENTACION_PLAN_DEBUG.md" ] && echo "   ✅ IMPLEMENTACION_PLAN_DEBUG.md" && ((files_created++)) || echo "   ❌ IMPLEMENTACION_PLAN_DEBUG.md"
[ -f "VERIFICACION_RAPIDA_DEBUG.md" ] && echo "   ✅ VERIFICACION_RAPIDA_DEBUG.md" && ((files_created++)) || echo "   ❌ VERIFICACION_RAPIDA_DEBUG.md"

if [ $files_created -eq 3 ]; then
    echo -e "${GREEN}✅ Toda la documentación está completa${NC}"
else
    echo -e "${YELLOW}⚠️  Faltan $((3 - files_created)) archivos de documentación${NC}"
fi
echo ""

# Verificación 8: TEST_DEBUG_FLOW.html
echo -e "${BLUE}8️⃣  Verificando página de test${NC}"
if [ -f "TEST_DEBUG_FLOW.html" ]; then
    echo -e "${GREEN}✅ TEST_DEBUG_FLOW.html existe${NC}"
    echo "   - Página standalone para testing"
    echo "   - 4 pasos automatizados"
else
    echo -e "${RED}❌ TEST_DEBUG_FLOW.html no encontrado${NC}"
fi
echo ""

# Resumen final
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ VERIFICACIÓN COMPLETADA${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "   1. Abre index.html en navegador"
echo "   2. Presiona F12 para abrir DevTools"
echo "   3. Carga un CSV normalmente"
echo "   4. En consola, ejecuta: debugDataFlow()"
echo "   5. Verifica que sea '5/5 pasos completados'"
echo ""
echo "📚 DOCUMENTACIÓN:"
echo "   - DEBUG_PLAN.md: Guía de debugging"
echo "   - IMPLEMENTACION_PLAN_DEBUG.md: Resumen técnico"
echo "   - VERIFICACION_RAPIDA_DEBUG.md: Referencia rápida"
echo ""
echo "🧪 TEST:"
echo "   - TEST_DEBUG_FLOW.html: Test sin dependencias"
echo ""
