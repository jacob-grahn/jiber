import Storage from '../interfaces/storage'
import { Action } from '../../core/index'
import { InternalRoomState } from '../reducers/room'

interface RoomStorage {
  pendingActions: Action[],
  state: InternalRoomState
}

const rooms: {[key: string]: RoomStorage} = {}
const defaultRoomStorage: RoomStorage = {
  pendingActions: [],
  state: {
    actionIds: {},
    confirmedState: null,
    lastUpdateMs: 0
  }
}

function getRoom (roomId: string): RoomStorage {
  if (!rooms[roomId]) {
    rooms[roomId] = {...defaultRoomStorage}
  }
  return rooms[roomId]
}

async function addActions (roomId: string, actions: Action[]): Promise<any> {
  const roomStorage = getRoom(roomId)
  const timeMs = new Date().getTime()
  actions.forEach(action => action.$hope.timeMs = timeMs)
  roomStorage.pendingActions = [...roomStorage.pendingActions, ...actions]
  return true
}

async function getActions (roomId: string, minTimeMs: number): Promise<Action[]> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  return actions.filter(action => action.$hope.timeMs >= minTimeMs)
}

async function removeActions (roomId: string, minTimeMs: number): Promise<any> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  const newActions = actions.filter(action => action.$hope.timeMs >= minTimeMs)
  roomStorage.pendingActions = newActions
  return true
}

async function getState (roomId: string): Promise<any> {
  const roomStorage = getRoom(roomId)
  return roomStorage
}

async function setState (roomId: string, newState: any): Promise<any> {
  const roomStorage = getRoom(roomId)
  roomStorage.state = newState
  return true
}

// Store a state in memory
const storage: Storage = {
  addActions,
  getActions,
  removeActions,
  getState,
  setState
}

export { storage as default }
