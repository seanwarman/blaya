import TrackDetails from './TrackDetails.js';

import { getTrackAndAlbumFromTrackString } from '../../helpers/index.js'

export default {
  props: ['tracks', 'hideTabs', 'trackSelected', 'showAddToPlaylist'],
  components: { TrackDetails },
  data() {
    return {
      albumList: [],
    };
  },
  methods: {
    getTrackAndAlbumFromTrackString,
    showTab(album, i) {
      if (this.hideTabs) return false;
      const track = this.tracks[i-1] || '';
      const [,lastAlbum] = getTrackAndAlbumFromTrackString(track);
      return lastAlbum !== album;
    },
  },
  template: `
    <li class="page">
      <template v-for="([trackName, album], i) in tracks.map(getTrackAndAlbumFromTrackString)">
        <track-details :tab="true" :track="tracks[i]" v-if="showTab(album, i)" />
        <track-details
          :track="tracks[i]"
          :show-add-to-playlist="showAddToPlaylist"
          :data-track="tracks[i]"
          :class="trackSelected(i) && 'track-selected'"
          @click="$emit('clickTrack', tracks[i])"
          @mouseup="$emit('selectTrack', i)"
          @add-to-playlist="$emit('addToPlaylist', $event)"
        />
      </template>
    </li>
  `,
};
