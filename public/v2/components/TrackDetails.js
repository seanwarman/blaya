import { getTrackAndAlbumFromTrackString } from '@helpers';

export default {
  props: {
    track: null,
    tab: false,
    showAddToPlaylist: false,
  },
  computed: {
    containerStyles() {
      return {
        'grid-template-columns': this.showAddToPlaylist
          ? '70px auto 25%'
          : 'auto 50%',
      };
    },
    trackName() {
      return getTrackAndAlbumFromTrackString(this.track)[0];
    },
    album() {
      return getTrackAndAlbumFromTrackString(this.track)[1];
    },
  },
  template: `
    <div role="link" class="track" :class="tab ? 'track-artist-tab track-tab' : 'track-non-tab'">
      <div :style="containerStyles" class="track-name-album-container">
        <div rol="link" @click.stop @mouseup.stop="$emit('addToPlaylist', { ...$event, track })" v-if="showAddToPlaylist" class="add-to-playlist">
          <img class="add-to-playlist-icon">
        </div>
        <div class="track-name">
          <div class="name">{{ trackName }}</div>
        </div>
        <div class="track-album">
          <div class="album">{{ album }}</div>
        </div>
      </div>
    </div>
  `,
};
