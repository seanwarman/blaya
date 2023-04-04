import { simpleHash } from './utils.js'
import { onPlaylistName, onClickOrEnter, onPlay, onPlayPlaylist } from './events.js'
import {
  getCurrentTrackString,
  getTrackAndAlbumFromTrackString,
  getTrackAndAlbumFromId,
  pagesFromIndexRange,
  replaceAllWithThreePages,
  addHrefToPlaylist,
  removeTrackFromPlaylist,
  findIndexOfElement,
  rearrangeInPlaylist,
} from './index.js'
import * as f from './functional-utils.js'

// addPlayingClassIf :: Element -> Boolean -> Element
export const addPlayingClassIf = condition => element => {
  if (condition) {
    return f.classListAdd('playing')(element)
  }
  return element
}

// createTrackInnerHTMLFromTrackAndAlbum :: [String] -> String
export const createTrackInnerHTMLFromTrackAndAlbum = ([track, album]) =>
  '<div class="track-name">' + track + '</div>' + (album ? '<div class="track-album">' + album + '</div>' : '')

// createTrackInnerHTML :: String -> String
export const createTrackInnerHTML = f.pipe(
  getTrackAndAlbumFromTrackString,
  createTrackInnerHTMLFromTrackAndAlbum,
)

// TODO: move these to the events file...
export const onDragover = e => {
  e.preventDefault()
  e.currentTarget.classList.add('dragover')
}

export const onDragLeave = e => {
  e.preventDefault()
  e.currentTarget.classList.remove('dragover')
}

export const onDrop = e => {
  const droppedTrack = document.getElementById(e.dataTransfer.getData('Text'))
  const trackEls = droppedTrack.parentElement.getElementsByClassName('track')

  const fromIndex = findIndexOfElement(droppedTrack)(trackEls)
  const toIndex = findIndexOfElement(e.currentTarget)(trackEls)

  window.state.playlists = rearrangeInPlaylist(
    [fromIndex, toIndex],
    window.state.selectedPlaylist,
    window.state.playlists
  )

  droppedTrack.focus()

  e.preventDefault()
  for (const child of document.getElementsByClassName('dragover')) {
    child.classList.remove('dragover')
  }
}

export const onDragStart = e => {
  e.dataTransfer.setData('Text', e.currentTarget.id)
}

// createTrackElementForPlaylist :: [String] -> String -> Element
export const createTrackElementForPlaylist = trackList => trackId => {
  const trackString = getCurrentTrackString(trackList)(trackId)

  // createTrackPlaylistElementFromDiv :: Element -> Element
  const createTrackPlaylistElementFromDiv = f.pipe(
    f.AssignObject({
      className: 'track',
      role: 'link',
      draggable: true,
      tabIndex: '0',
      id: trackId,
      innerHTML: createTrackInnerHTML(trackString),
      onclick: onClickOrEnter(onPlayPlaylist),
      onkeydown: onClickOrEnter(onPlayPlaylist),
      ondragover: onDragover,
      ondragleave: onDragLeave,
      ondrop: onDrop,
      ondragstart: onDragStart
    }),
    f.ObjectAssignDataSet({
      playlist: true,
      href: trackString,
    }),
  )

  const playlistEl = createTrackPlaylistElementFromDiv(document.createElement('div'))

  playlistEl.firstChild.prepend(createRemoveFromPlaylistElement(document.createElement('div')))

  return playlistEl
}

// appendTrackElementToPlaylist :: Element -> Element
export const appendTrackElementToPlaylist = element => {
  const playlist = document.getElementById('playlist')
  playlist.prepend(element)
  return playlist
}

// appendTrackElementToPlaylistById :: trackId -> Element
export const appendTrackElementToPlaylistById = trackList => f.pipe(
  createTrackElementForPlaylist(trackList),
  appendTrackElementToPlaylist,
)

// chooseTrackList :: ([[String], [String]]) -> [String]
export const chooseTrackList = ([stateTrackList, playlistTrackList]) => {
  const track = document.getElementsByClassName('playing')[0]
  if (track?.dataset?.playlist) {
    return playlistTrackList
  }
  return stateTrackList
}

// onAddToPlaylist :: Event -> void
export const onAddToPlaylist = e => {
  e.stopPropagation()
  const href = e.currentTarget.parentElement.parentElement.dataset.href
  if (!href) return e
  window.state.playlists = addHrefToPlaylist(window.state.selectedPlaylist, href, window.state.playlists)
}

// onRemoveFromPlaylist :: Event -> Element
export const onRemoveFromPlaylist = e => {
  e.stopPropagation()

  const trackEl = e.currentTarget.parentElement.parentElement
  if (!trackEl) return

  const trackElIndex = findIndexOfElement(
    trackEl
  )(
    document.getElementById('playlist').getElementsByClassName('track')
  )

  window.state.playlists = removeTrackFromPlaylist(
    window.state.selectedPlaylist,
    trackElIndex,
    window.state.playlists
  )
}

export const onAddToPlaylistNewOrIgnore = () => {
  const playlistEl = document.getElementById('playlist')
  if (playlistEl.getElementsByClassName('playlist-name').length) {
    return
  }
  const div = document.createElement('div')

  div.innerHTML = `<input
    placeholder="Playlist name"
    class="playlist-name"
    aria-label="Playlist name"
    type="text"
  />`

  playlistEl.append(div)
  playlistEl.ondrop = e => e.preventDefault()
  playlistEl.firstChild.addEventListener('keydown', onPlaylistName)
}

// ifFalseOnAddToPlaylist :: fn -> Event -> [Element, Object] | Event
export const ifFalseOnAddToPlaylist = conditionFn => f.breakPipe(
  f.breakIf(conditionFn),
  onClickOrEnter(onAddToPlaylist),
)

// createAddToPlaylistElement :: String -> Element
export const createAddToPlaylistElement = trackId => f.pipe(
  f.AssignObject({
    id: 'add-to-playlist__' + trackId,
    className: 'add-to-playlist',
    tabIndex: '0',
    innerHTML: '<img style="height:1.5rem;" src="public/icons/plus-solid.svg" />',
    onclick: ifFalseOnAddToPlaylist(() => window.state.selectedPlaylist === undefined),
    onkeydown: ifFalseOnAddToPlaylist(() => window.state.selectedPlaylist === undefined),
  }),
  f.ObjectAssignDataSet({
    trackId,
  }),
)(document.createElement('div'))

// createRemoveFromPlaylistElement :: String -> Element
export const createRemoveFromPlaylistElement = trackId => f.pipe(
  f.AssignObject({
    id: 'add-to-playlist__' + trackId,
    className: 'add-to-playlist',
    tabIndex: '0',
    innerHTML: '<img style="height:1rem;" src="public/icons/minus-solid.svg" />',
    onclick: onClickOrEnter(onRemoveFromPlaylist),
    onkeydown: onClickOrEnter(onRemoveFromPlaylist),
  }),
  f.ObjectAssignDataSet({
    trackId,
  }),
)(document.createElement('div'))

// Create :: (String, String, String, Number) -> Element
export const Create = trackString => {
  const trackId = simpleHash(trackString)
  const [track, album] = getTrackAndAlbumFromTrackString(trackString)

  if (/#/.test(track) || /#/.test(album)) {
    return
  }

  const createTrackElementFromDiv = f.pipe(
    f.AssignObject({
      className: 'track',
      role: 'link',
      tabIndex: '0',
      id: trackId,
      innerHTML: createTrackInnerHTMLFromTrackAndAlbum([track, album]),
      onclick: onClickOrEnter(onPlay),
      onkeydown: onClickOrEnter(onPlay),
    }),
    f.ObjectAssignDataSet({
      href: trackString,
    }),
    addPlayingClassIf(
      trackString === window.state?.playModule?.currentTrackSrc
      && !window.state?.playModule?.isPlaylist
    ),
  )

  const trackEl = createTrackElementFromDiv(document.createElement('div'))

  trackEl.firstChild.prepend(createAddToPlaylistElement(trackId))

  return trackEl
}

// Append :: (Number, [Element]) -> Number
export const Append = (page, newEls) => {
  if (newEls.length < 1) return page
  const div = document.createElement('div')
  div.id = 'page-' + page
  div.append(...newEls)
  document.getElementById('track-list-container').append(div)
  return page + 1
}

// Prepend :: (Number, [Element]) -> Number
export const Prepend = (page, newEls) => {
  console.error(`prepend @FILTER page:`, page)
  const div = document.createElement('div')
  div.id = 'page-' + page
  div.append(...newEls)
  document.getElementById('track-list-container').prepend(div)
  window.state.texts = newEls.map(({ innerText }) => innerText)
  return page - 1
}

// removeLastChildFromContainer :: a -> a
export const removeLastChildFromContainer = (arg) => {
  const trackListContainer = document.getElementById('track-list-container')
  trackListContainer.removeChild(trackListContainer.lastChild)
  return arg
}

// removeFirstChildFromContainer :: Number -> Number
export const removeFirstChildFromContainer = (page) => {
  if (page > window.state.numberOfPages + 1) {
    const trackListContainer = document.getElementById('track-list-container')
    trackListContainer.firstChild && trackListContainer.removeChild(trackListContainer.firstChild)
  }
  return page
}

// removeTrackEls :: a -> a
export const removeTrackEls = (arg) => {
  document.getElementById('track-list-container').remove()
  const footer = document.getElementsByTagName('footer')[0]
  const trackListContainer = document.createElement('div')
  trackListContainer.id = 'track-list-container'
  document.body.insertBefore(trackListContainer, footer)
  return arg
}

// removePlaylistEls :: undefined -> undefined
export const removePlaylistEls = () => {
  document.getElementById('playlist').remove()
  const footer = document.getElementsByTagName('footer')[0]
  const playlistContainer = document.createElement('div')
  playlistContainer.id = 'playlist'
  footer.insertAdjacentElement('beforebegin', playlistContainer)
}

// afterSearchReset :: undefined -> undefined
export const afterSearchReset = () => {
  document.getElementById('track-list-container').remove()
  const footer = document.getElementsByTagName('footer')[0]
  if (window.state.previousTrackListContainer) {
    document.body.insertBefore(window.state.previousTrackListContainer, footer)
    scrollTo(0, window.state.previousScrollPositionY)
  } else {
    appendTracksByPage(window.state.trackList)(1)
  }
}

// createPageElement :: Number => Element
export const createPageElement = page => {
  const div = document.createElement('div')
  div.id = 'page-' + page
  return div
}

// scrollToTrackByTrackId :: Number -> [String] -> undefined
export const scrollToTrackByTrackId = currentTrackSrc => trackList => {
  const trackListIndex = trackList.findIndex(track => currentTrackSrc === track)
  const [page] = pagesFromIndexRange([trackListIndex, 0])
  window.state.page = replaceAllWithThreePages(trackList)(page)
  let el = document.getElementById(simpleHash(currentTrackSrc))
  el.focus()
}

// getSearchValue :: undefined -> String
export const getSearchValue = () => {
  return document.getElementById('search-input').value
}
