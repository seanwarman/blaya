import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { appendTracksByPage, parseTrackList } from '../helpers/index.js'
import { PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE, INITIAL_PLAYLIST } from '../constants.js'

import * as dom from '../helpers/dom.js'
import * as utils from '../helpers/utils.js'

import { playModule } from './playModule.js'
import { sequencerModule } from './sequencerModule.js'
import { stepRecordModule } from './stepRecordModule.js'

const modes = ['sequencer', 'track-player'];

export default (postHook) => {
  const state = {
    mode: 'sequencer',
    loadingTrackState: false,
    set loadingTrack(bool) {
      document.getElementById('track-loader-loading').dataset.trackLoading = bool
      this.loadingTrackState = bool
    },
    get loadingTrack() {
      return this.loadingTrackState
    },
    trackList: parseTrackList(RAW_TRACKLIST),
    playlistScrollPosition: 0,
    playlistModeState: null,
    set playlistMode(playlistMode) {
      this.playlistModeState = playlistMode
      document.body.dataset.playlistMode = playlistMode
      if (playlistMode && window.innerWidth > 768) document.getElementById('playlist-container').dataset.playlistMinimised = false
    },
    get playlistMode() {
      return this.playlistModeState
    },
    selectedPlaylistState: 0,
    get selectedPlaylist() {
      return this.selectedPlaylistState
    },
    set selectedPlaylist(i) {
      if (isNaN(Number(i))) {
        return
      }
      this.selectedPlaylistState = Number(i)
      this.playlists = this.playlistsState
    },
    refreshPlaylistsStateFromDomElements() {
      const playlistHrefs = Array.from(document.getElementById('playlist').children).reduce((hrefs, child, index) => {
        if (child.dataset?.href) return [
          ...hrefs,
          child.dataset.href,
        ]
        return [
          ...hrefs,
          ...Array.from(child.children)
            .reduce(
              (hrefs, ch) => ch.dataset?.href ? [...hrefs, ch.dataset.href] : hrefs, [],
            )
            .reverse(),
        ];
      }, []).reverse()
      this.playlistsState[this.selectedPlaylist][2] = playlistHrefs.map((href, i) => {
        if (href === this.playModule.currentTrackSrc) {
          this.playlistsState[this.selectedPlaylist][1] = i
        }
        return href
      })
      window.localStorage.setItem(PLAYLISTS_STATE_KEY, JSON.stringify(this.playlistsState))
    },
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
        if (
          !this.playlistsState[this.selectedPlaylist]
          || typeof this.playlistsState[this.selectedPlaylist][0] !== 'string'
          || typeof this.playlistsState[this.selectedPlaylist][1] !== 'number'
          || typeof this.playlistsState[this.selectedPlaylist][2]?.length !== 'number'
        ) {
          this.playlistsState[this.selectedPlaylist] = INITIAL_PLAYLIST
        }
        const [_, playlistIndex, trackList] = this.playlistsState[this.selectedPlaylist]
        trackList.forEach((track, i) =>
          dom.appendTrackElementToPlaylistById(this.trackList)(
            () =>
              this.playModule.currentTrackSrc === track
              && i === playlistIndex
          )(utils.simpleHash(track))
        )
        if (this.offlineTracks.length) {
          dom.setDownloadedClassToOfflineTracks(this.offlineTracks)
        }
      }
    },
    texts: [],
    throttleId: null,
    throttleGap: 500,
    page: 1,
    numberOfPages: 3,
    lazyLoadDebounce: false,
    searchingState: false,
    get searching() {
      return this.searchingState
    },
    set searching(searching) {
      this.searchingState = searching
      document.body.dataset.searching = searching
    },
    searchingPage: 1,
    previousScrollPositionY: 0,
    previousTrackListContainer: null,
    lastScrollTop: 0,
    offset: 5000,
    targeting: false,
    downloadingState: false,
    set downloading(downloading) {
      this.downloadingState = downloading
      document.body.dataset.downloading = downloading
    },
    get downloading() {
      return this.downloadingState
    },
    uploadingState: false,
    set uploading(uploading) {
      this.uploadingState = uploading
      document.body.dataset.uploading = uploading
      const submitButton = document.getElementById('upload-form')?.querySelector('input[type="submit"]')
      if (submitButton) submitButton.disabled = uploading
    },
    get uploading() {
      return this.uploadingState
    },
    offlineTracksState: [],
    set offlineTracks(tracks) {
      this.offlineTracksState = tracks
      Array.from(document.getElementsByClassName('downloaded')).forEach(el => el.classList.remove('downloaded'))
      dom.setDownloadedClassToOfflineTracks(tracks)
    },
    get offlineTracks() {
      return this.offlineTracksState
    },
    focussedState: [],
    set focussed(el) {
      this.focussedState.push(el)
      if (this.focussedState.length > 3) {
        this.focussedState = this.focussedState.slice(1)
      }
    },
    get focussed() {
      return this.focussedState[this.focussedState.length - 2]
    }
  }

  // Add other modules...
  state.playModule = playModule;
  state.sequencerModule = sequencerModule;
  state.stepRecordModule = stepRecordModule;

  // BEGIN
  state.page = appendTracksByPage(state.trackList)(state.page)
  state.playlists = initStateItem(PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE)
    .map((playlistItem) => !playlistItem ? INITIAL_PLAYLIST : [
      playlistItem?.[0] || '',
      playlistItem?.[1] || 0,
      playlistItem?.[2]?.filter(track => state.trackList.includes(track)) || [],
    ])
  state.playlistMode = false

  const input = document.getElementById('selected-playlist')
  if (input && input.defaultValue?.length === 0) {
    input.defaultValue = 0
  }

  return postHook(state)
}

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (stateItem) return stateItem
  return defaultInitiliser
}
