import * as ev from '../helpers/events.js'
import * as h from '../helpers/index.js'
import * as dom from '../helpers/dom.js'
import { convertTracksToPlaylistFormat } from './SelectionContainer.js'

export default function Menu() {
  const id = 'menu-container'
  let els = document.querySelectorAll('#' + id)
  if (els.length) els.forEach(el => el.remove())
  return dom.div({
    id,
    children: [
      dom.div({
        id: 'menu',
        children: [
          dom.div({
            className: 'menu-activate',
            innerText: '●●●',
            onclick: ev.onClickOrEnter(onOpenMenu),
          }),
          dom.ul({
            className: 'menu-items closed',
            children: [
              Add(),
              Deselect(),
              // TODO...
              // Edit(),
              Remove(),
            ],
          })
        ],
      })
    ],
  }) 
}

function Add() {
  return dom.li({
    id: 'tracklist-add-to-playlist-menu-item',
    innerText: 'Add',
    onclick: ev.onClickOrEnter((e) => {
      e.stopPropagation()

      const selectionContainer = convertTracksToPlaylistFormat(document.getElementById('selection-container'))
      const playlist = document.getElementById('playlist')
      const playlistChildren = playlist?.children

      if (playlistChildren[0]) {
        playlist
          .insertBefore(selectionContainer, playlistChildren[0])
      } else {
        playlist.append(selectionContainer)
      }

//       Array
//         .from(document.getElementById('playlist').children)
//         .map(child => {
//           if (child.classList.contains('track')) {
//             child.draggable = false
//             child.ondragover = null
//             child.ondragenter = null
//             child.ondragleave = null
//           }
//         })

      window.state.refreshPlaylistsStateFromDomElements()


//       const els = document.getElementsByClassName('track-selected')
//       let playlists = window.state.playlists
//       for (const el of els) {
//         const { href } = el.parentElement?.dataset
//         if (!href) {
//           continue
//         }
//         playlists = h.addHrefToPlaylist(
//           window.state.selectedPlaylist, href, playlists
//         )
//       }
//       window.state.playlists = playlists
//       dom.flashPlaylist()
//       const ul = document.getElementsByClassName('menu-items')?.[0]
//       setTimeout(() => {
//         ul.classList.add('closed')
//       }, 200)
    })
  })
}

function Deselect() {
  return dom.li({
    id: "delect-menu-item",
    innerText: "Deselect",
    onclick: ev.onClickOrEnter((e) => {
      e.stopPropagation()
      dom.emptySelectionContainer({
        reverseTracks: !!document
          .getElementById('playlist')
          ?.querySelector('#selection-container'),
      });
    }),
  });
}

function Edit() {
  return dom.li({
    id: 'edit-track-menu-item',
    innerText: 'Edit',
    onclick: ev.onClickOrEnter(() => {
      const els = document.getElementsByClassName('track-selected')
      const hrefs = Array.from(els).map(el => el.parentElement?.dataset?.href)
    }),
  })
}

function Remove() {
  return dom.li({
    id: 'playlist-remove-from-playlist-menu-item',
    innerText: 'Remove',
    onclick: ev.onClickOrEnter((e) => {
      e.stopPropagation()
      document.getElementsByClassName('menu-items')?.[0]?.classList.add('closed')
      document.getElementById('menu-container')?.remove()
      for (const el of document.querySelectorAll('.track-selected')) {
        el.remove()
      }
      window.state.refreshPlaylistsStateFromDomElements();
    }),
  })
}

function onOpenMenu(e) {
  e.stopPropagation()
  const { nextElementSibling: menuItems } = e.currentTarget
  if (menuItems.classList.contains('closed')) {
    menuItems.classList.remove('closed')
  } else {
    menuItems.classList.add('closed')
  }
}
