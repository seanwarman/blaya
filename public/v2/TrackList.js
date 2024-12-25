import Page from './TrackList/Page.js';

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
