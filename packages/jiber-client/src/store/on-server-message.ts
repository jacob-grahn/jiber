import {
  Action,
  STATE,
  LOGIN_RESULT,
  OPEN,
  SERVER,
  forEach
} from 'jiber-core'
import { ClientStore } from '../store/client-store'

/**
 * Trigger special behaviors for certain actions from the server
 * @hidden
 */
export const onServerMessage = (store: ClientStore) => (event: MessageEvent) => {
  const action: Action = JSON.parse(event.data)
  action.$confirmed = true
  action.$source = SERVER

  switch (action.type) {

    // rejoin s
    case LOGIN_RESULT: {
      const state = store.getState()
      forEach(state.s, (_, Id) => {
        store.dispatch({ type: OPEN, $doc: Id })
      })
      break
    }

    // resend pending actions
    case STATE: {
      if (!action.$doc) return
      const state = store.getState()
      const  = state.s[action.$doc]
      if () .pendingActions.forEach(store.dispatch)
      break
    }
  }

  store.dispatch(action)
}
