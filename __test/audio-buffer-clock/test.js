function createPlayer(length, mapBuffer) {
  const audioCtx = new AudioContext();
  const audioBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate * length,
    audioCtx.sampleRate,
  );
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const nowBuffering = audioBuffer.getChannelData(channel);
    for (let i = 0; i < audioBuffer.length; i++) {
      nowBuffering[i] = mapBuffer(i)
    }
  }
  let source;
  return function player(cueTime, startTime, endTime) {
    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start(cueTime, startTime, endTime);
    return source;
  }
}

// TEST CODE --------- 
// const audioBufferPromis = fetch('Black-Mountain.mp3')
//   .then(res => res.arrayBuffer())
//   .then(buffer => {
//     const context = new AudioContext()
//     return context.decodeAudioData(buffer)
//   })
// TEST CODE --------- 

let source;
let count = 0
const BPM = 120
const STEP_RESOLUTION = 128
const BPS = 60 / BPM
const clockTime = BPS / STEP_RESOLUTION
const [start, stop] = document.querySelectorAll('button')
start.disabled = true

const eventLoop = createPlayer(3, () => 0);
const click = createPlayer(3, i => {
  if (i < 100) {
    return Math.random() * 2 - 1
  }
  return 0
})

start.disabled = false

start.addEventListener('click', () => {

  // TEST CODE --------
  // audioBufferPromis.then(blackMountainAudioBuffer => {
  //   const b = blackMountainAudioBuffer.getChannelData(1)
  //   const playBlackMountain = createPlayer(3, (i) => {
  //     return b[i]
  //   })
  //   playBlackMountain(0)
  // })
  // TEST CODE --------

  // Put this back...
  clock()
  let source = eventLoop(0, 0, clockTime);
  start.disabled = true
})




// TIMELINE
const container = document.getElementById('visualization');

const startDateParams = ['01/01/01', 'DD/MM/YY']
const startDate = vis.moment.apply(null, startDateParams);
const end = vis.moment(startDate).add(1, 'month');
const items = new vis.DataSet([
  {id: 1, content: 'item 4', start: vis.moment.apply(null, startDateParams), end },
]);

const options = {
  height: 200,
  start: vis.moment.apply(null, startDateParams),
  min: vis.moment.apply(null, startDateParams),
};

const timeline = new vis.Timeline(container, items, options);
const timeDate = vis.moment.apply(null, startDateParams);
timeline.addCustomTime(timeDate, 123);
function setTimeline(n) {
  timeline.setCustomTime(timeDate.add(n, 'day'), 123);
}

function scheduleClick() {
  click(0)
}

function clock() {
  count++
  if (count === 1) {
    console.log(`=======================================================================================`)
  }
  if (count % 16 === 0) {
    console.log(`---------------------${count / 16}---------------------`)
    if (count / 16 === 1) scheduleClick()
    if (count / 16 === 2) {}
    if (count / 16 === 3) scheduleClick()
    if (count / 16 === 4) {}
    if (count / 16 === 5) scheduleClick()
    if (count / 16 === 6) {}
    if (count / 16 === 7) {}
    if (count / 16 === 8) scheduleClick()
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

