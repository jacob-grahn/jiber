import { forEach } from './for-each'

/**
 * A version of reduce that works with objects
 */
export const reduce = (
  obj: any,
  func: (collector: any, value: any, key: string) => any,
  collector: any
) => {
  forEach(obj, (value, key) => collector = func(collector, value, key))
  return collector
}
