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
