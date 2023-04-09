import store from './store/indexModule.js'
import {
  onClearSearch,
  onSearch,
  onEndNext,
  onNext,
  onPrev,
  onScrollThisTrack,
  onClickOrEnter,
  onScroll,
  onUpScroll,
  onDownScroll,
  onTogglePlaylistMode,
} from './helpers/events.js'
import { logger } from './helpers/functional-utils.js'

import io from './node_modules/socket.io/client-dist/socket.io.esm.min.js'

io().on('reload', () => location.reload())

window.logger = logger

window.state = store().state

window.addEventListener('scroll', onScroll([onUpScroll(window.state.trackList), onDownScroll(window.state.trackList)]), false)
document.getElementById('player').onended = onEndNext
document.getElementById('next-button').onclick = onClickOrEnter(onNext)
document.getElementById('next-button').onkeydown = onClickOrEnter(onNext)
document.getElementById('prev-button').onclick = onClickOrEnter(onPrev)
document.getElementById('prev-button').onkeydown = onClickOrEnter(onPrev)
document.getElementById('current-playing-text').onclick = onClickOrEnter(onScrollThisTrack(window.state.trackList))
document.getElementById('current-playing-text').onkeydown = onClickOrEnter(onScrollThisTrack(window.state.trackList))
document.getElementById('search-input').oninput = onSearch(window.state.trackList)
document.getElementById('search-input').onkeydown = e => e.stopPropagation()
document.getElementById('clear-search-button').onclick = onClickOrEnter(onClearSearch)
document.getElementById('clear-search-button').onkeydown = onClickOrEnter(onClearSearch)
const onTogglePlaylistMinimised = () => {
  const playlistContainer = document.getElementById('playlist-container')
  playlistContainer.dataset.playlistMinimised = playlistContainer.dataset.playlistMinimised === 'false'
  document.getElementById('maximise-button-playlist').innerHTML = playlistContainer.dataset.playlistMinimised === 'false'
    ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>'
}
document.getElementById('maximise-button-playlist').onclick = onClickOrEnter(onTogglePlaylistMinimised)
document.getElementById('maximise-button-playlist').onkeydown = onClickOrEnter(onTogglePlaylistMinimised)

Array.from(document.getElementsByClassName('mode-button-playlist')).forEach(button => {
  button.onclick = onClickOrEnter(onTogglePlaylistMode)
  button.onkeydown = onClickOrEnter(onTogglePlaylistMode)
})

// Key commands...
const onKey = (...maps) => e => {
  maps.forEach(([key, cb]) => {
    if(
      (typeof key === 'string' && e.key === key)
      || (key.key === e.key && key.ctrlKey === e.ctrlKey)
      || (key.key === e.key && key.metaKey === e.metaKey)
    ) {
      e.preventDefault()
      cb(e)
    }
  })
}

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
  [{ key: 'k', ctrlKey: true }, () => document.getElementById('search-input').focus()],
  [{ key: 'k', metaKey: true }, () => document.getElementById('search-input').focus()],
  ['Escape', () => document.getElementById('search-input').blur()],
)
