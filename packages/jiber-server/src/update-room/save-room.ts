import { noConcurrent } from '../utils/no-concurrent'
import { RoomState } from 'jiber-core'
import { StashState } from '../interfaces/db'

export const createSaveRoom = (
  snapshotInterval: number,
  getRoomState: (roomId: string) => RoomState,
  stashState: StashState
) => {
  const saveRoom = async (roomId: string) => {
    if (!roomId) return
    const roomState = getRoomState(roomId)
    if (!roomState) return
    await stashState(roomId, roomState)
    await new Promise(resolve => setTimeout(resolve, snapshotInterval))
  }

  return noConcurrent(saveRoom)
}
