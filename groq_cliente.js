/**
 * Groq Client - Módulo para conexión con APIs de IA (Groq/OpenAI/DeepSeek)
 * Especializado en coaching de ventas puerta a puerta en Cancún
 * @version 1.0.0
 * @author Geo-Suite Cancún PRO
 */

class GroqSalesCoach {
    constructor(apiKey, baseURL = "https://api.groq.com/openai/v1") {
        this.apiKey = apiKey;
        this.baseURL = baseURL;
        this.systemPrompt = `Eres un coach experto en ventas de cambaceo (puerta en puerta) en Cancún, México.

CONOCIMIENTO ESPECÍFICO DE CANCÚN:
1. ZONAS GEOESTRATÉGICAS:
   - Región 237: Zona norte, alta densidad, procesos de regularización
   - Región 233: Población joven, mejor conectividad
   - Supermanzana 91: Zona céntrica en transición
   - Supermanzana 77 (Corales): Alta vulnerabilidad, necesidades básicas
   - Centro (Distrito 1): Renovación urbana, comercio consolidado
   - Zona Hotelera: Turismo internacional, alta rotación

2. PERFILES SOCIODEMOGRÁFICOS:
   - Clase trabajadora (Región 237): Ingresos medios-bajos, productos básicos
   - Familias jóvenes (Región 233): Productos tecnológicos, financiamiento
   - Clase media (SM 91): Productos de renovación hogar, seguros
   - Población vulnerable (SM 77): Productos esenciales, precios mínimos
   - Turistas (Zona Hotelera): Productos premium, souvenirs

3. TÉCNICAS DE VENTA ESPECÍFICAS PARA CANCÚN:
   - Aprovechar microclimas: Mañanas en zonas turísticas, tardes en residenciales
   - Adaptar lenguaje: Formal en Centro/Hotelera, cercano en zonas residenciales
   - Considerar movilidad: Evitar horas pico (7-9 AM, 6-8 PM)
   - Respetar cultura local: Saludos formales, paciencia en negociaciones

COMO COACH DE VENTAS, TU ROL ES:
1. Proporcionar estrategias prácticas y específicas para Cancún
2. Adaptar técnicas de venta al contexto sociocultural local
3. Considerar factores logísticos y de seguridad
4. Ofrecer scripts y diálogos realistas
5. Enfocarse en resultados medibles`;

        this.model = "llama-3.1-8b-instant";
        this.temperature = 0.7;
        this.maxTokens = 2000;
    }

    /**
     * Valida la API key y la conexión
     * @returns {Promise<Object>} Resultado de la validación
     */
    async validateConnection() {
        if (!this.apiKey) {
            throw new Error("API Key no configurada. Configúrala en la sección de ajustes.");
        }

        try {
            const response = await fetch(`${this.baseURL}/models`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error de conexión: ${response.status}`);
            }

            return {
                success: true,
                message: "Conexión establecida correctamente",
                models: await response.json()
            };
        } catch (error) {
            throw new Error(`Error de validación: ${error.message}`);
        }
    }

    /**
     * Envía un prompt al modelo de IA
     * @param {string} userPrompt - Prompt del usuario
     * @param {Object} options - Opciones adicionales
     * @returns {Promise<string>} Respuesta del modelo
     */
    async sendPrompt(userPrompt, options = {}) {
        const {
            model = this.model,
            temperature = this.temperature,
            maxTokens = this.maxTokens,
            contextData = null
        } = options;

        if (!userPrompt.trim()) {
            throw new Error("El prompt no puede estar vacío");
        }

        // Enriquecer prompt con contexto de Cancún si hay datos
        let enhancedPrompt = userPrompt;
        if (contextData) {
            enhancedPrompt = this._enhancePromptWithContext(userPrompt, contextData);
        }

        try {
            const response = await fetch(`${this.baseURL}/chat/completions`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: "system",
                            content: this.systemPrompt
                        },
                        {
                            role: "user",
                            content: enhancedPrompt
                        }
                    ],
                    temperature: temperature,
                    max_tokens: maxTokens,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Error API: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`);
            }

            const data = await response.json();
            
            if (!data.choices || data.choices.length === 0) {
                throw new Error("No se recibió respuesta del modelo");
            }

            return data.choices[0].message.content;

        } catch (error) {
            console.error("Error en sendPrompt:", error);
            throw new Error(`Error al comunicarse con la API: ${error.message}`);
        }
    }

    /**
     * Envía múltiples prompts en secuencia (para entrevistas de ventas)
     * @param {Array} prompts - Array de prompts secuenciales
     * @returns {Promise<Array>} Respuestas secuenciales
     */
    async sendSequentialPrompts(prompts) {
        const responses = [];
        
        for (let i = 0; i < prompts.length; i++) {
            try {
                const response = await this.sendPrompt(prompts[i]);
                responses.push({
                    step: i + 1,
                    prompt: prompts[i],
                    response: response
                });
                
                // Pequeña pausa entre requests
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                responses.push({
                    step: i + 1,
                    prompt: prompts[i],
                    error: error.message
                });
            }
        }
        
        return responses;
    }

    /**
     * Genera un script de ventas específico para una zona de Cancún
     * @param {string} zona - Zona de Cancún
     * @param {string} producto - Producto a vender
     * @param {Object} perfilCliente - Perfil del cliente objetivo
     * @returns {Promise<string>} Script de ventas
     */
    async generateSalesScript(zona, producto, perfilCliente = {}) {
        const prompt = `
GENERA UN SCRIPT DE VENTAS PUERTA A PUERTA ESPECÍFICO PARA:

ZONA: ${zona}
PRODUCTO: ${producto}
PERFIL CLIENTE: ${JSON.stringify(perfilCliente) || "General"}

EL SCRIPT DEBE INCLUIR:
1. Saludo adaptado a la zona
2. Presentación efectiva (15 segundos)
3. Preguntas de diagnóstico (técnica SPIN)
4. Demostración del producto
5. Manejo de objeciones comunes en ${zona}
6. Cierre adaptado
7. Seguimiento post-venta

Formato: Diálogo realista con indicaciones entre paréntesis.
        `;

        return await this.sendPrompt(prompt, { temperature: 0.5 });
    }

    /**
     * Analiza datos de ventas y genera recomendaciones
     * @param {Array} salesData - Datos de ventas
     * @returns {Promise<string>} Análisis y recomendaciones
     */
    async analyzeSalesData(salesData) {
        const prompt = `
ANALIZA ESTOS DATOS DE VENTAS EN CANCÚN Y GENERA RECOMENDACIONES:

${JSON.stringify(salesData, null, 2)}

INCLUYE:
1. Patrones identificados
2. Zonas con mayor potencial
3. Horarios óptimos
4. Estrategias específicas por zona
5. Plan de acción para el próximo mes
        `;

        return await this.sendPrompt(prompt, { temperature: 0.3 });
    }

    /**
     * Enriquece el prompt con datos de contexto
     * @private
     */
    _enhancePromptWithContext(userPrompt, contextData) {
        let contextString = "";
        
        if (contextData.zone) {
            contextString += `\nCONTEXTO ZONA: ${contextData.zone}`;
        }
        
        if (contextData.time) {
            contextString += `\nHORA: ${contextData.time}`;
        }
        
        if (contextData.salesHistory) {
            contextString += `\nHISTORIAL VENTAS: ${JSON.stringify(contextData.salesHistory)}`;
        }
        
        if (contextData.competition) {
            contextString += `\nCOMPETENCIA: ${contextData.competition}`;
        }
        
        return `${userPrompt}\n\n${contextString}`;
    }

    /**
     * Genera un plan de rutas semanal
     * @param {Array} zones - Zonas a cubrir
     * @param {Object} constraints - Restricciones (tiempo, transporte, etc.)
     * @returns {Promise<string>} Plan de rutas
     */
    async generateRoutePlan(zones, constraints = {}) {
        const prompt = `
GENERA UN PLAN DE RUTAS SEMANAL PARA VENTAS PUERTA A PUERTA EN CANCÚN:

ZONAS A CUBRIR: ${zones.join(', ')}
RESTRICCIONES: ${JSON.stringify(constraints)}

EL PLAN DEBE INCLUIR:
1. Distribución diaria de zonas
2. Horarios óptimos considerando tráfico
3. Secuencia lógica de visitas
4. Tiempos de transporte entre zonas
5. Puntos de descanso/reabastecimiento
6. Rutas alternativas por contingencia
        `;

        return await this.sendPrompt(prompt, { temperature: 0.4 });
    }
}

/**
 * Factory function para crear instancias del cliente
 * @param {string} apiKey - API Key de Groq/OpenAI/DeepSeek
 * @param {Object} config - Configuración adicional
 * @returns {GroqSalesCoach} Instancia del cliente
 */
export function createGroqSalesCoach(apiKey, config = {}) {
    return new GroqSalesCoach(apiKey, config.baseURL);
}

/**
 * Función helper para mostrar errores en la UI
 * @param {Error} error - Error a mostrar
 * @param {string} elementId - ID del elemento donde mostrar el error
 */
export function displayErrorInUI(error, elementId = 'error-container') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.innerHTML = `
            <div style="background: #fee; border: 1px solid #f00; padding: 10px; border-radius: 5px;">
                <strong>Error:</strong> ${error.message}
                <br><small>${error.stack || ''}</small>
            </div>
        `;
        errorElement.style.display = 'block';
        
        // Auto-ocultar después de 10 segundos
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 10000);
    } else {
        console.error('Error en Groq Client:', error);
    }
}

/**
 * Función para probar la conexión y mostrar resultado en UI
 * @param {GroqSalesCoach} coach - Instancia del coach
 * @param {string} resultElementId - ID del elemento para mostrar resultados
 */
export async function testConnection(coach, resultElementId = 'connection-test-result') {
    try {
        const result = await coach.validateConnection();
        const element = document.getElementById(resultElementId);
        
        if (element) {
            element.innerHTML = `
                <div style="background: #dfd; border: 1px solid #0a0; padding: 10px; border-radius: 5px;">
                    ✅ ${result.message}
                    <br><small>Modelos disponibles: ${result.models.data?.length || 0}</small>
                </div>
            `;
        }
        
        return result;
    } catch (error) {
        displayErrorInUI(error, resultElementId);
        throw error;
    }
}

// Exponer globalmente para compatibilidad con scripts tradicionales
if (typeof window !== 'undefined') {
    window.GroqSalesCoach = GroqSalesCoach;
    window.createGroqSalesCoach = createGroqSalesCoach;
    window.displayErrorInUI = displayErrorInUI;
    window.testConnection = testConnection;
}

export { GroqSalesCoach, createGroqSalesCoach, displayErrorInUI, testConnection };
export default GroqSalesCoach;