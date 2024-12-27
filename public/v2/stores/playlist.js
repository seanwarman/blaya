import { defineStore } from 'pinia';

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlistMode: false,
    currentPlaylist: 0,
    playlists: [
      {
        name: '',
        index: 0,
        tracks: [],
      },
    ],
  }),
  actions: {
    togglePlaylistMode() {
      this.playlistMode = !this.playlistMode;
    },
    pushToCurrentPlaylist(track) {
      if (!this.playlists[this.currentPlaylist]) {
        this.currentPlaylist = this.playlists.length-1;
      }
      this.playlists[this.currentPlaylist].tracks.push(track);
      console.log(`@FILTER this.playlists:`, this.playlists)
    },
  },
});
