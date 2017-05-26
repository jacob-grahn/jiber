import store from '../store'
import sendToSocket from './send-to-socket'
import { Action } from '../../core/index'

export default function sendToRoom (roomId: string, action: Action): void {
  const state = store.getState()
  const room = state.rooms[roomId]
  const memberIds: string[] = Object.keys(room.actionIds)
  memberIds.forEach(memberId => {
    const user = state.users[memberId]
    const socketId = user.socketId
    sendToSocket(socketId, action)
  })
}
