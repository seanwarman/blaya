export default {
  props: {
    trackName: null,
    album: null,
    tab: false,
    showAddToPlaylist: false,
    onAddToPlaylist: null,
  },
  computed: {
    containerStyles() {
      return {
        'grid-template-columns': this.showAddToPlaylist
          ? '70px auto 25%'
          : 'auto 50%',
      };
    },
  },
  methods: {
    onAddToPlaylistInternal(event) {
      event.stopPropagation();
      this.onAddToPlaylist && this.onAddToPlaylist(event);
    },
  },
  template: `
    <div role="link" class="track" :class="tab ? 'track-artist-tab track-tab' : 'track-non-tab'">
      <div :style="containerStyles" class="track-name-album-container">
        <div rol="link" @click="$event.stopPropagation()" @mouseup="onAddToPlaylistInternal" v-if="showAddToPlaylist" class="add-to-playlist" role="link">
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
