/**
 * Utilidades geográficas específicas para Cancún
 */
export const GeoUtils = {
  // Coordenadas de referencia de Cancún
  CANCUN_CENTER: { lat: 21.1619, lng: -86.8515 },
  
  // Límites aproximados de Cancún
  BOUNDS: {
    north: 21.25,
    south: 20.95,
    east: -86.75,
    west: -86.95
  },
  
  // Zonas geoestadísticas de Cancún con polígonos aproximados
  ZONES: {
    'centro': {
      center: { lat: 21.1619, lng: -86.8515 },
      polygon: [
        { lat: 21.168, lng: -86.858 },
        { lat: 21.168, lng: -86.845 },
        { lat: 21.155, lng: -86.845 },
        { lat: 21.155, lng: -86.858 }
      ],
      radius: 1.5, // km
      type: 'comercial'
    },
    'hotelera': {
      center: { lat: 21.1406, lng: -86.8089 },
      polygon: [
        { lat: 21.150, lng: -86.825 },
        { lat: 21.150, lng: -86.795 },
        { lat: 21.130, lng: -86.795 },
        { lat: 21.130, lng: -86.825 }
      ],
      radius: 3.0,
      type: 'turistica'
    },
    '237': {
      center: { lat: 21.2000, lng: -86.9000 },
      polygon: [
        { lat: 21.210, lng: -86.910 },
        { lat: 21.210, lng: -86.890 },
        { lat: 21.190, lng: -86.890 },
        { lat: 21.190, lng: -86.910 }
      ],
      radius: 2.0,
      type: 'residencial'
    },
    '233': {
      center: { lat: 21.1800, lng: -86.8800 },
      polygon: [
        { lat: 21.185, lng: -86.885 },
        { lat: 21.185, lng: -86.875 },
        { lat: 21.175, lng: -86.875 },
        { lat: 21.175, lng: -86.885 }
      ],
      radius: 1.0,
      type: 'residencial'
    },
    '91': {
      center: { lat: 21.1550, lng: -86.8650 },
      polygon: [
        { lat: 21.160, lng: -86.870 },
        { lat: 21.160, lng: -86.860 },
        { lat: 21.150, lng: -86.860 },
        { lat: 21.150, lng: -86.870 }
      ],
      radius: 1.0,
      type: 'mixto'
    },
    '77': {
      center: { lat: 21.1500, lng: -86.8700 },
      polygon: [
        { lat: 21.155, lng: -86.875 },
        { lat: 21.155, lng: -86.865 },
        { lat: 21.145, lng: -86.865 },
        { lat: 21.145, lng: -86.875 }
      ],
      radius: 1.0,
      type: 'residencial'
    }
  },
  
  // Constantes geográficas
  EARTH_RADIUS_KM: 6371,
  DEG_TO_KM: 111.32, // Aproximación: 1 grado ≈ 111.32 km
  
  /**
   * Calcular distancia entre dos puntos (Haversine)
   */
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const toRad = (angle) => angle * Math.PI / 180;
    
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return GeoUtils.EARTH_RADIUS_KM * c;
  },
  
  /**
   * Determinar zona a partir de coordenadas
   */
  getZoneFromCoordinates: (lat, lng) => {
    // Primero verificar si está dentro de algún polígono
    for (const [zoneName, zone] of Object.entries(GeoUtils.ZONES)) {
      if (GeoUtils.isPointInPolygon({ lat, lng }, zone.polygon)) {
        return zoneName;
      }
    }
    
    // Si no está en polígono, usar distancia al centro más cercano
    let closestZone = 'centro';
    let minDistance = Infinity;
    
    for (const [zoneName, zone] of Object.entries(GeoUtils.ZONES)) {
      const distance = GeoUtils.calculateDistance(
        lat, lng, 
        zone.center.lat, zone.center.lng
      );
      
      if (distance < minDistance && distance < zone.radius) {
        minDistance = distance;
        closestZone = zoneName;
      }
    }
    
    return closestZone;
  },
  
  /**
   * Verificar si punto está dentro de polígono (ray casting algorithm)
   */
  isPointInPolygon: (point, polygon) => {
    let inside = false;
    
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;
      
      const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
                       (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);
      
      if (intersect) inside = !inside;
    }
    
    return inside;
  },
  
  /**
   * Generar punto aleatorio dentro de una zona
   */
  generateRandomPointInZone: (zoneName, count = 1) => {
    const zone = GeoUtils.ZONES[zoneName];
    
    if (!zone) {
      console.warn(`Zona ${zoneName} no encontrada, usando centro de Cancún`);
      return Array(count).fill().map(() => ({
        lat: GeoUtils.CANCUN_CENTER.lat + (Math.random() - 0.5) * 0.02,
        lng: GeoUtils.CANCUN_CENTER.lng + (Math.random() - 0.5) * 0.02
      }));
    }
    
    // Generar puntos dentro del polígono
    const points = [];
    
    while (points.length < count) {
      // Encontrar bounding box del polígono
      const lngs = zone.polygon.map(p => p.lng);
      const lats = zone.polygon.map(p => p.lat);
      
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      
      // Generar punto aleatorio en bounding box
      const lat = minLat + Math.random() * (maxLat - minLat);
      const lng = minLng + Math.random() * (maxLng - minLng);
      
      // Verificar si está dentro del polígono
      if (GeoUtils.isPointInPolygon({ lat, lng }, zone.polygon)) {
        points.push({ lat, lng });
      }
    }
    
    return count === 1 ? points[0] : points;
  },
  
  /**
   * Calcular centro de masa de múltiples puntos
   */
  calculateCentroid: (points) => {
    if (points.length === 0) return GeoUtils.CANCUN_CENTER;
    
    const sum = points.reduce((acc, point) => ({
      lat: acc.lat + point.lat,
      lng: acc.lng + point.lng
    }), { lat: 0, lng: 0 });
    
    return {
      lat: sum.lat / points.length,
      lng: sum.lng / points.length
    };
  },
  
  /**
   * Calcular densidad de puntos por zona
   */
  calculatePointDensity: (points, zoneName) => {
    const zone = GeoUtils.ZONES[zoneName];
    if (!zone) return 0;
    
    // Calcular área aproximada de la zona en km²
    const area = GeoUtils.calculatePolygonArea(zone.polygon);
    
    // Contar puntos en la zona
    const pointsInZone = points.filter(point => 
      GeoUtils.getZoneFromCoordinates(point.lat, point.lng) === zoneName
    ).length;
    
    return pointsInZone / area;
  },
  
  /**
   * Calcular área de polígono en km² (aproximado)
   */
  calculatePolygonArea: (polygon) => {
    if (polygon.length < 3) return 0;
    
    let area = 0;
    
    for (let i = 0; i < polygon.length; i++) {
      const j = (i + 1) % polygon.length;
      
      const xi = polygon[i].lng * GeoUtils.DEG_TO_KM;
      const yi = polygon[i].lat * GeoUtils.DEG_TO_KM;
      const xj = polygon[j].lng * GeoUtils.DEG_TO_KM;
      const yj = polygon[j].lat * GeoUtils.DEG_TO_KM;
      
      area += xi * yj - xj * yi;
    }
    
    return Math.abs(area / 2);
  },
  
  /**
   * Calcular ruta óptima entre puntos (algoritmo del vecino más cercano)
   */
  calculateNearestNeighborRoute: (points, startPoint) => {
    if (points.length === 0) return [];
    
    const route = [startPoint];
    const unvisited = [...points];
    
    let current = startPoint;
    
    while (unvisited.length > 0) {
      // Encontrar punto más cercano no visitado
      let nearestIndex = 0;
      let nearestDistance = Infinity;
      
      for (let i = 0; i < unvisited.length; i++) {
        const distance = GeoUtils.calculateDistance(
          current.lat, current.lng,
          unvisited[i].lat, unvisited[i].lng
        );
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }
      
      // Añadir a la ruta
      current = unvisited[nearestIndex];
      route.push(current);
      unvisited.splice(nearestIndex, 1);
    }
    
    return route;
  },
  
  /**
   * Calcular distancia total de una ruta
   */
  calculateRouteDistance: (route) => {
    let totalDistance = 0;
    
    for (let i = 1; i < route.length; i++) {
      totalDistance += GeoUtils.calculateDistance(
        route[i-1].lat, route[i-1].lng,
        route[i].lat, route[i].lng
      );
    }
    
    return totalDistance;
  },
  
  /**
   * Optimización 2-opt para mejorar ruta
   */
  optimizeRoute2Opt: (route) => {
    let bestRoute = [...route];
    let bestDistance = GeoUtils.calculateRouteDistance(route);
    let improved = true;
    
    while (improved) {
      improved = false;
      
      for (let i = 1; i < route.length - 2; i++) {
        for (let j = i + 1; j < route.length - 1; j++) {
          // Intentar intercambio 2-opt
          const newRoute = [
            ...bestRoute.slice(0, i),
            ...bestRoute.slice(i, j + 1).reverse(),
            ...bestRoute.slice(j + 1)
          ];
          
          const newDistance = GeoUtils.calculateRouteDistance(newRoute);
          
          if (newDistance < bestDistance) {
            bestRoute = newRoute;
            bestDistance = newDistance;
            improved = true;
          }
        }
      }
    }
    
    return bestRoute;
  },
  
  /**
   * Calcular cobertura territorial
   */
  calculateCoverage: (points, radiusKm = 0.5) => {
    const zones = Object.keys(GeoUtils.ZONES);
    const coverage = {};
    
    zones.forEach(zoneName => {
      const zone = GeoUtils.ZONES[zoneName];
      const zoneArea = GeoUtils.calculatePolygonArea(zone.polygon);
      
      // Puntos en esta zona
      const zonePoints = points.filter(point => 
        GeoUtils.getZoneFromCoordinates(point.lat, point.lng) === zoneName
      );
      
      if (zonePoints.length === 0) {
        coverage[zoneName] = {
          percentage: 0,
          points: 0,
          recommendation: 'Sin cobertura'
        };
        return;
      }
      
      // Área cubierta aproximada (círculos de cobertura)
      const coveredArea = Math.min(
        zoneArea,
        zonePoints.length * Math.PI * Math.pow(radiusKm, 2)
      );
      
      const percentage = (coveredArea / zoneArea) * 100;
      
      coverage[zoneName] = {
        percentage: parseFloat(percentage.toFixed(1)),
        points: zonePoints.length,
        recommendation: percentage > 70 ? 'Cobertura adecuada' :
                      percentage > 30 ? 'Cobertura media' :
                      'Cobertura insuficiente'
      };
    });
    
    return coverage;
  },
  
  /**
   * Generar heatmap data para visualización
   */
  generateHeatmapData: (points, zoneName, resolution = 50) => {
    const zone = GeoUtils.ZONES[zoneName];
    if (!zone) return [];
    
    // Obtener bounding box
    const lngs = zone.polygon.map(p => p.lng);
    const lats = zone.polygon.map(p => p.lat);
    
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    
    const lngStep = (maxLng - minLng) / resolution;
    const latStep = (maxLat - minLat) / resolution;
    
    const heatmap = [];
    
    // Filtrar puntos de la zona
    const zonePoints = points.filter(point => 
      GeoUtils.getZoneFromCoordinates(point.lat, point.lng) === zoneName
    );
    
    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        const lat = minLat + i * latStep;
        const lng = minLng + j * lngStep;
        
        // Verificar si está dentro del polígono
        if (GeoUtils.isPointInPolygon({ lat, lng }, zone.polygon)) {
          // Calcular densidad en esta celda
          let intensity = 0;
          
          zonePoints.forEach(point => {
            const distance = GeoUtils.calculateDistance(lat, lng, point.lat, point.lng);
            if (distance < 0.1) { // 100 metros
              intensity += 1 / (distance + 0.01);
            }
          });
          
          if (intensity > 0) {
            heatmap.push({
              lat,
              lng,
              intensity: Math.min(1, intensity / 10) // Normalizar
            });
          }
        }
      }
    }
    
    return heatmap;
  },
  
  /**
   * Verificar si coordenadas están dentro de Cancún
   */
  isInCancun: (lat, lng) => {
    return lat >= GeoUtils.BOUNDS.south &&
           lat <= GeoUtils.BOUNDS.north &&
           lng >= GeoUtils.BOUNDS.west &&
           lng <= GeoUtils.BOUNDS.east;
  },
  
  /**
   * Convertir grados decimales a DMS (grados, minutos, segundos)
   */
  toDMS: (decimal, isLatitude) => {
    const direction = isLatitude ?
      (decimal >= 0 ? 'N' : 'S') :
      (decimal >= 0 ? 'E' : 'W');
    
    const absDecimal = Math.abs(decimal);
    const degrees = Math.floor(absDecimal);
    const minutes = Math.floor((absDecimal - degrees) * 60);
    const seconds = ((absDecimal - degrees - minutes / 60) * 3600).toFixed(1);
    
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  }
};

if (typeof window !== 'undefined') {
  window.GeoUtils = GeoUtils;
}

export default GeoUtils;