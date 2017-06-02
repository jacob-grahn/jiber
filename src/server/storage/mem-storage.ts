import Storage from '../interfaces/storage'
import { Action, HopeAction } from '../../core/index'

interface RoomStorage {
  pendingActions: HopeAction[],
  state: any
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
    rooms[roomId] = JSON.parse(JSON.stringify(defaultRoomStorage))
  }
  return rooms[roomId]
}

function clear () {
  Object.keys(rooms).forEach(roomId => delete rooms[roomId])
}

async function addActions (
  roomId: string,
  actions: Action[]
): Promise<any> {
  const roomStorage = getRoom(roomId)
  const pendingActions = roomStorage.pendingActions
  const timeMs = new Date().getTime()
  const timedActions = actions.map(action => {
    const meta = action.$hope || {}
    return {...action, $hope: {...meta, timeMs}}
  })
  pendingActions.splice(pendingActions.length, 0, ...timedActions)
  return true
}

async function getActions (
  roomId: string,
  minTimeMs: number
): Promise<HopeAction[]> {
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
  return roomStorage.state
}

async function setState (roomId: string, newState: any): Promise<any> {
  const roomStorage = getRoom(roomId)
  roomStorage.state = newState
  return true
}

// Store a state in memory
export default {
  addActions,
  getActions,
  removeActions,
  getState,
  setState,
  clear
}
