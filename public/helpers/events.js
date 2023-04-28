import { setDebounce, fzfFilter } from './utils.js'
import {
  removeTrackEls,
  afterSearchReset,
  scrollToTrackByTrackId,
  getSearchValue,
} from './dom.js'
import {
  appendTracksByPageFilteredBy,
  appendTracksByPageLazy,
  appendFilteredTracksByPageLazy,
  prependTracksByPageLazy,
  prependFilteredTracksByPageLazy,
  findIndexOfElement,
} from './index.js'

// onClickOrEnter :: (a -> b) -> Event -> undefined
export const onClickOrEnter = cb => (e) => {
  if (e.type === "click" || e.key === "Enter") {
    cb(e)
  }
}

// onClearSearch :: undefined -> undefined
export const onClearSearch = () => {
  const searchInput = document.getElementById('search-input')
  if (!searchInput.value.length) return
  searchInput.value = ''
  afterSearchReset()
  window.state.searching = false
  searchInput.focus()
}

// onSearch :: Event -> undefined
export const onSearch = trackList => (e) => {
  // If this is the first search, remember the scroll position...
  if (!window.state.searching) {
    window.state.previousScrollPositionY = window.scrollY
    window.state.previousTrackListContainer = document.getElementById('track-list-container')
  }
  window.state.searchingPage = 1
  window.state.searching = true
  if (e.target.value.length === 0) {
    afterSearchReset()
    window.state.searching = false
    return
  }
  if (window.state.throttleId) clearTimeout(window.state.throttleId)
  window.state.throttleId = setTimeout(() => {
    window.scrollTo(0, 0)
    removeTrackEls()
    window.state.searchingPage = appendTracksByPageFilteredBy(trackList)(e.target.value)(window.state.searchingPage)
  }, 100)
}

export const onEndNext = () => {
  window.state.playModule.nextTrack()
  document.getElementById('player').play()
}

export const onNext = () => {
  window.state.playModule.nextTrack()
}

export const onPrev = () => {
  window.state.playModule.prevTrack()
}

// onPlayPlaylist :: Event -> undefined
export const onPlayPlaylist = (e) => {
  const ref = e.currentTarget
  window.ref = ref
  if (ref === document.activeElement) {
    window.state.playModule.setTrack({ 
      src: ref.dataset.href,
      playlistIndex: findIndexOfElement(ref)(document.getElementById('playlist').getElementsByClassName('track')),
      isPlaylist: true,
    })
    document.getElementById('player').play()
    ref.focus()
  } else {
    ref.focus()
  }
}

// onPlay :: Event -> undefined
export const onPlay = (e) => {
  const ref = e.currentTarget
  window.ref = ref
  if (ref === document.activeElement) {
    window.state.playModule.setTrack({ src: ref.dataset.href, isPlaylist: false })
    document.getElementById('player').play()
    ref.focus()
  } else {
    ref.focus()
  }
}

// onScrollThisTrack :: [String] -> undefined -> undefined
export const onScrollThisTrack = trackList => () => {
  if (window.state.targeting) {
    return
  }
  window.state.targeting = true
  if (window.state.searching) {
    const trackListFiltered = fzfFilter(trackList)(getSearchValue())
    scrollToTrackByTrackId(window.state.playModule.currentTrackSrc)(trackListFiltered)
  } else {
    scrollToTrackByTrackId(window.state.playModule.currentTrackSrc)(trackList)
  }
  setTimeout(() => {
    window.state.targeting = false
  }, 100)
}

export const onUpScroll = trackList => () => {
  if (window.state.lazyLoadDebounce) {
    return
  }
  if (
    !window.state.searching
    && window.state.page > window.state.numberOfPages + 1
    && window.scrollY < window.state.offset
  ) {
    window.state.page = prependTracksByPageLazy(trackList)(window.state.page)
    return setDebounce()
  }
  if (
    window.state.searching
    && window.state.searchingPage > window.state.numberOfPages + 1
    && window.scrollY < window.state.offset
    && getSearchValue().length > 0
  ) {
    window.state.searchingPage = prependFilteredTracksByPageLazy(trackList)(getSearchValue())(window.state.searchingPage)
    return setDebounce()
  }
}

export const onDownScroll = trackList => () => {
  if (window.state.lazyLoadDebounce) {
    return
  }
  if ((window.innerHeight + window.scrollY + window.state.offset) >= document.body.offsetHeight) {
    if (window.state.searching) {
      if (getSearchValue().length > 0) {
        const searchingPage = appendFilteredTracksByPageLazy(trackList)(getSearchValue())(window.state.searchingPage)
        window.state.searchingPage = searchingPage || window.state.searchingPage
        return setDebounce()
      }
    } else {
      window.state.page = appendTracksByPageLazy(trackList)(window.state.page)
      return setDebounce()
    }
  }
}

// onScroll :: [Event -> undefined] -> Event -> (Event -> undefined)
export const onScroll = ([onUpScroll, onDownScroll]) => (e) => {
  if (window.state.targeting) return
  const st = window.pageYOffset || document.documentElement.scrollTop
  if (st > window.state.lastScrollTop) {
    onDownScroll(e)
  } else if (st < window.state.lastScrollTop) {
    onUpScroll(e)
  }
  window.state.lastScrollTop = st <= 0 ? 0 : st
}

export const onTogglePlaylistMode = () => {
  window.state.playlistMode = !window.state.playlistMode
}

export const onClearPlaylist = () => {
  window.state.playlists = null
}

export function onDownload(registration) {
  return () => {
    window.state.downloading = true
    if (registration) {
      registration.active.postMessage({
        type: 'DOWNLOAD_PLAYLIST',
        payload: {
          playlist: window.state.playlists[window.state.selectedPlaylist]
        },
      })
    }
  }
}
