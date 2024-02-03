let res = 10
let from = performance.now()
let stop = true

self.addEventListener('message', async event => {
  const { data } = event
  const { type } = data

  if (type === 'START_CLOCK') {
    stop = false
    sendClock()
  }
  if (type === 'STOP_CLOCK') {
    stop = true
  }

  function sendClock() {
      postMessage({
        type: 'CLOCK',
        payload: {
          workerTime: performance.now(),
        },
      })
      if (!stop) {
        setTimeout(() => {
          sendClock()
        }, res)
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
