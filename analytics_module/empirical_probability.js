export default class ZoneSelector {
  constructor(data) {
    this.data = data;
    this.distribution = this.buildDistribution();
  }

  buildDistribution() {
    const zoneCount = {};

    for (const d of this.data) {
      zoneCount[d.zona] = (zoneCount[d.zona] || 0) + 1;
    }

    const total = Object.values(zoneCount).reduce((a, b) => a + b, 0);

    const distribution = {};
    for (const zone in zoneCount) {
      distribution[zone] = zoneCount[zone] / total;
    }

    return distribution;
  }

  selectZone() {
    const rand = Math.random();
    let cumulative = 0;

    for (const [zone, probability] of Object.entries(this.distribution)) {
      cumulative += probability;
      if (rand <= cumulative) return zone;
    }

    // fallback
    return Object.keys(this.distribution).pop();
  }

  calculateProbabilities() {
    return {
      distribution: this.distribution,
      suggestedZone: this.selectZone()
    };
  }
}
