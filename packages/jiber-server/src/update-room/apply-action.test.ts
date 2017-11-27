import { Action } from 'jiber-core'
import { applyAction } from './apply-action'

////////////////////////////////////////////////////////////////////////////////
// mocks
////////////////////////////////////////////////////////////////////////////////
let calls: any[]
const store: any = {
  getState: () => {
    return {
      rooms: {
        room1: {
          members: {
            jay: {
              actionId: 54
            }
          }
        }
      },
      users: {},
      sockets: {}
    }
  },
  socketServer: {
    sendToRoom: (roomId: string, action: Action) => {
      calls.push(['sendToRoom', roomId, action])
    }
  },
  dispatch: (action: Action) => {
    calls.push(['dispatch', action])
  }
}

////////////////////////////////////////////////////////////////////////////////
// setup
////////////////////////////////////////////////////////////////////////////////
beforeEach(() => calls = [])

////////////////////////////////////////////////////////////////////////////////
// tests
////////////////////////////////////////////////////////////////////////////////
test('apply an action and send it out to room members', () => {
  const action = { type: 'hi', $roomId: 'room1', $actionId: 55, $userId: 'jay' }
  applyAction(store, action)
  expect(calls).toEqual([
    ['sendToRoom', 'room1', action],
    ['dispatch', action]
  ])
})

test('do not apply an action if actionId is less than the last one', () => {
  const action = { type: 'hi', $roomId: 'room1', $actionId: 53, $userId: 'jay' }
  applyAction(store, action)
  expect(calls).toEqual([])
})
