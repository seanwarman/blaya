import * as dom from '../helpers/dom.js'
import { onClickOrEnter } from '../helpers/events.js';

const id = 'sequencer-playlist-container';

export default function Playlist() {
  const container = document.getElementById(id);
  container.replaceWith(dom.div({
    id,
    dataset: {
      playlistMinimised: true,
    },
    innerHTML: `
      <link rel="stylesheet" href="/elements/SequencerPlaylist.css">
      <div class="button-playlist-container">
        <button id="maximise-button-sequencer-playlist" class="button-circle">
          <img src="./icons/caret-up.svg" />
        </button>
      </div>
      <div id="sequencer-playlist"></div>
    `,
  }));
  const onTogglePlaylistMinimised = () => {
    const playlistContainer = document.getElementById('sequencer-playlist-container')
    const minimise = playlistContainer.dataset.playlistMinimised === 'false'
    if (minimise) window.state.playlistScrollPosition = playlistContainer.scrollTop
    playlistContainer.dataset.playlistMinimised = playlistContainer.dataset.playlistMinimised === 'false'
    document.body.dataset.playlistMinimised = playlistContainer.dataset.playlistMinimised === 'true'
    document.getElementById('maximise-button-sequencer-playlist').innerHTML = playlistContainer.dataset.playlistMinimised === 'false'
      ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"/></svg>'

    if (!minimise) playlistContainer.scrollTo(0, window.state.playlistScrollPosition)
  }
  document.getElementById('maximise-button-sequencer-playlist').onclick = onClickOrEnter(onTogglePlaylistMinimised)
  document.getElementById('maximise-button-sequencer-playlist').onkeydown = onClickOrEnter(onTogglePlaylistMinimised)
}

