function cannibalizationAnalysis(zones) {
  // Matriz de correlación entre zonas
  const matrix = {};
  
  zones.forEach(zoneA => {
    matrix[zoneA] = {};
    zones.forEach(zoneB => {
      if (zoneA !== zoneB) {
        // Calcular correlación de ventas
        const salesA = filteredData.filter(d => d.zona === zoneA).map(d => d.monto);
        const salesB = filteredData.filter(d => d.zona === zoneB).map(d => d.monto);
        
        const corr = pearsonCorrelation(salesA, salesB);
        matrix[zoneA][zoneB] = corr;
      }
    });
  });
  
  // Identificar zonas complementarias vs competitivas
  const recommendations = zones.map(zone => {
    const competitors = Object.entries(matrix[zone])
      .filter(([z, corr]) => corr < -0.5)
      .map(([z]) => z);
    
    const complements = Object.entries(matrix[zone])
      .filter(([z, corr]) => corr > 0.5)
      .map(([z]) => z);
    
    return {
      zone,
      competitors,
      complements,
      strategy: competitors.length > 0 ? 
        `Evitar visitar ${zone} el mismo día que: ${competitors.join(', ')}` :
        `Puede combinarse con: ${complements.join(', ')}`
    };
  });
  
  return recommendations;
}