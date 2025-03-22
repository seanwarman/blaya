import { usePlaylistStore } from '@stores/playlist';
import { usePlayStore } from '@stores/play';
import { getTrackAndAlbumFromTrackString } from '@helpers';

export default {
  emits: ['selectTrack', 'clickTrack'],
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
      draggingState: false,
    };
  },
  methods: {
    onAddToPlaylist() {
      usePlaylistStore().pushToCurrentPlaylist(this.track);
    },
    onRemoveFromPlaylist() {
      usePlaylistStore().removeFromCurrentPlaylist(this.index);
    },
    onDrag({ movement: [x, y], dragging, tap }) {
      if (tap || !this.trackSelected) {
        this.dragging = false;
        return;
      }
      if (!this.dragging) {
        usePlaylistStore().scrollOffset = document.getElementById('playlists').scrollTop;
      }
      this.dragging = dragging;
      usePlaylistStore().scrollLock = dragging;
      if (!dragging) {
        this.x = 0;
        this.y = 0;
        usePlaylistStore().moveTracks(this.index);
      } else {
        this.x = x;
        this.y = y;
        const trackHeight = this.$refs.track.clientHeight;
        const trackY = this.$refs.track.getBoundingClientRect().y;
        usePlaylistStore().trackScroll(trackY);
        const trackPlaceholder = this.$refs.placeholder;
        const placeholderY = trackPlaceholder.getBoundingClientRect().y;
        if (placeholderY > trackY && placeholderY < trackY+trackHeight) {
          this.draggedOverIndex = this.index;
        } else {
          Array.from(document.querySelectorAll('#playlist .track-non-tab')).forEach((track, i) => {
            const rect = track.getBoundingClientRect();
            if (rect.y > trackY && rect.y < trackY+trackHeight) {
              this.draggedOverIndex = i;
            }
          });
        }
      }
    },
    onMouseDown() {
      usePlaylistStore().trackPositionX = this.$refs.track.getBoundingClientRect().top;
    },
  },
  computed: {
    scrollTracker: {
      get() {
        return usePlaylistStore().scrollTracker;
      },
      set(y) {
        usePlaylistStore().scrollTracker = y;
      },
    },
    dragging: {
      get() {
        return this.draggingState;
      },
      set(dragging) {
        this.draggingState = dragging;
        usePlaylistStore().scrollLock = dragging;
      },
    },
    draggedOverIndex: {
      get() {
        return usePlaylistStore().draggedOverIndex;
      },
      set(i) {
        usePlaylistStore().draggedOverIndex = i;
      },
    },
    position() {
      return this.trackSelected && this.dragging && {
        transform: `translate3d(${this.x}px, ${this.y + this.scrollTracker}px, 0px)`,
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
    selectedTrackIndex() {
      return usePlaylistStore().selectedTrackIndex;
    },
    trackClasses() {
      return {
        'track-artist-tab track-tab': this.tab,
        'track-non-tab': !this.tab,
        'track-selected': this.trackSelected,
      };
    },
    dragoverClasses() {
      return {
        'dragover': this.draggedOverIndex === this.index && this.index >= this.selectedTrackIndex,
        'dragover-top': this.draggedOverIndex === this.index && this.index < this.selectedTrackIndex,
      };
    },
    aTrackIsBeingDragged() {
      return typeof this.draggedOverIndex === 'number';
    },
    thisIsOneOfAnyTracksBeingDragged() {
      return this.dragging || (this.trackSelected && this.aTrackIsBeingDragged);
    },
    hideWhileDraggingUnlessThisTrackIsTheDragAnchor() {
      return !this.thisIsOneOfAnyTracksBeingDragged || this.dragging;
    },
  },
  template: `
    <div
      v-show="hideWhileDraggingUnlessThisTrackIsTheDragAnchor"
      ref="track"
      v-drag="onDrag"
      @mousedown="onMouseDown"
      role="link"
      class="track"
      :class="[trackClasses, dragoverClasses]"
      :style="position"
      @click="$emit('clickTrack', $event)"
      @mouseup="$emit('selectTrack', $event)"
      @contextmenu="$emit('selectTrack', $event)"
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
    <div ref="placeholder" class="track-placeholder" :class="dragoverClasses" v-show="thisIsOneOfAnyTracksBeingDragged" />
  `,
};
