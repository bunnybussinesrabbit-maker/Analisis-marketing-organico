# 📊 Análisis Cruzados Avanzados con COUNTIF/SUMIF

## 🎯 Propósito

Mostrar cómo realizar análisis multidimensionales combinando COUNTIF y SUMIF para obtener insights profundos sobre tus datos de ventas.

---

## 1️⃣ Análisis: Efectividad de Pitches por Zona

**Pregunta:** ¿Cuál pitch funciona mejor en cada zona?

```javascript
const zonas = ['zona_hotelera', 'centro', 'region_237'];
const pitches = ['autoridad', 'nostalgia', 'escasez', 'comunidad'];

const resultados = {};

zonas.forEach(zona => {
  resultados[zona] = {};
  pitches.forEach(pitch => {
    const total = window.COUNTIFS(window.salesData, {
      zona: zona,
      pitchType: pitch
    });
    
    const exitosas = window.salesData.filter(r => 
      r.zona === zona && 
      r.pitchType === pitch && 
      r.result === 'successful'
    ).length;
    
    const tasa = total > 0 ? (exitosas / total * 100).toFixed(1) : 0;
    resultados[zona][pitch] = {
      total,
      exitosas,
      tasa: `${tasa}%`
    };
  });
});

console.table(resultados);
```

**Salida esperada:**
```
{
  zona_hotelera: {
    autoridad: { total: 3, exitosas: 3, tasa: "100%" },
    nostalgia: { total: 2, exitosas: 1, tasa: "50%" },
    escasez: { total: 1, exitosas: 1, tasa: "100%" },
    comunidad: { total: 1, exitosas: 0, tasa: "0%" }
  },
  ...
}
```

---

## 2️⃣ Análisis: Ingresos por Pitch en Cada Zona

**Pregunta:** ¿Cuánto dinero genera cada pitch en cada zona?

```javascript
const zonas = [...new Set(window.salesData.map(r => r.zona))];
const pitches = [...new Set(window.salesData.map(r => r.pitchType))];

console.log('💰 INGRESOS POR PITCH Y ZONA\n');

zonas.forEach(zona => {
  console.log(`\n📍 ZONA: ${zona.toUpperCase()}`);
  console.log('─'.repeat(50));
  
  pitches.forEach(pitch => {
    // Sumar montos donde zona=zona y pitch=pitch
    const data = window.SUMIF(
      window.salesData.filter(r => r.zona === zona),
      'pitchType',
      pitch,
      'monto'
    );
    
    if (data.count > 0) {
      console.log(`  ${pitch.padEnd(12)} | $${data.sum.toFixed(2).padEnd(8)} | ${data.count} ventas | Promedio: $${data.average.toFixed(2)}`);
    }
  });
});
```

---

## 3️⃣ Análisis: Efectividad por Origen del Cliente

**Pregunta:** ¿Cuál origen es más proclive a decir "sí"?

```javascript
const origenes = [...new Set(window.salesData.map(r => r.clientOrigin))];

console.log('🌍 TASA DE CONVERSIÓN POR ORIGEN\n');
console.log('Origen'.padEnd(20) + '| Total | Exitosas | Tasa');
console.log('─'.repeat(50));

const estadisticas = {};

origenes.forEach(origen => {
  if (origen === 'unknown') return;
  
  const total = window.COUNTIF(window.salesData, 'clientOrigin', origen);
  const exitosas = window.salesData.filter(r => 
    r.clientOrigin === origen && 
    r.result === 'successful'
  ).length;
  
  const tasa = (exitosas / total * 100).toFixed(1);
  const gasto = window.SUMIF(window.salesData, 'clientOrigin', origen, 'monto');
  
  estadisticas[origen] = {
    total,
    exitosas,
    tasa: parseFloat(tasa),
    gasto_total: gasto.sum,
    ticket_promedio: gasto.average
  };
  
  console.log(
    origen.padEnd(20) + 
    `| ${total.toString().padEnd(5)} | ${exitosas.toString().padEnd(8)} | ${tasa.padEnd(5)}%`
  );
});

console.log('\n💰 GASTO POR ORIGEN:');
console.table(estadisticas);
```

---

## 4️⃣ Análisis: Pitch Más Rentable en Horarios

**Pregunta:** ¿Cuál pitch genera más dinero en cada hora del día?

```javascript
// Extraer horas únicas
const horas = [...new Set(window.salesData.map(r => {
  const hora = parseInt(r.hora.split(':')[0]);
  return hora;
}))].sort((a, b) => a - b);

console.log('⏰ INGRESOS POR PITCH Y HORA DEL DÍA\n');

horas.forEach(hora => {
  console.log(`\n${hora.toString().padStart(2, '0')}:00 - ${(hora+1).toString().padStart(2, '0')}:00`);
  console.log('─'.repeat(40));
  
  const datosHora = window.salesData.filter(r => 
    parseInt(r.hora.split(':')[0]) === hora
  );
  
  const pitches = [...new Set(datosHora.map(r => r.pitchType))];
  
  pitches.forEach(pitch => {
    const suma = window.SUMIF(datosHora, 'pitchType', pitch, 'monto');
    if (suma.count > 0) {
      console.log(
        `  ${pitch.padEnd(12)} → $${suma.sum.toFixed(2)} (${suma.count} ventas)`
      );
    }
  });
});
```

---

## 5️⃣ Análisis: Matriz de Cruce (Pitch × Resultado × Zona)

**Pregunta:** ¿Cuántas ventas exitosas/fallidas por pitch en cada zona?

```javascript
const zonas = [...new Set(window.salesData.map(r => r.zona))];
const pitches = [...new Set(window.salesData.map(r => r.pitchType))];
const resultados = ['successful', 'failed', 'pending'];

console.log('📊 MATRIZ COMPLETA: PITCH × RESULTADO × ZONA\n');

zonas.forEach(zona => {
  console.log(`\n📍 ${zona.toUpperCase()}`);
  console.table(
    pitches.reduce((acc, pitch) => {
      acc[pitch] = {};
      resultados.forEach(res => {
        acc[pitch][res] = window.COUNTIFS(window.salesData, {
          zona: zona,
          pitchType: pitch,
          result: res
        });
      });
      return acc;
    }, {})
  );
});
```

---

## 6️⃣ Análisis: Top Productos Generadores de Ingresos

**Pregunta:** ¿Cuál pitch genera más dinero?

```javascript
const pitches = [...new Set(window.salesData.map(r => r.pitchType))];

const ranking = pitches.map(pitch => {
  const data = window.SUMIF(window.salesData, 'pitchType', pitch, 'monto');
  return {
    pitch,
    ingresos: data.sum,
    ventas: data.count,
    promedio: data.average,
    porcentaje: (data.sum / window.salesData.reduce((s, r) => s + r.monto, 0) * 100).toFixed(1)
  };
}).sort((a, b) => b.ingresos - a.ingresos);

console.log('🏆 TOP PITCHES POR INGRESOS\n');
console.table(ranking);
```

---

## 7️⃣ Análisis: Clientes de Alto Valor

**Pregunta:** ¿Cuáles orígenes gastan más dinero?

```javascript
const origenes = [...new Set(window.salesData.map(r => r.clientOrigin))];

const clientes_alto_valor = origenes
  .map(origen => {
    if (origen === 'unknown') return null;
    const data = window.SUMIF(window.salesData, 'clientOrigin', origen, 'monto');
    return {
      origen,
      gasto_total: data.sum,
      cantidad_clientes: data.count,
      ticket_promedio: data.average,
      tasa_conversion: (window.salesData.filter(r => 
        r.clientOrigin === origen && r.result === 'successful'
      ).length / data.count * 100).toFixed(1)
    };
  })
  .filter(x => x)
  .sort((a, b) => b.gasto_total - a.gasto_total);

console.log('💎 CLIENTES DE ALTO VALOR\n');
console.table(clientes_alto_valor);
```

---

## 8️⃣ Análisis: Comparativa Temporal (Mañana vs Tarde vs Noche)

**Pregunta:** ¿Cuál es el mejor horario para vender?

```javascript
const morningData = window.salesData.filter(r => {
  const hora = parseInt(r.hora.split(':')[0]);
  return hora >= 6 && hora < 12;
});

const afternoonData = window.salesData.filter(r => {
  const hora = parseInt(r.hora.split(':')[0]);
  return hora >= 12 && hora < 18;
});

const eveningData = window.salesData.filter(r => {
  const hora = parseInt(r.hora.split(':')[0]);
  return hora >= 18;
});

const períodos = [
  { nombre: 'Mañana (6-12)', datos: morningData },
  { nombre: 'Tarde (12-18)', datos: afternoonData },
  { nombre: 'Noche (18+)', datos: eveningData }
];

const comparativa = períodos.map(período => {
  const total_ingresos = período.datos.reduce((s, r) => s + r.monto, 0);
  const ventas_exitosas = período.datos.filter(r => r.result === 'successful').length;
  const tasa = (ventas_exitosas / período.datos.length * 100).toFixed(1);
  
  return {
    período: período.nombre,
    ventas_totales: período.datos.length,
    ventas_exitosas,
    tasa_conversión: `${tasa}%`,
    ingresos: `$${total_ingresos.toFixed(2)}`,
    ticket_promedio: `$${(total_ingresos / período.datos.length).toFixed(2)}`
  };
});

console.log('⏰ COMPARATIVA TEMPORAL\n');
console.table(comparativa);
```

---

## 🎯 Resumen de Funciones Usadas

| Función | Uso |
|---------|-----|
| `COUNTIF()` | Contar ocurrencias simples |
| `SUMIF()` | Sumar valores con un criterio |
| `COUNTIFS()` | Contar con múltiples criterios |
| `filter()` | Filtrar datos antes de análisis |
| `map()` | Transformar datos |
| `reduce()` | Agregar valores |
| `sort()` | Ordenar resultados |

---

## 💡 Tips Avanzados

### Guardar análisis en variable
```javascript
const análisis_pitches = window.analyzeByPitch();
```

### Exportar resultados a CSV
```javascript
// Exporta tabla a CSV para Excel
const csv = Object.keys(datos[0]).join(',') + '\n' + 
            datos.map(d => Object.values(d).join(',')).join('\n');
console.log(csv);
```

### Crear gráfico manual
```javascript
// Los datos ya se muestran en gráficos automáticamente
// Pero puedes acceder a los valores crudos así:
const ingresos = window.SUMIF(window.salesData, 'pitchType', 'autoridad', 'monto');
// Usa ingresos.sum en una librería de gráficos
```

---

## ✨ ¡Ahora tienes todas las herramientas para análisis profundos!
