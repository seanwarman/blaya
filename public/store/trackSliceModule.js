import { PolarFFTWASM } from '../libraries/essentia.polarFFT.module.js';
import { OnsetsWASM } from '../libraries/essentia.onsets.module.js';

const frameSize = 512;
const hopSize = 256;
const odfs = ['hfc', 'complex'];
const odfsWeights = [0.5, 0.5];
const sampleRate = 48000;
const sensitivity = 0.1;

function computeFFT(signal, essentia) {
  let polarFrames = []; // clear frames from previous computation
  // algo instantiation
  let PolarFFT = new PolarFFTWASM.PolarFFT(frameSize);
  // frame cutting, windowing
  let frames = essentia.FrameGenerator(signal, frameSize, hopSize);

  for (let i = 0; i < frames.size(); i++) {
    let currentFrame = frames.get(i);

    let windowed = essentia.Windowing(currentFrame).frame;

    // PolarFFT
    const polar = PolarFFT.compute(essentia.vectorToArray(windowed)); // default: normalized true, size 1024, type 'hann'

    // save polar frames for reuse
    polarFrames.push(polar);
  }

  frames.delete();
  PolarFFT.shutdown();
  return polarFrames;
}

function computeOnsets(float32Arr) {
  return EssentiaWASM().then(essentiaWasm => {
    const E = new Essentia(essentiaWasm);
    const vector = E.arrayToVector(float32Arr);

    const polarFrames = computeFFT(float32Arr, E);

    const alpha = 1 - sensitivity; 
    const Onsets = new OnsetsWASM.Onsets(alpha, 5, sampleRate / hopSize, 0.02);

    const odfMatrix = [];
    for (const func of odfs) {
      const odfArray = polarFrames.map( (frame) => {
        return E.OnsetDetection(
          E.arrayToVector(E.vectorToArray(frame.magnitude)), 
          E.arrayToVector(E.vectorToArray(frame.phase)), 
          func, sampleRate).onsetDetection;
      });
      odfMatrix.push(Float32Array.from(odfArray));
    }

    const onsetPositions = Onsets.compute(odfMatrix, odfsWeights).positions;
    Onsets.shutdown();

    let onsets;
    if (onsetPositions.size() == 0) {
      onsets = new Float32Array(0)
    }
    else {
      onsets = E.vectorToArray(onsetPositions); 
    }

    return onsets;
  });
}

export const trackSliceModule = {
  addPoints({ trackUrl, startByte = '0', endByte = '', startTime = undefined }) {
    this.fetchBeatSamplePositions(trackUrl, 'bytes=' + startByte + '-' + endByte, startTime).then(times => {
      window.state.trackLoader.points.add(times.map(time => ({
        time,
        color: '#00ff00',
      })));
    });
  },
  fetchBeatSamplePositions(url, range, startTime) {
    const context = new AudioContext();
    return fetch(url, {
      headers: new Headers({ Range: range || 'bytes=0-' }),
    })
      .then(res => res.arrayBuffer())
      .then(buffer => context.decodeAudioData(buffer))
      .then(audioBuffer => computeOnsets(audioBuffer.getChannelData(0)))
      .then(onsets => Array.from(onsets).map(time => {
        return time + (startTime || 0);
      }))
  },
};
