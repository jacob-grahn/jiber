import { Action, Store, ClientState, ActionCreators } from '../interfaces'
import { OPEN } from '../constants'
import { createSubscription } from '../utils/subscription'
import { toDispatchers } from './to-dispatchers'

/**
 * Doc the users can join. Users in the same  share the 's state.
 * @hidden
 */
export class Doc {
  public subscribe: Function
  private store: Store
  private id: string

  constructor (store: Store, id: string, actionCreators: ActionCreators = {}) {
    this.store = store
    this.id = id
    this.dispatch({ type: OPEN, $docId: id })

    // action dispatchers
    const actionDispatchers = toDispatchers(this.dispatch, actionCreators)
    Object.assign(this, actionDispatchers)

    // subscribe to events that target this
    const subscription = createSubscription()
    store.subscribe((state: ClientState, action: Action) => {
      if (action && action.$docId === id) {
        subscription.publish(state.optimisticDocs[id], action)
      }
    })
    this.subscribe = subscription.subscribe
  }

  public dispatch = (action: Action) => {
    this.store.dispatch({ ...action, $docId: this.id })
  }

  public getState = () => {
    const state = this.store.getState()
    return state.optimisticDocs[this.id]
  }

  public getConfirmedState = () => {
    const state = this.store.getState()
    return state.docs[this.id]
  }
}
