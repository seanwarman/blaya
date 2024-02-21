let unlocked = false;
let isPlaying = false;      // Are we currently playing?
let startTime;              // The start time of the entire sequence.
let currentStep = 0;        // What note is currently last scheduled?
let tempo = 120.0;          // tempo (in beats per minute)
let lookahead = 10.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
let scheduleAheadTime = 0.2;
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
const timing = {
  normal: 0.25,
  trap: 0.125,
  real: 0.0625,
}
const SELECTED_TIMING = 'normal';

let idCount = 0;

const makeStep = ({ name, index, delay, endTime }) => ({
  index: index || 0,
  id: Date.now() + idCount++,
  name,
  endTime,
  delay: delay || 0,
});

let sequence = {};

// let sequence = {
//   0: [ { index: 0, id: 1707891252190, name: "kick", endTime: 0.125, delay: 0 }, { index: 0, id: 1707891282349, name: "click", endTime: 0.125, delay: 0 } ],
//   1: [],
//   2: [ { index: 2, id: 1707891338463, name: "hat", endTime: 0.052083333333333336, delay: 0, } ],
//   3: [],
//   4: [{ index: 5, id: 1707891095836, name: "sn", endTime: 0.125, delay: 0 }],
//   5: [],
//   6: [ { index: 3, id: 1707891137733, name: "kick", endTime: 0.125, delay: 0 }, { index: 6, id: 1707891290113, name: "cluck", endTime: 0.125, delay: 0 }, { index: 6, id: 1707891291986, name: "cluck", endTime: 0.125, delay: 0.41666666666666696, }, { index: 6, id: 1707891350101, name: "hat", endTime: 0.052083333333333336, delay: 0, }, ], 7: [ { index: 7, id: 1707891154601, name: "loop", endTime: 0.125, delay: 0 }, { index: 2, id: 1707891260700, name: "cluck", endTime: 0.11458333333333333, delay: 0 } ],
//   8: [],
//   9: [ { index: 8, id: 1707891121909, name: "loop", endTime: 0.125, delay: 0 }, { index: 9, id: 1707891274490, name: "cluck", endTime: 0.125, delay: 0 }, ],
//   10: [ { index: 10, id: 1707891111186, name: "kick", endTime: 0.125, delay: 0 }, { index: 10, id: 1707891356372, name: "hat", endTime: 0.052083333333333336, delay: 0, }, ],
//   11: null,
//   12: [{ index: 12, id: 1707891107745, name: "sn", endTime: 0.125, delay: 0 }],
//   13: null,
//   14: [{ index: 14, id: 1707891361311, name: "hat", endTime: 0.125, delay: 0 }],
//   15: null,
// };

const calcStepLength = () => timing[SELECTED_TIMING] * (60.0 / tempo);

// CLOCK
function nextNote() {
  nextNoteTime += calcStepLength();

  currentStep++;    // Advance the beat number, wrap to zero
  if (currentStep == loopBarLength * noteResolution) {
    currentStep = 0;
  }
}

function scheduleNote( beatNumber, time ) {
  // push the note on the queue, even if we're not playing.
  notesInQueue.push( { note: beatNumber, time: time } );
  if (sequence[beatNumber]?.length) {
    for (let i=0;i<sequence[beatNumber].length;i++) {
      const step = sequence[beatNumber][i];
      const startTime = time + (calcStepLength() * step.delay);
      window.state.sequencerModule.samples[step.name](startTime, startTime + step.endTime);
    }
  }
}

let countWhile = 0

function scheduler() {
  // while there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (nextNoteTime < window.state.sequencerModule.audioContext.currentTime + scheduleAheadTime ) {
    scheduleNote( currentStep, nextNoteTime );
    nextNote();
  }
}

function play() {
  if (!window.state.sequencerModule.audioContext)
    window.state.sequencerModule.setAudioContext(new AudioContext());
  if (!unlocked) {
    // play silent buffer to unlock the audio
    var buffer = window.state.sequencerModule.audioContext.createBuffer(1, 1, 22050);
    var node = window.state.sequencerModule.audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    unlocked = true;
  }
  isPlaying = !isPlaying;
  if (isPlaying) { // start playing
    currentStep = 0;
    timeLinePosition = 0;
    nextNoteTime = window.state.sequencerModule.audioContext.currentTime;
    timerWorker.postMessage('start');
    return 'stop';
  } else {
    timerWorker.postMessage('stop');
    return 'play';
  }
}

async function init(){
  timerWorker = new Worker('../workers/clock-worker.js');
  timerWorker.onmessage = function(e) {
    if (e.data == 'tick') {
      scheduler();
    }
    else
      console.log('message: ' + e.data);
  };
  timerWorker.postMessage({'interval':lookahead});
  initTimeline();
  requestAnimationFrame(draw);
}

const [buttonPlay] = document.querySelectorAll('#sequencer-container button');
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
          start: vis.moment(...startDateParams).add((i+(step.delay)) * beatPerDateMultiple, beatPerDateResolution),
          end: step.endTime
            ? vis.moment(...startDateParams).add(((i+(step.delay)+(step.endTime*8)) * beatPerDateMultiple), beatPerDateResolution)
            : vis.moment(...startDateParams).add(((i+step.delay) * beatPerDateMultiple), beatPerDateResolution),
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
  timeline.on('select', props => {
    const { event } = props;
    const { target } = event;
    if (!target.classList.contains('vis-item-overflow')) return
    Array.from(
      document.querySelectorAll('.items-panel .vis-item.vis-selected')
    ).forEach((el) => el.classList.remove('vis-selected'));
    window.state.sequencerModule.selectedSampleName = target.firstChild.innerHTML;
  })
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
}
function onMove(item, cb) {
  const diff = vis.moment(item.start).diff(vis.moment(...startDateParams).add(item.index * beatPerDateMultiple, beatPerDateResolution), beatPerDateResolution);
  const position = item.index + (diff / beatPerDateMultiple)
  const newindex = Math.floor(position);
  sequence[item.index] = sequence[item.index]?.filter(step => step.id !== item.step.id);
  if (!sequence[newindex]) sequence[newindex] = [];
  const diffFromItemStart = vis.moment(item.end).diff(vis.moment(item.start), beatPerDateResolution);
  const endPosition = diffFromItemStart / beatPerDateMultiple;
  item.index = newindex;
  // The position will add .5 for 12th hour, we just want that decimal for the delay...
  sequence[item.index].push({
    ...item.step,
    delay: position - Math.floor(position),
    endTime: calcStepLength() * endPosition,
  });
  cb(item);
}
function onAdd(item, cb) {
  // item.end is wrong when adding for some reason...
  item.end = vis.moment(item.start).add(beatPerDateMultiple, beatPerDateResolution);
  const selectedSample = document.querySelector('.vis-item.vis-selected');
  if (window.state.sequencerModule.selectedSampleName) {
    item.name = window.state.sequencerModule.selectedSampleName;
  } else if (selectedSample?.dataset?.name) {
    item.name = selectedSample.dataset.name;
  } else {
    return;
  }
  const diffFromSeqStart = vis.moment(item.start).diff(vis.moment(...startDateParams), beatPerDateResolution);
  const position = 0 + (diffFromSeqStart / beatPerDateMultiple)
  const newindex = Math.floor(position);
  if (!sequence[newindex]) sequence[newindex] = [];
  item.index = newindex;
  const diffFromItemStart = vis.moment(item.end).diff(vis.moment(item.start), beatPerDateResolution);
  const endPosition = diffFromItemStart / beatPerDateMultiple;
  item.step = makeStep({
    name: item.name,
    index: newindex,
    delay: position - Math.floor(position),
    endTime: calcStepLength() * endPosition,
  });
  item.end = vis
    .moment(item.start)
    .add(1 * beatPerDateMultiple, beatPerDateResolution);
  item.content = item.name;
  item.id = item.id;
  sequence[item.index].push(item.step);
  cb(item);
}
const timeDate = vis.moment(...startDateParams);
function setTimeline() {
  document.querySelector('.vis-custom-time.steptime').style.transition = 'left 0.3s linear 0s';
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
  if (window.state.sequencerModule.audioContext) {
    var currentTime = window.state.sequencerModule.audioContext.currentTime;

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
  event.dataTransfer.effectAllowed = 'move';
  const item = {
    id: 0,
    type: 'range',
    name: event.target.dataset.name,
    content: event.target.dataset.name,
  };
  event.dataTransfer.setData('text', JSON.stringify(item));
}

export default function Sequencer() {
  if (confirm('Initialise audio?')) {
    init();
  }
}
