// Service Worker para Geo-Suite Cancún PRO
// Proporciona funcionalidad offline y caché

const CACHE_NAME = 'geo-suite-v5-es6-modules';
const ASSETS_TO_CACHE = [
  // Core
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/styles.css',
  
  // Main modules
  '/dp_cliente.js',
  '/modules_integration.js',
  '/openai_strategies.js',
  
  // Analytics modules
  '/analytics_module/bayesian_analytics.js',
  '/analytics_module/montecarlo_logistics.js',
  '/analytics_module/timeseries_forecast.js',
  '/analytics_module/genetic_algorithm.js',
  '/analytics_module/markov_decisions.js',
  '/analytics_module/market_saturation.js',
  '/analytics_module/cross_analysis.js',
  '/analytics_module/cannibalization_analysis.js',
  '/analytics_module/empirical_probability.js',
  
  // Scripts
  '/scripts/analyze-csv.js',
  '/scripts/test-data.js',
  '/scripts/demo-analysis.js',
  
  // Utils
  '/utils/fieldMapper.js',
  
  // Data (JSON static)
  '/data/zones.json',
  '/data/pitchTypes.json',
  '/data/socioeconomicProfiles.json',
  '/data/clientOrigins.json'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => { // Use async/await for easier error handling
      console.log('📦 Cacheando assets...');
      const failedAssets = [];

      // Try to cache each asset individually to identify failures
      for (const assetUrl of ASSETS_TO_CACHE) {
        try {
          await cache.add(assetUrl); // Use cache.add() for individual assets
          console.log(`✅ Cached: ${assetUrl}`);
        } catch (error) {
          console.warn(`⚠️ Failed to cache: ${assetUrl}`, error);
          failedAssets.push(assetUrl);
        }
      }

      if (failedAssets.length > 0) {
        console.error(`❌ Some assets failed to cache: ${failedAssets.join(', ')}`);
        // Fallback for critical assets if the main caching had issues
        return cache.addAll(['/', '/index.html', '/manifest.json'])
          .then(() => console.log('✅ Critical assets cached as fallback'))
          .catch(err => console.error('❌ Failed to cache critical assets:', err));
      } else {
        console.log(`✅ All ${ASSETS_TO_CACHE.length} assets cacheados`);
      }
    })
  );
  self.skipWaiting();
});


// Fetch - MEJORADO
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = request.url;

  // 1. Data (CSV, JSON) - Network First
  if (url.includes('.csv') || url.includes('.json') || url.includes('/data/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // 2. Assets estáticos (JS, CSS, images) - Cache First
  if (
    url.includes('.js') ||
    url.includes('.css') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('manifest.json')
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 3. HTML y resto - Network First
  event.respondWith(networkFirst(request));
});

// Cache First
function cacheFirst(request) {
  return caches.match(request).then((response) => {
    if (response) {
      console.log('📦 Desde caché:', request.url);
      return response;
    }

    return fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      })
      .catch((error) => {
        console.error('❌ Fetch fallido:', request.url, error);
        return caches.match(request);
      });
  });
}

// Network First
function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200) {
        return response;
      }

      const responseToCache = response.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache);
      });

      return response;
    })
    .catch(() => {
      console.log('🔌 Offline - usando caché:', request.url);
      return caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return caches.match('/index.html');
      });
    });
}

// Manejo de mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
      console.log('✅ Caché limpiada');
    });
  }
});

console.log('✅ Service Worker cargado');
