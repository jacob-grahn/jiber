import { ServerStore } from '../server-store'
import { sleep } from '../utils/sleep'
import { noConcurrent } from '../utils/no-concurrent'

export const saveRoom = noConcurrent(async (
  store: ServerStore,
  roomId: string
): Promise<void> => {
  const state = store.getState()
  const roomState = state.rooms[roomId]
  if (!roomState) return

  await store.db.stashState(roomId, roomState)
  await sleep(store.settings.snapshotInterval)
})
