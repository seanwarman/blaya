import { usePlaylistStore } from '@stores/playlist';
import { getTrackAndAlbumFromTrackString } from '@helpers';

export default {
  props: [
    'index',
    'track',
    'tab',
    'showAddToPlaylist',
    'showRemoveFromPlaylist',
  ],
  methods: {
    onAddToPlaylist() {
      usePlaylistStore().pushToCurrentPlaylist(this.track);
    },
    onRemoveFromPlaylist() {
      usePlaylistStore().removeFromCurrentPlaylist(this.index);
    },
  },
  computed: {
    containerStyles() {
      return {
        'grid-template-columns': this.playlistMode && !this.tab
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
    playlistMode() {
      return usePlaylistStore().playlistMode;
    },
  },
  template: `
    <div role="link" class="track" :class="tab ? 'track-artist-tab track-tab' : 'track-non-tab'">
      <div :style="containerStyles" class="track-name-album-container">
        <div
          v-if="playlistMode && showRemoveFromPlaylist"
          rol="link"
          @click.stop
          @mouseup.stop="onRemoveFromPlaylist"
          class="playlist-icon"
        >
          <img class="remove-from-playlist-icon">
        </div>
        <div
          v-if="playlistMode && showAddToPlaylist"
          rol="link"
          @click.stop
          @mouseup.stop="onAddToPlaylist"
          class="playlist-icon"
        >
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
