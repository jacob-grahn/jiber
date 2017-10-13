import { reduce } from 'jiber-core'

/**
 * turn some action creators into handy dandy action dispatchers
 */
export const createDispatchers = (
  dispatch: Function,
  actionCreators: {[key: string]: Function} = {}
) => {
  return reduce(actionCreators, (dispatchers, actionCreator, key) => {
    dispatchers[key] = (...params: any[]) => dispatch(actionCreator(...params))
    return dispatchers
  }, {})
}
