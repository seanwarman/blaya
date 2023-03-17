import { setDebounce, fzfFilter, simpleHash } from './utils.js'
import {
  updateCurrentTrack,
  removeTrackEls,
  playTrack,
  afterSearchReset,
  scrollToTrackByTrackId,
  getSearchValue,
  playHead,
} from './dom.js'
import {
  appendTracksByPageFilteredBy,
  appendTracksByPageLazy,
  appendFilteredTracksByPageLazy,
  prependTracksByPageLazy,
  prependFilteredTracksByPageLazy,
  getNextTrackString,
  getPrevTrackString,
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
export const onSearch = trackList => (e) => {
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
      window.state.searchingPage = appendTracksByPageFilteredBy(trackList)(e.target.value)(window.state.searchingPage)
    }, 100)
}

export const onEndNext = trackList => () => {
  const src = getNextTrackString(trackList)(window.state.currentTrackId)
  const player = playHead(src)
  window.state.currentTrackId = simpleHash(src)
  player.load()
  player.play()
  updateCurrentTrack(window.state.currentTrackId)
}

// onNext :: [String] -> undefined -> undefined
export const onNext = trackList => () => {
  const src = getNextTrackString(trackList)(window.state.currentTrackId)
  const player = playHead(src)
  window.state.currentTrackId = simpleHash(src)
  if (player.paused) {
    player.load()
  } else {
    player.load()
    player.play()
  }
  updateCurrentTrack(window.state.currentTrackId)
}

// onPrev :: [String] -> undefined -> undefined
export const onPrev = trackList => () => {
  const src = getPrevTrackString(trackList)(window.state.currentTrackId)
  const player = playHead(src)
  window.state.currentTrackId = simpleHash(src)
  if (player.paused) {
    player.load()
  } else {
    player.load()
    player.play()
  }
  updateCurrentTrack(window.state.currentTrackId)
}

// onScrollThisTrack :: [String] -> undefined -> undefined
export const onScrollThisTrack = trackList => () => {
  if (window.state.searching) {
    scrollToTrackByTrackId(window.state.currentTrackId)(fzfFilter(trackList)(getSearchValue()))
  } else {
    scrollToTrackByTrackId(window.state.currentTrackId)(trackList)
  }
}

// onPlay :: Event -> undefined
export const onPlay = (e) => {
  const ref = e.currentTarget
  if (ref) {
    const player = playHead(ref.getAttribute('data-href'))
    updateCurrentTrack(ref.id)
    player.load()
    player.play()
  }
}

// onScroll :: undefined -> undefined
export const onScroll = trackList => () => {
  if (window.state.lazyLoadDebounce) {
    return
  }

  const offset = 3000
  const searchElValue = () => document.getElementById('search-input')?.value || ''

  // Down scroll
  if ((window.innerHeight + window.scrollY + offset) >= document.body.offsetHeight) {
    if (window.state.searching) {
      if (searchElValue().length > 0) {
        const searchingPage = appendFilteredTracksByPageLazy(trackList)(searchElValue())(window.state.searchingPage)
        window.state.searchingPage = searchingPage || window.state.searchingPage
        return setDebounce()
      }
    } else {
      window.state.page = appendTracksByPageLazy(trackList)(window.state.page)
      return setDebounce()
    }
  }

  // Up scroll
  if (
    !window.state.searching
  && window.state.page > window.state.numberOfPages + 1
  && window.scrollY < offset
  ) {
    window.state.page = prependTracksByPageLazy(trackList)(window.state.page)
    return setDebounce()
  }

  if (
    window.state.searching
  && window.state.searchingPage > window.state.numberOfPages + 1
  && window.scrollY < offset
  && searchElValue().length > 0
  ) {
    window.state.searchingPage = prependFilteredTracksByPageLazy(trackList)(searchElValue())(window.state.searchingPage)
    return setDebounce()
  }
}
