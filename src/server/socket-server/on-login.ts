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
    const userId = result.userId
    const userData = {userId, socketId, public: result}
    const addUserAction = {...addUser(userData), socketId, userId}

    store.dispatch(addUserAction)
    sendToSocket(socketId, loginResult(userData.public))

    return result
  }
}
