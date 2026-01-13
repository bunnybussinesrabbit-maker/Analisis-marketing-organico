/**
 * EXAMPLE PITCH RECORDS - Registros de ejemplo para análisis de efectividad
 * Este archivo muestra el formato de datos recomendado para almacenar pitches
 * y sus resultados. En producción, esto provendría de una base de datos o CSV.
 */

export const pitchRecordsExample = [
  // Zona Hotelera - Authority pitch con CDMX
  {
    id: "pitch_001",
    timestamp: "2026-01-09T14:30:00",
    zone: "zona_hotelera",
    clientOrigin: "cdmx",
    pitchType: "authority",
    socioeconomic: {
      income: "high",
      occupation: "professional",
      demographic: "36-45"
    },
    result: "successful",
    amount: 1250.00,
    metadata: {
      agentId: "agent_001",
      duration: 420,
      followUpRequired: false,
      notes: "Cliente interesado en certificaciones internacionales"
    }
  },
  // Zona Centro - Scarcity pitch con CDMX
  {
    id: "pitch_002",
    timestamp: "2026-01-09T15:45:00",
    zone: "zona_centro",
    clientOrigin: "cdmx",
    pitchType: "scarcity",
    socioeconomic: {
      income: "upper_middle",
      occupation: "entrepreneur",
      demographic: "40-50"
    },
    result: "successful",
    amount: 890.00,
    metadata: {
      agentId: "agent_001",
      duration: 300,
      followUpRequired: true,
      notes: "Respondió a urgencia, pidió exclusividad"
    }
  },
  // Región 237 - Community pitch con Local
  {
    id: "pitch_003",
    timestamp: "2026-01-09T10:20:00",
    zone: "region_237",
    clientOrigin: "cancun_local",
    pitchType: "community",
    socioeconomic: {
      income: "lower_middle",
      occupation: "commerce",
      demographic: "35-45"
    },
    result: "successful",
    amount: 450.00,
    metadata: {
      agentId: "agent_002",
      duration: 180,
      followUpRequired: false,
      notes: "Cliente apreciaba énfasis en apoyo local"
    }
  },
  // SM 77 - Community pitch con Migrante
  {
    id: "pitch_004",
    timestamp: "2026-01-09T11:00:00",
    zone: "sm_77",
    clientOrigin: "migrant",
    pitchType: "community",
    socioeconomic: {
      income: "low",
      occupation: "construction",
      demographic: "26-35"
    },
    result: "successful",
    amount: 300.00,
    metadata: {
      agentId: "agent_003",
      duration: 240,
      followUpRequired: false,
      notes: "Respuesta positiva a mensajes de pertenencia"
    }
  },
  // Zona Hotelera - Nostalgia pitch con Internacional fallido
  {
    id: "pitch_005",
    timestamp: "2026-01-09T16:30:00",
    zone: "zona_hotelera",
    clientOrigin: "international",
    pitchType: "nostalgia",
    socioeconomic: {
      income: "high",
      occupation: "tourist",
      demographic: "50-60"
    },
    result: "failed",
    amount: 0.00,
    metadata: {
      agentId: "agent_001",
      duration: 150,
      followUpRequired: false,
      notes: "Turista sin conexión emocional local, prefirió autoridad"
    }
  },
  // Centro - Nostalgia pitch con Local exitoso
  {
    id: "pitch_006",
    timestamp: "2026-01-09T14:00:00",
    zone: "zona_centro",
    clientOrigin: "cancun_local",
    pitchType: "nostalgia",
    socioeconomic: {
      income: "middle",
      occupation: "service",
      demographic: "55-65"
    },
    result: "successful",
    amount: 680.00,
    metadata: {
      agentId: "agent_002",
      duration: 360,
      followUpRequired: false,
      notes: "Conexión fuerte con mensajes de tradición familiar"
    }
  },
  // SM 91 - Authority pitch con profesional
  {
    id: "pitch_007",
    timestamp: "2026-01-09T12:30:00",
    zone: "sm_91",
    clientOrigin: "cancun_local",
    pitchType: "authority",
    socioeconomic: {
      income: "middle",
      occupation: "professional",
      demographic: "32-42"
    },
    result: "successful",
    amount: 750.00,
    metadata: {
      agentId: "agent_003",
      duration: 300,
      followUpRequired: true,
      notes: "Exigió certificaciones y referencias"
    }
  },
  // Región 233 - Authority pitch con joven
  {
    id: "pitch_008",
    timestamp: "2026-01-09T17:00:00",
    zone: "region_233",
    clientOrigin: "cancun_local",
    pitchType: "authority",
    socioeconomic: {
      income: "lower_middle",
      occupation: "commerce",
      demographic: "26-35"
    },
    result: "successful",
    amount: 520.00,
    metadata: {
      agentId: "agent_001",
      duration: 240,
      followUpRequired: false,
      notes: "Joven profesional respondió bien a credibilidad"
    }
  },
  // Zona Hotelera - Scarcity pendiente
  {
    id: "pitch_009",
    timestamp: "2026-01-09T15:15:00",
    zone: "zona_hotelera",
    clientOrigin: "international",
    pitchType: "scarcity",
    socioeconomic: {
      income: "high",
      occupation: "professional",
      demographic: "45-55"
    },
    result: "pending",
    amount: 0.00,
    metadata: {
      agentId: "agent_002",
      duration: 180,
      followUpRequired: true,
      notes: "Cliente en consideración, siguió visitando otros sitios"
    }
  }
];

/**
 * ANALYSIS FUNCTIONS - Funciones para analizar cruces de datos
 */

/**
 * Calcula tasa de conversión por dimensión
 * @param {Array} records - Array de pitch records
 * @param {string} dimension - 'pitchType', 'zone', 'clientOrigin', etc.
 * @returns {Object} Tasa de conversión por dimensión
 */
export function calculateConversionRateByDimension(records, dimension) {
  const grouped = {};
  
  records.forEach(record => {
    const key = record[dimension];
    if (!grouped[key]) {
      grouped[key] = { successful: 0, failed: 0, pending: 0, total: 0 };
    }
    grouped[key][record.result]++;
    grouped[key].total++;
  });
  
  // Calcular tasas
  const rates = {};
  Object.keys(grouped).forEach(key => {
    const data = grouped[key];
    rates[key] = {
      conversionRate: data.successful / data.total,
      successCount: data.successful,
      failureCount: data.failed,
      pendingCount: data.pending,
      totalCount: data.total
    };
  });
  
  return rates;
}

/**
 * Analiza efectividad cruzada de dos dimensiones
 * @param {Array} records - Array de pitch records
 * @param {string} dim1 - Primera dimensión (ej. 'zone')
 * @param {string} dim2 - Segunda dimensión (ej. 'pitchType')
 * @returns {Object} Matriz de efectividad cruzada
 */
export function crossDimensionAnalysis(records, dim1, dim2) {
  const matrix = {};
  
  records.forEach(record => {
    const key1 = record[dim1];
    const key2 = record[dim2];
    const compositeKey = `${key1}_${key2}`;
    
    if (!matrix[compositeKey]) {
      matrix[compositeKey] = { successful: 0, failed: 0, pending: 0, total: 0 };
    }
    matrix[compositeKey][record.result]++;
    matrix[compositeKey].total++;
  });
  
  // Calcular tasas
  const results = {};
  Object.keys(matrix).forEach(key => {
    const data = matrix[key];
    results[key] = {
      conversionRate: data.successful / data.total,
      successCount: data.successful,
      totalCount: data.total
    };
  });
  
  return results;
}

/**
 * Obtiene mejores pitches por zona
 * @param {Array} records - Array de pitch records
 * @param {string} zone - ID de zona
 * @returns {Object} Ranking de pitches por efectividad
 */
export function getBestPitchesByZone(records, zone) {
  const zoneRecords = records.filter(r => r.zone === zone);
  const pitchEffectiveness = calculateConversionRateByDimension(zoneRecords, 'pitchType');
  
  return Object.entries(pitchEffectiveness)
    .sort((a, b) => b[1].conversionRate - a[1].conversionRate)
    .reduce((acc, [pitch, data]) => {
      acc[pitch] = data;
      return acc;
    }, {});
}

/**
 * Identifica picos horarios por zona y pitch
 * @param {Array} records - Array de pitch records
 * @param {string} zone - ID de zona
 * @param {string} pitchType - Tipo de pitch
 * @returns {Object} Distribución horaria de conversiones
 */
export function getOptimalHoursByZoneAndPitch(records, zone, pitchType) {
  const filtered = records.filter(
    r => r.zone === zone && r.pitchType === pitchType
  );
  
  const hourlyData = {};
  filtered.forEach(record => {
    const hour = new Date(record.timestamp).getHours();
    const hourKey = `${hour.toString().padStart(2, '0')}:00`;
    
    if (!hourlyData[hourKey]) {
      hourlyData[hourKey] = { successful: 0, total: 0 };
    }
    hourlyData[hourKey].total++;
    if (record.result === 'successful') {
      hourlyData[hourKey].successful++;
    }
  });
  
  // Calcular tasas por hora
  const rates = {};
  Object.keys(hourlyData).forEach(hour => {
    rates[hour] = {
      conversionRate: hourlyData[hour].successful / hourlyData[hour].total,
      successCount: hourlyData[hour].successful,
      totalCount: hourlyData[hour].total
    };
  });
  
  return rates;
}
