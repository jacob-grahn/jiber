import { Action, RoomState } from '../../core/index'

interface RoomStorage {
  pendingActions: Action[],
  state: RoomState
}

const rooms: {[key: string]: RoomStorage} = {}

function getRoom (roomId: string): RoomStorage {
  if (!rooms[roomId]) {
    rooms[roomId] = {pendingActions: [], state: undefined} as any
  }
  return rooms[roomId]
}

function clear () {
  Object.keys(rooms).forEach(roomId => delete rooms[roomId])
}

async function pushAction (
  roomId: string,
  action: Action
): Promise<void> {
  const roomStorage = getRoom(roomId)
  const pendingActions = roomStorage.pendingActions
  const $timeMs = new Date().getTime()
  const timedAction = {...action, $timeMs}
  pendingActions.push(timedAction)
  return
}

async function fetchActions (
  roomId: string,
  minTimeMs: number
): Promise<Action[]> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  return actions.filter(action => action.$timeMs as number > minTimeMs)
}

async function removeActions (roomId: string, minTimeMs: number): Promise<any> {
  const roomStorage = getRoom(roomId)
  const actions = roomStorage.pendingActions
  const newActions = actions.filter(action => {
    return action.$timeMs as number >= minTimeMs
  })
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
