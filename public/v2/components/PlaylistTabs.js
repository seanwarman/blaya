import { usePlaylistStore } from '@stores/playlist';

export default {
  methods: {
    onSelectTab(index) {
      usePlaylistStore().currentPlaylist = index;
    },
    onNewTab() {
      usePlaylistStore().newPlaylist();
    },
  },
  computed: {
    tabs() {
      return usePlaylistStore().playlists.map(p => p.name);
    },
    currentPlaylist() {
      return usePlaylistStore().currentPlaylist;
    },
  },
  template: `
    <ul id="playlist-tabs">
      <li
        @click="onSelectTab(i)"
        class="tab-leaf-container tab-leaf-name"
        :class="currentPlaylist === i ? 'focussed-tab-leaf' : 'background-tab'"
        v-for="(tab, i) of tabs"
      >
        <div class="tab-leaf">
          <span>{{ tab.length > 0 ? tab : 'Un-named' }}</span>
        </div>
      </li>
      <div @click="onNewTab" class="tab-leaf-container new-tab-leaf-container">
        <div class="tab-leaf">
          <img class="new-tab-leaf" src="../../icons/plus-solid.svg" alt="Add a new playlist">
        </div>
      </div>
    </ul>
  `,
}
