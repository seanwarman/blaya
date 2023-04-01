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
  const pageSize = window.state.pageSize
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

// applyReducerIf :: (String -> Boolean) -> (a -> b) -> (a -> b)
export const applyReducerIf = conditionFn => reducer => f.pipe(
  f.arrifyArgs,
  f.boolean((args) =>
    conditionFn(args)
  )(
    [
      reducer,
      f.head,
    ]
  )
)

// rearrangeInPlaylist :: (String, a, [[String, [String]]]) -> [[String, [String]]]
export const rearrangeInPlaylist = (selectedPlaylist, [iFrom, iTo], playlists) => f.pipe(
  applyReducerIf(([,,i]) => i === selectedPlaylist),
  f.reduce([]),
)(([acc, [name, playlist]]) => [ ...acc, [name, f.reduce([])((acc2, track, i) => {
  if (i === iFrom) return acc2
  if (i === iTo) return [...acc2, playlist[iFrom], track]
  return [...acc2, track]
})(playlist)]])(playlists)

// addHrefToPlaylist :: (String, a, [[String, [String]]]) -> [[String, [String]]]
export const addHrefToPlaylist = (selectedPlaylist, href, playlists) => f.pipe(
  applyReducerIf(([,,i]) => i === selectedPlaylist),
  f.reduce([]),
)(([acc, [name, playlist]]) => [ ...acc, [name, [...playlist, href]]])(playlists)

// removeTrackFromPlaylist :: (String, a, [[String, [String]]]) -> [[String, [String]]]
export const removeTrackFromPlaylist = (selectedPlaylist, index, playlists) => f.pipe(
  applyReducerIf(([,,i]) => i === selectedPlaylist),
  f.reduce([]),
)(([acc, [name, playlist]]) => [ ...acc, [name, f.reduce([])((acc2, track, i) => {
  if (i === index) return acc2
  return [...acc2, track]
})(playlist)]])(playlists)

// findIndexOfElement :: Element -> Elements -> Number
export const findIndexOfElement = trackEl => f.pipe(
  Array.from,
  f.slice()(),
  f.reverse,
  f.findIndex(track => track === trackEl),
)
