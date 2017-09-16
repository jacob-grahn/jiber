/**
 * Store room data in memory.
 * This serves as a fake database if one is not provided
 */

import { Action, RoomState, DB, ACTION_PUSHED } from 'jiber-core'
import * as EventEmitter from 'events'

const emitter = new EventEmitter()

const rooms: {[key: string]: RoomState} = {}

const pushAction = (action: Action): void => {
  if (!action.$roomId) return
  emitter.emit(ACTION_PUSHED, action)
}

const fetchState = async (roomId: string): Promise<RoomState> => {
  return rooms[roomId]
}

const stashState = (roomId: string, state: RoomState): void => {
  rooms[roomId] = state
}

export const memoryDB: DB = {
  emitter,
  pushAction,
  fetchState,
  stashState
}
