import { RoomState, UserDict } from 'jiber-core'
import { Socket } from '../reducers/socket/socket'

export interface ServerState {
  sockets: {
    [socketId: string]: Socket
  },
  users: UserDict,
  rooms: {
    [roomId: string]: RoomState
  }
}
