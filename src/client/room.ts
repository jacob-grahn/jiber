import {
  Action,
  Store,
  JOIN_ROOM,
  CLIENT,
  get,
  createSubscription
} from '../core/index'

/**
 * Create a room interface to make some code more convinient
 */
export const createCreateRoom = (store: Store) => {
  return ($roomId: string) => {

    // subscribe to events that target this room
    const subscription = createSubscription()
    store.subscribe((action: Action) => {
      if (action.$roomId === $roomId) {
        subscription.publish(action)
      }
    })

    const getRoom = () => {
      const state = store.getState()
      const roomState = state.rooms[$roomId]
      return roomState
    }

    const dispatch = (action: Action) => {
      store.dispatch({...action, $roomId, $source: CLIENT})
    }

    const getState = () => get(getRoom(), 'optimistic')
    const getConfirmedState = () => get(getRoom(), 'confirmed')

    dispatch({type: JOIN_ROOM})

    return {
      dispatch,
      getState,
      getConfirmedState,
      subscribe: subscription.subscribe
    }
  }
}
