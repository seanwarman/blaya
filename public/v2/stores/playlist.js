import { defineStore } from 'pinia';

const defaultPlaylists = [
  {
    name: '',
    index: 0,
    tracks: ["music/01 - Chris Avantgarde, Anyma (ofc) - Eternity (Extended Mix).mp3","music/01 Everything I own by Ken Boothe 1974 Trojan TRLS95 DMk1.mp3"],
  },
];

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlistsVisible: true,
    playlistMode: false,
    currentPlaylist: 0,
    playlists: [
      {
        name: '',
        index: 0,
        tracks: ["music/01 - Chris Avantgarde, Anyma (ofc) - Eternity (Extended Mix).mp3","music/01 Everything I own by Ken Boothe 1974 Trojan TRLS95 DMk1.mp3"],
      },
    ],
  }),
  actions: {
    togglePlaylistsVisible() {
      this.playlistsVisible = !this.playlistsVisible;
    },
    togglePlaylistMode() {
      this.playlistMode = !this.playlistMode;
    },
    pushToCurrentPlaylist(track) {
      if (!this.playlists[this.currentPlaylist]) {
        this.currentPlaylist = this.playlists.length-1;
      }
      this.playlists[this.currentPlaylist].tracks.push(track);
    },
  },
});
