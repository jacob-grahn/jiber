import { Action } from '../../core/index'

export default function createOnMessage (
  dispatchAction: (action: Action) => void,
  actionHandler: (socket: WebSocket, action: Action) => void
) {
  return function onMessage (event: MessageEvent): void {
    try {
      const action = JSON.parse(event.data)
      const socket = event.target as WebSocket
      dispatchAction(action)
      actionHandler(socket, action)
    } catch (e) {
      /* do nothing */
    }
  }
}
