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
  if (window.state.mode !== "sequencer") return;
  window.state.stepRecordModule.keymaps[
    window.state.stepRecordModule.keysToMapNumbers.findIndex((l) => l === e.key)
  ]?.forEach(playSample);
});

function playSample(sampleName) {
  const prepare = window.state.sequencerModule.samples[sampleName]();
  window.state.sequencerModule.samples[sampleName] = prepare();
  // window.state.stepRecordModule.looper.push({
  //   name: sampleName,
  //   time: window.state.sequencerModule.audioContext.currentTime,
  // });
}
