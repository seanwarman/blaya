import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';
import ZoomPlugin from '../node_modules/wavesurfer.js/dist/plugins/zoom.esm.js'
import Minimap from '../node_modules/wavesurfer.js/dist/plugins/minimap.esm.js'

export default function Player() {
  const player = WaveSurfer.create({
    container: document.getElementById('track-loader'),
    waveColor: 'rgb(200, 0, 200)',
    progressColor: '#9b029b',
    height: 100,
    hideScrollbar: true,
    plugins: [
      // Register the plugin
      Minimap.create({
        height: 20,
        waveColor: '#9a9a9a78',
        cursorWidth: 0,
        overlayColor: '#e0e0e0',
        interact: false,
        // the Minimap takes all the same options as the WaveSurfer itself
      }),
    ],
  });
  player.registerPlugin(
    ZoomPlugin.create({
      // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
      scale: 0.5,
      // Optionally, specify the maximum pixels-per-second factor while zooming
      maxZoom: 100,
    }),
  )
  return player;
}
