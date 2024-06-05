import { PolarFFTWASM } from '../libraries/essentia.polarFFT.module.js';
import { OnsetsWASM } from '../libraries/essentia.onsets.module.js';
import { getStartAndEndBytes } from '../helpers/utils';
import { reduceSegmentData } from './segmentReducers';
import { getSegmentSampleData } from '../elements/TrackLoader';

const frameSize = 512;
const hopSize = 256;

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

function computeOnsets(float32Arr, {
  odfs = ['hfc', 'complex'],
  odfsWeights = [0.5, 0.5],
  sampleRate = 48000,
  sensitivity = 0.1,
}) {
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

let timeout;

export const trackSliceModule = {
  segmentQueue: [],
  addSegmentToQueue(segment, trackUrl) {
    this.segmentQueue.push(segment);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      const keyMaps = window.state.stepRecordModule.getNextFreeKeyMapRange(this.segmentQueue.length);
      this.segmentQueue.map((segment, i) => {
        const keyMap = keyMaps[i];
        segment.update(getSegmentSampleData(keyMap));
        const sampleName = keyMap;
        const { startByte, endByte } = getStartAndEndBytes(segment, window.state.sequencerModule.packets);
        window.state.sequencerModule.setSegmentDataAndSample(sampleName, segment, trackUrl, startByte, endByte);
      });
      this.segmentQueue = [];
    }, 10);
  },
  addPoints({ trackUrl, startByte = '0', endByte = '', startTime = undefined }) {
    return this.fetchBeatSamplePositions(trackUrl, 'bytes=' + startByte + '-' + endByte, startTime).then(times => {

      times.reduce((pair, time) => {
        const [segment, segments] = pair;
        if (segment.startTime) {
          return [
            { startTime: time, editable: true },
            [...segments, { ...segment, endTime: time }],
          ];
        }
        return [{ editable: true, startTime: time }, segments];
      }, [{}, []])[1]
        .map(segment => window.state.trackLoader.segments.add(segment));

      // window.state.trackLoader.points.add(times.map(time => ({
      //   time,
      //   color: '#00ff00',
      // })));
    });
  },
  get sensitivity() {
    return document.querySelector('input#track-loader-track-slice-sensitivity')?.value || 0.1;
  },
  set sensitivity(v) {
    const range = document.querySelector('input#track-loader-track-slice-sensitivity');
    if (range) {
      range.value = v;
    }
  },
  fetchBeatSamplePositions(url, range, startTime) {
    const context = new AudioContext();
    return fetch(url, {
      headers: new Headers({ Range: range || 'bytes=0-' }),
    })
      .then(res => res.arrayBuffer())
      .then(buffer => context.decodeAudioData(buffer))
      .then(audioBuffer => computeOnsets(audioBuffer.getChannelData(0), {
        sensitivity: this.sensitivity,
      }))
      .then(onsets => Array.from(onsets).map(time => {
        return time + (startTime || 0);
      }))
  },
  segmentRangeData: {},
  setSegmentDataForRangeAndAddSamples(sampleName, segment, trackUrl, startByte, endByte) {
    this.segmentRangeData = reduceSegmentData(
      this.segmentRangeData,
      sampleName,
      segment,
      trackUrl,
      startByte,
      endByte
    );
    return this.addPoints(this.segmentRangeData.RANGE).then(() => {
      this.segmentRangeData = {};
    });
  },
};
