import { map } from 'jiber-core'
import { ActionCreators } from './interfaces/action-creators'

/**
 * turn some action creators into handy dandy action dispatchers
 * @hidden
 */
export const toDispatchers = (dispatch: Function, creators: ActionCreators) => {
  return map(creators, creator => {
    return (...params: any[]) => dispatch(creator(...params))
  })
}
