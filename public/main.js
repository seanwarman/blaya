import build from './store/indexModule.js'
import { playModule } from './store/playModule.js'

import { appendTracksByPage } from './helpers/index.js'
import Events, {
  onClickOrEnter,
  onClearPlaylist,
  onDownload,
  onUpload,
} from './helpers/events.js'
import KeyboardCommands from './helpers/key-commands.js'
import Player from './helpers/player.js'
import * as f from './helpers/functional-utils.js'

import {
  PLAYLISTS_STATE_KEY,
  INITIAL_PLAYLISTS_STATE,
  INITIAL_PLAYLIST
} from './constants.js'

import io from './node_modules/socket.io/client-dist/socket.io.esm.min.js'

// Service Worker (mainly for offline cacheing)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/worker-offline.js').then(
  (registration) => {

    // Dom events that need the worker...
    document.getElementById('download-button-playlist').onclick = onClickOrEnter(onDownload(registration)) 
    document.getElementById('download-button-playlist').onkeydown = onClickOrEnter(onDownload(registration)) 
    document.getElementById('upload-form').onsubmit = onUpload(registration)
    document.getElementById('clear-button-playlist').onclick = onClickOrEnter(onClearPlaylist(registration))
    document.getElementById('clear-button-playlist').onkeydown = onClickOrEnter(onClearPlaylist(registration))

    // Worker event responses...
    navigator.serviceWorker.addEventListener('message', event => {
      const { data } = event
      const { type, payload } = data

      if (type === 'DOWNLOADS_PROGRESS') {
        window.state.downloading = true
        const { tracks } = payload
        window.state.offlineTracks = [
          ...window.state.offlineTracks,
          ...tracks.filter(track => !window.state.offlineTracks.includes(track)),
        ]
      }

      if (type === 'DOWNLOADS_COMPLETE') {
        window.state.downloading = false
        registration.active.postMessage({
          type: 'SYNC_OFFLINE_TRACKS',
        })
      }

      if (type === 'SYNC_OFFLINE_TRACKS_SUCCESS') {
        const { tracks } = payload
        window.state.offlineTracks = tracks
      }

      if (type === 'DELETE_PLAYLIST_TRACKS_SUCCESS') {
        const { playlist } = payload
        const [,, tracks] = playlist
        window.state.offlineTracks = window.state.offlineTracks
          ?.filter(track => !tracks.includes(track))
      }

      if (
        type === 'DELETE_PLAYLIST_TRACKS_ERROR'
        || type === 'SYNC_OFFLINE_TRACKS_ERROR'
      ) {
        const { error } = payload
        alert(type.replaceAll(/_/, ' ') + ' :' + error.message)
      }

    })

    // Worker events to run on page load...
    registration.active.postMessage({
      type: 'SYNC_OFFLINE_TRACKS',
    })

  }).catch((error) => {
    console.error(`Service worker registration failed: ${error}`);
  });
} else {
  console.error("Service workers are not supported.");
}

window.logger = f.logger

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (stateItem) return stateItem
  return defaultInitiliser
}

// Builds tracklist ui...
build(state => {
  // Add other modules...
  state.playModule = playModule

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

  window.state = state

//   onScrollThisTrack(window.state.trackList, getTrackSearchQuery(window.location.search))()

  // Socket events
  io().on('RELOAD', () => location.reload())

  Player()
  Events()
  KeyboardCommands()
})
