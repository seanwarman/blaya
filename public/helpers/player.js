import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js'

export default function Player() {
  const wavesurfer = WaveSurfer.create({
    container: document.getElementById('player'),
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: '/AveMarisStella.mp3',
    height: 'auto',
  });
}

