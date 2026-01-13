function monteCarloLogisticSimulation(routes, iterations = 10000) {
  const results = [];
  
  for (let i = 0; i < iterations; i++) {
    let totalRevenue = 0;
    let totalTime = 0;
    let successfulVisits = 0;
    
    routes.forEach(route => {
      // Simular variables aleatorias
      const travelTime = normalRandom(route.distance * 2, 5); // minutos por km
      const conversionProb = bayesianConversionProbability(route.zone, route.hour, filteredData);
      const isHome = bernoulliRandom(0.7); // 70% probabilidad de estar en casa
      const willBuy = bernoulliRandom(conversionProb);
      
      if (isHome && willBuy) {
        successfulVisits++;
        totalRevenue += route.expectedRevenue;
      }
      
      totalTime += travelTime + (isHome ? 15 : 5); // 15 min si está, 5 min si no
    });
    
    results.push({
      revenue: totalRevenue,
      time: totalTime,
      efficiency: totalRevenue / totalTime,
      successRate: successfulVisits / routes.length
    });
  }
  
  // Calcular estadísticas
  const revenues = results.map(r => r.revenue);
  const meanRevenue = revenues.reduce((a, b) => a + b) / revenues.length;
  const stdRevenue = Math.sqrt(
    revenues.reduce((sq, n) => sq + Math.pow(n - meanRevenue, 2), 0) / revenues.length
  );
  
  return {
    expectedRevenue: meanRevenue,
    confidenceInterval: [
      meanRevenue - 1.96 * stdRevenue,
      meanRevenue + 1.96 * stdRevenue
    ],
    bestRoute: results.sort((a, b) => b.efficiency - a.efficiency)[0],
    riskScore: stdRevenue / meanRevenue // Coeficiente de variación
  };
}