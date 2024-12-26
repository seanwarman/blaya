import { defineStore } from 'pinia';

export const usePlayStore = defineStore('play', {
  state: () => ({
    currentTrack: '',
  }),
  actions: {
    setCurrentTrack(track) {
      this.currentTrack = track || '';
    },
  },
});
