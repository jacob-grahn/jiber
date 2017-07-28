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
  const action = {type: 'hi', $hope: {roomId: 'room1'}}
  applyAction(action)
  expect(calls).toEqual([
    ['dispatch', {type: CONFIRM_ACTION, action, $hope: {roomId: 'room1'}}],
    ['sendToRoom', 'room1', action]
  ])
})

test('private apply an action and send out a diff', () => {
  const action = {type: '$serverOnly/hi', $hope: {roomId: 'room1', timeMs: 123}}
  applyAction(action)
  expect(calls).toEqual([
    ['dispatch', {
      type: INJECT_PRIVATE,
      $hope: {roomId: 'room1'}
    }],
    ['dispatch', {
      type: CONFIRM_ACTION,
      action,
      $hope: {roomId: 'room1', timeMs: 123}
    }],
    ['dispatch', {
      type: CLEAN_PRIVATE,
      $hope: {roomId: 'room1'}
    }],
    ['sendToRoom', 'room1', {
      type: PATCH,
      confirmed: [],
      members: [],
      lastUpdatedAt: undefined,
      $hope: {roomId: 'room1'}
    }]
  ])
})
