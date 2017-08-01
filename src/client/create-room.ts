import { Action, Store, JOIN_ROOM, CLIENT } from '../core/index'
import ClientRoomState from './interfaces/client-room-state'

const $source = CLIENT

export default function (store: Store) {
  return function createRoom ($roomId: string) {
    dispatch({type: JOIN_ROOM})

    function getRoom (): ClientRoomState {
      const state = store.getState()
      return state.rooms[$roomId] || {}
    }

    function dispatch (action: Action): void {
      return store.dispatch({...action, $roomId, $source})
    }

    function getState (): any {
      return getRoom().optimistic
    }

    function getConfirmedState (): any {
      return getRoom().confirmed
    }

    return {
      dispatch,
      getState,
      getConfirmedState
    }
  }
}
