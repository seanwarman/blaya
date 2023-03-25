import { simpleHash } from './utils.js'
import { onClickOrEnter, onPlay } from './events.js'
import {
  getCurrentTrackString,
  getTrackAndAlbumFromTrackString,
  getTrackAndAlbumFromId,
  pagesFromIndexRange,
  replaceAllWithThreePages,
} from './index.js'
import { ObjectAssign, ObjectAssignDataSet, pipe } from './functional-utils.js'

// addPlayingClassIf :: Element -> Boolean -> Element
export const addPlayingClassIf = condition => element => {
  if (condition) {
    return classListAdd('playing')(element)
  }
  return element
}

// createTrackInnerHTMLFromTrackAndAlbum :: [String] -> String
export const createTrackInnerHTMLFromTrackAndAlbum = ([track, album]) =>
  '<div class="track-name">' + track + '</div>' + (album ? '<div class="track-album">' + album + '</div>' : '')

// createTrackInnerHTML :: String -> String
export const createTrackInnerHTML = pipe(
  getTrackAndAlbumFromTrackString,
  createTrackInnerHTMLFromTrackAndAlbum,
)

// createTrackElementForPlaylist :: [String] -> String -> Element
export const createTrackElementForPlaylist = trackList => trackId => {
  const trackString = getCurrentTrackString(trackList)(trackId)

  // createTrackPlaylistElementFromDiv :: Element -> Element
  const createTrackPlaylistElementFromDiv = pipe(
    ObjectAssign({
      className: 'track',
      role: 'link',
      tabIndex: '0',
      id: 'playlist__' + trackId,
      innerHTML: createTrackInnerHTML(trackString),
      onclick: onClickOrEnter(onPlay),
      onkeydown: onClickOrEnter(onPlay),
    }),
    ObjectAssignDataSet({
      histId: trackId,
      href: trackString,
    }),
    addPlayingClassIf(trackId === window.state.currentTrackId),
  )

  const playlistEl = createTrackPlaylistElementFromDiv(document.createElement('div'))

  playlistEl.firstChild.prepend(createAddToPlaylistElement(document.createElement('div')))

  return playlistEl
}

// appendTrackElementToPlaylist :: Element -> Element
export const appendTrackElementToPlaylist = element => {
  const hist = document.getElementById('playlist')
  hist.append(element)
  return hist
}

// appendTrackElementToPlaylistbyId :: trackId -> Element
export const appendTrackElementToPlaylistById = trackList => pipe(
  createTrackElementForPlaylist(trackList),
  appendTrackElementToPlaylist,
)

// playHead :: String -> Element
export const playHead = src => {
  const sourcer = document.getElementById('current-track')
  sourcer.src = src
  const player = document.getElementById('player')
  return player
}

// updateCurrentTrack :: String -> undefined
export const updateCurrentTrack = nextTrackId => {
  const playingEls = document.getElementsByClassName('playing')
  if (playingEls.length) {
    for (let el of playingEls) {
      el.classList.remove('playing')
    }
  }

  window.state.currentTrackId = nextTrackId
  const element = document.getElementById(nextTrackId)
  if (element) {
    element.classList.add('playing')
  }
  const [track, album] = getTrackAndAlbumFromId(window.state.trackList)(nextTrackId)
  document.getElementById('current-playing-text').innerHTML = `<div>${track}</div><div>${album}</div>`
}

export const onAddToPlaylist = e => {
  e.stopPropagation()
  return appendTrackElementToPlaylistById(window.state.trackList)(e.currentTarget.dataset.trackId)
}

// createAddToPlaylistElement :: String -> Element
export const createAddToPlaylistElement = trackId => pipe(
  ObjectAssign({
    id: 'add-to-playlist__' + trackId,
    className: 'add-to-playlist',
    tabIndex: '0',
    innerHTML: '<img style="height:1.5rem;" src="public/icons/plus-solid.svg" />',
    onclick: onClickOrEnter(onAddToPlaylist),
    onkeydown: onClickOrEnter(onAddToPlaylist),
  }),
  ObjectAssignDataSet({
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

  const createTrackElementFromDiv = pipe(
    ObjectAssign({
      className: 'track',
      role: 'link',
      tabIndex: '0',
      id: trackId,
      innerHTML: createTrackInnerHTMLFromTrackAndAlbum([track, album]),
      onclick: onClickOrEnter(onPlay),
      onkeydown: onClickOrEnter(onPlay),
    }),
    ObjectAssignDataSet({
      href: trackString,
    }),
    addPlayingClassIf(trackId === window.state.currentTrackId),
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
  window.state.texts = newEls.map(({ innerText }) => innerText)
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


// playTrack :: Element -> undefined
export const playTrack = (element) => {
  document.getElementById('current-track').src = element.getAttribute('data-href')
  const player = document.getElementById('player')
  player.pause()
  player.load()
  updateCurrentTrack(element.id)
  player.play()
}


// afterSearchReset :: undefined -> undefined
export const afterSearchReset = () => {
  window.state.searching = false
  document.getElementById('track-list-container').remove()
  const footer = document.getElementsByTagName('footer')[0]
  document.body.insertBefore(window.state.previousTrackListContainer, footer)
  scrollTo(0, window.state.previousScrollPositionY)
}

// createPageElement :: Number => Element
export const createPageElement = page => {
  const div = document.createElement('div')
  div.id = 'page-' + page
  return div
}

// scrollToTrackByTrackId :: Number -> [String] -> undefined
export const scrollToTrackByTrackId = trackId => trackList => {
  const trackListIndex = trackList.findIndex(track => trackId === simpleHash(track))
  const [page] = pagesFromIndexRange([trackListIndex, 0])
  window.state.page = replaceAllWithThreePages(trackList)(page)
  let el = document.getElementById(trackId)
  el.focus()
}

// getSearchValue :: undefined -> String
export const getSearchValue = () => {
  return document.getElementById('search-input').value
}
