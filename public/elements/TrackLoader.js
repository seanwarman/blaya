import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';
import ZoomPlugin from '../node_modules/wavesurfer.js/dist/plugins/zoom.esm.js'
import Minimap from '../node_modules/wavesurfer.js/dist/plugins/minimap.esm.js'
import RegionsPlugin from '../node_modules/wavesurfer.js/dist/plugins/regions.esm.js'
import '../node_modules/peaks.js/dist/peaks.js';

import * as dom from '../helpers/dom';

let options = {};

const MIN_PIX_PER_SEC = 30;

export function fetchPackets(url) {
  return fetch('/packets/' + url)
    .then(r => r.json())
    .then(data => {
      window.state.sequencerModule.setPackets(data.packets);
    });
}

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
  document.getElementById('play-pause-track-loader').addEventListener('click', () => {
    if (player.isPlaying()) {
      player.pause()
    } else {
      player.play()
    }
  })
  peaks.on('player.playing', () => {
    document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = true
  });
  peaks.on('player.pause', () => {
    document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  });
}

function zoomEvents(peaks, zoomview) {
  const { zoom } = peaks;
  zoom.setZoom(200);
  const incr = 15;

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
  const italic = document.getElementById('italic-track-loader')
  if (italic.dataset.selectorActive === 'true') {
    peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
    peaks.views.getView('zoomview').enableSeek(false);
  } else {
    peaks.views.getView('zoomview').setWaveformDragMode('scroll')
    peaks.views.getView('zoomview').enableSeek(true);
  }

  peaks.views.getView('zoomview').enableSegmentDragging(true)

  const { segments, player } = peaks
  let playingSegment = false;
  peaks.on('segments.click', e => {
    playingSegment = true;
    player.playSegment(e.segment);
  })
  peaks.on('segments.exit', (e) => {
    if (!playingSegment) return;
    const { segment } = e
    const button = document.getElementById('loop-region')
    if (button.dataset.loopRegion === 'true') {
      player.seek(segment.startTime)
    } else {
      player.pause()
      playingSegment = false;
    }
  })
  peaks.on('segments.mouseleave', () => {
    const italic = document.getElementById('italic-track-loader')
    if (italic.dataset.selectorActive === 'true') {
      peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
    }
  })
  peaks.on('segments.mouseenter', () => {
    peaks.views.getView('zoomview').setWaveformDragMode('scroll')
  })
  document.getElementById('italic-track-loader').addEventListener('click', () => {
    if (italic.dataset.selectorActive === 'true') {
      peaks.views.getView('zoomview').setWaveformDragMode('scroll')
      peaks.views.getView('zoomview').enableSeek(true);
      italic.dataset.selectorActive = false
    } else {
      peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
      peaks.views.getView('zoomview').enableSeek(false);
      italic.dataset.selectorActive = true
    }
  })
  let segmentColourIteration = 0;
  peaks.on('segments.add', e => {
    const { segments } = e;
    const [segment] = segments;
    console.log(`@FILTER segment:`, segment)
    // peaks.segments.getSegments().map((s,i) => { s.update({ labelText: '' }); });
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
    segment.update(
      {
        labelText: window.state.stepRecordModule.keysToMapNumbers[segment.pid].toUpperCase(),
        color: compStyle.getPropertyValue('background-color'),
        className,
      }
    );
    segmentColourIteration++
    if (segmentColourIteration+1 > themeColours.length) {
      segmentColourIteration = 0;
    }
  });
  peaks.on('segments.dragend', e => {
    if (e.segment.startTime === e.segment.endTime) {
      peaks.segments.removeById(e.segment.id);
      return
    }
    window.state.sequencerModule.updateCurrentSegment(e.segment, trackUrl);
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

let wavesurfer;

export default function TrackLoader(trackUrl, initFinished = () => {}) {
  fetchPackets(trackUrl);
  const mediaUrl = '/load-track/' + trackUrl;

  if (wavesurfer) {
    wavesurfer.destroy();
  }

  console.log(`@FILTER RegionsPlugin:`, RegionsPlugin)
  const player = WaveSurfer.create({
    container: document.getElementById('zoomview-container'),
    waveColor: '#353535',
    // progressColor: 'rgb(200, 0, 200)',
    cursorColor: '#555555',
    height: 150,
    hideScrollbar: true,
    autoScroll: false,
    url: mediaUrl,
    // interact: false,
    plugins: [
      Minimap.create({
        height: 20,
        waveColor: '#98b5a8c9',
        progressColor: '#98b5a8c9',
        cursorWidth: 0,
        overlayColor: '#47a9755c',
        interact: false,
      }),
    ],
  });
  player.registerPlugin(
    ZoomPlugin.create({
      scale: 0.4,
      maxZoom: 2000,
    }),
  )
  const wsRegions = player.registerPlugin(
    RegionsPlugin.create()
  )
  wsRegions.enableDragSelection({
    color: '#47a9755c',
  })

  wsRegions.on('region-clicked', (region, e) => {
    e.stopPropagation()
    region.play()
  })
  wsRegions.on('region-out', (region) => {
    const button = document.getElementById('loop-region')
    if (button.dataset.loopRegion === 'true') {
      region.play()
    } else {
      player.stop()
    }
  })
  player.on('click', () => {
    const regions = wsRegions.getRegions()
    regions.forEach(r => r.remove())
    player.play()
  })
  wsRegions.on('region-created', region => {
    const regions = wsRegions.getRegions()
    regions.forEach(r => {
      if (r === region) return;
      r.remove()
    })
  })
  // wavesurfer = WaveSurfer.create({
  //   container: '#zoomview-container',
  //   waveColor: '#4F4A85',
  //   progressColor: '#383351',
  //   url: mediaUrl,
  // });
  // // const wsRegions = wavesurfer.registerPlugin(RegionsPlugin.create())
  // wavesurfer.registerPlugin(
  //   ZoomPlugin.create({
  //     // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
  //     scale: 0.5,
  //     // Optionally, specify the maximum pixels-per-second factor while zooming
  //     maxZoom: 100,
  //   }),
  // );
  player.on('decode', () => {
    console.log(`@FILTER done`)
    initFinished();
  });
}
