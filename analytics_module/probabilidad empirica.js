function selectZoneByProbability(distribution) {
  const zones = Object.keys(distribution);
  const probabilities = Object.values(distribution);
  const rand = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < zones.length; i++) {
    cumulative += probabilities[i];
    if (rand <= cumulative) {
      return zones[i];
    }
  }
  return zones[zones.length - 1];
}