/**
 * fieldMapper.js - Estandarización de campos CSV
 * 
 * Mapea variaciones de nombres de campos del CSV a un formato canónico
 * Permite trabajar con múltiples formatos de entrada sin duplicar lógica
 * 
 * Ejemplo de variaciones soportadas:
 * - zona / zoneId / zone_id → zone
 * - estado / result → result
 * - pitch_type / pitchType → pitchType
 * - monto / amount → amount
 * - hora / time → time
 */

const FieldMapper = {
  /**
   * Mapeo de campos: campo_entrada → campo_canónico
   * MEJORADO: Variantes amplias para soportar ES/EN/mixto
   */
  FIELD_MAP: {
    // Zona/Ubicación
    'zona': 'zone',
    'zoneid': 'zone',
    'zone_id': 'zone',
    'zone': 'zone',
    'region': 'zone',
    'area': 'zone',
    
    // Resultado
    'estado': 'result',
    'result': 'result',
    'status': 'result',
    'resultado': 'result',
    
    // Tipo de Pitch
    'pitch_type': 'pitchType',
    'pitchtype': 'pitchType',
    'pitchType': 'pitchType',
    'pitch': 'pitchType',
    'tipo_pitch': 'pitchType',
    'tipo_disertacion': 'pitchType',
    'disertacion': 'pitchType',
    'estrategia': 'pitchType',
    'type_pitch': 'pitchType',
    'pitch_strategy': 'pitchType',
    
    // Monto/Cantidad
    'monto': 'amount',
    'amount': 'amount',
    'venta': 'amount',
    'sale_amount': 'amount',
    'sale': 'amount',
    'valor': 'amount',
    
    // Hora/Timestamp
    'hora': 'timestamp',
    'time': 'timestamp',
    'timestamp': 'timestamp',
    'fecha': 'timestamp',
    'date': 'timestamp',
    'fecha_hora': 'timestamp',
    'datetime': 'timestamp',
    'date_time': 'timestamp',
    
    // Cliente
    'cliente': 'clientName',
    'client': 'clientName',
    'client_name': 'clientName',
    'clientname': 'clientName',
    'clientName': 'clientName',
    'name': 'clientName',
    'nombre': 'clientName',
    
    // Origen
    'origen': 'clientOrigin',
    'clientOrigin': 'clientOrigin',
    'client_origin': 'clientOrigin',
    'clientorigin': 'clientOrigin',
    'source': 'clientOrigin',
    'procedencia': 'clientOrigin',
    'origin': 'clientOrigin',
    'procedencia_cliente': 'clientOrigin',
    
    // Demográfico - Edad
    'edad': 'age',
    'age': 'age',
    'age_group': 'age',
    'agegroup': 'age',
    'ageGroup': 'age',
    'edad_grupo': 'age',
    'age_range': 'age',
    'rango_edad': 'age',
    'grupo_edad': 'age',
    
    // Demográfico - Ocupación
    'ocupacion': 'occupation',
    'ocupación': 'occupation',
    'occupation': 'occupation',
    'job': 'occupation',
    'empleo': 'occupation',
    'profession': 'occupation',
    'profesion': 'occupation',
    'puesto': 'occupation',
    
    // Demográfico - Ingreso
    'ingreso': 'income',
    'income': 'income',
    'income_level': 'income',
    'incomelevel': 'income',
    'nivel_ingreso': 'income',
    'nivel_ingresos': 'income',
    'ingresos': 'income',
    'nivel_economico': 'income',
    
    // Demográfico
    'demografico': 'demographic',
    'demographic': 'demographic',
    'demográfico': 'demographic',
    
    // Agente
    'agente': 'agentId',
    'agent': 'agentId',
    'agentId': 'agentId',
    'agent_id': 'agentId',
    'agentid': 'agentId',
    'vendedor': 'agentId',
    'seller_id': 'agentId',
    
    // ID del registro
    'id': 'id',
    'pitch_id': 'id',
    'pitchid': 'id',
    'pitchId': 'id',
    'record_id': 'id',
    'recordid': 'id',
    'registro_id': 'id',
    
    // Coordenadas GPS
    'latitude': 'latitude',
    'lat': 'latitude',
    'latitud': 'latitude',
    'longitude': 'longitude',
    'lng': 'longitude',
    'longitud': 'longitude',
    'accuracy': 'accuracy',
    'precisión': 'accuracy',
    'precision': 'accuracy'
  },

  /**
   * ✅ MEJORADO: Función de detección de campos con búsqueda fuzzy
   * @param {String} csvHeader - Header del CSV
   * @returns {String|null} Campo canónico o null si no detecta
   */
  detectField(csvHeader) {
    if (!csvHeader) return null;
    
    const normalized = String(csvHeader).toLowerCase().trim();
    
    // 1. BÚSQUEDA EXACTA (rápida)
    if (this.FIELD_MAP[normalized]) {
      console.log(`✅ Header "${csvHeader}" → Coincidencia exacta: "${this.FIELD_MAP[normalized]}"`);
      return this.FIELD_MAP[normalized];
    }
    
    // 2. BÚSQUEDA FUZZY (buscar el campo canónico que contiene las palabras clave)
    const words = normalized.replace(/[_-]/g, ' ').split(/\s+/);
    
    for (const [sourceKey, canonicalField] of Object.entries(this.FIELD_MAP)) {
      // Si el header normalizado contiene todas las palabras del sourceKey
      const sourceWords = sourceKey.replace(/[_-]/g, ' ').split(/\s+/);
      const allWordsMatch = sourceWords.every(word => 
        words.some(w => w.includes(word) || word.includes(w))
      );
      
      if (allWordsMatch) {
        console.log(`✅ Header "${csvHeader}" → Fuzzy match: "${canonicalField}" (source: "${sourceKey}")`);
        return canonicalField;
      }
    }
    
    // 3. FALLBACK: Buscar por palabras clave comunes
    const keywordMap = {
      'zone': 'zone',
      'zona': 'zone',
      'pitch': 'pitchType',
      'disertacion': 'pitchType',
      'result': 'result',
      'resultado': 'result',
      'estado': 'result',
      'amount': 'amount',
      'monto': 'amount',
      'origin': 'clientOrigin',
      'origen': 'clientOrigin',
      'client': 'clientName',
      'cliente': 'clientName',
      'age': 'age',
      'edad': 'age',
      'occupation': 'occupation',
      'ocupacion': 'occupation',
      'income': 'income',
      'ingreso': 'income',
      'timestamp': 'timestamp',
      'date': 'timestamp',
      'fecha': 'timestamp',
      'lat': 'latitude',
      'lon': 'longitude'
    };
    
    for (const [keyword, canonical] of Object.entries(keywordMap)) {
      if (normalized.includes(keyword)) {
        console.log(`✅ Header "${csvHeader}" → Keyword match: "${canonical}" (keyword: "${keyword}")`);
        return canonical;
      }
    }
    
    // 4. SIN COINCIDENCIA - Devolver null y loguear para debugging
    console.warn(`⚠️ Header "${csvHeader}" NO MAPEADO - Se pasará como está`);
    return null;
  },

  /**
   * Valores canónicos para campos específicos
   * MEJORADO: Normalización completa con acentos y variantes ES/EN
   */
  VALUE_NORMALIZERS: {
    result: (val) => {
      if (!val) return 'pending';
      const v = String(val).toLowerCase().trim();
      
      // Remover acentos
      const clean = v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // Exitoso
      if (clean.includes('success') || clean.includes('exitoso') || clean.includes('exit') ||
          clean.includes('si') || clean === 's' || clean.includes('true') || clean === '1' ||
          clean.includes('completado') || clean.includes('realizado')) {
        return 'successful';
      }
      
      // Fallido
      if (clean.includes('fail') || clean.includes('fallido') || clean.includes('no') ||
          clean === 'n' || clean.includes('false') || clean === '0' || 
          clean.includes('rechaz') || clean.includes('negado') || clean.includes('cancelad')) {
        return 'failed';
      }
      
      // Pendiente
      if (clean.includes('pend') || clean.includes('pending') || clean.includes('follow') || 
          clean.includes('en proceso') || clean.includes('en_proceso') || clean.includes('proximo')) {
        return 'pending';
      }
      
      return 'unknown';
    },
    
    pitchType: (val) => {
      if (!val) return 'unknown';
      const v = String(val).toLowerCase().trim();
      
      // Remover acentos
      const clean = v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // NOSTALGIA
      if (clean.includes('nostalgia') || clean.includes('nostalgic') || 
          clean.includes('nostal') || clean.includes('memoria') || clean.includes('recuerd')) {
        return 'nostalgia';
      }
      
      // AUTORIDAD (variantes: autoridad, authority, expert, credibilidad, experto, confianza)
      if (clean.includes('autoridad') || clean.includes('authority') || clean.includes('expert') ||
          clean.includes('credib') || clean.includes('experto') || clean.includes('confianza') ||
          clean.includes('experta') || clean.includes('profesional') || clean.includes('autoridad')) {
        return 'autoridad';
      }
      
      // ESCASEZ (variantes: escasez, scarcity, limitado, urgencia, limited, exclusive, exclusivo)
      if (clean.includes('escasez') || clean.includes('scarcity') || clean.includes('limitad') ||
          clean.includes('urgencia') || clean.includes('limit') || clean.includes('exclusive') ||
          clean.includes('exclusiv') || clean.includes('unico') || clean.includes('unica') ||
          clean.includes('hoy') || clean.includes('ahora') || clean.includes('ultimo')) {
        return 'escasez';
      }
      
      // COMUNIDAD (variantes: comunidad, community, social, pertenencia, local, grupo, colectivo)
      if (clean.includes('comunidad') || clean.includes('community') || clean.includes('social') || 
          clean.includes('pertenen') || clean.includes('local') || clean.includes('grupo') ||
          clean.includes('colectivo') || clean.includes('juntos') || clean.includes('comun') ||
          clean.includes('apoyo') || clean.includes('pertenencia')) {
        return 'comunidad';
      }
      
      // Si no coincide, devolver limpio
      console.warn(`⚠️ Pitch type desconocido: "${val}" → pasando como "${clean}"`);
      return clean;
    },

    zone: (val) => {
      if (!val) return 'unknown';
      const v = String(val).toLowerCase().trim();
      
      // Limpiar caracteres especiales y espacios
      const clean = v.replace(/\s+/g, '_').replace(/[^\w_]/g, '');
      
      // Mapear variantes comunes de zonas
      const zoneMap = {
        'zona_hotelera': 'zona_hotelera',
        'zonahotelera': 'zona_hotelera',
        'hotelera': 'zona_hotelera',
        'hotel': 'zona_hotelera',
        'turismo': 'zona_hotelera',
        'centro': 'centro',
        'region_237': 'region_237',
        'región_237': 'region_237',
        'region237': 'region_237',
        'r237': 'region_237',
        'region_233': 'region_233',
        'región_233': 'region_233',
        'region233': 'region_233',
        'r233': 'region_233',
        'sm_91': 'sm_91',
        'sm91': 'sm_91',
        'supermanzana_91': 'sm_91',
        'sm_77': 'sm_77',
        'sm77': 'sm_77',
        'supermanzana_77': 'sm_77',
      };
      
      return zoneMap[clean] || clean;
    },

    clientOrigin: (val) => {
      if (!val) return 'unknown';
      const v = String(val).toLowerCase().trim();
      const clean = v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      const originMap = {
        'cdmx': 'CDMX',
        'ciudad_mexico': 'CDMX',
        'ciudad_de_mexico': 'CDMX',
        'mexico': 'CDMX',
        'cancun_local': 'Cancun_Local',
        'cancunlocal': 'Cancun_Local',
        'cancun': 'Cancun_Local',
        'local': 'Cancun_Local',
        'quintana_roo': 'Quintana_Roo',
        'quintanaroo': 'Quintana_Roo',
        'qr': 'Quintana_Roo',
        'yucatan': 'Yucatan',
        'yucatan': 'Yucatan',
        'internacional': 'Internacional',
        'international': 'Internacional',
        'turista': 'Internacional',
        'turismo': 'Internacional',
        'expat': 'Internacional',
        'migrante': 'Migrante',
        'migrant': 'Migrante',
        'migracion': 'Migrante',
        'migracion': 'Migrante',
      };
      
      return originMap[clean] || v.toUpperCase().trim();
    },

    income: (val) => {
      if (!val) return 'unknown';
      const v = String(val).toLowerCase().trim();
      const clean = v.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      // Alto
      if (clean.includes('high') || clean.includes('alto') || clean.includes('superior')) {
        return 'alto';
      }
      
      // Medio-Alto
      if ((clean.includes('high') || clean.includes('upper') || clean.includes('medio')) &&
          (clean.includes('middle') || clean.includes('medio'))) {
        return 'medio_alto';
      }
      
      // Medio
      if (clean.includes('middle') || clean.includes('medio') || clean.includes('regular')) {
        if (!clean.includes('upper') && !clean.includes('lower') && !clean.includes('alto') && !clean.includes('bajo')) {
          return 'medio';
        }
      }
      
      // Medio-Bajo
      if ((clean.includes('low') || clean.includes('bajo') || clean.includes('lower')) &&
          (clean.includes('middle') || clean.includes('medio'))) {
        return 'medio_bajo';
      }
      
      // Bajo
      if (clean.includes('low') || clean.includes('bajo') || clean.includes('inferior')) {
        if (!clean.includes('middle') && !clean.includes('medio')) {
          return 'bajo';
        }
      }
      
      return clean || 'unknown';
    },

    age: (val) => {
      if (!val) return 'unknown';
      const v = String(val).trim();
      
      // Si ya está en formato "XX-YY", devolverlo
      if (/^\d+-\d+$/.test(v)) return v;
      
      // Si es un número, agrupar
      const num = parseInt(v);
      if (isNaN(num)) return v; // Devolver como está si no es número
      
      if (num < 18) return '12-17';
      if (num < 26) return '18-25';
      if (num < 36) return '26-35';
      if (num < 46) return '36-45';
      if (num < 56) return '46-55';
      if (num < 65) return '56-65';
      return '65+';
    },

    amount: (val) => {
      if (!val) return 0;
      const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
      return isNaN(num) ? 0 : num;
    },
    
    timestamp: (val) => {
      if (!val) return new Date().toISOString();
      try {
        const date = new Date(val);
        if (isNaN(date)) return new Date().toISOString();
        return date.toISOString();
      } catch (e) {
        console.warn(`⚠️ Timestamp inválido: "${val}"`);
        return new Date().toISOString();
      }
    }
  },

  /**
   * Normalizar un registro completo
   * @param {Object} record - Registro crudo del CSV
   * @returns {Object} Registro con campos canónicos
   */
  normalizeRecord(record) {
    if (!record || typeof record !== 'object') return null;

    const normalized = { _raw: record };

    // Mapear todos los campos
    Object.keys(record).forEach(sourceField => {
      const canonicalField = this.FIELD_MAP[sourceField] || sourceField.toLowerCase();
      let value = record[sourceField];

      // Aplicar normalizador de valores si existe
      if (this.VALUE_NORMALIZERS[canonicalField]) {
        value = this.VALUE_NORMALIZERS[canonicalField](value);
      }

      normalized[canonicalField] = value;
    });

    return normalized;
  },

  /**
   * Normalizar un array de registros
   * @param {Array} records - Array de registros crudos
   * @returns {Array} Array de registros normalizados
   */
  normalizeRecords(records) {
    if (!Array.isArray(records)) return [];
    return records
      .map(record => this.normalizeRecord(record))
      .filter(record => record !== null);
  },

  /**
   * Validar que un registro tiene los campos mínimos requeridos
   * @param {Object} record - Registro normalizado
   * @param {Array} requiredFields - Campos requeridos ['zone', 'pitchType', 'result']
   * @returns {Boolean}
   */
  validateRecord(record, requiredFields = ['zone', 'pitchType', 'result']) {
    if (!record || typeof record !== 'object') return false;
    return requiredFields.every(field => 
      field in record && record[field] !== null && record[field] !== undefined && record[field] !== ''
    );
  },

  /**
   * Detectar campos demográficos disponibles en el dataset
   * @param {Array} records - Array de registros normalizados
   * @returns {Object} {hasDemographic: bool, hasAge: bool, hasOccupation: bool, hasIncome: bool}
   */
  detectDemographicFields(records) {
    if (!Array.isArray(records) || records.length === 0) {
      return { hasDemographic: false, hasAge: false, hasOccupation: false, hasIncome: false };
    }

    const hasDemographic = records.some(r => r.demographic);
    const hasAge = records.some(r => r.age && r.age !== 'unknown');
    const hasOccupation = records.some(r => r.occupation && r.occupation !== 'unknown');
    const hasIncome = records.some(r => r.income && r.income !== 'unknown');

    return {
      hasDemographic,
      hasAge,
      hasOccupation,
      hasIncome,
      allDemographic: hasDemographic && hasAge && hasOccupation && hasIncome,
      anyDemographic: hasDemographic || hasAge || hasOccupation || hasIncome
    };
  },

  /**
   * Generar reporte de mapeo - útil para debugging
   * @param {Array} records - Array de registros crudos
   * @returns {Object} Reporte de mapeo y validación
   */
  generateMappingReport(records) {
    const normalized = this.normalizeRecords(records);
    const demographics = this.detectDemographicFields(normalized);
    
    const totalRecords = normalized.length;
    const validRecords = normalized.filter(r => this.validateRecord(r)).length;
    const missingFields = {};

    const requiredFields = ['zone', 'pitchType', 'result'];
    requiredFields.forEach(field => {
      missingFields[field] = normalized.filter(r => !r[field] || r[field] === 'unknown').length;
    });

    return {
      status: 'success',
      timestamp: new Date().toISOString(),
      totalRecords,
      validRecords,
      validationRate: (validRecords / totalRecords * 100).toFixed(2) + '%',
      missingFields,
      demographics,
      sampleRecord: normalized[0] || null,
      warnings: [
        validRecords < totalRecords ? `⚠️ ${totalRecords - validRecords} registros inválidos` : null,
        !demographics.anyDemographic ? '⚠️ Sin datos demográficos - análisis limitado a origen/pitch/zona' : null,
        missingFields.zone > totalRecords * 0.1 ? '⚠️ Muchos registros sin zona' : null
      ].filter(w => w)
    };
  }
};

console.log('✅ FieldMapper cargado');
