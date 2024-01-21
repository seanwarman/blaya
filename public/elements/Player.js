import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';
import ZoomPlugin from '../node_modules/wavesurfer.js/dist/plugins/zoom.esm.js'
import Minimap from '../node_modules/wavesurfer.js/dist/plugins/minimap.esm.js'
import RegionsPlugin from '../node_modules/wavesurfer.js/dist/plugins/regions.esm.js'

export default function Player() {
  const player = WaveSurfer.create({
    container: document.getElementById('track-loader'),
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(200, 0, 200)',
    cursorColor: '#555555',
    height: 150,
    hideScrollbar: true,
    autoScroll: false,
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
  return player;
}
