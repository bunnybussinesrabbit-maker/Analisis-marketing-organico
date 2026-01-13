function marketSaturationModel(zone, visitsHistory) {
  // Ley de rendimientos decrecientes
  const totalVisits = visitsHistory[zone] || 0;
  const baseConversion = zoneData[zone].baseConversion || 0.1;
  
  // Modelo logístico (curva S)
  const saturation = 1 / (1 + Math.exp(-0.1 * (totalVisits - 10)));
  const adjustedConversion = baseConversion * (1 - saturation * 0.8);
  
  return {
    currentConversion: adjustedConversion,
    saturationLevel: saturation,
    recommendation: saturation > 0.7 ? 
      `Reducir visitas a ${zone}, mercado saturado` :
      `Mantener ritmo en ${zone}`
  };
}