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
  return async ($roomId: string): Promise<RoomState> => {
    const roomState = getRoomState($roomId)
    if (roomState) return roomState

    const savedRoomState = await fetchRoomState($roomId)
    if (savedRoomState) {
      dispatch({...savedRoomState, type: CONFIRMED_STATE, $roomId})
      return savedRoomState
    }

    dispatch({...defaultRoomState, type: CONFIRMED_STATE, $roomId})
    return defaultRoomState
  }
}
