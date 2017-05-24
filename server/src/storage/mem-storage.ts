import Storage from '../interfaces/storage'
import { Action } from '../../../core/index'

interface RoomStorage {
  actions: Action[],
  state: any,
  lastUpdateMs: number
}

const rooms: {[key: string]: RoomStorage} = {}
const defaultRoomStorage: RoomStorage = {
  actions: [],
  state: null,
  lastUpdateMs: 0
}

function getRoom (roomId: string): RoomStorage {
  if (!rooms[roomId]) {
    rooms[roomId] = {...defaultRoomStorage}
  }
  return rooms[roomId]
}

function addAction (roomId: string, action: Action): Promise<any> {
  const roomStorage = getRoom(roomId)
  roomStorage.actions.push(action)
  return Promise.resolve(true)
}

function getNewActions (roomId: string, minTimeMs: number): Promise<Action[]> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.actions
  const newActions = actions.filter(action => action.timeMs >= minTimeMs)
  return Promise.resolve(newActions)
}

function removeOldActions (roomId: string, minTimeMs: number): Promise<any> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.actions
  const newActions = actions.filter(action => action.timeMs >= minTimeMs)
  roomStorage.actions = newActions
  return Promise.resolve(true)
}

function getState (roomId: string): Promise<any> {
  const roomStorage = getRoom(roomId)
  return Promise.resolve(roomStorage.state)
}

function setState (roomId: string, newState: any): Promise<any> {
  const roomStorage = getRoom(roomId)
  roomStorage.state = newState
  return Promise.resolve(true)
}

// Store a state in memory
const storage: Storage = {
  addAction,
  getNewActions,
  removeOldActions,
  getState,
  setState
}

export { storage as default }
