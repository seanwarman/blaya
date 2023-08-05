import * as ev from '../helpers/events.js'
import * as h from '../helpers/index.js'
import * as dom from '../helpers/dom.js'

export default function Menu() {
  const id = 'menu-container'
  let el = document.getElementById(id)
  if (el) el.remove()
  return dom.div({
    id,
    children: [
      dom.div({
        id: 'menu',
        children: [
          dom.div({
            className: 'menu-activate',
            innerText: '●●●',
            onclick: ev.onClickOrEnter(ev.onOpenMenu),
          }),
          dom.ul({
            className: 'menu-items closed',
            children: [
              Add(),
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
      const ul = document.getElementsByClassName('menu-items')?.[0]
      setTimeout(() => {
        ul.classList.add('closed')
      }, 200)
    })
  })
}

function Edit() {
  return dom.li({
    id: 'edit-track-menu-item',
    innerText: 'Edit',
    onclick: ev.onClickOrEnter(() => {
      const els = document.getElementsByClassName('track-selected')
      const hrefs = Array.from(els).map(el => el.parentElement?.dataset?.href)
      console.log(`@FILTER hrefs:`, hrefs)
    }),
  })
}

function Remove() {
  return dom.li({
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
      const ul = document.getElementsByClassName('menu-items')?.[0]
      setTimeout(() => {
        ul.classList.add('closed')
      }, 200)
    }),
  })
}
