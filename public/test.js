const [start, stop] = document.querySelectorAll('button')
start.disabled = true
start.addEventListener('click', () => {
  clock()
  start.disabled = true
})
function createAudio(mapBuffer) {
  const audioCtx = new AudioContext();
  const myArrayBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate * 3,
    audioCtx.sampleRate,
  );
  for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    const nowBuffering = myArrayBuffer.getChannelData(channel);
    for (let i = 0; i < myArrayBuffer.length; i++) {
      nowBuffering[i] = mapBuffer(i)
    }
  }
  let source;
  return function playSound(cueTime, startTime, endTime) {
    source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start(cueTime, startTime, endTime);
    return source
  }
}

const eventLoop = createAudio(() => 0);
const click = createAudio(i => {
  if (i < 100) {
    return Math.random() * 2 - 1
  }
  return 0
})


let source;
let count = 0
const BPM = 120
const STEP_RESOLUTION = 128
const BPS = 60 / BPM
const clockTime = BPS / STEP_RESOLUTION
start.disabled = false

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
