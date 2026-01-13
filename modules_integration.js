/**
 * Integrador principal de todos los módulos de análisis
 */
class AnalyticsOrchestrator {
  constructor(data) {
    this.data = data;
    this.modules = {};
    this.results = {};
  }

  /**
   * Cargar todos los módulos
   */
  async loadAllModules() {
    console.log('🔧 Cargando módulos de análisis...');
    
    try {
      // Cargar módulos dinámicamente
      const modulePromises = [
        this.loadModule('BayesianSalesAnalytics', './analytics_modules/bayesian_analytics.js'),
        this.loadModule('MonteCarloLogistics', './analytics_modules/montecarlo_logistics.js'),
        this.loadModule('TimeSeriesForecast', './analytics_modules/timeseries_forecast.js'),
        this.loadModule('GeneticAlgorithmOptimizer', './analytics_modules/genetic_algorithm.js'),
        this.loadModule('MarkovDecisionProcess', './analytics_modules/markov_decisions.js'),
        this.loadModule('MarketSaturationModel', './analytics_modules/market_saturation.js')
      ];
      
      await Promise.all(modulePromises);
      console.log('✅ Todos los módulos cargados');
      
    } catch (error) {
      console.error('❌ Error cargando módulos:', error);
      this.loadFallbackModules();
    }
  }

  /**
   * Cargar módulo individual
   */
  async loadModule(className, modulePath) {
    try {
      const module = await import(modulePath);
      this.modules[className] = module.default;
      console.log(`✅ ${className} cargado`);
    } catch (error) {
      console.warn(`⚠️ No se pudo cargar ${className}:`, error.message);
    }
  }

  /**
   * Módulos de respaldo
   */
  loadFallbackModules() {
    console.log('🔄 Cargando módulos de respaldo...');
    
    // Implementaciones mínimas de respaldo
    this.modules.BayesianSalesAnalytics = class {
      calculateZoneHourProbabilities() { return {}; }
    };
    
    this.modules.MonteCarloLogistics = class {
      simulateRoute() { return {}; }
    };
    
    // ... otros módulos mínimos
  }

  /**
   * Ejecutar análisis completo
   */
  async runCompleteAnalysis(options = {}) {
    console.log('🚀 Iniciando análisis completo...');
    
    const analysis = {
      timestamp: new Date().toISOString(),
      dataPoints: this.data.length,
      modulesUsed: [],
      results: {}
    };
    
    // 1. Análisis Bayesiano
    if (this.modules.BayesianSalesAnalytics && options.runBayesian !== false) {
      console.log('🔮 Ejecutando análisis bayesiano...');
      const bayesian = new this.modules.BayesianSalesAnalytics(this.data);
      analysis.results.bayesian = bayesian.calculateZoneHourProbabilities();
      analysis.modulesUsed.push('BayesianSalesAnalytics');
    }
    
    // 2. Series Temporales
    if (this.modules.TimeSeriesForecast && options.runTimeSeries !== false) {
      console.log('📈 Ejecutando análisis de series temporales...');
      const timeSeries = new this.modules.TimeSeriesForecast(this.data);
      analysis.results.timeSeries = timeSeries.analyzeTemporalPatterns();
      analysis.modulesUsed.push('TimeSeriesForecast');
    }
    
    // 3. Saturación de Mercado
    if (this.modules.MarketSaturationModel && options.runSaturation !== false) {
      console.log('🏪 Ejecutando análisis de saturación...');
      const saturation = new this.modules.MarketSaturationModel(this.data);
      analysis.results.saturation = saturation.calculateAllMetrics();
      analysis.modulesUsed.push('MarketSaturationModel');
    }
    
    // 4. Procesos de Markov
    if (this.modules.MarkovDecisionProcess && options.runMarkov !== false) {
      console.log('🎲 Ejecutando procesos de Markov...');
      const mdp = this.modules.MarkovDecisionProcess.createSalesMDP(this.data, {});
      analysis.results.markov = mdp.valueIteration();
      analysis.modulesUsed.push('MarkovDecisionProcess');
    }
    
    console.log(`✅ Análisis completo terminado. Módulos usados: ${analysis.modulesUsed.length}`);
    
    this.results = analysis;
    return analysis;
  }

  /**
   * Optimizar ruta usando todos los módulos
   */
  async optimizeRouteWithAllModules(routePoints, constraints) {
    console.log('🗺️ Optimizando ruta con todos los módulos...');
    
    const optimizations = [];
    
    // Usar cada módulo para optimizar
    if (this.modules.GeneticAlgorithmOptimizer) {
      const ga = new this.modules.GeneticAlgorithmOptimizer();
      optimizations.push({
        method: 'genetic',
        result: ga.optimize(routePoints, constraints.startPoint, constraints)
      });
    }
    
    if (this.modules.MonteCarloLogistics) {
      const mc = new this.modules.MonteCarloLogistics(this.data);
      const route = { points: routePoints, start: constraints.startPoint };
      optimizations.push({
        method: 'monteCarlo',
        result: mc.simulateRoute(route, constraints)
      });
    }
    
    // Combinar resultados
    const combined = this.combineOptimizations(optimizations);
    
    return {
      optimizations,
      combined,
      recommendations: this.generateRouteRecommendations(combined, constraints)
    };
  }

  /**
   * Combinar múltiples optimizaciones
   */
  combineOptimizations(optimizations) {
    if (optimizations.length === 0) return null;
    
    // Promediar resultados
    const routes = optimizations
      .filter(o => o.result && o.result.route)
      .map(o => o.result.route);
    
    if (routes.length === 0) return null;
    
    // Encontrar ruta consenso (simplificado)
    return routes[0]; // Por ahora, devolver la primera
  }

  /**
   * Generar recomendaciones
   */
  generateRouteRecommendations(route, constraints) {
    const recommendations = [];
    
    if (!route) return recommendations;
    
    // Análisis de eficiencia
    const totalDistance = this.calculateRouteDistance(route);
    const totalTime = this.estimateRouteTime(route);
    
    if (totalDistance > (constraints.maxDistance || 50)) {
      recommendations.push({
        type: 'WARNING',
        message: `Ruta muy larga (${totalDistance.toFixed(1)} km). Considerar dividir en dos días.`,
        priority: 'HIGH'
      });
    }
    
    if (totalTime > (constraints.maxTime || 480)) {
      recommendations.push({
        type: 'WARNING',
        message: `Tiempo estimado excesivo (${Math.round(totalTime / 60)} horas). Reducir puntos.`,
        priority: 'HIGH'
      });
    }
    
    // Recomendaciones basadas en análisis anteriores
    if (this.results.bayesian) {
      recommendations.push({
        type: 'INFO',
        message: 'Usar probabilidades bayesianas para priorizar puntos',
        priority: 'MEDIUM'
      });
    }
    
    if (this.results.timeSeries) {
      recommendations.push({
        type: 'INFO',
        message: 'Considerar patrones horarios para programación',
        priority: 'MEDIUM'
      });
    }
    
    return recommendations;
  }

  /**
   * Utilidades
   */
  calculateRouteDistance(route) {
    // Implementación simplificada
    return route.length * 2; // km por punto
  }

  estimateRouteTime(route) {
    // 15 min por punto + 2 min/km
    return route.length * 15 + this.calculateRouteDistance(route) * 2;
  }

  /**
   * Exportar resultados
   */
  exportResults(format = 'json') {
    if (format === 'json') {
      return JSON.stringify(this.results, null, 2);
    }
    
    if (format === 'csv') {
      return this.convertToCSV(this.results);
    }
    
    return this.results;
  }

  convertToCSV(obj) {
    // Implementación básica
    const rows = [];
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object') {
        rows.push(`${key},${JSON.stringify(value)}`);
      } else {
        rows.push(`${key},${value}`);
      }
    }
    
    return rows.join('\n');
  }
}

// Exponer para compatibilidad
if (typeof window !== 'undefined') {
  window.AnalyticsOrchestrator = AnalyticsOrchestrator;
}

export default AnalyticsOrchestrator;