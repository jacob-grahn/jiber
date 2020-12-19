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
  let parent
  const mutateState = false

  while (i < path.length) {
    bit = path[i]

    // avoid mutating state
    if (!mutateState) {

      // duplicate the object
      if (Array.isArray(cur)) {
        cur = [...cur]
      } else if (typeof cur === 'object') {
        cur = { ...cur }
      }

      // update the parent to point to this duplicate
      if (i === 0) {
        obj = cur
      } else {
        parent[path[i - 1]] = cur
      }

      // point to a new parent for the next loop
      parent = cur
    }

    // at the end of the path, set the value
    if (i === path.length - 1) {
      cur[bit] = value
      break
    }

    // if the path doesn't exist, make it!
    if (!cur[bit]) {
      cur[bit] = {}
    }

    // follow pointers
    if (cur[bit].$ref) {
      path = cur[bit].$ref.split('.').concat(path.slice(i + 1))
      cur = obj
      i = 0
      continue
    }

    // move forward one step
    cur = cur[bit]
    i++
  }

  return obj
}
