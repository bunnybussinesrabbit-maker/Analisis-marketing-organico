export default class BayesianSalesAnalytics {
  constructor(historicalData) {
    this.historicalData = historicalData;
  }

  calculateZoneHourProbabilities() {
    const results = {};

    for (const record of this.historicalData) {
      const hour = parseInt(record.hora.split(':')[0]);
      const zone = record.zona;

      if (!results[zone]) results[zone] = {};
      if (!results[zone][hour]) {
        results[zone][hour] = this.bayesianConversionProbability(zone, hour);
      }
    }

    return results;
  }

  bayesianConversionProbability(zone, hour) {
    const historicalData = this.historicalData;

    const totalSales = historicalData.length;
    const totalAttempts = totalSales * 3;

    const priorSale = totalSales / totalAttempts;

    const salesInZoneHour = historicalData.filter(d =>
      d.zona === zone &&
      parseInt(d.hora.split(':')[0]) === hour
    ).length;

    const attemptsInZoneHour = salesInZoneHour * 3;

    const likelihood = salesInZoneHour / attemptsInZoneHour || 0.1;

    const totalInZoneHour = salesInZoneHour * 3;

    const evidence = totalInZoneHour / totalAttempts || 0.1;

    const posterior = (likelihood * priorSale) / evidence;

    return Math.min(0.95, Math.max(0.05, posterior || 0.3));
  }
}
