import { forEach } from './for-each'

/*
 * This does the same thing as Array.map, but for objects
 * If used with an array, the indexes will be treated as strings
 */
export const map = (
  obj: any,
  func: (value: any, key?: any) => any
) => {
  const results: {[key: string]: any} = {}
  forEach(obj, (value, key) => results[key] = func(value, key))
  return results
}
