import Page from './TrackList/Page.js';

let lastScrollTop = 0;

export default {
  components: { Page },
  data() {
    return {
      pageRange: [0,1,2],
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
      if (target.scrollTop < this.offset) {
        if (this.pageRange[0] === 0) {
          this.pageRange = [0,1,2];
        } else {
          this.pageRange = this.pageRange.map(n => n-1);
        }
        this.setDebounce();
      }
    },
    onScrollDown({ target }) {
      //
      // Work out what pageRange index to stop at the end
      //
      if (target.scrollHeight - target.scrollTop < this.offset) {
        this.pageRange = this.pageRange.map(n => n+1);
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
      <page :key="page" :data-page="page" v-for="page of pageRange" :page-length="pageLength" :page="page" />
    </div>
  `,
}
