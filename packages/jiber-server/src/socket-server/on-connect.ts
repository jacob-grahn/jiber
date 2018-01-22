import { LOGIN_RESULT } from 'jiber-core'
import * as WS from 'ws'
import { sendToSocket } from './send-to-socket'
import { logger } from '../utils/logger'

/**
 * handles 'connect' socket event
 * adds some event listeners to the newly created socket
 * dispatches an event to add the socket to the store
 */
export const onConnect = (dispatch: Function, socketLookup: any) => (ws: WS, request: any) => {
  const user = request.verified
  const uid = user.uid

  // close old socket if there is one
  if (socketLookup[uid]) {
    socketLookup[uid].close()
  }

  // store new socket
  socketLookup[uid] = ws

  // add listeners
  ws.on('message', (data: any) => {
    try {
      const message = data.toString()
      const action = JSON.parse(message)
      action.$user = user
      dispatch(action)
    } catch (e) {
      logger.warning(e.message)
    }
  })
  ws.on('close', () => delete socketLookup[uid])
  ws.on('error', (err) => logger.error(err.message))

  // send login result
  const action = { type: LOGIN_RESULT, user }
  sendToSocket(ws, action)
}
