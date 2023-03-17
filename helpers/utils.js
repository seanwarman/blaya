import { Fzf } from '/node_modules/fzf/dist/fzf.es.js'
import { trackList } from '../track-list.js'

// simpleHash :: String -> String
export const simpleHash = str => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash
  }
  return new Uint32Array([hash])[0].toString(36)
}


// fzfFilter :: [String] -> [String]
export const fzfFilter = value => {
  const fzf = new Fzf(trackList)
  const fzfFast = new Fzf(trackList, { fuzzy: 'v1' })
  if (value.length <= 3) return fzfFast.find(value).map(({ item }) => item)
  return fzf.find(value).map(({ item }) => item)
}

// setDebounce :: undefined -> undefined
export const setDebounce = () => {
  window.state.lazyLoadDebounce = true
  setTimeout(() => { window.state.lazyLoadDebounce = false }, 500)
}
