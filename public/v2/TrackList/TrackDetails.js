export default {
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
