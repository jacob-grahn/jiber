import { Action } from '../../core/index'
import { createUpdateRoom } from './update-room'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let roomState: any
let newActions: any[]
let calls: any[]
const ensureRoom = async (_roomId: string) => roomState
const fetchActions = async (_roomId: string, _minTimeMs: number) => newActions
const applyAction = (action: Action) => calls.push(['applyAction', action])
const saveRoom = (roomId: string) => calls.push(['saveRoom', roomId])

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
roomState = {lastUpdatedAt: 0}
const updateRoom = createUpdateRoom(
  ensureRoom,
  fetchActions,
  applyAction,
  saveRoom
)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('apply actions', async () => {
  newActions = [{type: 'action1'}, {type: 'action2'}]
  await updateRoom('room1')
  await new Promise(resolve => process.nextTick(resolve))
  expect(calls).toEqual([
    ['applyAction', {type: 'action1'}],
    ['applyAction', {type: 'action2'}],
    ['saveRoom', 'room1']
  ])
})
