import { ref, computed, useTemplateRef } from 'vue';
import { useDrag } from '@vueuse/gesture';

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
   setup(props) {
     const draggedOverIndex = computed({
       get() {
         return usePlaylistStore().draggedOverIndex;
       },
       set(i) {
         usePlaylistStore().draggedOverIndex = i;
       },
     });
     const draggingRef = ref(false);
     const xRef = ref(0);
     const yRef = ref(0);
     const track = useTemplateRef('track');
     const placeholder = useTemplateRef('placeholder');
     const { handlers } = useDrag(({ movement: [x, y], dragging }) => {
       if (!props.trackSelected) return;
       draggingRef.value = dragging;
       if (!dragging) {
         xRef.value = 0;
         yRef.value = 0;
         usePlaylistStore().setTrackIndexFrom(props.index, draggedOverIndex.value);
       } else {
         xRef.value = x;
         yRef.value = y;
         const trackHeight = track.value.clientHeight;
         const trackY = track.value.getBoundingClientRect().y;
         const trackPlaceholder = placeholder.value;
         const placeholderY = trackPlaceholder.getBoundingClientRect().y;
         if (placeholderY > trackY && placeholderY < trackY + trackHeight) {
           draggedOverIndex.value = props.index;
         } else {
           Array.from(
             document.querySelectorAll('#playlist .track-non-tab')
           ).forEach((track, i) => {
             const rect = track.getBoundingClientRect();
             if (rect.y > trackY && rect.y < trackY + trackHeight) {
               draggedOverIndex.value = i;
             }
           });
         }
       }
     }, {
       preventWindowScrollY: true,
     });
     return {
       dragging: draggingRef,
       x: xRef,
       y: yRef,
       onDrag: handlers.drag,
       draggedOverIndex,
     };
   },
  methods: {
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
  },
  template: `
    <div
      v-drag="onDrag"
      ref="track"
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
    <div ref="placeholder" class="track-placeholder" :class="dragoverClasses" v-show="dragging" />
  `,
};
