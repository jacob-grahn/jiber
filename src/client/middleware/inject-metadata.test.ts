import { injectMetadata } from './inject-metadata'
import { Action } from '../../core/index'

let lastAction: Action
const state = {
  me: {userId: 'bob'},
  rooms: {
    testRoom: {
      members: {bob: {actionId: 5}}
    }
  }
}
const store = {
  dispatch: () => 'do nothing',
  getState: () => state,
  subscribe: () => () => 'do nothing'
}
const final = (action: Action) => lastAction = action
const inner = injectMetadata(store)(final)

test('$userId is added to the metadata', () => {
  const action: Action = {type: 'test', $roomId: 'testRoom'}
  inner(action)
  expect(lastAction.$userId).toEqual('bob')
})

test('actionId is added to the metadata', () => {
  const action: Action = {type: 'test', $roomId: 'testRoom'}
  inner(action)
  expect(lastAction.$actionId).toEqual(6)
})

test('timeMs is added to the metadata', () => {
  const action: Action = {type: 'test', $roomId: 'testRoom'}
  inner(action)
  expect(lastAction.$timeMs).toBeTruthy()
})

test('actions with existing metadata are not altered', () => {
  const action = {type: 'test', $roomId: 'testRoom', $actionId: 5}
  inner(action)
  expect(lastAction).toEqual(action)
})
