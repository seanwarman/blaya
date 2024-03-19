import { div } from '../helpers/dom';
import { START_DATE_PARAMS } from '../../public/constants';
import { ceil, floor } from '../helpers/utils';

const makeStep = ({ name, index, delay, endTime }) => ({
  index: index || 0,
  id: window.state.sequencerModule.makeId(),
  name,
  endTime,
  delay: delay || 0,
});

function setMaxTime(vis) {
  return vis
    .moment(...START_DATE_PARAMS)
    .add(
      (
        window.state.sequencerModule.noteResolution *
        window.state.sequencerModule.beatPerDateMultiple
      ) * window.state.sequencerModule.loopBarLength,
      window.state.sequencerModule.beatPerDateResolution
    )
}

function initTimeline(container) {
  const options = {
    orientation: 'top',
    height: 350,
    start: vis.moment(...START_DATE_PARAMS),
    min: vis.moment(...START_DATE_PARAMS),
    max: setMaxTime(vis),
    itemsAlwaysDraggable: true,
    zoomFriction: 25,
    moveable: false,
    selectable: true,
    // zoomable: true,
    // horizontalScroll: true,
    type: "range",
    multiselect: true,
    stack: true,
    editable: {
      add: true,
      updateTime: true,
    },
    margin: { item: { horizontal: 0, vertical: 1 } },
    snap: (date, scale, step) => {
      const beatInMMs = window.state.sequencerModule.beatInMMs;
      // Snap to 16ths
      const mm = vis.moment(date).millisecond();
      if (mm / beatInMMs - Math.floor(mm / beatInMMs) < 0.5) {
        return vis.moment(date).millisecond(floor(mm, beatInMMs));
      } else {
        return vis.moment(date).millisecond(ceil(mm, beatInMMs));
      }
    },
    showWeekScale: true,
    showMajorLabels: false,
    // showMinorLabels: false,
    format: {
      minorLabels: (date) => (Number(date.format('SSS')) + window.state.sequencerModule.snaps['16ths']) / window.state.sequencerModule.snaps['16ths'],
      // minorLabels: { millisecond: 'SSS' },
    },
    onAdd,
    onMove,
  };

  const items = new vis.DataSet([]);
  window.state.sequencerModule.timeline = new vis.Timeline(container, items, options);

  window.addEventListener('changeloopbarlength', event => {
    const { loopBarLength } = event;
    const max = setMaxTime(vis);
    window.state.sequencerModule.timeline.setOptions({
      max,
    });
    window.state.sequencerModule.timeline.setWindow(
      options.min,
      max,
    );
  });

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
  window.addEventListener('stepremove', e => {
    const { step } = e;
    items.remove([step.id]);
  });
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
  const diff = vis.moment(item.start).diff(
    vis.moment(...START_DATE_PARAMS).add(
      item.index * window.state.sequencerModule.beatPerDateMultiple,
      window.state.sequencerModule.beatPerDateResolution
    ),
    window.state.sequencerModule.beatPerDateResolution);
  const position =
    item.index + diff / window.state.sequencerModule.beatPerDateMultiple;
  const newindex = Math.floor(position) + 1;

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

function onAdd(item) {
  console.log(`@FILTER item:`, item)
  if (!item.name) {
    item.name = document.querySelector(`#samples-container .vis-selected`)?.dataset.name;
  }
  const startMM = vis.moment(item.start).format('SSS');
  const currentStep = startMM / window.state.sequencerModule.beatPerDateMultiple;
  const stepLength = window.state.sequencerModule.onAddStepLengths[window.state.sequencerModule.snapSelected];
  window.state.sequencerModule.setSequence(currentStep, stepLength, item.name, true);
}

const timeDate = vis.moment(...START_DATE_PARAMS);
function setTimeline() {
  requestAnimationFrame(() => {
    if (window.state.sequencerModule.currentStep === 0)  {
      document.querySelector('.vis-custom-time.steptime').style.left = '0px';
    }
    window.state.sequencerModule.timeline.setCustomTime(
      vis.moment(...START_DATE_PARAMS).add(window.state.sequencerModule.currentStep * window.state.sequencerModule.beatPerDateMultiple, window.state.sequencerModule.beatPerDateResolution),
      'steptime'
    );
  })
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

const deleteSampleE = new Event('deletesample', { bubbles: true });

export function onKeyDownGain(event) {
  const target = document.getElementById('sample-gain');
  if (event.key === '[') {
    target.value = Number(target.value) - Number(target.step);
  } else if (event.key === ']') {
    target.value = Number(target.value) + Number(target.step);
  }
  if (!target) return;
  const sampleName = document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name;
  if (!sampleName) return;
  window.state.sequencerModule.sampleParams[sampleName].gain = Number(target.value);
}

export function onKeyDownPitch(event) {
  const target = document.getElementById('sample-pitch');
  if (event.key === '-') {
    target.value = Number(target.value) - 40;
  } else if (event.key === '=') {
    target.value = Number(target.value) + 40;
  }
  if (!target) return;
  const sampleName = document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name;
  if (!sampleName) return;
  window.state.sequencerModule.sampleParams[sampleName].detune = Number(target.value);
}

export default function Sequencer() {
  const id = 'sequencer-container';
  document.getElementById(id).replaceWith(div({
    id,
    innerHTML: `
      <div class="container">
        <link href="/elements/Sequencer.css" rel="stylesheet"></style>
        <div id="sequencer">
        </div>
        <div id="sequencer-controls"></div>
        <div class="items-panel">
          <div class="side-left">
            <div class="drag-over-icon"
              ondragover="event.preventDefault();this.classList.add('highlight')"
              ondragenter="event.preventDefault()"
              ondragleave="this.classList.remove('highlight')"
              ondragend="this.classList.remove('highlight')"
            >
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" width="24" height="24"><defs><style>.cls-6374f8d9b67f094e4896c66b-1{fill:none;stroke:currentColor;stroke-miterlimit:10;}</style></defs><path class="cls-6374f8d9b67f094e4896c66b-1" d="M16.88,22.5H7.12a1.9,1.9,0,0,1-1.9-1.8L4.36,5.32H19.64L18.78,20.7A1.9,1.9,0,0,1,16.88,22.5Z"></path><line class="cls-6374f8d9b67f094e4896c66b-1" x1="2.45" y1="5.32" x2="21.55" y2="5.32"></line><path class="cls-6374f8d9b67f094e4896c66b-1" d="M10.09,1.5h3.82a1.91,1.91,0,0,1,1.91,1.91V5.32a0,0,0,0,1,0,0H8.18a0,0,0,0,1,0,0V3.41A1.91,1.91,0,0,1,10.09,1.5Z"></path><line class="cls-6374f8d9b67f094e4896c66b-1" x1="12" y1="8.18" x2="12" y2="19.64"></line><line class="cls-6374f8d9b67f094e4896c66b-1" x1="15.82" y1="8.18" x2="15.82" y2="19.64"></line><line class="cls-6374f8d9b67f094e4896c66b-1" x1="8.18" y1="8.18" x2="8.18" y2="19.64"></line></svg>
            </div>
          </div>
          <div class="side">
            <div id="samples-container" class="items">
            </div>
          </div>
          <div class="side-right">
            <div>
              <div>Volume</div>
              <input id="sample-gain" type="range" step="0.1" min="0" max="5" value="1" oninput="
                const { value } = event.target;
                const sampleName = document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name;
                if (!sampleName) return;
                window.state.sequencerModule.sampleParams[sampleName].gain = Number(value);
              "/>
              <div>Pitch</div>
              <input id="sample-pitch" type="range" step="1" min="-2000" max="2000" value="0" oninput="
                const { value } = event.target;
                const sampleName = document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name;
                if (!sampleName) return;
                window.state.sequencerModule.sampleParams[sampleName].detune = Number(value);
              "/>
            </div>
            <div id="arpeggiator">
              <div>Arp</div>
              ${Object.keys(window.state.stepRecordModule.arpPatterns).map(patternName => {
                return `
                  <input
                    onchange="
                      window.state.sequencerModule.sampleParams[document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name].arpegg = '${patternName}'
                    "
                    ontouchstart="
                      event.target.checked = true;
                      window.state.sequencerModule.sampleParams[document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name].arpegg = '${patternName}'
                    "
                    ontouchend="
                      event.target.checked = true;
                      window.state.sequencerModule.sampleParams[document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name].arpegg = '${patternName}'
                    "
                    ontouchcancel="
                      event.target.checked = true;
                      window.state.sequencerModule.sampleParams[document.querySelectorAll('#samples-container .vis-selected')[0].dataset.name].arpegg = '${patternName}'
                    "
                    id="${patternName}"
                    type="radio"
                    name="arpegg"
                    value="${patternName}"
                    ${patternName === 'Off' ? 'checked' : ''}
                  />
                  <label for="${patternName}">${patternName}</label>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `,
  }));
  window.state.sequencerModule.init(() => {
    const container = document.getElementById('sequencer');
    initTimeline(container);
    requestAnimationFrame(draw);
  });
  document.querySelector('.drag-over-icon').addEventListener('drop', e => {
    document.querySelector('.drag-over-icon').classList.remove('highlight');
    const visItem = JSON.parse(e.dataTransfer.getData('text'));
    const segment = window.state.sequencerModule.segmentData[visItem.name];
    Array.from(document.querySelectorAll(`#sequencer canvas[data-sample-name="${visItem.name}"]`)).forEach(canv => {
      canv.getContext('2d').clearRect(0, 0, canv.width, canv.height);
    });
    window.dispatchEvent(Object.assign(deleteSampleE, { segment }));
  });
}

