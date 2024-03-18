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
  keyDowns: [],
  keysToMapNumbers: [
    'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
      'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l',
        'z', 'x', 'c', 'v', 'b', 'n', 'm',
  ],
  arpPatterns: {
    Off: [],
    1: Array(256).fill().map((_,i) => i % 64 === 0 ? true : undefined),
    2: Array(256).fill().map((_,i) => i % 48 === 0 ? true : undefined),
    3: Array(256).fill().map((_,i) => i % 32 === 0 ? true : undefined),
    4: Array(256).fill().map((_,i) => i % 16 === 0 ? true : undefined),
    5: Array(256).fill().map((_,i) => i % 8 === 0 ? true : undefined),
    6: Array(256).fill().map((_,i) => i % 4 === 0 ? true : undefined),
    7: Array(256).fill().map((_,i) => 
      i === 0
      || i === 40
      || i === 64
      || i === 104
      || i === 128
      || i === 168
      || i === 192
      || i === 232
    ? true : undefined),
    8: Array(256).fill().map((_,i) => 
      i === 0
      || i === 22
      || i === 42

      || i === 64
      || i === 86
      || i === 106

      || i === 64
      || i === 86
      || i === 106

      || i === 128
      || i === 150
      || i === 170

      || i === 192
      || i === 214
      || i === 234
    ? true : undefined),
    9: Array(256).fill().map((_,i) => 
      i === 0
      || i === 10
      || i === 21

      || i === 32
      || i === 42
      || i === 53
      
      || i === 64
      || i === 74
      || i === 85

      || i === 96
      || i === 106
      || i === 117

      || i === 128
      || i === 138
      || i === 149

      || i === 160
      || i === 170
      || i === 181

      || i === 192
      || i === 202
      || i === 213

      || i === 224
      || i === 234
      || i === 245
    ? true : undefined),
      // 0     16    32    48
      // 64    80    96    112
      // 128   144   160   176
      // 192   208   224   240
    // 6: Array(256).fill().map((_,i) => 
    //   i === 0
    //   || i === 48
    //   || i === 96
    //   || i === 144
    //   || i === 192
    //   || i === 240
    // ),
    // 7: Array(256).fill().map((_,i) => 
    //   i === 0
    //   || i === 16
    //   || i === 80
    //   || i === 128
    //   || i === 160
    //   || i === 208
    // ),
    // 8: Array(256).fill().map((_,i) => 
    //   i === 0
    //   || i === 48
    //   || i === 96
    //   || i === 144
    //   || i === 192
    //   || i === 240
    // ),
    // 9: Array(256).fill().map((_,i) => 
    //   i === 0
    //   || i === 32
    //   || i === 80
    //   || i === 96
    //   || i === 128
    //   || i === 176
    //   || i === 208
    //   || i === 240
    // ),
    // 10: Array(256).fill().map((_,i) => 
    //   i === 0
    //   || i === 16
    //   || i === 48
    //   || i === 64
    //   || i === 96
    //   || i === 112
    //   || i === 144
    //   || i === 160
    //   || i === 192
    //   || i === 208
    //   || i === 240
    // ),
    // 10: Array(256).fill().map((_,i) => 
    //   i === 0
    //   || i === 16
    //   || i === 32
    //   || i === 96
    //   || i === 160
    //   || i === 224
    // ),
    // 11: Array(256).fill().map((_,i) => 
    //   i === 0
    //   || i === 48
    //   || i === 96
    //   || i === 128
    //   || i === 176
    //   || i === 224
    // ),
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
