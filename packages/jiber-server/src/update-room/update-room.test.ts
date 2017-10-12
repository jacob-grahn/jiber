import { Action } from 'jiber-core'
import { createUpdateRoom } from './update-room'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let roomState: any
let calls: any[]
const ensureRoom = async (_roomId: string) => roomState
const applyAction = (action: Action) => calls.push(['applyAction', action])
const saveRoom = (roomId: string) => calls.push(['saveRoom', roomId])

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
roomState = {lastUpdatedAt: 0}
const updateRoom = createUpdateRoom(
  ensureRoom,
  applyAction,
  saveRoom
)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('apply actions', async () => {
  await updateRoom({type: 'action1', $r: 'room1'})
  await updateRoom({type: 'action2', $r: 'room1'})
  await new Promise(resolve => process.nextTick(resolve))
  expect(calls).toEqual([
    ['applyAction', {type: 'action1', $r: 'room1'}],
    ['applyAction', {type: 'action2', $r: 'room1'}],
    ['saveRoom', 'room1'],
    ['saveRoom', 'room1']
  ])
})
