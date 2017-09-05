/**
 * Store room data in memory
 */

import { Action, RoomState } from '../../core/index'

interface RoomStorage {
  pendingActions: Action[],
  state: RoomState
}

const rooms: {[key: string]: RoomStorage} = {}

const getRoom = (roomId: string): RoomStorage => {
  if (!rooms[roomId]) {
    rooms[roomId] = {pendingActions: [], state: undefined} as any
  }
  return rooms[roomId]
}

const clear = () => {
  Object.keys(rooms).forEach(roomId => delete rooms[roomId])
}

const pushAction = async (roomId: string, action: Action): Promise<void> => {
  const roomStorage = getRoom(roomId)
  const pendingActions = roomStorage.pendingActions
  const $timeMs = new Date().getTime()
  const timedAction = {...action, $timeMs}
  pendingActions.push(timedAction)
  return
}

const fetchActions = async (
  roomId: string,
  minTimeMs: number
): Promise<Action[]> => {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  return actions.filter(action => action.$timeMs as number > minTimeMs)
}

const removeActions = async (
  roomId: string,
  minTimeMs: number
): Promise<any> => {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  const newActions = actions.filter(action => {
    return action.$timeMs as number >= minTimeMs
  })
  roomStorage.pendingActions = newActions
  return true
}

const fetchState = async (roomId: string): Promise<RoomState> => {
  const roomStorage = getRoom(roomId)
  return roomStorage.state
}

const storeState = async (roomId: string, state: RoomState): Promise<void> => {
  const roomStorage = getRoom(roomId)
  roomStorage.state = state
}

// Store a state in memory
export const memStorage = {
  pushAction,
  fetchActions,
  removeActions,
  fetchState,
  storeState,
  clear
}
