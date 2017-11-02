import { ServerStore } from '../server-store'

export const saveRoom = async (store: ServerStore, roomId: string) => {
  const state = store.getState()
  const roomState = state.rooms[roomId]
  if (!roomState) return

  await store.db.stashState(roomId, roomState)
}
