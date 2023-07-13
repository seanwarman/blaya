import build from './store/indexModule.js'
import {
  onClearSearch,
  onSearch,
  onEndNext,
  onNext,
  onPrev,
  onScrollThisTrack,
  onClickOrEnter,
  onScroll,
  onUpScroll,
  onDownScroll,
  onTogglePlaylistMode,
  onClearPlaylist,
  onDownload,
  onOpenUploadModal,
  onUpload,
} from './helpers/events.js'
import { logger } from './helpers/functional-utils.js'
import { getTrackSearchQuery } from './helpers/dom.js';

import io from './node_modules/socket.io/client-dist/socket.io.esm.min.js'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/worker-offline.js").then(
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
        window.state.offlineTracks = tracks
      }

      if (type === 'DOWNLOADS_COMPLETE') {
        window.state.downloading = false
        const { tracks } = payload
        window.state.offlineTracks = tracks
      }

      if (type === 'UPLOADS_PROGRESS') {
        const { filenames, index } = payload
        const lis = Array.from(document.getElementById('upload-files-list')?.getElementsByTagName('li') || [])
        lis.forEach((li, i) => i === index && li.classList.add('downloaded'))
        if (filenames.length !== index + 1) {
          window.state.uploading = true
        } else {
          fetch('api/refresh')
            .then(() => {
              window.state.uploading = false
              if (confirm('Uploads done. Refresh track list?')) {
                window.location.reload()
              }
            })
            .catch(error => {
              console.error(error)
              window.state.uploading = false
              alert('Error uploading tracks')
            })
        }
      }

      if (type === 'SYNC_OFFLINE_TRACKS_SUCCESS') {
        const { tracks } = payload
        window.state.offlineTracks = tracks
      }

    })

    // Worker events to run on page load...
    registration.active.postMessage({
      type: 'SYNC_OFFLINE_TRACKS',
    })

  },
    (error) => {
      console.error(`Service worker registration failed: ${error}`);
    }
  );
} else {
  console.error("Service workers are not supported.");
}

window.logger = logger

// Builds tracklist ui...
build(state => {

  window.state = state

  onScrollThisTrack(window.state.trackList, getTrackSearchQuery(window.location.search))()

  // Socket events
  io().on('RELOAD', () => location.reload())

  // DOM events
  window.addEventListener('scroll', onScroll([onUpScroll(window.state.trackList), onDownScroll(window.state.trackList)]), false)
  document.getElementById('player').onended = onEndNext
  document.getElementById('next-button').onclick = onClickOrEnter(onNext)
  document.getElementById('next-button').onkeydown = onClickOrEnter(onNext)
  document.getElementById('prev-button').onclick = onClickOrEnter(onPrev)
  document.getElementById('prev-button').onkeydown = onClickOrEnter(onPrev)
  document.getElementById('current-playing-text').onclick = onClickOrEnter(onScrollThisTrack(window.state.trackList))
  document.getElementById('current-playing-text').onkeydown = onClickOrEnter(onScrollThisTrack(window.state.trackList))
  document.getElementById('search-input').oninput = onSearch(window.state.trackList)
  document.getElementById('search-input').onkeydown = e => e.stopPropagation()
  document.getElementById('clear-search-button').onclick = onClickOrEnter(onClearSearch)
  document.getElementById('clear-search-button').onkeydown = onClickOrEnter(onClearSearch)
  const onTogglePlaylistMinimised = () => {
    const playlistContainer = document.getElementById('playlist-container')
    playlistContainer.dataset.playlistMinimised = playlistContainer.dataset.playlistMinimised === 'false'
    document.getElementById('maximise-button-playlist').innerHTML = playlistContainer.dataset.playlistMinimised === 'false'
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>'
  }
  document.getElementById('maximise-button-playlist').onclick = onClickOrEnter(onTogglePlaylistMinimised)
  document.getElementById('maximise-button-playlist').onkeydown = onClickOrEnter(onTogglePlaylistMinimised)
  document.getElementById('selected-playlist').oninput = ({ target }) => {
    const { value } = target
    if (value) {
      window.state.selectedPlaylist = value
    }
  }
  document.getElementById('close-modal-button').onclick = onClickOrEnter(onOpenUploadModal)
  document.getElementById('close-modal-button').onkeydown = onClickOrEnter(onOpenUploadModal)
  document.getElementById('upload').onchange = () => {
    const files = Array.from(document.getElementById('upload').files)
    document.getElementById('upload-files-list').innerHTML = `<ol><li>${ files.map(fileItem => fileItem.name).join('</li><li>') }</li></ol>`
  }
  Array.from(document.getElementsByClassName('open-upload-modal-button')).forEach(button => {
    button.onclick = onClickOrEnter(onOpenUploadModal)
    button.onkeydown = onClickOrEnter(onOpenUploadModal)
  })
  Array.from(document.getElementsByClassName('mode-button-playlist')).forEach(button => {
    button.onclick = onClickOrEnter(onTogglePlaylistMode)
    button.onkeydown = onClickOrEnter(onTogglePlaylistMode)
  })

  // Key commands...
  const onKey = (...maps) => e => {
    maps.forEach(([key, cb]) => {
      if(
        (typeof key === 'string' && e.key === key)
        || (key.key === e.key && key.ctrlKey === e.ctrlKey)
        || (key.key === e.key && key.metaKey === e.metaKey)
      ) {
        e.preventDefault()
        cb(e)
      }
    })
  }

  document.onkeydown = onKey(
    [' ', () => {
      const player = document.getElementById('player')
      if (player.paused) {
        player.play()
      } else {
        player.pause()
      }
    }],
    ['ArrowRight', onNext],
    ['ArrowLeft', onPrev],
    [{ key: 'k', ctrlKey: true }, () => document.getElementById('search-input').focus()],
    [{ key: 'k', metaKey: true }, () => document.getElementById('search-input').focus()],
    ['Escape', () => {
      document.getElementById('search-input').blur()
      document.getElementById('upload-modal').dataset.visible = 'false'
    }],
    ['e', onTogglePlaylistMode],
    ["'", onTogglePlaylistMinimised],
  )
})
