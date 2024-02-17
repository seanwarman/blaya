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
  if (itemsElement.children?.length) {
    Array.from(itemsElement.children).forEach(child => itemsElement.removeChild(child));
  }
  const children = Object.keys(samples).map((name, i) => {
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
      style: 'width: 64.206px;',
      innerHTML: `
        <div class="vis-item-overflow">
          <div class="vis-item-content" style="transform: translateX(0px);">${name}</div>
        </div>
        <div class="vis-item-visible-frame"></div>
        <div class="vis-drag-center" style="touch-action: pan-y; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
        </div>
        <div class="vis-drag-left">
        </div>
        <div class="vis-drag-right"></div>
      `,
    });
    return dom.li({
      id: name + i,
      style: 'margin-top:1rem',
      children: [visItem],
    })
  });
  return dom.appendChildren(children)(itemsElement);
}
