import { defineStore } from 'pinia';

import { usePlayStore } from '@stores/play';

const INITIAL_PLAYLISTS_STATE = [
  {
    name: '',
    index: 0,
    tracks: [],
  },
];

export const PLAYLISTS_STATE_KEY = 'blaya__PLAYLISTS_STATE_KEY_V2';

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlistsVisible: true,
    playlistMode: true,
    currentPlaylist: 0,
    playlists: initStateItem(PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE),
  }),
  actions: {
    togglePlaylistsVisible() {
      this.playlistsVisible = !this.playlistsVisible;
    },
    togglePlaylistMode() {
      this.playlistMode = !this.playlistMode;
    },
    removeFromCurrentPlaylist(index) {
      if (!this.playlists[this.currentPlaylist]) {
        this.currentPlaylist = this.playlists.length-1;
      }
      this.playlists = this.playlists.reduce((playlists, playlist, i) => {
        if (i !== this.currentPlaylist) return [...playlists, playlist];
        return [
          ...playlists,
          {
            ...playlist,
            tracks: playlist.tracks.filter((_,tIndx) => index !== tIndx),
          },
        ];
      }, []);
    },
    pushToCurrentPlaylist(track) {
      if (!this.playlists[this.currentPlaylist]) {
        this.currentPlaylist = this.playlists.length-1;
      }
      this.playlists = this.playlists.reduce((playlists, playlist, i) => {
        if (i !== this.currentPlaylist) return [...playlists, playlist];
        return [
          ...playlists,
          {
            ...playlist,
            tracks: [
              ...playlist.tracks,
              track,
            ],
          },
        ];
      }, []);
    },
  },
});

export const playlistSubscription = ({ events }, { playlists }) => {
  if (events.key === 'playlists')  {
    window.localStorage.setItem(PLAYLISTS_STATE_KEY, JSON.stringify(playlists));
  }
};

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (stateItem) return stateItem
  return defaultInitiliser
}

