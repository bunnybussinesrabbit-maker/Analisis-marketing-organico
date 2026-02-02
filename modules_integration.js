/**
 * Integrador principal de todos los módulos de análisis - Geo-Suite Cancún PRO
 */

// 1. Importar módulos analíticos (Asegúrate de que las rutas sean correctas)
import bayesianConversionProbability from './analytics_module/bayesian_analytics.js';
import geneticAlgorithmRouteOptimization from './analytics_module/genetic_algorithm.js';
import monteCarloLogisticSimulation from './analytics_module/montecarlo_logistics.js';
import timeSeriesAnalysis from './analytics_module/timeseries_forecast.js';
import markovDecisionProcess from './analytics_module/markov_decisions.js';
import marketSaturationModel from './analytics_module/market_saturation.js';
import cannibalizationAnalysis from './analytics_module/cannibalization_analysis.js';
import CrossDimensionalAnalyzer from './analytics_module/cross_analysis.js';
import selectZoneByProbability from './analytics_module/empirical_probability.js';

export default class AnalyticsOrchestrator {
  constructor(data = []) {
    // Validar y limpiar datos de entrada
    this.data = Array.isArray(data) ? data : [];
    this.results = {};
    
    // 2. Registro de Módulos (Crucial: esto es lo que el index.html busca)
    // Asignamos las funciones y clases importadas a un objeto accesible
    this.modules = {
      TimeSeriesForecast: timeSeriesAnalysis,
      MonteCarloLogistics: monteCarloLogisticSimulation, // Función directa
      BayesianSalesAnalytics: bayesianConversionProbability,
      CannibalizationAnalysis: cannibalizationAnalysis, // Clase
      CrossDimensionalAnalyzer: CrossDimensionalAnalyzer, // Clase
      ZoneSelector: selectZoneByProbability,
      GeneticRouteOptimization: geneticAlgorithmRouteOptimization,
      MarketSaturation: marketSaturationModel,
      MarkovDecisions: markovDecisionProcess
    };

    console.log('✅ AnalyticsOrchestrator instanciado correctamente.');
    console.log('📦 Módulos vinculados:', Object.keys(this.modules));
  }

  /**
   * Ejecuta el flujo completo de análisis asíncrono
   * @param {Object} options - Filtros para ejecutar solo ciertos análisis
   */
  async runCompleteAnalysis(options = {}) {
    console.log('🚀 Iniciando orquestación de análisis...');
    
    if (this.data.length === 0) {
      console.warn('⚠️ No hay datos cargados para analizar.');
      return { error: 'No data', results: {} };
    }

    // Inicializar estructura de resultados
    this.results = {
      timestamp: new Date().toISOString(),
      recordCount: this.data.length,
      results: {}
    };

    try {
      // --- Ejecución: Monte Carlo (Función) ---
      if (options.runMonteCarlo !== false) {
        console.log('🎲 Ejecutando: Monte Carlo...');
        // Llamada directa a la función exportada en montecarlo_logistics.js
        this.results.results.monteCarlo = this.modules.MonteCarloLogistics(this.data);
      }

      // --- Ejecución: Canibalización (Clase) ---
      if (options.runCannibalization !== false) {
        console.log('📉 Ejecutando: Análisis de Canibalización...');
        // Instanciamos la clase con los datos
        const cannibalInstance = new this.modules.CannibalizationAnalysis(this.data);
        this.results.results.cannibalization = cannibalInstance.analyze();
      }

      // --- Ejecución: Bayesiano (Función) ---
      if (options.runBayesian !== false) {
        console.log('📊 Ejecutando: Análisis Bayesiano...');
        // Ejemplo con zona por defecto 'Centro' si no hay datos
        const firstZone = this.data[0]?.zona || 'Centro';
        this.results.results.bayesian = this.modules.BayesianSalesAnalytics(
          firstZone, 
          new Date().getHours(), 
          this.data
        );
      }

      // Se pueden agregar más módulos aquí siguiendo el mismo patrón...

      console.log('✅ Análisis completo finalizado con éxito.');
      return this.results;

    } catch (error) {
      console.error('❌ Error crítico en el Orquestador:', error);
      throw error;
    }
  }

  /**
   * Genera insights estratégicos basados en los resultados acumulados
   */
  generateInsights() {
    const insights = [];
    const r = this.results.results;

    if (r?.monteCarlo?.riskScore > 0.5) {
      insights.push({
        type: 'WARNING',
        message: 'Riesgo logístico elevado detectado por simulación.',
        priority: 'HIGH'
      });
    }

    if (r?.cannibalization?.conflicts?.length > 0) {
      insights.push({
        type: 'DANGER',
        message: `Conflicto de zonas detectado en ${r.cannibalization.conflicts.length} puntos.`,
        priority: 'CRITICAL'
      });
    }

    return insights;
  }

  /**
   * Alias de compatibilidad para versiones anteriores del código
   */
  async loadAllAnalyticsModules() {
    return await this.runCompleteAnalysis();
  }
}