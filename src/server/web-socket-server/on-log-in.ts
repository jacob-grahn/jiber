import { Action } from '../../core'
import LogInResult from '../interfaces/log-in-result'
import store from '../store'
import { userLogIn } from '../reducers/users/user-actions'

export default function onLogIn (socketId: string, action: Action): void {
  store.state.options.onLogIn(action)
  .then((result: LogInResult) => {
    store.commit(userLogIn(result))
  })
}
