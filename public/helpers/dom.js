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

export const flashPlaylist = () => {
  const playlistEl = document.querySelector('.button-playlist-container')
  playlistEl.classList.add('playlist-adding-track')
  setTimeout(() => {
    playlistEl.classList.remove('playlist-adding-track')
    setTimeout(() => {
      playlistEl.classList.add('playlist-adding-track')
      setTimeout(() => {
        playlistEl.classList.remove('playlist-adding-track')
      }, 100)
    }, 100)
  }, 100)
}

export const flashTrack = () => {
  const trackEl = document.querySelector('#track-list-container #page-1 > .track')
  trackEl.classList.add('track-adding-track')
  setTimeout(() => {
    trackEl.classList.remove('track-adding-track')
  }, 100)
}

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
  '<div class="track-name"><div class="name">' + track + '</div></div><div class="drag-container"><img class="svg grip" /></div>'

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

// createTrackName :: String -> Element
const createTrackName = trackString => f.AssignObject({
  className: 'track-name',
  innerHTML: '<div class="name">' + trackString + '</div>',
})(document.createElement('div'))

// createTrackElementForPlaylist :: [String] -> String -> Element
export const createTrackElementForPlaylist = trackList => playingFn => trackId => {
  const trackString = getCurrentTrackString(trackList)(trackId)

  // createTrackPlaylistElementFromDiv :: Element -> Element
  const createTrackPlaylistElementFromDiv = f.pipe(
    f.AssignObject({
      className: 'track' + (playingFn() ? ' playing' : ''),
      id: trackId,
      onmousedown: onPlayPlaylist,
      onkeydown: onClickOrEnter(onPlayPlaylist),
      role: 'link',
      tabIndex: '0',
      innerHTML: createPlaylistTrackInnerHtml(trackString),
    }),
    f.ObjectAssignDataSet({
      playlist: true,
      href: trackString
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
export const appendTrackElementToPlaylistById = trackList => playingFn => f.pipe(
  createTrackElementForPlaylist(trackList)(playingFn),
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

export const addToPlaylist = href => {
  window.state.playlists = addHrefToPlaylist(window.state.selectedPlaylist, href, window.state.playlists)
  flashTrack()
  flashPlaylist()
  // Scroll playlist to bottom to keep track of everything...
  const el = document.getElementById('playlist-container')
  el.scrollTop = el.scrollHeight
}

// onAddToPlaylist :: Event -> void
export const onAddToPlaylist = e => {
  e.stopPropagation()
  const href = e.currentTarget.parentElement.dataset.href
  if (!href) return e
  addToPlaylist(href)
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
    role: 'link',
    tabIndex: '0',
    innerHTML: '<img class="add-to-playlist-icon" />',
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
    role: 'link',
    innerHTML: '<img class="remove-from-playlist-icon" />',
    onclick: onClickOrEnter(onRemoveFromPlaylist),
    onkeydown: onClickOrEnter(onRemoveFromPlaylist),
  }),
  f.ObjectAssignDataSet({
    trackId,
  }),
)(document.createElement('div'))

// createTrackNameAlbumContainer :: Element -> Element
export const createTrackNameAlbumContainer = f.AssignObject({
  className: 'track-name-album-container',
  tabIndex: '0',
  role: 'link',
  onmousedown: onPlay,
  onkeydown: onClickOrEnter(onPlay),
})

// Create :: (String, String, String, Number) -> Element
export const Create = (trackString, classes) => {
  const trackId = simpleHash(trackString)
  const [track, album] = getTrackAndAlbumFromTrackString(trackString)

  const createTrackElementFromDiv = f.pipe(
    f.AssignObject({
      className:
        'track' +
        (window.state?.playModule?.currentTrackSrc === trackString
          ? ' playing'
          : '') +
        (window.state?.offlineTracks?.includes(trackString)
          ? ' downloaded'
          : '') +
        (classes
          ? ' ' + classes
          : ''),
      id: trackId,
    }),
    f.ObjectAssignDataSet({
      href: trackString,
    }),
    addPlayingClassIf(
      trackString === window.state?.playModule?.currentTrackSrc &&
        !window.state?.playModule?.isPlaylist
    )
  );

  const trackNameAlbumContainer =
    createTrackNameAlbumContainer(document.createElement('div'))

  const trackName = createTrackName(track)

  const trackAlbum = f.AssignObject({
    className: 'track-album',
    innerHTML: '<div class="album">' + (album || '') + '</div>',
    onmousedown: onPlay,
    onkeydown: onClickOrEnter(onPlay),
  })(document.createElement('div'))

  const trackEl = createTrackElementFromDiv(document.createElement('div'))

  trackEl.append(createAddToPlaylistElement(trackId))
  trackNameAlbumContainer.append(trackName)
  trackNameAlbumContainer.append(trackAlbum)
  trackEl.append(trackNameAlbumContainer)

  return trackEl
}

// Append :: (Number, [Element]) -> Number
export const Append = (page, newEls) => {
  console.error(page)
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
    // window.state.targeting pauses the onScroll functionality...
    window.state.targeting = true;
    document.body.insertBefore(window.state.previousTrackListContainer, footer)
    scrollTo(0, window.state.previousScrollPositionY)
    window.state.targeting = false;
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
export const scrollToTrackByTrackId = trackId => trackList => {
  let trackEl = document.getElementById(trackId)
  if (!trackEl) {
    const trackListIndex = trackList.findIndex(track => trackId === simpleHash(track))
    const [page] = pagesFromIndexRange([trackListIndex, 0])
    let pageRange = []
    if (page - 1) pageRange.push(page - 1)
    pageRange.push(page)
    if (page + 1) pageRange.push(page + 1)
    removeTrackEls()
    window.state.page = appendTracksByPageRange(trackList)(pageRange)
    trackEl = document.getElementById(trackId)
  }

  trackEl.querySelector('.track-name-album-container').focus()
  trackEl.scrollIntoView({ block: 'center' })
  window.state.playModule.focussedTrackId = trackId
}

// getSearchValue :: undefined -> String
export const getSearchValue = () => {
  return document.getElementById('search-input').value
}

// getTrackSearchQuery :: String -> String | null
export const getTrackSearchQuery = (search) => {
  if (!search.length) return null
  return search.slice(1).split('&').reduce((value, query) => {
    const [key, val] = query.split('=')
    if (key === 'track-id') return val
    return value
  }, null)
}
