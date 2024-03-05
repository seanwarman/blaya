import * as dom from '../helpers/dom';

export default function SequencerControls() {
  document.getElementById('sequencer-controls').replaceWith(
    dom.div({
      id: 'sequencer-controls',
      innerHTML: `
        <link href="/elements/SequencerControls.css" rel="stylesheet"></style>
        <button
          onclick="window.state.sequencerModule.play()"
          id="start-sequencer"
        >Play</button>
        <br>
        <label for="sequencer-metronome">Metr</label>
        <input
          id="sequencer-metronome"
          type="checkbox"
          onchange="window.state.sequencerModule.metronomeOn = event.target.checked"
        />
        <label
          for="sequencer-record"
        >Rec</label>
        <input
          id="sequencer-record"
          type="checkbox"
          onchange="window.state.sequencerModule.isRecording = event.target.checked"
        />
        <br>
        <label
          for="sequencer-tempo"
        >Tempo: <span id="show-tempo">120</span></label>
        <input
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
