/**
 * bayesian_analytics.js - Módulo de probabilidades predictivas (Teorema de Bayes)
 */

/**
 * Función principal para cálculo de probabilidad posterior
 * @param {string} zone - Zona objetivo
 * @param {number} hour - Hora del día (0-23)
 * @param {Array} historicalData - Dataset de ventas
 * @returns {number} Probabilidad de conversión (0.05 a 0.95)
 */
export default function bayesianConversionProbability(zone, hour, historicalData) {
  if (!historicalData || historicalData.length === 0) return 0.3;

  // 1. Prior: Probabilidad general de venta en todo el dataset
  // Supongamos que cada registro es un intento exitoso, y estimamos intentos fallidos (ej. x3)
  const totalSales = historicalData.length;
  const totalAttempts = totalSales * 3; // Ratio estimado 1:3
  const priorSale = totalSales / totalAttempts;

  // 2. Likelihood: P(Zona e Hora | Venta)
  // ¿Qué tan frecuente es esta zona y hora cuando hay una venta?
  const salesInZoneHour = historicalData.filter(d =>
    d.zona === zone &&
    parseInt(String(d.hora).split(':')[0]) === parseInt(hour)
  ).length;

  const likelihood = salesInZoneHour / totalSales || 0.1;

  // 3. Evidence: P(Zona e Hora)
  // ¿Qué tan frecuente es que estemos en esa zona a esa hora en general?
  // Estimación basada en la distribución de los datos
  const totalInZoneHour = historicalData.filter(d =>
    d.zona === zone ||
    parseInt(String(d.hora).split(':')[0]) === parseInt(hour)
  ).length / 2; // Promedio simple para evidencia

  const evidence = totalInZoneHour / totalSales || 0.15;

  // 4. Teorema de Bayes: P(Venta | Zona e Hora) = (Likelihood * Prior) / Evidence
  const posterior = (likelihood * priorSale) / evidence;

  // Normalizar resultado entre 5% y 95%
  return Math.min(0.95, Math.max(0.05, posterior || 0.3));
}

/**
 * Clase envolvente para análisis masivo (opcional, para compatibilidad con orquestador)
 */
export class BayesianSalesAnalytics {
  constructor(historicalData) {
    this.historicalData = historicalData;
  }

  calculateZoneHourProbabilities() {
    const results = {};
    const zones = [...new Set(this.historicalData.map(d => d.zona))];

    zones.forEach(zone => {
      results[zone] = {};
      for (let hour = 8; hour <= 20; hour++) {
        results[zone][hour] = bayesianConversionProbability(zone, hour, this.historicalData);
      }
    });

    return results;
  }
}
