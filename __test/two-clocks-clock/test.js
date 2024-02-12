let audioContext = null;
let unlocked = false;
let isPlaying = false;      // Are we currently playing?
let startTime;              // The start time of the entire sequence.
let currentStep;        // What note is currently last scheduled?
let tempo = 120.0;          // tempo (in beats per minute)
let lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
let scheduleAheadTime = 0.1;
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
let nextNoteTime = 0.0;     // when the next note is due.
let noteResolution = 16;
let noteLength = 0.05;      // length of "beep" (in seconds)
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
let notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
let timerWorker = null;     // The Web Worker used to fire timer messages
let loopBarLength = 1;
let timeLinePosition = 0;

let idCount = 0;

const makeStep = (name, i, delay) => ({
  index: i || 0,
  id: Date.now() + idCount++,
  name,
  delay: delay || 0,
});
const clickStep = (delay) => ({
  id: Date.now() + idCount++,
  name: 'click',
  delay: delay || 0,
});
const cluckStep = (delay) => ({
  id: Date.now() + idCount++,
  name: 'cluck',
  delay: delay || 0,
});

let sequence = {
  0:  [makeStep('kick', 0, 0), makeStep('click', 0, 0)],  1:  null,  2: [makeStep('cluck', 2, 0), makeStep('click', 2, 0)],  3: null,
  4:  [makeStep('sn', 4, 0), makeStep('click', 4, 0)],  5:  null,  6: [makeStep('click', 6, 0)],  7: null,
  8:  [makeStep('kick', 1, 0), makeStep('click', 5, 0)],  9:  null, 10: [makeStep('click', 10, 0)], 11: null,
  12: [makeStep('sn', 12, 0),makeStep('click', 12, 0)],  13: null, 14: null, 15: null,
};

let samples = {};

// PLAYER
function createBitPlayer(length, mapBuffer) {
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

function createFetchPlayer(url) {
  const context = new AudioContext();
  return fetch(url)
  .then(res => res.arrayBuffer())
  .then(buffer => context.decodeAudioData(buffer))
  .then(async audioBuffer => {
    return (time) => {
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start(time);
      return source;
    };
  })
}

const calcStepLength = () => 0.25 * (60.0 / tempo);

// CLOCK
function nextNote() {
  // const secondsPerBeat = 60.0 / tempo;
  // nextNoteTime += 0.25 * secondsPerBeat;
  //
  nextNoteTime += calcStepLength();

  currentStep++;    // Advance the beat number, wrap to zero
  if (currentStep == loopBarLength * noteResolution) {
    currentStep = 0;
  }
}

function scheduleNote( beatNumber, time ) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push( { note: beatNumber, time: time } );
  if (sequence[beatNumber]) {
    sequence[beatNumber].map(step => samples[step.name](time + (calcStepLength() * step.delay)));
  }
}

function scheduler() {
  // while there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    scheduleNote( currentStep, nextNoteTime );
    nextNote();
  }
}

function play() {
  if (!audioContext)
    audioContext = new AudioContext();
  if (!unlocked) {
    // play silent buffer to unlock the audio
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    unlocked = true;
  }
  isPlaying = !isPlaying;
  if (isPlaying) { // start playing
    currentStep = 0;
    timeLinePosition = 0;
    nextNoteTime = audioContext.currentTime;
    timerWorker.postMessage('start');
    return 'stop';
  } else {
    console.log(`@FILTER stop!`)
    timerWorker.postMessage('stop');
    return 'play';
  }
}

function init(){
  timerWorker = new Worker('./clock-worker.js');
  timerWorker.onmessage = function(e) {
    if (e.data == 'tick') {
      // console.log('tick!');
      scheduler();
    }
    else
      console.log('message: ' + e.data);
  };
  timerWorker.postMessage({'interval':lookahead});

  const click = createBitPlayer(3, i => {
    if (i < 100) {
      return Math.random() * 2 - 1
    }
    return 0
  })

  const cluck = createBitPlayer(2, i => {
    if (i < 100) {
      return Math.random() * 2 - 1
    }
    return 0
  })

  samples = {
    click,
    cluck,
  };

  createFetchPlayer('/__test/two-clocks-clock/sn.wav').then(sn => samples.sn = sn).then(() => console.log(samples));
  createFetchPlayer('/__test/two-clocks-clock/kick.wav').then(kick => samples.kick = kick).then(() => console.log(samples));
  createFetchPlayer('/__test/two-clocks-clock/hat2.wav').then(hat => samples.hat = hat).then(() => console.log(samples));

  initTimeline();
  requestAnimationFrame(draw);
  play();
}

const [buttonInit, buttonPlay] = document.querySelectorAll('button');
buttonInit.addEventListener('click', init)
buttonPlay.addEventListener('click', play)

// TIMELINE
const beatPerDateResolution = 'month';
const beatPerDateMultiple   = 12;
const container = document.getElementById('visualization');
const startDateParams = ['01/01/0001', 'DD/MM/YYYY']
const startDate = vis.moment(...startDateParams);

const options = {
  height: 200,
  start: vis.moment(...startDateParams),
  min: vis.moment(...startDateParams),
  max: vis.moment(...startDateParams).add(noteResolution * loopBarLength, 'year'),
  itemsAlwaysDraggable: true,
  zoomFriction: 25,
  // zoomMin: 49597000000,
  // autoResize: false,
  moveable: false,
  horizontalScroll: true,
  zoomable: false,
  type: 'range',
  multiselect: true,
  stack: true,
  editable: {
    add: true,
    updateTime: true,
  },
  margin: { item: { horizontal: 0, vertical: 1 } },
  snap: (date, scale, step) => {
    const clone = vis.moment(date);
    clone.date(1);
    if (clone.month() > 5) {
      clone.month(5);
    } else {
      clone.month(0);
    }
    clone.hours(0);
    clone.minutes(0);
    clone.seconds(0);
    clone.milliseconds(0);
    return clone;
  },
  showWeekScale: true,
  showMajorLabels: false,
  format: {
    minorLabels: {
      month: 'YY:MM',
      year: 'YY',
    },
  //   majorLabels: {
  //     millisecond:'SSS', second:     's', minute:     'HH:mm',
  //     hour:       'HH:mm', weekday:    'DD', day:        'DD',
  //     week:       'WW', month:      'MM', year:       'YY'
  //   },
  },
  onAdd,
  onMove,
};

let timeline = {};
function initTimeline() {
  const items = new vis.DataSet(
    Object.values(sequence)
    .flatMap((steps, i) => {
      if (!steps) return;
      return steps.map(step => {
        if (!step) return;
        return {
          id: step.id,
          step,
          index: i,
          content: step.name,
          start: vis.moment(...startDateParams).add(i * beatPerDateMultiple, beatPerDateResolution),
          end: vis.moment(...startDateParams).add(((i+1) * beatPerDateMultiple), beatPerDateResolution),
        };
      })
    })
    .filter(Boolean)
  );
  timeline = new vis.Timeline(container, items, options);
  timeline.setWindow(
    options.min,
    options.max,
  );
  timeline.addCustomTime(timeDate, 'steptime');
  window.addEventListener('keydown', e => {
    if (e.key === 'Backspace') {
      const ids = timeline.getSelection();
      ids.map(id => {
        const item = items.get(id);
        if (sequence[item.index]) {
          sequence[item.index] = sequence[item.index].filter(s => s.id !== item.step.id);
        }
      })
      items.remove(timeline.getSelection())
    }
  })
  Array.from(document.querySelectorAll('.items-panel li .item')).map((item) =>
    item.addEventListener('dragstart', handleDragStart.bind(this), false)
  );
}
function onMove(item, cb) {
  console.log(`@FILTER item:`, item)
  const diff = vis.moment(item.start).diff(vis.moment(...startDateParams).add(item.index * beatPerDateMultiple, beatPerDateResolution), beatPerDateResolution);
  const position = item.index + (diff / beatPerDateMultiple)
  const newindex = Math.floor(position);
  sequence[item.index] = sequence[item.index]?.filter(step => step.id !== item.step.id);
  if (!sequence[newindex]) sequence[newindex] = [];
  item.index = newindex;
  // The position will add .5 for 12th hour, we just want that decimal for the delay...
  sequence[item.index].push({ ...item.step, delay: position - Math.floor(position) });
  cb(item);
}
function onAdd(item, cb) {
  const diff = vis.moment(item.start).diff(vis.moment(...startDateParams), beatPerDateResolution);
  const position = 0 + (diff / beatPerDateMultiple)
  const newindex = Math.floor(position);
  if (!sequence[newindex]) sequence[newindex] = [];
  item.index = newindex;
  item.step = makeStep(item.name, newindex, position - Math.floor(position));
  item.end = vis.moment(item.start).add((1 * beatPerDateMultiple), beatPerDateResolution);
  item.content = item.name;
  item.id = item.id;
  sequence[item.index].push(item.step);
  cb(item);
}
const timeDate = vis.moment(...startDateParams);
function setTimeline() {
  document.querySelector('.vis-custom-time.steptime').style.transition = 'left 0.3s';
  if (currentStep === 0)  {
    document.querySelector('.vis-custom-time.steptime').style.transition = 'none';
    document.querySelector('.vis-custom-time.steptime').style.left = '0px';
  }
  timeline.setCustomTime(
    vis.moment(...startDateParams).add(currentStep * beatPerDateMultiple, beatPerDateResolution),
    'steptime'
  );
  // timeLinePosition++;
  // if (timeLinePosition == loopBarLength * noteResolution) {
  //   timeLinePosition = 0;
  // }
}

function draw() {
  var currentNote = last16thNoteDrawn;
  if (audioContext) {
    var currentTime = audioContext.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
      currentNote = notesInQueue[0].note;
      notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn != currentNote) {
      last16thNoteDrawn = currentNote;
      setTimeline();
    }
  }
  // set up to draw again
  requestAnimationFrame(draw);
}

function handleDragStart(event) {
  var dragSrcEl = event.target;
  event.dataTransfer.effectAllowed = 'move';
  var item = {
    id: 0,
    type: 'range',
    name: event.target.dataset.name,
    content: event.target.dataset.name,
  };
  event.dataTransfer.setData('text', JSON.stringify(item));
}
