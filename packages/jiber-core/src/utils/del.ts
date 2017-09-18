import { set } from './set'

/**
 * remove a key from a collection
 */
export const del = (obj: any, path: string|string[] = ''): any => {
  return set(obj, path, undefined)
}
