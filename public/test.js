const worker = new Worker('/testworker.js')
const context = new AudioContext()
const audioBufferPromis = fetch('Black-Mountain.mp3')
  .then(res => res.arrayBuffer())
  .then(buffer => context.decodeAudioData(buffer));
let audioBuffer;
let source;

const LOOP_LENGTH = 200
let timingDifference = 0
let count = LOOP_LENGTH
const latency = 200

function clock({ data }) {
  const { type, payload } = data
  const timingIncosistancy = (payload.workerTime + timingDifference) - performance.now()
  count++
  if (count > LOOP_LENGTH) {
    setTimeout(() => {
      console.log(`@FILTER click`)
    }, latency + timingIncosistancy)
    count = 0
  }
}


function restart(loopStart, loopEnd) {
  if (source) {
    source.stop()
  }
  source = context.createBufferSource()
  source.buffer = audioBuffer
  source.connect(context.destination)
  source.loop = true
  source.loopStart = loopStart
  source.loopEnd = loopEnd
  source.start(0, loopStart)
}

const [startButton, stopButton, restartButton] = Array.from(document.querySelectorAll('button'))
startButton.disabled   = true
stopButton.disabled    = true
restartButton.disabled = true

audioBufferPromis.then(buffer => {
  audioBuffer = buffer
  startButton.disabled   = false
  stopButton.disabled    = false
  restartButton.disabled = false
})

restartButton.onmousedown = () => {
  restart(2, 3.7)
  // worker.removeEventListener('message', clock)
}
startButton.onmousedown = async () => {
  restart(1, 2.7)
  // worker.removeEventListener('message', clock)
}
stopButton.onmousedown = () => {
  source.stop()
  worker.removeEventListener('message', clock)
}

let timing = 0
let setupTimingCount = 20
let diffs = []

worker.addEventListener('message', setupTiming)
function setupTiming(event) {
  const { data } = event
  const { type, payload } = data
  if (type !== 'CLOCK') {
    return
  }

  const diff = performance.now() - payload.workerTime
  diffs.push(diff)
  if (diffs.length >= setupTimingCount) {
    worker.removeEventListener('message', setupTiming)
    console.log(`@FILTER diffs:`, diffs)
    timingDifference = findConsistentDifference(diffs)
    console.log(`@FILTER timingDifference:`, timingDifference)
  }
}
worker.postMessage({
  type: 'START_CLOCK',
})


function findConsistentDifference(diffs) {
  const results = diffs.reduce((acc, n) => {
    if (acc[n]) {
      return {
        ...acc,
        [n]: acc[n] + 1,
      }
    }
    return {
      ...acc,
      [n]: 1,
    }
  }, {})
  return Number(Object.entries(results).sort((a,b) => {
    if (a[1] < b[1]) return 1
    if (a[1] > b[1]) return -1
    return 0
  })[0][0])
}

