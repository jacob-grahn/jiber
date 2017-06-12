import { Action, Store } from '../../core/index'
import { logIn } from '../reducers/user'

export default function createOnLogIn (store: Store) {
  return async function onLogIn (action: Action): Promise<void> {
    const result = await store.getState().options.onLogIn(action)
    store.dispatch(logIn(result))
  }
}
