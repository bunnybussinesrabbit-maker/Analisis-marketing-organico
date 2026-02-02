/**
 * bayesian_analytics.js - Módulo de probabilidades predictivas (Teorema de Bayes)
 */

export default class BayesianSalesAnalytics {
  constructor(historicalData) {
    this.historicalData = historicalData || [];
  }

  /**
   * Ejecuta el cálculo para una zona y hora específica
   */
  calculateProbability(zone, hour) {
    if (!this.historicalData || this.historicalData.length === 0) return 0.3;

    const totalSales = this.historicalData.length;
    const totalAttempts = totalSales * 3;
    const priorSale = totalSales / totalAttempts;

    const salesInZoneHour = this.historicalData.filter(d =>
      d.zona === zone &&
      parseInt(String(d.hora).split(':')[0]) === parseInt(hour)
    ).length;

    const likelihood = salesInZoneHour / totalSales || 0.1;

    const totalInZoneHour = this.historicalData.filter(d =>
      d.zona === zone ||
      parseInt(String(d.hora).split(':')[0]) === parseInt(hour)
    ).length / 2;

    const evidence = totalInZoneHour / totalSales || 0.15;
    const posterior = (likelihood * priorSale) / evidence;

    return Math.min(0.95, Math.max(0.05, posterior || 0.3));
  }

  /**
   * Ejecución masiva para todas las zonas y horas
   */
  calculateZoneHourProbabilities() {
    const results = {};
    const zones = [...new Set(this.historicalData.map(d => d.zona))];

    zones.forEach(zone => {
      results[zone] = {};
      for (let hour = 8; hour <= 20; hour++) {
        results[zone][hour] = this.calculateProbability(zone, hour);
      }
    });

    return results;
  }
}

/**
 * Función de conveniencia para uso directo (sin instanciar)
 * Útil para otros módulos que solo necesitan un cálculo rápido
 */
export function bayesianConversionProbability(zone, hour, historicalData) {
  const instance = new BayesianSalesAnalytics(historicalData);
  return instance.calculateProbability(zone, hour);
}
