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

async function cacheHandler(request) {

  // If it's a track try to get the cached one first...
  if (/\.mp3$/.test(request.url)) {
    const cachedTrackResponse = await caches.match(request)
    if (cachedTrackResponse) return cachedTrackResponse
  }

  // Normal files can be requested normally...
  try {
    const response = await fetch(request)

    // Replace with the newest version of the file...
    if (clientApplicationFiles.includes(request.url)) {
      const applicationFilesCache = await caches.open(CURRENT_CACHES.applicationFilesCache)
      applicationFilesCache.delete(request)
      applicationFilesCache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // If the user's offline, try the cache...
    const cachedResponse = await caches.match(request)
    return cachedResponse
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

self.addEventListener('message', async event => {
  const { data } = event
  const { type } = data
  if (type === 'DOWNLOAD_PLAYLIST') cacheOffline(event)
})

async function cacheOffline(event) {
  const { data, source } = event
  const { payload } = data
  const { playlist } = payload

  const tracks = playlist[2]
    .reduce((acc, track) => {
      if (acc.includes(track)) return acc
      return [...acc, track]
    }, [])

  await caches.delete(CURRENT_CACHES.offlineTracksCache)
  const cache = await caches.open(CURRENT_CACHES.offlineTracksCache)
  await cache.addAll(tracks)

  source.postMessage({
    type: 'DOWNLOAD_COMPLETE',
    payload: { tracks },
  })
}
