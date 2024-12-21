import { defineStore } from 'pinia';

export const usePlayStore = defineStore('play', {
  state: () => ({
    currentTrack: 'thingy',
  }),
});
