import { usePlaylistStore } from '@stores/playlist';
import { usePlayStore } from '@stores/play';

import { getSelectedTrackIndexes } from '@helpers/events';

import Tracks from '@components/Tracks';
import PlaylistTabs from '@components/PlaylistTabs';
import PlaylistTitle from '@components/PlaylistTitle';

export default {
  props: ['stylesheet'],
  components: { Tracks, PlaylistTabs, PlaylistTitle },
  data() {
    return {
      pageRange: [0,1,2],
      pageLength: 10,
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
    onInputTitle(event) {
      this.playlistTitle = event.target.value;
    },
    onDeletePlaylist() {
      usePlaylistStore().deleteCurrentPlaylist();
    },
  },
  computed: {
    selectedTrackIndexes: {
      get() {
        return usePlaylistStore().selectedTrackIndexes;
      },
      set(indexes) {
        usePlaylistStore().selectedTrackIndexes = indexes;
      },
    },
    selectedTrackIndex: {
      get() {
        return usePlaylistStore().selectedTrackIndex;
      },
      set(i) {
        usePlaylistStore().selectedTrackIndex = i;
      },
    },
    playlistsVisible() {
      return usePlaylistStore().playlistsVisible;
    },
    tracks() {
      const playlistStore = usePlaylistStore();
      return playlistStore.playlists[playlistStore.currentPlaylist]?.tracks;
    },
    playlistTitle: {
      get() {
        return usePlaylistStore().selectedPlaylist?.name;
      },
      set(name) {
        usePlaylistStore().setSelectedPlaylistName(name);
      },
    },
    playlistsClasses() {
      return {
        'playlists-visible': this.playlistsVisible,
      };
    },
  },
  template: `
    <link v-if="stylesheet" rel="stylesheet" :href="stylesheet" />
    <div id="playlists" :class="playlistsClasses">
      <menu>
        <playlist-tabs />
        <button @click="onClickTogglePlaylistsVisible" id="maximise-button-playlist" class="button-circle">
          <img class="caret-icon" src="../icons/caret-up.svg" />
        </button>
      </menu>
      <ul ref="playlist" id="playlist">
        <playlist-title v-model="playlistTitle"></playlist-title>
        <tracks
          :page-length="pageLength"
          :hide-tabs="true"
          :tracks="tracks"
          :track-selected="i => selectedTrackIndexes.includes(i)"
          @click-track="onClickTrack"
          @select-track="onSelectTrack"
          :show-remove-from-playlist="true"
        />
        <div class="playlist-delete-button-container">
          <button @click="onDeletePlaylist" class="button button-danger playlist-delete-button">
            Delete playlist
          </button>
        </div>
      </ul>
    </div>
  `,
}
