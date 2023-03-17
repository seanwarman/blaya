import { setDebounce } from './utils.js'
import {
  updateCurrentTrack,
  removeTrackEls,
  playTrack,
  afterSearchReset,
  scrollToTrackByTrackId,
} from './dom.js'
import {
  appendTracksByPageFilteredBy,
  appendTracksByPageLazy,
  appendFilteredTracksByPageLazy,
  prependTracksByPageLazy,
  prependFilteredTracksByPageLazy,
} from './index.js'

// onClickOrEnter :: (a -> b) -> Event -> undefined
export const onClickOrEnter = cb => (e) => {
  if (e.type === "click" || e.key === "Enter") {
    cb(e)
  }
}

// onClearSearch :: undefined -> undefined
export const onClearSearch = () => {
  document.getElementById('search-input').value = ''
  afterSearchReset()
}

// onSearch :: Event -> undefined
export const onSearch = (e) => {
  // If this is the first search, remember the scroll position...
  if (!window.state.searching) {
    window.state.previousScrollPositionY = window.scrollY
    window.state.previousTrackListContainer = document.getElementById('track-list-container').cloneNode(true)
  }
  window.state.searchingPage = 1
  if (e.target.value.length === 0) {
    afterSearchReset()
    return
  }
  if (window.state.throttleId) clearTimeout(window.state.throttleId)
    window.state.throttleId = setTimeout(() => {
      window.state.searching = true
      window.scrollTo(0, 0)
      removeTrackEls()
      window.state.searchingPage = appendTracksByPageFilteredBy(e.target.value)(window.state.searchingPage)
    }, 100)
}

// onNext :: undefined -> undefined
export const onNext = () => {
  const currentTrackEl = document.getElementById(window.state.currentTrackId)
  if (!currentTrackEl || currentTrackEl.hidden) return playTrack(document.querySelector('.track'))
    if (!currentTrackEl.nextElementSibling.hidden) return playTrack(currentTrackEl.nextElementSibling)
      const nextTrackIndex = Number(currentTrackEl.nextElementSibling.id.split('-')[1])
  const els = document.getElementsByClassName('track')
  for (let i = nextTrackIndex; i < els.length; i++) {
    if (!els[i].hidden) return playTrack(els[i])
  }
}


// onPrev :: undefined -> undefined
export const onPrev = () => {
  const currentTrackEl = document.getElementById(window.state.currentTrackId)
  if (!currentTrackEl || currentTrackEl.hidden) return playTrack(document.querySelector('.track'))
    if (!currentTrackEl.previousElementSibling.hidden) return playTrack(currentTrackEl.previousElementSibling)
      const prevTrackIndex = Number(currentTrackEl.previousElementSibling.id.split('-')[1])
  const els = document.getElementsByClassName('track')
  for (let i = prevTrackIndex; i > -1; i--) {
    if (!els[i].hidden) return playTrack(els[i])
  }
}


// onScrollThisTrack :: undefined -> undefined
export const onScrollThisTrack = () => {
  scrollToTrackByTrackId(window.state.currentTrackId)
}


// onPlay :: Event -> undefined
export const onPlay = (e) => {
  const ref = e.currentTarget
  if (ref) {
    const sourcer = document.getElementById('current-track')
    sourcer.src = ref.getAttribute('data-href')
    const player = document.getElementById('player')
    player.load()
    updateCurrentTrack(ref)
    player.play()
  }
}

// onScroll :: undefined -> undefined
export const onScroll = () => {
  if (window.state.lazyLoadDebounce) {
    return
  }

  const offset = 3000
  const searchElValue = () => document.getElementById('search-input')?.value || ''

  // Down scroll
  if ((window.innerHeight + window.scrollY + offset) >= document.body.offsetHeight) {
    if (window.state.searching) {
      if (searchElValue().length > 0) {
        const searchingPage = appendFilteredTracksByPageLazy(searchElValue())(window.state.searchingPage)
        window.state.searchingPage = searchingPage || window.state.searchingPage
        return setDebounce()
      }
    } else {
      window.state.page = appendTracksByPageLazy(window.state.page)
      return setDebounce()
    }
  }

  // Up scroll
  if (
    !window.state.searching
  && window.state.page > window.state.numberOfPages + 1
  && window.scrollY < offset
  ) {
    window.state.page = prependTracksByPageLazy(window.state.page)
    return setDebounce()
  }

  if (
    window.state.searching
  && window.state.searchingPage > window.state.numberOfPages + 1
  && window.scrollY < offset
  && searchElValue().length > 0
  ) {
    window.state.searchingPage = prependFilteredTracksByPageLazy(searchElValue())(window.state.searchingPage)
    return setDebounce()
  }
}
