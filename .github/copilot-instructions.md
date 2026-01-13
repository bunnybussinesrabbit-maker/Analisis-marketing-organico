# Copilot Instructions for Geo-Suite Cancún PRO

**Project**: Door-to-door sales analytics platform for Cancún with advanced predictive modeling.
**Stack**: Vanilla JavaScript, PWA, Mapbox, Chart.js, LLM APIs (Groq/OpenAI/DeepSeek).

## Architecture Overview

### Core Module Structure
- **groq_cliente.js**: LLM integration wrapper (Groq/OpenAI). Wraps API calls with context about Cancún zones, socioeconomic profiles, and D2D sales tactics.
- **modules_integration.js**: Central orchestrator that loads and coordinates analytics modules.
- **knowledgebase.js**: Business logic layer with KPIs, zone strategies, and sales best practices derived from Portatour methodology.
- **openai_strategies.js**: Predefined sales strategies per zone (Región 237, 233, SM 91, SM 77, Centro, Zona Hotelera).

### Analytics Module Stack (in `analytics_module/`)
Each module implements domain-specific predictive models:
1. **bayesian_analytics.js**: P(sale|zone,hour) using Bayes' theorem on historical data.
2. **timeseries_forecast.js**: Exponential smoothing (Holt-Winters) for hourly peaks and trends.
3. **montecarlo_logistics.js**: Route optimization via probability simulation (10k iterations).
4. **genetic_algorithm.js**: Traveling Salesman Problem solver for visit sequencing.
5. **markov_decisions.js**: State-based next-best-action recommendations.
6. **market_saturation.js**: Diminishing returns modeling per zone.
7. **canibalizacion.js**: Cross-zone demand cannibalization effects.
8. **probabilidad_empirica.js**: Zone selection via empirical probability distributions.

### UI & Persistence
- **index.html**: 4211-line single-page app with Mapbox integration, PWA manifest, Chart.js dashboards.
- **serviceworker.js**: Offline caching and asset management.
- **manifest.json**: PWA metadata (Geo-Suite brand, icons, shortcuts).

## Data Flows & Critical Patterns

### Context-Aware LLM Integration
```javascript
// In groq_cliente.js - Enrich prompts with Cancún-specific context
enhancedPrompt = userPrompt + contextData (zone profiles, KPIs, time-of-day logistics)
```
LLM responses are **always contextualized** by geographic zones and socioeconomic segments. Never use generic prompts—inject zone profiles (density, income level, security profiles).

### Analytics Pipeline
```
Historical Sales Data → 6 Parallel Models → AnalyticsOrchestrator → Aggregated Recommendations
```
- Each model returns raw outputs (probabilities, forecasts, routes, state values).
- Orchestrator combines via weighted averaging or consensus thresholding.
- Results feed into UI dashboards and LLM coaching context.

### Zone-Centric Design
**All analyses partition by zone**: Región 237, 233, SM 91, SM 77, Centro, Zona Hotelera.
- Zone strategies defined in `openai_strategies.js` include approach, key phrases, best times, warnings.
- Bayesian and Markov models leverage zone-hour combinations as primary dimensions.
- Route optimization (genetic algorithm) respects zone boundaries and travel logistics.

### Pitch Data Model
Pitches are cross-referenced with **zone, time, client origin, pitch type, and conversion result** for effectiveness analysis:
```javascript
{
  zoneId: "zona_hotelera",           // Canonical zone ID
  timestamp: "2026-01-09T14:30:00", // ISO 8601 format (HH:MM essential for Bayesian)
  clientOrigin: "CDMX",               // Geographic/demographic source
  pitchType: "Turismo Premium",       // Sales pitch variant/strategy
  result: "successful",               // "successful" | "failed" | "pending"
  metadata: {
    agentId: "agent_001",
    duration: 300,                    // seconds
    followUpRequired: false
  }
}
```
This structure enables cross-zone effectiveness analysis: **pitch_type × zone × hour → conversion_rate**.

## Code Conventions & Patterns

### Zone Configuration Module
Create or reference a canonical **`zones.js`** (JSON or JS export) with immutable zone definitions:
```javascript
// zones.js - Exported as object or JSON
export const ZONES = {
  zona_hotelera: {
    id: "zona_hotelera",
    name: "Zona Hotelera",
    coordinates: [21.135, -86.745],  // [lat, lng] for Turf.js
    socioeconomic: "high",
    density: "medium",
    security: "high"
  },
  zona_centro: {
    id: "zona_centro",
    name: "Centro",
    coordinates: [21.161, -86.851],
    socioeconomic: "medium",
    density: "high",
    security: "medium"
  },
  // Expandable: add new zones without refactoring analytics
};
```
**Key principle**: Zone definitions are immutable; analytics modules iterate over `Object.values(ZONES)` to remain scalable.
- **Analytics modules**: Filename = function name (e.g., `bayesian_analytics.js` exports `bayesianConversionProbability()`).
- **Utilities**: Grouped in `utils/` (math_utils, stat_utils, goe_utils). Export as objects with methods: `StatsUtils.descriptiveStats()`, `MathUtils.calculateDistance()`.
- **Global knowledgebase**: `knowledgebase.js` = singleton object with nested namespaces (Strategies, metrics).

### Function Signatures
Analytics functions follow predictable patterns:
```javascript
// Probabilistic functions
function bayesianConversionProbability(zone, hour, historicalData) → Number [0-1]
function timeSeriesAnalysis(zone) → {hourlyData, smoothed, peaks, recommendation}

// Optimization functions
function geneticAlgorithmRouteOptimization(points, generations = 100) → {bestRoute, fitness}
function monteCarloLogisticSimulation(routes, iterations = 10000) → {probabilities, confidence}
```

### Error Handling & Fallbacks
- Try-catch blocks wrap async LLM calls; fallback to cached strategies.
- `modules_integration.js` loads modules with `Promise.all()` and falls back to `loadFallbackModules()` if import fails.
- UI gracefully degrades if analytics fail (shows predefined strategies instead).

### Mathematical Conventions
- Probabilities: Clamp to [0.05, 0.95] to avoid edge-case confidence issues.
- Exponential smoothing alpha: Default 0.3 (tune per zone volatility).
- Monte Carlo: 10,000 iterations balances accuracy vs. browser performance.
- Genetic algorithm: 100 generations default; scaling depends on route complexity.

## Key Development Workflows

### Data Normalization for Pitch Analysis
Before any cross-zone or temporal analysis, normalize pitch records:
```javascript
// Validation layer
function normalizePitch(rawData) {
  return {
    zoneId: rawData.zoneId.toLowerCase(),       // Ensure zone ID exists in ZONES
    timestamp: new Date(rawData.timestamp),     // ISO 8601 → Date object
    clientOrigin: rawData.clientOrigin,         // CDMX, Cancún, estado, etc.
    pitchType: rawData.pitchType,               // "Turismo Premium", "Básico", etc.
    result: ["successful", "failed", "pending"].includes(rawData.result) 
      ? rawData.result 
      : "pending",
    duration: rawData.metadata?.duration || 0
  };
}
```

### Effectiveness Analysis Workflow
1. **Aggregate pitches** by zone + hour + pitch_type + client_origin
2. **Calculate conversion rates**: successful_count / total_count per segment
3. **Compare zones**: identify which pitch types outperform by geography
4. **Temporal trends**: detect peak hours and seasonal patterns
5. **Cross-segment insights**: e.g., CDMX clients + Zona Hotelera + Turismo Premium = 62% conversion

### Adding a New Analytic Model
1. Create `analytics_module/[model_name].js` with a single exported function.
2. Register in `modules_integration.js` under `loadAllModules()`.
3. Add test data (historical sales, routes, zone profiles) to test function in isolation.
4. Return standardized output: `{recommendation, confidence, details}`.

### Updating Zone Strategies
1. Edit `openai_strategies.js` in `predefinedStrategies` object (add approach, techniques, keyPhrases, bestTimes, warning).
2. Sync zone ID with maps/data layers (Región 237, SM 91, etc.).
3. Test LLM integration via `groq_cliente.js` to ensure context is injected.

### Testing LLM Integration
```javascript
const coach = new GroqSalesCoach(apiKey);
await coach.validateConnection(); // Check API key and models
const response = await coach.sendPrompt(prompt, {contextData: zoneData});
```

### Offline & PWA Debugging
- Service Worker caches all JS modules; clear cache when debugging offline behavior.
- Test via DevTools → Application → Service Workers or `CACHE_NAME` in `serviceworker.js`.

## External Dependencies & APIs

### LLM Providers
- **Groq API**: Primary (fast, cheap inference). Base: `https://api.groq.com/openai/v1`, Model: `llama-3.1-8b-instant`.
- **OpenAI**: Fallback for complex reasoning. Model selection in `groq_cliente.js` constructor.
- **DeepSeek**: Alternative for route optimization (genetic algorithm leverage).

### Geographic & Visualization
- **Mapbox GL JS** (v2.15.0): Map rendering, zone overlays. Access token required in index.html.
- **Turf.js** (v6): Geographic calculations (distance, bearing, polygon analysis).
- **Chart.js**: Real-time dashboard charts (time series, distributions, comparisons).

### Data Processing
- **PapaParse**: CSV parsing for bulk sales data import.
- **No backend**: All analytics run client-side (PWA-ready, offline-capable).

## Testing & Validation Checklist

- [ ] Bayesian posterior probabilities stay within [0.05, 0.95] bounds.
- [ ] Time series peaks detected at expected hours (morning vs. evening varies by zone).
- [ ] Genetic algorithm route minimizes total distance (fitness improves over generations).
- [ ] Monte Carlo simulations converge on logistics KPIs (AVG_VISITS_PER_HOUR, CONVERSION_RATE).
- [ ] LLM responses include zone-specific context (not generic coaching).
- [ ] Service Worker caches all assets on first load.
- [ ] Offline mode shows cached strategies and historical analyses.

## Critical Notes for AI Agents

1. **Zone Context is Mandatory**: Never propose logic that treats zones as homogeneous. Each zone has unique density, income, security profile, and optimal sales approach.
2. **LLM Integration**: Always pass contextData (zone profiles, historical metrics) to LLM calls. Raw prompts will produce generic, non-actionable responses.
3. **Performance**: Analytics run in browser; avoid nested loops >O(n²) for >1000 data points. Genetic algorithm generations should cap at 100-200.
4. **Data Format**: Historical sales = `{zona, hora (HH:MM), monto, estado}`. Routes = `{lat, lng, id}`. Zones map to predefined IDs (region_237, sm_91, etc.).
5. **Fallback-First Design**: If any module fails to load, UI continues with predefined strategies. No single module should block user interaction.
6. **PWA Longevity**: Changes to analytics modules require Service Worker cache version bump (`CACHE_NAME` in serviceworker.js) to propagate.

## Advanced Analysis Patterns

### Pitch Effectiveness Cross-Zone Analysis
Measure how a sales pitch performs across zones and client demographics:
```javascript
// Example: Compare pitch effectiveness
const effectivenessMatrix = {
  "Turismo Premium": {
    "zona_hotelera": { "CDMX": 0.68, "Cancun": 0.45 },
    "zona_centro": { "CDMX": 0.52, "Cancun": 0.38 }
  },
  "Basico": {
    "sm_77": { "Local": 0.42, "Migrantes": 0.55 }
  }
};
```

### Recommended Analysis Queries
- **By Zone & Hour**: Which pitch type converts best in Zona Hotelera between 2-4 PM?
- **By Client Origin**: Do CDMX clients respond to premium pitches in Centro?
- **Temporal Evolution**: How has pitch effectiveness changed week-over-week?
- **Cannibalization**: Does pitching Type A reduce Type B conversions in the same zone?
- **Optimal Routing**: Which zone should be visited first based on pitch availability and time?

### Scalability for New Zones
To add a new zone (e.g., "Isla Mujeres" satellite market):
1. Add entry to `zones.js` with coordinates and socioeconomic profile.
2. Update `openai_strategies.js` with zone-specific approach and key phrases.
3. Bayesian and time-series models automatically adapt (no code refactoring).
4. Run historical pitches through normalization; cross-compare with existing zones.

## UI/UX Visibility & Responsivity Guidelines

### Critical Layout Issues
**Overlapping DIVs & Z-index Management**: The main interface contains multiple overlay elements (modals, sidebars, dashboards). When modifying layout:
- Always verify z-index stacking context in `index.html` styles (check `.sidebar`, `.modal`, `.overlay` classes)
- Test modal visibility against maps, charts, and form elements—ensure modals always appear on top
- Mobile view (<768px) requires special attention: sidebars collapse, modals resize, cards stack vertically

### Element Visibility Checklist
Before committing UI changes:
1. **Test at 3 breakpoints**: Desktop (1920px), Tablet (768px), Mobile (375px)
2. **Check z-index layers**: Sidebar (z-index: 100) > Content (z-index: 1) > Maps (z-index: 10)
3. **Verify modal overlays**: Modal backdrop must cover underlying elements; close buttons remain clickable
4. **Validate input focus**: Form fields, dropdowns, and search bars maintain keyboard accessibility when overlays are active
5. **Test with Service Worker**: Cached styles may not update—clear cache or increment `CACHE_NAME` in `serviceworker.js` when modifying CSS

### Common Pitfalls
- **Position: absolute/fixed without containment**: Can break responsive layout on small screens
- **Hardcoded widths**: Use percentages or CSS Grid for flexibility across viewports
- **Display: none on active elements**: Hidden sidebar/nav can trap focus; use `visibility: hidden` or `clip-path` instead
- **Overflow hidden without scrolling**: Truncates content on mobile; add `overflow-y: auto` with max-height constraints

### Responsive Design Pattern
```css
/* Base: Mobile-first approach */
.app-container {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
}

/* Tablet & up */
@media (min-width: 768px) {
  .app-container {
    grid-template-columns: 280px 1fr; /* Sidebar + content */
  }
}

/* Desktop optimization */
@media (min-width: 1920px) {
  .sidebar {
    width: 320px; /* Slightly wider on ultrawide displays */
  }
}
```

### Testing Responsivity
- Use DevTools Device Emulation (Ctrl+Shift+M) for mobile testing
- Test actual touch interactions on real devices (mouse hover doesn't exist on touch)
- Verify that modals and overlays don't exceed viewport boundaries
- Check that sticky/fixed elements (navbar, sidebars) don't interfere with scrolling

## Door-to-Door Sales Analytics: Data Crossing & Pitch Effectiveness

### Core Data Dimensions

The system analyzes sales effectiveness across 5 primary dimensions:

```javascript
// Data structure for complete pitch analysis
{
  id: "pitch_001",
  timestamp: "2026-01-09T14:30:00",    // Time dimension
  zone: "zona_hotelera",                // Place dimension
  clientOrigin: "CDMX",                 // Client origin dimension
  pitchType: "nostalgia",               // Pitch type dimension (4 types)
  socioeconomic: {
    income: "high",                     // Socioeconomic dimension
    occupation: "turista",
    demographic: "30-45"
  },
  result: "successful",                 // Outcome
  amount: 250.00,
  metadata: {
    agentId: "agent_001",
    duration: 420                       // seconds
  }
}
```

### 4 Pitch Types (Disertaciones de Ventas)
Each pitch activates specific psychological triggers:

1. **Nostalgia** - Recalls memories, familiarity, heritage
   - Best for: Mature audiences (40+), family-oriented products
   - Key phrases: "Como en los viejos tiempos...", "Recuerdos de calidad"
   - Zones: Centro, Región 237

2. **Authority** - Expert credibility, social proof, endorsements
   - Best for: Tech-savvy, professional segments
   - Key phrases: "Certificado por...", "Expertos recomiendan...", "Número 1 en..."
   - Zones: Zona Hotelera, SM 91

3. **Scarcity** - Limited availability, urgency, exclusivity
   - Best for: Decision-makers, high income, status-conscious
   - Key phrases: "Últimas unidades", "Oferta limitada", "Hoy solamente"
   - Zones: Zona Hotelera, Centro

4. **Community** - Belonging, social connection, local pride
   - Best for: Family units, collective cultures, local populations
   - Key phrases: "Tu comunidad confía en...", "Apoya lo local", "Juntos crecemos"
   - Zones: Región 237, SM 77, Región 233

### Client Origin Categories
```javascript
// Geographic & demographic origins
const clientOrigins = [
  "CDMX",           // Ciudad de México
  "Cancun_Local",   // Cancún residents
  "Quintana_Roo",   // Regional (QR state)
  "Yucatan",        // Neighboring state
  "International",  // Tourists/expat
  "Migrant"         // Migration-based populations
];
```

### Socioeconomic Context Profiles
```javascript
const socioeconomicProfiles = {
  income: ["low", "lower_middle", "middle", "upper_middle", "high"],
  occupation: [
    "unemployed", "artisan", "construction", "commerce", 
    "service", "professional", "entrepreneur", "tourist"
  ],
  demographic: [
    "18-25", "26-35", "36-45", "46-55", "56-65", "65+"
  ]
};
```

### Recommended Data Format: **Hybrid JSON + JS**

**Why hybrid?**
- **JSON** for static reference data (zones, pitch types, origins, profiles)
- **JS** for analytics logic and data aggregation functions

```
data/
├── zones.json              // Zone definitions with coordinates
├── pitchTypes.json         // 4 pitch types + metadata
├── clientOrigins.json      // Origin categories
├── socioeconomicProfiles.json  // Income, occupation, demographics
└── pitchRecords.json       // Historical pitch data (imported/exported)

analytics_module/
├── pitchEffectiveness.js   // Cross-zone pitch analysis
├── clientSegmentation.js   // Origin + socioeconomic analysis
├── routeRecommendations.js // Optimal path generation
└── heatmapGenerator.js     // Zone + time effectiveness visualization
```

### Analysis Query Patterns

**Query 1: Pitch Effectiveness by Client Origin**
```javascript
// Question: "¿Qué tipo de pitch funciona mejor para clientes de CDMX en Zona Hotelera?"
// Expected output: Conversion rates by pitch type filtered by origin & zone
{
  "CDMX_ZonaHotelera": {
    "nostalgia": 0.32,
    "authority": 0.58,      // Best performer
    "scarcity": 0.41,
    "community": 0.25
  }
}
```

**Query 2: Optimal Hours by Zone & Pitch Type**
```javascript
// Question: "¿A qué horas es más efectivo 'Authority' en Centro?"
// Expected output: Hourly conversion rates with peak times highlighted
{
  "Centro_Authority": {
    "09:00": 0.35,
    "10:00": 0.42,
    "14:00": 0.58,  // Peak
    "15:00": 0.61,  // Peak
    "17:00": 0.48
  }
}
```

**Query 3: Socioeconomic × Pitch Correlation**
```javascript
// Question: "¿Responden mejor los profesionales (income: high) a 'Authority' o 'Scarcity'?"
// Expected output: Effectiveness matrix by socioeconomic segment
{
  "high_income_professional": {
    "authority": 0.72,    // Best fit
    "scarcity": 0.65,
    "nostalgia": 0.28,
    "community": 0.19
  }
}
```

**Query 4: Cannibalization Analysis**
```javascript
// Question: "¿Reduce la efectividad de 'Scarcity' cuando ya usamos 'Authority' en la misma zona?"
// Expected output: Interaction coefficients (positive/negative correlation)
{
  "zona_hotelera": {
    "authority_scarcity_correlation": -0.18  // Slight cannibalization
  }
}
```

**Query 5: Route Optimization for D2D**
```javascript
// Question: "¿Qué ruta genera máximo de conversiones considerando zona, hora, y pitch disponible?"
// Expected output: Recommended sequence of visits with expected conversion probability
{
  "recommendedRoute": [
    { zone: "zona_hotelera", time: "14:00-16:00", pitch: "authority", expectedConversion: 0.58 },
    { zone: "centro", time: "16:30-18:00", pitch: "scarcity", expectedConversion: 0.61 },
    { zone: "region_237", time: "18:30-20:00", pitch: "community", expectedConversion: 0.44 }
  ],
  "totalExpectedConversions": 1.63  // Out of 3 visits
}
```

### File Structure Recommendation

**For this project, use:**
- **`.json` files** for configuration/reference data (zones, pitch types, origins)
- **`.js` files** for analytics logic and transformation functions
- **Combined approach**: Load JSON at startup, process with JS analytics

```javascript
// In modules_integration.js
async loadReferenceData() {
  this.zones = await fetch('./data/zones.json').then(r => r.json());
  this.pitchTypes = await fetch('./data/pitchTypes.json').then(r => r.json());
  this.clientOrigins = await fetch('./data/clientOrigins.json').then(r => r.json());
  
  // Analytics modules use these as context
  this.pitchAnalytics = new PitchEffectivenessAnalyzer(
    this.zones, 
    this.pitchTypes, 
    this.clientOrigins
  );
}
```

### Validation & Normalization

Before any cross-dimensional analysis, validate:
```javascript
function validatePitchRecord(record) {
  const validPitches = ["nostalgia", "authority", "scarcity", "community"];
  const validResults = ["successful", "failed", "pending"];
  
  if (!validPitches.includes(record.pitchType)) {
    throw new Error(`Invalid pitchType: ${record.pitchType}`);
  }
  if (!validResults.includes(record.result)) {
    throw new Error(`Invalid result: ${record.result}`);
  }
  // Additional zone, origin, and socioeconomic validation
  return true;
}
```
