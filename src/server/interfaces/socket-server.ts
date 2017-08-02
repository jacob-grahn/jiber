import { Action } from '../../core/index'

export interface SocketServer {
  start: () => void,
  stop: () => void,
  sendToUser: (userId: string, action: Action) => void,
  sendToRoom: (roomId: string, action: Action) => void,
  onRoomChange?: (roomId: string) => void
}

export default SocketServer
