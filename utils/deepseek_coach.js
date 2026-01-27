/**
 * DeepSeek Sales Coach - LLM Integration for Geo-Suite Cancún PRO
 * Replaces Groq integration with DeepSeek API
 * Provides sales coaching, strategy analysis, and decision support via DeepSeek
 */

class DeepSeekSalesCoach {
  constructor(apiKey = null) {
    this.apiKey = apiKey || localStorage.getItem('deepseekApiKey');
    this.model = 'deepseek-chat';
    this.baseURL = 'https://api.deepseek.com/v1';
    this.maxRetries = 3;
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Validate DeepSeek API connection and key
   * @returns {Promise<boolean>} True if connection successful
   */
  async validateConnection() {
    if (!this.apiKey) {
      console.error('❌ DeepSeek API key not found');
      return false;
    }

    try {
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: this.timeout
      });

      if (response.ok) {
        console.log('✅ DeepSeek API connection validated');
        return true;
      } else if (response.status === 401) {
        console.error('❌ Invalid DeepSeek API key');
        return false;
      } else {
        console.error('❌ DeepSeek API error:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('❌ DeepSeek connection failed:', error.message);
      return false;
    }
  }

  /**
   * Send prompt to DeepSeek and get response
   * @param {string} userPrompt - User's input prompt
   * @param {object} contextData - Zone/strategy context from Cancún analytics
   * @returns {Promise<string>} DeepSeek response text
   */
  async sendPrompt(userPrompt, contextData = {}) {
    if (!this.apiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    // Enrich prompt with Cancún context
    const enhancedPrompt = this._enrichPromptWithContext(userPrompt, contextData);

    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'Eres un experto en ventas puerta a puerta (D2D) en Cancún. Proporciona recomendaciones prácticas basadas en datos de zonas, demografía y patrones de conversión.'
            },
            {
              role: 'user',
              content: enhancedPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 0.9
        }),
        timeout: this.timeout
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ DeepSeek prompt error:', error.message);
      throw error;
    }
  }

  /**
   * Analyze pitch strategies for a specific zone
   * @param {string} zone - Zone ID (e.g., 'zona_hotelera')
   * @param {array} historicalData - Historical pitch data for context
   * @returns {Promise<object>} Strategy analysis and recommendations
   */
  async analyzeStrategies(zone, historicalData = []) {
    const context = {
      zone,
      recentConversions: historicalData.filter(d => d.result === 'successful').slice(0, 10),
      totalPitches: historicalData.length,
      conversionRate: historicalData.length > 0 
        ? (historicalData.filter(d => d.result === 'successful').length / historicalData.length * 100).toFixed(2)
        : 0
    };

    const prompt = `
    Analiza la efectividad de estrategias de ventas en la zona "${zone}".
    Datos disponibles:
    - Total de pitches: ${context.totalPitches}
    - Tasa de conversión actual: ${context.conversionRate}%
    - Conversiones recientes: ${JSON.stringify(context.recentConversions.slice(0, 3))}
    
    Proporciona:
    1. Análisis de fortalezas
    2. Áreas de mejora
    3. Recomendaciones de pitch prioritario
    4. Mejores horas para abordaje
    `;

    try {
      const response = await this.sendPrompt(prompt, context);
      return {
        success: true,
        zone,
        analysis: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        zone,
        error: error.message
      };
    }
  }

  /**
   * Provide coaching for a specific sales agent
   * @param {string} agentId - Agent identifier
   * @param {object} performanceData - Agent's recent pitch data
   * @returns {Promise<object>} Personalized coaching recommendations
   */
  async coachSalesAgent(agentId, performanceData = {}) {
    const prompt = `
    Proporciona coaching personalizado para el agente de ventas "${agentId}".
    
    Desempeño reciente:
    - Pitches realizados: ${performanceData.totalPitches || 0}
    - Conversiones: ${performanceData.successful || 0}
    - Tasa de conversión: ${performanceData.conversionRate || 0}%
    - Zona principal: ${performanceData.primaryZone || 'No especificada'}
    - Pitch más efectivo: ${performanceData.bestPitch || 'No identificado'}
    
    Proporciona:
    1. Reconocimiento de fortalezas
    2. Áreas específicas de mejora
    3. Técnicas prácticas para aumentar conversiones
    4. Plan de acción para la próxima sesión
    `;

    try {
      const response = await this.sendPrompt(prompt, performanceData);
      return {
        success: true,
        agentId,
        coaching: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        agentId,
        error: error.message
      };
    }
  }

  /**
   * Generate action plan based on effectiveness data
   * @param {array} effectivenessData - Pitch × origin effectiveness matrix
   * @returns {Promise<object>} Strategic action plan
   */
  async generateActionPlan(effectivenessData = []) {
    const topCombinations = effectivenessData
      .sort((a, b) => (b.conversionRate || 0) - (a.conversionRate || 0))
      .slice(0, 5);

    const prompt = `
    Basándote en el análisis de efectividad de combinaciones pitch × origen, genera un plan de acción.
    
    Top 5 combinaciones más efectivas:
    ${topCombinations.map((combo, i) => 
      `${i + 1}. ${combo.pitchType} + ${combo.clientOrigin}: ${combo.conversionRate || 0}% (${combo.successful || 0}/${combo.total || 0})`
    ).join('\n')}
    
    Genera un plan que incluya:
    1. Prioridades por pitch type
    2. Segmentación recomendada por cliente
    3. Cronograma de implementación
    4. Métricas de éxito
    `;

    try {
      const response = await this.sendPrompt(prompt, { effectiveness: effectivenessData });
      return {
        success: true,
        actionPlan: response,
        topCombinations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Enrich user prompt with Cancún-specific context
   * @private
   * @param {string} userPrompt - Original prompt
   * @param {object} contextData - Context object with zone/strategy data
   * @returns {string} Enhanced prompt
   */
  _enrichPromptWithContext(userPrompt, contextData = {}) {
    const zones = {
      zona_hotelera: 'Zona Hotelera - Alto poder adquisitivo, turistas, horarios flexibles',
      region_237: 'Región 237 - Densidad media, población local, mejor en tardes',
      sm_91: 'SM 91 - Zona residencial, familias, mejor en fines de semana',
      sm_77: 'SM 77 - Comercial, negocios, mejor mañanas',
      centro: 'Centro - Alta densidad, mixto socioeconomico, mejor evenings',
      region_233: 'Región 233 - Residencial, precio-sensible, mejor tardes'
    };

    const contextStr = `
    Contexto de Cancún (México):
    - Zona: ${contextData.zone || 'No especificada'}
    - Características: ${zones[contextData.zone] || 'Contexto general'}
    - Hora actual: ${contextData.currentHour || 'No especificada'}
    - Perfil socioeconómico: ${contextData.socioeconomic || 'Mixto'}
    
    Tipos de pitch disponibles: nostalgia, autoridad, escasez, comunidad
    Orígenes de cliente: CDMX, Cancun_Local, Quintana_Roo, Yucatan, Internacional, Migrante
    `;

    return `${contextStr}\n\nPregunta: ${userPrompt}`;
  }

  /**
   * Parse DeepSeek response and extract actionable insights
   * @param {string} response - Raw DeepSeek response
   * @returns {object} Structured insights
   */
  parseResponse(response) {
    return {
      rawResponse: response,
      timestamp: new Date().toISOString(),
      source: 'deepseek'
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeepSeekSalesCoach;
}
