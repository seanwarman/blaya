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
}

// onSearch :: Event -> undefined
export const onSearch = trackList => (e) => {
  // If this is the first search, remember the scroll position...
  if (!window.state.searching) {
    window.state.previousScrollPositionY = window.scrollY
    window.state.previousTrackListContainer = document.getElementById('track-list-container').cloneNode(true)
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

// onPlaylistName :: Event -> undefined
export const onPlaylistName = e => {
  e.stopPropagation()
  if (window.state.throttleId) clearTimeout(window.state.throttleId)
  window.state.throttleId = setTimeout(() => {
    window.state.playlists[window.state.selectedPlaylist][0] = e.target.value
  }, 100)
}







// HERE

export const onEndNext = () => {
  // const trackList = chooseTrackList([window.state.trackList, window.state.playlists[window.state.selectedPlaylist]])
  // const src = getNextTrackString(trackList)(window.state.currentTrackId)
  // const player = playHead(src)
  // window.state.currentTrackId = simpleHash(src)
  // player.pause()
  // player.load()
  // player.play()
  // updateCurrentTrack(window.state.currentTrackId)
}

// onNext :: [String] -> undefined -> undefined
export const onNext = () => {
  window.state.playModule.nextTrack()
  // const trackList = chooseTrackList([window.state.trackList, window.state.playlists[window.state.selectedPlaylist]])

  // const src = getNextTrackString(trackList)(window.state.currentTrackId)
  // console.log(`@FILTER src:`, src)
  // const player = playHead(src)
  // window.state.currentTrackId = simpleHash(src)
  // if (player.paused) {
  //   player.load()
  // } else {
  //   player.pause()
  //   player.load()
  //   player.play()
  // }
  // updateCurrentTrack(window.state.currentTrackId)
}

// onPrev :: [String] -> undefined -> undefined
export const onPrev = () => {
  // const trackList = chooseTrackList([window.state.trackList, window.state.playlists[window.state.selectedPlaylist]])
  // const src = getPrevTrackString(trackList)(window.state.currentTrackId)
  // const player = playHead(src)
  // window.state.currentTrackId = simpleHash(src)
  // if (player.paused) {
  //   player.load()
  // } else {
  //   player.load()
  //   player.play()
  // }
  // updateCurrentTrack(window.state.currentTrackId)
}

// onPlayPlaylist :: Event -> undefined
export const onPlayPlaylist = (e) => {
  const ref = e.currentTarget
  if (ref) {
    window.state.playModule.setTrack({ 
      src: ref.dataset.href,
      playlistIndex: findIndexOfElement(ref)(document.getElementById('playlist').getElementsByClassName('track')),
      playlist: true
    })
  }
}

// onPlay :: Event -> undefined
export const onPlay = (e) => {
  const ref = e.currentTarget
  if (ref) {
    window.state.playModule.setTrack({ src: ref.dataset.href, playlist: false })
  }
}















// onScrollThisTrack :: [String] -> undefined -> undefined
export const onScrollThisTrack = trackList => () => {
  window.state.targeting = true

  if (window.state.searching) {
    const trackListFiltered = fzfFilter(trackList)(getSearchValue())
    scrollToTrackByTrackId(window.state.currentTrackId)(trackListFiltered)
  } else {
    scrollToTrackByTrackId(window.state.currentTrackId)(trackList)
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
