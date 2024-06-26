import * as ev from '../helpers/events.js'
import * as h from '../helpers/index.js'
import * as dom from '../helpers/dom.js'
import { convertTracksToPlaylistFormat } from './SelectionContainer.js'
import TrackLoader from './TrackLoader.js'

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
              LoadTrack(),
              Deselect(),
              Remove(),
            ],
          })
        ],
      })
    ],
  }) 
}

function LoadTrack() {
  return dom.li({
    id: 'tracklist-load-track-menu-item',
    innerText: 'Load track',
    onclick: ev.onClickOrEnter(async (e) => {
      e.stopPropagation()
      Array.from(document.getElementsByClassName('menu-items')).map(el => el.classList?.add('closed'))
      document.getElementById('peaks-audio').pause()
      window.state.loadingTrack = true;
      document.body.dataset.showTrackLoader = true;
      document.body.dataset.showSequencer = true;
      const els = document.querySelectorAll('#selection-container .track-non-tab')
      if (window.state.trackLoader) window.state.trackLoader.destroy()
      const trackUrl = els[0].dataset.href
        .split('/')
        .map((s) => encodeURIComponent(s))
        .join('/');
      TrackLoader(trackUrl, (trackLoader) => {
        window.state.trackLoader = trackLoader;
        window.state.loadingTrack = false;
        const player = document.getElementById('player');
        player.pause();
      });
    }),
  });
}

function Add() {
  return dom.li({
    id: 'tracklist-add-to-playlist-menu-item',
    innerText: 'Add',
    onclick: ev.onClickOrEnter((e) => {
      e.stopPropagation()
      Array.from(document.getElementsByClassName('menu-items')).map(el => el.classList?.add('closed'))
      const selectionContainerClone = convertTracksToPlaylistFormat(
        document.getElementById("selection-container"),
        { emptySelectionContainer: false }
      )
      const playlist = document.getElementById("playlist");
      const playlistChildren = playlist?.children

      Array.from(selectionContainerClone.children).map(child => {
        if (child.id === 'menu-container') return
        if (playlistChildren[0]) {
          playlist
            .insertBefore(child, playlistChildren[0])
        } else {
          playlist.append(child)
        }
      })

      window.state.refreshPlaylistsStateFromDomElements()
    }),
  })
}

function Deselect() {
  return dom.li({
    id: "delect-menu-item",
    innerText: "Deselect",
    onclick: ev.onClickOrEnter((e) => {
      e.stopPropagation()
      Array.from(document.getElementsByClassName('menu-items')).map(el => el.classList?.add('closed'))
      dom.emptySelectionContainer({
        reverseTracks: !!document
          .getElementById('playlist')
          ?.querySelector('#selection-container'),
      });
      Array.from(document.getElementsByClassName('play-ready')).map(el => el.classList.remove('play-ready'))
    }),
  });
}

function Remove() {
  return dom.li({
    id: 'playlist-remove-from-playlist-menu-item',
    innerText: 'Remove',
    onclick: ev.onClickOrEnter((e) => {
      e.stopPropagation()
      document.getElementById('selection-container')?.remove();
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
