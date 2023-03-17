import { trackList } from '../track-list.js'
import {
  filter,
  sort,
  map,
  pipe,
  breakPipe,
  breakIf,
  logger,
} from './functional-utils.js'
import {
  Create,
  Append,
  Prepend,
  removeLastChildFromContainer,
  removeFirstChildFromContainer,
  removeTrackEls,
} from './dom.js'
import { fzfFilter } from './utils.js'

// trackListElements :: [String] -> [Element]
export const trackListElements = pipe(
  filter(track =>
    !/\/$/.test(track)
    && (/.mp3$/.test(track) || /.flac$/.test(track))
  ),
  map((track, i) => Create('div', track, track, i)),
  filter(Boolean)
)

// pagesFromIndexRange :: [Number, Number] -> [Number, Number]
export const pagesFromIndexRange = (indexRange) => {
  const [startIndex, endIndex] = indexRange
  const pageFromIndex = i => Math.max(1, Math.floor(startIndex / window.state.pageSize))
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

// appendFilteredTracksByPageLazy :: String -> [String] -> Number
export const appendFilteredTracksByPageLazy = value => breakPipe(
  sliceTrackListByPage(
    fzfFilter(value)
  ),
  appendTracksAndReturnPage,
  breakIf(page => page === window.state.searchingPage),
  removeFirstChildFromContainer,
)


// prependFilteredTracksByPageLazy :: String -> [String] -> Number
export const prependFilteredTracksByPageLazy = value => pipe(
  convertPageNumberToDecrease,
  sliceTrackListByPage(fzfFilter(value)),
  prependTracksAndReturnPage,
  removeLastChildFromContainer,
)


// appendTracksByPageFilteredBy :: String -> [String] -> Number
export const appendTracksByPageFilteredBy = value => pipe(
  sliceTrackListByPage(fzfFilter(value)),
  appendTracksAndReturnPage,
)


// appendTracksByPageLazy :: [String] -> Number
export const appendTracksByPageLazy = pipe(
  sliceTrackListByPage(trackList),
  appendTracksAndReturnPage,
  removeFirstChildFromContainer,
)



// prependTracksByPageLazy :: [String] -> Number
export const prependTracksByPageLazy = pipe(
  convertPageNumberToDecrease,
  sliceTrackListByPage(trackList),
  prependTracksAndReturnPage,
  removeLastChildFromContainer,
)


// appendTracksByPage :: [String] -> Number
export const appendTracksByPage = pipe(
  sliceTrackListByPage(trackList),
  appendTracksAndReturnPage,
)


// replaceAllWithThreePages :: [String] -> Number
export const replaceAllWithThreePages = pipe(
  removeTrackEls,
  appendTracksByPage,
  appendTracksByPage,
  appendTracksByPage,
)
