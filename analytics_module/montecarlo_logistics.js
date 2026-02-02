import bayesianConversionProbability from './bayesian_analytics.js';

export default function monteCarloLogisticSimulation(data, options = {}) {
  const { iterations = 5000 } = options;

  if (!data || data.length === 0) {
    console.warn('⚠️ No hay datos para simulación Monte Carlo');
    return {};
  }

  // Construir rutas desde data
  const routes = data.map(d => ({
    zone: d.zona,
    hour: parseInt(d.hora),
    distance: d.distance || 1,
    expectedRevenue: d.monto || 0
  }));

  const results = [];

  for (let i = 0; i < iterations; i++) {
    let totalRevenue = 0;
    let totalTime = 0;
    let successfulVisits = 0;

    routes.forEach(route => {
      const travelTime = normalRandom(route.distance * 2, 5);

      const conversionProb = bayesianConversionProbability(
        route.zone,
        route.hour,
        data
      );

      const isHome = bernoulliRandom(0.7);
      const willBuy = bernoulliRandom(conversionProb);

      if (isHome && willBuy) {
        successfulVisits++;
        totalRevenue += route.expectedRevenue;
      }

      totalTime += travelTime + (isHome ? 15 : 5);
    });

    results.push({
      revenue: totalRevenue,
      time: totalTime,
      efficiency: totalRevenue / (totalTime || 1),
      successRate: successfulVisits / routes.length
    });
  }

  const revenues = results.map(r => r.revenue);
  const meanRevenue = mean(revenues);
  const stdRevenue = stdDev(revenues, meanRevenue);

  return {
    expectedRevenue: meanRevenue,
    confidenceInterval: [
      meanRevenue - 1.96 * stdRevenue,
      meanRevenue + 1.96 * stdRevenue
    ],
    riskScore: stdRevenue / (meanRevenue || 1)
  };
}

// ------------------ Utilidades estadísticas ------------------

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stdDev(arr, meanVal) {
  const variance =
    arr.reduce((sum, v) => sum + Math.pow(v - meanVal, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

function normalRandom(mean, std) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + std * num;
}

function bernoulliRandom(p) {
  return Math.random() < p;
}
