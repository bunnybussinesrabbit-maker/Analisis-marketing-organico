export default class TimeSeriesForecast {
  constructor(data) {
    this.data = data;
    this.zoneHours = this.groupByZoneAndHour();
  }

  groupByZoneAndHour() {
    const map = {};

    for (const d of this.data) {
      const hour = parseInt(d.hora.split(':')[0]);

      if (!map[d.zona]) {
        map[d.zona] = {
          hourlyData: new Array(24).fill(0),
          hourlyCount: new Array(24).fill(0)
        };
      }

      map[d.zona].hourlyData[hour] += d.monto || 1;
      map[d.zona].hourlyCount[hour]++;
    }

    return map;
  }

  smoothSeries(hourlyData) {
    const alpha = 0.3;
    const smoothed = [...hourlyData];

    for (let i = 1; i < 24; i++) {
      smoothed[i] = alpha * hourlyData[i] + (1 - alpha) * smoothed[i - 1];
    }

    return smoothed;
  }

  findPeaks(smoothed, hourlyCount) {
    const peaks = [];
    const maxCount = Math.max(...hourlyCount);

    for (let i = 1; i < 23; i++) {
      if (smoothed[i] > smoothed[i - 1] && smoothed[i] > smoothed[i + 1]) {
        peaks.push({
          hour: i,
          value: smoothed[i],
          confidence: hourlyCount[i] / (maxCount || 1)
        });
      }
    }

    return peaks.sort((a, b) => b.value - a.value).slice(0, 3);
  }

  analyzeZone(zone) {
    const zoneData = this.zoneHours[zone];
    if (!zoneData) return null;

    const smoothed = this.smoothSeries(zoneData.hourlyData);
    const peaks = this.findPeaks(smoothed, zoneData.hourlyCount);

    return {
      zone,
      hourlyData: zoneData.hourlyData,
      smoothed,
      peaks,
      recommendation: `Horarios óptimos en ${zone}: ${peaks
        .map(p => p.hour + ':00')
        .join(', ')}`
    };
  }

  analyzeTemporalPatterns() {
    return Object.keys(this.zoneHours).map(zone =>
      this.analyzeZone(zone)
    );
  }
}
