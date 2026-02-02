/**
 * CROSS-DIMENSIONAL ANALYSIS ENGINE
 * Versión 1.2.0 - Módulo ES6
 */

export default class CrossDimensionalAnalyzer {
  constructor(pitchRecords) {
    if (!Array.isArray(pitchRecords) || pitchRecords.length === 0) {
      throw new Error('CrossDimensionalAnalyzer: Se requiere un array de registros');
    }
    
    this.records = this.normalizePitchRecords(pitchRecords);
    this.dimensions = this.extractDimensions();
    this.hasDemographicData = this.detectDemographicAvailability();
    
    console.log(`✅ CrossDimensionalAnalyzer listo: ${this.records.length} registros`);
  }

  /**
   * Detectar si hay datos demográficos válidos
   */
  detectDemographicAvailability() {
    const nonUnknown = this.records.filter(r => 
      (r.ageGroup && r.ageGroup !== 'unknown') ||
      (r.occupation && r.occupation !== 'unknown') ||
      (r.income && r.income !== 'unknown')
    );
    return nonUnknown.length > 0;
  }

  /**
   * Normalizar registros de pitch con validación robusta
   * Soporta múltiples formatos de entrada
   */
  normalizePitchRecords(records) {
    return records
      .filter(record => record && typeof record === 'object')
      .map((record, idx) => {
        try {
          return {
            // Demográfico (opcional - fallback a 'unknown')
            ageGroup: this.safeString(
              record.age || record.ageGroup || record.edad_grupo || record.age_group,
              'unknown'
            ),
            occupation: this.safeString(
              record.occupation || record.ocupacion || record.job,
              'unknown'
            ),
            income: this.safeString(
              record.income || record.nivel_ingreso || record.income_level,
              'unknown'
            ),
            familyStatus: this.safeString(
              record.familyStatus || record.estado_civil || record.family_status,
              'unknown'
            ),
            
            // Origen (requerido)
            origin: this.safeString(
              record.clientOrigin || record.origin || record.cliente_origen || record.procedencia,
              'unknown'
            ),
            
            // Geográfico (requerido)
            zone: this.safeString(
              record.zone || record.zona || record.region,
              'unknown'
            ).toLowerCase(),
            
            // Pitch (requerido)
            pitchType: this.safeString(
              record.pitchType || record.pitch_type || record.tipo_pitch || record.disertacion,
              'unknown'
            ).toLowerCase(),
            
            // Resultado (requerido)
            result: this.normalizeResult(
              record.result || record.resultado || record.status
            ),
            
            // Financiero
            amount: this.safeNumber(record.amount || record.monto, 0),
            
            // Temporal
            timestamp: this.safeDate(record.timestamp || record.fecha),
            
            // Original para auditoría
            _raw: record
          };
        } catch (e) {
          console.warn(`⚠️ Error normalizando registro ${idx}:`, e.message);
          return null;
        }
      })
      .filter(r => r !== null);
  }

  /**
   * Utilidades de normalización segura
   */
  safeString(value, defaultVal = 'unknown') {
    if (value === null || value === undefined || value === '') return defaultVal;
    return String(value).trim();
  }

  safeNumber(value, defaultVal = 0) {
    const num = parseFloat(value);
    return isNaN(num) ? defaultVal : num;
  }

  safeDate(value) {
    if (!value) return new Date();
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? new Date() : date;
    } catch {
      return new Date();
    }
  }

  normalizeResult(value) {
    if (!value) return 'pending';
    const v = String(value).toLowerCase().trim();
    if (v.includes('success') || v === 'si' || v === 'true' || v === '1') return 'successful';
    if (v.includes('fail') || v === 'no' || v === 'false' || v === '0') return 'failed';
    return 'pending';
  }

  /**
   * Extraer dimensiones únicas
   */
  extractDimensions() {
    return {
      ageGroups: [...new Set(this.records.map(r => r.ageGroup).filter(a => a !== 'unknown'))],
      occupations: [...new Set(this.records.map(r => r.occupation).filter(o => o !== 'unknown'))],
      incomes: [...new Set(this.records.map(r => r.income).filter(i => i !== 'unknown'))],
      origins: [...new Set(this.records.map(r => r.origin).filter(o => o !== 'unknown'))],
      zones: [...new Set(this.records.map(r => r.zone).filter(z => z !== 'unknown'))],
      pitchTypes: [...new Set(this.records.map(r => r.pitchType).filter(p => p !== 'unknown'))],
      results: [...new Set(this.records.map(r => r.result))]
    };
  }

  /**
   * ANÁLISIS 1: Demográfico × Pitch × Zona
   */
  generateDemographicMatrix(filters = {}) {
    const matrix = {};

    this.records.forEach(record => {
      // Aplicar filtros
      if (filters.ageGroup && record.ageGroup !== filters.ageGroup) return;
      if (filters.occupation && record.occupation !== filters.occupation) return;
      if (filters.income && record.income !== filters.income) return;
      if (filters.zone && record.zone !== filters.zone) return;
      if (filters.pitchType && record.pitchType !== filters.pitchType) return;

      // Crear clave única
      const key = `${record.ageGroup}|${record.occupation}|${record.pitchType}|${record.zone}`;

      if (!matrix[key]) {
        matrix[key] = {
          ageGroup: record.ageGroup,
          occupation: record.occupation,
          pitchType: record.pitchType,
          zone: record.zone,
          successful: 0,
          failed: 0,
          pending: 0,
          total: 0,
          totalAmount: 0
        };
      }

      matrix[key][record.result]++;
      matrix[key].total++;
      if (record.result === 'successful') {
        matrix[key].totalAmount += record.amount;
      }
    });

    // Calcular métricas
    return Object.entries(matrix)
      .map(([key, data]) => ({
        key,
        ...data,
        conversionRate: data.total > 0 ? data.successful / data.total : 0,
        avgAmount: data.successful > 0 ? data.totalAmount / data.successful : 0,
        intensity: this.getIntensity(data.successful / (data.total || 1)),
        confidence: this.getConfidence(data.total)
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate);
  }

  /**
   * ANÁLISIS 2: Origen × Pitch × Resultado
   */
  generateOriginMatrix(filters = {}) {
    const matrix = {};

    this.records.forEach(record => {
      // Aplicar filtros
      if (filters.origin && record.origin !== filters.origin) return;
      if (filters.pitchType && record.pitchType !== filters.pitchType) return;
      if (filters.result && record.result !== filters.result) return;

      const key = `${record.origin}|${record.pitchType}`;

      if (!matrix[key]) {
        matrix[key] = {
          origin: record.origin,
          pitchType: record.pitchType,
          successful: 0,
          failed: 0,
          pending: 0,
          total: 0,
          totalAmount: 0
        };
      }

      matrix[key][record.result]++;
      matrix[key].total++;
      if (record.result === 'successful') {
        matrix[key].totalAmount += record.amount;
      }
    });

    return Object.entries(matrix)
      .map(([key, data]) => ({
        key,
        ...data,
        conversionRate: data.total > 0 ? data.successful / data.total : 0,
        avgAmount: data.successful > 0 ? data.totalAmount / data.successful : 0,
        intensity: this.getIntensity(data.successful / (data.total || 1)),
        confidence: this.getConfidence(data.total)
      }))
      .sort((a, b) => b.conversionRate - a.conversionRate);
  }

  /**
   * Obtener Top N combinaciones
   */
  getTopCombinations(analysisType, limit = 10, filters = {}) {
    const matrix = analysisType === 'demographic' 
      ? this.generateDemographicMatrix(filters)
      : this.generateOriginMatrix(filters);

    return matrix
      .filter(item => item.total >= 2) // Mínimo 2 registros
      .slice(0, limit);
  }

  /**
   * Generar insights automáticos
   */
  generateInsights(analysisType, filters = {}) {
    const topCombos = this.getTopCombinations(analysisType, 5, filters);
    const insights = [];

    topCombos.forEach((combo, idx) => {
      let label = '';
      if (analysisType === 'demographic') {
        label = `${combo.ageGroup} - ${combo.occupation}`;
      } else {
        label = `Clientes: ${combo.origin}`;
      }

      insights.push({
        rank: idx + 1,
        label,
        pitchType: combo.pitchType,
        conversionRate: combo.conversionRate,
        count: combo.total,
        successful: combo.successful,
        avgAmount: combo.avgAmount,
        recommendation: this.getRecommendation(combo, analysisType)
      });
    });

    return insights;
  }

  /**
   * Utilidades
   */
  getIntensity(rate) {
    if (rate >= 0.8) return 5;
    if (rate >= 0.6) return 4;
    if (rate >= 0.4) return 3;
    if (rate >= 0.2) return 2;
    return 1;
  }

  getConfidence(count) {
    if (count >= 10) return 'very_high';
    if (count >= 5) return 'high';
    if (count >= 2) return 'medium';
    return 'low';
  }

  getRecommendation(combo, type) {
    const rate = combo.conversionRate;
    if (rate >= 0.7) {
      return '⭐⭐⭐ ESTRATEGIA ÓPTIMA - Maximizar esta combinación';
    } else if (rate >= 0.5) {
      return '⭐⭐ ESTRATEGIA BUENA - Potencial de mejora';
    } else if (rate >= 0.3) {
      return '⭐ ESTRATEGIA ACEPTABLE - Requiere ajuste';
    } else {
      return '❌ ESTRATEGIA DÉBIL - Considerar alternativa';
    }
  }

  /**
   * Método para exportar datos procesados
   */
  exportData(format = 'json') {
    if (format === 'json') {
      return {
        summary: {
          totalRecords: this.records.length,
          hasDemographicData: this.hasDemographicData,
          dimensions: this.dimensions
        },
        demographicAnalysis: this.hasDemographicData ? this.generateDemographicMatrix() : null,
        originAnalysis: this.generateOriginMatrix(),
        insights: {
          withDemographics: this.hasDemographicData ? this.generateInsights('demographic') : [],
          withoutDemographics: this.generateInsights('origin')
        }
      };
    }
    
    // Para otros formatos (CSV, etc.)
    return null;
  }
}