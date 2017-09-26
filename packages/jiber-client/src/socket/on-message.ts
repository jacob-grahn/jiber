import { Action, SERVER } from 'jiber-core'

/**
 * Send incoming actions to the reducer
 */
export const createOnMessage = (
  dispatch: (action: Action) => void,
  actionHandler: (socket: WebSocket, action: Action) => void
) => {
  return (event: MessageEvent): void => {
    try {
      const action = JSON.parse(event.data)
      const socket = event.target as WebSocket
      action.$source = SERVER
      actionHandler(socket, action)
      dispatch(action)
    } catch (e) {
      /* do nothing */
    }
  }
}
