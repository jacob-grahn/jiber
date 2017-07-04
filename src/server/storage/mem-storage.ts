import { Action, HopeAction, RoomState } from '../../core/index'

interface RoomStorage {
  pendingActions: HopeAction[],
  state: RoomState
}

const rooms: {[key: string]: RoomStorage} = {}
const defaultRoomStorage: RoomStorage = {
  pendingActions: [],
  state: {
    actionIds: {},
    confirmedState: undefined,
    lastUpdatedAt: 0
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

async function pushAction (
  roomId: string,
  action: Action
): Promise<any> {
  const roomStorage = getRoom(roomId)
  const pendingActions = roomStorage.pendingActions
  const timeMs = new Date().getTime()
  const meta = action.$hope || {}
  const timedAction = {...action, $hope: {...meta, timeMs}}
  pendingActions.push(timedAction)
  return true
}

async function fetchActions (
  roomId: string,
  minTimeMs: number
): Promise<HopeAction[]> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  return actions.filter(action => action.$hope.timeMs > minTimeMs)
}

async function removeActions (roomId: string, minTimeMs: number): Promise<any> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  const newActions = actions.filter(action => action.$hope.timeMs >= minTimeMs)
  roomStorage.pendingActions = newActions
  return true
}

async function fetchState (roomId: string): Promise<RoomState> {
  const roomStorage = getRoom(roomId)
  return roomStorage.state
}

async function storeState (roomId: string, state: RoomState): Promise<boolean> {
  const roomStorage = getRoom(roomId)
  roomStorage.state = state
  return true
}

// Store a state in memory
export default {
  pushAction,
  fetchActions,
  removeActions,
  fetchState,
  storeState,
  clear
}
