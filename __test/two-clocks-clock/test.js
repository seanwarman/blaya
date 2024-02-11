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

// PLAYER
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

const click = createPlayer(3, i => {
  if (i < 100) {
    return Math.random() * 2 - 1
  }
  return 0
})

const cluck = createPlayer(2, i => {
  if (i < 100) {
    return Math.random() * 2 - 1
  }
  return 0
})

const clickStep = (delay) => ({
  id: Date.now(),
  name: 'click',
  fn: click,
  delay: delay || 0,
});

// Make steps arrays?
// Yes almost definitely (they'll need ids though)
const sequence = {
  0: [{id:1,name:'click',fn:click,delay:0}],  1:  null,  2: null,  3: null,
  4: [{id:2,name:'click',fn:click,delay:0}],  5:  null,  6: null,  7: null,
  8: [{id:3,name:'click',fn:click,delay:0}],  9:  null, 10: null, 11: null,
 12: [{id:4,name:'click',fn:click,delay:0}],  13: null, 14: [{id:5,name:'click',fn:click,delay:0}], 15: null,
};

const calcStepLength = () => (lookahead / 100) * (60.0 / tempo);

// CLOCK
function nextNote() {
  // Advance current note and time by a 16th note...
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
    sequence[beatNumber].map(step => step.fn(time + (calcStepLength() * step.delay)));
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
  requestAnimationFrame(draw);
}

init()

document.querySelector('button').addEventListener('click', play)

// TIMELINE
const beatPerDateResolution = 'hours';
const beatPerDateMultiple   = 24;
const container = document.getElementById('visualization');
const startDateParams = ['01/01/01', 'DD/MM/YY']
const startDate = vis.moment(...startDateParams);
const items = new vis.DataSet(
  Object.values(sequence)
    .flatMap((steps, i) => {
      if (!steps) return;
      return steps.map(step => {
        if (!step) return;
        return {
          id: step.id,
          step,
          fn: step.fn,
          index: i,
          content: step.name,
          start: vis.moment(...startDateParams).add(i * beatPerDateMultiple, beatPerDateResolution),
          end: vis.moment(...startDateParams).add(((i+1) * beatPerDateMultiple) - 1, beatPerDateResolution),
        };
      })
    })
    .filter(Boolean)
);

const options = {
  height: 200,
  start: vis.moment(...startDateParams),
  min: vis.moment(...startDateParams),
  max: vis.moment(...startDateParams).add(16, 'days'),
  itemsAlwaysDraggable: true,
  type: 'range',
  zoomFriction: 25,
  stack: true,
  editable: {
    add: true,
    updateTime: true,
  },
  onAdd: (item, cb) => {
    const diff = vis.moment(item.start).diff(vis.moment(...startDateParams), beatPerDateResolution);
    const position = 0 + (diff / beatPerDateMultiple)
    const newindex = Math.floor(position);
    if (!sequence[newindex]) sequence[newindex] = [];
    item.index = newindex;
    item.step = clickStep(position - Math.floor(position));
    item.end = vis.moment(item.start).add((1 * beatPerDateMultiple) - 1, beatPerDateResolution);
    item.content = item.step.name;
    item.id = item.step.id;
    sequence[item.index].push(item.step);
    cb(item);
  },
  snap: (date, scale, step) => {
    var hour = 60 * 60 * 12000;
    return Math.round(date / hour) * hour;
  },
  onMove: (item, cb) => {
    const diff = vis.moment(item.start).diff(vis.moment(...startDateParams).add(item.index * beatPerDateMultiple, beatPerDateResolution), beatPerDateResolution);
    const position = item.index + (diff / beatPerDateMultiple)
    const newindex = Math.floor(position);
    sequence[item.index] = sequence[item.index]?.filter(step => step.id !== item.id);
    if (!sequence[newindex]) sequence[newindex] = [];
    item.index = newindex;
    // The position will add .5 for 12th hour, we just want that decimal for the delay...
    sequence[item.index].push({ ...item.step, delay: position - Math.floor(position) });
    cb(item);
  },
  showMajorLabels: false,
  format: {
    minorLabels: {
      millisecond:'SSS', second:     's', minute:     'HH:mm',
      hour:       'HH:mm', weekday:    'DD', day:        'DD',
      week:       'WW', month:      'MM', year:       'YY'
    },
    majorLabels: {
      millisecond:'SSS', second:     's', minute:     'HH:mm',
      hour:       'HH:mm', weekday:    'DD', day:        'DD',
      week:       'WW', month:      'MM', year:       'YY'
    },
  },
};
const timeline = new vis.Timeline(container, items, options);
timeline.setWindow(
  vis.moment(...startDateParams),
  vis.moment(...startDateParams).add(16, 'days'),
);
window.addEventListener('keydown', e => {
  if (e.key === 'Backspace') {
    const ids = timeline.getSelection();
    ids.map(id => {
      const item = items.get(id);
      if (sequence[item.index]) {
        sequence[item.index] = sequence[item.index].filter(s => s.id !== item.id);
      }
    })
    items.remove(timeline.getSelection())
  }
})
const timeDate = vis.moment(...startDateParams);
timeline.addCustomTime(timeDate, 'steptime');
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

