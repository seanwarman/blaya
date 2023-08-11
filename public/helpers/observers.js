import Menu from '../elements/Menu.js'
import SelectionContainer from '../elements/SelectionContainer.js'

function emptySelectionContainer() {
  let selection = document.getElementById('selection-container')
  Array
    .from(selection?.children || [])
    .reverse()
    .map(child =>
      selection.parentElement.insertBefore(child, selection)
    )

  selection?.remove()
  selection = null
}

let times = 0

export function observeTrackSelectedMenu(mutations) {
  const mutation = mutations[mutations.length-1]

  if (
    mutation.attributeName === 'class'
    && mutation.target.classList.contains('track-selected')
    && mutation.target.classList.contains('track-name')
  ) {
    emptySelectionContainer();

    const playlist = document.getElementById('playlist')
    const tracks = Array.from(document.getElementsByClassName('track-selected')).map(el => el.parentElement).reverse()
    const selectionContainer = SelectionContainer()
    // Insert the selection container before the first selected track...
    playlist
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

    // Insert the menu...
    playlist
      .insertBefore(
        Menu(),
        selectionContainer,
      )

    window.state.refreshPlaylistsStateFromDomElements()
  }

  if (
    mutation.attributeName === 'data-mutation'
    && mutation.target.dataset?.mutation === 'moved'
  ) {
    mutation.target
      .parentElement
      .insertBefore(
        Menu(),
        mutation.target.nextElementSibling
      )
  }
}
