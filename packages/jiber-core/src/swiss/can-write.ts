import { get } from '../utils/get'
import { toZeroes } from './to-zeroes'

/**
 * Use rules to determine if a path is writeable
 */
export const canWrite = (rules: any, path: string): boolean => {
  const keys = toZeroes(path.split('.'))
  let len = keys.length
  while(len >= 0) {
    const write = get(rules, [...keys, '.write'])
    if (write === true) return true
    if (write === false) return false
    keys.pop()
    len--
  }
  return false
}
