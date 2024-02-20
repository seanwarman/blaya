import '../node_modules/peaks.js/dist/peaks.js';
import { createPlayer } from '../store/sequencerModule';

const options = {
  emitCueEvents: true,
  zoomLevels: [
    // 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130,
    // 135, 140, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210,
    // 215, 220, 225, 230, 235, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290,
    295, 300, 305, 310, 315, 320, 325, 330, 335, 340, 345, 350, 355, 360, 365,
    370, 375, 380, 385, 390, 395, 400, 405, 410, 415, 420, 425, 430, 435, 440,
    445, 450, 455, 460, 465, 470, 475, 480, 485, 490, 495, 500, 505, 510, 515,
    520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590,
    595, 600, 605, 610, 615, 620, 630, 640, 650, 660, 670, 680, 690, 700, 710,
    720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860,
    870, 880, 890, 900, 910, 930, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300,
    1350, 1400, 1450, 1500, 1600, 1700, 1800, 1900, 2000, 2200, 2400, 2600,
    2800, 3000, 3300, 3600, 3900, 4200,
  ],
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
  scrollbar: {},
  mediaElement: document.getElementById('peaks-audio'),
  webAudio: {
    audioContext: new AudioContext(),
  },
  showAxisLabels: false,
  wheelMode: 'scroll',
  axisGridlineColor: 'white',
  playheadColor: 'grey',
  player: {
    source: null,
    startTime: 0,
    timeId: null,
    init(eventEmitter) {
      return createPlayer('/track.mp3').then(source => {
        this.eventEmitter = eventEmitter;
        this.source = source;
        this.eventEmitter.emit('player.canplay');
      });
    },
    destroy:        function() {  },
    play() {
      console.log(`@FILTER this.getCurrentTime():`, this.getCurrentTime())
      this.source.start(0, 0);
      this.eventEmitter.emit('player.playing', this.getCurrentTime());
    },
    pause() {
      console.log(`@FILTER pause`)
      this.source.stop(0);
      this.eventEmitter.emit('player.pause', this.getCurrentTime());
    },
    seek(time) {
      console.log(`@FILTER time:`, time)
      this.seeking = true;
      this.source.seek(time);
      this.seeking = false;
      this.eventEmitter.emit('player.seeked', this.getCurrentTime());
      this.eventEmitter.emit('player.timeupdate', this.getCurrentTime());
    },
    isPlaying() {
      return this.source.playing;
    },
    isSeeking() {
      return this.seeking;
    },
    getCurrentTime() {
      return this.source.getCurrentTime();
    },
    getDuration:    function() {  },
  },
}

function playerEvents(peaks) {
  const { player } = peaks;
  const audioElement = document.getElementById('peaks-audio')
  console.log(`@FILTER audioElement:`, audioElement)
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
  // TODO...
  // audioElement.onended = () => {
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  // }
}

function zoomEvents({ zoom }) {
  zoom.setZoom(75)
  const incr = 4
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
    e.preventDefault()
    // TODO: fine tune this, use the delta values in combo with getZoom and
    // setZoom instead
    if (e.deltaX > 2) return
    if (e.deltaX < -2) return
    if (e.deltaY < 0) {
      zoom.zoomIn()
    } else {
      zoom.zoomOut()
    }
  }
}

function segmentEvents(peaks) {
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
  peaks.on('segments.add', e => {
    segments
      .getSegments()
      .slice(0, -1)
      .forEach((seg) => segments.removeById(seg.id))
  })
  peaks.on('segments.insert', e => {
    window.state.sequencerModule.updateCurrentSegment(e.segment);
  });
  peaks.on('segments.dragend', e => {
    window.state.sequencerModule.updateCurrentSegment(e.segment);
  });
}

export default function TrackLoader(mediaUrl, initFinished = () => {}) {
  (function(Peaks) {
    document.getElementById('peaks-audio').src = mediaUrl
    // We want the bytelength of the sample so fetch it as an array buffer as well...
    fetch(mediaUrl)
      .then(r => r.arrayBuffer())
      .then(arrayBuffer => {
        window.state.sequencerModule.setTrackLoaderByteLength(arrayBuffer.byteLength);
      })

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
      segmentEvents(peaks)

      peaks.segments.removeAll()
      document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
      initFinished(peaks)
    })

  })(peaks)
}
