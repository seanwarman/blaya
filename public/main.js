import build from './store/indexModule.js';
import {
  onClearSearch,
  onSearch,
  onEndNext,
  onNext,
  onPrev,
  onScrollThisTrack,
  onClickOrEnter,
  onEnter,
  onScroll,
  onUpScroll,
  onDownScroll,
  onTogglePlaylistMode,
  onClearPlaylist,
  onDownload,
  onOpenUploadModal,
  onUpload,
  onStopPropagation,
  onAddToPlaylistFromSearch,
  onCopyPlaylist,
  onSelectUp,
  onSelectDown,
  onOpenTrackLoader,
} from './helpers/events.js';
import * as f from './helpers/functional-utils.js';
import * as dom from './helpers/dom.js';
import Sequencer, { onKeyDownGain, onKeyDownPitch } from './elements/Sequencer.js';
import SequencerControls, {
  onKeyDownPlay,
  onKeyDownRecord,
  onKeyDownChooseSequence,
} from './elements/SequencerControls.js';
import TrackLoader from './elements/TrackLoader.js';
import Samples, { onKeyDownSamples, onKeyUpSamples, onPlaySample, onStep } from './elements/Samples.js';
import Router from './elements/Router.js';
import SequencerPlaylist from './elements/SequencerPlaylist.js';

import io from './node_modules/socket.io/client-dist/socket.io.esm.min.js';

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

// Builds tracklist ui...
build(state => {

  window.state = state

  Router();
  Sequencer();
  SequencerControls();
  SequencerPlaylist();
  Samples();

  // Socket events
  io().on('RELOAD', () => location.reload())

  // DOM events
  // This is to prevent leaving, but doesn't work on android chrome...
  // window.addEventListener('beforeunload', (e) => {
  //   e.preventDefault();
  //   e.returnValue = true;
  // });
  document.addEventListener('focusin', (e) => {
    window.state.focussed = e.target
  })
  window.addEventListener('onstep', onStep);
  window.addEventListener('keydown', onKeyDownSamples);
  window.addEventListener('keydown', onKeyDownGain);
  window.addEventListener('keydown', onKeyDownPitch);
  window.addEventListener('keydown', onKeyDownPlay);
  window.addEventListener('keydown', onKeyDownRecord);
  window.addEventListener('keydown', onKeyDownChooseSequence);
  window.addEventListener('keyup', onKeyUpSamples);
  window.addEventListener('playsample', onPlaySample);
  window.addEventListener('scroll', onScroll([onUpScroll(window.state.trackList), onDownScroll(window.state.trackList)]), false)
  document.getElementById('player').onended = onEndNext;
  document.getElementById('open-track-loader-button')?.addEventListener('click', onOpenTrackLoader);
  document.getElementById('next-button').onclick = onClickOrEnter(onNext)
  document.getElementById('next-button').onkeydown = onClickOrEnter(onNext)
  document.getElementById('prev-button').onclick = onClickOrEnter(onPrev)
  document.getElementById('prev-button').onkeydown = onClickOrEnter(onPrev)
  document.getElementById('current-playing-text').onclick = onClickOrEnter(onScrollThisTrack(window.state.trackList))
  document.getElementById('current-playing-text').onkeydown = onClickOrEnter(onScrollThisTrack(window.state.trackList))
  document.getElementById('search-input').oninput = onSearch(window.state.trackList)
  // onStopPropagation stops the the other keyboard shortcuts from working...
  document.getElementById('search-input').onkeydown = onStopPropagation(onEnter(onAddToPlaylistFromSearch))
  document.getElementById('clear-search-button').onclick = onClickOrEnter(onClearSearch)
  document.getElementById('clear-search-button').onkeydown = onClickOrEnter(onClearSearch)
  const onTogglePlaylistMinimised = () => {
    const playlistContainer = document.getElementById('playlist-container')
    const minimise = playlistContainer.dataset.playlistMinimised === 'false'
    if (minimise) window.state.playlistScrollPosition = playlistContainer.scrollTop
    playlistContainer.dataset.playlistMinimised = playlistContainer.dataset.playlistMinimised === 'false'
    document.body.dataset.playlistMinimised = playlistContainer.dataset.playlistMinimised === 'true'
    document.getElementById('maximise-button-playlist').innerHTML = playlistContainer.dataset.playlistMinimised === 'false'
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>'

    if (!minimise) playlistContainer.scrollTo(0, window.state.playlistScrollPosition)
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
  document.getElementById('playlist-container').onclick = e => {
    dom.emptySelectionContainer({ reverseTracks: true })
  }
  // This prevents the above from running if clicking the buttons on the top of the playlist...
  document.getElementsByClassName('button-playlist-container')[0].onclick = e => e.stopPropagation()
  document.getElementById('copy-button-playlist').onclick = onClickOrEnter(onCopyPlaylist)
  document.getElementById('copy-button-playlist').onkeydown = onClickOrEnter(onCopyPlaylist) 

  // Key commands...
  const onKey = (...maps) => e => {
    maps.forEach(([key, cb]) => {
      if (window.state.mode !== 'track-player') return;
      if(
        (typeof key === 'string' && e.key === key)
        || (key.key === e.key && key.ctrlKey === e.ctrlKey)
        || (key.key === e.key && key.metaKey === e.metaKey)
        || (key.key === e.key && key.shiftKey === e.shiftKey)
      ) {
        e.preventDefault()
        cb(e)
      }
    })
  }

  // Adding to Tab event, have to use addEventListener to prevent overwriting
  // any original events...
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      for (const t of document.querySelectorAll('.track-name-album-container.track-selected')) {
        t.classList.remove('track-selected')
      }
    }
  })

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
    // ['ArrowDown', onSelectDown],
    // ['ArrowUp', onSelectUp],
    // [{ key: 'n', ctrlKey: true }, onSelectDown],
    // [{ key: 'p', ctrlKey: true }, onSelectUp],
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
