import { trackList as RAW_TRACKLIST } from './track-list.js'
import {
  appendTracksByPage,
  parseTrackList,
  getTrackAndAlbumFromTrackString,
} from './helpers/index.js'
import {
  PLAYLISTS_STATE_KEY,
} from './constants.js'

import * as dom from './helpers/dom.js'
import * as utils from './helpers/utils.js'

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
    playModule: {
      playlist: false,
      setTrack({ src, playlist, playlistIndex }) {
        this.currentTrackSrc = src
        this.playlist = !!playlist
        if (!!playlist) state.playlists[state.selectedPlaylist][1] = playlistIndex
      },
      nextTrack() {
        if (this.playlist) {
          this.nextTrackPlaylist()
        } else {
          this.nextTrackTrackList()
        }
      },
      nextTrackTrackList() {
        const trackList = state.trackList
        const i = trackList.findIndex(t => t === this.currentTrackSrc)
        if (trackList[i+1]) {
          this.currentTrackSrc = trackList[i+1]
        }
      },
      nextTrackPlaylist() {
        const [_, playlistIndex, playlist] = state.playlists[state.selectedPlaylist]
        const trackList = playlist
        const i = playlistIndex
        if (trackList[i+1]) {
          this.currentTrackSrc = trackList[i+1]
          state.playlists[state.selectedPlaylist][1] = i+1
        }
      },
      currentTrackSrcState: null,
      get currentTrackSrc() {
        return this.currentTrackSrcState
      },
      set currentTrackSrc(src) {
        this.currentTrackSrcState = src
        document.getElementById('current-track').src = src
        const player = document.getElementById('player')
        if (!player.paused) {
          player.pause()
          player.load()
          player.play()
        } else {
          player.load()
        }
        const [track, album] = getTrackAndAlbumFromTrackString(src)
        document.getElementById('current-playing-text').innerHTML = `<div>${track}</div><div>${album}</div>`
      },
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

  state.playlists = initStateItem(PLAYLISTS_STATE_KEY, [['', 0, []]])

  // BEGIN
  state.page = appendTracksByPage(state.trackList)(1)

  return { state }
}

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (
    stateItem
    && typeof stateItem[0] === 'string'
    && typeof stateItem[1] === 'object'
    && typeof stateItem[2] === 'object'
  ) return stateItem
    return defaultInitiliser
}
