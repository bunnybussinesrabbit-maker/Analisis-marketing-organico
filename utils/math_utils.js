/**
 * Utilidades matemáticas avanzadas
 */
export const MathUtils = {
  // Distribuciones de probabilidad
  normalPDF: (x, mean = 0, std = 1) => {
    return (1 / (std * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
  },
  
  normalCDF: (x, mean = 0, std = 1) => {
    return 0.5 * (1 + Math.erf((x - mean) / (std * Math.sqrt(2))));
  },
  
  erf: (x) => {
    // Aproximación de error function
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
  },
  
  // Generación de números aleatorios con distribuciones específicas
  randomNormal: (mean = 0, std = 1) => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * std + mean;
  },
  
  randomLogNormal: (mean = 0, std = 1) => {
    return Math.exp(MathUtils.randomNormal(Math.log(mean), std));
  },
  
  randomExponential: (lambda = 1) => {
    return -Math.log(1 - Math.random()) / lambda;
  },
  
  randomBeta: (alpha, beta) => {
    // Algoritmo de generación Beta
    const gamma1 = MathUtils.randomGamma(alpha, 1);
    const gamma2 = MathUtils.randomGamma(beta, 1);
    return gamma1 / (gamma1 + gamma2);
  },
  
  randomGamma: (shape, scale) => {
    // Algoritmo de Marsaglia y Tsang para gamma
    if (shape < 1) {
      return MathUtils.randomGamma(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
    }
    
    const d = shape - 1 / 3;
    const c = 1 / Math.sqrt(9 * d);
    
    let x, v;
    do {
      do {
        x = MathUtils.randomNormal();
        v = 1 + c * x;
      } while (v <= 0);
      
      v = v * v * v;
      const u = Math.random();
      const condition = u < 1 - 0.0331 * Math.pow(x, 4) || 
                       Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v));
      
      if (condition) {
        return scale * d * v;
      }
    } while (true);
  },
  
  // Estadísticas avanzadas
  skewness: (array) => {
    const mean = MathUtils.mean(array);
    const std = MathUtils.standardDeviation(array);
    const n = array.length;
    
    const cubedDeviations = array.reduce((sum, x) => 
      sum + Math.pow(x - mean, 3), 0
    );
    
    return (cubedDeviations / n) / Math.pow(std, 3);
  },
  
  kurtosis: (array) => {
    const mean = MathUtils.mean(array);
    const std = MathUtils.standardDeviation(array);
    const n = array.length;
    
    const fourthDeviations = array.reduce((sum, x) => 
      sum + Math.pow(x - mean, 4), 0
    );
    
    return (fourthDeviations / n) / Math.pow(std, 4) - 3;
  },
  
  covariance: (arrayX, arrayY) => {
    if (arrayX.length !== arrayY.length) return 0;
    
    const meanX = MathUtils.mean(arrayX);
    const meanY = MathUtils.mean(arrayY);
    const n = arrayX.length;
    
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += (arrayX[i] - meanX) * (arrayY[i] - meanY);
    }
    
    return sum / (n - 1);
  },
  
  correlation: (arrayX, arrayY) => {
    const cov = MathUtils.covariance(arrayX, arrayY);
    const stdX = MathUtils.standardDeviation(arrayX);
    const stdY = MathUtils.standardDeviation(arrayY);
    
    return cov / (stdX * stdY);
  },
  
  // Métricas básicas (por si acaso)
  mean: (array) => array.reduce((a, b) => a + b) / array.length,
  
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
    let mode = array[0];
    
    array.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
      if (frequency[value] > maxFreq) {
        maxFreq = frequency[value];
        mode = value;
      }
    });
    
    return mode;
  },
  
  standardDeviation: (array) => {
    const avg = MathUtils.mean(array);
    const squareDiffs = array.map(value => Math.pow(value - avg, 2));
    return Math.sqrt(MathUtils.mean(squareDiffs));
  },
  
  // Series temporales
  movingAverage: (series, window) => {
    const result = [];
    for (let i = 0; i < series.length; i++) {
      const start = Math.max(0, i - window + 1);
      const slice = series.slice(start, i + 1);
      result.push(MathUtils.mean(slice));
    }
    return result;
  },
  
  exponentialSmoothing: (series, alpha) => {
    const smoothed = [series[0]];
    for (let i = 1; i < series.length; i++) {
      smoothed[i] = alpha * series[i] + (1 - alpha) * smoothed[i - 1];
    }
    return smoothed;
  },
  
  // Optimización
  linearProgramming: (objective, constraints) => {
    // Implementación simplificada del método simplex
    console.log('⚠️ Linear programming requiere librería especializada');
    return { optimal: 0, solution: [] };
  },
  
  // Transformaciones
  normalize: (array, min = 0, max = 1) => {
    const arrayMin = Math.min(...array);
    const arrayMax = Math.max(...array);
    const range = arrayMax - arrayMin;
    
    if (range === 0) return array.map(() => (min + max) / 2);
    
    return array.map(x => 
      min + (max - min) * (x - arrayMin) / range
    );
  },
  
  standardize: (array) => {
    const mean = MathUtils.mean(array);
    const std = MathUtils.standardDeviation(array);
    
    if (std === 0) return array.map(() => 0);
    
    return array.map(x => (x - mean) / std);
  },
  
  // Utilidades geométricas
  distance: (point1, point2) => {
    return Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + 
      Math.pow(point2.y - point1.y, 2)
    );
  },
  
  // Interpolación
  linearInterpolation: (x, x0, y0, x1, y1) => {
    return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
  },
  
  bilinearInterpolation: (x, y, points) => {
    // points: [[x0, y0, v00], [x1, y0, v10], [x0, y1, v01], [x1, y1, v11]]
    const [x0, y0, v00] = points[0];
    const [x1, , v10] = points[1];
    const [, y1, v01] = points[2];
    const [, , v11] = points[3];
    
    const rx = (x - x0) / (x1 - x0);
    const ry = (y - y0) / (y1 - y0);
    
    return v00 * (1 - rx) * (1 - ry) +
           v10 * rx * (1 - ry) +
           v01 * (1 - rx) * ry +
           v11 * rx * ry;
  }
};

if (typeof window !== 'undefined') {
  window.MathUtils = MathUtils;
}

export default MathUtils;