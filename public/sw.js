const CACHE_VERSION = 'v1'
const SHELL_CACHE = `shell-${CACHE_VERSION}`
const API_CACHE = `api-${CACHE_VERSION}`

const POKEAPI_ORIGIN = 'https://pokeapi.co'
const RAW_GITHUB_ORIGIN = 'https://raw.githubusercontent.com'

// Pre-cache the app shell assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(['/', '/index.html'])
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

function isApiRequest(url) {
  return url.origin === POKEAPI_ORIGIN || url.origin === RAW_GITHUB_ORIGIN
}

function isShellRequest(url) {
  return url.origin === self.location.origin
}

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (response.ok) {
    const cache = await caches.open(cacheName)
    cache.put(request, response.clone())
  }
  return response
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)

  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone())
    return response
  })

  return cached ?? networkFetch
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  if (isApiRequest(url)) {
    event.respondWith(cacheFirst(event.request, API_CACHE))
    return
  }

  if (isShellRequest(url)) {
    event.respondWith(staleWhileRevalidate(event.request, SHELL_CACHE))
    return
  }
})

// Pre-cache all 151 Gen 1 Pokémon on first install
async function preCacheGen1() {
  const names = []
  for (let i = 1; i <= 151; i++) {
    names.push(i)
  }

  const BATCH_SIZE = 10
  const BATCH_DELAY_MS = 300

  for (let i = 0; i < names.length; i += BATCH_SIZE) {
    const batch = names.slice(i, i + BATCH_SIZE)

    await Promise.allSettled(
      batch.map(async (id) => {
        const pokemonUrl = `${POKEAPI_ORIGIN}/api/v2/pokemon/${id}/`
        const speciesUrl = `${POKEAPI_ORIGIN}/api/v2/pokemon-species/${id}/`

        const [pokemonRes, speciesRes] = await Promise.all([
          fetch(pokemonUrl),
          fetch(speciesUrl),
        ])

        const cache = await caches.open(API_CACHE)
        if (pokemonRes.ok) {
          cache.put(pokemonUrl, pokemonRes.clone())

          // Also cache the official artwork image
          const data = await pokemonRes.json()
          const imageUrl =
            data?.sprites?.other?.['official-artwork']?.front_default
          if (imageUrl) {
            fetch(imageUrl)
              .then((imgRes) => {
                if (imgRes.ok) cache.put(imageUrl, imgRes.clone())
              })
              .catch(() => {})
          }
        }
        if (speciesRes.ok) cache.put(speciesUrl, speciesRes.clone())
      })
    )

    if (i + BATCH_SIZE < names.length) {
      await new Promise((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
    }
  }
}

self.addEventListener('message', (event) => {
  if (event.data === 'PRECACHE_GEN1') {
    preCacheGen1()
  }
})
