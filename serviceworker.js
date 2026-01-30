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
  '/groq_cliente.js',
  '/modules_integration.js',
  '/knowledgebase.js',
  '/openai_strategies.js',
  
  // Analytics modules
  '/analytics_module/bayesian_analytics.js',
  '/analytics_module/montecarlo_logistics.js',
  '/analytics_module/timeseries_forecast.js',
  '/analytics_module/genetic_algorithm.js',
  '/analytics_module/markov_decisions.js',
  '/analytics_module/market_saturation.js',
  '/analytics_module/cross_analysis.js',
  '/analytics_module/canibalizacion.js',
  '/analytics_module/probabilidad_empirica.js',
  
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
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Cacheando assets...');
      return cache.addAll(ASSETS_TO_CACHE)
        .then(() => {
          console.log(`✅ ${ASSETS_TO_CACHE.length} assets cacheados`);
        })
        .catch((err) => {
          console.warn('⚠️ Error cacheando:', err.message);
          // Cachear solo críticos
          return cache.addAll(['/', '/index.html', '/manifest.json']);
        });
    })
  );
  self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => {
            console.log('🗑️ Eliminando caché:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  self.clients.claim();
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
