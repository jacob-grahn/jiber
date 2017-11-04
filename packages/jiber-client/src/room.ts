import {
  Action,
  Store,
  JOIN_ROOM,
  get,
  createSubscription
} from 'jiber-core'
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
      store.dispatch({ ...action, $r: roomId })
    }

    const getState = () => get(getRoom(), 'optimistic')
    const getConfirmedState = () => get(getRoom(), 'confirmed')
    const actionDispatchers = toDispatchers(dispatch, actionCreators)

    dispatch({ type: JOIN_ROOM })

    // subscribe to events that target this room
    const subscription = createSubscription()
    store.subscribe((action: Action) => {
      if (action.$r === roomId) {
        subscription.publish(getRoom().optimistic, action)
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
