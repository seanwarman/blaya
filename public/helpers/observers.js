import * as f from './functional-utils.js'
import * as ev from './events.js'
import * as h from './index.js'
import * as dom from './dom.js'

const appendChildren = children => el => {
  if (children?.length) {
    el.append(...children)
  }
  return el
}

const Div = ({ children, ...props }) => f.pipe(
  f.AssignObject(props),
  appendChildren(children),
)(document.createElement('div'))

const Ul = ({ children, ...props }) => f.pipe(
  f.AssignObject(props),
  appendChildren(children),
)(document.createElement('ul'))

const Li = ({ children, ...props }) => f.pipe(
  f.AssignObject(props),
  appendChildren(children),
)(document.createElement('li'))

export function observeTrackSelectedMenu(mutations) {
  const mutation = mutations[mutations.length-1]
  if (
    mutation.attributeName === 'class'
    && mutation.target.classList.contains('track-selected')
  ) {
    // TODO this interferes with the keyboard shift selection...
    document.getElementById('menu')?.remove()
    const ul = Ul({
      className: 'menu-items closed',
      children: [
        Li({
          innerText: 'Add',
          onclick: ev.onClickOrEnter(e => {
            const els = document.getElementsByClassName('track-selected')
            let playlists = window.state.playlists
            for (const el of els) {
              const { href } = el.parentElement?.dataset
              if (!href) {
                continue
              }
              playlists = h.addHrefToPlaylist(
                window.state.selectedPlaylist, href, playlists
              )
            }
            window.state.playlists = playlists
            dom.flashPlaylist()
            setTimeout(() => {
              ul.classList.add('closed')
            }, 200)
          })
        }),
      ],
    })
    const menuEl = Div({
      id: 'menu',
      children: [
        Div({
          className: 'menu-activate',
          innerText: '●●●',
          onclick: ev.onClickOrEnter(ev.onOpenMenu),
        }),
        ul,
      ],
    })

    mutation.target
      .parentElement
      .parentElement
      .insertBefore(
        menuEl,
        mutation.target.parentElement.nextElementSibling
      )
  }
}

