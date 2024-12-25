import { usePlayStore } from '@stores/play';

import TrackDetails from './TrackDetails.js';

import { trackList as RAW_TRACKLIST } from '../../track-list.js'

import { getTrackAndAlbumFromTrackString, parseTrackList } from '../../helpers/index.js'
import { getSelectedElements } from '../../helpers/events.js'

const trackList = parseTrackList(RAW_TRACKLIST);

export default {
  props: ['page', 'pageLength'],
  components: { TrackDetails },
  data() {
    return {
      trackList,
      albumList: [],
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
    <div class="page">
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
};


