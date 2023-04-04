import { getTrackAndAlbumFromTrackString } from '../helpers/index.js'
import * as f from '../helpers/functional-utils.js'

export const removeClassFromAll = className => f.pipe(
  className => document.getElementsByClassName(className),
  Array.from,
  f.map(el => el.classList.remove(className)),
)(className)

export const playModule = {
  isPlaylist: false,
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
  setTrack({ src, isPlaylist = false, playlistIndex = null, selectedPlaylist = null, withHistory = true }) {
    // Manage the state items...
    if (selectedPlaylist !== null) state.selectedPlaylist = selectedPlaylist
    this.currentTrackSrc = src
    this.isPlaylist = !!isPlaylist
    if (isPlaylist) state.playlists[state.selectedPlaylist][1] = playlistIndex

    // Set the history...
    if (withHistory) {
      this.setTrackHistory({
        src,
        isPlaylist,
        playlistIndex: playlistIndex,
        selectedPlaylist: state.selectedPlaylist,
      })
    }

    // Update the UI...
    removeClassFromAll('playing')
    if (isPlaylist) {
      const playlistEl = document.getElementById('playlist').querySelector(`[data-href="${src}"]`)
      if (playlistEl) playlistEl.classList.add('playing')
    } else {
      const trackListEl = document.querySelector(`[data-href="${src}"]`)
      if (trackListEl) trackListEl.classList.add('playing')
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
      this.setTrack({ src: trackList[i+1], isPlaylist: false })
    }
  },
  nextTrackPlaylist() {
    const [_, playlistIndex, playlist] = state.playlists[state.selectedPlaylist]
    const i = playlistIndex
    if (playlist[i+1]) {
      this.setTrack({ src: playlist[i+1], playlistIndex: i+1, isPlaylist: true })
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
      this.setTrack({
        src: playlist[i-1],
        playlistIndex: i-1,
        isPlaylist: true,
        withHistory: false,
      })
    }
  },
  prevTrackTrackList() {
    const trackList = state.trackList
    const i = trackList.findIndex(t => t === this.currentTrackSrc)
    if (trackList[i-1]) {
      this.setTrack({ src: trackList[i-1], withHistory: false })
    }
  },
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
}