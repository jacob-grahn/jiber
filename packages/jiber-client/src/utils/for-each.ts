/*
 * This does the same thing as Array.forEach, but for objects
 * It's probably best not to use this with arrays, because the index keys
 * will be strings
 */

export const forEach = (
  obj: any,
  func: (value: any, key: string) => any
) => {
  if (obj) {
    Object.keys(obj).forEach(key => func(obj[key], key))
  }
}
