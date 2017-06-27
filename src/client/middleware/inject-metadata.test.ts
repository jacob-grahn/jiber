import injectMetadata from './inject-metadata'
import { Action, CLIENT, PEER } from '../../core/index'

let lastAction: Action
const state = {
  me: {userId: 'bob'},
  rooms: {
    testRoom: {
      actionIds: {bob: 5}
    }
  }
}
const store = {
  dispatch: () => 'do nothing',
  getState: () => state,
  setMiddleware: () => 'do nothing'
}
const final = (action: Action) => lastAction = action
const inner = injectMetadata(store)(final)

test('actions with a string $hope metadata are upgraded', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  inner(action)
  expect(lastAction.$hope.roomId).toEqual('testRoom')
})

test('myUserId is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  inner(action)
  expect(lastAction.$hope.userId).toEqual('bob')
})

test('actionId is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  inner(action)
  expect(lastAction.$hope.actionId).toEqual(6)
})

test('source is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  inner(action)
  expect(lastAction.$hope.source).toEqual(CLIENT)
})

test('timeMs is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  inner(action)
  expect(lastAction.$hope.timeMs).toBeTruthy()
})

test('actions with existing metadata are not altered', () => {
  const action = {type: 'test', $hope: {roomId: 'testRoom', source: PEER}}
  inner(action)
  expect(lastAction).toEqual(action)
})
