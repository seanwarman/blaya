import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { getTrackAndAlbumFromTrackString, parseTrackList } from '../helpers/index.js'

const trackList = parseTrackList(RAW_TRACKLIST);

const TrackDetails = {
  props: {
    trackName: null,
    album: null,
    tab: false,
  },
  template: `
    <div role="link" class="track" :class="tab ? 'track-artist-tab track-tab' : 'track-non-tab'">
      <div class="track-name-album-container">
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

export default {
  components: { TrackDetails },
  data() {
    return {
      trackList,
      albumList: [],
      page: 0,
      pageLength: 100,
      selectedTrack: null,
    };
  },
  methods: {
    getTrackAndAlbumFromTrackString,
    showTab(album, i) {
      const track = this.paginatedTrackList[i-1] || '';
      const [,lastAlbum] = getTrackAndAlbumFromTrackString(track);
      return lastAlbum !== album;
    },
    onClick(track) {
      if (this.selectedTrack === track) {
        // Send state action..
      } else {
        this.selectedTrack = track;
      }
    },
  },
  computed: {
    start() {
      return this.pageLength * this.page;
    },
    end() {
      return this.pageLength * (this.page + 1);
    },
    paginatedTrackList() {
      return this.trackList.slice(this.start,this.end);
    },
  },
  template: `
    <link rel="stylesheet" href="./TrackList.css" />
    <template v-for="([trackName, album], i) in paginatedTrackList.map(getTrackAndAlbumFromTrackString)">
      <track-details :tab="true" :track-name="trackName" :album="album" v-if="showTab(album, i)" />
      <track-details
        :class="selectedTrack === paginatedTrackList[i] && 'track-selected'"
        @click="onClick(paginatedTrackList[i])"
        :track-name="trackName"
        :album="album"
      />
    </template>
  `,
}
