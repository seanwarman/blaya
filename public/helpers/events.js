import { setDebounce, fzfFilter } from './utils.js'
import * as dom from './dom.js'
import {
  removeTrackEls,
  afterSearchReset,
  scrollToTrackByTrackId,
  getSearchValue,
  addToPlaylist,
  findParentByClassName,
} from './dom.js'
import {
  appendTracksByPageFilteredBy,
  appendTracksByPageLazy,
  appendFilteredTracksByPageLazy,
  prependTracksByPageLazy,
  prependFilteredTracksByPageLazy,
  findIndexOfElement,
  arrayFromElements,
} from './index.js'
import Menu from '../elements/Menu.js'

// onClickOrEnter :: (a -> b) -> Event -> undefined
export const onClickOrEnter = cb => (e) => {
  if (e.type === "click" || e.key === "Enter") {
    cb(e)
  }
}

// onEnter :: (a -> b) -> Event -> undefined
export const onEnter = cb => e => {
  if (e.key === "Enter") {
    cb(e)
  }
}

// onStopPropagation :: (a -> b) -> Event -> undefined
export const onStopPropagation = cb => e => {
  e.stopPropagation()
  cb(e)
}

// onAddToPlaylistFromSearch :: (a -> b) -> Event -> undefined
export const onAddToPlaylistFromSearch = () => {
  if (!window.state.searching) {
    return
  }
  const href = document
    .getElementById('track-list-container')
    .getElementById('page-1')
    .getElementsByClassName('track')[0]
    ?.dataset?.href
  if (!href) return
  addToPlaylist(href)
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
  if (ref.classList.contains('play-ready')) {
    Array.from(document.getElementsByClassName('play-ready')).map(el => el.classList.remove('play-ready'))
    window.state.playModule.setTrack({ 
      src: ref.dataset.href,
      playlistIndex: findIndexOfElement(ref)(document.getElementById('playlist').getElementsByClassName('track')),
      isPlaylist: true,
    })
    document.getElementById('player').play()
    ref.focus()
  } else {
    ref.classList.add('play-ready')
    ref.focus()
  }
}

export const onOpenUploadModal = e => {
  e.preventDefault()
  const uploadModal = document.getElementById('upload-modal')
  uploadModal.dataset.visible = `${uploadModal.dataset.visible === 'false'}`
}

// onPlayAlbum :: Event -> undefined
export const onPlayAlbum = (e) => {
  // const ref = e.currentTarget
  // window.ref = ref
  // if (ref === document.activeElement) {
  //   window.state.playModule.setTrack({ src: ref.parentElement.dataset.href, isPlaylist: false, tab: true })
  //   document.getElementById('player').play()
  //   ref.focus()
  // } else {
  //   ref.focus()
  // }
  // window.state.playModule.focussedTrackId = ref.parentElement.id
}

export const onSelectPlaylist = () => {
  const playlist = document.getElementById('playlist')
  for (const t of document.querySelectorAll('.track-selected')) {
    t.classList.remove('track-selected')
  }
  const selection = window.getSelection()
  const { anchorNode, focusNode } = selection
  const start = findParentByClassName('track-name', anchorNode)
  const end = findParentByClassName('track-name', focusNode)
  let selectedEls = []
  if (start) selectedEls.push(start)
  for (const node of playlist.getElementsByClassName('track-name')) {
    if (selection.containsNode(node)) selectedEls.push(node)
  }
  if (end) selectedEls.push(end)
  for (const selectedEl of selectedEls) {
    selectedEl.classList.add('track-selected')
  }
  dom.emptySelectionContainer(document.getElementById('playlist'));
  // if (start === end) {
  //   start.parentElement.parentElement.insertBefore(Menu(), start.parentElement.nextElementSibling)
  //   return
  // }
  const tracks = Array.from(document.getElementById('playlist')?.getElementsByClassName('track-selected')).map(el => el.parentElement)
  if (!tracks.length) return
  dom.insertTracksIntoSelectionContainer(tracks.reverse()).prepend(Menu())
}

export const onSelectContext = (e) => {
  dom.emptySelectionContainer(document.getElementById('track-list-container'));
  if (e.currentTarget.getElementsByClassName('track-selected')?.length) {
    return
  }
  const selection = window.getSelection()
  const { anchorNode, focusNode } = selection
  const start = findParentByClassName('track-name-album-container', anchorNode)
  const end = findParentByClassName('track-name-album-container', focusNode)
  let selectedEls = []
  if (start) selectedEls.push(start)
  for (const node of document.getElementsByClassName('track-name-album-container')) {
    if (selection.containsNode(node)) selectedEls.push(node)
  }
  if (end) selectedEls.push(end)
  if (start === end) {
    start.parentElement.parentElement.insertBefore(Menu(), start.parentElement.nextElementSibling)
    return
  }
  for (const t of document.querySelectorAll('.track-selected')) {
    if (!selectedEls.includes(t)) {
      t.classList.remove('track-selected')
      t.attributes.draggable = false
    }
  }
  for (const selectedEl of selectedEls) {
    selectedEl.classList.add('track-selected')
    selectedEl.attributes.draggable = true
  }
  const tracks = Array.from(
    document
      .getElementById('track-list-container')
      ?.getElementsByClassName('track-selected')
  ).map((el) => el.parentElement);
  if (!tracks.length) return
  dom.insertTracksIntoSelectionContainer(tracks).append(Menu())
}

export const onSelect = (e) => {
  if (e.currentTarget.getElementsByClassName('track-selected')?.length > 1) {
    return
  }
  // If clicking into the selection don't change it...
  onPlay(e)
  if (e.currentTarget.getElementsByClassName('track-selected')?.length) {
    return
  }
  const selection = window.getSelection()
  const { anchorNode, focusNode } = selection
  const start = findParentByClassName('track-name-album-container', anchorNode)
  const end = findParentByClassName('track-name-album-container', focusNode)
  let selectedEls = []
  if (start) selectedEls.push(start)
  for (const node of document.getElementsByClassName('track-name-album-container')) {
    if (selection.containsNode(node)) selectedEls.push(node)
  }
  if (end) selectedEls.push(end)
  for (const t of document.querySelectorAll('.track-selected')) {
    if (!selectedEls.includes(t)) {
      t.classList.remove('track-selected')
      t.attributes.draggable = false
    }
  }
  for (const selectedEl of selectedEls) {
    selectedEl.classList.add('track-selected')
    selectedEl.attributes.draggable = true
  }
  const tracks = Array.from(
    document
      .getElementById('track-list-container')
      ?.getElementsByClassName('track-selected')
  ).map((el) => el.parentElement);
  if (!tracks.length) return
  dom.emptySelectionContainer(document.getElementById('track-list-container'));
  dom.insertTracksIntoSelectionContainer(tracks).append(Menu())
}

// onPlay :: Event -> undefined
export const onPlay = (e) => {
  const ref = e.currentTarget
  window.ref = ref
  if (ref.classList.contains('play-ready') && !e.shiftKey) {
    Array.from(document.getElementsByClassName('play-ready')).map(el => el.classList.remove('play-ready'))
    window.state.playModule.setTrack({ src: ref.dataset.href, isPlaylist: false })
    document.getElementById('player').play()
    ref.focus()
  } else {
    Array.from(document.getElementsByClassName('play-ready')).map(el => el.classList.remove('play-ready'))
    ref.classList.add('play-ready')
    ref.focus()
  }
  window.state.playModule.focussedTrackId = ref.parentElement.id
}

// onScrollThisTrack :: [String] -> undefined -> undefined
export const onScrollThisTrack = (trackList, id) => () => {
  if (window.state.targeting) {
    return
  }
  window.state.targeting = true
  if (window.state.searching) {
    const trackListFiltered = fzfFilter(trackList)(getSearchValue())
    scrollToTrackByTrackId(id || window.state.playModule.currentTrackId)(trackListFiltered)
  } else {
    scrollToTrackByTrackId(id || window.state.playModule.currentTrackId)(trackList)
  }
  window.state.targeting = false
}

export const onUpScroll = trackList => () => {
  if (window.state.targeting) return
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
  if (window.state.targeting) return
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

export const onClearPlaylist = registration => () => {
  if(confirm('Are you sure?\rThis will also remove the selected tracks from your offline tracks.')) {
    if (registration) {
      registration.active.postMessage({
        type: 'DELETE_PLAYLIST_TRACKS',
        payload: {
          playlist: window.state.playlists[window.state.selectedPlaylist],
        },
      })
    }
    window.state.playlists = window.state.playlists.map((playlist, i) => {
      if (i === window.state.selectedPlaylist) return ['', 0, []]
      return playlist
    });
  }
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

export function onUpload(registration) {
  return () => {
    const files = document.getElementById('upload').files
    if (!files.length) return
    window.state.uploading = true
    uploadFiles(files)
  }
}

async function uploadFiles(files) {
  const filenames = Array.from(files).map(({ name: filename }) => filename)
  for (const [index, file] of Object.entries(Array.from(files))) {
    const body = new FormData()
    body.append('files', file)
    try {
      await fetch('api/upload', {
        method: 'POST',
        body,
      })
      uploadsProgress(filenames, Number(index))
    } catch (error) {
      console.log(`@FILTER error:`, error)
      throw error
    }
  }
}

function uploadsProgress(filenames, index) {
  const lis = Array.from(document.getElementById('upload-files-list')?.getElementsByTagName('li') || [])
  lis.forEach((li, i) => i === index && li.classList.add('downloaded'))
  if (filenames.length !== index + 1) {
    window.state.uploading = true
  } else {
    fetch('api/refresh')
      .then(() => {
        window.state.uploading = false
        if (confirm('Uploads done. Refresh track list?')) {
          window.location.reload()
        }
      })
      .catch(error => {
        console.error(error)
        window.state.uploading = false
        alert('Error uploading tracks')
      })
  }
}

export function onSelectDown(e) {
  let track = document.querySelector('.track-name-album-container:focus')
  let el = track
    .parentElement
    .nextElementSibling
    ?.querySelector('.track-name-album-container')

  if (!el) {
    const nextPage = track
      .parentElement
      .parentElement
      .nextElementSibling
    el = nextPage
      .firstElementChild
      .querySelector('.track-name-album-container')
  }

  if (e.shiftKey) {
    if (el.classList.contains('track-selected')) {
      track.classList.remove('track-selected')
    } else {
      track.classList.add('track-selected')
      el.classList.add('track-selected')
    }
  } else {
    for (const t of document.querySelectorAll('.track-name-album-container.track-selected')) {
      t.classList.remove('track-selected')
    }
  }

  el
    .focus()
}

export function onSelectUp(e) {
  const track = document.querySelector('.track-name-album-container:focus')
  const el = track
    .parentElement
    .previousElementSibling
    ?.querySelector('.track-name-album-container')

  if (!el) {
    const prevPage = track
      .parentElement
      .parentElement
      .previousElementSibling
    el = prevPage
      .lastElementChild
      .querySelector('.track-name-album-container')
  }

  if (e.shiftKey) {
    window.getSelection().removeAllRanges()
    if (el.classList.contains('track-selected')) {
      track.classList.remove('track-selected')
    } else {
      track.classList.add('track-selected')
      el.classList.add('track-selected')
    }
  } else {
    for (const t of document.querySelectorAll('.track-name-album-container.track-selected')) {
      t.classList.remove('track-selected')
    }
  }

  el
    .focus()
}
