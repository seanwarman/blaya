const audioCtx = new AudioContext();
const myArrayBuffer = audioCtx.createBuffer(
  2,
  audioCtx.sampleRate * 3,
  audioCtx.sampleRate,
);

for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
  const nowBuffering = myArrayBuffer.getChannelData(channel);
  for (let i = 0; i < myArrayBuffer.length; i++) {
    if (i < 100) {
      nowBuffering[i] = Math.random() * 2 - 1;
    } else {
      nowBuffering[i] = 0
    }
  }
}

let source;
let count = 0
const BPM = 120

function makeNoise() {
  count++
  console.log(`@FILTER count:`, count)
  source = audioCtx.createBufferSource();
  source.buffer = myArrayBuffer;
  source.connect(audioCtx.destination);
  source.start(0, 0, 60 / BPM);
  source.addEventListener('ended', () => {
    makeNoise()
  })
}
function init() {
  document.body.removeEventListener('click', init)
  makeNoise()
}
document.body.addEventListener('click', init)
