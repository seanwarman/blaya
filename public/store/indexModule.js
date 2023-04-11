import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { appendTracksByPage, parseTrackList } from '../helpers/index.js'
import { PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE } from '../constants.js'

import * as dom from '../helpers/dom.js'
import * as utils from '../helpers/utils.js'

import { playModule } from './playModule.js'

export default () => {
  const state = {
    trackList: parseTrackList(RAW_TRACKLIST),
    playlistModeState: null,
    set playlistMode(playlistMode) {
      this.playlistModeState = playlistMode
      document.body.dataset.playlistMode = playlistMode
    },
    get playlistMode() {
      return this.playlistModeState
    },
    selectedPlaylist: 0,
    playlistsState: undefined,
    get playlists() {
      return this.playlistsState
    },
    set playlists(value) {
      dom.removePlaylistEls()
      if (!value) {
        this.playlistsState = INITIAL_PLAYLISTS_STATE
        window.localStorage.setItem(PLAYLISTS_STATE_KEY, JSON.stringify(INITIAL_PLAYLISTS_STATE))
      } else {
        this.playlistsState = value
        window.localStorage.setItem(PLAYLISTS_STATE_KEY, JSON.stringify(value))
        const [_, playlistIndex, trackList] = this.playlistsState[this.selectedPlaylist]
        trackList.forEach((track, i) =>
          dom.appendTrackElementToPlaylistById(this.trackList)(playlistIndex === i)(utils.simpleHash(track))
        )
      }
    },
    texts: [],
    throttleId: null,
    throttleGap: 500,
    page: 1,
    numberOfPages: 3,
    lazyLoadDebounce: false,
    searching: false,
    searchingPage: 1,
    previousScrollPositionY: 0,
    pageSize: 100,
    previousTrackListContainer: null,
    lastScrollTop: 0,
    offset: 5000,
    targeting: false,
    offlineState: false,
    set offline(offline) {
      this.offlineState = offline
      this.playlists = this.playlists
    },
    get offline() {
      return this.offlineState
    },
  }

  // Add other modules...
  state.playModule = playModule

  // Defaults to trigger the setters
  state.playlists = initStateItem(PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE)
  state.playlistMode = false

  // BEGIN
  state.page = appendTracksByPage(state.trackList)(state.page)

  return { state }
}

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (stateItem) return stateItem
  return defaultInitiliser
}
