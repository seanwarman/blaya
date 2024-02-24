import '../node_modules/peaks.js/dist/peaks.js';

const MIN_PIX_PER_SEC = 30;
let scale = 0.5,
    maxZoom = undefined,
    deltaThreshold = 2,
    accumulatedDelta = 0;

function calculateNewZoom(oldZoom, delta) {
  const newZoom = Math.max(0, oldZoom + delta * scale)
  return typeof maxZoom === 'undefined' ? newZoom : Math.min(newZoom, maxZoom)
}

export function fetchPackets(url) {
  return fetch(url)
    .then(r => r.json())
    .then(data => {
      window.state.sequencerModule.setPackets(data.packets);
    });
}

const options = {
  emitCueEvents: true,
  zoomLevels: Array(4500).fill().map((_,i) => ((i+1) * 1)).slice(MIN_PIX_PER_SEC),
  wheelMode: 'scroll',
  scrollbar: {},
  zoomview: {
    waveformColor: '#c801c8',
    axisGridlineColor: 'transparent',
    autoScroll: false,
  },
  overview: {
    axisGridlineColor: 'transparent',
    waveformColor: 'rgba(0,0,0,0.1)',
  },
  segmentOptions: {
    overlay: true,
    overlayOffset: 0,
    markers: false,
  },
  mediaElement: document.getElementById('peaks-audio'),
  webAudio: {
    audioContext: new AudioContext(),
  },
  showAxisLabels: false,
  axisGridlineColor: 'white',
  playheadColor: 'grey',
  player: null,
}

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

function zoomEvents(peaks) {
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

  document.getElementById('zoomview-container').onwheel = e => {
    if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) {
      return;
    }
    e.preventDefault()
    accumulatedDelta += -Math.round(e.deltaY * 0.1);

    if (deltaThreshold === 0 || Math.abs(accumulatedDelta) >= deltaThreshold) {
      requestAnimationFrame(() => {
        zoom.setZoom(zoom.getZoom() + accumulatedDelta);
        accumulatedDelta = 0;
      });
    }

    // const view = peaks.views.getView('zoomview');
    // const pageX = e.pageX - (window.innerWidth / 2)
    // const scroll = () => Math.round(pageX * 0.009);
    // requestAnimationFrame(() => {
    //   view.scrollWaveform({ pixels: scroll() });
    // });

  }
}

function segmentEvents(peaks, mediaUrl) {
  const italic = document.getElementById('italic-track-loader')
  if (italic.dataset.selectorActive === 'true') {
    peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
  } else {
    peaks.views.getView('zoomview').setWaveformDragMode('scroll')
  }

  peaks.views.getView('zoomview').enableSegmentDragging(true)

  const { segments, player } = peaks

  peaks.on('segments.click', e => {
    const { segment } = e
    player.play()
    player.seek(segment.startTime)
  })
  peaks.on('segments.exit', (e) => {
    const { segment } = e
    const button = document.getElementById('loop-region')
    if (button.dataset.loopRegion === 'true') {
      player.seek(segment.startTime)
    } else {
      player.pause()
      player.seek(segment.startTime)
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
      italic.dataset.selectorActive = false
    } else {
      peaks.views.getView('zoomview').setWaveformDragMode('insert-segment')
      italic.dataset.selectorActive = true
    }
  })
  // peaks.on('segments.add', e => {
  //   segments
  //     .getSegments()
  //     .slice(0, -1)
  //     .forEach((seg) => segments.removeById(seg.id))
  // })
  peaks.on('segments.dragend', e => {
    window.state.sequencerModule.updateCurrentSegment(e.segment, mediaUrl);
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

// TODO remove, not used
function createCustomPlayer(mediaUrl) {
  return {
    samplePlayer: null,
    startTime: 0,
    timeId: null,
    init(eventEmitter) {
      return createPlayer(mediaUrl).then(samplePlayer => {
        this.eventEmitter = eventEmitter;
        this.samplePlayer = samplePlayer;
        this.eventEmitter.emit('player.canplay');
      });
    },
    destroy:        function() {  },
    play() {
      this.samplePlayer.start(0, 0);
      this.eventEmitter.emit('player.playing', this.getCurrentTime());
    },
    pause() {
      this.samplePlayer.stop(0);
      this.eventEmitter.emit('player.pause', this.getCurrentTime());
    },
    seek(time) {
      this.seeking = true;
      this.samplePlayer.seek(time);
      this.seeking = false;
      this.eventEmitter.emit('player.seeked', this.getCurrentTime());
      this.eventEmitter.emit('player.timeupdate', this.getCurrentTime());
    },
    isPlaying() {
      return this.samplePlayer.playing;
    },
    isSeeking() {
      return this.seeking;
    },
    getCurrentTime() {
      return this.samplePlayer.getCurrentTime();
    },
    getDuration:    function() {  },
  }
}

export default function TrackLoader(trackUrl, initFinished = () => {}) {
  fetchPackets('__test/packets-test/packets/' + trackUrl);
  const mediaUrl = '__test/packets-test/' + trackUrl;

  (function(Peaks) {
    document.getElementById('peaks-audio').src = mediaUrl
    const zoomview = document.getElementById('zoomview-container')
    const overview = document.getElementById('overview-container')
    const scrollbar = document.getElementById('scrollbar-container')
    options.zoomview.container = zoomview
    options.overview.container = overview
    options.scrollbar.container = scrollbar
    Peaks.init(options, function(err, peaks) {
      if (err) {
        console.error(`Failed to initialize Peaks instance: ${err.message}`)
        return
      }
      playerEvents(peaks)
      zoomEvents(peaks)
      segmentEvents(peaks, mediaUrl)
      peaks.segments.removeAll()
      document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
      initFinished(peaks)
    })
  })(peaks)
}
