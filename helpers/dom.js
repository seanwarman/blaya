import { simpleHash } from './utils.js'
import { onClickOrEnter, onPlay } from './events.js'
import { getTrackAndAlbumFromId, pagesFromIndexRange, replaceAllWithThreePages } from './index.js'

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

// Create :: (String, String, String, Number) -> Element
export const Create = (tag, text, href, i) => {
  const newEl = document.createElement(tag)
  newEl.className = 'track'
  newEl.role = 'link'
  newEl.dataset.href = href
  newEl.tabIndex = '0'
  newEl.id = simpleHash(text)
  if (newEl.id === window.state.currentTrackId) newEl.classList.add('playing')
  const [track, album] = text.slice(9, -4).split('/').reverse()
  if (/#/.test(track) || /#/.test(album)) {
    // delete newEl
    return
  }
  newEl.innerHTML = '<div class="track-name">' + track + '</div>' + (album ? '<div class="track-album">' + album + '</div>' : '')
  newEl.onclick = onClickOrEnter(onPlay)
  newEl.onkeydown = onClickOrEnter(onPlay)
  return newEl
}

// Append :: (Number, [Element]) -> Number
export const Append = (page, newEls) => {
  console.log(`append @FILTER page:`, page)
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
