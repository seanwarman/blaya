import { Fzf } from '/node_modules/fzf/dist/fzf.es.js'

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


// fzfFilter :: [String] -> String -> [String]
export const fzfFilter = trackList => value => {
  const fzf = new Fzf(trackList, { casing: 'case-insensitive' })
  const fzfFast = new Fzf(trackList, { casing: 'case-insensitive', fuzzy: 'v1' })
  if (value.length <= 3) return fzfFast.find(value).map(({ item }) => item)
  return fzf.find(value).map(({ item }) => item)
}

// setDebounce :: undefined -> undefined
export const setDebounce = () => {
  window.state.lazyLoadDebounce = true
  setTimeout(() => { window.state.lazyLoadDebounce = false }, 500)
}

export const floor = (n,d) => d * ((n / d) - ((n % d) / d));
export const ceil  = (n,d) => d * ((n / d) + (1 - ((n % d / d))));
