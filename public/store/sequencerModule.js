import Samples from '../elements/Samples';
import { START_DATE_PARAMS, LOOPBAR_LENGTH_DEFAULT } from '../constants';
import '../node_modules/waveform-data/dist/waveform-data.js';
import { cloneWaveImgCanvas } from '../helpers/dom';
import { floor, ceil, simpleHash } from '../helpers/utils';

// const click = createBitPlayer(3, i => {
//   if (i < 100) {
//     return Math.random() * 2 - 1
//   }
//   return 0
// })()

// const cluck = createBitPlayer(2, i => {
//   if (i < 100) {
//     return Math.random() * 2 - 1
//   }
//   return 0
// })()

const stepEvent = new Event('onstep', { bubbles: true });
const stepRemovedEvent = new Event('stepremove', { bubbles: true });
const loopBarLengthEvent = new Event('changeloopbarlength', { bubbles: true });
const playEvent = new Event('playsample', { bubbles: true });

export const sequencerModule = {
  name: null,
  unlocked: false,
  isPlaying: false,       // Are we currently playing?
  isRecording: false,
                          //
  startTime: undefined,   // The start time of the entire sequence.
                          //
  currentStep: 0,         // What note is currently last scheduled?
  tempo: 120.0,           // tempo (in beats per minute)
  lookahead: 5.0,        // How frequently to call scheduling function 
                          // (in milliseconds)

  scheduleAheadTime: /iphone|android/gi.test(navigator.userAgent) ? 0.05 : 0.01,
                            // This is the latency. Make it a higher number for slower machines
                            // My macbook can deal with it being 0.01. The
                            // metronome tutorial has it as high as 0.4, but their other settings are
                            // slightely different as well.
                            //
                            //
                            // *** TODO ***
                            // Make this a higher number for mobile (just make a guess for now).
                            // - Update the arpegg so that it works with this latency number <-- DONE!
                            // - Get mulitple touch events working on mobile
                            // - Allow erasing notes by holding keyMap <-- DONE!
                            // - Allow a selection of pitches to raised or lowered together
  nextNoteTime: 0.0,        //
  noteResolution: 256,      //
  last16thNoteDrawn: -1,    // the last "box" we drew on the screen
  notesInQueue: [],         // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
                            //
  timerWorker: null,        // The Web Worker used to fire timer messages
                            //
  loopBarLength: LOOPBAR_LENGTH_DEFAULT,
  setLoopBarLength(loopBarLength) {
    if (loopBarLength < 1) return;
    // TODO: this needs work see the Sequencer.js file, there's a bug with new sequencer indexes
    // Duplicates the original loop into the new bars
    // this.sequence = Array(this.noteResolution * loopBarLength)
    //   .fill()                                                                                  // Each vis item needs to have a unique id
    //   .map((_,i) => this.sequence[i % (this.loopBarLength * this.noteResolution)]?.map(step => ({ ...step, id: this.makeId() })));
    this.loopBarLength = loopBarLength;
    window.dispatchEvent(Object.assign(loopBarLengthEvent, { loopBarLength }))
  },
  timeLinePosition: 0,
  timing: {
    normal: 0.25,
    trap: 0.125,
    real: 0.0625,
  },
  selectedTiming: 'normal',
  getStepLength() {
    return this.timing[this.selectedTiming] * (60.0 / (this.tempo * 16));
  },

  metronome: null,
  metronomeOn: false,

  sequence: [
    // [ { index: 0, id: 1707891252190, name: "click", endTime: 0.125, delay: 0 } ],
    // ...
  ],
  beatPerDateResolution: 'millisecond',
  // 256 notes resolution times 3.125 is 800 (the length in ms for 16 beats on
  // the vis timeline)
  beatPerDateMultiple: 3.125,
  steps: {
    '16ths': 16,
    '32ths': 8,
    '64ths': 4,
    '128ths': 2,
    '256ths': 1,
  },
  onAddStepLengths: {
    '16ths': 1,
    '32ths': 2,
    '64ths': 4,
    '128ths': 8,
    '256ths': 16,
  },
  snapSelected: '16ths',
  snaps: {
    '16ths': 50,
    '32ths': 25,
    '64ths': 12.5,
    '128ths': 6.25,
    '256ths': 3.125,
  },
  get stepSelected() {
    return this.steps[this.snapSelected];
  },
  get beatInMMs() {
    return this.snaps[this.snapSelected];
  },
  get beatInTime() {
    return this.getStepLength() * this.steps[this.snapSelected];
  },
  get currentStepSnapped() {
    if (this.currentStep / this.stepSelected - Math.floor(this.currentStep / this.stepSelected) < 0.5) {
      return floor(this.currentStep, this.stepSelected);
    } else {
      return ceil(this.currentStep, this.stepSelected);
    }
  },
  getSelectedStepLengthFromTimeSeconds(seconds) {
    return Math.ceil(seconds / this.beatInTime);
  },
  setSequence(startStep, stepLength, sampleName, ignoreIsPlaying) {
    if (!ignoreIsPlaying && !this.isPlaying) return;
    const step = {
      id: this.makeId(),
      index: startStep,
      name: sampleName,
      endTime: this.beatInTime * stepLength,
      delay: 0,
    };
    setTimeout(() => {
      if (this.sequence[startStep]) {
        this.sequence[startStep].push(step);
      } else {
        this.sequence[startStep] = [step]
      }
    }, 100);
    const start = vis.moment(...START_DATE_PARAMS).add(startStep * this.beatPerDateMultiple, this.beatPerDateResolution);
    const { waveImgCanvas, selectedSample} = cloneWaveImgCanvas(sampleName);
    this.timeline.itemsData.add({
      className: selectedSample.dataset.colourClass,
      name: selectedSample.dataset.name,
      content: waveImgCanvas,
      id: step.id,
      step,
      index: step.index,
      start,
      end: vis.moment(start).add(this.beatInMMs * stepLength, this.beatPerDateResolution),
    });
  },
  // vis.Timeline
  timeline: {},
  setTimeline(sequence) {
    this.sequence = [];
    this.timeline?.itemsData?.clear();
    sequence.forEach(items => {
      if (!items) return
      items.forEach(item => {
        this.setSequence(item.index, item.endTime / this.beatInTime, item.name, true);
      });
    });
  },
  samples: {},
  idCount: 0,
  makeId() {
    return Date.now() + this.idCount++;
  },
  segmentData: {},
  selectedSampleName: null,
  trackLoaderSamplePlayer: null,
  setTrackLoaderSamplePlayer(samplePlayer) {
    this.trackLoaderSamplePlayer = samplePlayer;
  },
  trackLoaderSampleRate: 48000,
  setTrackLoaderSampleRate(sampleRate) {
    this.trackLoaderSampleRate = sampleRate;
  },
  trackLoaderByteLength: null,
  setTrackLoaderByteLength(length) {
    this.trackLoaderByteLength = length;
  },
  audioContext: null,
  setAudioContext(audioContext) {
    this.audioContext = audioContext;
  },
  duration: null,
  setTrackLoaderDuration(duration) {
    this.duration = duration;
  },
  packets: null,
  setPackets(packets) {
    this.packets = packets;
  },
  deleteSample(keyMap) {
    this.samples[keyMap] = null;
    window.state.stepRecordModule.setKeymaps(this.samples);
    Samples(this.samples, this.segmentData);
  },
  sampleCount: 1,
  setSamples(samples) {
    let newSamples = Object.entries(samples);
    let oldSamples = Object.entries(this.samples)
    oldSamples.forEach(([key, value], i) => {
      if (samples[key]) {
        oldSamples[i] = [key, samples[key]];
        newSamples = newSamples.filter(([k]) => k !== key);
      } else if (value === null) {
        oldSamples[i] = newSamples.pop();
      }
    });
    newSamples.forEach(([key, value]) => {
      oldSamples.push([key, value]);
    });
    this.samples = oldSamples.filter(Boolean).reduce((samples, [key, value]) => {
      return {
        ...samples,
        [key]: value,
      };
    }, {});
    window.state.stepRecordModule.setKeymaps(this.samples);
    // Add samples to ui
    Samples(this.samples, this.segmentData);
  },
  setSegmentData(sampleName, segment, trackUrl, startByte, endByte) {
    if (this.segmentData[sampleName] && this.segmentData[sampleName].color !== segment.color) {
      Array.from(document.querySelectorAll(`#sequencer .vis-item.${this.segmentData[sampleName].className}-light`)).forEach(el => {
        el.classList.remove(this.segmentData[sampleName].className + '-light');
        el.classList.add(segment.className + '-light');
      });
    }
    this.segmentData = {
      ...this.segmentData,
      [sampleName]: {
        id: segment.id,
        uniqueId: segment.id + '__' + simpleHash(trackUrl) + String(Date.now()),
        keyMap: segment.keyMap,
        className: segment.className,
        color: segment.color,
        sampleName,
        startByte,
        endByte,
        trackUrl,
      },
    };
  },
//sampleParams: { [sampleName]: { detune } }
  sampleParams: {},
  setSegmentDataAndSample(sampleName, shallowSegment, trackUrl, startByte, endByte) {
    this.setSegmentData(sampleName, shallowSegment, trackUrl, startByte, endByte)
    // Set samples so the canvas exists for drawWaveforms
    if (!this.samples[sampleName]) {
      this.setSamples({
        [sampleName]: null,
      });
    }
    return fetchAndPrepareSample(sampleName, trackUrl, startByte, endByte).then(prepare => {
      if (!this.sampleParams[sampleName]) {
        this.sampleParams[sampleName] = { detune: 0, gain: 1, arpegg: 'Off' };
      }
      this.setSamples({
        [sampleName]: prepare(),
      });
    });
  },
  setAllSamplesAndSegmentData(segmentData, sampleParams) {
    this.samples = {};
    if (sampleParams) {
      Object.assign(this.sampleParams, sampleParams);
    }
    return Promise.all(Object.values(segmentData).map(async (shallowSegment) => {
      const { startByte, endByte, trackUrl, sampleName } = shallowSegment;
      await this.setSegmentDataAndSample(sampleName, shallowSegment, trackUrl, startByte, endByte);
    }));
  },
  addOrUpdateSample(segment, trackUrl) {
    const sampleName = segment.keyMap;
    const { startByte, endByte } = getStartAndEndBytes(segment, this.packets);
    this.setSegmentDataAndSample(sampleName, segment, trackUrl, startByte, endByte);
  },
  async init(cb) {
    this.timerWorker = new Worker('../workers/clock-worker.js');
    this.timerWorker.addEventListener('message', (e) => {
      if (e.data == 'tick') {
        this.scheduler();
      }
      else
        console.log('message: ' + e.data);
    });
    this.timerWorker.postMessage({'interval':this.lookahead});
    cb();
    this.metronome = createBitPlayer(3, i => {   
      if (i < 100) {                    
        return Math.random() * 2 - 1    
      }                                 
      return 0                          
    });
  },
  play() {
    if (!this.audioContext)
      this.setAudioContext(new AudioContext());
    if (!this.unlocked) {
      // play silent buffer to unlock the audio
      var buffer = this.audioContext.createBuffer(1, 1, 22050);
      var node = this.audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      this.unlocked = true;
    }
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) { // start playing
      this.currentStep = 0;
      this.timeLinePosition = 0;
      this.nextNoteTime = this.audioContext.currentTime;
      this.timerWorker.postMessage('start');
      return 'stop';
    } else {
      this.timerWorker.postMessage('stop');
      return 'play';
    }
  },
  scheduler() {
    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.currentStep, this.nextNoteTime);
      this.nextNote();
    }
  },
  nextNote() {
    this.nextNoteTime += this.getStepLength();
    this.currentStep++;    // Advance the beat number, wrap to zero
    if (this.currentStep == this.loopBarLength * this.noteResolution) {
      this.currentStep = 0;
    }
  },
  scheduleNote(currentStep, time) {
    // push the note on the queue, even if we're not playing.
    this.notesInQueue.push({ note: currentStep, time: time });
    window.dispatchEvent(Object.assign(stepEvent, { currentStep, time }));
    if (this.sequence[currentStep]?.length) {
      for (let i=0;i<this.sequence[currentStep].length;i++) {
        const step = this.sequence[currentStep][i];
        if (
          window.state.stepRecordModule.keyDowns.length
          && window.state.stepRecordModule.clearMode
          && window.state.stepRecordModule.keyDowns.includes(step.name)
        ) {
          window.dispatchEvent(Object.assign(stepRemovedEvent, { step }));
          this.sequence[currentStep] = this.sequence[currentStep].filter(s => step.name !== s.name);
        } else {
          const startTime = time + (this.getStepLength() * step.delay);
          if (this.samples[step.name]) {
            const prepare = this.samples[step.name](startTime, startTime + step.endTime, this.sampleParams[step.name]);
            this.samples[step.name] = prepare();
          }
        }
      }
    }
    if (this.metronomeOn) {
      if (
        currentStep === 0
        || currentStep === (this.noteResolution / 4) * 1
        || currentStep === (this.noteResolution / 4) * 2
        || currentStep === (this.noteResolution / 4) * 3
      ) {
        this.metronome = this.metronome(time)();
      }
    }
  },
  duplicateTimeline({ bars } = { bars: null }) {
    if (!bars) bars = [1,2];
    const [barsToDuplicate, barsToDuplicateOver] = bars;
    this.setTimeline(
      Array(this.noteResolution*barsToDuplicateOver).fill().map((_,i) => {
        const arr = this.sequence[i % (this.noteResolution*barsToDuplicate)];
        if (!arr) return null;
        return arr.map(segmentData => (segmentData ? { ...segmentData, index: i } : null));
      }),
    );
  },
  loadFromFile(changeEvent) {
    if (!changeEvent.target.files[0]) return;
    const reader = new FileReader();
    reader.onload = async (onloadEvent) => {
      try {
        const exportedSequencerModule = JSON.parse(onloadEvent.target.result);
        if (
          exportedSequencerModule.segmentData
          && exportedSequencerModule.sequence
          && exportedSequencerModule.sampleParams
        ) {
          await this.load(exportedSequencerModule);
        } else {
          alert('This file is the wrong format');
        }
      } catch (error) {
        console.error(error);
        alert('There was a problem loading this file');
      }
    };
    reader.readAsText(changeEvent.target.files[0]);
  },
  saveToFile() {
    const name = this.name || prompt('Save as...');
    this.name = name;
    if (name) {
      const url = URL.createObjectURL(new File([JSON.stringify(this.save())], name, { type: 'application/json' }));
      let link = document.createElement('a');
      link.dataType = 'json';
      link.href = url;
      link.download = name;
      link.dispatchEvent(new MouseEvent('click'));
      setTimeout(() => {
        link = undefined;
        window.URL.revokeObjectURL(url);
      }, 60);
    }
  },
  save(name) {
    return {
      name,
      segmentData: JSON.parse(JSON.stringify(this.segmentData)),
      sequence: JSON.parse(JSON.stringify(this.sequence)),
      sampleParams: JSON.parse(JSON.stringify(this.sampleParams)),
      tempo: this.tempo,
      loopBarLength: this.loopBarLength,
    };
  },
  async load({
    name,
    segmentData,
    sequence,
    sampleParams,
    tempo,
    loopBarLength,
  }) {
    if (name) this.name = name;
    if (tempo) this.tempo = tempo;
    if (loopBarLength) this.loopBarLength = loopBarLength;
    await this.setAllSamplesAndSegmentData(segmentData, sampleParams);
    this.setTimeline(sequence);
  },
};

window.addEventListener('deletesample', e => {
  sequencerModule.deleteSample(e.segment.keyMap);
});

function getStartAndEndBytes(segment, packets) {
  const startI = packets.findIndex(packet => {
    return packet.pts_time > segment.startTime;
  });
  const endI = packets.findIndex(packet => {
    return packet.pts_time > segment.endTime;
  });

  const startByte = packets[startI === 0 ? 0 : startI - 1]?.pos;
  const endByte = packets[endI - 1]?.pos;
  return {
    startByte,
    endByte,
  };
}

function createSegmentWaveformAndPassResponse(cb) {
  return response => {
    // Response gets consumed so clone it first
    const r = response.clone();
    // This context is just for the waveform image
    const ctx = new AudioContext();
    r.arrayBuffer()
      .then(b => ctx.decodeAudioData(b))
      .then(audioBuffer => {
        WaveformData.createFromAudio({
          audio_context: ctx,
          audio_buffer: audioBuffer,
          scale: 50,
        }, cb);
      });
    return response;
  };
}

function createBitPlayer(length, mapBuffer) {
  if (!window.state.sequencerModule.audioContext)
    window.state.sequencerModule.setAudioContext(new AudioContext());
  const audioCtx = window.state.sequencerModule.audioContext;
  const audioBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate * length,
    audioCtx.sampleRate,
  );
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const nowBuffering = audioBuffer.getChannelData(channel);
    for (let i = 0; i < audioBuffer.length; i++) {
      nowBuffering[i] = mapBuffer(i)
    }
  }
  let source;
  return function prepare() {
    source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    return (cueTime) => {
      source.start(cueTime);
      return prepare;
    }
  }
}

function drawWaveforms(waveform, sampleName) {
  const scaleY = (amplitude, height) => {
    const range = 256;
    const offset = 128;
    return height - ((amplitude + offset) * height) / range;
  }
  Array.from(document.querySelectorAll(`canvas[data-sample-name="${sampleName}"]`)).forEach(canvas => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = Math.max(370, waveform.length);
    ctx.beginPath();
    const channel = waveform.channel(0);
    // Loop forwards, drawing the upper half of the waveform
    for (let x = 0; x < waveform.length; x++) {
      const val = channel.max_sample(x);
      ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
    }
    // Loop backwards, drawing the lower half of the waveform
    for (let x = waveform.length - 1; x >= 0; x--) {
      const val = channel.min_sample(x);
      ctx.lineTo(x + 0.5, scaleY(val, canvas.height) + 0.5);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  })
}

function fetchAndPrepareSample(sampleName, trackUrl, startByte, endByte) {
  return createFetchPlayer(
    { url: trackUrl, range: `bytes=${startByte}-${endByte}` },
    createSegmentWaveformAndPassResponse((e, waveform) => {if (e) throw e; drawWaveforms(waveform, sampleName)}),
    () => window.dispatchEvent(Object.assign(playEvent, { sampleName })),
  );
}

// PLAYER
export function createFetchPlayer({ url, range }, responseHandler, onPlay) {
  if (!window.state.sequencerModule.audioContext)
    window.state.sequencerModule.setAudioContext(new AudioContext());
  const context = window.state.sequencerModule.audioContext;
  return fetch(url, {
    headers: new Headers({ Range: range || 'bytes=0-' }),
  })
  .then(responseHandler)
  .then(res => res.arrayBuffer())
  .then(buffer => context.decodeAudioData(buffer))
  .then(async audioBuffer => {
    return function prepare() {
      const source = context.createBufferSource();
      const gainNode = context.createGain();
      const duration = audioBuffer.duration;
      source.buffer = audioBuffer;
      source.connect(gainNode);
      gainNode.connect(context.destination);
      let start = function(startTime, endTime, sampleParams = { detune: 0, gain: 1 }) {
        onPlay();
        if (typeof sampleParams.gain === 'number') {
          gainNode.gain.value = sampleParams.gain;
        }
        if (typeof sampleParams.detune === 'number') {
          source.detune.value = sampleParams.detune;
        }
        source.start(startTime /*, cueStart */);
        if (endTime) source.stop(endTime);
        return prepare;
      };
      start.duration = duration;
      return start;
    };
  }).catch(e => {
    console.log(`Error in createFetchPlayer deconding: `, e)
  });
}

