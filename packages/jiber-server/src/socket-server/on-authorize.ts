import { ADD_USER } from 'jiber-core'
import { ServerStore } from '../server-store'

/**
 * called when a http request tries to upgrade to a socket connection
 * sec-websocket-protocol is abused as a way to pass along an access credential
 * the credential is passed to loginRequestHandler, which may be user supplied
 * if no error is thrown, then the user is considered logged in
 */
export const onAuthorize = async (
  store: ServerStore,
  info: {origin: string, req: any, secure: boolean},
  cb: (result: boolean, code?: number, name?: string) => void
) => {
  try {
    const socketId = info.req.headers['sec-websocket-key']
    const credential = info.req.headers['sec-websocket-protocol']
    const user = await store.settings.login(credential)
    user.socketId = socketId
    const action = {type: ADD_USER, user, socketId, userId: user.userId}
    store.dispatch(action)
    cb(true)
  } catch (e) {
    cb(false)
  }
}
