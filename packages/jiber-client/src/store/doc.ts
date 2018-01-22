import {
  Action,
  Store,
  OPEN,
  createSubscription
} from 'jiber-core'
import { ClientState } from '../interfaces/client-state'
import { ActionCreators } from '../interfaces/action-creators'
import { toDispatchers } from './to-dispatchers'

/**
 * Doc the users can join. Users in the same  share the 's state.
 * @hidden
 */
export class Doc {
  public subscribe: Function
  private store: Store
  private Id: string

  constructor (
    store: Store,
    Id: string,
    actionCreators: ActionCreators = {}
  ) {
    this.store = store
    this.Id = Id
    this.dispatch({ type: OPEN })

    // action dispatchers
    const actionDispatchers = toDispatchers(this.dispatch, actionCreators)
    Object.assign(this, actionDispatchers)

    // subscribe to events that target this
    const subscription = createSubscription()
    store.subscribe((state: ClientState, action: Action) => {
      if (action && action.$doc === Id) {
        subscription.publish(state.docs[Id].optimistic, action)
      }
    })
    this.subscribe = subscription.subscribe
  }

  public dispatch = (action: Action) => {
    this.store.dispatch({ ...action, $doc: this.Id })
  }

  public getState = () => this.getDocState().optimistic

  public getConfirmedState = () => this.getDocState().confirmed

  private getDocState = () => {
    const state = this.store.getState()
    return state.s[this.Id]
  }
}
