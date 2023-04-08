import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { appendTracksByPage, parseTrackList } from '../helpers/index.js'
import { PLAYLISTS_STATE_KEY } from '../constants.js'

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
      this.playlistsState = value
      window.localStorage.setItem(PLAYLISTS_STATE_KEY, JSON.stringify(value))
      const previousScrollPositionYPlaylist = 0 - document.getElementById('playlist').scrollTop
      dom.removePlaylistEls()
      dom.onAddToPlaylistNewOrIgnore()
      const [_, playlistIndex, trackList] = this.playlistsState[this.selectedPlaylist]
      trackList.forEach((track, i) =>
        dom.appendTrackElementToPlaylistById(this.trackList)(playlistIndex === i)(utils.simpleHash(track))
      )
      scrollTo(0, previousScrollPositionYPlaylist)
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
    pageSize: 300,
    previousTrackListContainer: null,
    lastScrollTop: 0,
    offset: 3000,
    targeting: false,
  }

  // Add other modules...
  state.playModule = playModule

  // Defaults to trigger the setters
  state.playlists = initStateItem(PLAYLISTS_STATE_KEY, [['', 0, []]])
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
