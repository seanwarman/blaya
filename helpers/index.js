import {
  filter,
  map,
  pipe,
  breakPipe,
  breakIf,
  plusOne,
  takeOne,
  select,
  slice,
  split,
  reverse,
} from './functional-utils.js'
import * as f from './functional-utils.js'
import {
  Create,
  Append,
  Prepend,
  removeLastChildFromContainer,
  removeFirstChildFromContainer,
  removeTrackEls,
} from './dom.js'
import { fzfFilter, simpleHash } from './utils.js'
import { PAGE_SIZE } from '../constants.js'

// parseTrackList :: [String] -> [String]
export const parseTrackList = pipe(
  filter(track =>
    !/\/$/.test(track)
    && (/.mp3$/.test(track) || /.flac$/.test(track))
  ),
  filter(Boolean),
)

// trackListElements :: [String] -> [Element]
export const trackListElements = pipe(
  map(Create),
  filter(Boolean),
)

// pagesFromIndexRange :: [Number, Number] -> [Number, Number]
export const pagesFromIndexRange = (indexRange) => {
  const [startIndex, endIndex] = indexRange
  const pageFromIndex = i => Math.max(1, Math.floor(i / window.state.pageSize))
  return [pageFromIndex(startIndex), pageFromIndex(endIndex)]
}

// indexRangeFromPages :: [Number, Number] -> [Number, Number]
export const indexRangeFromPages = (pageRange) => {
  const [pageStart, pageEnd] = pageRange
  // pageEnd is our current page, loading page one would be [0, 1]
  const pageSize = PAGE_SIZE
  return [pageSize * pageStart, pageSize * pageEnd]
}

// appendTracksAndReturnPage :: [Number, [String]] -> Number
export const appendTracksAndReturnPage = ([page, trackList]) => appendTracks(page, trackList)

// sliceTrackListByPage :: [String] -> Number -> [Number [String]]
export const sliceTrackListByPage = trackList => page => [page, trackList.slice(...indexRangeFromPages([page - 1, page]))]

// sliceTrackListByPage :: [String] -> Number -> [String]
export const sliceTrackListByPagePlain = trackList => page => trackList.slice(...indexRangeFromPages([page - 1, page]))

// convertPageNumberToDecrease :: Number -> Number
export const convertPageNumberToDecrease = page => (page - window.state.numberOfPages) - 1

// appendTracks :: (Number, [String]) -> Number
export const appendTracks = (page, trackList) => Append(page, trackListElements(trackList))


// prependTracks :: (Number, [String]) -> Number
export const prependTracks = (page, trackList) => Prepend(page, trackListElements(trackList))

// prependTracksAndReturnPage :: [Number, [String]] -> Number
export const prependTracksAndReturnPage = ([page, trackList]) => {
  prependTracks(page, trackList)
  return page + window.state.numberOfPages
}

// appendFilteredTracksByPageLazy :: [String] -> String -> [String] -> Number
export const appendFilteredTracksByPageLazy = trackList => value => breakPipe(
  sliceTrackListByPage(
    fzfFilter(trackList)(value)
  ),
  appendTracksAndReturnPage,
  breakIf(page => page === window.state.searchingPage),
  removeFirstChildFromContainer,
)


// prependFilteredTracksByPageLazy :: [String] -> String -> [String] -> Number
export const prependFilteredTracksByPageLazy = trackList => value => pipe(
  convertPageNumberToDecrease,
  sliceTrackListByPage(fzfFilter(trackList)(value)),
  prependTracksAndReturnPage,
  removeLastChildFromContainer,
)

// appendTracksByPageFilteredBy :: [String] -> String -> [String] -> Number
export const appendTracksByPageFilteredBy = trackList => value => pipe(
  sliceTrackListByPage(fzfFilter(trackList)(value)),
  appendTracksAndReturnPage,
)

// appendTracksByPageLazy :: [String] -> Number
export const appendTracksByPageLazy = trackList => pipe(
  sliceTrackListByPage(trackList),
  appendTracksAndReturnPage,
  removeFirstChildFromContainer,
)

// prependTracksByPageLazy :: [String] -> Number
export const prependTracksByPageLazy = trackList => pipe(
  convertPageNumberToDecrease,
  sliceTrackListByPage(trackList),
  prependTracksAndReturnPage,
  removeLastChildFromContainer,
)

// appendTracksByPage :: [String] -> Number
export const appendTracksByPage = trackList => pipe(
  sliceTrackListByPage(trackList),
  appendTracksAndReturnPage,
)

// replaceAllWithThreePages :: [String] -> Number -> Number
export const replaceAllWithThreePages = trackList => pipe(
  removeTrackEls,
  appendTracksByPage(trackList),
  appendTracksByPage(trackList),
  appendTracksByPage(trackList),
)

// getCurrentTrackString :: [String] -> String -> String
export const getCurrentTrackString = trackList => breakPipe(
  currentTrackId => trackList.findIndex(t => currentTrackId === simpleHash(t)),
  select(trackList),
)

// getNextTrackString :: [String] -> String -> String
export const getNextTrackString = trackList => breakPipe(
  currentTrackId => trackList.findIndex(t => currentTrackId === simpleHash(t)),
  breakIf(i => trackList[i+1] === undefined),
  plusOne(trackList),
)

// getPrevTrackString :: [String] -> String -> String
export const getPrevTrackString = trackList => breakPipe(
  currentTrackId => trackList.findIndex(t => currentTrackId === simpleHash(t)),
  takeOne(trackList),
)

// getTrackAndAlbumFromTrackString :: String -> [String]
export function getTrackAndAlbumFromTrackString(trackString) {
  return pipe(
    slice(9)(-4),
    split('/'),
    reverse,
  )(trackString)
}

// getTrackAndAlbumFromId :: [String] -> String -> [String]
export const getTrackAndAlbumFromId = trackList => pipe(
  getCurrentTrackString(trackList),
  getTrackAndAlbumFromTrackString,
)

// applyArrayReducerIf :: (String -> Boolean) -> (a -> b) -> (a -> b)
export const applyArrayReducerIf = conditionFn => reducer => f.pipe(
  f.arrifyArgs,
  f.boolean(conditionFn)(
    [
      reducer,
      // This is the reducer version of an id function,
      // basically keep the array the same...
      ([acc, nextItem]) => [...acc, nextItem],
    ]
  )
)

//setPlaylistIndexBasedOnFromAndToPositions :: (Number, Number, Number) -> Number
const setPlaylistIndexBasedOnFromAndToPositions = (playlistIndex, iFrom, iTo) => {
  if (isNaN(Number(playlistIndex))) return 0

  if (iFrom === playlistIndex) return iTo

  if (
    iFrom < playlistIndex
    && iTo >= playlistIndex
  ) return playlistIndex - 1

  if (
    iFrom > playlistIndex
    && iTo <= playlistIndex
  ) return playlistIndex + 1

  return playlistIndex
}

// rearrangeInPlaylist :: (String, a, [[String, [String]]]) -> [[String, [String]]]
export const rearrangeInPlaylist = ([iFrom, iTo], selectedPlaylist, playlists) => f.pipe(
  applyArrayReducerIf(([,,i]) => i === selectedPlaylist && iFrom !== iTo),
  f.reduce([]),
)(([acc, [name, playlistIndex, trackList]]) => [
  ...acc,
  [
    name,
    setPlaylistIndexBasedOnFromAndToPositions(playlistIndex, iFrom, iTo),
    f.reduce([])((acc2, track, i) => {
      if (i === iFrom) return acc2
      if (i === iTo) {
        // If dragging down it feels natural to put the track before, and vise
        // versa if dragging up...
        return iFrom > iTo ? [...acc2, trackList[iFrom], track] : [...acc2, track, trackList[iFrom]]
      }
      return [...acc2, track]
    })(trackList)
  ]])(playlists)

// addHrefToPlaylist :: (String, a, [[String, [String]]]) -> [[String, [String]]]
export const addHrefToPlaylist = (selectedPlaylist, href, playlists) => f.pipe(
  applyArrayReducerIf(([,,i]) => i === selectedPlaylist),
  f.reduce([]),
)(([acc, [name, playlistIndex, playlist]]) => {
  return [ ...acc, [name, playlistIndex, [...playlist, href]]]
})(playlists)

// removeTrackFromPlaylist :: (String, a, [[String, [String]]]) -> [[String, [String]]]
export const removeTrackFromPlaylist = (selectedPlaylist, index, playlists) => f.pipe(
  applyArrayReducerIf(([,,i]) => i === selectedPlaylist),
  f.reduce([]),
)(([acc, [name, playlistIndex, playlist]]) => [ ...acc, [name, playlistIndex, f.reduce([])((acc2, track, i) => {
  if (i === index) return acc2
  return [...acc2, track]
})(playlist)]])(playlists)

// updatePlaylistIndex :: (Number, Number, [[String, Number, Array]]) -> [[String, Number, Array]]
export const updatePlaylistIndex = (selectedPlaylist, playlistIndex, playlists) => f.pipe(
  applyArrayReducerIf(([,[, playlistIndexOld],i]) => i === selectedPlaylist && playlistIndex !== playlistIndexOld),
  f.reduce([]),
)(
  ([acc, [name, _, trackList], i]) => {
    if (i === state.selectedPlaylist) return [
      ...acc,
      [name, playlistIndex, trackList],
    ]
    return acc
  }
)(playlists)

// arrayFromElements :: Elements -> Number
export const arrayFromElements = f.pipe(
  Array.from,
  f.sliceFrom(),
)

// findIndexByMatching :: [a] -> a -> Number
export const findIndexByMatching = elements => f.pipe(
  trackEl => elements.findIndex(el => el === trackEl),
)

// findIndexOfElement :: Element -> Elements -> Number
export const findIndexOfElement = trackEl => f.pipe(
  Array.from,
  f.slice()(),
  f.reverse,
  f.findIndex(track => track === trackEl),
)
