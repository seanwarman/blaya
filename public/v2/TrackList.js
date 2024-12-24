import { usePlayStore } from '@stores/play';

import { getSelectedElements } from '../helpers/events.js'
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
      selectedTracks: [],
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
      if (this.selectedTrack === track && this.selectedTracks.length === 1) {
        usePlayStore().setCurrentTrack(track);
      } else {
        this.selectedTrack = track;
      }
    },
    onSelect() {
      const { elements } = getSelectedElements(
        'track-non-tab',
        document.getElementById('track-list'),
      );
      this.selectedTracks = Array.from(elements)
        .map((el) => el.dataset.track)
        .reduce(
          (tracks, track) =>
            tracks.includes(track) ? tracks : tracks.concat([track]),
          []
        );
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
    <div id="track-list">
      <link rel="stylesheet" href="./TrackList.css" />
      <template v-for="([trackName, album], i) in paginatedTrackList.map(getTrackAndAlbumFromTrackString)">
        <track-details :tab="true" :track-name="trackName" :album="album" v-if="showTab(album, i)" />
        <track-details
          :data-track="paginatedTrackList[i]"
          :class="selectedTracks.includes(paginatedTrackList[i]) && 'track-selected'"
          @mouseup="onSelect"
          @click="onClick(paginatedTrackList[i])"
          :track-name="trackName"
          :album="album"
        />
      </template>
    </div>
  `,
}
