function timeSeriesAnalysis(zone) {
  // Datos por hora
  const hourlyData = new Array(24).fill(0);
  const hourlyCount = new Array(24).fill(0);
  
  filteredData.filter(d => d.zona === zone).forEach(sale => {
    const hour = parseInt(sale.hora.split(':')[0]);
    hourlyData[hour] += sale.monto;
    hourlyCount[hour]++;
  });
  
  // Suavizado exponencial (Holt-Winters simplificado)
  const alpha = 0.3; // Factor de suavizado
  let smoothed = [...hourlyData];
  
  for (let i = 1; i < 24; i++) {
    smoothed[i] = alpha * hourlyData[i] + (1 - alpha) * smoothed[i - 1];
  }
  
  // Encontrar picos
  const peaks = [];
  for (let i = 1; i < 23; i++) {
    if (smoothed[i] > smoothed[i-1] && smoothed[i] > smoothed[i+1]) {
      peaks.push({
        hour: i,
        value: smoothed[i],
        confidence: hourlyCount[i] / Math.max(...hourlyCount)
      });
    }
  }
  
  return {
    hourlyData,
    smoothed,
    peaks: peaks.sort((a, b) => b.value - a.value).slice(0, 3),
    recommendation: `Horarios óptimos: ${peaks.map(p => p.hour + ':00').join(', ')}`
  };
}