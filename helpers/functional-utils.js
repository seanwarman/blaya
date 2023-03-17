// filter :: (a -> Boolean) -> [a] -> [a]
export const filter = fn => arr => arr.filter(fn)

// Slice clones the array so sort doesn't sort in place...
// sort :: (a -> Number) -> [a] -> [a]
export const sort = fn => arr => arr.slice().sort(fn)

// map :: (a -> b) -> [a] -> [b]
export const map = fn => arr => arr.map(fn)

// pipe :: ((a -> b), (c -> d),  ..., (y -> z)) -> a -> z
export const pipe = (...fns) => (...args) => fns.reduce((acc, fn) => [fn.call(null, ...acc)], args)[0]

// breakPipe "breaks" if you return the string 'break' at any step in the process...
// breakPipe :: ((a -> b), (c -> d),  ..., (y -> z)) -> a -> b | c | d | y | z
export const breakPipe = (...fns) => (...args) => fns.reduce((acc, fn) => {
  if (acc.break) return acc
  const res = fn.call(null, ...acc.args)
  if (res === 'break') return { args: acc.args, break: true }
  return { args: [res], break: false }
}, { args, break: false }).args[0]

// breakIf :: (a -> b) -> String | b
export const breakIf = fn => arg => fn(arg) ? 'break' : arg

// logger :: String -> a -> a
export const logger = tag => (arg) => console.log(tag, arg) || arg

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

// plusOne :: [a] -> Number -> b
export const plusOne = arr => i => i+1 < arr.length ? arr[i+1] : arr[i]

// takeOne :: [a] -> Number -> b
export const takeOne = arr => i => i-1 < 0 ? 0 : arr[i-1]

// findIndexEqTo :: [String] -> String -> Number
export const findIndexEqTo = arr => str => arr.findIndex(t => t === str)

// findIndex :: (a -> Boolean) -> [a] -> Number
export const findIndex = fn => arr => arr.findIndex(fn)

// select :: [a] -> Number -> [b]
export const select = arr => i => arr[i]

// slice :: String -> Number -> Number -> String
export const slice = i => j => str => str.slice(i, j)

// split :: String -> String -> String
export const split = by => str => str.split(by)

// reverse = [a] -> [a]
export const reverse = arr => arr.slice().reverse()
