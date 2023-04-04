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
      isPlaylist: false,
      trackHistory: [],
      setTrackHistory({ src, isPlaylist, playlistIndex, selectedPlaylist }) {
        this.trackHistory.push({
          src,
          isPlaylist,
          playlistIndex: isPlaylist ? playlistIndex : null,
          selectedPlaylist: isPlaylist ? selectedPlaylist : null,
        })
      },
      trackHistoryPrevious() {
        const { src, isPlaylist, playlistIndex, selectedPlaylist } = this.trackHistory.pop()
        this.setTrack({
          src, 
          isPlaylist,
          playlistIndex,
          selectedPlaylist,
          withHistory: false,
        })
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
      setTrack({ src, isPlaylist, playlistIndex, selectedPlaylist = null, withHistory = true }) {
        if (selectedPlaylist !== null) state.selectedPlaylist = selectedPlaylist
        this.currentTrackSrc = src
        this.isPlaylist = !!isPlaylist
        if (!!isPlaylist) state.playlists[state.selectedPlaylist][1] = playlistIndex
        if (withHistory) {
          this.setTrackHistory({
            src,
            isPlaylist,
            playlistIndex: playlistIndex,
            selectedPlaylist: state.selectedPlaylist,
          })
        }
      },
      nextTrack() {
        if (this.isPlaylist) {
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
        this.setTrackHistory({
          src: this.currentTrackSrc,
          isPlaylist: false,
        })
      },
      nextTrackPlaylist() {
        const [_, playlistIndex, playlist] = state.playlists[state.selectedPlaylist]
        const trackList = playlist
        const i = playlistIndex
        if (trackList[i+1]) {
          this.currentTrackSrc = trackList[i+1]
          state.playlists[state.selectedPlaylist][1] = i+1
          this.setTrackHistory({
            src: trackList[i+1],
            isPlaylist: true,
            playlistIndex: playlistIndex,
            selectedPlaylist: state.selectedPlaylist,
          })
        }
      },
      inHistory: false,
      prevTrack() {
        // This prevents the user from having to press back twice on the first
        // go...
        if (
          this.inHistory && this.trackHistory.length > 0
          || !this.inHistory && this.trackHistory.length > 1
        ) {
          if (!this.inHistory) this.trackHistory.pop()
          this.inHistory = true
          this.trackHistoryPrevious()
        } else if (this.isPlaylist) {
          this.inHistory = false
          this.prevTrackPlaylist()
        } else {
          this.inHistory = false
          this.prevTrackTrackList()
        }
      },
      prevTrackPlaylist() {
        const [_, playlistIndex, playlist] = state.playlists[state.selectedPlaylist]
        const i = playlistIndex
        if (playlist[i-1]) {
          this.currentTrackSrc = playlist[i-1]
          state.playlists[state.selectedPlaylist][1] = i-1
        }
      },
      prevTrackTrackList() {
        const trackList = state.trackList
        const i = trackList.findIndex(t => t === this.currentTrackSrc)
        if (trackList[i-1]) {
          this.currentTrackSrc = trackList[i-1]
        }
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
  if (stateItem) return stateItem
  return defaultInitiliser
}
