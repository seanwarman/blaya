import '../node_modules/peaks.js/dist/peaks.js';
import * as dom from '../helpers/dom.js'

function handleDragStart(event) {
  event.dataTransfer.effectAllowed = 'move';
  const item = {
    id: 0,
    type: 'range',
    name: event.target.dataset.name,
    content: event.target.dataset.name,
  };
  event.dataTransfer.setData('text', JSON.stringify(item));
}

export default function Samples(samples) {
  const id = 'samples-container';
  let itemsElement = document.querySelector('#' + id)
  const children = Object.keys(samples).filter(name => samples[name]).map((name) => {
    if (document.getElementById(name)) {
      itemsElement.removeChild(Array.from(itemsElement.children).find(child => child.id === name));
    }
    const visItem = dom.div({
      draggable: true,
      dataset: {
        name: name,
      },
      className: 'item vis-item vis-range vis-editable',
      onclick: () => {
        if (!visItem.classList.contains('vis-selected')) {
          Array.from(document.querySelectorAll('.vis-item.vis-selected')).forEach(el => el.classList.remove('vis-selected'));
          visItem.classList.add('vis-selected');
          window.state.sequencerModule.selectedSampleName = name;
        }
      },
      ondragstart: handleDragStart,
      innerHTML: `
        <div class="vis-item-overflow">
          <div class="vis-item-content" style="transform: translateX(0px);">
            <canvas data-sample-name="${name}" style="width:65px"></canvas>
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
    return dom.div({
      id: name,
      style: 'margin-top:1rem;height:35px',
      children: [visItem],
    })
  });
  return dom.appendChildren(children)(itemsElement);
}
