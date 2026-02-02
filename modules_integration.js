/**
 * Integrador principal de todos los módulos de análisis - Geo-Suite Cancún PRO
 */

// 1. Importar módulos analíticos
import BayesianSalesAnalytics from './analytics_module/bayesian_analytics.js';
import GeneticRouteOptimization from './analytics_module/genetic_algorithm.js';
import MonteCarloLogistics from './analytics_module/montecarlo_logistics.js';
import TimeSeriesForecast from './analytics_module/timeseries_forecast.js';
import MarkovDecisions from './analytics_module/markov_decisions.js';
import MarketSaturation from './analytics_module/market_saturation.js';
import CannibalizationAnalysis from './analytics_module/cannibalization_analysis.js';
import CrossDimensionalAnalyzer from './analytics_module/cross_analysis.js';
import ZoneSelector from './analytics_module/empirical_probability.js';

export default class AnalyticsOrchestrator {
  constructor(data = []) {
    // Validar y limpiar datos de entrada
    this.data = Array.isArray(data) ? data : [];
    this.results = {};
    
    // 2. Registro de Módulos (Todas son clases ahora 🏛️)
    this.modules = {
      TimeSeriesForecast,
      MonteCarloLogistics,
      BayesianSalesAnalytics,
      CannibalizationAnalysis,
      CrossDimensionalAnalyzer,
      ZoneSelector,
      GeneticRouteOptimization,
      MarketSaturation,
      MarkovDecisions
    };

    console.log('✅ AnalyticsOrchestrator instanciado correctamente.');
    console.log('📦 Módulos vinculados (Classes):', Object.keys(this.modules));
  }

  /**
   * Ejecuta el flujo completo de análisis asíncrono
   */
  async runCompleteAnalysis(options = {}) {
    console.log('🚀 Iniciando orquestación de análisis completo...');
    
    if (this.data.length === 0) {
      console.warn('⚠️ No hay datos cargados para analizar.');
      return { error: 'No data', results: {} };
    }

    this.results = {
      timestamp: new Date().toISOString(),
      recordCount: this.data.length,
      results: {}
    };

    try {
      // --- Monte Carlo ---
      if (options.runMonteCarlo !== false) {
        this.results.results.monteCarlo = new this.modules.MonteCarloLogistics(this.data).runSimulation();
      }

      // --- Canibalización ---
      if (options.runCannibalization !== false) {
        this.results.results.cannibalization = new this.modules.CannibalizationAnalysis(this.data).analyze();
      }

      // --- Bayesiano ---
      if (options.runBayesian !== false) {
        const bayesian = new this.modules.BayesianSalesAnalytics(this.data);
        const firstZone = this.data[0]?.zona || 'Centro';
        const currentHour = new Date().getHours();
        this.results.results.bayesian = bayesian.calculateProbability(firstZone, currentHour);
      }

      // --- Series Temporales ---
      if (options.runTimeSeries !== false) {
        this.results.results.timeSeries = new this.modules.TimeSeriesForecast(this.data).analyzeTemporalPatterns();
      }

      // --- Saturación ---
      if (options.runSaturation !== false) {
        this.results.results.saturation = new this.modules.MarketSaturation(this.data).calculateAllMetrics();
      }

      // --- Markov ---
      if (options.runMarkov !== false) {
        this.results.results.markov = new this.modules.MarkovDecisions(this.data).valueIteration();
      }

      // --- Probabilidad Empírica ---
      if (options.runEmpirical !== false) {
        this.results.results.empirical = new this.modules.ZoneSelector(this.data).calculateProbabilities();
      }

      // --- Genético ---
      if (options.runGenetic !== false) {
        this.results.results.genetic = new this.modules.GeneticRouteOptimization(this.data).optimize();
      }

      // --- Análisis Cruzado ---
      if (options.runCrossAnalysis !== false) {
        this.results.results.crossAnalysis = new this.modules.CrossDimensionalAnalyzer(this.data).exportData();
      }

      console.log('✅ Análisis completo finalizado.');

      // Adaptación para la interfaz
      return {
        ...this.results,
        modulesUsed: Object.keys(this.results.results),
        dataPoints: this.results.recordCount,
        results: this.results.results // Mantenemos anidado pero también accesible
      };

    } catch (error) {
      console.error('❌ Error crítico en el Orquestador:', error);
      throw error;
    }
  }

  /**
   * Alias de compatibilidad
   */
  async loadAllAnalyticsModules() {
    return await this.runCompleteAnalysis();
  }

  async loadAllModules() {
    return true;
  }

  exportResults() {
    return JSON.stringify(this.results, null, 2);
  }
}
