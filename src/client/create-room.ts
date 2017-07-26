import { Action, Store, JOIN_ROOM } from '../core/index'
import ClientRoomState from './interfaces/client-room-state'

export default function (store: Store) {
  return function createRoom (roomId: string) {
    store.dispatch({type: JOIN_ROOM, $hope: {roomId}})

    function getRoom (): ClientRoomState {
      const state = store.getState()
      return state.rooms[roomId] || {}
    }

    return {
      dispatch: (action: Action): void => {
        const $hope = action.$hope ? {...action.$hope, roomId} : {roomId}
        const roomAction: Action = {...action, $hope}
        store.dispatch(roomAction)
      },
      getState: (): any => getRoom().optimistic,
      getConfirmedState: (): any => getRoom().confirmed
    }
  }
}
