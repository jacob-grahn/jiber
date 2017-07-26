import { Action, ADD_USER } from '../../core/index'
import LoginRequestHandler from '../interfaces/login-request-handler'

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
      console.log('authorize error', e)
      cb(false)
    }
  }
}
