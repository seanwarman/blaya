import '../node_modules/peaks.js/dist/peaks.js';
import * as dom from '../helpers/dom';
import { getStartAndEndBytes } from '../helpers/utils';

let options = {};

export function fetchPackets(url) {
  return fetch('/packets/' + url)
    .then(r => r.json())
    .then(data => {
      window.state.sequencerModule.setPackets(data.packets);
    });
}

// const themeColours = [
//   '#70FFA1',
//   '#FFE370',
//   '#7075FF',
//   '#70A2FF',
//   '#9A70FF',
//   '#7075FF',
//   '#70CFFF',
//   '#C970FF',
//   '#A3A6FF',
//   '#8499BF',
//   '#9584BF',
//   '#84ABBF',
//   '#A984BF',
//   '#D6D8FF',
//   '#796E80',
//   '#FF7570',
//   '#8184D5',
//   '#83CC9C',
//   '#CCBE83',
//   '#CC8583',
//   '#8385AA',
//   '#819989',
//   '#999481',
//   '#998181',
//   '#6E6E80',
//   '#4E6656',
//   '#66614E',
//   '#664E4E',
//   '#3B3C55',
//   '#1D3324',
//   '#332F1D',
//   '#331D1D',
// ];

const themeColours = [
  'red',
  'blue',
  'purple',
  'seagreen',
  'firebrick',
  'slateblue',
  'mediumblue',
  'rebeccapurple',
  'crimson',
  'navy',
  'lightseagreen',
  'darkviolet',
  'darkblue',
  'darkslategrey',
  'darkmagenta',
]

function playerEvents(peaks) {
  const { player } = peaks;
  // document.getElementById('play-pause-track-loader').addEventListener('click', () => {
  //   if (player.isPlaying()) {
  //     player.pause()
  //   } else {
  //     player.play()
  //   }
  // })
  // peaks.on('player.playing', () => {
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = true
  // });
  // peaks.on('player.pause', () => {
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  // });
}

let segmentColourIteration = 0;
function segmentColour() {
  function rndm() {
    const min = 0;
    const max = 48;
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const className = 'sample-colour-' + rndm();
  const colourPicker = document.getElementById('colour-picker');
  const newColourPicker = dom.div({
    id: 'colour-picker',
    className,
    style: 'display:none',
  });
  if (colourPicker) {
    colourPicker.replaceWith(newColourPicker);
  } else {
    document.body.prepend(newColourPicker);
  }
  const compStyle = window.getComputedStyle(document.getElementById('colour-picker'));
  segmentColourIteration++
  if (segmentColourIteration+1 > themeColours.length) {
    segmentColourIteration = 0;
  }
  return { color: compStyle.getPropertyValue('background-color'), className };
}

export function getSegmentSampleData(keyMap) { 
  const { color, className } = segmentColour();
  return {
    labelText: keyMap,
    keyMap,
    color,
    className,
  };
}

export function onAddSegmentCreateRangeForSlices(e) {
  const { segments } = e;
  const [segment] = segments;
  segment.update({
    // labelText: 'Slicing...',
    keyMap: 'RANGE',
    color: '#00000033',
    className: 'range-segment',
  });
}

function zoomEvents(peaks, zoomview) {
  const { zoom } = peaks;
  zoom.setZoom(options.zoomLevels.findIndex(n => n === 256));
  zoomview.setZoom({ seconds: 'auto' });
  const incr = 50;

  document.getElementById('zoom-in-track-loader').addEventListener('click', () => {
    const index = zoom.getZoom()
    if (index - incr > -1) {
      zoom.setZoom(index - incr)
    }
  })
  document.getElementById('zoom-out-track-loader').addEventListener('click', () => {
    const index = zoom.getZoom()
    if (index + incr <= options.zoomLevels.length) {
      zoom.setZoom(index + incr)
    }
  })

  let accumulatedDelta = 0;
  const zoomSpeed = 0.2;
  document.getElementById('zoomview-container').onwheel = e => {
    const deltaThreshold = 2;
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
      return;
    }
    e.preventDefault()
    accumulatedDelta += Math.round(e.deltaY * zoomSpeed);

    if (deltaThreshold === 0 || Math.abs(accumulatedDelta) >= deltaThreshold) {
      requestAnimationFrame(() => {
        const view = peaks.views.getView('zoomview');
        const container = document.getElementById('zoomview-container')

        // Work out what position the pointer is at in samples
        // Then scroll the wave to keep it at the same point
        //
        // First find out how many smps per px we're at
        const smpsPerPx = options.zoomLevels[zoom.getZoom()];
        // Then find the container's width in px
        const containerWidthPx = container.clientWidth;
        // Then the pointer's x position in px from the center of the container
        // (negative numbers are to the left)
        const pointerPositionPx = e.clientX - (containerWidthPx / 2);
        // The pointer's position in samples
        const pointerPositionInSmps = smpsPerPx * pointerPositionPx;
        // The next smps per px after zooming
        const newSmpsPerPx = options.zoomLevels[zoom.getZoom() + accumulatedDelta];
        // Recalibrate the pointer position to match the new sample rate
        const newPointerPositionPx = pointerPositionInSmps / newSmpsPerPx;
        // Minus off the the old pointer position to find the difference...
        const pxToScrollTo = newPointerPositionPx - pointerPositionPx;

        if (!isNaN(pxToScrollTo)) {
          zoom.setZoom(zoom.getZoom() + accumulatedDelta);
          view.scrollWaveform({ pixels: pxToScrollTo });
        }
        accumulatedDelta = 0;
      });
    }
  }
}

function segmentEvents(peaks, trackUrl) {
  window.addEventListener('deletesample', e => {
    const { segment } = e;
    peaks.segments.removeById(segment.id);
  });
  const italic = document.getElementById('italic-track-loader')
  if (document.body.dataset.selectorActive === 'true') {
    peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
    peaks.views.getView('zoomview').enableSeek(false);
  } else {
    peaks.views.getView('zoomview').setWaveformDragMode('scroll')
    peaks.views.getView('zoomview').enableSeek(true);
  }

  peaks.views.getView('zoomview').enableSegmentDragging(true)
  peaks.views.getView('zoomview').setSegmentDragMode('no-overlap');

  const { segments, player } = peaks
  let playingSegment = false;
  peaks.on('segments.click', e => {
    playingSegment = true;
    player.playSegment(e.segment);
  })
  peaks.on('segments.exit', (e) => {
    if (!playingSegment) return;
    player.pause()
    playingSegment = false;
  })
  peaks.on('segments.mouseleave', () => {
    const italic = document.getElementById('italic-track-loader')
    if (document.body.dataset.selectorActive === 'true') {
      peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
    }
  })
  peaks.on('segments.mouseenter', () => {
    peaks.views.getView('zoomview').setWaveformDragMode('scroll')
  })
  document.getElementById('italic-track-loader').addEventListener('click', () => {
    if (document.body.dataset.selectorActive === 'true') {
      peaks.views.getView('zoomview').setWaveformDragMode('scroll')
      peaks.views.getView('zoomview').enableSeek(true);
      document.body.dataset.selectorActive = false
    } else {
      peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
      peaks.views.getView('zoomview').enableSeek(false);
      document.body.dataset.selectorActive = true
    }
  });
  peaks.on('zoomview.dblclick', (e) => {
    const { time } = e;
    const points = peaks.points.getPoints();
    points.sort((a,b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;
      return 0;
    });
    const startIndex = points.findLastIndex(p => p.time < time);
    const endIndex = points.findIndex(p => p.time > time);
    if (points[endIndex]) {
      peaks.segments.add({ editable: true, startTime: points[startIndex]?.time || 0, endTime: points[endIndex]?.time });
    }
  });
  peaks.on('segments.add', e => {
    const { segments } = e;
    const [segment] = segments;
    if (window.state.sliceMode === 'on') {
      onAddSegmentCreateRangeForSlices(e);
    } else if (window.state.sliceMode === 'slicing') {
      window.state.trackSliceModule.addSegmentToQueue(segment, trackUrl);
    } else if (window.state.sliceMode === 'off') {
      segment.update(
        getSegmentSampleData(window.state.stepRecordModule.getNextFreeKeyMap())
      );
    }
  });
  peaks.on('segments.dragend', e => {
    if (e.segment.startTime === e.segment.endTime) {
      peaks.segments.removeById(e.segment.id);
      return
    }
    const sampleName = e.segment.keyMap;
    const { startByte, endByte } = getStartAndEndBytes(e.segment, window.state.sequencerModule.packets);

    if (sampleName !== 'RANGE') {
      window.state.sequencerModule.setSegmentDataAndSample(sampleName, e.segment, trackUrl, startByte, endByte);
    }
  });
  peaks.on('segments.insert', e => {
    if (e.segment.startTime === e.segment.endTime) {
      peaks.segments.removeById(e.segment.id);
      return
    }
    const sampleName = e.segment.keyMap;
    const { startByte, endByte } = getStartAndEndBytes(e.segment, window.state.sequencerModule.packets);

    if (window.state.sliceMode === 'on') {
      window.state.sliceMode = 'slicing';
      window.state.trackSliceModule.setSegmentDataForRangeAndAddSamples(
        sampleName,
        e.segment,
        trackUrl,
        startByte,
        endByte
      ).then(() => {
        window.state.sliceMode = 'on';
        peaks.segments.removeById(e.segment.id);
      });
    }
  });
}

// TODO remove, not used
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

// TODO remove, not used
export function Player(audioBuffer) {
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

const MIN_PIX_PER_SEC = 50;

export default function TrackLoader(trackUrl, initFinished = () => {}) {
  fetchPackets(trackUrl);
  const mediaUrl = '/load-track/' + trackUrl.replace('.mp3', '.dat');
  options = {
    mediaElement: document.getElementById('peaks-audio'),
    dataUri: {
      arraybuffer: mediaUrl,
    },
    emitCueEvents: true,
    zoomLevels: Array(4500).fill().map((_,i) => ((i+1) * 1)).slice(MIN_PIX_PER_SEC),
    wheelMode: 'scroll',
    scrollbar: {},
    zoomview: {
      // waveformColor: '#c801c8',
      waveformColor: '#353535',
      axisGridlineColor: 'transparent',
      autoScroll: false,
    },
    // overview: {
    //   axisGridlineColor: 'transparent',
    //   waveformColor: 'rgba(0,0,0,0.1)',
    // },
    segmentOptions: {
      overlayLabelColor: 'white',
      overlay: true,
      overlayFontSize: 13,
      overlayOffset: 4,
      markers: false,
      overlayBorderColor: '#00000000',
    },
    showAxisLabels: false,
    axisGridlineColor: 'white',
    playheadColor: 'grey',
  }


  ;(function(Peaks) {
    const zoomview = document.getElementById('zoomview-container')
    // const overview = document.getElementById('overview-container')
    const scrollbar = document.getElementById('scrollbar-container')
    options.zoomview.container = zoomview
    // options.overview.container = overview
    options.scrollbar.container = scrollbar
    Peaks.init(options, function(err, peaks) {
      if (err) {
        console.error(`Failed to initialize Peaks instance: ${err.message}`)
        return
      }
      // const overview = peaks.views.getView('overview');
      const zoomview = peaks.views.getView('zoomview');
      // overview.enableSeek(false);

      playerEvents(peaks);
      zoomEvents(peaks, zoomview);
      segmentEvents(peaks, trackUrl);
      peaks.segments.removeAll();
      // document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false;
      initFinished(peaks);
    })
  })(peaks)
}
