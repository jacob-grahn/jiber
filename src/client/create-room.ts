import { Action, Store, JOIN_ROOM } from '../core/index'
import ClientRoomState from './interfaces/client-room-state'

export default function (store: Store) {
  return function createRoom (roomId: string) {
    store.dispatch({type: JOIN_ROOM, $roomId: roomId})

    function getRoom (): ClientRoomState {
      const state = store.getState()
      return state.rooms[roomId] || {}
    }

    return {
      dispatch: (action: Action): void => {
        store.dispatch({...action, $roomId: roomId})
      },
      getState: (): any => getRoom().optimistic,
      getConfirmedState: (): any => getRoom().confirmed
    }
  }
}
