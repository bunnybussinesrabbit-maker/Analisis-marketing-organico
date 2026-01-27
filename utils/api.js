/**
 * 🌐 API REST para análisis de efectividad
 * Expone endpoints para consultas sobre pitch × origen
 * Fecha: 2026-01-26
 */

class AnalysisAPI {
  static endpoints = {
    '/api/effectiveness': 'GET',
    '/api/effectiveness/top': 'GET',
    '/api/effectiveness/compare': 'POST',
    '/api/recommend': 'GET',
    '/api/llm/analysis': 'POST'
  };

  /**
   * Manejar solicitudes API (local, sin backend)
   */
  static async handleRequest(endpoint, method = 'GET', data = null) {
    console.log(`📡 [API] ${method} ${endpoint}`);
    
    try {
      if (endpoint === '/api/effectiveness') {
        return analyzePitchOriginEffectiveness();
      }
      
      if (endpoint === '/api/effectiveness/top') {
        const analysis = analyzePitchOriginEffectiveness();
        return {
          status: 'success',
          message: 'Top 5 combinaciones más efectivas',
          data: analysis.topCombinations
        };
      }
      
      if (endpoint === '/api/effectiveness/compare' && data) {
        return comparePitchOriginCombinations(
          data.pitch1, data.origin1,
          data.pitch2, data.origin2
        );
      }
      
      if (endpoint.startsWith('/api/recommend?origin=')) {
        const origin = new URLSearchParams(endpoint.split('?')[1]).get('origin');
        return recommendPitchForOrigin(origin);
      }
      
      if (endpoint === '/api/llm/analysis' && data) {
        return await this.analyzWithDeepSeek(data);
      }
      
      return { status: 'error', message: 'Endpoint no encontrado' };
    } catch (error) {
      console.error('❌ [API Error]:', error);
      return { status: 'error', message: error.message };
    }
  }

  /**
   * ✅ Backward compatibility: Use DeepSeek by default
   */
  static async analyzWithLLM(params) {
    return this.analyzWithDeepSeek(params);
  }

  /**
   * 🤖 Analizar con LLM (DeepSeek)
   */
  static async analyzWithDeepSeek(params) {
    const analysis = analyzePitchOriginEffectiveness();
    
    if (!window.DeepSeekSalesCoach) {
      return {
        status: 'error',
        message: 'DeepSeekSalesCoach no está disponible',
        fallback: analysis.topCombinations
      };
    }

    try {
      const apiKey = localStorage.getItem('deepseekApiKey');
      if (!apiKey) {
        return {
          status: 'error',
          message: 'API Key de DeepSeek no configurada',
          fallback: analysis.topCombinations
        };
      }

      const coach = new DeepSeekSalesCoach(apiKey);
      
      // Validar conexión
      const isConnected = await coach.validateConnection();
      if (!isConnected) {
        return {
          status: 'error',
          message: 'No se pudo validar la conexión con DeepSeek API',
          fallback: analysis.topCombinations
        };
      }

      const combinationsText = analysis.topCombinations
        .map(c => `${c.pitchType || c.pitch} + ${c.clientOrigin || c.origin}: ${c.conversionRate}% conversión (${c.successful}/${c.total} exitosos)`)
        .join('\n');

      const prompt = `
Eres un experto en análisis de ventas door-to-door para Cancún.

DATOS DE EFECTIVIDAD:
${combinationsText}

PREGUNTA DEL USUARIO: ${params.question}

Analiza los datos y proporciona:
1. Respuesta directa a la pregunta
2. Top 3 insights accionables
3. Recomendación específica

Sé conciso y práctico.
      `.trim();

      const response = await coach.sendPrompt(prompt, {
        zone: params.zone,
        currentHour: new Date().getHours().toString(),
        totalCombinations: analysis.data.length,
        bestCombo: analysis.topCombinations[0],
        question: params.question
      });

      return {
        status: 'success',
        question: params.question,
        data: analysis.topCombinations,
        llmAnalysis: response,
        provider: 'deepseek',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ [DeepSeek Error]:', error);
      return {
        status: 'error',
        message: `Error con DeepSeek: ${error.message}`,
        fallback: analysis.topCombinations
      };
    }
  }
}

// Exponer globalmente
if (typeof window !== 'undefined') {
  window.AnalysisAPI = AnalysisAPI;
  console.log('✅ AnalysisAPI cargada');
}
