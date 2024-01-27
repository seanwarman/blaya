// import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';
// import ZoomPlugin from '../node_modules/wavesurfer.js/dist/plugins/zoom.esm.js'
// import Minimap from '../node_modules/wavesurfer.js/dist/plugins/minimap.esm.js'
// import RegionsPlugin from '../node_modules/wavesurfer.js/dist/plugins/regions.esm.js'

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
    const options = {
      zoomview: {
        container: zoomview,
        waveformColor: '#c801c8',
        axisGridlineColor: 'transparent',
      },
      overview: {
        container: overview,
        axisGridlineColor: 'transparent',
        waveformColor: 'rgba(0,0,0,0.1)',
      },
      scrollbar: {
        container: scrollbar,
      },
      mediaElement: document.getElementById('peaks-audio'),
      webAudio: {
        audioContext: new AudioContext()
      },
      showAxisLabels: false,
      wheelMode: 'scroll',
      axisGridlineColor: 'white',
      playheadColor: 'grey',

    };

    Peaks.init(options, function(err, peaks) {
      if (err) {
        console.error(`Failed to initialize Peaks instance: ${err.message}`);
        return;
      }
      const { player } = peaks;
      const audioElement = document.getElementById('peaks-audio');

      audioElement.onplay = () => {
        document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = true
      };
      audioElement.onpause = () => {
        document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
      };

      // Do something when the waveform is displayed and ready
      document.getElementById('play-pause-track-loader').addEventListener('click', () => {
        if (!audioElement.paused) {
          player.pause()
        } else {
          player.play()
        }
      })
    });
  // player.on('destroy', () => {
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  // })
  // player.on('finish', () => {
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  // })
  // player.on('decode', () => {
  //   wsRegions.getRegions().forEach(r => r.remove())
  //   document.getElementById('play-pause-track-loader').dataset.trackLoaderPlaying = false
  // })
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

  // let pixPerSec = 1;
  // document.getElementById('zoom-in-track-loader').addEventListener('click', () => {
  //   if (pixPerSec < 5) {
  //     pixPerSec += 1;
  //   } else {
  //     pixPerSec += 5;
  //   }
  //   player.zoom(pixPerSec)
  // })
  // document.getElementById('zoom-out-track-loader').addEventListener('click', () => {
  //   if (pixPerSec <= 1) return
  //   if (pixPerSec < 5) {
  //     pixPerSec -= 1;
  //   } else {
  //     pixPerSec -= 5;
  //   }
  //   player.zoom(pixPerSec)
  // })
  return player;
}
