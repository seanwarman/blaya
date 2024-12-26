import { defineStore } from 'pinia';
import { Fzf } from 'fzf';

import { trackList as RAW_TRACKLIST } from '../../track-list.js'

import { parseTrackList } from '../../helpers/index.js'

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
    searching: false,
  }),
  getters: {
    trackList: state => fzfFilter(state.trackListUnFiltered)(state.search),
  },
  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track || '';
    },
    onSearch(value) {
      this.$patch({
        searching: value.length > 0,
        search: value,
      });
    },
  },
});
