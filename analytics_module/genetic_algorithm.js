import bayesianConversionProbability from './bayesian_analytics.js';

export default function geneticAlgorithmRouteOptimization(data, options = {}) {
  const {
    generations = 100,
    populationSize = 50
  } = options;

  if (!data || data.length === 0) {
    console.warn('⚠️ No hay datos para optimizar');
    return [];
  }

  // Construir puntos desde data (autónomo)
  const points = data.map(d => ({
    zona: d.zona,
    hora: parseInt(d.hora),
    lat: d.lat,
    lng: d.lng,
    revenue: d.monto || 0
  }));

  let population = Array.from({ length: populationSize }, () =>
    [...points].sort(() => Math.random() - 0.5)
  );

  const fitness = (route) => {
    let distance = 0;
    let revenue = 0;

    for (let i = 1; i < route.length; i++) {
      if (route[i].lat && route[i].lng && route[i - 1].lat && route[i - 1].lng) {
        distance += Math.hypot(
          route[i].lng - route[i - 1].lng,
          route[i].lat - route[i - 1].lat
        );
      }

      const prob = bayesianConversionProbability(
        route[i].zona,
        route[i].hora,
        data
      );

      revenue += route[i].revenue * prob;
    }

    return revenue / (distance + 1);
  };

  for (let gen = 0; gen < generations; gen++) {
    const scored = population
      .map(route => ({ route, score: fitness(route) }))
      .sort((a, b) => b.score - a.score);

    const elites = scored.slice(0, 10).map(s => s.route);
    const newPopulation = [...elites];

    while (newPopulation.length < populationSize) {
      const p1 = elites[Math.floor(Math.random() * elites.length)];
      const p2 = elites[Math.floor(Math.random() * elites.length)];
      newPopulation.push(mutate(orderedCrossover(p1, p2)));
    }

    population = newPopulation;
  }

  return population
    .map(route => ({ route, score: fitness(route) }))
    .sort((a, b) => b.score - a.score)[0].route;
}

function orderedCrossover(parent1, parent2) {
  const size = parent1.length;
  const start = Math.floor(Math.random() * size);
  const end = Math.floor(Math.random() * (size - start)) + start;

  const child = new Array(size).fill(null);

  for (let i = start; i <= end; i++) {
    child[i] = parent1[i];
  }

  let idx = 0;
  for (let i = 0; i < size; i++) {
    if (child[i] === null) {
      while (child.includes(parent2[idx])) idx++;
      child[i] = parent2[idx++];
    }
  }

  return child;
}

function mutate(route, rate = 0.1) {
  const r = [...route];
  for (let i = 0; i < r.length; i++) {
    if (Math.random() < rate) {
      const j = Math.floor(Math.random() * r.length);
      [r[i], r[j]] = [r[j], r[i]];
    }
  }
  return r;
}
