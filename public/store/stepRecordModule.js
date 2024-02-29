
function playSample(sampleName) {
  const prepare = window.state.sequencerModule.samples[sampleName]();
  window.state.sequencerModule.samples[sampleName] = prepare();
}

export const stepRecordModule = {
  // { name: sampleName, time: number }[]
  looper: [
    {
      name: "kick",
      time: 1234455,
    },
    {
      name: "sn",
      time: 2494882,
    },
  ],
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
  // There's no need to even record anything. You just listen for the keydown
  // events and set "time" using something like performance.time or the audio
  // context time and set "name" by the name of the sample being played.  You
  // don't even need to record the start/stop time. If you're always recording
  // samples and times, you can just choose any arbitrary set of items in
  // recordSequence and set a start/stop time around them.
  //
  // If you've decided how many bars are between the start/stop time you can
  // use that length to decide what the tempo will be.
  //
  // If you want to pick a step to start on, you can minus that step's time off of
  // all the subsequent steps. Then run them all using sample.start(time) in a loop.
  // This would be a good way to preview a loop.
  //
};

window.addEventListener('keydown', (e) => {
  if (window.state.mode !== 'sequencer') return;
  switch (e.key) {
    case 'q':
      return window.state.stepRecordModule.keymaps[0]?.forEach(playSample);
    case 'w':
      return window.state.stepRecordModule.keymaps[1]?.forEach(playSample);
    case 'e':
      return window.state.stepRecordModule.keymaps[2]?.forEach(playSample);
    case 'r':
      return window.state.stepRecordModule.keymaps[3]?.forEach(playSample);
    case 't':
      return window.state.stepRecordModule.keymaps[4]?.forEach(playSample);
    case 'y':
      return window.state.stepRecordModule.keymaps[5]?.forEach(playSample);
    case 'u':
      return window.state.stepRecordModule.keymaps[6]?.forEach(playSample);
    case 'i':
      return window.state.stepRecordModule.keymaps[7]?.forEach(playSample);
    case 'o':
      return window.state.stepRecordModule.keymaps[8]?.forEach(playSample);
    case 'p':
      return window.state.stepRecordModule.keymaps[9]?.forEach(playSample);
    case 'a':
      return window.state.stepRecordModule.keymaps[10]?.forEach(playSample);
    case 's':
      return window.state.stepRecordModule.keymaps[11]?.forEach(playSample);
    case 'd':
      return window.state.stepRecordModule.keymaps[12]?.forEach(playSample);
    case 'f':
      return window.state.stepRecordModule.keymaps[13]?.forEach(playSample);
    case 'g':
      return window.state.stepRecordModule.keymaps[14]?.forEach(playSample);
    case 'h':
      return window.state.stepRecordModule.keymaps[15]?.forEach(playSample);
    case 'j':
      return window.state.stepRecordModule.keymaps[16]?.forEach(playSample);
    case 'k':
      return window.state.stepRecordModule.keymaps[17]?.forEach(playSample);
    case 'l':
      return window.state.stepRecordModule.keymaps[18]?.forEach(playSample);
    case 'z':
      return window.state.stepRecordModule.keymaps[19]?.forEach(playSample);
    case 'x':
      return window.state.stepRecordModule.keymaps[20]?.forEach(playSample);
    case 'c':
      return window.state.stepRecordModule.keymaps[21]?.forEach(playSample);
    case 'v':
      return window.state.stepRecordModule.keymaps[22]?.forEach(playSample);
    case 'b':
      return window.state.stepRecordModule.keymaps[23]?.forEach(playSample);
    case 'n':
      return window.state.stepRecordModule.keymaps[24]?.forEach(playSample);
    case 'm':
      return window.state.stepRecordModule.keymaps[25]?.forEach(playSample);
  }
});
