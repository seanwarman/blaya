import { simpleHash } from './utils.js'
import { onClickOrEnter, onPlay, onPlayPlaylist } from './events.js'
import {
  getCurrentTrackString,
  getTrackAndAlbumFromTrackString,
  findIndexOfElement,
  pagesFromIndexRange,
  appendTracksByPageRange,
  appendTracksByPage,
  addHrefToPlaylist,
  removeTrackFromPlaylist,
  rearrangeInPlaylist,
  arrayFromElements,
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
  '<div class="track-name"><div class="name">' + track + '</div></div>' + (album ? '<div class="track-album"><div class="album">' + album + '</div></div>' : '')

// createPlaylistTrackInnerHtmlFromTrackAndAlbum :: [String] -> String
export const createPlaylistTrackInnerHtmlFromTrackAndAlbum = ([track, _]) =>
  '<div class="track-name"><div class="name">' + track + '</div></div><div class="drag-container"><img class="svg" src="icons/grip-vertical-solid.svg" /></div>'

// createTrackInnerHTML :: String -> String
export const createTrackInnerHTML = f.pipe(
  getTrackAndAlbumFromTrackString,
  createTrackInnerHTMLFromTrackAndAlbum,
)

// createPlaylistTrackInnerHtml :: String -> String
export const createPlaylistTrackInnerHtml = f.pipe(
  getTrackAndAlbumFromTrackString,
  createPlaylistTrackInnerHtmlFromTrackAndAlbum,
)

// TODO: move these to the events file...
export const onDragover = e => {
  e.preventDefault()
  e.currentTarget.parentElement.classList.add('dragover')
}

export const onDragLeave = e => {
  e.preventDefault()
  e.currentTarget.parentElement.classList.remove('dragover')
}

export const onDrop = e => {
  const trackEls = arrayFromElements(e.currentTarget.parentElement.parentElement.getElementsByClassName('track')).reverse()
  const iFrom = Number(e.dataTransfer.getData('iFrom'))
  const iTo = trackEls.findIndex(el => el === e.currentTarget.parentElement)

  window.state.playlists = rearrangeInPlaylist(
    [iFrom, iTo],
    window.state.selectedPlaylist,
    window.state.playlists,
  )

  e.preventDefault()
  for (const child of document.getElementsByClassName('dragover')) {
    child.classList.remove('dragover')
  }
}

export const onDragStart = e => {
  const trackEls = arrayFromElements(e.currentTarget.parentElement.parentElement.getElementsByClassName('track')).reverse()
  const iFrom = trackEls.findIndex(el => el === e.currentTarget.parentElement)
  e.dataTransfer.setData('iFrom', iFrom)
}

// createTrackElementForPlaylist :: [String] -> String -> Element
export const createTrackElementForPlaylist = trackList => playing => trackId => {
  const trackString = getCurrentTrackString(trackList)(trackId)

  // createTrackPlaylistElementFromDiv :: Element -> Element
  const createTrackPlaylistElementFromDiv = f.pipe(
    f.AssignObject({
      className: 'track' + (playing ? ' playing' : ''),
      role: 'link',
      tabIndex: '0',
      id: trackId,
      innerHTML: createPlaylistTrackInnerHtml(trackString),
      onmousedown: onPlayPlaylist,
      onkeydown: onClickOrEnter(onPlayPlaylist),
    }),
    f.ObjectAssignDataSet({
      playlist: true,
      href: trackString,
    }),
  )

  const playlistEl = createTrackPlaylistElementFromDiv(document.createElement('div'))
  playlistEl.prepend(createRemoveFromPlaylistElement(document.createElement('div')))

  Array.from(playlistEl.getElementsByClassName('drag-container')).forEach(dragIconEl => {
    dragIconEl.draggable = true

    dragIconEl.ondragover = onDragover
    dragIconEl.ondragleave = onDragLeave
    dragIconEl.ondrop = onDrop
    dragIconEl.ondragstart = onDragStart
  })

  return playlistEl
}

// appendTrackElementToPlaylist :: Element -> Element
export const appendTrackElementToPlaylist = element => {
  const playlist = document.getElementById('playlist')
  playlist.prepend(element)
  return playlist
}

// appendTrackElementToPlaylistById :: trackId -> Element
export const appendTrackElementToPlaylistById = trackList => playing => f.pipe(
  createTrackElementForPlaylist(trackList)(playing),
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
  const href = e.currentTarget.parentElement.dataset.href
  if (!href) return e
  window.state.playlists = addHrefToPlaylist(window.state.selectedPlaylist, href, window.state.playlists)
  // Scroll playlist to bottom to keep track of everything...
  const el = document.getElementById('playlist-container')
  el.scrollTop = el.scrollHeight
}

// onRemoveFromPlaylist :: Event -> Element
export const onRemoveFromPlaylist = e => {
  e.stopPropagation()

  const trackEl = e.currentTarget.parentElement
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
    innerHTML: '<img style="height:1rem;" src="public/icons/plus-solid.svg" />',
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
    innerHTML: '<img style="height:0.8rem;" src="public/icons/minus-solid.svg" />',
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
    }),
    f.ObjectAssignDataSet({
      href: trackString,
    }),
    addPlayingClassIf(
      trackString === window.state?.playModule?.currentTrackSrc
      && !window.state?.playModule?.isPlaylist
    ),
  )

  const trackName = f.AssignObject({
    className: 'track-name',
    innerHTML: '<div class="name">' + track + '</div>',
    onmousedown: onPlay,
    onkeydown: onClickOrEnter(onPlay),
  })(document.createElement('div'))

  const trackAlbum = f.AssignObject({
    className: 'track-album',
    innerHTML: '<div class="album">' + (album || '') + '</div>',
    onmousedown: onPlay,
    onkeydown: onClickOrEnter(onPlay),
  })(document.createElement('div'))

  const trackEl = createTrackElementFromDiv(document.createElement('div'))

  trackEl.append(createAddToPlaylistElement(trackId))
  trackEl.append(trackName)
  trackEl.append(trackAlbum)

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
  const container = document.getElementById('playlist-container')
  const playlist = document.createElement('div')
  playlist.id = 'playlist'
  container.append(playlist)
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
  let pageRange = []
  if (page - 1) pageRange.push(page - 1)
  pageRange.push(page)
  if (page + 1) pageRange.push(page + 1)
  removeTrackEls()
  window.state.page = appendTracksByPageRange(trackList)(pageRange)
  let el = document.getElementById(simpleHash(currentTrackSrc))
  el.focus()
}

// getSearchValue :: undefined -> String
export const getSearchValue = () => {
  return document.getElementById('search-input').value
}
