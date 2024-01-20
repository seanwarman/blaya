import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';
import ZoomPlugin from '../node_modules/wavesurfer.js/dist/plugins/zoom.esm.js'
import Minimap from '../node_modules/wavesurfer.js/dist/plugins/minimap.esm.js'

export default function Player() {
  const player = WaveSurfer.create({
    container: document.getElementById('track-loader'),
    waveColor: 'rgb(200, 0, 200)',
    progressColor: '#9b029b',
    height: 150,
    hideScrollbar: true,
    plugins: [
      // Register the plugin
      Minimap.create({
        height: 20,
        waveColor: '#98b5a8c9',
        cursorWidth: 0,
        overlayColor: '#47a9755c',
        interact: false,
        // the Minimap takes all the same options as the WaveSurfer itself
      }),
    ],
  });
  player.registerPlugin(
    ZoomPlugin.create({
      // the amount of zoom per wheel step, e.g. 0.5 means a 50% magnification per scroll
      scale: 0.4,
      // Optionally, specify the maximum pixels-per-second factor while zooming
      maxZoom: 700,
    }),
  )
  return player;
}
