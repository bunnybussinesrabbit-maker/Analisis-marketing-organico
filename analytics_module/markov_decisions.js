export default class MarkovDecisions {
  constructor(data) {
    this.data = data;
    this.zoneData = this.buildZoneData();
  }

  buildZoneData() {
    const zones = {};

    for (const d of this.data) {
      if (!zones[d.zona]) {
        zones[d.zona] = { visits: 0, sales: 0 };
      }
      zones[d.zona].visits++;
      zones[d.zona].sales++;
    }

    for (const z in zones) {
      zones[z].avgSale = zones[z].sales / zones[z].visits;
    }

    return zones;
  }

  timeFactor(hour) {
    return hour >= 9 && hour <= 18 ? 1.2 : 0.6;
  }

  energyFactor(energy) {
    return energy > 0.5 ? 1 : 0.7;
  }

  distanceCost(zoneA, zoneB) {
    return zoneA === zoneB ? 1 : 5;
  }

  reward(state, action) {
    if (action === 'visitar') {
      const expectedSale =
        (this.zoneData[state.zona]?.avgSale || 0.3) *
        this.timeFactor(state.hora) *
        this.energyFactor(state.energia);

      const travelCost = this.distanceCost(state.zona, state.currentZone);
      return expectedSale - travelCost;
    }

    if (action === 'descansar') {
      return state.energia < 0.3 ? 5 : -2;
    }

    return 0;
  }

  valueIteration() {
    const zones = [...new Set(this.data.map(d => d.zona))];

    const currentState = {
      zona: zones[0],
      currentZone: zones[0],
      hora: 10,
      energia: 0.8
    };

    return zones.map(zone => {
      const state = { ...currentState, zona: zone };

      const value = this.reward(state, 'visitar');

      return {
        zone,
        action:
          value > 0.5
            ? 'visitar'
            : currentState.energia < 0.3
            ? 'descansar'
            : 'saltar',
        expectedValue: value
      };
    }).sort((a, b) => b.expectedValue - a.expectedValue);
  }
}
