import { SERVER } from '../../core/index'
import { addMetadata } from './add-metadata'

test('set $source to SERVER', () => {
  const roomState = {
    members: {},
    confirmed: {},
    lastUpdatedAt: 0
  }
  const action = {type: 'yay', $userId: 'link'}
  const metaAction = addMetadata(roomState, action)
  expect(metaAction.$source).toBe(SERVER)
})

test('add actionId', () => {
  const roomState = {
    members: {zelda: {userId: 'zelda', actionId: 4}},
    confirmed: {},
    lastUpdatedAt: 0
  }
  const action = {type: 'yay', $userId: 'zelda'}
  const metaAction = addMetadata(roomState, action)
  expect(metaAction.$actionId).toBe(5)
})
