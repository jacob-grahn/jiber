import { Action, Store, loginResult, addUser, LOGIN_REQUEST } from '../../core/index'
import LoginRequestHandler from '../interfaces/login-request-handler'

export default function createOnLogin (
  store: Store,
  loginRequestHandler: LoginRequestHandler,
  sendToSocket: Function
) {
  return async function onLogin (
    socketId: string,
    action: Action
  ): Promise<void> {
    if (action.type !== LOGIN_REQUEST) throw new Error('BAD_LOGIN_ACTION')
    const result = await loginRequestHandler(action)
    const userId = result.userId
    const userData = {userId, socketId, public: result}
    const addUserAction = {...addUser(userData), socketId, userId}

    store.dispatch(addUserAction)
    sendToSocket(socketId, loginResult(userData.public))
  }
}
