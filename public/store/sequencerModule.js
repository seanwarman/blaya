import Samples from '../elements/Samples';
import '../node_modules/waveform-data/dist/waveform-data.js';

export function fetchPackets(url) {
  return fetch(url)
    .then(r => r.json())
    .then(data => {
      console.log(`@FILTER data.packets:`, data.packets);
      window.state.sequencerModule.setPackets(data.packets);
    });
}

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
  packets: null,
  setPackets(packets) {
    this.packets = packets;
  },
  currentSegment: null,
  updateCurrentSegment(segment) {
    this.currentSegment = segment;

    const startI = this.packets.findIndex(packet => {
      return packet.pts_time > segment.startTime;
    });
    const endI = this.packets.findIndex(packet => {
      return packet.pts_time > segment.endTime;
    });

    const startByte = this.packets[startI === 0 ? 0 : startI - 1]?.pos;
    const endByte = this.packets[endI - 1]?.pos;

    createFetchPlayer({
      url: window.TRACK_URL,
      range: `bytes=${startByte}-${endByte}`,
    }, response => {
      const r = response.clone();
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
            drawWaveform(waveform);
          });
        });
      return response;
    }).then(prepare => {
      this.setSamples({
        loop: prepare(),
      });
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
