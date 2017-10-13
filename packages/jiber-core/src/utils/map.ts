/*
 * This does the same thing as Array.map, but for objects
 * If used with an array, the indexes will be treated as strings
 */

export const map = (
  obj: any,
  func: (value: any, key?: any) => any
) => {
  const keys = Object.keys(obj)
  const accum = keys.reduce((accum, key) => {
    const value = accum.source[key]
    accum.results[key] = func(value, key)
    return accum
  }, {source: obj, results: {} as any})
  return accum.results
}
