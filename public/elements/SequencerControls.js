import * as dom from '../helpers/dom';

export function onKeyDownPlay(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    window.state.sequencerModule.play()
  }
}

export function onKeyDownRecord(event) {
  if (event.key === ' ') {
    event.preventDefault();
    window.state.sequencerModule.isRecording = !window.state.sequencerModule.isRecording
    const recordCheckbox = document.getElementById('sequencer-record');
    recordCheckbox.checked = window.state.sequencerModule.isRecording;
  }
}

export default function SequencerControls() {
  document.getElementById('sequencer-controls').replaceWith(
    dom.div({
      id: 'sequencer-controls',
      innerHTML: `
        <link href="/elements/SequencerControls.css" rel="stylesheet"></style>
        <button
          tabindex="-1"
          onclick="window.state.sequencerModule.play()"
          id="start-sequencer"
        >Play</button>
        <label for="sequencer-metronome">Metr</label>
        <input
          tabindex="-1"
          id="sequencer-metronome"
          type="checkbox"
          onchange="window.state.sequencerModule.metronomeOn = event.target.checked"
        />
        <label
          for="sequencer-record"
        >Rec</label>
        <input
          tabindex="-1"
          id="sequencer-record"
          type="checkbox"
          onchange="window.state.sequencerModule.isRecording = event.target.checked"
        />
        <br>
        <label
          for="sequencer-tempo"
        >Tempo: <span id="show-tempo">120</span></label>
        <input
          tabindex="-1"
          id="sequencer-tempo"
          type="range"
          value="120"
          step="1"
          min="10.0"
          max="300"
          onInput="
            window.state.sequencerModule.tempo = event.target.value;
            document.getElementById('show-tempo').innerText=event.target.value;
          "
        />
        <label for="sequencer-snap-select">Snap</label>
        <select
          tabindex="-1"
          id="sequencer-snap-select"
          onchange="window.state.sequencerModule.snapSelected = event.target.selectedOptions[0].value"
        >
          <option value="16ths">16ths</option>
          <option value="32ths">32ths</option>
          <option value="64ths">64ths</option>
          <option value="128ths">128ths</option>
          <option value="256ths">256ths</option>
        </select>
        <br>
    `,
    }),
  );
}
