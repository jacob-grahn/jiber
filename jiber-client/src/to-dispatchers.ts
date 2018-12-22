import { ActionCreators } from './interfaces'

/**
 * turn some action creators into handy dandy action dispatchers
 * @hidden
 */
export const toDispatchers = (dispatch: Function, creators: ActionCreators) => {
  const dispatchers: any = {}
  Object.keys(creators).forEach((key: string) => {
    const creator = creators[key]
    dispatchers[key] = (...params: any[]) => dispatch(creator(...params))
  })
  return dispatchers
}
