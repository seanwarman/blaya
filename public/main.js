import store from './store/indexModule.js'
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
} from './helpers/events.js'
import { logger } from './helpers/functional-utils.js'

import io from './node_modules/socket.io/client-dist/socket.io.esm.min.js'

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/worker-offline.js").then(
  (registration) => {
    console.log("Service worker registration succeeded:", registration);

    document.getElementById('download-button-playlist').onclick = onClickOrEnter(onDownload(registration)) 
    document.getElementById('download-button-playlist').onkeydown = onClickOrEnter(onDownload(registration)) 
    document.getElementById('upload-form').onsubmit = () => {
      const files = document.getElementById('upload').files
      console.log(`@FILTER files:`, files)
      window.state.uploading = true
      registration.active.postMessage({
        type: 'UPLOAD_FILES',
        payload: { files },
      })
    }

    // Worker events...
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
          window.state.uploading = false
          setTimeout(() => {
            if (confirm('Uploads done. Refresh track list?')) {
              window.location.reload()
            }
          }, 500)
        }
      }
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

window.state = store().state

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
document.getElementById('clear-button-playlist').onclick = onClickOrEnter(onClearPlaylist)
document.getElementById('clear-button-playlist').onkeydown = onClickOrEnter(onClearPlaylist)
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
