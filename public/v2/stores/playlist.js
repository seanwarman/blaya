import { defineStore } from 'pinia';

const INITIAL_PLAYLISTS_STATE = [
  {
    name: '',
    index: 0,
    tracks: [],
  },
];

export const PLAYLISTS_STATE_KEY = 'blaya__PLAYLISTS_STATE_KEY_V2';

export const usePlaylistStore = defineStore('playlist', {
  state: () => {
    return {
      playlistsVisible: true,
      playlistMode: false,
      currentPlaylist: 0,
      playlists: initStateItem(PLAYLISTS_STATE_KEY, INITIAL_PLAYLISTS_STATE),
      draggedOverIndex: null,
      selectedTrackIndex: null,
      selectedTrackIndexes: [],
      scrollLock: false,
      trackPositionX: 0,
      scrollTop: 0,
      stop: false,
      tracker: 0,
      scrollOffset: 0,
    };
  },
  actions: {
    scroll(playlists, step) {
      playlists.scrollTo(0, playlists.scrollTop + step);
      if (!this.stop) {
        setTimeout(() => {
          this.scroll(playlists, step);
        }, 100);
      }
    },
    trackScroll(y) {
      const step = 3;
      const playlists = document.getElementById('playlists');
      const plHeight = playlists.clientHeight;
      if (y > playlists.scrollHeight) {
        this.stop = true;
      } else if (y > plHeight-100) {
        this.stop = false;
        this.scroll(playlists, step);
      } else if (playlists.scrollTop > 0 && y < 100) {
        this.stop = false;
        this.scroll(playlists, -step);
      } else {
        this.stop = true;
      }
    },
    moveTracks(from) {
      this.stop = true;
      if (from === this.draggedOverIndex) {
        this.draggedOverIndex = null;
        window.getSelection().removeAllRanges();
        return;
      }
      const tracks = this.playlists[this.currentPlaylist].tracks.splice(from, this.selectedTrackIndexes.length);
      const to = this.draggedOverIndex > from
        ? this.draggedOverIndex - (tracks.length-1)
        : this.draggedOverIndex;
      this.playlists[this.currentPlaylist].tracks.splice(to, 0, ...tracks);
      this.selectedTrackIndex = to;
      this.selectedTrackIndexes = tracks.map((_,i) => i + to);
      this.draggedOverIndex = null;
      window.getSelection().removeAllRanges();
    },
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
    setSelectedPlaylistName(name) {
      this.playlists[this.currentPlaylist].name = name;
    },
    newPlaylist() {
      this.playlists = this.playlists.concat({ name: '', index: this.playlists.length, tracks: [] });
      this.currentPlaylist = this.playlists.length-1
    },
    deleteCurrentPlaylist() {
      if (this.playlists.length > 1) {
        const currentPlaylist = this.currentPlaylist;
        this.playlists = this.playlists.filter((_,i) => i !== currentPlaylist);
        this.currentPlaylist = currentPlaylist === 0
          ? 0 : currentPlaylist - 1;
      }
    },
  },
  getters: {
    selectedPlaylist: state => state.playlists[state.currentPlaylist],
    scrollTracker: state => state.scrollTop - state.scrollOffset,
  },
});

export const playlistSubscription = ({ events }, { playlists }) => {
  if ([
    'playlists',
    'name',
    'selectedTrackIndex',
  ].includes(events.key))  {
    window.localStorage.setItem(PLAYLISTS_STATE_KEY, JSON.stringify(playlists));
  }
};

function initStateItem(key, defaultInitiliser) {
  const stateItem = JSON.parse(window.localStorage.getItem(key))
  if (stateItem) return stateItem
  return defaultInitiliser
}

