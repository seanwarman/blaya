import { defineStore } from 'pinia';

export const usePlayStore = defineStore('play', {
  state: () => ({
    currentTrack: null,
  }),
  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track;
    },
  },
});
