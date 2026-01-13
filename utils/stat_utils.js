/**
 * Utilidades estadísticas avanzadas
 */
export const StatsUtils = {
  /**
   * Métricas descriptivas básicas
   */
  descriptiveStats: (array) => {
    if (!array || array.length === 0) {
      return {
        count: 0,
        mean: 0,
        median: 0,
        mode: 0,
        std: 0,
        variance: 0,
        min: 0,
        max: 0,
        range: 0,
        iqr: 0
      };
    }
    
    const sorted = [...array].sort((a, b) => a - b);
    const count = sorted.length;
    const mean = StatsUtils.mean(sorted);
    const median = StatsUtils.median(sorted);
    const mode = StatsUtils.mode(sorted);
    const std = StatsUtils.standardDeviation(sorted);
    const variance = std * std;
    const min = sorted[0];
    const max = sorted[count - 1];
    const range = max - min;
    
    // Rango intercuartílico
    const q1 = StatsUtils.quantile(sorted, 0.25);
    const q3 = StatsUtils.quantile(sorted, 0.75);
    const iqr = q3 - q1;
    
    return {
      count,
      mean: parseFloat(mean.toFixed(4)),
      median: parseFloat(median.toFixed(4)),
      mode: parseFloat(mode.toFixed(4)),
      std: parseFloat(std.toFixed(4)),
      variance: parseFloat(variance.toFixed(4)),
      min: parseFloat(min.toFixed(4)),
      max: parseFloat(max.toFixed(4)),
      range: parseFloat(range.toFixed(4)),
      q1: parseFloat(q1.toFixed(4)),
      q3: parseFloat(q3.toFixed(4)),
      iqr: parseFloat(iqr.toFixed(4)),
      skewness: StatsUtils.skewness(sorted),
      kurtosis: StatsUtils.kurtosis(sorted)
    };
  },
  
  /**
   * Métricas básicas
   */
  mean: (array) => {
    return array.reduce((a, b) => a + b, 0) / array.length;
  },
  
  median: (array) => {
    const sorted = [...array].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0 ?
      (sorted[mid - 1] + sorted[mid]) / 2 :
      sorted[mid];
  },
  
  mode: (array) => {
    const frequency = {};
    let maxFreq = 0;
    let modes = [];
    
    array.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
      
      if (frequency[value] > maxFreq) {
        maxFreq = frequency[value];
        modes = [value];
      } else if (frequency[value] === maxFreq) {
        modes.push(value);
      }
    });
    
    return modes.length === 1 ? modes[0] : modes;
  },
  
  standardDeviation: (array, isSample = true) => {
    const avg = StatsUtils.mean(array);
    const squareDiffs = array.map(value => Math.pow(value - avg, 2));
    const variance = StatsUtils.mean(squareDiffs);
    
    // Ajustar por n-1 si es muestra
    const adjust = isSample ? array.length / (array.length - 1) : 1;
    
    return Math.sqrt(variance * adjust);
  },
  
  /**
   * Cuantiles y percentiles
   */
  quantile: (array, p) => {
    const sorted = [...array].sort((a, b) => a - b);
    const index = (sorted.length - 1) * p;
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    
    if (lower === upper) {
      return sorted[lower];
    }
    
    // Interpolación lineal
    return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
  },
  
  percentile: (array, p) => {
    return StatsUtils.quantile(array, p / 100);
  },
  
  /**
   * Asimetría y curtosis
   */
  skewness: (array) => {
    const mean = StatsUtils.mean(array);
    const std = StatsUtils.standardDeviation(array);
    const n = array.length;
    
    const cubedDeviations = array.reduce((sum, x) => 
      sum + Math.pow(x - mean, 3), 0
    );
    
    return (cubedDeviations / n) / Math.pow(std, 3);
  },
  
  kurtosis: (array) => {
    const mean = StatsUtils.mean(array);
    const std = StatsUtils.standardDeviation(array);
    const n = array.length;
    
    const fourthDeviations = array.reduce((sum, x) => 
      sum + Math.pow(x - mean, 4), 0
    );
    
    return (fourthDeviations / n) / Math.pow(std, 4) - 3;
  },
  
  /**
   * Correlación y covarianza
   */
  covariance: (arrayX, arrayY, isSample = true) => {
    if (arrayX.length !== arrayY.length) {
      throw new Error('Arrays must have same length');
    }
    
    const meanX = StatsUtils.mean(arrayX);
    const meanY = StatsUtils.mean(arrayY);
    const n = arrayX.length;
    
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += (arrayX[i] - meanX) * (arrayY[i] - meanY);
    }
    
    // Ajustar por n-1 si es muestra
    const adjust = isSample ? n / (n - 1) : 1;
    
    return (sum / n) * adjust;
  },
  
  correlation: (arrayX, arrayY) => {
    const cov = StatsUtils.covariance(arrayX, arrayY);
    const stdX = StatsUtils.standardDeviation(arrayX);
    const stdY = StatsUtils.standardDeviation(arrayY);
    
    return cov / (stdX * stdY);
  },
  
  /**
   * Pruebas de hipótesis
   */
  tTest: (sample1, sample2, options = {}) => {
    const {
      paired = false,
      alternative = 'two-sided',
      alpha = 0.05
    } = options;
    
    const n1 = sample1.length;
    const n2 = sample2.length;
    
    if (paired && n1 !== n2) {
      throw new Error('Paired test requires equal sample sizes');
    }
    
    const mean1 = StatsUtils.mean(sample1);
    const mean2 = StatsUtils.mean(sample2);
    const std1 = StatsUtils.standardDeviation(sample1);
    const std2 = StatsUtils.standardDeviation(sample2);
    
    let tStat, df;
    
    if (paired) {
      // Prueba t pareada
      const differences = sample1.map((x, i) => x - sample2[i]);
      const meanDiff = StatsUtils.mean(differences);
      const stdDiff = StatsUtils.standardDeviation(differences);
      
      tStat = meanDiff / (stdDiff / Math.sqrt(n1));
      df = n1 - 1;
    } else {
      // Prueba t independiente (asumiendo varianzas iguales)
      const pooledVariance = ((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2);
      tStat = (mean1 - mean2) / Math.sqrt(pooledVariance * (1/n1 + 1/n2));
      df = n1 + n2 - 2;
    }
    
    // Valor p (aproximado usando distribución t)
    const pValue = StatsUtils.tDistributionPValue(tStat, df, alternative);
    
    return {
      tStat: parseFloat(tStat.toFixed(4)),
      df: df,
      pValue: parseFloat(pValue.toFixed(4)),
      significant: pValue < alpha,
      mean1: parseFloat(mean1.toFixed(4)),
      mean2: parseFloat(mean2.toFixed(4)),
      meanDiff: parseFloat((mean1 - mean2).toFixed(4)),
      ci: StatsUtils.tConfidenceInterval(mean1 - mean2, tStat, df, alpha)
    };
  },
  
  /**
   * Valor p para distribución t
   */
  tDistributionPValue: (t, df, alternative = 'two-sided') => {
    // Aproximación usando función beta incompleta
    const x = df / (df + t * t);
    const p = 0.5 * StatsUtils.betaRegularized(x, df / 2, 0.5);
    
    if (alternative === 'two-sided') {
      return 2 * Math.min(p, 1 - p);
    } else if (alternative === 'greater') {
      return t > 0 ? 1 - p : p;
    } else { // 'less'
      return t < 0 ? 1 - p : p;
    }
  },
  
  /**
   * Intervalo de confianza t
   */
  tConfidenceInterval: (mean, tStat, df, alpha = 0.05) => {
    // Encontrar valor crítico t
    const tCritical = StatsUtils.tCriticalValue(df, alpha);
    const margin = tCritical * Math.abs(tStat);
    
    return [
      parseFloat((mean - margin).toFixed(4)),
      parseFloat((mean + margin).toFixed(4))
    ];
  },
  
  /**
   * Valor crítico t (aproximado)
   */
  tCriticalValue: (df, alpha = 0.05) => {
    // Aproximación para valores comunes
    const commonValues = {
      1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
      6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
      20: 2.086, 30: 2.042, 60: 2.000, 120: 1.980, Infinity: 1.960
    };
    
    // Encontrar valor más cercano
    const dfs = Object.keys(commonValues).map(Number);
    const closestDf = dfs.reduce((prev, curr) => 
      Math.abs(curr - df) < Math.abs(prev - df) ? curr : prev
    );
    
    return commonValues[closestDf];
  },
  
  /**
   * Función beta regularizada (aproximada)
   */
  betaRegularized: (x, a, b) => {
    // Aproximación usando serie
    if (x < 0 || x > 1) return 0;
    if (x === 0) return 0;
    if (x === 1) return 1;
    
    const eps = 1e-10;
    let result = 0;
    let term = 1;
    let m = 0;
    
    while (Math.abs(term) > eps && m < 1000) {
      term = Math.pow(x, a + m) * Math.pow(1 - x, b) * 
             StatsUtils.gamma(a + b) / 
             (StatsUtils.gamma(a + m + 1) * StatsUtils.gamma(b)) *
             StatsUtils.binomialCoefficient(-b, m);
      
      result += term;
      m++;
    }
    
    return result;
  },
  
  /**
   * Función gamma (aproximación de Lanczos)
   */
  gamma: (z) => {
    const g = 7;
    const p = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * StatsUtils.gamma(1 - z));
    }
    
    z -= 1;
    let x = p[0];
    
    for (let i = 1; i < g + 2; i++) {
      x += p[i] / (z + i);
    }
    
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  },
  
  /**
   * Coeficiente binomial
   */
  binomialCoefficient: (n, k) => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    k = Math.min(k, n - k);
    let result = 1;
    
    for (let i = 1; i <= k; i++) {
      result *= (n - k + i) / i;
    }
    
    return Math.round(result);
  },
  
  /**
   * Análisis de regresión lineal
   */
  linearRegression: (x, y) => {
    if (x.length !== y.length) {
      throw new Error('Arrays must have same length');
    }
    
    const n = x.length;
    const meanX = StatsUtils.mean(x);
    const meanY = StatsUtils.mean(y);
    
    let ssx = 0;
    let ssy = 0;
    let sxy = 0;
    
    for (let i = 0; i < n; i++) {
      const dx = x[i] - meanX;
      const dy = y[i] - meanY;
      
      ssx += dx * dx;
      ssy += dy * dy;
      sxy += dx * dy;
    }
    
    const slope = sxy / ssx;
    const intercept = meanY - slope * meanX;
    const rSquared = Math.pow(sxy / Math.sqrt(ssx * ssy), 2);
    
    // Error estándar
    let sse = 0;
    for (let i = 0; i < n; i++) {
      const predicted = slope * x[i] + intercept;
      sse += Math.pow(y[i] - predicted, 2);
    }
    
    const stdError = Math.sqrt(sse / (n - 2));
    const slopeStdError = stdError / Math.sqrt(ssx);
    
    return {
      slope: parseFloat(slope.toFixed(4)),
      intercept: parseFloat(intercept.toFixed(4)),
      rSquared: parseFloat(rSquared.toFixed(4)),
      stdError: parseFloat(stdError.toFixed(4)),
      slopeStdError: parseFloat(slopeStdError.toFixed(4)),
      predictions: x.map(xi => slope * xi + intercept)
    };
  },
  
  /**
   * Análisis ANOVA
   */
  anova: (groups) => {
    const k = groups.length;
    const n = groups.reduce((sum, group) => sum + group.length, 0);
    
    // Medias
    const groupMeans = groups.map(group => StatsUtils.mean(group));
    const overallMean = StatsUtils.mean(groups.flat());
    
    // Suma de cuadrados
    let ssBetween = 0;
    let ssWithin = 0;
    
    groups.forEach((group, i) => {
      ssBetween += group.length * Math.pow(groupMeans[i] - overallMean, 2);
      
      group.forEach(value => {
        ssWithin += Math.pow(value - groupMeans[i], 2);
      });
    });
    
    // Grados de libertad
    const dfBetween = k - 1;
    const dfWithin = n - k;
    const dfTotal = n - 1;
    
    // Cuadrados medios
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;
    
    // Estadístico F
    const fStat = msBetween / msWithin;
    
    // Valor p (usando distribución F)
    const pValue = StatsUtils.fDistributionPValue(fStat, dfBetween, dfWithin);
    
    return {
      ssBetween: parseFloat(ssBetween.toFixed(4)),
      ssWithin: parseFloat(ssWithin.toFixed(4)),
      ssTotal: parseFloat((ssBetween + ssWithin).toFixed(4)),
      dfBetween: dfBetween,
      dfWithin: dfWithin,
      dfTotal: dfTotal,
      msBetween: parseFloat(msBetween.toFixed(4)),
      msWithin: parseFloat(msWithin.toFixed(4)),
      fStat: parseFloat(fStat.toFixed(4)),
      pValue: parseFloat(pValue.toFixed(4)),
      significant: pValue < 0.05
    };
  },
  
  /**
   * Valor p para distribución F (aproximado)
   */
  fDistributionPValue: (f, df1, df2) => {
    // Aproximación usando función beta
    const x = df2 / (df2 + df1 * f);
    return StatsUtils.betaRegularized(x, df2 / 2, df1 / 2);
  },
  
  /**
   * Bootstrap para intervalos de confianza
   */
  bootstrapCI: (data, statisticFunc, options = {}) => {
    const {
      samples = 1000,
      ci = 0.95,
      seed = null
    } = options;
    
    if (seed !== null) {
      Math.seedrandom(seed);
    }
    
    const stats = [];
    
    for (let i = 0; i < samples; i++) {
      // Muestra bootstrap con reemplazo
      const sample = Array.from({ length: data.length }, () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
      });
      
      stats.push(statisticFunc(sample));
    }
    
    // Ordenar estadísticas
    stats.sort((a, b) => a - b);
    
    // Calcular percentiles
    const lowerIndex = Math.floor(samples * (1 - ci) / 2);
    const upperIndex = Math.floor(samples * (1 + ci) / 2);
    
    return {
      estimate: statisticFunc(data),
      ciLower: stats[lowerIndex],
      ciUpper: stats[upperIndex],
      bootstrapStats: stats
    };
  },
  
  /**
   * Test de normalidad (Shapiro-Wilk simplificado)
   */
  shapiroWilk: (data) => {
    const sorted = [...data].sort((a, b) => a - b);
    const n = sorted.length;
    
    if (n < 3 || n > 5000) {
      console.warn('Shapiro-Wilk requiere n entre 3 y 5000');
      return { w: 1, p: 1, normal: true };
    }
    
    // Coeficientes aproximados (simplificado)
    // En producción, usar tabla completa de coeficientes
    
    const mean = StatsUtils.mean(sorted);
    const ss = sorted.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0);
    
    // Estadístico W simplificado
    let wNumerator = 0;
    for (let i = 0; i < Math.floor(n / 2); i++) {
      const a = StatsUtils.shapiroWilkCoefficient(n, i + 1);
      wNumerator += a * (sorted[n - i - 1] - sorted[i]);
    }
    
    const w = Math.pow(wNumerator, 2) / ss;
    
    // Transformación para valor p (aproximación)
    const u = Math.log(1 - w);
    const p = Math.exp(-Math.exp(u));
    
    return {
      w: parseFloat(w.toFixed(4)),
      pValue: parseFloat(p.toFixed(4)),
      normal: p > 0.05
    };
  },
  
  /**
   * Coeficientes de Shapiro-Wilk (aproximados)
   */
  shapiroWilkCoefficient: (n, i) => {
    // Valores aproximados para n comunes
    // En producción, usar tabla completa
    
    if (n <= 10) {
      const smallCoefficients = {
        3: [0.7071],
        4: [0.6872, 0.1677],
        5: [0.6646, 0.2413],
        6: [0.6431, 0.2806, 0.0875],
        7: [0.6233, 0.3031, 0.1401],
        8: [0.6052, 0.3164, 0.1743, 0.0561],
        9: [0.5888, 0.3244, 0.1976, 0.0947],
        10: [0.5739, 0.3291, 0.2141, 0.1224, 0.0399]
      };
      
      return smallCoefficients[n]?.[i - 1] || 0;
    }
    
    // Para n > 10, aproximación
    const m = StatsUtils.normalQuantile((i - 0.375) / (n + 0.25));
    const u = 1 / Math.sqrt(n);
    
    return m + u * (0.1570796 * m - 0.1479812);
  },
  
  /**
   * Cuantil normal (aproximación de Beasley-Springer-Moro)
   */
  normalQuantile: (p) => {
    if (p <= 0 || p >= 1) return 0;
    
    const a = [-39.696830, 220.946098, -275.928510, 138.357751, -30.664798, 2.506628];
    const b = [-54.476098, 161.585836, -155.698979, 66.801311, -13.280681];
    const c = [-7.784894, -0.322396, -2.400758, -2.549732, 4.374664, 2.938163];
    const d = [7.784695, 3.969646, 0.150108, 0.003067];
    
    let q, r;
    
    if (p < 0.02425) {
      q = Math.sqrt(-2 * Math.log(p));
      q = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= 0.97575) {
      q = p - 0.5;
      r = q * q;
      q = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
          (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
      q = Math.sqrt(-2 * Math.log(1 - p));
      q = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
          ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
    
    return q;
  }
};

// Polyfill para Math.seedrandom si no existe
if (typeof Math.seedrandom !== 'function') {
  Math.seedrandom = function(seed) {
    // Implementación simple
    let x = 0;
    for (let i = 0; i < seed.length; i++) {
      x += seed.charCodeAt(i);
    }
    const random = () => {
      x = Math.sin(x) * 10000;
      return x - Math.floor(x);
    };
    
    // Reemplazar Math.random temporalmente
    const originalRandom = Math.random;
    Math.random = random;
    
    return () => {
      Math.random = originalRandom;
    };
  };
}

if (typeof window !== 'undefined') {
  window.StatsUtils = StatsUtils;
}

export default StatsUtils;