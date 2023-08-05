import Menu from '../elements/Menu.js'

export function observeTrackSelectedMenu(mutations) {
  const mutation = mutations[mutations.length-1]
  if (
    mutation.attributeName === 'class'
    && mutation.target.classList.contains('track-selected')
  ) {
    mutation.target
      .parentElement
      .parentElement
      .insertBefore(
        Menu(),
        mutation.target.parentElement.nextElementSibling
      )
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
