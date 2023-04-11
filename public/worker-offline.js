const CACHE_VERSION = 2
const CURRENT_CACHES = 'blaya__filescachev' + CACHE_VERSION

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

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)
  if (cachedResponse) return cachedResponse

  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    return new Response('Ignored online file', {
      status: 200,
    })
  }

}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CURRENT_CACHES)
    .then(cache =>
      Promise.all([
        cache.matchAll(clientApplicationFiles).then(responses => Array.from(responses).map(cache.delete)),
        cache.addAll(clientApplicationFiles),
      ]))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    cacheFirst(event.request)
  )
})
