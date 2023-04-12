const CACHE_VERSION = 2
const CURRENT_CACHES = {
  applicationFilesCache: 'blaya__APPLICATION_FILES_CACHE' + CACHE_VERSION,
  offlineTracksCache: 'blaya__OFFLINE_TRACKS_CACHE' + CACHE_VERSION,
}

const clientApplicationFiles = [
  '/',
  '/DragDropTouch.js',
  '/constants.js',
  '/icons/grip-vertical-solid.svg',
  '/icons/minus-solid.svg',
  '/icons/plus-solid.svg',
  '/helpers/dom.js',
  '/helpers/events.js',
  '/helpers/functional-utils.js',
  '/helpers/index.js',
  '/helpers/utils.js',
  '/index.css',
  '/main.js',
  '/store/indexModule.js',
  '/store/playModule.js',
  '/track-list.js',
  '/node_modules/fzf/dist/fzf.es.js',
  '/node_modules/socket.io/client-dist/socket.io.esm.min.js',
]

async function cacheOffline(payload) {
  const { playlists } = payload

  console.log(`@FILTER Adding all playlist tracks`, playlists[0])
  const cache = await caches.open(CURRENT_CACHES.offlineTracksCache)
  cache.addAll(
    playlists[0][2].reduce((acc, track) => {
      if (acc.includes(track)) return acc
      return [...acc, track]
    }, [])
  )
}

async function cacheHandler(request) {
  // TODO: get tracks cache...
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    try {
      const cachedResponse = await caches.match(request)
      if (cachedResponse) return cachedResponse
    } catch (cacheError) {
      return new Response(cacheError, { status: 400 })
    }
    return new Response(error, { status: 404 })
  }
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CURRENT_CACHES.applicationFilesCache)
    .then(cache =>
      Promise.all([
        cache.matchAll(clientApplicationFiles).then(responses => Array.from(responses).map(cache.delete)),
        cache.addAll(clientApplicationFiles),
      ]))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    cacheHandler(event.request)
  )
})

self.addEventListener('message', event => {
  const { data } = event
  const { type, payload } = data
  if (type === 'OFFLINE_MODE') cacheOffline(payload)
})
