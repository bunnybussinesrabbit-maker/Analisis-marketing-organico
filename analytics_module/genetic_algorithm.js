function geneticAlgorithmRouteOptimization(points, generations = 100) {
  // Población inicial
  let population = Array.from({length: 50}, () => 
    [...points].sort(() => Math.random() - 0.5)
  );
  
  // Función de aptitud (fitness)
  const fitness = (route) => {
    let distance = 0;
    let revenue = 0;
    let timePenalty = 0;
    
    for (let i = 1; i < route.length; i++) {
      // Distancia euclidiana
      distance += Math.sqrt(
        Math.pow(route[i].lng - route[i-1].lng, 2) +
        Math.pow(route[i].lat - route[i-1].lat, 2)
      );
      
      // Ingreso ajustado por probabilidad
      const prob = bayesianConversionProbability(
        route[i].zona, 
        parseInt(route[i].hora), 
        filteredData
      );
      revenue += route[i].revenue * prob;
      
      // Penalización por tiempo
      timePenalty += i * 0.1; // Penaliza visitas tardías
    }
    
    return revenue / (distance + timePenalty);
  };
  
  // Evolución
  for (let gen = 0; gen < generations; gen++) {
    // Evaluar fitness
    const scored = population.map(route => ({
      route,
      score: fitness(route)
    })).sort((a, b) => b.score - a.score);
    
    // Selección (elitismo)
    const elites = scored.slice(0, 10).map(s => s.route);
    
    // Cruzamiento (crossover)
    const newPopulation = [...elites];
    while (newPopulation.length < 50) {
      const parent1 = elites[Math.floor(Math.random() * elites.length)];
      const parent2 = elites[Math.floor(Math.random() * elites.length)];
      
      const child = orderedCrossover(parent1, parent2);
      newPopulation.push(mutate(child, 0.1));
    }
    
    population = newPopulation;
  }
  
  // Mejor ruta
  const best = population.map(route => ({
    route,
    score: fitness(route)
  })).sort((a, b) => b.score - a.score)[0];
  
  return best.route;
}