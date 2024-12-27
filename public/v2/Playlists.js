import { usePlaylistStore } from '@stores/playlist';
import { usePlayStore } from '@stores/play';

import { getSelectedTracks } from '../helpers/events';

import Tracks from './TrackList/Tracks.js';

export default {
  components: { Tracks },
  data() {
    return {
      pageRange: [0,1,2],
      pageLength: 10,
      selectedTrackIndex: null,
      selectedTrack: null,
      selectedTracks: [],
    };
  },
  methods: {
    onClickTogglePlaylistsVisible() {
      usePlaylistStore().togglePlaylistsVisible();
    },
    onSelectTrack(i) {
      this.selectedTrackIndex = i;
    },
    onClickTrack(track) {
      if (this.selectedTrack === track && this.selectedTracks.length === 1) {
        usePlayStore().setCurrentTrack(track);
      } else {
        this.selectedTrack = track;
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
    <link rel="stylesheet" href="./Playlists.css" />
    <div id="playlists" :class="playlistsVisible && 'playlists-visible'">
      <menu>
        <button @click="onClickTogglePlaylistsVisible" id="maximise-button-playlist" class="button-circle">
          <img class="caret-icon" src="../icons/caret-up.svg" />
        </button>
      </menu>
      <ul ref="playlist">
        <tracks
          v-if="playlistsVisible"
          :page-length="pageLength"
          :hide-tabs="true"
          :tracks="tracks"
          @click-track="onClickTrack"
          @select-track="onSelectTrack"
          :track-selected="i => i === selectedTrackIndex"
        />
      </ul>
    </div>
  `,
}
