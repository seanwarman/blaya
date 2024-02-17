import Samples from '../elements/Samples';
//
// PLAYER
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

function createFetchPlayer(url, range) {
  if (!window.state.sequencerModule.audioContext)
    window.state.sequencerModule.setAudioContext(new AudioContext());
  const context = window.state.sequencerModule.audioContext;
  return fetch(url, {
    headers: new Headers({ Range: range || 'bytes=0-' }),
  })
  .then(res => res.arrayBuffer())
  .then(buffer => context.decodeAudioData(buffer))
  .then(async audioBuffer => {
    return function prepare() {
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      return (startTime, endTime) => {
        source.start(startTime);
        if (endTime) source.stop(endTime);
        return prepare;
      }
    };
  })
}

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
  selectedSampleName: null,
  trackLoaderSampleRate: 48000,
  setTrackLoaderSampleRate(sampleRate) {
    this.trackLoaderSampleRate = sampleRate;
  },
  audioContext: null,
  setAudioContext(audioContext) {
    this.audioContext = audioContext;
  },
  currentSegment: null,
  updateCurrentSegment(segment) {
    this.currentSegment = segment;
    const src = document.getElementById('peaks-audio')?.src;
    // Have to convert peaks audio to audio context to get this value
    const rate = this.trackLoaderSampleRate;
    createFetchPlayer(src, `bytes=${segment.startTime * rate}-${segment.endTime * rate}`).then(prepareLoop => {
      this.setSamples({ loop: prepareLoop() });
    });
  },
  setSamples(samples) {
    this.samples = {
      ...this.samples,
      ...samples,
    };
    Samples(this.samples);
  },
  samples: {},
};
