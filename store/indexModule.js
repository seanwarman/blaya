import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { appendTracksByPage, parseTrackList } from '../helpers/index.js'
import { PLAYLISTS_STATE_KEY } from '../constants.js'

import * as dom from '../helpers/dom.js'
import * as utils from '../helpers/utils.js'

import { playModule } from './playModule.js'

export default () => {
  const state = {
    trackList: parseTrackList(RAW_TRACKLIST),
    selectedPlaylist: 0,
    playlistsState: undefined,
    get playlists() {
      return this.playlistsState
    },
    set playlists(value) {
      this.playlistsState = value
      window.localStorage.setItem(PLAYLISTS_STATE_KEY, JSON.stringify(value))
      dom.removePlaylistEls()
      dom.onAddToPlaylistNewOrIgnore()
      for (const track of this.playlistsState[this.selectedPlaylist][2]) {
        dom.appendTrackElementToPlaylistById(this.trackList)(utils.simpleHash(track))
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
    pageSize: 300,
    previousTrackListContainer: null,
    lastScrollTop: 0,
    offset: 3000,
    targeting: false,
  }

  state.playModule = playModule
  state.playlists = initStateItem(PLAYLISTS_STATE_KEY, [['', 0, []]])

  // BEGIN
  state.page = appendTracksByPage(state.trackList)(1)

  return { state }
}

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (stateItem) return stateItem
  return defaultInitiliser
}
