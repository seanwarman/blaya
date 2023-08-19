const clientApplicationFiles = [
  '/',
  '/DragDropTouch.js',
  '/constants.js',
  '/icons/grip-vertical-solid-white.svg',
  '/icons/minus-solid-white.svg',
  '/icons/plus-solid-white.svg',
  '/icons/play-solid-white.svg',
  '/icons/grip-vertical-solid.svg',
  '/icons/minus-solid.svg',
  '/icons/plus-solid.svg',
  '/icons/play-solid.svg',
  '/icons/spinner-solid.svg',
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

const CACHE_VERSION = 9
const CURRENT_CACHES = {
  applicationFilesCache: 'blaya__APPLICATION_FILES_CACHE_V' + CACHE_VERSION,
  offlineTracksCache: 'blaya__OFFLINE_TRACKS_CACHE_V' + CACHE_VERSION,
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

self.addEventListener('activate', event => {
  const expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES))
  event.waitUntil(
    caches.keys().then(cacheKeys => {
      return Promise.all(
        cacheKeys.map(key => !expectedCacheNamesSet.has(key) && caches.delete(key))
      )
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    cacheHandler(event.request)
  )
})

async function cacheHandler(request) {

  // If it's a track try to get the cached one first...
  if (/\.mp3$/.test(request.url)) {
    const cachedTrackResponse = await caches.match(request)
    if (cachedTrackResponse) return cachedTrackResponse
  }

  // Normal files can be requested normally...
  try {
    // fetch "consumes" the request so we should clone it because we might use
    // it later in cache.put
    const response = await fetch(request.clone())

    // Replace with the newest version of the file...
    if (clientApplicationFiles.includes(request.url)) {
      const applicationFilesCache = await caches.open(CURRENT_CACHES.applicationFilesCache)
      applicationFilesCache.delete(request)
      // cache.put also consumes the req/res, we want to return the original
      // response after this...
      applicationFilesCache.put(request, response.clone())
    }

    return response
  } catch (error) {
    // If the user's offline, try the cache...
    const cachedResponse = await caches.match(request)
    return cachedResponse
  }
}

self.addEventListener('message', async event => {
  const { data } = event
  const { type } = data
  if (type === 'DOWNLOAD_PLAYLIST') cacheOffline(event)
  if (type === 'DELETE_PLAYLIST_TRACKS') deletePlaylistTracks(event)
  if (type === 'SYNC_OFFLINE_TRACKS') syncOfflineTracks(event)
})

async function syncOfflineTracks(event) {
  const { source } = event
  try {
    const cache = await caches.open(CURRENT_CACHES.offlineTracksCache)
    const responses = await cache.keys()
    const tracks = responses
      .map(({ url }) => url.replace(location.origin + '/', ''))
      .map(decodeURIComponent)
    source.postMessage({
      type: 'SYNC_OFFLINE_TRACKS_SUCCESS',
      payload: { tracks },
    })
  } catch (error) {
    source.postMessage({
      type: 'SYNC_OFFLINE_TRACKS_ERROR',
      payload: { error },
    })
  }
}

async function deletePlaylistTracks(event) {
  const { data, source } = event
  const { payload } = data
  const { playlist } = payload
  const [,, tracks] = playlist
  try {
    const cache = await caches.open(CURRENT_CACHES.offlineTracksCache)
    for (const track of tracks) {
      await cache.delete(track)
    }
    source.postMessage({
      type: 'DELETE_PLAYLIST_TRACKS_SUCCESS',
      payload: { playlist },
    })
  } catch (error) {
    source.postMessage({
      type: 'DELETE_PLAYLIST_TRACKS_ERROR',
      payload: { playlist, error },
    })
  }
}

async function cacheOffline(event) {
  const { data, source } = event
  const { payload } = data
  const { playlist } = payload

  const tracks = playlist[2]
    .reduce((acc, track) => {
      if (acc.includes(track)) return acc
      return [...acc, track]
    }, [])

  const cache = await caches.open(CURRENT_CACHES.offlineTracksCache)
  const completedTracks = []
  for (const track of tracks) {
    try {
      const response = await cache.match(track)
      if (!response) {
        const res = await fetch('/download/' + track)
        await cache.put(track, res)
      }
      completedTracks.push(track)
      if (completedTracks.length === tracks.length) break
      source.postMessage({
        type: 'DOWNLOADS_PROGRESS',
        payload: { tracks: completedTracks },
      })
    } catch (error) {
      console.log(`Error caching ${track}: `, error)
    }
  }

  source.postMessage({
    type: 'DOWNLOADS_COMPLETE',
    payload: { tracks },
  })
}
