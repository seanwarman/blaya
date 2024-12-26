import { defineStore } from 'pinia';

import { trackList as RAW_TRACKLIST } from '../../track-list.js'

import { parseTrackList } from '../../helpers/index.js'

const trackList = parseTrackList(RAW_TRACKLIST);

export const usePlayStore = defineStore('play', {
  state: () => ({
    currentTrack: '',
    trackList,
  }),
  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track || '';
    },
  },
});
