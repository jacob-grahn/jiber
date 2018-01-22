import { Action } from 'jiber-core'
import * as WS from 'ws'

/**
 * send an action to a particular socket
 */
export const sendToSocket = (ws: WS, action: Action): void => {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(action))
  }
}
