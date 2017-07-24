import { Action, Store, JOIN_ROOM } from '../core/index'

export default function (store: Store) {
  return function createRoom (roomId: string) {
    store.dispatch({type: JOIN_ROOM, $hope: {roomId}})
    return {
      dispatch: (action: Action): void => {
        const $hope = action.$hope ? {...action.$hope, roomId} : {roomId}
        const roomAction: Action = {...action, $hope}
        store.dispatch(roomAction)
      },
      getState: (): any => {
        const state = store.getState()
        return state.rooms[roomId].optimistic
      },
      getConfirmedState: (): any => {
        const state = store.getState()
        return state.rooms[roomId].confirmed
      }
    }
  }
}
