import { Action } from 'jiber-core'
import { createApplyAction } from './apply-action'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const dispatch = (action: Action) => {
  calls.push(['dispatch', action])
}
const sendToRoom = (roomId: string, action: Action) => {
  calls.push(['sendToRoom', roomId, action])
}
const getState = () => {
  return {
    rooms: {},
    users: {},
    sockets: {}
  }
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const applyAction = createApplyAction(dispatch, getState, sendToRoom)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('quick apply an action and send it out to room members', () => {
  const action = {type: 'hi', $roomId: 'room1', $timeMs: 5465}
  applyAction(action)
  expect(calls).toEqual([
    ['dispatch', action],
    ['sendToRoom', 'room1', action]
  ])
})

test('raw apply an action and send it out to room members', () => {
  const action = {type: 'hi', $roomId: 'room1'}
  applyAction(action)
  expect(calls).toEqual([
    ['dispatch', action],
    ['sendToRoom', 'room1', action]
  ])
})
