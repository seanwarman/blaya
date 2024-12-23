import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { getTrackAndAlbumFromTrackString, parseTrackList } from '../helpers/index.js'

const trackList = parseTrackList(RAW_TRACKLIST);

export default {
  data() {
    return {
      trackList,
      albumList: [],
      page: 0,
      pageLength: 100,
    };
  },
  methods: {
    showTab(album, i) {
      const [,lastAlbum] = this.paginatedTrackList[i-1] || ['',''];
      return lastAlbum !== album;
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
      return this.trackList.slice(this.start,this.end).map(getTrackAndAlbumFromTrackString);
    },
  },
  template: `
    <link rel="stylesheet" href="./TrackList.css" />
    <template v-for="([trackName, album], i) in paginatedTrackList">
      <div role="link" class="track track-artist-tab track-tab" v-if="showTab(album, i)">
        <div class="track-name-album-container">
          <div class="track-name">
            <div class="name">{{ trackName }}</div>
          </div>
          <div class="track-album">
            <div class="album">{{ album }}</div>
          </div>
        </div>
      </div>
      <div role="link" class="track track-non-tab">
        <div class="track-name-album-container">
          <div class="track-name">
            <div class="name">{{ trackName }}</div>
          </div>
          <div class="track-album">
            <div class="album">{{ album }}</div>
          </div>
        </div>
      </div>
    </template>
  `,
}
