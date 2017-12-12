import {
  Action,
  Store,
  JOIN_ROOM,
  get,
  createSubscription
} from 'jiber-core'
import { ClientState } from './interfaces/client-state'
import { toDispatchers } from './to-dispatchers'

/**
 * Create a room interface to make some code more convinient
 */
export const createCreateRoom = (
  store: Store,
  actionCreators: {[key: string]: Function} = {}
) => {
  return (roomId: string) => {

    const getRoom = () => {
      const state = store.getState()
      return state.rooms[roomId]
    }

    const dispatch = (action: Action) => {
      store.dispatch({ ...action, $roomId: roomId })
    }

    const getState = () => get(getRoom(), 'optimistic')
    const getConfirmedState = () => get(getRoom(), 'confirmed')
    const actionDispatchers = toDispatchers(dispatch, actionCreators)

    dispatch({ type: JOIN_ROOM })

    // subscribe to events that target this room
    const subscription = createSubscription()
    store.subscribe((state: ClientState, action: Action) => {
      if (action && action.$roomId === roomId) {
        subscription.publish(state.rooms[roomId].optimistic, action)
      }
    })

    return {
      ...actionDispatchers,
      dispatch,
      getState,
      getConfirmedState,
      subscribe: subscription.subscribe
    }
  }
}
