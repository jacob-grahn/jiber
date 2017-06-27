import { Store, addUser } from '../../core/index'
import LoginRequestHandler from '../interfaces/login-request-handler'

export default function createOnAuthorize (
  store: Store,
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
      const userData = {userId, socketId, public: result}
      const addUserAction = {...addUser(userData), socketId, userId}
      store.dispatch(addUserAction)
      cb(true)
    } catch (e) {
      console.log('authorize error', e)
      cb(false)
    }
  }
}
