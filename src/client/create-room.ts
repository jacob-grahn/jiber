import { Action, JOIN_ROOM, CLIENT, get } from '../core/index'
import ClientStore from './interfaces/client-store'

export const createCreateRoom = (store: ClientStore) => {
  return ($roomId: string) => {
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
      getConfirmedState
    }
  }
}
