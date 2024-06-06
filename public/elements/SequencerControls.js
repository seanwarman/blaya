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

const barsToDuplicateChangeEvent = new Event('changebarstoduplicate', { bubbles: true });
const barsToDuplicateOverChangeEvent = new Event('changebarstoduplicateover', { bubbles: true });

export default function SequencerControls() {
  document.getElementById('sequencer-controls').replaceWith(
    dom.div({
      id: 'sequencer-controls',
      children: [
        dom.link({ href: '/elements/SequencerControls.css', rel: 'stylesheet' }),
        dom.div({
          className: 'container',
          children: [
            dom.button({
              tabindex: '-1',
              onclick: () => window.state.sequencerModule.play(),
              id: 'start-sequencer',
              innerText: 'Play',
            }),
            dom.label({
              for: 'sequencer-metronome',
              innerText: 'Metr',
            }),
            dom.input({
              tabindex: '-1',
              id: 'sequencer-metronome',
              type: 'checkbox',
              onchange: event => onChangeMetro(event),
            }),
            dom.label({
              for: 'sequencer-record',
              innerText: 'Rec',
            }),
            dom.input({
              tabindex: '-1',
              id: 'sequencer-record',
              type: 'checkbox',
              onchange: event => {
                window.state.sequencerModule.isRecording = event.target.checked;
                if (event.target.checked) {
                  window.state.stepRecordModule.clearMode = !event.target.checked;
                  document.getElementById('sequencer-clear').checked = !event.target.checked;
                }
              },
            }),
            dom.label({
              for: 'sequencer-clear',
              innerText: 'Clear',
            }),
            dom.input({
              tabindex: '-1',
              id: 'sequencer-clear',
              type: 'checkbox',
              onchange: event => onChangeClear(event),
            }),
            dom.br({}),
            dom.label({
              for: 'sequencer-tempo',
              innerHTML: 'Tempo: <span id="show-tempo">120</span>',
            }),
            dom.input({
              tabindex: '-1',
              id: 'sequencer-tempo',
              type: 'range',
              value: '120',
              step: '1',
              min: '10.0',
              max: '300',
              onInput: event => {
                window.state.sequencerModule.tempo = event.target.value;
                document.getElementById('show-tempo').innerText=event.target.value;
              },
            }),
            dom.label({
              for: 'sequencer-snap-select',
              innerText: 'Snap',
            }),
            dom.select({
              tabindex: '-1',
              id: 'sequencer-snap-select',
              onchange: event => window.state.sequencerModule.snapSelected = event.target.selectedOptions[0].value,
              innerHTML: `
                <option value="16ths">16ths</option>
                <option value="32ths">32ths</option>
                <option value="64ths">64ths</option>
                <option value="128ths">128ths</option>
                <option value="256ths">256ths</option>
              `,
            }),
            dom.select({
              tabindex: '-1',
              id: 'sequencer-loop-bar-length-select',
              onchange: onChangeLoopBarLength,
              innerHTML: `
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
              `,
            }),
            dom.button({
              id: 'save-as',
              onclick: () => window.state.sequencerModule.saveToFile(),
              innerText: 'Save as',
            }),
            dom.input({
              id: 'load-from-file',
              type: 'file',
              accept: '.json',
              onchange: event => window.state.sequencerModule.loadFromFile(event),
            }),
            dom.br({}),
          ],
        }),
        // DuplicateControls(),
      ],
    }),
  );
}

function DuplicateControls() {
  return dom.div({
    className: 'container',
    children: [
      dom.span({ innerText: 'Duplicate ' }),
      dom.select({
        onchange: (event) => {
          window.state.sequencerModule.barsToDuplicate = Number(event.target.value);
          window.dispatchEvent(Object.assign(barsToDuplicateChangeEvent, { barsToDuplicate: Number(event.target.value) }));
        },
        innerHTML: `
          <option value="0.0625">1/16 bars</option>
          <option value="0.125" selected>1/8 bars</option>
          <option value="0.25">1/4 bars</option>
          <option value="0.5">1/2 bars</option>
          <option value="1">1 bar</option>
          <option value="2">2 bars</option>
          <option value="3">3 bars</option>
          <option value="4">4 bars</option>
        `,
      }),
      dom.span({ innerText: ' over ' }),
      dom.select({
        onchange: (event) => {
          window.state.sequencerModule.barsToDuplicateOver = Number(event.target.value);
          window.dispatchEvent(Object.assign(barsToDuplicateOverChangeEvent, { barsToDuplicateOver: Number(event.target.value) }));
        },
        innerHTML: `
          <option value="0.125">1/8 bars</option>
          <option value="0.25">1/4 bars</option>
          <option value="0.5" selected>1/2 bars</option>
          <option value="1">1 bar</option>
          <option value="2">2 bars</option>
          <option value="3">3 bars</option>
          <option value="4">4 bars</option>
          <option value="5">5 bars</option>
          <option value="6">6 bars</option>
          <option value="7">7 bars</option>
          <option value="8">8 bars</option>
        `,
      }),
      dom.button({
        onclick: () => {
          window.state.sequencerModule.duplicateTimeline({bars:[window.state.sequencerModule.barsToDuplicate,window.state.sequencerModule.barsToDuplicateOver]});
        },
        innerText: 'Go',
      }),
    ],
  });
}

