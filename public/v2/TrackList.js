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

const Page = {
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

let pageRange = [0, 1, 2];
let lastScrollTop = 0;

export default {
  components: { Page },
  data() {
    return {
      pageRange,
      offset: 5000,
      pageLength: 100,
      lazyLoadDebounce: false,
    };
  },
  methods: {
    setDebounce() {
      this.lazyLoadDebounce = true;
      setTimeout(() => {
        this.lazyLoadDebounce = false;
      }, 500);
    },
    onScrollUp({ target }) {
      if (pageRange[0] === 0) return;
      if (target.scrollTop < this.offset) {
        this.pageRange.unshift(pageRange[0]-1);
        const trackList = this.$refs.trackList;
        trackList.lastElementChild && trackList.removeChild(trackList.lastElementChild);
        pageRange = pageRange.map(n => n-1);
        this.setDebounce();
      }
    },
    onScrollDown({ target }) {
      //
      // Work out what pageRange index to stop at the end
      //
      if (target.scrollHeight - target.scrollTop < this.offset) {
        this.pageRange.push(pageRange[pageRange.length-1]+1);
        const trackList = this.$refs.trackList;
        trackList.firstElementChild && trackList.removeChild(trackList.firstElementChild);
        pageRange = pageRange.map(n => n+1);
        this.setDebounce();
      }
    },
    onScroll(event) {
      if (this.lazyLoadDebounce) return;
      const st = window.pageYOffset || this.$refs.trackList.scrollTop
      if (st > lastScrollTop) {
        this.onScrollDown(event);
      } else if (st < lastScrollTop) {
        this.onScrollUp(event);
      }
      lastScrollTop = st <= 0 ? 0 : st;
    },
  },
  template: `
    <link rel="stylesheet" href="./TrackList.css" />
    <div ref="trackList" id="track-list" @scroll="onScroll">
      <page v-for="page of pageRange" :page-length="pageLength" :page="page" />
    </div>
  `,
}
