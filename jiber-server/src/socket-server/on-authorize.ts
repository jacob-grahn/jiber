import { Action, ADD_USER } from '../core'
import { LoginRequestHandler } from '../interfaces/login-request-handler'

export type CreateOnAuthorize = (
  dispatch: (action: Action) => void,
  loginRequestHandler: LoginRequestHandler
) => OnAuthorize
export type OnAuthorize = (
  info: {origin: string, req: any, secure: boolean},
  cb: (result: boolean, code?: number, name?: string) => void
) => Promise<void>

/**
 * called when a http request tries to upgrade to a socket connection
 * sec-websocket-protocol is abused as a way to pass along an access credential
 * the credential is passed to loginRequestHandler, which may be user supplied
 * if no error is thrown, then the user is considered logged in
 */
export const createOnAuthorize: CreateOnAuthorize = (dispatch, loginRequest) => {
  return async (info, cb) => {
    try {
      const socketId = info.req.headers['sec-websocket-key']
      const credential = info.req.headers['sec-websocket-protocol']
      const user = await loginRequest(credential)
      const action = {type: ADD_USER, user, socketId, userId: user.userId}
      dispatch(action)
      cb(true)
    } catch (e) {
      cb(false)
    }
  }
}
