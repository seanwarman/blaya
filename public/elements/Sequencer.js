const SELECTED_TIMING = 'normal';


let idCount = 0;
const makeStep = ({ name, index, delay, endTime }) => ({
  index: index || 0,
  id: Date.now() + idCount++,
  name,
  endTime,
  delay: delay || 0,
});

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

const calcStepLength = () => window.state.sequencerModule.timing[SELECTED_TIMING] * (60.0 / window.state.sequencerModule.tempo);

// CLOCK
function nextNote() {
  window.state.sequencerModule.nextNoteTime += calcStepLength();

  window.state.sequencerModule.currentStep++;    // Advance the beat number, wrap to zero
  if (window.state.sequencerModule.currentStep == window.state.sequencerModule.loopBarLength * window.state.sequencerModule.noteResolution) {
    window.state.sequencerModule.currentStep = 0;
  }
}

function scheduleNote( beatNumber, time ) {
  // push the note on the queue, even if we're not playing.
  window.state.sequencerModule.notesInQueue.push( { note: beatNumber, time: time } );
  if (window.state.sequencerModule.sequence[beatNumber]?.length) {
    for (let i=0;i<window.state.sequencerModule.sequence[beatNumber].length;i++) {
      const step = window.state.sequencerModule.sequence[beatNumber][i];
      const startTime = time + (calcStepLength() * step.delay);
      const prepare = window.state.sequencerModule.samples[step.name](startTime, startTime + step.endTime);
      window.state.sequencerModule.samples[step.name] = prepare();
    }
  }
}

let countWhile = 0

function scheduler() {
  // while there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (window.state.sequencerModule.nextNoteTime < window.state.sequencerModule.audioContext.currentTime + window.state.sequencerModule.scheduleAheadTime ) {
    scheduleNote( window.state.sequencerModule.currentStep, window.state.sequencerModule.nextNoteTime );
    nextNote();
  }
}

function play() {
  if (!window.state.sequencerModule.audioContext)
    window.state.sequencerModule.setAudioContext(new AudioContext());
  if (!window.state.sequencerModule.unlocked) {
    // play silent buffer to unlock the audio
    var buffer = window.state.sequencerModule.audioContext.createBuffer(1, 1, 22050);
    var node = window.state.sequencerModule.audioContext.createBufferSource();
    node.buffer = buffer;
    node.start(0);
    window.state.sequencerModule.unlocked = true;
  }
  window.state.sequencerModule.isPlaying = !window.state.sequencerModule.isPlaying;
  if (window.state.sequencerModule.isPlaying) { // start playing
    window.state.sequencerModule.currentStep = 0;
    window.state.sequencerModule.timeLinePosition = 0;
    window.state.sequencerModule.nextNoteTime = window.state.sequencerModule.audioContext.currentTime;
    window.state.sequencerModule.timerWorker.postMessage('start');
    return 'stop';
  } else {
    window.state.sequencerModule.timerWorker.postMessage('stop');
    return 'play';
  }
}

async function init(){
  window.state.sequencerModule.timerWorker = new Worker('../workers/clock-worker.js');
  window.state.sequencerModule.timerWorker.onmessage = function(e) {
    if (e.data == 'tick') {
      scheduler();
    }
    else
      console.log('message: ' + e.data);
  };
  window.state.sequencerModule.timerWorker.postMessage({'interval':window.state.sequencerModule.lookahead});
  initTimeline();
  requestAnimationFrame(draw);
}

const [buttonPlay] = document.querySelectorAll('#sequencer-container button');
buttonPlay.addEventListener('click', play)

// TIMELINE
const beatPerDateResolution = 'month';
const beatPerDateMultiple   = 12;
const container = document.getElementById('sequencer');
const startDateParams = ['01/01/0001', 'DD/MM/YYYY']
const startDate = vis.moment(...startDateParams);

let timeline = {};
function initTimeline() {
  const options = {
    height: 250,
    start: vis.moment(...startDateParams),
    min: vis.moment(...startDateParams),
    max: vis.moment(...startDateParams).add(window.state.sequencerModule.noteResolution * window.state.sequencerModule.loopBarLength, 'year'),
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

  const items = new vis.DataSet(
    Object.values(window.state.sequencerModule.sequence)
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
        if (window.state.sequencerModule.sequence[item.index]) {
          window.state.sequencerModule.sequence[item.index] = window.state.sequencerModule.sequence[item.index].filter(s => s.id !== item.step.id);
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
  window.state.sequencerModule.sequence[item.index] = window.state.sequencerModule.sequence[item.index]?.filter(step => step.id !== item.step.id);
  if (!window.state.sequencerModule.sequence[newindex]) window.state.sequencerModule.sequence[newindex] = [];
  const diffFromItemStart = vis.moment(item.end).diff(vis.moment(item.start), beatPerDateResolution);
  const endPosition = diffFromItemStart / beatPerDateMultiple;
  item.index = newindex;
  // The position will add .5 for 12th hour, we just want that decimal for the delay...
  window.state.sequencerModule.sequence[item.index].push({
    ...item.step,
    delay: position - Math.floor(position),
    endTime: calcStepLength() * endPosition,
  });
  cb(item);
}
function cloneCanvas(oldCanvas) {
  //create a new canvas
  var newCanvas = oldCanvas.cloneNode(true);
  var context = newCanvas.getContext('2d');
  //set dimensions
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  //apply the old canvas to the new one
  context.drawImage(oldCanvas, 0, 0);
  //return the new canvas
  return newCanvas;
}

function onAdd(item, cb) {
  console.log(`@FILTER item:`, item)
  // item.end is wrong when adding for some reason...
  item.end = vis.moment(item.start).add(beatPerDateMultiple, beatPerDateResolution);
  const selectedSample = document.querySelector('.vis-item.vis-selected');
  const waveImgCanvas = cloneCanvas(selectedSample.querySelector('canvas'));
  waveImgCanvas.style = 'width:65px;margin-left:-12px';
  item.className = selectedSample.dataset.colourClass;
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
  if (!window.state.sequencerModule.sequence[newindex]) window.state.sequencerModule.sequence[newindex] = [];
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
  item.content = waveImgCanvas;
  item.id = item.id;
  window.state.sequencerModule.sequence[item.index].push(item.step);
  cb(item);
}

const timeDate = vis.moment(...startDateParams);
function setTimeline() {
  document.querySelector('.vis-custom-time.steptime').style.transition = 'left 0.3s linear 0s';
  if (window.state.sequencerModule.currentStep === 0)  {
    document.querySelector('.vis-custom-time.steptime').style.transition = 'none';
    document.querySelector('.vis-custom-time.steptime').style.left = '0px';
  }
  timeline.setCustomTime(
    vis.moment(...startDateParams).add(window.state.sequencerModule.currentStep * beatPerDateMultiple, beatPerDateResolution),
    'steptime'
  );
  // window.state.sequencerModule.timeLinePosition++;
  // if (window.state.sequencerModule.timeLinePosition == window.state.sequencerModule.loopBarLength * window.state.sequencerModule.noteResolution) {
  //   window.state.sequencerModule.timeLinePosition = 0;
  // }
}

function draw() {
  var currentNote = window.state.sequencerModule.last16thNoteDrawn;
  if (window.state.sequencerModule.audioContext) {
    var currentTime = window.state.sequencerModule.audioContext.currentTime;

    while (window.state.sequencerModule.notesInQueue.length && window.state.sequencerModule.notesInQueue[0].time < currentTime) {
      currentNote = window.state.sequencerModule.notesInQueue[0].note;
      window.state.sequencerModule.notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (window.state.sequencerModule.last16thNoteDrawn != currentNote) {
      window.state.sequencerModule.last16thNoteDrawn = currentNote;
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
