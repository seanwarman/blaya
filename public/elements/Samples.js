import '../node_modules/peaks.js/dist/peaks.js';
import * as dom from '../helpers/dom.js'
import { KEY_MAPS } from '../constants.js';

const id = 'samples-container';
const timeoutRefs = {};

export function onPlaySample(e) {
  requestAnimationFrame(() => {
    const sampleEl = Array.from(document.getElementById(id).children).find(el => el.dataset.name === e.sampleName);
    clearTimeout(timeoutRefs[e.sampleName]);
    sampleEl.classList.remove('trigger');
    sampleEl.classList.add('trigger');
    timeoutRefs[e.sampleName] = setTimeout(() => {
      sampleEl.classList.remove('trigger');
    }, 10);
  });
}

export function onKeyDownSamples(e) {
  if (window.state.mode !== "sequencer") return;
  // End with space key
  if (e.key === 'Enter') { 
    // return recordSequence();
  }
  if (window.state.stepRecordModule.keysToMapNumbers.includes(e.key)) {
    const keyMap = e.key.toUpperCase();
    if (window.state.sequencerModule.isRecording) {
      window.state.sequencerModule.setSequence(
        window.state.sequencerModule.currentStepSnapped,
        window.state.sequencerModule.getSelectedStepLengthFromTimeSeconds(window.state.sequencerModule.samples[keyMap].duration),
        keyMap
      );
    }
    selectSample(keyMap);
    playSample(keyMap);
  }
}

function playSample(sampleName, time) {
  console.error(sampleName)
  if (!window.state.sequencerModule.samples[sampleName]) return;
  const prepare = window.state.sequencerModule.samples[sampleName](time, null, window.state.sequencerModule.sampleParams[sampleName]);
  window.state.sequencerModule.samples[sampleName] = prepare();
}

function onDragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
  const item = {
    id: 0,
    type: 'range',
    name: event.target.dataset.name,
    content: event.target.dataset.name,
  };
  event.dataTransfer.setData('text', JSON.stringify(item));
}

function selectSample(keyMap) {
  Array.from(document.querySelectorAll('#samples-container .vis-selected')).forEach(el => el.classList.remove('vis-selected'));
  const sampleEl = document.querySelector(`#samples-container [data-name="${keyMap}"].vis-item`);
  sampleEl.classList.add('vis-selected');
  window.state.sequencerModule.selectedSampleName = keyMap;

  const gainRange = document.getElementById('sample-gain');
  gainRange.value = window.state.sequencerModule.sampleParams[sampleEl.dataset.name].gain;
  const pitchRange = document.getElementById('sample-pitch');
  pitchRange.value = window.state.sequencerModule.sampleParams[sampleEl.dataset.name].detune;
}

export default function Samples(samples = [], segmentData = {}) {
  const makeActiveSample = (name) => {
    const visItem = dom.div({
      draggable: true,
      dataset: {
        name: name,
        colourClass: segmentData[name].className + '-light',
      },
      className: `item vis-item vis-range vis-editable ${segmentData[name].className}-light`,
      onclick: () => selectSample(name),
      ondragstart: e => {
        selectSample(name);
        onDragStart(e);
      },
      innerHTML: `
        <div class="vis-item-overflow">
          <div class="vis-item-content" style="width:47px;transform: translateX(0px);">
            <span style="
              position: absolute;
              color: white;
              top: 0;
              left: 2px;
              font-size: 0.8rem;
            ">${name}</span>
            <canvas width="10000" data-sample-name="${name}" style="height:30px;margin-left:-12px;margin-right-5px"></canvas>
          </div>
        </div>
        <div class="vis-item-visible-frame"></div>
      `,
    });
    const newElement = dom.div({
      className: 'sample',
      dataset: {
        name: name,
      },
      style: 'height:46px;',
      children: [visItem],
    });
    // Keeps the original element to avoid wiping the canvas image
    const originalElement = document.querySelector(`.sample[data-name="${name}"]`);
    if (originalElement) {
      // originalElement.replaceWith(newElement);
      return originalElement;
    } else {
      return newElement;
    }
  };
  const makeGreyedOutSample = (key, i) => {
    return dom.div({
      className: 'sample',
      style: 'height: 46px',
      innerHTML: `
        <div class="item vis-item vis-range vis-editable sample-colour-grey"> <div class="vis-item-overflow"> <div class="vis-item-content" style="width:47px;transform: translateX(0px);"> <span style=" position: absolute; color: white; top: 0; left: 2px; font-size: 0.8rem; ">
          ${key}
        </span> <div style="width:415px;height:30px"></div> </div> </div> <div class="vis-item-visible-frame"></div> </div>
      `
    });
  };
  const itemsElement = dom.div({
    id,
    className: 'items',
    children: KEY_MAPS.map((k,i) => {
      if (samples[k]) return makeActiveSample(k);
      return makeGreyedOutSample(k, i);
    }).filter(Boolean),
  });
  const originalEl = document.getElementById(id);
  if (originalEl) {
    originalEl.replaceWith(itemsElement);
  } else {
    document.querySelector('#sequencer-container .side').appendChild(itemsElement);
  }
}
