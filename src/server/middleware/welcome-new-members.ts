import { HopeAction, JOIN_ROOM, CONFIRMED_STATE, SERVER } from '../../core/index'
import ServerStore from '../interfaces/server-store'

export default ((sendToUser: (userId: string, action: HopeAction) => void) => {
  return (store: ServerStore) => (next: Function) => (action: HopeAction) => {
    next(action)
    if (action.type === JOIN_ROOM) {
      const state = store.getState()
      const roomId = action.$hope.roomId
      const room = state.rooms[roomId]
      const message: HopeAction = {
        type: CONFIRMED_STATE,
        confirmedState: room.confirmedState,
        actionIds: room.actionIds,
        $hope: {
          roomId,
          userId: '',
          actionId: 0,
          source: SERVER,
          timeMs: new Date().getTime()
        }
      }
      sendToUser(action.$hope.userId, message)
    }
  }
})
