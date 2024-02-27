import '../node_modules/peaks.js/dist/peaks.js';
import * as dom from '../helpers/dom.js'

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
  let itemsElement = document.querySelector('#' + id)
  const children = Object.keys(samples).filter(name => samples[name]).map((name) => {
    const visItem = dom.div({
      draggable: true,
      dataset: {
        name: name,
      },
      style: `border:none;border-radius:5px;`,
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
          <div class="vis-item-content" style="transform: translateX(0px);">
            <canvas data-sample-name="${name}" style="width:65px;margin-left:-12px;margin-right-5px"></canvas>
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
      style: 'margin-top:1rem;height:35px',
      children: [visItem],
    });
    const originalElement = document.querySelector(`.sample[data-name="${name}"]`);
    if (originalElement) {
      originalElement.replaceWith(newElement);
      return null;
    } else {
      return newElement;
    }
  }).filter(Boolean);
  if (children.length) {
    dom.appendChildren(children)(itemsElement);
  }
}
