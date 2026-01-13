function bayesianConversionProbability(zone, hour, historicalData) {
  // Teorema de Bayes: P(venta|zona,hora) = P(zona,hora|venta) * P(venta) / P(zona,hora)
  
  const totalSales = historicalData.length;
  const totalAttempts = totalSales * 3; // Suponiendo 3 intentos por venta
  
  // Probabilidad previa (prior)
  const priorSale = totalSales / totalAttempts;
  
  // Verosimilitud (likelihood)
  const salesInZoneHour = historicalData.filter(d => 
    d.zona === zone && 
    parseInt(d.hora.split(':')[0]) === hour
  ).length;
  
  const attemptsInZoneHour = salesInZoneHour * 3; // Estimación
  
  const likelihood = salesInZoneHour / attemptsInZoneHour;
  
  // Evidencia (marginal)
  const totalInZoneHour = historicalData.filter(d => 
    d.zona === zone && 
    parseInt(d.hora.split(':')[0]) === hour
  ).length * 3;
  
  const evidence = totalInZoneHour / totalAttempts;
  
  // Probabilidad posterior
  const posterior = (likelihood * priorSale) / evidence;
  
  return Math.min(0.95, Math.max(0.05, posterior || 0.3));
}