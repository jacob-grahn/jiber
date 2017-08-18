import { Action, ADD_USER } from '../../core/index'
import LoginRequestHandler from '../interfaces/login-request-handler'

/**
 * called when a http request tries to upgrade to a socket connection
 * sec-websocket-protocol is abused as a way to pass along an access credential
 * the credential is passed to loginRequestHandler, which may be user supplied
 * if no error is thrown, then the user is considered logged in
 * TODO: decide what format loginRequestHandler should return
 * TODO: the action and user account store the same userId in multiple places
 */
export default function createOnAuthorize (
  dispatch: (action: Action) => void,
  loginRequestHandler: LoginRequestHandler
) {
  return async function onAuthorize (
    info: {origin: string, req: any, secure: boolean},
    cb: (result: boolean, code?: number, name?: string) => void
  ) {
    try {
      const socketId = info.req.headers['sec-websocket-key']
      const credential = info.req.headers['sec-websocket-protocol']
      const result = await loginRequestHandler(credential)
      const userId = result.userId
      const user = {userId, socketId, public: result}
      const action = {type: ADD_USER, user, socketId, userId}
      dispatch(action)
      cb(true)
    } catch (e) {
      cb(false)
    }
  }
}
