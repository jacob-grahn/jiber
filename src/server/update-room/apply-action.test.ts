import {
  Action,
  PATCH,
  INJECT_PRIVATE,
  CLEAN_PRIVATE,
  CONFIRM_ACTION
} from '../../core/index'
import createApplyAction from './apply-action'

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
const getRoom = (_roomId: string): any => {
  return {}
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
const applyAction = createApplyAction(dispatch, getRoom, sendToRoom)
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('quick apply an action and send it out to room members', () => {
  const action = {type: 'hi', $roomId: 'room1'}
  applyAction(action)
  expect(calls).toEqual([
    ['dispatch', {type: CONFIRM_ACTION, action, $roomId: 'room1'}],
    ['sendToRoom', 'room1', action]
  ])
})

test('raw apply an action and send it out to room members', () => {
  const action = {type: 'hope/hi', $roomId: 'room1'}
  applyAction(action)
  expect(calls).toEqual([
    ['dispatch', action],
    ['sendToRoom', 'room1', action]
  ])
})

test('private apply an action and send out a diff', () => {
  const action = {type: '$serverOnly/hi', $roomId: 'room1', $timeMs: 123}
  applyAction(action)
  expect(calls).toEqual([
    ['dispatch', {
      type: INJECT_PRIVATE,
      $roomId: 'room1'
    }],
    ['dispatch', {
      type: CONFIRM_ACTION,
      action,
      $timeMs: 123,
      $roomId: 'room1'
    }],
    ['dispatch', {
      type: CLEAN_PRIVATE,
      $roomId: 'room1'
    }],
    ['sendToRoom', 'room1', {
      type: PATCH,
      confirmed: [],
      members: [],
      $timeMs: 123,
      $roomId: 'room1'
    }]
  ])
})
