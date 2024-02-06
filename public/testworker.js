
self.addEventListener('message', async event => {
  const { data } = event
  const { type } = data

  let res = 10
  let from = performance.now()
  if (type === 'START_CLOCK') {
    while (true) {
      if (from + res < performance.now()) {
        postMessage({
          type: 'CLOCK',
          payload: {
            workerTime: performance.now(),
          },
        })
        from = performance.now()
      }
    }
  }
})

// self.addEventListener('install', event => {
//   console.log(`@FILTER event:`, event)
//   console.log(`@FILTER self.postMessage:`, self.postMessage)
//   const { data, source } = event
//   source.postMessage({ type: 'ACTIVATED' })
// })

// self.addEventListener('install', event => { })
// self.addEventListener('fetch', event => { })
