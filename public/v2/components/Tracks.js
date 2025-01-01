import TrackDetails from '@components/TrackDetails';

import { getTrackAndAlbumFromTrackString } from '@helpers'

export default {
  props: [
    'showAddToPlaylist',
    'showRemoveFromPlaylist',
    'tracks',
    'hideTabs',
    'trackSelected',
  ],
  components: { TrackDetails },
  methods: {
    getTrackAndAlbumFromTrackString,
    showTab(album, i) {
      if (this.hideTabs) return false;
      const track = this.tracks[i - 1] || "";
      const [, lastAlbum] = getTrackAndAlbumFromTrackString(track);
      return lastAlbum !== album;
    },
  },
  template: `
    <li class="page">
      <template v-for="([trackName, album], i) in tracks.map(getTrackAndAlbumFromTrackString)">
        <track-details :tab="true" :track="tracks[i]" v-if="showTab(album, i)" />
        <track-details
          :index="i"
          :track="tracks[i]"
          :track-selected="trackSelected(i)"
          @click-track="$emit('clickTrack', { ...$event, track: tracks[i], index: i })"
          @select-track="$emit('selectTrack', { ...$event, track: tracks[i], index: i })"
          :show-add-to-playlist="showAddToPlaylist"
          :show-remove-from-playlist="showRemoveFromPlaylist"
        />
      </template>
    </li>
  `,
};
