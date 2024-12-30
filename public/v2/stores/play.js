import { defineStore } from 'pinia';
import { Fzf } from 'fzf';

import { trackList as RAW_TRACKLIST } from '../../track-list.js';

import { usePlaylistStore } from '@stores/playlist';

import { parseTrackList } from '@helpers';

const trackListUnFiltered = parseTrackList(RAW_TRACKLIST);

const fzfFilter = trackList => value => {
  if (!value.length) return trackList;
  const fzf = new Fzf(trackList, { casing: 'case-insensitive' })
  const fzfFast = new Fzf(trackList, { casing: 'case-insensitive', fuzzy: 'v1' })
  if (value.length <= 3) return fzfFast.find(value).map(({ item }) => item)
  return fzf.find(value).map(({ item }) => item)
};

export const usePlayStore = defineStore('play', {
  state: () => ({
    currentTrack: '',
    trackListUnFiltered,
    search: '',
    playingFromPlaylist: false,
    playlistTrackIndex: 0,
  }),
  getters: {
    trackList: state => fzfFilter(state.trackListUnFiltered)(state.search),
    searching: state => state.search?.length > 0,
  },
  actions: {
    nextTrack() {
      if (this.playingFromPlaylist) {
        const playlistStore = usePlaylistStore();
        const track = playlistStore.playlists[playlistStore.currentPlaylist]?.tracks?.[this.playlistTrackIndex+1];
        this.setCurrentTrack(track, { playingFromPlaylist: true, playlistTrackIndex: this.playlistTrackIndex+1 });
      } else {
        this.setCurrentTrack(this.trackList[this.trackList.findIndex(t => this.currentTrack === t)+1]);
      }
    },
    setCurrentTrack(track, options = {}) {
      const { playingFromPlaylist, playlistTrackIndex } = options;
      this.currentTrack = track || '';
      this.playingFromPlaylist = !!playingFromPlaylist;
      this.playlistTrackIndex = playlistTrackIndex || 0;
    },
    onSearch(value) {
      this.$patch({
        searching: value?.length > 0,
        search: value || '',
      });
    },
  },
});
