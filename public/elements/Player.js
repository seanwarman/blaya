// import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';
// import ZoomPlugin from '../node_modules/wavesurfer.js/dist/plugins/zoom.esm.js'
// import Minimap from '../node_modules/wavesurfer.js/dist/plugins/minimap.esm.js'
// import RegionsPlugin from '../node_modules/wavesurfer.js/dist/plugins/regions.esm.js'

const options = {
  zoomLevels: [
    50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120, 125, 130,
    135, 140, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210,
    215, 220, 225, 230, 235, 240, 250, 255, 260, 265, 270, 275, 280, 285, 290,
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
    waveformColor: "#c801c8",
    axisGridlineColor: "transparent",
  },
  overview: {
    axisGridlineColor: "transparent",
    waveformColor: "rgba(0,0,0,0.1)",
  },
  scrollbar: {},
  mediaElement: document.getElementById("peaks-audio"),
  webAudio: {
    audioContext: new AudioContext(),
  },
  showAxisLabels: false,
  wheelMode: "scroll",
  axisGridlineColor: "white",
  playheadColor: "grey",
};

function playerEvents({ player }) {
  const audioElement = document.getElementById('peaks-audio');
  document.getElementById('play-pause-track-loader').addEventListener('click', () => {
    if (!audioElement.paused) {
      player.pause()
    } else {
      player.play()
    }
  })
  audioElement.onplay = () => {
    document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = true
  };
  audioElement.onpause = () => {
    document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  };
  audioElement.onended = () => {
    document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  };
}

function zoomEvents({ zoom }) {
  zoom.setZoom(75);
  const incr = 4;
  document.getElementById('zoom-in-track-loader').addEventListener('click', () => {
    const index = zoom.getZoom();
    if (index - incr > -1) {
      zoom.setZoom(index - incr);
    }
  });
  document.getElementById('zoom-out-track-loader').addEventListener('click', () => {
    const index = zoom.getZoom();
    if (index + incr <= options.zoomLevels.length) {
      zoom.setZoom(index + incr);
    }
  });
  document.getElementById('zoomview-container').onwheel = e => {
    e.preventDefault();
    // TODO: fine tune this, use the delta values in combo with getZoom and
    // setZoom instead
    if (e.deltaX > 2) return;
    if (e.deltaX < -2) return;
    if (e.deltaY < 0) {
      zoom.zoomIn();
    } else {
      zoom.zoomOut();
    }
  };
}

export default function Player() {
  const zoomview = document.getElementById('zoomview-container');
  const overview = document.getElementById('overview-container');
  const scrollbar = document.getElementById('scrollbar-container');
  zoomview.style = `
    width: 100%;
    height: 100px;
  `;
  overview.style = `
    width: 100%;
    height: 30px;
  `;
  scrollbar.style = `
  `;
  (function(Peaks) {
    options.zoomview.container = zoomview;
    options.overview.container = overview;
    options.scrollbar.container = scrollbar;
    Peaks.init(options, function(err, peaks) {
      if (err) {
        console.error(`Failed to initialize Peaks instance: ${err.message}`);
        return;
      }
      playerEvents(peaks);
      zoomEvents(peaks);
    });
  })(peaks);

  return peaks.player;











  // const player = WaveSurfer.create({
  //   container: document.getElementById('track-loader'),
  //   waveColor: 'rgb(200, 0, 200)',
  //   progressColor: 'rgb(200, 0, 200)',
  //   autoScroll: false,
  //   cursorColor: '#555555',
  //   height: 150,
  //   hideScrollbar: true,
  //   interact: false,
  //   plugins: [
  //     Minimap.create({
  //       height: 20,
  //       waveColor: '#98b5a8c9',
  //       progressColor: '#98b5a8c9',
  //       cursorWidth: 0,
  //       overlayColor: '#47a9755c',
  //       interact: false,
  //     }),
  //   ],
  // });
  // player.registerPlugin(
  //   ZoomPlugin.create({
  //     scale: 0.4,
  //     maxZoom: 2000,
  //   }),
  // )
  // const wsRegions = player.registerPlugin(
  //   RegionsPlugin.create()
  // )
  // let disableDragSelection = wsRegions.enableDragSelection({
  //   color: '#47a9755c',
  // })

  // document.getElementById('italic-track-loader').addEventListener('click', () => {
  //   const italic = document.getElementById('italic-track-loader')
  //   if (italic.dataset.selectorActive === 'true') {
  //     disableDragSelection()
  //     italic.dataset.selectorActive = false
  //   } else {
  //     disableDragSelection = wsRegions.enableDragSelection({
  //       color: '#47a9755c',
  //     })
  //     italic.dataset.selectorActive = true
  //   }
  // })
  // wsRegions.on('region-clicked', (region, e) => {
  //   e.stopPropagation()
  //   region.play()
  // })
  // wsRegions.on('region-out', (region) => {
  //   const button = document.getElementById('loop-region')
  //   if (button.dataset.loopRegion === 'true') {
  //     region.play()
  //   } else {
  //     player.stop()
  //   }
  // })
  // player.on('click', () => {
  //   const regions = wsRegions.getRegions()
  //   regions.forEach(r => r.remove())
  //   player.play()
  // })
  // wsRegions.on('region-created', region => {
  //   const regions = wsRegions.getRegions()
  //   regions.forEach(r => {
  //     if (r === region) return;
  //     r.remove()
  //   })
  // })
  // player.on('decode', () => {
  //   wsRegions.getRegions().forEach(r => r.remove())
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  // })
  // player.on('destroy', () => {
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  // })

  // return player;
}
