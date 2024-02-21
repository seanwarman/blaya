import Samples from '../elements/Samples';
import * as WaveFormData from '../node_modules/waveform-data/dist/waveform-data.js';

function drawWaveform(waveform) {
  const scaleY = (amplitude, height) => {
    const range = 256;
    const offset = 128;

    return height - ((amplitude + offset) * height) / range;
  }

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
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
}
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

export function Player(audioBuffer) {
  this.audioBuffer = audioBuffer;
  this.initBuffer = () => {
    const source = window.state.sequencerModule.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(window.state.sequencerModule.audioContext.destination);
    return source;
  };
  this.source = this.initBuffer();
  this.trigger = (cueTime = 0, startTime, duration) => {
    this.startTime = window.state.sequencerModule.audioContext.currentTime + startTime;
    this.source.start(cueTime, startTime, duration);
    if (duration) {
      this.stop(duration + cueTime);
    }
  };
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
  this.stop = (when = 0) => {
    this.startTime = this.startTime + when;
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

export function createPlayer(url, range, cueStart, duration) {
  if (!window.state.sequencerModule.audioContext)
    window.state.sequencerModule.setAudioContext(new AudioContext());
  function _updateTrackSource(url, range) {
    return fetch(url, {
      headers: new Headers({
        'content-type': 'audio/mpeg',
        Range: range || 'bytes=0-',
      }),
    })
    .then(res => res.arrayBuffer())
    .then(buffer => window.state.sequencerModule.audioContext.decodeAudioData(buffer));
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
  // return fetch(url, {
  //   headers: new Headers({ Range: range || 'bytes=0-' }),
  // })
  return fetch(url)
  .then(res => res.arrayBuffer())
  .then(buffer => context.decodeAudioData(buffer))
  .then(async audioBuffer => {
    return function prepare() {
      WaveformData.createFromAudio({
        audio_context: context,
        audio_buffer: audioBuffer,
        scale: 50,
      }, (error, waveform) => {
        console.log(`@FILTER error:`, error)
        console.log(`@FILTER waveform:`, waveform)
        drawWaveform(waveform);
      });
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
  currentSegment: null,
  updateCurrentSegment(segment) {
    console.log(`@FILTER segment:`, segment)
    this.currentSegment = segment;

    ////
    //// ** CUING SAMPLES **
    ////
    // I can get byte information from ffprobe, a binary bundled with ffmpeg:
    // $ cat track.mp3 | ffprobe -show_entries packet=pos,pts_time -
    // 
    // Output:
    //
    // ...
    // pts_time=233.325714
    // pos=7640153
    // [/PACKET]
    // [PACKET]
    // pts_time=233.351837
    // pos=7640518
    // [/PACKET]
    // [PACKET]
    // pts_time=233.377959
    // pos=7640935
    // [/PACKET]
    // [PACKET]
    // pts_time=233.404082
    // pos=7641352
    // [SIDE_DATA]
    // [/SIDE_DATA]
    // [/PACKET]
    // ...
    //
    // When the trackloader loads in the track, do another call which gets the
    // track from s3 again but this time pipes it into the above ffprobe
    // command and sends the client a list of all times and byte positions for
    // the file.
    createPlayer('/track.mp3', 'bytes=410642-426093').then(samplePlayer => {
      console.log(`@FILTER samplePlayer:`, samplePlayer)
      WaveformData.createFromAudio({
        audio_context: this.audioContext,
        audio_buffer: samplePlayer.source.buffer,
        scale: 50,
      }, (error, waveform) => {
        console.log(`@FILTER error:`, error)
        console.log(`@FILTER waveform:`, waveform)
        drawWaveform(waveform);
      });
      this.setSamples({ loop: (cueTime, stopTime) => {
        samplePlayer.trigger(cueTime, 0, stopTime);
      }});
    });
  },
  setSamples(samples) {
    this.samples = {
      ...this.samples,
      ...samples,
    };
    // Add samples to ui
    Samples(this.samples);
  },
  samples: {},
};
