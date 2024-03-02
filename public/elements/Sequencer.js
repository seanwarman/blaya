import { START_DATE_PARAMS } from '../../public/constants';

const makeStep = ({ name, index, delay, endTime }) => ({
  index: index || 0,
  id: window.state.sequencerModule.makeId(),
  name,
  endTime,
  delay: delay || 0,
});

const container = document.getElementById('sequencer');
const startDate = vis.moment(...START_DATE_PARAMS);

function initTimeline() {
  const [buttonPlay] = document.querySelectorAll('#sequencer-container button');
  buttonPlay.addEventListener('click', () => window.state.sequencerModule.play());

  const options = {
    orientation: 'top',
    height: 250,
    start: vis.moment(...START_DATE_PARAMS),
    min: vis.moment(...START_DATE_PARAMS),
    max: vis.moment(...START_DATE_PARAMS).add(window.state.sequencerModule.noteResolution * window.state.sequencerModule.loopBarLength, 'year'),
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
          start: vis.moment(...START_DATE_PARAMS).add((i+(step.delay)) * window.state.sequencerModule.beatPerDateMultiple, window.state.sequencerModule.beatPerDateResolution),
          end: step.endTime
            ? vis.moment(...START_DATE_PARAMS).add(((i+(step.delay)+(step.endTime*8)) * window.state.sequencerModule.beatPerDateMultiple), window.state.sequencerModule.beatPerDateResolution)
            : vis.moment(...START_DATE_PARAMS).add(((i+step.delay) * window.state.sequencerModule.beatPerDateMultiple), window.state.sequencerModule.beatPerDateResolution),
        };
      })
    })
    .filter(Boolean)
  );
  window.state.sequencerModule.timeline = new vis.Timeline(container, items, options);
  window.state.sequencerModule.timeline.setWindow(
    options.min,
    options.max,
  );
  window.state.sequencerModule.timeline.addCustomTime(timeDate, 'steptime');
  window.state.sequencerModule.timeline.on('select', props => {
    const { event } = props;
    const { target } = event;
    if (!target.classList.contains('vis-item-overflow')) return
    Array.from(
      document.querySelectorAll('.vis-selected')
    ).forEach((el) => el.classList.remove('vis-selected'));
    window.state.sequencerModule.selectedSampleName = target.firstChild.innerHTML;
  })
  window.addEventListener('keydown', e => {
    if (e.key === 'Backspace') {
      const ids = window.state.sequencerModule.timeline.getSelection();
      ids.map(id => {
        const item = items.get(id);
        if (window.state.sequencerModule.sequence[item.index]) {
          window.state.sequencerModule.sequence[item.index] = window.state.sequencerModule.sequence[item.index].filter(s => s.id !== item.step.id);
        }
      })
      items.remove(window.state.sequencerModule.timeline.getSelection())
    }
  })
}
function onMove(item, cb) {
  const diff = vis.moment(item.start).diff(vis.moment(...START_DATE_PARAMS).add(item.index * window.state.sequencerModule.beatPerDateMultiple, window.state.sequencerModule.beatPerDateResolution), window.state.sequencerModule.beatPerDateResolution);
  const position = item.index + (diff / window.state.sequencerModule.beatPerDateMultiple)
  const newindex = Math.floor(position);
  window.state.sequencerModule.sequence[item.index] = window.state.sequencerModule.sequence[item.index]?.filter(step => step.id !== item.step.id);
  if (!window.state.sequencerModule.sequence[newindex]) window.state.sequencerModule.sequence[newindex] = [];
  const diffFromItemStart = vis.moment(item.end).diff(vis.moment(item.start), window.state.sequencerModule.beatPerDateResolution);
  const endPosition = diffFromItemStart / window.state.sequencerModule.beatPerDateMultiple;
  item.index = newindex;
  // The position will add .5 for 12th hour, we just want that decimal for the delay...
  window.state.sequencerModule.sequence[item.index].push({
    ...item.step,
    delay: position - Math.floor(position),
    endTime: window.state.sequencerModule.getStepLength() * endPosition,
  });
  cb(item);
}
function onAdd(item, cb) {
  // item.end is wrong when adding for some reason...
  item.end = vis.moment(item.start).add(32 * window.state.sequencerModule.beatPerDateMultiple, window.state.sequencerModule.beatPerDateResolution);
  const { name } = item;
  let selectedSample;
  if (!name) {
    selectedSample = document.querySelector(`#samples-container .vis-selected`);
  } else {
    selectedSample = document.querySelector(`#samples-container .item[data-name="${name}"]`);
  }
  const waveImgCanvas = window.state.sequencerModule.cloneCanvas(selectedSample.querySelector('canvas'));
  waveImgCanvas.style = 'height:30px;margin-left:-12px';
  item.className = selectedSample.dataset.colourClass;
  item.name = selectedSample.dataset.name;

  const diffFromSeqStart = vis.moment(item.start).diff(vis.moment(...START_DATE_PARAMS), window.state.sequencerModule.beatPerDateResolution);
  const position = 0 + (diffFromSeqStart / window.state.sequencerModule.beatPerDateMultiple)
  const newindex = Math.floor(position);
  if (!window.state.sequencerModule.sequence[newindex]) window.state.sequencerModule.sequence[newindex] = [];
  item.index = newindex;
  const diffFromItemStart = vis.moment(item.end).diff(vis.moment(item.start), window.state.sequencerModule.beatPerDateResolution);
  const endPosition = diffFromItemStart / window.state.sequencerModule.beatPerDateMultiple;
  item.step = makeStep({
    name: item.name,
    index: newindex,
    delay: position - Math.floor(position),
    endTime: window.state.sequencerModule.getStepLength() * endPosition,
  });
  item.end = vis
    .moment(item.start)
    .add(32 * window.state.sequencerModule.beatPerDateMultiple, window.state.sequencerModule.beatPerDateResolution);
  item.content = waveImgCanvas;
  item.id = item.id;
  window.state.sequencerModule.sequence[item.index].push(item.step);
  cb(item);
}

const timeDate = vis.moment(...START_DATE_PARAMS);
function setTimeline() {
  document.querySelector('.vis-custom-time.steptime').style.transition = 'left 0.3s linear 0s';
  if (window.state.sequencerModule.currentStep === 0)  {
    document.querySelector('.vis-custom-time.steptime').style.transition = 'none';
    document.querySelector('.vis-custom-time.steptime').style.left = '0px';
  }
  window.state.sequencerModule.timeline.setCustomTime(
    vis.moment(...START_DATE_PARAMS).add(window.state.sequencerModule.currentStep * window.state.sequencerModule.beatPerDateMultiple, window.state.sequencerModule.beatPerDateResolution),
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
    window.state.sequencerModule.init(() => {
      initTimeline();
      requestAnimationFrame(draw);
    });
  }
}

