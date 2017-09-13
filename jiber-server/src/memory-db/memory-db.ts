/**
 * Store room data in memory.
 * This serves as a fake database if one is not provided
 */

import { Action, RoomState, ACTION_PUSHED } from '../core'
import { DB } from '../interfaces/DB'
import * as EventEmitter from 'events'

const emitter = new EventEmitter()

const rooms: {[key: string]: RoomState} = {}

const pushAction = async (roomId: string, action: Action): Promise<void> => {
  emitter.emit(ACTION_PUSHED, roomId, action)
}

const fetchState = async (roomId: string): Promise<RoomState> => {
  return rooms[roomId]
}

const stashState = async (roomId: string, state: RoomState): Promise<void> => {
  rooms[roomId] = state
}

export const memoryDB: DB = {
  emitter,
  pushAction,
  fetchState,
  stashState
}
