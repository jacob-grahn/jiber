/**
 * Set a value at path
 */
export const set = (obj: any, path: string | string[], value: any): any => {
  if (!path) return value
  if (!Array.isArray(path)) path = path.split('.')
  if (path.length === 0) return value

  let i = 0
  let cur = obj || {}
  let bit
  while (i < path.length) {
    bit = path[i]

    if (i === path.length - 1) {
      cur[bit] = value
      break
    }

    if (!cur[bit]) {
      cur[bit] = {}
    }

    cur = cur[bit]

    if (cur.$ref) {
      path = cur.$ref.split('.').concat(path.slice(i + 1))
      cur = obj
      i = 0
      continue
    }

    i++
  }

  return obj
}
