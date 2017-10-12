import { Action, RoomState, CONFIRMED_STATE } from 'jiber-core'

const defaultRoomState: RoomState = {
  members: {},
  confirmed: undefined,
  lastUpdatedAt: 0
}

export const createEnsureRoom = (
  dispatch: (action: Action) => any,
  getRoomState: (roomId: string) => RoomState,
  fetchRoomState: (roomId: string) => Promise<RoomState>
) => {

  // if the room does not exist, create a new room using a snapshot from db
  return async ($r: string): Promise<RoomState> => {
    const roomState = getRoomState($r)
    if (roomState) return roomState

    const savedRoomState = await fetchRoomState($r)
    if (savedRoomState) {
      dispatch({...savedRoomState, type: CONFIRMED_STATE, $r})
      return savedRoomState
    }

    dispatch({...defaultRoomState, type: CONFIRMED_STATE, $r})
    return defaultRoomState
  }
}
