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
  //
  //
  // Maybe the grid doesn't matter. All I need to allow the user to set is
  // either more fine grsined or less fine grained snap.
  // Start by redoing the notes and an end point. Then put those notes in a
  // grid, setting the speed to whatever keeps it the same.
  // This would also mean the speed doesn't matter either.
  //
  // Actually this is the wrong way around. Start by making a normal record
  // function on the original sequencer. 
  //
  // Make the sequencer as fine grained as you can get it DONE
  // Get the tempo saying the right thing DONE
  // Add a metronome DONE
  // Make the sample trigger call vis's onAdd event hanlder DONE
  // Add a record button DONE
  //
  // Fix vis issues
  // Make the time represent seconds DONE
  // Make the drag snap 16ths DONE
  // Add a select to change the snap DONE
  //
  // Fix double click onAdd DONE
  // Make samples flash when played <--
  // 
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
  }
};

window.addEventListener('keydown', (e) => {
  if (window.state.mode !== "sequencer") return;

  // End with space key
  if (e.key === 'Enter') { 
    // return recordSequence();
  }

  window.state.stepRecordModule.keymaps[
    window.state.stepRecordModule.keysToMapNumbers.findIndex((l) => l === e.key)
  ]?.forEach((sampleName) => {
    if (window.state.sequencerModule.isRecording) {
      window.state.sequencerModule.setSequence(
        window.state.sequencerModule.currentStep,
        window.state.sequencerModule.getSelectedStepLengthFromTimeSeconds(window.state.sequencerModule.samples[sampleName].duration),
        sampleName
      );
    }
    playSample(sampleName);
    // recordSequence(sampleName);
  });
});

function playSample(sampleName, time) {
  const prepare = window.state.sequencerModule.samples[sampleName](time);
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
