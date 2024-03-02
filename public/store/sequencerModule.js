import Samples from '../elements/Samples';
import { START_DATE_PARAMS } from '../constants';
import '../node_modules/waveform-data/dist/waveform-data.js';

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

export const sequencerModule = {
  unlocked: false,
  isPlaying: false,       // Are we currently playing?
  isRecording: false,
                          //
  startTime: undefined,   // The start time of the entire sequence.
                          //
  currentStep: 0,         // What note is currently last scheduled?
  tempo: 120.0,           // tempo (in beats per minute)
  lookahead: 10.0,        // How frequently to call scheduling function 
                          // (in milliseconds)
  scheduleAheadTime: 0.01,// This is calculated from lookahead, and overlaps 
                          // with next interval (in case the timer is late)
  nextNoteTime: 0.0,      // when the next note is due.
  noteResolution: 256,     //
  last16thNoteDrawn: -1,  // the last "box" we drew on the screen
  notesInQueue: [],       // the notes that have been put into the web audio,
                          // and may or may not have played yet. {note, time}
                          //
  timerWorker: null,      // The Web Worker used to fire timer messages
                          //
  loopBarLength: 1,
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
  beatPerDateMultiple: 3.1,
  setSequence(currentStep, sampleName) {
    if (!this.isPlaying) return;
    const step = { id: this.makeId(), index: currentStep, name: sampleName, endTime: 1, delay: 0 };
    setTimeout(() => {
      if (this.sequence[currentStep]) {
        this.sequence[currentStep].push(step);
      } else {
        this.sequence[currentStep] = [step]
      }
    }, 100);
    const selectedSample = document.querySelector(`#samples-container .item[data-name="${sampleName}"]`);
    const waveImgCanvas = this.cloneCanvas(selectedSample.querySelector('canvas'));
    waveImgCanvas.style = 'height:30px;margin-left:-12px';
    this.timeline.itemsData.add({
      className: selectedSample.dataset.colourClass,
      name: selectedSample.dataset.name,
      content: waveImgCanvas,
      id: step.id,
      step,
      index: step.index,
      start: vis.moment(...START_DATE_PARAMS).add(currentStep * this.beatPerDateMultiple, this.beatPerDateResolution),
      end: vis.moment(...START_DATE_PARAMS).add(((currentStep+(step.endTime*8)) * this.beatPerDateMultiple), this.beatPerDateResolution),
    });
  },
  // vis.Timeline
  timeline: {},
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
  sampleCount: 1,
  setSamples(samples) {
    this.samples = {
      ...this.samples,
      ...samples,
    };
    window.state.stepRecordModule.setKeymaps(this.samples);
    // Add samples to ui
    Samples(this.samples, this.segmentData);
  },
  updateCurrentSegment(segment, mediaUrl) {
    const sampleName = segment.id;
    this.segmentData = {
      ...this.segmentData,
      [segment.id]: {
        color: segment.color,
        className: segment.className,
      },
    };
    const startI = this.packets.findIndex(packet => {
      return packet.pts_time > segment.startTime;
    });
    const endI = this.packets.findIndex(packet => {
      return packet.pts_time > segment.endTime;
    });

    const startByte = this.packets[startI === 0 ? 0 : startI - 1]?.pos;
    const endByte = this.packets[endI - 1]?.pos;
    createFetchPlayer({
      url: mediaUrl,
      range: `bytes=${startByte}-${endByte}`,
    }, response => {
      // Set samples so the canvas exists for drawWaveform
      if (!this.samples[sampleName]) {
        this.setSamples({
          [sampleName]: null,
        });
      }
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
          }, (error, waveform) => {
            if (error) throw error;
            drawWaveform(waveform, sampleName);
          });
        });
      return response;
    }).then(prepare => {
      this.setSamples({
        [sampleName]: prepare(),
      });
    });

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
    if (this.sequence[currentStep]?.length) {
      for (let i=0;i<this.sequence[currentStep].length;i++) {
        const step = this.sequence[currentStep][i];
        const startTime = time + (this.getStepLength() * step.delay);
        if (this.samples[step.name]) {
          const prepare = this.samples[step.name](startTime, startTime + step.endTime);
          this.samples[step.name] = prepare();
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
  cloneCanvas(oldCanvas) {
    //create a new canvas
    var newCanvas = oldCanvas.cloneNode(true);
    var context = newCanvas.getContext('2d');
    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);
    //return the new canvas
    return newCanvas;
  },
};

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

function drawWaveform(waveform, sampleName) {
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

// PLAYER
export function createFetchPlayer({ url, range, cueStart, duration }, responseHandler) {
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
      source.buffer = audioBuffer;
      source.connect(context.destination);
      return (startTime, endTime) => {
        source.start(startTime, cueStart, duration);
        if (endTime) source.stop(endTime);
        return prepare;
      }
    };
  }).catch(e => {
    console.log(`Error in createFetchPlayer deconding: `, e)
  });
}

