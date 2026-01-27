// SCRIPT PARA EJECUTAR EN DEVTOOLS CONSOLE DE index.html
// Copia TODO el contenido de este archivo y pégalo en la consola de index.html (F12 → Console)

console.clear();
console.log('%c════════════════════════════════════════════════', 'color: #0f0; font-weight: bold; font-size: 14px');
console.log('%c  DIAGNÓSTICO DE BOTONES DE NAVEGACIÓN', 'color: #0f0; font-weight: bold; font-size: 14px');
console.log('%c════════════════════════════════════════════════', 'color: #0f0; font-weight: bold; font-size: 14px');

console.log('\n1️⃣  VERIFICANDO FUNCIÓN showView():');
console.log('   typeof showView:', typeof showView);
if (typeof showView === 'function') {
    console.log('   ✅ showView EXISTE y es una función');
    console.log('   showView.toString():', showView.toString().substring(0, 100) + '...');
} else {
    console.error('   ❌ showView NO EXISTE o no es una función');
}

console.log('\n2️⃣  VERIFICANDO FUNCIÓN initAdvancedModules():');
console.log('   typeof initAdvancedModules:', typeof initAdvancedModules);
if (typeof initAdvancedModules === 'function') {
    console.log('   ✅ initAdvancedModules EXISTE');
} else {
    console.error('   ❌ initAdvancedModules NO EXISTE');
}

console.log('\n3️⃣  VERIFICANDO BOTONES EN DOM:');
const buttons = document.querySelectorAll('[data-view]');
console.log(`   Total de botones encontrados: ${buttons.length}`);
if (buttons.length > 0) {
    console.log('   ✅ Botones encontrados:');
    buttons.forEach((btn, idx) => {
        const hasOnClick = btn.getAttribute('onclick');
        const cls = btn.getAttribute('class');
        console.log(`      ${idx + 1}. data-view="${btn.dataset.view}" | class="${cls}" | onclick="${hasOnClick ? 'SÍ' : 'NO'}"`);
    });
} else {
    console.error('   ❌ NO HAY BOTONES CON data-view');
}

console.log('\n4️⃣  VERIFICANDO SECCIONES DE VISTA:');
const expectedViews = ['dashboard', 'map-section', 'data', 'capture', 'analysis', 'zones', 'pitch', 'routes', 'tools', 'reports'];
expectedViews.forEach(view => {
    const section = document.getElementById(view);
    if (section) {
        const display = window.getComputedStyle(section).display;
        console.log(`   ✅ ${view}: EXISTE (display: ${display})`);
    } else {
        console.error(`   ❌ ${view}: NO EXISTE`);
    }
});

console.log('\n5️⃣  PRUEBA: Simulando click en primer botón:');
if (buttons.length > 0) {
    const firstBtn = buttons[0];
    const viewId = firstBtn.dataset.view;
    console.log(`   Clickeando botón: ${viewId}`);
    try {
        firstBtn.click();
        console.log('   ✅ Click ejecutado');
    } catch (e) {
        console.error('   ❌ Error al hacer click:', e.message);
    }
} else {
    console.error('   ❌ No hay botones para clickear');
}

console.log('\n6️⃣  PRUEBA: Llamando showView() manualmente:');
if (typeof showView === 'function') {
    console.log('   Llamando showView("dashboard")...');
    try {
        showView('dashboard');
        console.log('   ✅ showView("dashboard") ejecutado exitosamente');
    } catch (e) {
        console.error('   ❌ Error:', e.message);
        console.error('   Stack:', e.stack);
    }
} else {
    console.error('   ❌ showView no está disponible');
}

console.log('\n7️⃣  VERIFICANDO SCOPE GLOBAL:');
console.log('   window.AnalyticsOrchestrator:', typeof window.AnalyticsOrchestrator);
console.log('   window.salesData:', window.salesData?.length || 'undefined');
console.log('   window.filteredData:', window.filteredData?.length || 'undefined');
console.log('   window.analyticsOrchestrator:', window.analyticsOrchestrator?.constructor?.name || 'null');

console.log('\n' + '%c════════════════════════════════════════════════', 'color: #0f0; font-weight: bold; font-size: 14px');
console.log('%c  FIN DEL DIAGNÓSTICO', 'color: #0f0; font-weight: bold; font-size: 14px');
console.log('%c════════════════════════════════════════════════\n', 'color: #0f0; font-weight: bold; font-size: 14px');

// Si todos pasan, intenta un segundo click para ver si funciona consistentemente
console.log('PRUEBA ADICIONAL: Haciendo 3 clicks en botones diferentes...');
if (buttons.length >= 3) {
    setTimeout(() => {
        console.log('Click 1: dashboard');
        document.querySelector('[data-view="dashboard"]').click();
    }, 500);
    
    setTimeout(() => {
        console.log('Click 2: map-section');
        document.querySelector('[data-view="map-section"]')?.click();
    }, 1000);
    
    setTimeout(() => {
        console.log('Click 3: data');
        document.querySelector('[data-view="data"]')?.click();
    }, 1500);
}
