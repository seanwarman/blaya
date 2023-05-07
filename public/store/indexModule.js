import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { trackList as RAW_SORTED_TRACKLIST } from '../track-list-sorted.js'
import { appendTracksByPage, parseTrackList } from '../helpers/index.js'
import { OFFLINE_TRACKS_KEY, PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE } from '../constants.js'

import * as dom from '../helpers/dom.js'
import * as utils from '../helpers/utils.js'

import { playModule } from './playModule.js'

function setDownloadedClassToOfflineTracks(offlineTracks) {
  offlineTracks.forEach(track => {
    Array.from(document.querySelectorAll(`[data-href="${track}"]`)).forEach(el => el.classList.add('downloaded'))
  })
}

export default () => {
  const state = {
    trackList: parseTrackList(RAW_SORTED_TRACKLIST),
    playlistModeState: null,
    set playlistMode(playlistMode) {
      this.playlistModeState = playlistMode
      document.body.dataset.playlistMode = playlistMode
      if (playlistMode) document.getElementById('playlist-container').dataset.playlistMinimised = false
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
          dom.appendTrackElementToPlaylistById(this.trackList)(
            () =>
              this.playModule.currentTrackSrc === track
              && i === playlistIndex
          )(utils.simpleHash(track))
        )
        if (this.offlineTracks.length) {
          setDownloadedClassToOfflineTracks(this.offlineTracks)
        }
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
      window.localStorage.setItem(OFFLINE_TRACKS_KEY, JSON.stringify(tracks))
      Array.from(document.getElementsByClassName('downloaded')).forEach(el => el.classList.remove('downloaded'))
      setDownloadedClassToOfflineTracks(tracks)
    },
    get offlineTracks() {
      return this.offlineTracksState
    },
  }

  // Add other modules...
  state.playModule = playModule

  // BEGIN
  state.page = appendTracksByPage(state.trackList)(state.page)
  // Defaults to trigger the setters
  state.offlineTracks = initStateItem(OFFLINE_TRACKS_KEY, [])
  state.playlists = initStateItem(PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE)
  state.playlistMode = false

  return { state }
}

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (stateItem) return stateItem
  return defaultInitiliser
}
