export default class MarketSaturation {
  constructor(data) {
    this.data = data;
    this.zoneStats = this.buildZoneStats();
  }

  buildZoneStats() {
    const stats = {};

    for (const d of this.data) {
      if (!stats[d.zona]) {
        stats[d.zona] = {
          visits: 0,
          sales: 0
        };
      }

      stats[d.zona].visits++;
      stats[d.zona].sales++;
    }

    for (const z in stats) {
      stats[z].baseConversion =
        stats[z].sales / stats[z].visits || 0.1;
    }

    return stats;
  }

  logisticSaturation(totalVisits) {
    return 1 / (1 + Math.exp(-0.1 * (totalVisits - 10)));
  }

  analyzeZone(zone) {
    const zoneInfo = this.zoneStats[zone];
    if (!zoneInfo) return null;

    const saturation = this.logisticSaturation(zoneInfo.visits);
    const adjustedConversion =
      zoneInfo.baseConversion * (1 - saturation * 0.8);

    return {
      zone,
      visits: zoneInfo.visits,
      currentConversion: adjustedConversion,
      saturationLevel: saturation,
      recommendation:
        saturation > 0.7
          ? `Reducir visitas a ${zone}, mercado saturado`
          : `Mantener ritmo en ${zone}`
    };
  }

  calculateAllMetrics() {
    return Object.keys(this.zoneStats).map(zone =>
      this.analyzeZone(zone)
    );
  }
}
