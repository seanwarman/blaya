import { usePlayStore } from '@stores/play';

import { getTrackAndAlbumFromTrackString } from '../helpers/index.js'

export default {
  computed: {
    trackAndAlbum() {
      return getTrackAndAlbumFromTrackString(usePlayStore().currentTrack);
    },
    currentTrackSrc() {
      return window.location.origin
        + '/'
        + usePlayStore().currentTrack?.split('/')?.map(section => encodeURIComponent(section))?.join('/');
    },
  },
  mounted() {
    usePlayStore().$subscribe(({ events }) => {
      if (events.key === 'currentTrack') {
        this.$refs.player.load();
        this.$refs.player.play();
      }
    });
  },
  template: `
    <link rel="stylesheet" href="./AudioControls.css" />
    <div tabindex="0" id="current-playing-text" role="link">
      <div v-for="entry of trackAndAlbum">{{ entry }}</div>
    </div>
    <audio ref="player" preload tabindex="-1" id="player" controls>
      <source id="current-track" :src="currentTrackSrc" type="audio/mpeg"></source>
    </audio>
    <button id="prev-button" role="link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M267.5 440.6c9.5 7.9 22.8 9.7 34.1 4.4s18.4-16.6 18.4-29V96c0-12.4-7.2-23.7-18.4-29s-24.5-3.6-34.1 4.4l-192 160L64 241V96c0-17.7-14.3-32-32-32S0 78.3 0 96V416c0 17.7 14.3 32 32 32s32-14.3 32-32V271l11.5 9.6 192 160z"/></svg>
    </button>
    <button id="next-button" role="link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M52.5 440.6c-9.5 7.9-22.8 9.7-34.1 4.4S0 428.4 0 416V96C0 83.6 7.2 72.3 18.4 67s24.5-3.6 34.1 4.4l192 160L256 241V96c0-17.7 14.3-32 32-32s32 14.3 32 32V416c0 17.7-14.3 32-32 32s-32-14.3-32-32V271l-11.5 9.6-192 160z"/></svg>
    </button>
  `,
}
