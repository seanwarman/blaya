import { usePlayStore } from '@stores/play';
import { usePlaylistStore } from '@stores/playlist';

import Tracks from '@components/Tracks';

import { getSelectedTracks } from '@helpers/events'

let lastScrollTop = 0;
const initPageRage = [0,1,2];

export default {
  props: ['stylesheet'],
  components: { Tracks },
  data() {
    return {
      pageRange: initPageRage,
      offset: 5000,
      pageLength: 100,
      lazyLoadDebounce: false,
      previousScrollTop: 0,
      previousPageRange: initPageRage,
      selectedTrack: null,
      selectedTracks: [],
    };
  },
  mounted() {
    usePlayStore().$subscribe(({ events }) => {
      this.searchingEvent(events);
      this.searchEvent(events);
    });
  },
  computed: {
    showAddToPlaylist() {
      return usePlaylistStore().playlistMode;
    },
    isTheTop() {
      return this.pageRange[0] === 0;
    },
    isTheBottom() {
      return !this.paginatedTrackList(this.pageRange[2] + 1)?.length;
    },
  },
  methods: {
    onClickTrack(event) {
      const track = event.track;
      if (this.selectedTrack === track && this.selectedTracks.length === 1) {
        usePlayStore().setCurrentTrack(track);
      } else {
        this.selectedTrack = track;
      }
    },
    searchEvent(events) {
      const event = events.length ? events.find(e => e.key === 'search') : events;
      if (event.key === 'search' && event.newValue?.length) {
        this.pageRange = initPageRage;
        this.$refs.trackList.scrollTo(0, 0);
      }
    },
    searchingEvent(events) {
      const event = events.length ? events.find(e => e.key === 'searching') : events;
      if (event.key === 'searching' && event.newValue === true) {
        this.previousScrollTop = this.$refs.trackList.scrollTop;
        this.previousPageRange = this.pageRange;
      } else if (event.key === 'searching' && event.newValue === false) {
        this.pageRange = this.previousPageRange;
        this.$nextTick(() => {
          this.$refs.trackList.scrollTo(0, this.previousScrollTop);
        });
      }
    },
    start(page) {
      return this.pageLength * page;
    },
    end(page) {
      return this.pageLength * (page + 1);
    },
    paginatedTrackList(page) {
      return usePlayStore().trackList.slice(this.start(page),this.end(page));
    },
    setDebounce() {
      this.lazyLoadDebounce = true;
      setTimeout(() => {
        this.lazyLoadDebounce = false;
      }, 500);
    },
    onScrollUp({ target }) {
      if (this.isTheTop) return;
      if (target.scrollTop < this.offset) {
        this.pageRange = this.pageRange.map(n => n-1);
        this.setDebounce();
      }
    },
    onScrollDown({ target }) {
      if (this.isTheBottom) return;
      if (target.scrollHeight - target.scrollTop < this.offset) {
        this.pageRange = this.pageRange.map(n => n+1);
        this.setDebounce();
      }
    },
    onScroll(event) {
      if (this.lazyLoadDebounce) return;

      const st = window.scrollY || this.$refs.trackList.scrollTop
      if (st > lastScrollTop) {
        this.onScrollDown(event);
      } else if (st < lastScrollTop) {
        this.onScrollUp(event);
      }
      lastScrollTop = st <= 0 ? 0 : st;
    },
    onSelectTrack() {
      this.selectedTracks = getSelectedTracks(this.$refs.trackList);
    },
    onAddToPlaylist(event) {
      this.$nextTick(() => {
        usePlaylistStore().pushToCurrentPlaylist(event.track);
      });
    },
  },
  template: `
    <link v-if="stylesheet" rel="stylesheet" :href="stylesheet" />
    <ul ref="trackList" id="track-list" @scroll="onScroll">
      <tracks
        v-for="page of pageRange"
        @click-track="onClickTrack"
        @select-track="onSelectTrack"
        @add-to-playlist="onAddToPlaylist"
        :show-add-to-playlist="showAddToPlaylist"
        :key="page"
        :data-page="page"
        :page-length="pageLength"
        :tracks="paginatedTrackList(page)"
        :track-selected="i => selectedTracks.includes(paginatedTrackList(page)[i])"
      />
    </ul>
  `,
}
