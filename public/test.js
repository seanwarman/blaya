function createPlayer(mapBuffer) {
  const audioCtx = new AudioContext();
  const audioBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate * 3,
    audioCtx.sampleRate,
  );
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const nowBuffering = audioBuffer.getChannelData(channel);
    for (let i = 0; i < audioBuffer.length; i++) {
      nowBuffering[i] = mapBuffer(i)
    }
  }
  let source;
  return function playSound(cueTime, startTime, endTime) {
    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(cueTime, startTime, endTime);
    return source
  }
}

// TEST CODE --------- 
const audioBufferPromis = fetch('Black-Mountain.mp3')
  .then(res => res.arrayBuffer())
  .then(buffer => {
    const context = new AudioContext()
    return context.decodeAudioData(buffer)
  })
// TEST CODE --------- 

let source;
let count = 0
const BPM = 120
const STEP_RESOLUTION = 128
const BPS = 60 / BPM
const clockTime = BPS / STEP_RESOLUTION
const [start, stop] = document.querySelectorAll('button')
start.disabled = true
start.addEventListener('click', () => {

  // TEST CODE --------
  audioBufferPromis.then(blackMountainAudioBuffer => {
    const b = blackMountainAudioBuffer.getChannelData(1)
    const playBlackMountain = createPlayer((i) => {
      return b[i]
    })
    playBlackMountain(0)
  })
  // TEST CODE --------

  // Put this back...
  // clock()
  // start.disabled = true
})

start.disabled = false

const eventLoop = createPlayer(() => 0);
const click = createPlayer(i => {
  if (i < 100) {
    return Math.random() * 2 - 1
  }
  return 0
})

function clock() {
  count++
  if (count === 1) {
    console.log(`=======================================================================================`)
    click(0)
  }
  if (count % 16 === 0) {
    console.log(`---------------------${count / 16}---------------------`)
  }
  if (count === STEP_RESOLUTION) {
    count = 0
  }
  const source = eventLoop(0, 0, clockTime)
  stop.addEventListener('click', () => {
    source.removeEventListener('ended', clock)
    source.stop()
    start.disabled = false
    count = 0
  })
  source.addEventListener('ended', clock)
}
