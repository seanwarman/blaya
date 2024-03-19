import { KEY_MAPS, ARP_PATTERNS, LOOPBAR_LENGTH_DEFAULT } from '../constants';

function getLoopBarLength() {
  if (window.state?.sequencerModule?.loopBarLength) return window.state?.sequencerModule?.loopBarLength;
  return LOOPBAR_LENGTH_DEFAULT;
}

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
  keyDowns: [],
  clearMode: false,
  keysToMapNumbers: [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
        'z', 'x', 'c', 'v', 'b', 'n', 'm',
  ],
  get arpPatterns() {
    if (!window.state?.sequencerModule?.loopBarLength || window.state?.sequencerModule?.loopBarLength === LOOPBAR_LENGTH_DEFAULT) {
      return ARP_PATTERNS;
    } else {
      return {
        Off: [],
        1: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['1']).flatMap(n => n),
        2: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['2']).flatMap(n => n),
        3: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['3']).flatMap(n => n),
        4: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['4']).flatMap(n => n),
        5: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['5']).flatMap(n => n),
        6: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['6']).flatMap(n => n),
        7: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['7']).flatMap(n => n),
        8: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['8']).flatMap(n => n),
        9: Array(window.state?.sequencerModule?.loopBarLength).fill(ARP_PATTERNS['9']).flatMap(n => n),
      };
    }
  },
  arpStarts: {},
  checkArpStep(keyMap, currentStep) {
    const step = () => {
      const arpStart = this.arpStarts[keyMap];
      if (currentStep - arpStart < 0) {
        return 256 + (currentStep - arpStart);
      } else {
        return currentStep - arpStart;
      }
    }
    return this.arpPatterns[window.state.sequencerModule.sampleParams[keyMap].arpegg][step()];
  },
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
