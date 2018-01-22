import { Action } from 'jiber-core'
import * as WS from 'ws'

/**
 * send an action to a particular socket
 */
export const sendToSocket = (ws: WS | undefined, action: Action): void => {
  if (ws && ws.readyState === WS.OPEN) {
    ws.send(JSON.stringify(action))
  }
}
