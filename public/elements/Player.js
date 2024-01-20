import WaveSurfer from '../node_modules/wavesurfer.js/dist/wavesurfer.js';

export default function Player() {
  const player = WaveSurfer.create({
    container: document.getElementById('track-loader'),
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    height: 100,
  });

  player.load('download/music/1k Phew - A - FLOW GOSPEL - 2018/11 - We Did It.mp3');

  return player;
}
