export const createDispatchers = (
  dispatch: Function,
  actionCreators: {[key: string]: Function} = {}
) => {
  const actionKeys = Object.keys(actionCreators)
  const actionDispatchers = actionKeys.reduce((collector, key) => {
    const actionCreator = actionCreators[key]
    collector[key] = (...params: any[]) => {
      dispatch(actionCreator(...params))
    }
    return collector
  }, {} as {[key: string]: Function})
  return actionDispatchers
}
