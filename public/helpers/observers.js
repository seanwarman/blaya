import Menu from '../elements/Menu.js'

export function observeTrackSelectedMenu(mutations) {
  const mutation = mutations[mutations.length-1]
  if (
    mutation.attributeName === 'class'
    && mutation.target.classList.contains('track-selected')
  ) {
    document.getElementById('menu-container')?.remove()
    mutation.target
      .parentElement
      .parentElement
      .insertBefore(
        Menu(),
        mutation.target.parentElement.nextElementSibling
      )
  }
}
