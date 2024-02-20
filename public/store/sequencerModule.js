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

export function createPlayer(url, range, cueStart, duration) {
  if (!window.state.sequencerModule.audioContext)
    window.state.sequencerModule.setAudioContext(new AudioContext());
  function _updateTrackSource(url, range) {
    return fetch(url, {
      headers: new Headers({ Range: range || 'bytes=0-' }),
    })
    .then(res => res.arrayBuffer())
    .then(buffer => window.state.sequencerModule.audioContext.decodeAudioData(buffer));
  }
  function Player(audioBuffer) {
    this.audioBuffer = audioBuffer;
    this.initBuffer = () => {
      const source = window.state.sequencerModule.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(window.state.sequencerModule.audioContext.destination);
      return source;
    };
    this.source = this.initBuffer();
    this.start = (cueTime = 0, startTime, duration) => {
      this.startTime = window.state.sequencerModule.audioContext.currentTime + startTime;
      this.source.start(cueTime, startTime, duration);
      this.playing = true;
    };
    this.seek = (time) => {
      this.startTime = window.state.sequencerModule.audioContext.currentTime - time;
      if (!this.playing) return;
      this.source.stop(0);
      this.source = this.initBuffer();
      this.source.start(0, time);
    };
    this.stop = (when) => {
      this.startTime = window.state.sequencerModule.audioContext.currentTime + when;
      this.source.stop(when || 0);
      this.playing = false;
      this.source = this.initBuffer();
    };
    this.startTime = window.state.sequencerModule.audioContext.currentTime;
    this.getCurrentTime = () => {
      return window.state.sequencerModule.audioContext.currentTime - this.startTime;
    };
    this.updateTrackSource = (url, range) => {
      _updateTrackSource(url, range)
        .then(audioBuffer => {
          this.audioBuffer = audioBuffer;
          this.source = this.initBuffer();
          return this;
        });
    };
  }
  return _updateTrackSource(url, range)
    .then(audioBuffer => {
      return new Player(audioBuffer);
    });
}

export function createFetchPlayer(url, range, cueStart, duration) {
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
        source.start(startTime, cueStart, duration);
        if (endTime) source.stop(endTime);
        return prepare;
      }
    };
  }).catch(e => {
    console.log(`Error in createFetchPlayer deconding: `, e)
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
  currentSegment: null,
  updateCurrentSegment(segment) {
    console.log(`@FILTER segment:`, segment)
    this.currentSegment = segment;

    const audioEl = document.getElementById('peaks-audio');

    const { src, duration } = audioEl;
    const bytesPerSecond = this.trackLoaderByteLength / duration;
    //
    // ** CUING SAMPLES **
    //
    // Seems like the segments coming from peaks aren't accurate enough, which
    // would be weird because I'd assume they're also using the AudioContext.
    // It's probably because peaks is using an audio element rather than
    // directly using an AudioBufferNode, might be worth checking to see how
    // low level I can get with peakss audio source. If I can have full control
    // of it I could just pull in the same node that peaks is using to trigger
    // my sample. That might also help me to get better byte values for
    // fetching as well.
    //
    // See: https://github.com/bbc/peaks.js/blob/master/doc/customizing.md#media-playback
    //
    // The peaks code needs some work before it can be fit for purpose.
    // This first method is awful for getting the right part of the clip at the
    // moment, but it's the ideal way of doing it...
    // createFetchPlayer(
    //   src,
    //   `bytes=${Math.trunc(bytesPerSecond * segment.startTime)}-${Math.trunc(bytesPerSecond * segment.endTime)}`
    // ).then((prepareLoop) => {
    //   this.setSamples({ loop: prepareLoop() });
    // });
    //
    // This way is not as bad for the first 10 seconds of the track it's pretty
    // accurate but after that it's also aweful.  Also it has to pull in the
    // full track rather than just requesting a small snippet, so really not
    // ideal...
    createFetchPlayer(
      src,
      null, // `bytes=${Math.trunc(bytesPerSecond * segment.startTime)}-${Math.trunc(bytesPerSecond * segment.endTime)}`
      segment.startTime,
      segment.endTime - segment.startTime,
    ).then((prepareLoop) => {
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
