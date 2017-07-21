import { UserState } from '../../core/index'
import ClientRoomState from './client-room-state'

interface ClientState {
  users: {
    [userId: string]: UserState
  },
  rooms: {
    [roomId: string]: ClientRoomState
  },
  me: UserState
}

export default ClientState
