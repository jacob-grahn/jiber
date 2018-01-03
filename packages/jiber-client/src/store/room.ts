import {
  Action,
  Store,
  JOIN_ROOM,
  createSubscription
} from 'jiber-core'
import { ClientState } from '../interfaces/client-state'
import { ActionCreators } from '../interfaces/action-creators'
import { toDispatchers } from './to-dispatchers'

/**
 * Room the users can join. Users in the same room share the room's state.
 * @hidden
 */
export class Room {
  public subscribe: Function
  private store: Store
  private roomId: string

  constructor (
    store: Store,
    roomId: string,
    actionCreators: ActionCreators = {}
  ) {
    this.store = store
    this.roomId = roomId
    this.dispatch({ type: JOIN_ROOM })

    // action dispatchers
    const actionDispatchers = toDispatchers(this.dispatch, actionCreators)
    Object.assign(this, actionDispatchers)

    // subscribe to events that target this room
    const subscription = createSubscription()
    store.subscribe((state: ClientState, action: Action) => {
      if (action && action.$roomId === roomId) {
        subscription.publish(state.rooms[roomId].optimistic, action)
      }
    })
    this.subscribe = subscription.subscribe
  }

  public dispatch = (action: Action) => {
    this.store.dispatch({ ...action, $roomId: this.roomId })
  }

  public getState = () => this.getRoomState().optimistic

  public getConfirmedState = () => this.getRoomState().confirmed

  private getRoomState = () => {
    const state = this.store.getState()
    return state.rooms[this.roomId]
  }
}
