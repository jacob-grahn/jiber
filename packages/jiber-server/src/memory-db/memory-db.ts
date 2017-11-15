/**
 * Store room data in memory.
 * This serves as a fake database if one is not provided
 */

import { Action, RoomState, DB } from 'jiber-core'

const rooms: {[key: string]: RoomState} = {}

export const memoryDB: DB = {
  pushAction: (action: Action): void => {
    action.$t = new Date().getTime()
    if (memoryDB.onaction) memoryDB.onaction(action)
  },
  fetchState: async (roomId: string): Promise<RoomState> => {
    return rooms[roomId]
  },
  stashState: (roomId: string, state: RoomState): void => {
    rooms[roomId] = state
  }
}
