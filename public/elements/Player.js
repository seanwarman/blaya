import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';
import * as e from '../helpers/events.js';

export default function Player() {
  const player = WaveSurfer.create({
    container: document.getElementById('player'),
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    height: 'auto',
  });
  player.on('finish', e.onNext);
  return player;
}
