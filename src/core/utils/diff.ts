import DiffList from '../interfaces/diff-list'
import { SET, DEL } from '../constants/delta-types'

export default function diff (
  left: any,
  right: any,
  path: string = ''
): DiffList {
  if (left === right) return []
  if (right === undefined) return [[DEL, path, undefined]]
  if ((typeof left) !== (typeof right)) return [[SET, path, right]]
  if (Array.isArray(left) !== Array.isArray(right)) return [[SET, path, right]]

  // works for arrays and objects, as they are both typeof 'object'
  if (typeof left === 'object' && typeof right === 'object') {
    const keys: string[] = Object.keys({...left, ...right})
    if (Array.isArray(left) && left.length > right.length) keys.reverse()       // delete array keys in reverse order
    return keys.reduce((results, key) => {
      const subPath = `${path}${path ? '.' : ''}${key}`
      const subResults = diff(left[key], right[key], subPath)
      if (subResults.length) results.splice(results.length, 0, ...subResults)   // mutating state, but this seems more efficient
      return results
    }, [] as DiffList)
  }

  return [[SET, path, right]]
}
