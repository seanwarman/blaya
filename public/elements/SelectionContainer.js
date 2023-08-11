import * as dom from '../helpers/dom.js'

export default function SelectionContainer() {
  const id = 'selection-container'
  const playlistContainer = document.getElementById('playlist-container')
  const scroll = step => {
    var scrollY = playlistContainer.scrollTop
    playlistContainer.scrollTo(0, scrollY + step);
    if (!stop) {
      setTimeout(() => {
        scroll(step)
      }, 5);
    }
  }
  return dom.div({
    id,
    draggable: true,
    ondragstart: onDragStart,
    ondragleave: (e) => {
      stop = true
      onDragLeave(e)
    },
    ondrop: () => {
      stop = true
    },
    ondragend: e => {
      stop = true
      onDragEnd(e)
    },
    ondrag: (e) => {
      if (window.innerWidth > 768) {
        return
      }
      const footerHeight = document.getElementsByTagName('footer')[0].clientHeight
      const headerHeight = document.getElementsByClassName('button-playlist-container')[0].clientHeight
      stop = true
      if (e.clientY < window.innerHeight - playlistContainer.clientHeight - headerHeight) {
        stop = false;
        scroll(-1)
      }
      if (e.clientY > (window.innerHeight - footerHeight - 50)) {
        stop = false;
        scroll(1)
      }
    },
  }) 
}

export function onDragover(e) {
  e.preventDefault()
  e.currentTarget.classList.add('dragover')
}

export function onDragLeave(e) {
  e.preventDefault()
  e.currentTarget.classList.remove('dragover')
}

export function onDragEnd(e) {
  e.preventDefault()
  const dragOverEls = document.getElementsByClassName('dragover')

  if (dragOverEls[0]) {
    dragOverEls[0]
      .parentElement
      .insertBefore(e.currentTarget, dragOverEls[0])
  }

  Array.from(dragOverEls).map(el => el.classList.remove('dragover'))
  Array
    .from(document.getElementById('playlist').children)
    .map(child => {
      if (child.classList.contains('track')) {
        child.draggable = false
        child.ondragover = null
        child.ondragenter = null
        child.ondragleave = null
      }
    })
}

export const onDragStart = () => {
  Array
    .from(document.getElementById('playlist').children)
    .map(child => {
      if (child.classList.contains('track')) {
        child.draggable = true
        child.ondragover = onDragover
        child.ondragenter = e => e.preventDefault()
        child.ondragleave = onDragLeave
      }
    })
}
