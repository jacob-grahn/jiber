import { Action, CONFIRM_ACTION } from '../../core/index'

export default function createDispatchAction (
  dispatch: (action: Action) => void
) {
  return function dispatchAction (action: Action): void {
    isReserved(action) ? dispatchReserved(action) : dispatchOther(action)
  }

  function isReserved (action: Action): boolean {
    return !!(action.type && action.type.indexOf('hope/') === 0)
  }

  function dispatchReserved (action: Action): void {
    dispatch(action)
  }

  function dispatchOther (action: Action): void {
    if (!action.$hope || !action.$hope.roomId) return
    const roomId = action.$hope.roomId
    dispatch({type: CONFIRM_ACTION, action, $hope: {roomId}})
  }
}
