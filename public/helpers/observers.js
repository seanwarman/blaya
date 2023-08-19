import Menu from '../elements/Menu.js'
import SelectionContainer from '../elements/SelectionContainer.js'
import * as dom from './dom.js'

function insertTracksIntoSelectionContainer(getParentEl1, map, getParentEl2) {
  const tracks = map(Array.from(getParentEl1().getElementsByClassName('track-selected')).map(el => el.parentElement))
  const selectionContainer = SelectionContainer()
  // Insert the selection container before the first selected track...
  getParentEl2(tracks)
    .insertBefore(
      selectionContainer,
      tracks[0],
    )
  // Move the selected tracks inside the container...
  for (const track of tracks) {
    selectionContainer
      .append(
        track,
      )
  }
  return selectionContainer
}

export function observeTrackSelectedMenu(mutations) {
  const mutation = mutations[mutations.length-1]

  if (
    mutation.attributeName === 'class'
    && mutation.target.classList.contains('track-selected')
    && mutation.target.classList.contains('track-name')
    && mutation.target.parentElement.dataset?.playlist
  ) {
    dom.emptySelectionContainerPlaylist();
    insertTracksIntoSelectionContainer(
      () => document.getElementById('playlist'),
      tracks => tracks.reverse(),
      () => document.getElementById('playlist'),
    ).prepend(Menu())
  }

  if (
    mutation.attributeName === 'class'
    && mutation.target.classList.contains('track-selected')
    && mutation.target.classList.contains('track-name-album-container')
    && !mutation.target.parentElement.dataset?.playlist
  ) {
    dom.emptySelectionContainerTrackList();
    insertTracksIntoSelectionContainer(
      () => document.getElementById('track-list-container'),
      tracks => tracks,
      tracks => tracks[0].parentElement,
    ).append(Menu())
  }

}
