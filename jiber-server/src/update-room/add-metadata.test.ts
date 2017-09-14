import { SERVER } from 'jiber-core'
import { addMetadata } from './add-metadata'
import { ServerState } from '../interfaces/server-state'

test('set $source to SERVER', () => {
  const state = {
    rooms: {
      room1: {
        members: {},
        confirmed: {},
        lastUpdatedAt: 0
      }
    },
    sockets: {},
    users: {}
  } as ServerState
  const action = {type: 'yay', $userId: 'link', $roomId: 'room1'}
  const metaAction = addMetadata(state, action)
  expect(metaAction.$source).toBe(SERVER)
})

test('add actionId', () => {
  const roomState = {
    rooms: {
      room2: {
        members: {zelda: {userId: 'zelda', actionId: 4}},
        confirmed: {},
        lastUpdatedAt: 0
      }
    },
    sockets: {},
    users: {}
  }
  const action = {type: 'yay', $userId: 'zelda', $roomId: 'room2'}
  const metaAction = addMetadata(roomState, action)
  expect(metaAction.$actionId).toBe(5)
})
