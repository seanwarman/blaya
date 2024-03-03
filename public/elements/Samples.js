import '../node_modules/peaks.js/dist/peaks.js';
import * as dom from '../helpers/dom.js'

window.addEventListener('playsample', e => {
  const el = document.querySelector(`#samples-container [data-name="${e.sampleName}"]`);
  el.classList.add('trigger');
  setTimeout(() => {
    el.classList.remove('trigger');
  }, 10);
});

function onDragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
  const item = {
    id: 0,
    type: 'range',
    name: event.target.dataset.name,
    content: event.target.dataset.name,
  };
  event.dataTransfer.setData('text', JSON.stringify(item));
}

export default function Samples(samples, segmentData) {
  const id = 'samples-container';
  const itemsElement = dom.div({
    id,
    className: 'items',
    children: Object.keys(samples).filter(name => samples[name]).map((name, i) => {
      const visItem = dom.div({
        draggable: true,
        dataset: {
          name: name,
          colourClass: segmentData[name].className + '-light',
        },
        className: `item vis-item vis-range vis-editable ${segmentData[name].className}-light`,
        onclick: () => {
          if (!visItem.classList.contains('vis-selected')) {
            Array.from(document.querySelectorAll('.vis-item.vis-selected')).forEach(el => el.classList.remove('vis-selected'));
            visItem.classList.add('vis-selected');
            window.state.sequencerModule.selectedSampleName = name;
          }
        },
        ondragstart: onDragStart,
        innerHTML: `
        <div class="vis-item-overflow">
          <div class="vis-item-content" style="width:47px;transform: translateX(0px);">
            <span style="
              position: absolute;
              color: white;
              top: 0;
              left: 2px;
              font-size: 0.8rem;
            ">${window.state.stepRecordModule.keysToMapNumbers[i].toUpperCase()}</span>
            <canvas width="10000" data-sample-name="${name}" style="height:30px;margin-left:-12px;margin-right-5px"></canvas>
          </div>
        </div>
        <div class="vis-item-visible-frame"></div>
        <div class="vis-drag-center" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
        </div>
        <div class="vis-drag-left">
        </div>
        <div class="vis-drag-right"></div>
      `,
      });
      const newElement = dom.div({
        className: 'sample',
        dataset: {
          name: name,
        },
        style: 'height:35px',
        children: [visItem],
      });
      // Keeps the original element to avoid wiping the canvas image
      const originalElement = document.querySelector(`.sample[data-name="${name}"]`);
      if (originalElement) {
        // originalElement.replaceWith(newElement);
        return originalElement;
      } else {
        return newElement;
      }
    }).filter(Boolean)
  });

  const originalEl = document.getElementById(id);
  if (originalEl) {
    originalEl.replaceWith(itemsElement);
  } else {
    document.querySelector('#sequencer-container .side').appendChild(itemsElement);
  }
//     if (originalElement) {
//       return null;
//     } else {
//       return newElement;
//     }

//     dom.appendChildren(children)(itemsElement);
  // }
}
