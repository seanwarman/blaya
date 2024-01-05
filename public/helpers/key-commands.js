import {
  onTogglePlaylistMode,
  onTogglePlaylistMinimised,
  onNext,
  onPrev,
} from './events.js'

export default function KeyboardCommands() {
  // Key commands...
  const onKey = (...maps) => e => {
    maps.forEach(([key, cb]) => {
      if(
        (typeof key === 'string' && e.key === key)
        || (key.key === e.key && key.ctrlKey === e.ctrlKey)
        || (key.key === e.key && key.metaKey === e.metaKey)
        || (key.key === e.key && key.shiftKey === e.shiftKey)
      ) {
        e.preventDefault()
        cb(e)
      }
    })
  }

  // Adding to Tab event, have to use addEventListener to prevent overwriting
  // any original events...
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      for (const t of document.querySelectorAll('.track-name-album-container.track-selected')) {
        t.classList.remove('track-selected')
      }
    }
  })

  document.onkeydown = onKey(
    [' ', () => {
      const player = document.getElementById('player')
      if (player.paused) {
        player.play()
      } else {
        player.pause()
      }
    }],
    ['ArrowRight', onNext],
    ['ArrowLeft', onPrev],
    // ['ArrowDown', onSelectDown],
    // ['ArrowUp', onSelectUp],
    // [{ key: 'n', ctrlKey: true }, onSelectDown],
    // [{ key: 'p', ctrlKey: true }, onSelectUp],
    [{ key: 'k', ctrlKey: true }, () => document.getElementById('search-input').focus()],
    [{ key: 'k', metaKey: true }, () => document.getElementById('search-input').focus()],
    ['Escape', () => {
      document.getElementById('search-input').blur()
      document.getElementById('upload-modal').dataset.visible = 'false'
    }],
    ['e', onTogglePlaylistMode],
    ["'", onTogglePlaylistMinimised],
  )
}
