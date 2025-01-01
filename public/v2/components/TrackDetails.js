import { usePlaylistStore } from '@stores/playlist';
import { usePlayStore } from '@stores/play';
import { getTrackAndAlbumFromTrackString } from '@helpers';

export default {
  props: [
    'index',
    'track',
    'tab',
    'showAddToPlaylist',
    'showRemoveFromPlaylist',
    'trackSelected',
  ],
  data() {
    return {
      x: 0,
      y: 0,
      dragging: false,
    };
  },
  methods: {
    onDrag({ movement: [x, y], dragging, ...rest }) {
      if (!this.trackSelected) return;
      this.dragging = dragging;
      if (!dragging) {
        this.x = 0;
        this.y = 0;
        usePlaylistStore().setTrackIndexFrom(this.index, this.draggedOverIndex);
        this.draggedOverIndex = null;
      } else {
        this.x = x;
        this.y = y;
        const trackHeight = this.$refs.track.clientHeight;
        const trackY = this.$refs.track.getBoundingClientRect().y;
        Array.from(document.querySelectorAll('#playlist .track-non-tab')).forEach((track, i) => {
          const rect = track.getBoundingClientRect();
          if (rect.y > trackY && rect.y < trackY+trackHeight) {
            this.draggedOverIndex = i;
          }
        });
      }
    },
    onAddToPlaylist() {
      usePlaylistStore().pushToCurrentPlaylist(this.track);
    },
    onRemoveFromPlaylist() {
      usePlaylistStore().removeFromCurrentPlaylist(this.index);
    },
  },
  computed: {
    position() {
      return this.trackSelected && this.dragging && {
        transform: `translate3d(${this.x}px, ${this.y}px, 0px)`,
        position: 'absolute',
        zIndex: 1000,
      };
    },
    trackPlaying() {
      if (this.tab) return false;
      return usePlayStore().playingFromPlaylist
        ? this.index === usePlayStore().playlistTrackIndex
        : this.track === usePlayStore().currentTrack;
    },
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
    iconMakupStyles() {
      if (this.trackPlaying) {
        return {
          marginRight: '-2rem',
        };
      }
    },
    draggedOverIndex: {
      get() {
        return usePlaylistStore().draggedOverIndex;
      },
      set(i) {
        usePlaylistStore().draggedOverIndex = i;
      },
    },
  },
  template: `
    <div
      v-drag="onDrag"
      ref="track"
      role="link"
      class="track"
      :class="tab ? 'track-artist-tab track-tab' : 'track-non-tab'"
      :class="trackSelected && 'track-selected'"
      :class="draggedOverIndex === index && 'dragover'"
      :style="position"
    >
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
        <div class="track-name" :style="iconMakupStyles">
          <span class="track-playing-icon" v-if="trackPlaying">
            <img alt="Playing icon">
          </span>
          <div class="name">{{ trackName }}</div>
        </div>
        <div class="track-album">
          <div class="album">{{ album }}</div>
        </div>
      </div>
    </div>
  `,
};
