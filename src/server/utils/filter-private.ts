const PRIVATE_PREFIX = '_' // TODO: this should be user customizable

import filterRecursive from './filter-recursive'

const testFunc = (key: string|number) => {
  if (typeof key === 'number') return true
  return key.indexOf(PRIVATE_PREFIX) !== 0
}

export default function filterPrivate (data: any): any {
  return filterRecursive(data, testFunc)
}
