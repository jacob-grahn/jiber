import { Action, SERVER } from '../../core/index'

export const createOnMessage = (
  dispatch: (action: Action) => void,
  actionHandler: (socket: WebSocket, action: Action) => void
) => {
  return (event: MessageEvent): void => {
    try {
      const action = JSON.parse(event.data)
      const socket = event.target as WebSocket
      action.$source = SERVER
      dispatch(action)
      actionHandler(socket, action)
    } catch (e) {
      /* do nothing */
    }
  }
}
