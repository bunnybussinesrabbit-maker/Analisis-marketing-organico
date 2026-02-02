/**
 * Análisis de Canibalización entre Zonas
 * Basado en correlación de ventas históricas
 */

function pearsonCorrelation(x, y) {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, v, i) => sum + v * y[i], 0);
  const sumX2 = x.reduce((sum, v) => sum + v * v, 0);
  const sumY2 = y.reduce((sum, v) => sum + v * v, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt(
    (n * sumX2 - sumX * sumX) *
    (n * sumY2 - sumY * sumY)
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

export default class CannibalizationAnalysis {
  constructor(data) {
    this.data = data;
    this.zones = [...new Set(data.map(d => d.zona))];
  }

  analyze() {
    if (!this.data || this.data.length === 0) {
      console.warn("⚠️ No hay datos para el análisis de canibalización");
      return [];
    }

    const matrix = {};

    for (const zoneA of this.zones) {
      matrix[zoneA] = {};

      for (const zoneB of this.zones) {
        if (zoneA === zoneB) continue;

        const salesA = this.data
          .filter(d => d.zona === zoneA)
          .map(d => d.monto);

        const salesB = this.data
          .filter(d => d.zona === zoneB)
          .map(d => d.monto);

        const corr =
          salesA.length > 0 && salesB.length > 0
            ? pearsonCorrelation(salesA, salesB)
            : 0;

        matrix[zoneA][zoneB] = corr;
      }
    }

    return this.buildRecommendations(matrix);
  }

  buildRecommendations(matrix) {
    return this.zones.map(zone => {
      const competitors = Object.entries(matrix[zone])
        .filter(([_, corr]) => corr < -0.5)
        .map(([z]) => z);

      const complements = Object.entries(matrix[zone])
        .filter(([_, corr]) => corr > 0.5)
        .map(([z]) => z);

      return {
        zone,
        competitors,
        complements,
        strategy:
          competitors.length > 0
            ? `⚠️ Posible canibalización. Evitar visitar ${zone} el mismo día que: ${competitors.join(', ')}`
            : `✅ Sinergia detectada. Puede combinarse con: ${complements.join(', ') || 'N/A'}`
      };
    });
  }
}
