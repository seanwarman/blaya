import * as f from './functional-utils.js'
import * as ev from './events.js'
import * as h from './index.js'
import * as dom from './dom.js'

export function observeTrackSelectedMenu(mutations) {
  const mutation = mutations[mutations.length-1]
  if (
    mutation.attributeName === 'class'
    && mutation.target.classList.contains('track-selected')
  ) {
    document.getElementById('menu-container')?.remove()
    const ul = dom.ul({
      className: 'menu-items closed',
      children: [
        dom.li({
          id: 'tracklist-add-to-playlist-menu-item',
          innerText: 'Add',
          onclick: ev.onClickOrEnter(() => {
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
        dom.li({
          id: 'playlist-remove-from-playlist-menu-item',
          innerText: 'Remove',
          onclick: ev.onClickOrEnter(() => {
            const els = document.getElementsByClassName('track-selected')
            let playlists = window.state.playlists
            for (const el of els) {
              if (!el.parentElement) {
                continue
              }
              const i = h
                .findIndexOfElement(
                  el.parentElement
                )(document.getElementById('playlist').getElementsByClassName('track'))
              playlists = h.removeTrackFromPlaylist(
                window.state.selectedPlaylist, i, playlists
              )
            }
            window.state.playlists = playlists
            setTimeout(() => {
              ul.classList.add('closed')
            }, 200)
          }),
        }),
      ],
    })
    const menuEl = dom.div({
      id: 'menu-container',
      children: [
        dom.div({
          id: 'menu',
          children: [
            dom.div({
              className: 'menu-activate',
              innerText: '●●●',
              onclick: ev.onClickOrEnter(ev.onOpenMenu),
            }),
            ul,
          ],
        })
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
