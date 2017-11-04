import { map } from 'jiber-core'

type Creators = {[key: string]: Function}

/**
 * turn some action creators into handy dandy action dispatchers
 */
export const toDispatchers = (dispatch: Function, creators: Creators) => {
  return map(creators, creator => {
    return (...params: any[]) => dispatch(creator(...params))
  })
}
