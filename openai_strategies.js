/**
 * OpenAI Strategies - Módulo de estrategias de ventas puerta a puerta para Cancún
 * @version 1.0.0
 * @author Geo-Suite Cancún PRO
 */

import { createGroqSalesCoach, displayErrorInUI, testConnection } from './groq_cliente.js';

class SalesStrategiesCancun {
    constructor(apiKey = null) {
        this.apiKey = apiKey || localStorage.getItem('groqApiKey');
        this.coach = null;
        this.strategiesCache = new Map();
        
        // Estrategias predefinidas para cada zona
        this.predefinedStrategies = {
            'region_237': {
                name: 'Región 237 - Estrategia de Consolidación',
                approach: 'Enfoque en relaciones a largo plazo',
                techniques: ['Ventas básicas', 'Pagos flexibles', 'Garantías extendidas'],
                keyPhrases: ['"Entiendo su presupuesto"', '"Pago quincenal disponible"', '"Productos duraderos"'],
                bestTimes: ['9:00-11:00 AM', '3:00-5:00 PM'],
                warning: 'Evitar horarios nocturnos por seguridad'
            },
            'region_233': {
                name: 'Región 233 - Estrategia Juvenil',
                approach: 'Enfoque digital y tecnológico',
                techniques: ['Demostraciones interactivas', 'Financiamiento educativo', 'Apps de seguimiento'],
                keyPhrases: ['"Inversión en tu futuro"', '"Tecnología de última generación"', '"Fácil de usar"'],
                bestTimes: ['10:00-12:00 AM', '6:00-8:00 PM'],
                warning: 'Competencia con ofertas digitales'
            },
            'sm_91': {
                name: 'SM 91 - Estrategia de Renovación',
                approach: 'Enfoque en mejoras del hogar',
                techniques: ['Muestras gratuitas', 'Comparativas de precio-calidad', 'Instalación incluida'],
                keyPhrases: ['"Aumente el valor de su propiedad"', '"Calidad premium"', '"Inversión inteligente"'],
                bestTimes: ['11:00-1:00 PM', '4:00-6:00 PM'],
                warning: 'Clientes más informados y exigentes'
            },
            'sm_77': {
                name: 'SM 77 (Corales) - Estrategia Esencial',
                approach: 'Enfoque en necesidades básicas',
                techniques: ['Precios mínimos', 'Paquetes básicos', 'Ayuda social integrada'],
                keyPhrases: ['"Productos esenciales"', '"Precios accesibles"', '"Calidad confiable"'],
                bestTimes: ['10:00-2:00 PM'],
                warning: 'Respetar sensibilidad social, evitar enfoque comercial agresivo'
            },
            'centro': {
                name: 'Centro - Estrategia Premium',
                approach: 'Enfoque en calidad y exclusividad',
                techniques: ['Demostraciones en tienda', 'Servicio personalizado', 'Garantías premium'],
                keyPhrases: ['"Producto exclusivo"', '"Servicio personalizado"', '"Inversión en calidad"'],
                bestTimes: ['11:00-3:00 PM', '5:00-8:00 PM'],
                warning: 'Alta competencia, clientes exigentes'
            },
            'hotel_zone': {
                name: 'Zona Hotelera - Estrategia Turística',
                approach: 'Enfoque en conveniencia y experiencia',
                techniques: ['Ventas rápidas', 'Productos portátiles', 'Servicio 24/7'],
                keyPhrases: ['"Recuerdo de Cancún"', '"Fácil de llevar"', '"Experiencia única"'],
                bestTimes: ['10:00-12:00 AM', '4:00-7:00 PM', '9:00-11:00 PM'],
                warning: 'Alta rotación, precios competitivos'
            }
        };
    }

    /**
     * Inicializa el coach de IA
     */
    async initialize() {
        if (!this.apiKey) {
            throw new Error('API Key no configurada. Configúrala en la sección de ajustes.');
        }

        try {
            this.coach = createGroqSalesCoach(this.apiKey);
            await testConnection(this.coach, 'strategies-connection-result');
            console.log('✅ SalesStrategiesCancun inicializado correctamente');
            return true;
        } catch (error) {
            console.error('Error inicializando SalesStrategiesCancun:', error);
            displayErrorInUI(error, 'strategies-error-container');
            return false;
        }
    }

    /**
     * Genera estrategias personalizadas usando IA
     * @param {string} zona - Zona de Cancún
     * @param {Object} params - Parámetros adicionales
     * @returns {Promise<Object>} Estrategias generadas
     */
    async generateCustomStrategies(zona, params = {}) {
        const cacheKey = `${zona}_${JSON.stringify(params)}`;
        
        // Verificar caché
        if (this.strategiesCache.has(cacheKey)) {
            console.log('📦 Usando estrategias en caché');
            return this.strategiesCache.get(cacheKey);
        }

        if (!this.coach) {
            throw new Error('Coach no inicializado. Llama a initialize() primero.');
        }

        const prompt = `
GENERA ESTRATEGIAS DE VENTAS PUERTA A PUERTA ESPECÍFICAS PARA:

ZONA: ${zona}
CONTEXTO: ${params.context || 'Ventas generales'}
PRODUCTO: ${params.product || 'Producto variado'}
EXPERIENCIA VENDEDOR: ${params.experience || 'Intermedio'}
OBJETIVO: ${params.target || 'Aumentar conversiones'}

LAS ESTRATEGIAS DEBEN INCLUIR:

1. TÉCNICAS DE APROXIMACIÓN:
   - Saludos efectivos para ${zona}
   - Rompehielos culturalmente apropiados
   - Presentación de 30 segundos

2. TÉCNICA SPIN ADAPTADA:
   - Preguntas de Situación específicas para ${zona}
   - Preguntas de Problema comunes
   - Preguntas de Implicación relevantes
   - Preguntas de Necesidad-pago

3. MANEJO DE OBJECIONES COMUNES EN ${zona.toUpperCase()}:
   - "No tengo dinero"
   - "Ya tengo uno similar"
   - "Déjame pensarlo"
   - "Hablaré con mi pareja"

4. TÉCNICAS DE CIERRE EFECTIVAS:
   - Cierre por resumen
   - Cierre por urgencia (si aplica)
   - Cierre por alternativa

5. SEGUIMIENTO POST-VENTA:
   - Frecuencia de contacto
   - Métodos preferidos en ${zona}
   - Cross-selling oportuno

6. CONSIDERACIONES LOGÍSTICAS:
   - Mejores horarios
   - Rutas sugeridas
   - Equipo necesario

RESPONDE EN FORMATO JSON ESTRUCTURADO.
        `;

        try {
            const response = await this.coach.sendPrompt(prompt, { 
                temperature: 0.3,
                contextData: {
                    zone: zona,
                    time: new Date().toLocaleTimeString(),
                    season: this._getCurrentSeason()
                }
            });

            // Parsear respuesta (puede ser JSON o texto)
            let strategies;
            try {
                strategies = JSON.parse(response);
            } catch {
                // Si no es JSON válido, crear estructura manual
                strategies = this._parseTextResponse(response, zona);
            }

            // Combinar con estrategias predefinidas
            strategies = this._mergeWithPredefined(zona, strategies);
            
            // Guardar en caché
            this.strategiesCache.set(cacheKey, strategies);
            
            return strategies;

        } catch (error) {
            console.error('Error generando estrategias:', error);
            
            // Fallback a estrategias predefinidas
            return this._getFallbackStrategies(zona);
        }
    }

    /**
     * Genera un plan de acción semanal
     * @param {Array} zones - Zonas a cubrir
     * @param {Object} goals - Metas de ventas
     * @returns {Promise<Object>} Plan de acción
     */
    async generateActionPlan(zones, goals = {}) {
        if (!this.coach) {
            throw new Error('Coach no inicializado');
        }

        const prompt = `
GENERA UN PLAN DE ACCIÓN SEMANAL PARA VENTAS PUERTA A PUERTA EN CANCÚN:

ZONAS: ${zones.join(', ')}
METAS SEMANALES: ${JSON.stringify(goals)}
DÍAS DISPONIBLES: Lunes a Sábado
HORAS DIARIAS: 6 horas efectivas

EL PLAN DEBE INCLUIR:

1. CALENDARIO DIARIO:
   - Zona principal del día
   - Zona secundaria (backup)
   - Horarios específicos
   - Objetivos diarios

2. PREPARACIÓN DIARIA:
   - Materiales necesarios
   - Scripts a usar
   - Objetivos específicos

3. SEGUIMIENTO NOCTURNO:
   - Revisión de resultados
   - Actualización de datos
   - Preparación para el siguiente día

4. MÉTRICAS DE SEGUIMIENTO:
   - Conversiones por zona
   - Ticket promedio
   - Objeciones comunes
   - Lecciones aprendidas

5. PLAN DE CONTINGENCIA:
   - Días de lluvia
   - Problemas de transporte
   - Cambios de última hora

FORMATO: JSON estructurado por día.
        `;

        try {
            const response = await this.coach.sendPrompt(prompt, { temperature: 0.4 });
            
            let plan;
            try {
                plan = JSON.parse(response);
            } catch {
                plan = this._createBasicPlan(zones);
            }
            
            return plan;
        } catch (error) {
            console.error('Error generando plan:', error);
            return this._createBasicPlan(zones);
        }
    }

    /**
     * Genera diálogos de ventas específicos
     * @param {string} scenario - Escenario de ventas
     * @param {Object} context - Contexto adicional
     * @returns {Promise<string>} Diálogo generado
     */
    async generateSalesDialogue(scenario, context = {}) {
        if (!this.coach) {
            throw new Error('Coach no inicializado');
        }

        const prompt = `
GENERA UN DIÁLOGO DE VENTAS REALISTA PARA:

ESCENARIO: ${scenario}
ZONA: ${context.zone || 'General'}
PRODUCTO: ${context.product || 'Producto variado'}
CLIENTE: ${context.clientType || 'Propietario residencial'}
OBJECIÓN PRINCIPAL: ${context.objection || 'Precio'}

EL DIÁLOGO DEBE INCLUIR:

1. APERTURA (30 segundos):
   - Saludo apropiado
   - Presentación breve
   - Propuesta de valor

2. DIAGNÓSTICO (2-3 minutos):
   - Preguntas SPIN
   - Escucha activa
   - Identificación de necesidades

3. DEMOSTRACIÓN (3-4 minutos):
   - Características relevantes
   - Beneficios específicos
   - Prueba social

4. MANEJO DE OBJECIONES (2-3 minutos):
   - Validar preocupación
   - Responder con beneficios
   - Ofrecer alternativas

5. CIERRE (1-2 minutos):
   - Resumen de beneficios
   - Llamado a la acción
   - Acuerdo claro

6. SEGUIMIENTO:
   - Confirmación de detalles
   - Próximos pasos
   - Agradecimiento

FORMATO: Diálogo con acotaciones entre paréntesis.
        `;

        return await this.coach.sendPrompt(prompt, { temperature: 0.6 });
    }

    /**
     * Renderiza las estrategias en el HTML
     * @param {Object} strategies - Estrategias a renderizar
     * @param {string} containerId - ID del contenedor (default: 'estrategias')
     */
    renderStrategies(strategies, containerId = 'estrategias') {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Contenedor #${containerId} no encontrado`);
            return;
        }

        let html = `
            <div class="strategies-container">
                <h2><i class="fas fa-chess-knight"></i> Estrategias de Ventas - ${strategies.zone || 'Cancún'}</h2>
                
                <div class="strategy-summary">
                    <h3><i class="fas fa-bullseye"></i> Enfoque Principal</h3>
                    <p>${strategies.approach || 'Enfoque adaptativo'}</p>
                    
                    <div class="zone-badge ${this._getZoneClass(strategies.zone)}">
                        ${strategies.zone || 'Zona General'}
                    </div>
                </div>
        `;

        // Técnicas de aproximación
        if (strategies.approachTechniques) {
            html += `
                <div class="strategy-section">
                    <h3><i class="fas fa-handshake"></i> Técnicas de Aproximación</h3>
                    <ul>
                        ${strategies.approachTechniques.map(tech => `<li>${tech}</li>`).join('')}
                    </ul>
                    
                    <div class="key-phrases">
                        <strong>Frases clave:</strong>
                        ${strategies.keyPhrases?.map(phrase => 
                            `<span class="phrase-badge">${phrase}</span>`
                        ).join('')}
                    </div>
                </div>
            `;
        }

        // Técnica SPIN
        if (strategies.spinQuestions) {
            html += `
                <div class="strategy-section">
                    <h3><i class="fas fa-question-circle"></i> Técnica SPIN Adaptada</h3>
                    <div class="spin-grid">
                        <div class="spin-category">
                            <h4>Situación</h4>
                            <ul>${strategies.spinQuestions.situacion?.map(q => `<li>${q}</li>`).join('') || ''}</ul>
                        </div>
                        <div class="spin-category">
                            <h4>Problema</h4>
                            <ul>${strategies.spinQuestions.problema?.map(q => `<li>${q}</li>`).join('') || ''}</ul>
                        </div>
                        <div class="spin-category">
                            <h4>Implicación</h4>
                            <ul>${strategies.spinQuestions.implicacion?.map(q => `<li>${q}</li>`).join('') || ''}</ul>
                        </div>
                        <div class="spin-category">
                            <h4>Necesidad</h4>
                            <ul>${strategies.spinQuestions.necesidad?.map(q => `<li>${q}</li>`).join('') || ''}</ul>
                        </div>
                    </div>
                </div>
            `;
        }

        // Manejo de objeciones
        if (strategies.objectionHandling) {
            html += `
                <div class="strategy-section">
                    <h3><i class="fas fa-exclamation-triangle"></i> Manejo de Objeciones</h3>
                    <div class="objection-grid">
                        ${Object.entries(strategies.objectionHandling).map(([objecion, respuesta]) => `
                            <div class="objection-item">
                                <div class="objection">"${objecion}"</div>
                                <div class="response">${respuesta}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Horarios y logística
        if (strategies.bestTimes || strategies.logistics) {
            html += `
                <div class="strategy-section">
                    <h3><i class="fas fa-clock"></i> Logística y Horarios</h3>
                    ${strategies.bestTimes ? `
                        <p><strong>Horarios óptimos:</strong> ${strategies.bestTimes.join(', ')}</p>
                    ` : ''}
                    
                    ${strategies.logistics ? `
                        <div class="logistics">
                            <strong>Consideraciones logísticas:</strong>
                            <ul>${strategies.logistics.map(item => `<li>${item}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    
                    ${strategies.warning ? `
                        <div class="warning">
                            <i class="fas fa-exclamation-circle"></i>
                            <strong>Precaución:</strong> ${strategies.warning}
                        </div>
                    ` : ''}
                </div>
            `;
        }

        // Plan de acción
        if (strategies.actionPlan) {
            html += `
                <div class="strategy-section">
                    <h3><i class="fas fa-list-check"></i> Plan de Acción Inmediato</h3>
                    <ol class="action-plan">
                        ${strategies.actionPlan.map((step, index) => `
                            <li>
                                <span class="step-number">${index + 1}</span>
                                <span class="step-content">${step}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>
            `;
        }

        html += `
                <div class="strategy-footer">
                    <p><small>
                        <i class="fas fa-sync-alt"></i>
                        Generado el ${new Date().toLocaleDateString()} para Cancún
                    </small></p>
                    <button class="btn btn-primary" onclick="window.print()">
                        <i class="fas fa-print"></i> Imprimir Estrategias
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        
        // Añadir estilos si no existen
        this._injectStyles();
    }

    /**
     * Métodos auxiliares privados
     */
    _parseTextResponse(text, zona) {
        // Análisis básico de texto para extraer estructura
        return {
            zone: zona,
            approach: "Estrategia adaptativa generada por IA",
            approachTechniques: [
                "Saludo personalizado según hora",
                "Presentación de 30 segundos",
                "Pregunta abierta inicial"
            ],
            spinQuestions: {
                situacion: ["¿Cómo utiliza actualmente productos similares?", "¿Qué características busca?"],
                problema: ["¿Qué desafíos ha enfrentado?", "¿Qué le gustaría mejorar?"],
                implicacion: ["¿Cómo afecta esto su día a día?", "¿Qué consecuencias tiene?"],
                necesidad: ["¿Qué solución ideal imagina?", "¿Qué valor le daría a una solución?"]
            },
            objectionHandling: {
                "No tengo dinero": "Entiendo. ¿Le interesaría conocer nuestras opciones de pago flexibles?",
                "Ya tengo uno similar": "Excelente. ¿Qué le gustaría mejorar del que tiene actualmente?",
                "Déjame pensarlo": "Claro, es una decisión importante. ¿Qué información adicional necesita?"
            },
            bestTimes: ["10:00-12:00 AM", "3:00-6:00 PM"],
            actionPlan: [
                "Preparar materiales específicos para la zona",
                "Revisar scripts de apertura",
                "Establecer objetivos diarios realistas",
                "Programar rutas eficientes"
            ]
        };
    }

    _mergeWithPredefined(zona, aiStrategies) {
        const predefined = this.predefinedStrategies[zona] || this.predefinedStrategies.centro;
        
        return {
            ...predefined,
            ...aiStrategies,
            zone: zona,
            // Mezclar arrays específicos
            techniques: [...new Set([...(predefined.techniques || []), ...(aiStrategies.techniques || [])])],
            keyPhrases: [...new Set([...(predefined.keyPhrases || []), ...(aiStrategies.keyPhrases || [])])]
        };
    }

    _getFallbackStrategies(zona) {
        return this.predefinedStrategies[zona] || this.predefinedStrategies.centro;
    }

    _createBasicPlan(zones) {
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        
        return days.reduce((plan, day, index) => {
            const zoneIndex = index % zones.length;
            plan[day] = {
                zona_principal: zones[zoneIndex],
                zona_secundaria: zones[(zoneIndex + 1) % zones.length],
                horario: '10:00 AM - 4:00 PM',
                objetivo: '15 contactos, 3 demostraciones, 1 venta',
                materiales: ['Muestras', 'Folletos', 'Tablet para demostración', 'Agua']
            };
            return plan;
        }, {});
    }

    _getCurrentSeason() {
        const month = new Date().getMonth() + 1;
        if (month >= 12 || month <= 3) return 'Temporada Alta (Invierno)';
        if (month >= 7 && month <= 8) return 'Temporada Media (Verano)';
        return 'Temporada Baja';
    }

    _getZoneClass(zone) {
        const zoneClasses = {
            'region_237': 'zone-237',
            'region_233': 'zone-233',
            'sm_91': 'zone-91',
            'sm_77': 'zone-77',
            'centro': 'zone-centro',
            'hotel_zone': 'zone-hotelera'
        };
        return zoneClasses[zone] || 'zone-centro';
    }

    _injectStyles() {
        if (document.getElementById('strategies-styles')) return;

        const styles = `
            <style id="strategies-styles">
                .strategies-container {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 24px;
                    margin: 20px 0;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                }
                
                .strategy-summary {
                    background: var(--bg-panel);
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    border-left: 4px solid var(--accent-blue);
                }
                
                .strategy-section {
                    margin: 24px 0;
                    padding: 20px;
                    background: var(--bg-panel);
                    border-radius: 12px;
                    border: 1px solid var(--border);
                }
                
                .spin-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-top: 15px;
                }
                
                .spin-category {
                    background: rgba(56, 189, 248, 0.1);
                    padding: 15px;
                    border-radius: 8px;
                    border: 1px solid rgba(56, 189, 248, 0.3);
                }
                
                .spin-category h4 {
                    color: var(--accent-blue);
                    margin-top: 0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .spin-category ul {
                    margin: 10px 0 0 0;
                    padding-left: 20px;
                }
                
                .spin-category li {
                    margin: 5px 0;
                    font-size: 0.9rem;
                }
                
                .objection-grid {
                    display: grid;
                    gap: 15px;
                    margin-top: 15px;
                }
                
                .objection-item {
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 15px;
                    padding: 15px;
                    background: rgba(239, 68, 68, 0.05);
                    border-radius: 8px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                }
                
                .objection {
                    font-style: italic;
                    color: var(--danger);
                    font-weight: 600;
                }
                
                .response {
                    color: var(--text-primary);
                }
                
                .key-phrases {
                    margin-top: 15px;
                    padding: 15px;
                    background: rgba(34, 197, 94, 0.05);
                    border-radius: 8px;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }
                
                .phrase-badge {
                    display: inline-block;
                    margin: 5px;
                    padding: 5px 12px;
                    background: rgba(34, 197, 94, 0.2);
                    border: 1px solid var(--accent-green);
                    border-radius: 20px;
                    font-size: 0.85rem;
                }
                
                .logistics {
                    margin: 15px 0;
                    padding: 15px;
                    background: rgba(245, 158, 11, 0.05);
                    border-radius: 8px;
                    border: 1px solid rgba(245, 158, 11, 0.2);
                }
                
                .warning {
                    margin: 15px 0;
                    padding: 15px;
                    background: rgba(239, 68, 68, 0.05);
                    border-radius: 8px;
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: var(--danger);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .action-plan {
                    margin: 15px 0;
                    padding-left: 20px;
                }
                
                .action-plan li {
                    margin: 10px 0;
                    padding: 10px;
                    background: rgba(56, 189, 248, 0.05);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                
                .step-number {
                    background: var(--accent-blue);
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }
                
                .strategy-footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                @media (max-width: 768px) {
                    .objection-item {
                        grid-template-columns: 1fr;
                    }
                    
                    .spin-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }
}

/**
 * Factory function para crear instancias de estrategias
 * @param {string} apiKey - API Key (opcional)
 * @returns {SalesStrategiesCancun} Instancia de estrategias
 */
export function createSalesStrategies(apiKey = null) {
    return new SalesStrategiesCancun(apiKey);
}

/**
 * Función para inicializar y mostrar estrategias automáticamente
 * @param {string} zone - Zona de Cancún
 * @param {Object} params - Parámetros adicionales
 * @param {string} containerId - ID del contenedor
 */
export async function initializeAndDisplayStrategies(zone, params = {}, containerId = 'estrategias') {
    try {
        const strategies = createSalesStrategies();
        await strategies.initialize();
        
        const generatedStrategies = await strategies.generateCustomStrategies(zone, params);
        strategies.renderStrategies(generatedStrategies, containerId);
        
        return strategies;
    } catch (error) {
        console.error('Error inicializando estrategias:', error);
        displayErrorInUI(error, containerId);
        throw error;
    }
}

// Exportar para uso global si se usa como script
if (typeof window !== 'undefined') {
    window.SalesStrategiesCancun = SalesStrategiesCancun;
    window.createSalesStrategies = createSalesStrategies;
    window.initializeAndDisplayStrategies = initializeAndDisplayStrategies;
}

export { SalesStrategiesCancun, createSalesStrategies, initializeAndDisplayStrategies };
export default SalesStrategiesCancun;