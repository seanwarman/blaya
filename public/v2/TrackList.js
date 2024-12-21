import { trackList as RAW_TRACKLIST } from '../track-list.js'
import { getTrackAndAlbumFromTrackString, parseTrackList } from '../helpers/index.js'

const trackList = parseTrackList(RAW_TRACKLIST);

export default {
  data() {
    return {
      trackList,
      page: 0,
      pageLength: 100,
    };
  },
  methods: {
    getTrackAndAlbumFromTrackString,
  },
  computed: {
    start() {
      return this.pageLength * this.page;
    },
    end() {
      return this.pageLength * (this.page + 1);
    },
  },
  template: `
    <link rel="stylesheet" href="./TrackList.css" />
    <ul class="container" id="track-list">
      <li class="row" v-for="[trackName, album] of trackList.slice(start, end).map(getTrackAndAlbumFromTrackString)">
        <div class="col trackname-col">
          {{ trackName }}
        </div>
        <div class="col album-col">
          {{ album }}
        </div>
      </li>
    </ul>
  `,
}
