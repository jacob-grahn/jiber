import { Action } from '../../core/index'
import LogInResult from '../interfaces/log-in-result'
import store from '../store'
import { logIn } from '../reducers/user'

export default async function onLogIn (
  socketId: string,
  action: Action
): Promise<void> {
  const result = await store.getState().options.onLogIn(action)
  store.dispatch(logIn(result))
}
