import createInjectMetadata from './inject-metadata'
import { Action, CLIENT, PEER } from '../../../core/index'

const state = {
  testRoom: {
    actionIds: {bob: 5},
    myUserId: 'bob'
  }
}
const getState = () => state
const injectMetadata = createInjectMetadata(getState)

test('actions with a string $hope metadata are upgraded', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  expect(injectMetadata(action).$hope.roomId).toEqual('testRoom')
})

test('myUserId is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  expect(injectMetadata(action).$hope.userId).toEqual('bob')
})

test('actionId is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  expect(injectMetadata(action).$hope.actionId).toEqual(6)
})

test('source is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  expect(injectMetadata(action).$hope.source).toEqual(CLIENT)
})

test('timeMs is added to the metadata', () => {
  const action: Action = {type: 'test', $hope: 'testRoom'}
  expect(injectMetadata(action).$hope.timeMs).toBeTruthy()
})

test('actions with existing metadata are not altered', () => {
  const action = {type: 'test', $hope: {roomId: 'testRoom', source: PEER}}
  expect(injectMetadata(action)).toEqual(action)
})
