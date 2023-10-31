import { simpleHash } from './utils.js'
import {
  onClickOrEnter,
  onPlayHandler,
  onSelectHandler,
  onSelectContextHandler,
} from './events.js'
import {
  getCurrentTrackString,
  getTrackAndAlbumFromTrackString,
  findIndexOfElement,
  pagesFromIndexRange,
  appendTracksByPageRange,
  appendTracksByPage,
  addHrefToPlaylist,
  removeTrackFromPlaylist,
} from './index.js'
import * as f from './functional-utils.js'
import SelectionContainer from '../elements/SelectionContainer.js'

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

// createTrackInnerHTMLFromTrackAndAlbum :: [String] -> String
export const createTrackInnerHTMLFromTrackAndAlbum = ([track, album]) =>
  '<div class="track-name"><div class="name">' + track + '</div></div>' + (album ? '<div class="track-album"><div class="album">' + album + '</div></div>' : '')

// createPlaylistTrackInnerHtmlFromTrackAndAlbum :: [String] -> String
export const createPlaylistTrackInnerHtmlFromTrackAndAlbum = ([track, _]) =>
  '<div class="track-name"><div class="name">' + track + '</div></div>'

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
      onclick: e => e.stopPropagation(),
      onmousedown: e => {
        const selectionContainer = document.getElementById('selection-container')
        if (selectionContainer?.contains(e.currentTarget)) return;
        emptySelectionContainer({ reverseTracks: document.getElementById('playlist').contains(selectionContainer) })
      },
      onmouseup: e => {
        onSelectHandler({
          target: document.getElementById('playlist'),
          trackContainerClass: 'track-name',
          reverseTracks: true,
          event: e,
        }, (e) => {
          onPlayHandler({
            isPlaylist: true,
            playlistIndex: findIndexOfElement(e.currentTarget)(
              document
                .getElementById('playlist')
                .getElementsByClassName('track')
            ),
            event: e,
          });
        })
      },
      oncontextmenu: (e) => {
        onSelectContextHandler({
          target: document.getElementById('playlist'),
          trackContainerClass: 'track-name',
          reverseTracks: true,
          event: e,
        })
      },
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
export const createTrackNameAlbumContainer = () => f.AssignObject({
  className: 'track-name-album-container',
  // tabIndex: '0',
  // role: 'link',
})

// Create :: (String, { Boolean, Boolean }) -> Element
export const Create = (trackString, options = {}) => {
  const { albumTab, artistTab } = options
  const trackId = simpleHash(trackString)
  const [track, album] = getTrackAndAlbumFromTrackString(trackString)

  const createTrackElementFromDiv = f.pipe(
    f.AssignObject({
      onmousedown: e => {
        const selectionContainer = document.getElementById('selection-container')
        if (selectionContainer?.contains(e.currentTarget)) return;
        emptySelectionContainer({ reverseTracks: document.getElementById('playlist').contains(selectionContainer) })
      },
      onmouseup: e => {
        if (albumTab) return
        onSelectHandler({
          target: document.getElementById('track-list-container'),
          trackContainerClass: 'track-name-album-container',
          reverseTracks: false,
          event: e,
        }, () => onPlayHandler({
          isPlaylist: false,
          event: e,
        }))
      },
      oncontextmenu: e => {
        if (albumTab) return
        onSelectContextHandler({
          target: document.getElementById('track-list-container'),
          trackContainerClass: 'track-name-album-container',
          reverseTracks: false,
          event: e,
        })
      },
      role: !albumTab ? 'link' : 'div',
      tabIndex: !albumTab ? '0' : '-1',
      className:
        'track' +
        (window.state?.playModule?.currentTrackSrc === trackString
          && !albumTab
          && !artistTab
          && !window.state?.playModule?.isPlaylist
          ? ' playing'
          : '') +
        (window.state?.offlineTracks?.includes(trackString) && !albumTab && !artistTab
          ? ' downloaded'
          : '') +
        (artistTab
          ? ' track-artist-tab'
          : '') +
        (albumTab
          ? ' track-album-tab'
          : '') +
        (artistTab || albumTab
          ? ' track-tab'
          : ' track-non-tab'),
      id: albumTab || artistTab ? '' : trackId,
    }),
    f.ObjectAssignDataSet({
      href: trackString,
    }),
  )

  const trackNameAlbumContainer =
    createTrackNameAlbumContainer()(document.createElement('div'))

  const trackName = createTrackName(track)

  const trackAlbum = f.AssignObject({
    className: 'track-album',
    innerHTML: '<div class="album">' + (album || '') + '</div>',
  })(document.createElement('div'))

  const trackEl = createTrackElementFromDiv(document.createElement('div'))

  trackNameAlbumContainer.append(trackName)
  trackNameAlbumContainer.append(trackAlbum)
  trackEl.append(trackNameAlbumContainer)
  trackEl.append(createAddToPlaylistElement(trackId))

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

export const setDownloadedClassToOfflineTracks = offlineTracks => {
  offlineTracks.forEach(track => {
    Array.from(document.querySelectorAll(`[data-href="${track}"]`)).forEach(el => el.classList.add('downloaded'))
  })
}

export const findParentByClassName = (className, el) => {
  if (!el) return null
  let fuse = 0
  let searchEl = el
  while (
    !searchEl?.classList?.contains(className)
    && searchEl
    && fuse < 6
  ) {
    searchEl = searchEl.parentElement
    fuse++
  }
  return searchEl
}

export const appendChildren = children => el => {
  if (children?.length) {
    el.append(...children)
  }
  return el
}

export const element = tag => ({ children, dataset, ...props }) => f.pipe(
  f.AssignObject(props),
  f.ObjectAssignDataSet(dataset),
  appendChildren(children),
)(document.createElement(tag))

export const img = element('img')

export const div = element('div')

export const ul = element('ul')

export const li = element('li')

export function emptySelectionContainer({ reverseTracks }) {
  const trackListContainer = document.getElementById('track-list-container')
  const playlist = document.getElementById('playlist')
  for (const container of [playlist, trackListContainer]) {
    const selections = container.querySelectorAll('#selection-container')
    for (let selection of selections) {
      const children = Array.from(selection?.children || [])
      if (reverseTracks) children.reverse()
      children.map(child => {
        return selection.parentElement.insertBefore(child, selection)
      })
      selection?.remove()
      selection = null
    }
    // Use querySelectorAll rather than getElementsByClassName sometimes,
    // eventhough it's slower, it's more thorougher. getElementsByClassName
    // misses some elements sometimes...
    for (const t of container.querySelectorAll('.track-selected')) {
      t.classList.remove('track-selected')
    }
  }
  Array.from(document.querySelectorAll('#menu-container')).map(el => el.remove())
  // Array.from(document.getElementsByClassName('play-ready')).map(el => el.classList.remove('play-ready'))
}

export function insertTracksIntoSelectionContainer(tracks) {
  const selectionContainer = SelectionContainer()
  // Insert the selection container before the first selected track...
  tracks[0].parentElement
    .insertBefore(
      selectionContainer,
      tracks[0],
    )
  // Move the selected tracks inside the container...
  for (const track of tracks) {
    track.classList?.add('track-selected')
    selectionContainer
      .append(
        track,
      )
  }
  tracks[tracks?.length - 1]?.focus()
  return selectionContainer
}
