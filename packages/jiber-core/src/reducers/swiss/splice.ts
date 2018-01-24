import { toArray } from './to-array'

/**
 * splice without mutating state
 */
export const splice = (
  value: any,
  start: number,
  count: number,
  ...items: any[]
): any[] => {
  const array = toArray(value)
  const copy = [...array]
  copy.splice(start, count, ...items)
  return copy
}
