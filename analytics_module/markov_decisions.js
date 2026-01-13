function markovDecisionProcess(currentState, zones) {
  // Estados: {zona, hora, inventario, energía_vendedor}
  // Acciones: {visitar, saltar, descansar}
  // Recompensa: venta realizada - costo tiempo/desplazamiento
  
  const Q = {}; // Tabla Q-learning
  
  // Función de recompensa
  const reward = (state, action) => {
    if (action === 'visitar') {
      const expectedSale = zoneData[state.zona].avgSale * 
                          timeFactor[state.hora] * 
                          energyFactor[state.energia];
      const travelCost = distanceCost(state.zona, currentState.zona);
      return expectedSale - travelCost;
    }
    if (action === 'descansar') {
      return state.energia < 0.3 ? 5 : -2;
    }
    return 0; // Saltar
  };
  
  // Política óptima (simplificada)
  return zones.map(zone => ({
    zone,
    action: zone.priority > 0.7 ? 'visitar' : 
            currentState.energia < 0.3 ? 'descansar' : 'saltar',
    expectedValue: reward(currentState, 'visitar')
  })).sort((a, b) => b.expectedValue - a.expectedValue);
}