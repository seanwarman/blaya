import { usePlaylistStore } from '@stores/playlist';
import { usePlayStore } from '@stores/play';

import { getSelectedTrackIndexes } from '@helpers/events';

import Tracks from '@components/Tracks';

export default {
  props: ['stylesheet'],
  components: { Tracks },
  data() {
    return {
      pageRange: [0,1,2],
      pageLength: 10,
      selectedTrackIndex: null,
      selectedTrackIndexes: [],
    };
  },
  methods: {
    onClickTogglePlaylistsVisible() {
      usePlaylistStore().togglePlaylistsVisible();
    },
    onSelectTrack() {
      this.selectedTrackIndexes = getSelectedTrackIndexes(this.$refs.playlist);
    },
    onClickTrack(event) {
      if (this.selectedTrackIndexes.length === 1 && this.selectedTrackIndex === event.index) {
        usePlayStore().setCurrentTrack(event.track, { playingFromPlaylist: true, playlistTrackIndex: event.index });
      } else {
        this.selectedTrackIndex = event.index;
      }
    },
  },
  computed: {
    playlistsVisible() {
      return usePlaylistStore().playlistsVisible;
    },
    tracks() {
      const playlistStore = usePlaylistStore();
      return playlistStore.playlists[playlistStore.currentPlaylist].tracks;
    },
  },
  template: `
    <link v-if="stylesheet" rel="stylesheet" :href="stylesheet" />
    <div id="playlists" :class="playlistsVisible && 'playlists-visible'">
      <menu>
        <button @click="onClickTogglePlaylistsVisible" id="maximise-button-playlist" class="button-circle">
          <img class="caret-icon" src="../icons/caret-up.svg" />
        </button>
      </menu>
      <ul ref="playlist">
        <tracks
          :page-length="pageLength"
          :hide-tabs="true"
          :tracks="tracks"
          :track-selected="i => selectedTrackIndexes.includes(i)"
          @click-track="onClickTrack"
          @select-track="onSelectTrack"
          :show-remove-from-playlist="true"
        />
      </ul>
    </div>
  `,
}
