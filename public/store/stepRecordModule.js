import { KEY_MAPS } from '../constants';

//
// *** TODO ***
//
// Next couple of jobs are:
//
// - Arpeggiators when holding down keys (not keyboard retrigger, see game keydown on stack overflow)
// - Mobile layout for sample keys
//

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
  keyDowns: {},
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
