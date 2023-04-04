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
document.getElementById('target-button').onclick = onClickOrEnter(onScrollThisTrack(window.state.trackList))
document.getElementById('target-button').onkeydown = onClickOrEnter(onScrollThisTrack(window.state.trackList))
document.getElementById('current-playing-text').onclick = onClickOrEnter(onScrollThisTrack(window.state.trackList))
document.getElementById('current-playing-text').onkeydown = onClickOrEnter(onScrollThisTrack(window.state.trackList))
document.getElementById('search-input').oninput = onSearch(window.state.trackList)
document.getElementById('search-input').onkeydown = e => e.stopPropagation()
document.getElementById('clear-search-button').onclick = onClickOrEnter(onClearSearch)
document.getElementById('clear-search-button').onkeydown = onClickOrEnter(onClearSearch)

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
