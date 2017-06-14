import { Action, Store, loginResult, addUser } from '../../core/index'
import LoginRequestHandler from '../interfaces/login-request-handler'
import LoginResult from '../interfaces/login-result'

export default function createOnLogin (
  store: Store,
  loginRequestHandler: LoginRequestHandler,
  sendToSocket: Function
) {
  return async function onLogin (
    socketId: string,
    action: Action
  ): Promise<LoginResult> {
    const result = await loginRequestHandler(action)
    const userData = {userId: result.userId, socketId, public: result}

    store.dispatch(addUser(userData))
    sendToSocket(socketId, loginResult(userData.public))

    return result
  }
}
