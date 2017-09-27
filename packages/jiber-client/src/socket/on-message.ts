import { Action } from 'jiber-core'

/**
 * Send incoming actions to the reducer
 */
export const createOnMessage = (
  dispatch: (action: Action) => void,
  actionHandler: (action: Action) => void
) => {
  return (event: MessageEvent): void => {
    try {
      const action = JSON.parse(event.data)
      action.$confirmed = true
      actionHandler(action)
      dispatch(action)
    } catch (e) {
      /* do nothing */
    }
  }
}
