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
    if (event.target.checked) {
      window.state.stepRecordModule.clearMode = !event.target.checked;
      document.getElementById('sequencer-clear').checked = !event.target.checked;
    }
  }
  if (event.key === 'C') {
    const clearCheckbox = document.getElementById('sequencer-clear');
    clearCheckbox.checked = !clearCheckbox.checked;
    onChangeClear({ target: clearCheckbox });
  }
  if (event.key === 'M') {
    const metroCheckbox = document.getElementById('sequencer-metronome');
    metroCheckbox.checked = !metroCheckbox.checked;
    onChangeMetro({ target: metroCheckbox });
  }
}

function onChangeLoopBarLength(event) {
  window.state.sequencerModule.setLoopBarLength(event.target.value);
}

function onChangeMetro(event) {
  window.state.sequencerModule.metronomeOn = event.target.checked;
}

function onChangeClear(event) {
  window.state.stepRecordModule.clearMode = event.target.checked;
  if (event.target.checked) {
    window.state.sequencerModule.isRecording = !event.target.checked;
    document.getElementById('sequencer-record').checked = !event.target.checked;
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
          onchange="${onChangeMetro.toString()} onChangeMetro(event);"
        />
        <label
          for="sequencer-record"
        >Rec</label>
        <input
          tabindex="-1"
          id="sequencer-record"
          type="checkbox"
          onchange="
            window.state.sequencerModule.isRecording = event.target.checked;
            if (event.target.checked) {
              window.state.stepRecordModule.clearMode = !event.target.checked;
              document.getElementById('sequencer-clear').checked = !event.target.checked;
            }
          "
        />
        <label
          for="sequencer-clear"
        >Clear</label>
        <input
          tabindex="-1"
          id="sequencer-clear"
          type="checkbox"
          onchange="
            ${onChangeClear.toString()} onChangeClear(event);
          "
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
        <select
          tabindex="-1"
          id="sequencer-loop-bar-length-select"
          onchange="${onChangeLoopBarLength.toString()} onChangeLoopBarLength(event)"
        >
          <option value="1">1 bar</option>
          <option value="2">2 bars</option>
          <option value="3">3 bars</option>
          <option value="4">4 bars</option>
          <option value="5">5 bars</option>
          <option value="6">6 bars</option>
          <option value="7">7 bars</option>
          <option value="8">8 bars</option>
          <option value="9">9 bars</option>
          <option value="10">10 bars</option>
          <option value="11">11 bars</option>
          <option value="12">12 bars</option>
          <option value="13">13 bars</option>
          <option value="14">14 bars</option>
          <option value="15">15 bars</option>
          <option value="16">16 bars</option>
        </select>
        <br>
    `,
    }),
  );
}
