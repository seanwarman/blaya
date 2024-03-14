import { KEY_MAPS } from '../constants';

export const stepRecordModule = {
  // { name: sampleName, time: number }[]
  looper: [],
  setKeymaps(samples) {
    Object.keys(samples).forEach((name, i) => {
      this.keymaps[i] = [name];
    });
  },
  // sampleName[]
  keymaps: [],
  keysToMapNumbers: [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
        'z', 'x', 'c', 'v', 'b', 'n', 'm',
  ],
  currentMapNumber: 0,
  nextNoteTime: 0,
  latency: 0.2,
  currentStep: 0,
  offsetTime: 0,
  playing: false,
  startTime: 0,
  playStep(name, time) {
    window.state.sequencerModule.samples[name] =
      window.state.sequencerModule.samples[name](time)();
  },
  play() {
    this.playing = true;
    this.currentStep = 0;
    this.startTime = this.getTime();
  },
  tickMessage() {
    if (!this.looper[this.currentStep] || this.looper[this.currentStep].end) {
      this.playing = false;
    }
    if (this.playing) {
      const loopPoint = this.looper[this.currentStep++];
      this.playStep(
        loopPoint.name,
        this.getTime() + loopPoint.time + this.latency
      );
    }
    if (this.getTime() >= this.startTime + this.looper[this.looper.length-1].time) {
      this.play();
    }
  },
  getTime() {
    return window.state.sequencerModule.audioContext.currentTime;
  },
  getNextFreeKeyMap() {
    const keyMap = KEY_MAPS.find(k => !window.state.sequencerModule.samples[k]);
    if (keyMap) {
      return keyMap;
    }
    return this.keysToMapNumbers[this.currentMapNumber++].toUpperCase();
  },
};

window.addEventListener('keydown', (e) => {
  if (window.state.mode !== "sequencer") return;

  // End with space key
  if (e.key === 'Enter') { 
    // return recordSequence();
  }

  const keyMap = e.key.toUpperCase();

  if (window.state.sequencerModule.isRecording) {
    window.state.sequencerModule.setSequence(
      window.state.sequencerModule.currentStepSnapped,
      window.state.sequencerModule.getSelectedStepLengthFromTimeSeconds(window.state.sequencerModule.samples[keyMap].duration),
      keyMap
    );
  }
  Array.from(document.querySelectorAll('#samples-container .vis-selected')).forEach(el => el.classList.remove('vis-selected'));
  const sampleEl = document.querySelector(`#samples-container [data-name="${keyMap}"].vis-item`);
  sampleEl.classList.add('vis-selected');

  // TODO: Put this in a listener
  const gainRange = document.getElementById('sample-gain');
  gainRange.value = window.state.sequencerModule.sampleParams[sampleEl.dataset.name].gain;
  const pitchRange = document.getElementById('sample-pitch');
  pitchRange.value = window.state.sequencerModule.sampleParams[sampleEl.dataset.name].detune;

  playSample(keyMap);
});

function playSample(sampleName, time) {
  if (!window.state.sequencerModule.samples[sampleName]) return;
  const prepare = window.state.sequencerModule.samples[sampleName](time, null, window.state.sequencerModule.sampleParams[sampleName]);
  window.state.sequencerModule.samples[sampleName] = prepare();
}

function recordSequence(sampleName) {
  if (window.state.stepRecordModule.looper.length === 0) {
    window.state.stepRecordModule.offsetTime =
      window.state.sequencerModule.audioContext.currentTime;
  }
  window.state.stepRecordModule.looper.push({
    name: sampleName,
    start: window.state.stepRecordModule.looper.length === 0,
    end: sampleName === undefined,
    time: window.state.sequencerModule.audioContext.currentTime - window.state.stepRecordModule.offsetTime,
  });
}
