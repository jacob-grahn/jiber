import { Action, Store } from '../../core/index'
import { login } from '../reducers/users'
import LoginRequestHandler from '../interfaces/login-request-handler'
import LoginResult from '../interfaces/login-result'

export default function createOnLogin (
  store: Store,
  loginRequestHandler: LoginRequestHandler,
  sendToUser: Function
) {
  return async function onLogin (
    socketId: string,
    action: Action
  ): Promise<LoginResult> {
    const result = await loginRequestHandler(action)
    store.dispatch(login(socketId, result))
    sendToUser(result.id, login(socketId, result))
    return result
  }
}
